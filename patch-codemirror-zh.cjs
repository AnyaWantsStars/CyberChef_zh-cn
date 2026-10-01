// 汉化 @codemirror/search 查找替换面板文案（npm install 后自动执行，幂等）
// 原因：该库无官方 i18n，文案写死在 dist 字面量中，重装依赖会被覆盖，故用 postinstall 固化。
const fs = require("fs");
const path = require("path");

const targets = [
    "node_modules/@codemirror/search/dist/index.js",
    "node_modules/@codemirror/search/dist/index.cjs"
];

// 注意顺序：长串（replace all）必须在前，避免被短串（replace）先替换破坏。
const pairs = [
    ['phrase(view, "Find")', 'phrase(view, "查找")'],
    ['phrase(view, "Replace")', 'phrase(view, "替换")'],
    ['phrase(view, "replace all")', 'phrase(view, "全部替换")'],
    ['phrase(view, "next")', 'phrase(view, "下一个")'],
    ['phrase(view, "previous")', 'phrase(view, "上一个")'],
    ['phrase(view, "all")', 'phrase(view, "全部")'],
    ['phrase(view, "match case")', 'phrase(view, "区分大小写")'],
    ['phrase(view, "regexp")', 'phrase(view, "正则表达式")'],
    ['phrase(view, "by word")', 'phrase(view, "按词匹配")'],
    ['phrase(view, "replace")', 'phrase(view, "替换")'],
    ['phrase(view, "close")', 'phrase(view, "关闭")']
];

let anyChanged = false;
for (const rel of targets) {
    const abs = path.join(__dirname, rel);
    if (!fs.existsSync(abs)) {
        console.log("[codemirror-zh] skip (not found):", rel);
        continue;
    }
    let src = fs.readFileSync(abs, "utf8");
    let changed = false;
    for (const [from, to] of pairs) {
        if (src.includes(from)) {
            src = src.split(from).join(to);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(abs, src);
        anyChanged = true;
        console.log("[codemirror-zh] patched:", rel);
    } else {
        console.log("[codemirror-zh] already patched / no match:", rel);
    }
}
if (!anyChanged) {
    console.log("[codemirror-zh] done (nothing to patch)");
}
