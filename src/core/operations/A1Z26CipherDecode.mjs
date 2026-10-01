/**
 * @author Jarmo van Lenthe [github.com/jarmovanlenthe]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * A1Z26 Cipher Decode operation
 */
class A1Z26CipherDecode extends Operation {

    /**
     * A1Z26CipherDecode constructor
     */
    constructor() {
        super();

        this.name = "A1Z26 密码解密";
        this.module = "Ciphers";
        this.description = "将字母序号转换为对应的字母字符。<br><br>例如 <code>1 2 3 4 5</code> 变为 <code>a b c d e</code>";
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
        this.checks = [
            {
                pattern:  "^\\s*((?:0?[1-9]|1[0-9]|2[0-6]) )+(?:0?[1-9]|1[0-9]|2[0-6])\\s*$",
                flags:  "",
                args:   ["Space"]
            },
            {
                pattern:  "^\\s*((?:0?[1-9]|1[0-9]|2[0-6]),)+(?:0?[1-9]|1[0-9]|2[0-6])\\s*$",
                flags:  "",
                args:   ["Comma"]
            },
            {
                pattern:  "^\\s*((?:0?[1-9]|1[0-9]|2[0-6]);)+(?:0?[1-9]|1[0-9]|2[0-6])\\s*$",
                flags:  "",
                args:   ["Semi-colon"]
            },
            {
                pattern:  "^\\s*((?:0?[1-9]|1[0-9]|2[0-6]):)+(?:0?[1-9]|1[0-9]|2[0-6])\\s*$",
                flags:  "",
                args:   ["Colon"]
            },
            {
                pattern:  "^\\s*((?:0?[1-9]|1[0-9]|2[0-6])\\n)+(?:0?[1-9]|1[0-9]|2[0-6])\\s*$",
                flags:  "",
                args:   ["Line feed"]
            },
            {
                pattern:  "^\\s*((?:0?[1-9]|1[0-9]|2[0-6])\\r\\n)+(?:0?[1-9]|1[0-9]|2[0-6])\\s*$",
                flags:  "",
                args:   ["CRLF"]
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

        if (input.length === 0) {
            return "";
        }

        const bites = input.split(delim);
        let latin1 = "";
        for (let i = 0; i < bites.length; i++) {
            if (bites[i] < 1 || bites[i] > 26) {
                throw new OperationError("错误：所有数字必须在 1 到 26 之间。");
            }
            latin1 += Utils.chr(parseInt(bites[i], 10) + 96);
        }
        return latin1;
    }

}

export default A1Z26CipherDecode;
