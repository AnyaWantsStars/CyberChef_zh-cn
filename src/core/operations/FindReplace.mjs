/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import XRegExp from "xregexp";

/**
 * Find / Replace operation
 */
class FindReplace extends Operation {

    /**
     * FindReplace constructor
     */
    constructor() {
        super();

        this.name = "查找 / 替换";
        this.module = "Regex";
        this.description = "将第一个字符串的所有出现替换为第二个字符串。<br><br>支持正则表达式（regex）、简单字符串和扩展字符串（扩展字符串支持 \\\\n、\\\\r、\\\\t、\\\\b、\\\\f 以及使用 \\\\x 表示法的转义十六进制字节，例如 \\\\x00 表示空字节）。";
        this.infoURL = "https://wikipedia.org/wiki/Regular_expression";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "查找",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Regex", "Extended (\\n, \\t, \\x...)", "Simple string"]
            },
            {
                "name": "替换",
                "type": "binaryString",
                "value": ""
            },
            {
                "name": "全局匹配",
                "type": "boolean",
                "value": true
            },
            {
                "name": "忽略大小写",
                "type": "boolean",
                "value": false
            },
            {
                "name": "多行匹配",
                "type": "boolean",
                "value": true
            },
            {
                "name": "点号匹配所有",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [{option: type}, replace, g, i, m, s] = args;
        let find = args[0].string,
            modifiers = "";

        if (g) modifiers += "g";
        if (i) modifiers += "i";
        if (m) modifiers += "m";
        if (s) modifiers += "s";

        if (type === "Regex") {
            find = new XRegExp(find, modifiers);
            return input.replace(find, replace);
        }

        if (type.indexOf("Extended") === 0) {
            find = Utils.parseEscapedChars(find);
        }

        find = new XRegExp(Utils.escapeRegex(find), modifiers);

        return input.replace(find, replace);
    }

}

export default FindReplace;
