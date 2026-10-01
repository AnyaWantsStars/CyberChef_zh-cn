/**
 * @author j83305 [awz22@protonmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { calculateParityBit, decodeParityBit } from "../lib/ParityBit.mjs";

/**
 * Parity Bit operation
 */
class ParityBit extends Operation {

    /**
     * ParityBit constructor
     */
    constructor() {
        super();

        this.name = "奇偶校验位";
        this.module = "Default";
        this.description = "奇偶校验位是最简单的错误检测形式。它是一个添加到比特串中的位，表示二进制字符串中 1 的个数是偶数还是奇数。<br><br>如果指定了分隔符，则将对输入数据的每个'块'执行奇偶校验位计算，其中块是通过在每个分隔符出现处切片输入来创建的。";
        this.infoURL = "https://wikipedia.org/wiki/Parity_bit";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "模式",
                type: "option",
                value: [{name: "偶校验", value: "Even Parity"}, {name: "奇校验", value: "Odd Parity"}]
            },
            {
                name: "位置",
                type: "option",
                value: [{name: "前置", value: "Prepend"}, {name: "后置", value: "Append"}]
            },
            {
                name: "编码或解码",
                type: "option",
                value: [{name: "编码", value: "Encode"}, {name: "解码", value: "Decode"}]
            },
            {
                name: "分隔符",
                type: "shortString",
                value: ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.length === 0) {
            return input;
        }
        /**
         * determines weather to use the encode or decode method based off args[2]
         * @param input input to be encoded or decoded
         * @param args array
         */
        const method = (input, args) => args[2] === "Encode" ? calculateParityBit(input, args) : decodeParityBit(input, args);
        if (args[3].length > 0) {
            const byteStrings = input.split(args[3]);
            for (let byteStringsArrayIndex = 0; byteStringsArrayIndex < byteStrings.length; byteStringsArrayIndex++) {
                byteStrings[byteStringsArrayIndex] = method(byteStrings[byteStringsArrayIndex], args);
            }
            return byteStrings.join(args[3]);
        }
        return method(input, args);
    }

    /**
     * Highlight Parity Bit
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[3].length === 0) {
            if (args[1] === "Prepend") {
                pos[0].start += 1;
                pos[0].end += 1;
            }
            return pos;
        }
        // need to be able to read input to do the highlighting when there is a delimiter
    }

    /**
     * Highlight Parity Bit in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[3].length === 0) {
            if (args[1] === "Prepend") {
                if (pos[0].start > 0) {
                    pos[0].start -= 1;
                }
                pos[0].end -= 1;
            }
            return pos;
        }
    }

}

export default ParityBit;
