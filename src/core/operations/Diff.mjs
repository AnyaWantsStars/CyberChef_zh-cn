/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import * as JsDiff from "diff";
import OperationError from "../errors/OperationError.mjs";

/**
 * Diff operation
 */
class Diff extends Operation {

    /**
     * Diff constructor
     */
    constructor() {
        super();

        this.name = "差异比较";
        this.module = "Diff";
        this.description = "比较两个输入（由指定的分隔符分隔），并高亮显示它们之间的差异。";
        this.infoURL = "https://wikipedia.org/wiki/File_comparison";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                "name": "样本分隔符", "type": "binaryString",
                "value": "\\n\\n"
            },
            {
                "name": "差异比较方式",
                "type": "option",
                "value": [
                    {name: "字符", value: "Character"},
                    {name: "单词", value: "Word"},
                    {name: "行", value: "Line"},
                    {name: "句子", value: "Sentence"},
                    {name: "CSS", value: "CSS"},
                    {name: "JSON", value: "JSON"}
                ]
            },
            {
                "name": "显示新增",
                "type": "boolean",
                "value": true
            },
            {
                "name": "显示移除",
                "type": "boolean",
                "value": true
            },
            {
                "name": "显示减法",
                "type": "boolean",
                "value": false
            },
            {
                "name": "忽略空白",
                "type": "boolean",
                "value": false,
                "hint": "适用于单词和行对比"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const [
                sampleDelim,
                diffBy,
                showAdded,
                showRemoved,
                showSubtraction,
                ignoreWhitespace
            ] = args,
            samples = input.split(sampleDelim);
        let output = "",
            diff;

        // Node and Webpack load modules slightly differently
        const jsdiff = JsDiff.default ? JsDiff.default : JsDiff;

        if (!samples || samples.length !== 2) {
            throw new OperationError("样本数量不正确，也许您需要修改样本分隔符或添加更多样本？");
        }

        switch (diffBy) {
            case "Character":
                diff = jsdiff.diffChars(samples[0], samples[1]);
                break;
            case "Word":
                if (ignoreWhitespace) {
                    diff = jsdiff.diffWords(samples[0], samples[1]);
                } else {
                    diff = jsdiff.diffWordsWithSpace(samples[0], samples[1]);
                }
                break;
            case "Line":
                if (ignoreWhitespace) {
                    diff = jsdiff.diffTrimmedLines(samples[0], samples[1]);
                } else {
                    diff = jsdiff.diffLines(samples[0], samples[1]);
                }
                break;
            case "Sentence":
                diff = jsdiff.diffSentences(samples[0], samples[1]);
                break;
            case "CSS":
                diff = jsdiff.diffCss(samples[0], samples[1]);
                break;
            case "JSON":
                diff = jsdiff.diffJson(samples[0], samples[1]);
                break;
            default:
                throw new OperationError("无效的“差异依据”选项。");
        }

        for (let i = 0; i < diff.length; i++) {
            if (diff[i].added) {
                if (showAdded) output += "<ins>" + Utils.escapeHtml(diff[i].value) + "</ins>";
            } else if (diff[i].removed) {
                if (showRemoved) output += "<del>" + Utils.escapeHtml(diff[i].value) + "</del>";
            } else if (!showSubtraction) {
                output += Utils.escapeHtml(diff[i].value);
            }
        }

        return output;
    }

}

export default Diff;
