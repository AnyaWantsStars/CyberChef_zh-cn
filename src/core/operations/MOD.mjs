/**
 * @license Apache-2.0
 */

import BigNumber from "bignumber.js";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { createNumArray } from "../lib/Arithmetic.mjs";
import { ARITHMETIC_DELIM_OPTIONS } from "../lib/Delim.mjs";


/**
 * MOD operation
 */
class MOD extends Operation {

    /**
     * MOD constructor
     */
    constructor() {
        super();

        this.name = "MOD";
        this.module = "Default";
        this.description = "计算列表中每个数字对给定模数值的取模结果。数字根据分隔符从输入中提取，非数字值将被忽略。<br><br>例如 <code>15 4 7</code> 模 <code>3</code> 变为 <code>0 1 1</code>";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "模数", "type": "number",
                "value": 2
            },
            {
                "name": "分隔符", "type": "option",
                "value": ARITHMETIC_DELIM_OPTIONS,
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const modulus = new BigNumber(args[0]);
        const delimiter = args[1];

        if (modulus.isZero()) {
            throw new OperationError("模数不能为零");
        }

        const numbers = createNumArray(input, delimiter);
        const results = numbers.map(num => num.mod(modulus));

        return results.join(" ");
    }

}

export default MOD;
