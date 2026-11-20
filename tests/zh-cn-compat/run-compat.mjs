/**
 * zh-cn 流程（recipe）兼容性回归集
 *
 * 覆盖范围：
 *   A. 官方英文流程（recipe）URL 直接打开（解析 + 执行 + 期望输出）
 *   B. 中文流程（recipe）URL 直接打开
 *   C. 中英文流程（recipe）往返转换（结构等价 + 幂等）
 *   D. .chef 导入导出（Chef 格式字符串 <-> 流程配置（recipe config））
 *   E. URL hash 往返（config -> 分享链接 -> 解析 -> 执行）
 *   X. 操作名映射表一致性
 *
 * 运行方式（在项目根目录）：
 *   node tests/zh-cn-compat/run-compat.mjs
 *
 * 退出码：全部通过为 0，任一失败为 1。可直接接入 CI。
 */

import Utils from "../../src/core/Utils.mjs";
import Dish from "../../src/core/Dish.mjs";
import Chef from "../../src/core/Chef.mjs";
import RecipeCompatibility from "../../src/core/zh-cn/RecipeCompatibility.mjs";
import OperationNameMap from "../../src/core/zh-cn/OperationNameMap.json" with { type: "json" };

const BASE_URL = "https://anyawantsstars.github.io/CyberChef_zh-cn/";
const b64 = (s) => Buffer.from(s, "utf8").toString("base64");

let passed = 0;
let failed = 0;
const failures = [];

/**
 *
 */
async function check(label, fn) {
    try {
        await fn();
        passed++;
        console.log(`  PASS  ${label}`);
    } catch (e) {
        failed++;
        failures.push(`${label}: ${e.message}`);
        console.log(`  FAIL  ${label}: ${e.message}`);
    }
}

/** 解析 #recipe=...&input=... 形式的 URL hash，返回 { recipeConfig, input }。
 *  URLSearchParams 会自动解码百分号编码（%2B -> +、%27 -> ' 等），无需二次 decode。 */
function parseUrlHash(hashPart) {
    const params = new URLSearchParams(hashPart.replace(/^#/, ""));
    const recipeStr = params.get("recipe");
    const inputB64 = params.get("input") || "";
    return {
        recipeConfig: Utils.parseRecipeConfig(recipeStr),
        input: Buffer.from(inputB64, "base64").toString("utf8"),
    };
}

/** 模拟官方 generateStateUrl：recipeConfig -> #recipe=...&input=... */
function buildUrlHash(recipeConfig, input) {
    const en = RecipeCompatibility.toEnglish(recipeConfig);
    const recipeStr = Utils.generatePrettyRecipe(en);
    return `#recipe=${encodeURIComponent(recipeStr)}&input=${encodeURIComponent(b64(input))}`;
}

/** 用 web 端同款执行路径（先 toChinese 再 bake）执行流程（recipe），返回字符串输出 */
async function bake(input, recipeConfig) {
    const chef = new Chef();
    const zh = RecipeCompatibility.toChinese(recipeConfig);
    const resp = await chef.bake(input, zh, { returnType: Dish.STRING });
    if (resp.error) throw new Error(`bake 失败: ${resp.error.displayStr}`);
    return resp.result;
}

/** 断言两个 recipeConfig 结构等价 */
function assertConfigEqual(actual, expected, label) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) throw new Error(`${label}: 期望 ${e}，实际 ${a}`);
}

/**
 *
 */
