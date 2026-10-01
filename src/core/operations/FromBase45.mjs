/**
 * @author Thomas Weißschuh [thomas@t-8ch.de]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import {ALPHABET, highlightToBase45, highlightFromBase45} from "../lib/Base45.mjs";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";


/**
 * From Base45 operation
 */
class FromBase45 extends Operation {

    /**
     * FromBase45 constructor
     */
    constructor() {
        super();

        this.name = "解码 Base45";
        this.module = "Default";
        this.description = "Base45 是一种使用有限的符号集来编码任意字节数据的表示法，便于人类使用和计算机处理。较高的进制基数使得结果字符串比十进制或十六进制更短。Base45 针对二维码使用进行了优化。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_numeral_systems";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "字符集",
                type: "string",
                value: ALPHABET
            },
            {
                name: "移除非字符集字符",
                type: "boolean",
                value: true
            },
        ];

        this.highlight = highlightFromBase45;
        this.highlightReverse = highlightToBase45;
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        if (!input) return [];
        const alphabet = Utils.expandAlphRange(args[0]).join("");
        const removeNonAlphChars = args[1];

        const res = [];

        // Remove non-alphabet characters
        if (removeNonAlphChars) {
            const re = new RegExp("[^" + alphabet.replace(/[[\]\\\-^$]/g, "\\$&") + "]", "g");
            input = input.replace(re, "");
        }

        for (const triple of Utils.chunked(input, 3)) {
            triple.reverse();
            let b = 0;
            for (const c of triple) {
                const idx = alphabet.indexOf(c);
                if (idx === -1) {
                    throw new OperationError(`字符不在字母表中：'${c}'`);
                }
                b *= 45;
                b += idx;
            }

            if (b > 65535) {
                throw new OperationError(`三元组过大：'${triple.join("")}'`);
            }

            if (triple.length > 2) {
                /**
                 * The last triple may only have 2 bytes so we push the MSB when we got 3 bytes
                 * Pushing MSB
                 */
                res.push(b >> 8);
            }

            /**
             * Pushing LSB
             */
            res.push(b & 0xff);

        }

        return res;
    }

}

export default FromBase45;
