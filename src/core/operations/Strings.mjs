/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import XRegExp from "xregexp";
import { search } from "../lib/Extract.mjs";
import { caseInsensitiveSort } from "../lib/Sort.mjs";

/**
 * Strings operation
 */
class Strings extends Operation {

    /**
     * Strings constructor
     */
    constructor() {
        super();

        this.name = "提取字符串";;
        this.module = "Regex";
        this.description = "从输入中提取所有字符串。";
        this.infoURL = "https://wikipedia.org/wiki/Strings_(Unix)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "编码",
                type: "option",
                value: [{name: "单字节", value: "Single byte"}, {name: "16 位小端序", value: "16-bit littleendian"}, {name: "16 位大端序", value: "16-bit bigendian"}, {name: "全部", value: "All"}]
            },
            {
                name: "最小长度",
                type: "number",
                value: 4
            },
            {
                name: "匹配",
                type: "option",
                value: [
                    "[ASCII]", {"name": "字母数字+标点 (A)", "value": "Alphanumeric + punctuation (A)"},
                    {name: "所有可打印字符(A)", value: "All printable chars (A)"},
                    {name: "空终止字符串(A)", value: "Null-terminated strings (A)"},
                    "[Unicode]", {"name": "字母数字+标点 (U)", "value": "Alphanumeric + punctuation (U)"}, {"name": "所有可打印字符 (U)", "value": "All printable chars (U)"}, {"name": "空终止字符串 (U)", "value": "Null-terminated strings (U)"}
                ]
            },
            {
                name: "显示总计",
                type: "boolean",
                value: false
            },
            {
                name: "排序",
                type: "boolean",
                value: false
            },
            {
                name: "去重",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [encoding, minLen, matchType, displayTotal, sort, unique] = args,
            alphanumeric = "A-Z\\d",
            punctuation = "/\\-:.,_$%'\"()<>= !\\[\\]{}@",
            printable = "\x20-\x7e",
            uniAlphanumeric = "\\pL\\pN",
            uniPunctuation = "\\pP\\pZ",
            uniPrintable = "\\pL\\pM\\pZ\\pS\\pN\\pP";

        let strings = "";

        switch (matchType) {
            case "Alphanumeric + punctuation (A)":
                strings = `[${alphanumeric + punctuation}]`;
                break;
            case "All printable chars (A)":
            case "Null-terminated strings (A)":
                strings = `[${printable}]`;
                break;
            case "Alphanumeric + punctuation (U)":
                strings = `[${uniAlphanumeric + uniPunctuation}]`;
                break;
            case "All printable chars (U)":
            case "Null-terminated strings (U)":
                strings = `[${uniPrintable}]`;
                break;
        }

        // UTF-16 support is hacked in by allowing null bytes on either side of the matched chars
        switch (encoding) {
            case "All":
                strings = `(\x00?${strings}\x00?)`;
                break;
            case "16-bit littleendian":
                strings = `(${strings}\x00)`;
                break;
            case "16-bit bigendian":
                strings = `(\x00${strings})`;
                break;
            case "Single byte":
            default:
                break;
        }

        strings = `${strings}{${minLen},}`;

        if (matchType.includes("Null-terminated")) {
            strings += "\x00";
        }

        const regex = new XRegExp(strings, "ig");
        const results = search(
            input,
            regex,
            null,
            sort ? caseInsensitiveSort : null,
            unique
        );

        if (displayTotal) {
            return `共找到: ${results.length}\n\n${results.join("\n")}`;
        } else {
            return results.join("\n");
        }
    }

}

export default Strings;
