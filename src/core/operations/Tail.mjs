/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {INPUT_DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * Tail operation
 */
class Tail extends Operation {

    /**
     * Tail constructor
     */
    constructor() {
        super();

        this.name = "取尾部";
        this.module = "Default";
        this.description = "类似于 UNIX 的 tail 工具。<br>获取最后 n 行。<br>你也可以通过输入负值 n 来选择第 n 行之后的所有行。<br>可以更改分隔符，以便选择字段（如逗号分隔）而非行。";
        this.infoURL = "https://wikipedia.org/wiki/Tail_(Unix)";
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
                    return lineIndex > -number;
                } else {
                    return lineIndex > splitInput.length - number;
                }
            })
            .join(delimiter);

    }

}

export default Tail;
