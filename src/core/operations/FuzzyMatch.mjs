/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {fuzzyMatch, calcMatchRanges, DEFAULT_WEIGHTS} from "../lib/FuzzyMatch.mjs";
import Utils from "../Utils.mjs";

/**
 * Fuzzy Match operation
 */
class FuzzyMatch extends Operation {

    /**
     * FuzzyMatch constructor
     */
    constructor() {
        super();

        this.name = "模糊匹配";
        this.module = "Default";
        this.description = "基于加权标准进行模糊搜索，在输入中查找模式。<br><br>例如：搜索 <code>dpan</code> 将匹配 <code><b>D</b>on't <b>Pan</b>ic</code>";
        this.infoURL = "https://wikipedia.org/wiki/Fuzzy_matching_(computer-assisted_translation)";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                name: "搜索",
                type: "binaryString",
                value: ""
            },
            {
                name: "顺序加分",
                type: "number",
                value: DEFAULT_WEIGHTS.sequentialBonus,
                hint: "相邻匹配加分"
            },
            {
                name: "分隔符加分",
                type: "number",
                value: DEFAULT_WEIGHTS.separatorBonus,
                hint: "分隔符之后匹配加分"
            },
            {
                name: "驼峰加分",
                type: "number",
                value: DEFAULT_WEIGHTS.camelBonus,
                hint: "匹配为大写且前一字符为小写时加分"
            },
            {
                name: "首字母加分",
                type: "number",
                value: DEFAULT_WEIGHTS.firstLetterBonus,
                hint: "首字母匹配加分"
            },
            {
                name: "前导字母扣分",
                type: "number",
                value: DEFAULT_WEIGHTS.leadingLetterPenalty,
                hint: "首个匹配之前，输入中每个字母扣分"
            },
            {
                name: "最大前导字母扣分",
                type: "number",
                value: DEFAULT_WEIGHTS.maxLeadingLetterPenalty,
                hint: "前导字母的最大扣分"
            },
            {
                name: "不匹配字母扣分",
                type: "number",
                value: DEFAULT_WEIGHTS.unmatchedLetterPenalty
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const searchStr = args[0];
        const weights = {
            sequentialBonus: args[1],
            separatorBonus: args[2],
            camelBonus: args[3],
            firstLetterBonus: args[4],
            leadingLetterPenalty: args[5],
            maxLeadingLetterPenalty: args[6],
            unmatchedLetterPenalty: args[7]
        };
        const matches = fuzzyMatch(searchStr, input, true, weights);

        if (!matches) {
            return "无匹配结果。";
        }

        let result = "", pos = 0, hlClass = "hl1";
        matches.forEach(([matches, score, idxs]) => {
            const matchRanges = calcMatchRanges(idxs);

            matchRanges.forEach(([start, length], i) => {
                result += Utils.escapeHtml(input.slice(pos, start));
                if (i === 0) result += `<span class="${hlClass}">`;
                pos = start + length;
                result += `<b>${Utils.escapeHtml(input.slice(start, pos))}</b>`;
            });
            result += "</span>";
            hlClass = hlClass === "hl1" ? "hl2" : "hl1";
        });

        result += Utils.escapeHtml(input.slice(pos, input.length));

        return result;
    }

}

export default FuzzyMatch;
