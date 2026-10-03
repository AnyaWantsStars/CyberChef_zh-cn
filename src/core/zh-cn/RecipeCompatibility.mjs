/**
 * 中英双语流程适配层（zh-cn 发行版专用，官方上游无此模块）
 *
 * 职责：在不改动界面显示的前提下，实现流程（recipe）在中文版与官方英文版
 * 之间的双向互通：
 *   - 导出（保存 / 分享 / URL 显示）：中文流程配置 → 英文流程配置
 *   - 导入（URL / 粘贴文本 / 本地存储 / Magic 建议）：英文或中文流程配置 → 中文流程配置
 *
 * 依赖两张映射表：
 *   - OperationNameMap.json 操作名中英对照（zh2en / en2zh）
 *   - RecipeValueMap.json   操作参数（option/populate 字符串值）中英对照
 *
 * 设计原则：转换对源配置做深拷贝，绝不修改界面层使用的原始对象。
 */

import OperationNameMap from "./OperationNameMap.json" with { type: "json" };
import RecipeValueMap from "./RecipeValueMap.json" with { type: "json" };

const zh2enOp = OperationNameMap.zh2en || {};
const en2zhOp = OperationNameMap.en2zh || {};

/**
 * 预构建各操作参数值的中英双向映射。
 * 仅对字符串形态（option / populate 的 name）生效；对象形态的值（如 toggleString）
 * 在中文版中本就保留英文，无需转换。
 *
 * @returns {Object.<string, {zh2en: Object, en2zh: Object}>}
 */
function buildValueMaps() {
    const maps = {};
    for (const [opName, meta] of Object.entries(RecipeValueMap.ops || {})) {
        const argMaps = {};
        for (const [argIdx, argMeta] of Object.entries(meta.args || {})) {
            const zh2en = argMeta.strZh2en || {};
            const en2zh = {};
            for (const [zh, en] of Object.entries(zh2en)) {
                // 若多个中文映射到同一英文，后写覆盖，取最后一次（不应发生）
                en2zh[en] = zh;
            }
            argMaps[argIdx] = { zh2en, en2zh };
        }
        maps[opName] = argMaps;
    }
    return maps;
}

const valueMaps = buildValueMaps();

/**
 * 中英双语流程适配层。
 */
export default class RecipeCompatibility {

    /**
     * 将中文流程配置转换为英文（官方）流程配置。
     * 操作名经 OperationNameMap 转换；option/populate 字符串值经 RecipeValueMap 转换。
     * 幂等：对已是英文的配置不做任何改动。
     *
     * @param {Object[]} recipeConfig - 中文流程配置
     * @returns {Object[]} 英文流程配置（新对象，原配置不受影响）
     */
    static toEnglish(recipeConfig) {
        if (!Array.isArray(recipeConfig)) return recipeConfig;
        return recipeConfig.map(op => {
            const newOp = { ...op, op: zh2enOp[op.op] || op.op };
            newOp.args = RecipeCompatibility._convertArgs(op.op, op.args, "zh2en");
            return newOp;
        });
    }

    /**
     * 将英文（或中文）流程配置转换为中文流程配置。
     * 操作名经 OperationNameMap 反查；option 值经映射表反查。
     * 幂等：对已是中文的配置不做任何改动（中文名 / 中文值原样保留）。
     *
     * @param {Object[]} recipeConfig - 英文或中文流程配置
     * @returns {Object[]} 中文流程配置（新对象，原配置不受影响）
     */
    static toChinese(recipeConfig) {
        if (!Array.isArray(recipeConfig)) return recipeConfig;
        return recipeConfig.map(op => {
            const newOp = { ...op, op: en2zhOp[op.op] || op.op };
            newOp.args = RecipeCompatibility._convertArgs(op.op, op.args, "en2zh");
            return newOp;
        });
    }

    /**
     * 按映射方向转换参数值。
     *
     * @private
     * @param {string} zhOpName - 中文操作名（用于查映射表）
     * @param {Object[]} args - 原始参数值数组
     * @param {"zh2en"|"en2zh"} direction - 转换方向
     * @returns {Object[]} 转换后的参数值数组（深拷贝）
     */
    static _convertArgs(zhOpName, args, direction) {
        if (!Array.isArray(args)) return args;
        const opValueMaps = valueMaps[zhOpName];
        if (!opValueMaps) return [...args];

        return args.map((value, idx) => {
            const argMap = opValueMaps[String(idx)];
            if (!argMap) return value;
            const table = argMap[direction];
            if (typeof value === "string") {
                return table[value] !== undefined ? table[value] : value;
            }
            return value;
        });
    }

    /**
     * 将单个操作名转换为英文（不存在映射时返回原值）。
     *
     * @param {string} opName - 操作名
     * @returns {string}
     */
    static opNameToEnglish(opName) {
        return zh2enOp[opName] || opName;
    }

    /**
     * 将单个操作名转换为中文（不存在映射时返回原值）。
     *
     * @param {string} opName - 操作名
     * @returns {string}
     */
    static opNameToChinese(opName) {
        return en2zhOp[opName] || opName;
    }

    /**
     * 判断给定操作名在中文版配置中是否存在。
     * 兜底场景：外部英文流程经解析后，若漏过适配层转换而直接进入流程对象，
     * 用此方法将英文操作名转换为中文名，避免 OperationConfig 查表崩溃。
     *
     * @param {string} opName - 操作名（可能为中文或英文）
     * @returns {string} 可在 OperationConfig 中查到的中文操作名
     */
    static resolveOperationName(opName) {
        return en2zhOp[opName] || opName;
    }

    /**
     * 将第三方库（node-forge 等）抛出的英文错误消息翻译为中文。
     * 翻译表覆盖 forge cipher/cipherModes 的常见校验错误；未命中的原样返回。
     *
     * @param {string} msg - 原始错误消息
     * @returns {string} 翻译后的错误消息
     */
    static translateErrorMessage(msg) {
        if (typeof msg !== "string") return msg;
        const rules = [
            [/^Invalid IV parameter\.$/, "IV 参数无效。"],
            [/^Invalid key parameter\.$/, "密钥参数无效。"],
            [/^Authentication tag does not match tag length\.$/, "认证标签与标签长度不匹配。"],
            [/^Unsupported algorithm: (.+)$/, "不支持的算法：$1"],
            [/^Invalid IV length; got (\d+) bytes and expected (\d+) bytes\.$/, "IV 长度无效：当前 $1 字节，应为 $2 字节。"],
        ];
        for (const [re, zh] of rules) {
            if (re.test(msg)) return msg.replace(re, zh);
        }
        return msg;
    }

}
