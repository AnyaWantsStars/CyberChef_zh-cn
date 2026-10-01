/**
 * @author Jarmo van Lenthe [github.com/jarmovanlenthe]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * A1Z26 Cipher Encode operation
 */
class A1Z26CipherEncode extends Operation {

    /**
     * A1Z26CipherEncode constructor
     */
    constructor() {
        super();

        this.name = "A1Z26 密码编码";
        this.module = "Ciphers";
        this.description = "将字母字符转换为对应的字母序号。<br><br>例如 <code>a</code> 变为 <code>1</code>，<code>b</code> 变为 <code>2</code>。<br><br>非字母字符将被丢弃。";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "分隔符",
                type: "option",
                value: DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0] || "空格");
        let output = "";

        const sanitizedinput = input.toLowerCase(),
            charcode = Utils.strToCharcode(sanitizedinput);

        for (let i = 0; i < charcode.length; i++) {
            const ordinal = charcode[i] - 96;

            if (ordinal > 0 && ordinal <= 26) {
                output += ordinal.toString(10) + delim;
            }
        }
        return output.slice(0, -delim.length);
    }

}

export default A1Z26CipherEncode;
