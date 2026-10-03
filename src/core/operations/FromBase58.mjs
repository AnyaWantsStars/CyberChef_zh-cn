/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import {ALPHABET_OPTIONS} from "../lib/Base58.mjs";

/**
 * From Base58 operation
 */
class FromBase58 extends Operation {

    /**
     * FromBase58 constructor
     */
    constructor() {
        super();

        this.name = "解码 Base58";
        this.module = "Default";
        this.description = "Base58（类似于 Base64）是一种编码任意字节数据的表示法。它与 Base64 的不同之处在于移除了容易误读的字符（即 l、I、0 和 O）以提高人类可读性。<br><br>此操作将 ASCII 字符串（使用您选择的字母表，包含预设）解码回其原始形式。<br><br>例如：<code>StV1DL6CwTryKyV</code> 变为 <code>hello world</code><br><br>Base58 常用于加密货币（Bitcoin、Ripple 等）。";
        this.infoURL = "https://wikipedia.org/wiki/Base58";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "字符集", "type": "editableOption",
                "value": ALPHABET_OPTIONS
            },
            {
                "name": "移除非字符集字符", "type": "boolean",
                "value": true
            }
        ];
        this.checks = [
            {
                pattern: "^[1-9A-HJ-NP-Za-km-z]{20,}$",
                flags: "",
                args: ["123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", false]
            },
            {
                pattern: "^[1-9A-HJ-NP-Za-km-z]{20,}$",
                flags: "",
                args: ["rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz", false]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        let alphabet = args[0] || ALPHABET_OPTIONS[0].value;
        const removeNonAlphaChars = args[1] === undefined ? true : args[1],
            result = [];

        alphabet = Utils.expandAlphRange(alphabet).join("");

        if (alphabet.length !== 58 ||
            [].unique.call(alphabet).length !== 58) {
            throw new OperationError("字符集长度必须为 58");
        }

        if (input.length === 0) return [];

        let zeroPrefix = 0;
        for (let i = 0; i < input.length && input[i] === alphabet[0]; i++) {
            zeroPrefix++;
        }

        [].forEach.call(input, function(c, charIndex) {
            const index = alphabet.indexOf(c);

            if (index === -1) {
                if (removeNonAlphaChars) {
                    return;
                } else {
                    throw new OperationError(`位置 ${charIndex} 的字符 '${c}' 不在字母表中`);
                }
            }

            let carry = index;

            for (let i = 0; i < result.length; i++) {
                carry += result[i] * 58;
                result[i] = carry & 0xFF;
                carry = carry >> 8;
            }

            while (carry > 0) {
                result.push(carry & 0xFF);
                carry = carry >> 8;
            }
        });

        while (zeroPrefix--) {
            result.push(0);
        }

        return result.reverse();
    }

}

export default FromBase58;
