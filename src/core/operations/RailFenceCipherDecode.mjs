/**
 * @author Flavio Diez [flaviofdiez+cyberchef@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Rail Fence Cipher Decode operation
 */
class RailFenceCipherDecode extends Operation {

    /**
     * RailFenceCipherDecode constructor
     */
    constructor() {
        super();

        this.name = "栅栏密码 解码";
        this.module = "Ciphers";
        this.description = "使用给定的密钥和偏移量解码通过栅栏密码创建的字符串。";
        this.infoURL = "https://wikipedia.org/wiki/Rail_fence_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "密钥",
                type: "number",
                value: 2
            },
            {
                name: "偏移量",
                type: "number",
                value: 0
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [key, offset] = args;

        const cipher = input;

        if (key < 2) {
            throw new OperationError("密钥必须大于 2");
        } else if (key > cipher.length) {
            throw new OperationError("密钥应小于密文的长度");
        }

        if (offset < 0) {
            throw new OperationError("偏移量必须为正整数");
        }

        const cycle = (key - 1) * 2;
        const plaintext = new Array(cipher.length);

        let j = 0;
        let x, y;

        for (y = 0; y < key; y++) {
            for (x = 0; x < cipher.length; x++) {
                if ((y + x + offset) % cycle === 0 || (y - x - offset) % cycle === 0) {
                    plaintext[x] = cipher[j++];
                }
            }
        }

        return plaintext.join("");
    }

}


export default RailFenceCipherDecode;
