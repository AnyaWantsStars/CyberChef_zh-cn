/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {BIN_DELIM_OPTIONS} from "../lib/Delim.mjs";
import {fromBinary} from "../lib/Binary.mjs";

/**
 * From Binary operation
 */
class FromBinary extends Operation {

    /**
     * FromBinary constructor
     */
    constructor() {
        super();

        this.name = "解码二进制";
        this.module = "Default";
        this.description = "将二进制字符串转换回其原始形式。<br><br>例如：<code>01001000 01101001</code> 变为 <code>Hi</code>";
        this.infoURL = "https://wikipedia.org/wiki/Binary_code";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "分隔符", "type": "option",
                "value": BIN_DELIM_OPTIONS
            },
            {
                "name": "字节长度",
                "type": "number",
                "value": 8,
                "min": 1
            }
        ];
        this.checks = [
            {
                pattern: "^(?:[01]{8})+$",
                flags: "",
                args: ["None"]
            },
            {
                pattern: "^(?:[01]{8})(?: [01]{8})*$",
                flags: "",
                args: ["Space"]
            },
            {
                pattern: "^(?:[01]{8})(?:,[01]{8})*$",
                flags: "",
                args: ["Comma"]
            },
            {
                pattern: "^(?:[01]{8})(?:;[01]{8})*$",
                flags: "",
                args: ["Semi-colon"]
            },
            {
                pattern: "^(?:[01]{8})(?::[01]{8})*$",
                flags: "",
                args: ["Colon"]
            },
            {
                pattern: "^(?:[01]{8})(?:\\n[01]{8})*$",
                flags: "",
                args: ["Line feed"]
            },
            {
                pattern: "^(?:[01]{8})(?:\\r\\n[01]{8})*$",
                flags: "",
                args: ["CRLF"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const byteLen = args[1] ? args[1] : 8;
        return fromBinary(input, args[0], byteLen);
    }

    /**
     * Highlight From Binary
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        const delim = Utils.charRep(args[0] || "空格");
        pos[0].start = pos[0].start === 0 ? 0 : Math.floor(pos[0].start / (8 + delim.length));
        pos[0].end = pos[0].end === 0 ? 0 : Math.ceil(pos[0].end / (8 + delim.length));
        return pos;
    }

    /**
     * Highlight From Binary in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        const delim = Utils.charRep(args[0] || "空格");
        pos[0].start = pos[0].start * (8 + delim.length);
        pos[0].end = pos[0].end * (8 + delim.length) - delim.length;
        return pos;
    }

}

export default FromBinary;
