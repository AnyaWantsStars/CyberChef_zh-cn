/**
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Caesar Box Cipher operation
 */
class CaesarBoxCipher extends Operation {

    /**
     * CaesarBoxCipher constructor
     */
    constructor() {
        super();

        this.name = "Caesar Box 密码";
        this.module = "Ciphers";
        this.description = "凯撒方盒是罗马帝国使用的一种换位密码，将消息的字母按行写入一个正方形（或矩形）中，然后按列读取。";
        this.infoURL = "https://www.dcode.fr/caesar-box-cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "盒子高度",
                type: "number",
                value: 1
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const tableHeight = args[0];
        const tableWidth = Math.ceil(input.length / tableHeight);
        while (input.indexOf(" ") !== -1)
            input = input.replace(" ", "");
        for (let i = 0; i < (tableHeight * tableWidth) - input.length; i++) {
            input += "\x00";
        }
        let result = "";
        for (let i = 0; i < tableHeight; i++) {
            for (let j = i; j < input.length; j += tableHeight) {
                if (input.charAt(j) !== "\x00") {
                    result += input.charAt(j);
                }
            }
        }
        return result;
    }

}

export default CaesarBoxCipher;
