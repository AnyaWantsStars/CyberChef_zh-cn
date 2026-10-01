/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {INPUT_DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * Head operation
 */
class Head extends Operation {

    /**
     * Head constructor
     */
    constructor() {
        super();

        this.name = "取头部";
        this.module = "Default";
        this.description = "类似 UNIX head 工具。<br>获取前 n 行。<br>您可以通过输入负值 n 来选择除最后 n 行之外的所有行。<br>可以更改分隔符，以便选择字段（即逗号）而不是行。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符", "type": "option",
                "value": INPUT_DELIM_OPTIONS
            },
            {
                "name": "数字",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let delimiter = args[0];
        const number = args[1];

        delimiter = Utils.charRep(delimiter);
        const splitInput = input.split(delimiter);

        return splitInput
            .filter((line, lineIndex) => {
                lineIndex += 1;

                if (number < 0) {
                    return lineIndex <= splitInput.length + number;
                } else {
                    return lineIndex <= number;
                }
            })
            .join(delimiter);
    }

}

export default Head;
