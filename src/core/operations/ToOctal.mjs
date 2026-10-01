/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";


/**
 * To Octal operation
 */
class ToOctal extends Operation {

    /**
     * ToOctal constructor
     */
    constructor() {
        super();

        this.name = "转为八进制";
        this.module = "Default";
        this.description = "将输入字符串转换为由指定分隔符分隔的八进制字节。<br><br>例如 UTF-8 编码字符串 <code>Γειά σου</code> 变为 <code>316 223 316 265 316 271 316 254 40 317 203 316 277 317 205</code>";
        this.infoURL = "https://wikipedia.org/wiki/Octal";
        this.inputType = "byteArray";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符", "type": "option",
                "value": DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0] || "空格");
        return input.map(val => val.toString(8)).join(delim);
    }

}

export default ToOctal;