async function main() {

    console.log("=== zh-cn 流程（recipe）兼容性回归集 ===");

// ---------- A. 官方英文流程（recipe）URL 直接打开 ----------
    console.log("\n[A] 官方英文流程（recipe）URL 直接打开");
    {
        const url = `${BASE_URL}#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=${b64("SGVsbG8gV29ybGQh")}`; // input 参数 = b64(页面输入)；页面输入为 base64 文本
        const hash = url.slice(url.indexOf("#"));
        await check("A1 From_Base64 URL（README demo）解析并执行", async () => {
            const { recipeConfig, input } = parseUrlHash(hash);
            assertConfigEqual(recipeConfig, [{ op: "From Base64", args: ["A-Za-z0-9+/=", true] }], "A1 解析");
            const out = await bake(input, recipeConfig);
            if (out !== "Hello World!") throw new Error(`期望 "Hello World!"，实际 ${JSON.stringify(out)}`);
        });
    }
    {
        const url = `${BASE_URL}#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=${b64("SGVsbG8gV29ybGQ=")}`;
        const hash = url.slice(url.indexOf("#"));
        await check("A2 官方英文 From_Base64 URL", async () => {
            const { recipeConfig, input } = parseUrlHash(hash);
            const out = await bake(input, recipeConfig);
            if (out !== "Hello World") throw new Error(`期望 "Hello World"，实际 ${JSON.stringify(out)}`);
        });
    }
    {
        const url = `${BASE_URL}#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)To_Hex()&input=${b64("SGVsbG8gV29ybGQ=")}`;
        const hash = url.slice(url.indexOf("#"));
        await check("A3 官方英文多操作链 URL (From_Base64 + To_Hex)", async () => {
            const { recipeConfig, input } = parseUrlHash(hash);
            assertConfigEqual(recipeConfig, [
                { op: "From Base64", args: ["A-Za-z0-9+/=", true] },
                { op: "To Hex", args: [] },
            ], "A3 解析");
            const out = await bake(input, recipeConfig);
            if (out !== "48 65 6c 6c 6f 20 57 6f 72 6c 64") throw new Error(`期望 hex（空格分隔），实际 ${JSON.stringify(out)}`);
        });
    }

// ---------- B. 中文流程（recipe）URL 直接打开 ----------
    console.log("\n[B] 中文流程（recipe）URL 直接打开");
    {
        const recipeStr = encodeURIComponent("解码 Base64()");
        const url = `${BASE_URL}#recipe=${recipeStr}&input=${b64("SGVsbG8gV29ybGQ=")}`;
        const hash = url.slice(url.indexOf("#"));
        await check("B1 中文流程（recipe）URL（无参数）", async () => {
            const { recipeConfig, input } = parseUrlHash(hash);
            assertConfigEqual(recipeConfig, [{ op: "解码 Base64", args: [] }], "B1 解析");
            const out = await bake(input, recipeConfig);
            if (out !== "Hello World") throw new Error(`期望 "Hello World"，实际 ${JSON.stringify(out)}`);
        });
    }
    {
        const recipeStr = encodeURIComponent("解码 Base64('A-Za-z0-9+/=',true)");
        const url = `${BASE_URL}#recipe=${recipeStr}&input=${b64("SGVsbG8gV29ybGQh")}`;
        const hash = url.slice(url.indexOf("#"));
        await check("B2 中文流程（recipe）URL（带参数，值保持英文）", async () => {
            const { recipeConfig, input } = parseUrlHash(hash);
            assertConfigEqual(recipeConfig, [{ op: "解码 Base64", args: ["A-Za-z0-9+/=", true] }], "B2 解析");
            const out = await bake(input, recipeConfig);
            if (out !== "Hello World!") throw new Error(`期望 "Hello World!"，实际 ${JSON.stringify(out)}`);
        });
    }

// ---------- C. 中英文流程（recipe）往返转换 ----------
    console.log("\n[C] 中英文流程（recipe）往返转换");
    await check("C1 英文 -> 中文 -> 英文 幂等", () => {
        const en = [{ op: "From Base64", args: ["A-Za-z0-9+/=", true] }];
        const zh = RecipeCompatibility.toChinese(en);
        assertConfigEqual(zh, [{ op: "解码 Base64", args: ["A-Za-z0-9+/=", true] }], "C1 中文化");
        assertConfigEqual(RecipeCompatibility.toEnglish(zh), en, "C1 还原");
    });
    await check("C2 中文 -> 英文 -> 中文 幂等", () => {
        const zh = [{ op: "解码 Base64", args: ["A-Za-z0-9+/=", true] }];
        const en = RecipeCompatibility.toEnglish(zh);
        assertConfigEqual(en, [{ op: "From Base64", args: ["A-Za-z0-9+/=", true] }], "C2 英文化");
        assertConfigEqual(RecipeCompatibility.toChinese(en), zh, "C2 还原");
    });
    await check("C3 中文参数值英文化（RecipeValueMap）", () => {
    // 中文参数值在导出/分享时转换为官方英文 value（option 枚举按英文 value 匹配，导入侧无需再还原）
        const zh = [{ op: "转换坐标格式", args: ["度分秒"] }];
        const en = RecipeCompatibility.toEnglish(zh);
        assertConfigEqual(en, [{ op: "Convert co-ordinate format", args: ["Degrees Minutes Seconds"] }], "C3 英文化参数值");
        const back = RecipeCompatibility.toChinese(en);
        if (back[0].op !== "转换坐标格式") throw new Error(`C3 操作名还原异常: ${back[0].op}`);
    });

// ---------- D. .chef 导入导出 ----------
    console.log("\n[D] .chef 导入导出（Chef 格式字符串 <-> recipe config）");
    await check("D1 英文 Chef 字符串导出 -> 导入等价并执行", async () => {
        const config = [{ op: "From Base64", args: ["A-Za-z0-9+/=", true] }];
        const chefStr = Utils.generatePrettyRecipe(config); // 导出（URL/紧凑形态）
        const reparsed = Utils.parseRecipeConfig(chefStr);  // 导入
        assertConfigEqual(reparsed, config, "D1 导入还原");
        const out = await bake("SGVsbG8gV29ybGQh", reparsed);
        if (out !== "Hello World!") throw new Error(`期望 "Hello World!"，实际 ${JSON.stringify(out)}`);
    });
    await check("D2 中文 Chef 字符串导入 -> 转英文导出 -> 执行", async () => {
        const zhChef = "解码 Base64('A-Za-z0-9+/=',true)";
        const zh = Utils.parseRecipeConfig(zhChef);
        const en = RecipeCompatibility.toEnglish(zh);
        const chefStr = Utils.generatePrettyRecipe(en);
        if (chefStr !== "From_Base64('A-Za-z0-9+/=',true)") throw new Error(`导出异常: ${chefStr}`);
        const reparsed = Utils.parseRecipeConfig(chefStr);
        const out = await bake("SGVsbG8gV29ybGQh", reparsed);
        if (out !== "Hello World!") throw new Error(`期望 "Hello World!"，实际 ${JSON.stringify(out)}`);
    });
    await check("D3 多行 pretty Chef 格式往返（保存面板形态）", () => {
        const config = [
            { op: "From Base64", args: ["A-Za-z0-9+/=", true] },
            { op: "To Hex", args: [] },
        ];
        const pretty = Utils.generatePrettyRecipe(config, true);
        if (!pretty.endsWith("\n")) throw new Error("pretty 格式应带换行");
        assertConfigEqual(Utils.parseRecipeConfig(pretty), config, "D3 导入还原");
    });

// ---------- E. URL hash 往返 ----------
    console.log("\n[E] URL hash 往返（config -> 分享链接 -> 解析 -> 执行）");
    await check("E1 英文 config -> URL hash -> 解析执行", async () => {
        const config = [{ op: "From Base64", args: ["A-Za-z0-9+/=", true] }];
        const hash = buildUrlHash(config, "SGVsbG8gV29ybGQh");
        const { recipeConfig, input } = parseUrlHash(hash);
        assertConfigEqual(recipeConfig, config, "E1 hash 解析");
        const out = await bake(input, recipeConfig);
        if (out !== "Hello World!") throw new Error(`期望 "Hello World!"，实际 ${JSON.stringify(out)}`);
    });
    await check("E2 中文 config -> 中文 URL hash -> 解析执行", async () => {
        const zhConfig = [{ op: "解码 Base64", args: [] }];
        const recipeStr = Utils.generatePrettyRecipe(zhConfig);
        const hash = `#recipe=${encodeURIComponent(recipeStr)}&input=${encodeURIComponent(b64("SGVsbG8gV29ybGQ="))}`;
        const { recipeConfig, input } = parseUrlHash(hash);
        assertConfigEqual(recipeConfig, zhConfig, "E2 hash 解析");
        const out = await bake(input, recipeConfig);
        if (out !== "Hello World") throw new Error(`期望 "Hello World"，实际 ${JSON.stringify(out)}`);
    });
    await check("E3 中文 URL hash 与英文 URL hash 指向相同结果", async () => {
        const zh = [{ op: "解码 Base64", args: ["A-Za-z0-9+/=", true] }];
        const zhHash = `#recipe=${encodeURIComponent(Utils.generatePrettyRecipe(zh))}&input=${encodeURIComponent(b64("SGVsbG8gV29ybGQh"))}`;
        const enHash = buildUrlHash(zh, "SGVsbG8gV29ybGQh"); // 模拟官方分享时先转英文
        const zhParsed = parseUrlHash(zhHash);
        const enParsed = parseUrlHash(enHash);
        const zhOut = await bake(zhParsed.input, zhParsed.recipeConfig);
        const enOut = await bake(enParsed.input, enParsed.recipeConfig);
        if (zhOut !== "Hello World!" || enOut !== "Hello World!") throw new Error(`输出不一致: zh=${zhOut} en=${enOut}`);
    });

// ---------- X. 映射表一致性 ----------
    console.log("\n[X] 操作名映射表一致性");
    await check("X1 OperationNameMap zh2en/en2zh 双向一致", () => {
        const zh2en = OperationNameMap.zh2en;
        const en2zh = OperationNameMap.en2zh;
        if (Object.keys(zh2en).length !== 506) throw new Error(`zh2en 数量 ${Object.keys(zh2en).length} != 506`);
        if (Object.keys(en2zh).length !== 506) throw new Error(`en2zh 数量 ${Object.keys(en2zh).length} != 506`);
        for (const [zh, en] of Object.entries(zh2en)) {
            if (en2zh[en] !== zh) throw new Error(`en2zh[${en}] 应为 ${zh}，实际 ${en2zh[en]}`);
        }
    });

    console.log(`\n===== 结果: 通过 ${passed} / 失败 ${failed} =====`);
    if (failures.length) {
        console.log("失败明细:");
        for (const f of failures) console.log("  -", f);
        process.exitCode = 1;
    }
}

main().catch((e) => {
    console.error(e); process.exitCode = 1;
});
