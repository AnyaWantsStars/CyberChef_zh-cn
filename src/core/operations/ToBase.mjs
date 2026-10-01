/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * To Base operation
 */
class ToBase extends Operation {

    /**
     * ToBase constructor
     */
    constructor() {
        super();

        this.name = "转为进制";
        this.module = "Default";
        this.description = "将十进制数转换为指定的进制。";
        this.infoURL = "https://wikipedia.org/wiki/Radix";
        this.inputType = "BigNumber";
        this.outputType = "string";
        this.args = [
            {
                "name": "基数",
                "type": "number",
                "value": 36,
                "min": 2,
                "max": 36,
                "integer": true,
            }
        ];
    }

    /**
     * @param {BigNumber} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) {
            throw new OperationError("错误：输入必须是数字");
        }
        const radix = args[0];
        return input.toString(radix);
    }

}

export default ToBase;
