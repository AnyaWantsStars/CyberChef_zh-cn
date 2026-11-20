#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
发布物可核验脚本
========================
对 build/prod 的发布产物做三方版本戳一致性核验：
  1. zip 的 sha256 与 sha256digest.txt 是否匹配（重新计算比对）
  2. zip 内 assets/main.js 与单文件 html（同源于 index.html）中的版本字符串
  3. build/prod/index.html.gz（gzip）中的版本字符串
  4. package.json 的 version / zhVersion 与 README 版本说明的一致性

用法（在项目根目录）：
  python tests/zh-cn-compat/verify-release.py [project_root]
  默认 project_root 为脚本所在目录的上一级（即项目根）。

退出码：全部一致为 0，任一不一致为 1。
"""

import gzip
import hashlib
import io
import json
import os
import re
import sys
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(ROOT))
PROD = os.path.join(PROJECT, "build", "prod")

pkg = json.load(open(os.path.join(PROJECT, "package.json"), encoding="utf-8"))
pkg_ver = str(pkg.get("version", ""))
zh_ver = str(pkg.get("zhVersion", ""))

failures = []
notes = []


def check(desc, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {desc}" + (f" — {detail}" if detail else ""))
    if not ok:
        failures.append(desc)


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


print(f"=== 发布物核验: {PROJECT} ===")

# 1) 定位产物
zips = [f for f in os.listdir(PROD) if f.endswith(".zip")]
if len(zips) != 1:
    check("build/prod 存在且唯一 zip", False, f"实际: {zips}")
    sys.exit(1)
zip_path = os.path.join(PROD, zips[0])
check("定位发布 zip", True, os.path.basename(zip_path))

digest_path = os.path.join(PROD, "sha256digest.txt")
if not os.path.isfile(digest_path):
    check("sha256digest.txt 存在", False)
    sys.exit(1)
stored = open(digest_path, encoding="utf-8").read().strip().split()[0].lower()

# 2) zip sha256 比对
actual = sha256_of(zip_path)
check("zip sha256 与 sha256digest.txt 匹配", actual == stored,
      f"期望 {stored}，实际 {actual}")

# 3) zip 内部版本戳
with zipfile.ZipFile(zip_path) as z:
    names = z.namelist()
    mainjs = [n for n in names if n.endswith("assets/main.js")]
    check("zip 内 assets/main.js 存在", bool(mainjs), f"匹配: {mainjs}")
    html_in_zip = [n for n in names if n.endswith(".html") and "CyberChef" in n]
    check("zip 内单文件 html 存在", bool(html_in_zip), f"匹配: {html_in_zip}")

    mainjs_text = ""
    if mainjs:
        try:
            mainjs_text = z.read(mainjs[0]).decode("utf-8", errors="ignore")
        except Exception as e:  # noqa: BLE001
            check("读取 assets/main.js", False, str(e))
        for key in [pkg_ver, "zh-cn"]:
            check(f"assets/main.js 含版本串 {key}",
                  bool(re.search(re.escape(key), mainjs_text, re.IGNORECASE)),
                  "命中" if re.search(re.escape(key), mainjs_text, re.IGNORECASE) else "未命中")
        if re.search(re.escape(zh_ver), mainjs_text, re.IGNORECASE):
            check(f"assets/main.js 含版本串 {zh_ver}", True, "命中")
        else:
            notes.append(f"assets/main.js 不含 {zh_ver}（zhVersion 注入位置在 html 模板，main.js 只含上游版本串）—— 属正常设计")

    if html_in_zip:
        html_text = z.read(html_in_zip[0]).decode("utf-8", errors="ignore")
        for key in [f"v{pkg_ver}", zh_ver]:
            check(f"zip 单文件 html 含版本串 {key}",
                  bool(re.search(re.escape(key), html_text, re.IGNORECASE)),
                  "命中" if re.search(re.escape(key), html_text, re.IGNORECASE) else "未命中")

# 4) build/prod/index.html.gz 版本戳
gz_path = os.path.join(PROD, "index.html.gz")
if os.path.isfile(gz_path):
    try:
        with gzip.open(gz_path, "rb") as f:
            gz_text = f.read().decode("utf-8", errors="ignore")
        for key in [f"v{pkg_ver}", zh_ver]:
            check(f"index.html.gz 含版本串 {key}",
                  bool(re.search(re.escape(key), gz_text, re.IGNORECASE)),
                  "命中" if re.search(re.escape(key), gz_text, re.IGNORECASE) else "未命中")
    except Exception as e:  # noqa: BLE001
        check("读取 index.html.gz", False, str(e))
else:
    notes.append("build/prod/index.html.gz 不存在，跳过 gzip 检查")

# 5) package.json 与 README 一致性
check("package.json version 为 semver", bool(re.fullmatch(r"\d+\.\d+\.\d+", pkg_ver)), f"实际 {pkg_ver}")
check("package.json zhVersion 格式正确",
      bool(re.fullmatch(r"v\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?", zh_ver)), f"实际 {zh_ver}")
check("zip 文件名与版本一致", f"CyberChef_v{pkg_ver}_zh-cn_{zh_ver}.zip" == zips[0],
      f"文件名 {zips[0]}，期望 CyberChef_v{pkg_ver}_zh-cn_{zh_ver}.zip（上游版本带 v 前缀）")

readme = open(os.path.join(PROJECT, "README.md"), encoding="utf-8").read()
for key in [pkg_ver, zh_ver, "CyberChef_v<上游版本>_zh-cn_<汉化版本>.zip"]:
    check(f"README 含版本说明 {key}",
          bool(re.search(re.escape(key), readme)),
          "命中" if re.search(re.escape(key), readme) else "未命中")

print()
print("=== 核验结论 ===")
if notes:
    for n in notes:
        print("  note:", n)
if failures:
    print(f"不一致项 {len(failures)} 个:")
    for f in failures:
        print("  -", f)
    sys.exit(1)
print("全部一致（zip sha256 / zip 内版本戳 / index.html.gz / package.json / README）。")
