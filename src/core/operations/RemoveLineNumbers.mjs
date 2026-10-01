/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Remove line numbers operation
 */
class RemoveLineNumbers extends Operation {

    /**
     * RemoveLineNumbers constructor
     */
    constructor() {
        super();

        this.name = "移除行号";
        this.module = "Default";
        this.description = "如果可以简单检测到，则从输出中移除行号。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return input.replace(/^[ \t]{0,5}\d+[\s:|\-,.)\]]/gm, "");
    }

}

export default RemoveLineNumbers;
