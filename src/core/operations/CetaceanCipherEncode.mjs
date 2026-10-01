/**
 * @author dolphinOnKeys [robin@weird.io]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {toBinary} from "../lib/Binary.mjs";

/**
 * Cetacean Cipher Encode operation
 */
class CetaceanCipherEncode extends Operation {

    /**
     * CetaceanCipherEncode constructor
     */
    constructor() {
        super();

        this.name = "鲸语密码 编码";
        this.module = "Ciphers";
        this.description = "将任意输入转换为鲸类密码。<br/><br/>例如 <code>hi</code> 变为 <code>EEEEEEEEEeeEeEEEEEEEEEEEEeeEeEEe</code>";
        this.infoURL = "https://hitchhikers.fandom.com/wiki/Dolphins";
        this.inputType = "string";
        this.outputType = "string";
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const result = [];
        const charArray = input.split("");

        charArray.map(character => {
            if (character === " ") {
                result.push(character);
            } else {
                const binaryArray = toBinary(character.charCodeAt(0), "无", 16).split("");
                result.push(binaryArray.map(str => str === "1" ? "e" : "E").join(""));
            }
        });

        return result.join("");
    }
}

export default CetaceanCipherEncode;
