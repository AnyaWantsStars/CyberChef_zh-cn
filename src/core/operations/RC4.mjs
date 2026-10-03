/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import CryptoJS from "crypto-js";
import { format } from "../lib/Ciphers.mjs";

/**
 * RC4 operation
 */
class RC4 extends Operation {

    /**
     * RC4 constructor
     */
    constructor() {
        super();

        this.name = "RC4";
        this.module = "Ciphers";
        this.description = "RC4（也称为 ARC4）是 Ron Rivest 设计的广泛使用的流密码。它被用于 SSL 和 WEP 等流行协议中。尽管以其简洁和速度著称，但该算法的历史并不令人对其安全性充满信心。";
        this.infoURL = "https://wikipedia.org/wiki/RC4";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密码短语",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "UTF16", "UTF16LE", "UTF16BE", "Latin1", "Hex", "Base64"]
            },
            {
                "name": "输入格式", "type": "option",
                "value": ["Latin1", "UTF8", "UTF16", "UTF16LE", "UTF16BE", "Hex", "Base64"]
            },
            {
                "name": "输出格式", "type": "option",
                "value": ["Latin1", "UTF8", "UTF16", "UTF16LE", "UTF16BE", "Hex", "Base64"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const message = format[args[1]].parse(input),
            passphrase = format[args[0].option].parse(args[0].string),
            encrypted = CryptoJS.RC4.encrypt(message, passphrase);

        return encrypted.ciphertext.toString(format[args[2]]);
    }

    /**
     * Highlight RC4
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
     * Highlight RC4 in reverse
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

export default RC4;
