/**
 * @author bwhitn [brian.m.whitney@outlook.com]
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import BigNumber from "bignumber.js";
import Operation from "../Operation.mjs";
import { median, createNumArray } from "../lib/Arithmetic.mjs";
import { ARITHMETIC_DELIM_OPTIONS } from "../lib/Delim.mjs";

/**
 * Median operation
 */
class Median extends Operation {

    /**
     * Median constructor
     */
    constructor() {
        super();

        this.name = "中位数";
        this.module = "Default";
        this.description = "计算数字列表的中位数。如果字符串中的某项不是数字，则将其从列表中排除。<br><br>例如：<code>0x0a 8 1 .5</code> 变为 <code>4.5</code>";
        this.infoURL = "https://wikipedia.org/wiki/Median";
        this.inputType = "string";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "分隔符", "type": "option",
                "value": ARITHMETIC_DELIM_OPTIONS,
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {BigNumber}
     */
    run(input, args) {
        const val = median(createNumArray(input, args[0]));
        return BigNumber.isBigNumber(val) ? val : new BigNumber(NaN);
    }

}

export default Median;
