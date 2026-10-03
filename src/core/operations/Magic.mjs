/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import Dish from "../Dish.mjs";
import MagicLib from "../lib/Magic.mjs";
import RecipeCompatibility from "../zh-cn/RecipeCompatibility.mjs";

/**
 * Magic operation
 */
class Magic extends Operation {

    /**
     * Magic constructor
     */
    constructor() {
        super();

        this.name = "Magic 检测";
        this.flowControl = true;
        this.module = "Default";
        this.description = "Magic 操作尝试检测输入数据的各种属性，并建议哪些操作可以帮助更好地理解数据。<br><br><b>选项</b><br><u>深度：</u>如果某个操作似乎匹配数据，它将运行并对结果进行进一步分析。此参数控制递归的最大层数。<br><br><u>深度模式：</u>开启后，各种操作如 XOR、位旋转和字符编码将被暴力尝试，以检测底层是否存在有效数据。为提高性能，仅对数据的前 100 字节进行暴力尝试。<br><br><u>扩展语言支持：</u>在每个阶段，数据的相对字节频率将与多种语言的平均频率进行比较。默认集包含约 40 种互联网上最常用的语言。扩展列表包含 284 种语言，如果字节频率相似，可能导致多种语言匹配数据。<br><br>可选地输入正则表达式以匹配您期望找到的字符串来过滤结果（crib）。";
        this.infoURL = "https://github.com/gchq/CyberChef/wiki/Automatic-detection-of-encoded-data-using-CyberChef-Magic";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                "name": "深度",
                "type": "number",
                "value": 3
            },
            {
                "name": "深度模式",
                "type": "boolean",
                "value": false
            },
            {
                "name": "扩展语言支持",
                "type": "boolean",
                "value": false
            },
            {
                "name": "Crib（已知明文字符串或正则）",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    async run(state) {
        const ings = state.opList[state.progress].ingValues,
            [depth, intensive, extLang, crib] = ings,
            dish = state.dish,
            magic = new MagicLib(await dish.get(Dish.ARRAY_BUFFER)),
            cribRegex = (crib && crib.length) ? new RegExp(crib, "i") : null;
        let options = await magic.speculativeExecution(depth, extLang, intensive, [], false, cribRegex);

        // Filter down to results which matched the crib
        if (cribRegex) {
            options = options.filter(option => option.matchesCrib);
        }

        // Record the current state for use when presenting
        this.state = state;

        dish.set(options, Dish.JSON);
        return state;
    }

    /**
     * Displays Magic results in HTML for web apps.
     *
     * @param {JSON} options
     * @returns {html}
     */
    present(options) {
        const currentRecipeConfig = this.state.opList.map(op => op.config);

        let output = `<table
                class='table table-hover table-sm table-bordered'
                style='table-layout: fixed;'>
            <tr>
                <th>流程（点击加载）</th>
                <th>结果片段</th>
                <th>属性</th>
            </tr>`;

        /**
         * Returns a CSS colour value based on an integer input.
         *
         * @param {number} val
         * @returns {string}
         */
        function chooseColour(val) {
            if (val < 3) return "green";
            if (val < 5) return "goldenrod";
            return "red";
        }

        options.forEach(option => {
            // Construct recipe URL
            // Replace this Magic op with the generated recipe
            const recipeConfig = currentRecipeConfig.slice(0, this.state.progress)
                    .concat(option.recipe)
                    .concat(currentRecipeConfig.slice(this.state.progress + 1)),
                recipeURL = "recipe=" + Utils.encodeURIFragment(Utils.generatePrettyRecipe(RecipeCompatibility.toEnglish(recipeConfig)));

            let language = "",
                fileType = "",
                matchingOps = "",
                useful = "";
            const entropy = `<span data-toggle="tooltip" data-container="body" title="香农熵的取值范围为 0 到 8。高熵表明数据可能已加密或压缩。普通文本通常在 3.5 到 5 之间。">熵: <span style="color: ${chooseColour(option.entropy)}">${option.entropy.toFixed(2)}</span></span>`,
                validUTF8 = option.isUTF8 ? "<span data-toggle='tooltip' data-container='body' title='根据编码，数据可能是有效的 UTF8 字符串。'>有效的 UTF8</span>\n" : "";

            if (option.languageScores[0].probability > 0) {
                let likelyLangs = option.languageScores.filter(l => l.probability > 0);
                if (likelyLangs.length < 1) likelyLangs = [option.languageScores[0]];
                language = "<span data-toggle='tooltip' data-container='body' title='基于多种语言字节频率的统计比较，按可能性排序。'>" +
                    "可能的语言：\n    " +
                    likelyLangs.map(lang => {
                        return MagicLib.codeToLanguage(lang.lang);
                    }).join("\n    ") +
                    "</span>\n";
            }

            if (option.fileType) {
                fileType = `<span data-toggle="tooltip" data-container="body" title="基于魔数的存在。">文件类型： ${option.fileType.mime} (${option.fileType.ext})</span>\n`;
            }

            if (option.matchingOps.length) {
                matchingOps = `匹配的操作： ${[...new Set(option.matchingOps.map(op => op.op))].join(", ")}\n`;
            }

            if (option.useful) {
                useful = "<span data-toggle='tooltip' data-container='body' title='这可能是一个以有用方式显示数据的操作，例如渲染图像。'>检测到有用操作</span>\n";
            }

            output += `<tr>
                <td><a href="#${recipeURL}">${Utils.generatePrettyRecipe(option.recipe, true)}</a></td>
                <td>${Utils.escapeHtml(Utils.escapeWhitespace(Utils.truncate(option.data, 99)))}</td>
                <td>${language}${fileType}${matchingOps}${useful}${validUTF8}${entropy}</td>
            </tr>`;
        });

        output += "</table><script type='application/javascript'>$('[data-toggle=\"tooltip\"]').tooltip()</script>";

        if (!options.length) {
            output = "未检测到输入数据的相关信息。\n您是否尝试过修改操作参数？";
        }

        return output;
    }

}

export default Magic;
