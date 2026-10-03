/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";


/**
 * To Decimal operation
 */
class ToDecimal extends Operation {

    /**
     * ToDecimal constructor
     */
    constructor() {
        super();

        this.name = "转为十进制";
        this.module = "Default";
        this.description = "将输入数据转换为序数整数数组。<br><br>例如 <code>Hello</code> 变为 <code>72 101 108 108 111</code>";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符", "type": "option",
                "value": DELIM_OPTIONS
            },
            {
                "name": "支持有符号值",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0]),
            signed = args[1];
        if (signed) {
            input = new Int8Array(input);
        } else {
            input = new Uint8Array(input);
        }
        return input.join(delim);
    }

}

export default ToDecimal;
