/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Vigenère Encode operation
 */
class VigenèreEncode extends Operation {

    /**
     * VigenèreEncode constructor
     */
    constructor() {
        super();

        this.name = "Vigenère 编码";
        this.module = "Ciphers";
        this.description = "维吉尼亚密码是一种通过使用基于关键字字母的一系列不同凯撒密码来加密字母文本的方法。它是一种简单的多表替换密码形式。";
        this.infoURL = "https://wikipedia.org/wiki/Vigenère_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥", "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz",
            key = args[0].toLowerCase();
        let output = "",
            fail = 0,
            keyIndex,
            msgIndex,
            chr;

        if (!key) throw new OperationError("未输入密钥");
        if (!/^[a-zA-Z]+$/.test(key)) throw new OperationError("密钥必须仅由字母组成");

        for (let i = 0; i < input.length; i++) {
            if (alphabet.indexOf(input[i]) >= 0) {
                // Get the corresponding character of key for the current letter, accounting
                // for chars not in alphabet
                chr = key[(i - fail) % key.length];
                // Get the location in the vigenere square of the key char
                keyIndex = alphabet.indexOf(chr);
                // Get the location in the vigenere square of the message char
                msgIndex = alphabet.indexOf(input[i]);
                // Get the encoded letter by finding the sum of indexes modulo 26 and finding
                // the letter corresponding to that
                output += alphabet[(keyIndex + msgIndex) % 26];
            } else if (alphabet.indexOf(input[i].toLowerCase()) >= 0) {
                chr = key[(i - fail) % key.length].toLowerCase();
                keyIndex = alphabet.indexOf(chr);
                msgIndex = alphabet.indexOf(input[i].toLowerCase());
                output += alphabet[(keyIndex + msgIndex) % 26].toUpperCase();
            } else {
                output += input[i];
                fail++;
            }
        }

        return output;
    }

    /**
     * Highlight Vigenère Encode
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight Vigenère Encode in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default VigenèreEncode;
