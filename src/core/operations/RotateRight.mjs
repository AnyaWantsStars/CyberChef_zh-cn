/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {rot, rotr, rotrCarry} from "../lib/Rotate.mjs";


/**
 * Rotate right operation.
 */
class RotateRight extends Operation {

    /**
     * RotateRight constructor
     */
    constructor() {
        super();

        this.name = "右旋转";
        this.module = "Default";
        this.description = "将每个字节向右旋转指定的位数，可选择将多余的位传递到下一个字节。";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#Bit_shifts";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "数量",
                type: "number",
                value: 1
            },
            {
                name: "穿透进位",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        if (args[1]) {
            return rotrCarry(input, args[0]);
        } else {
            return rot(input, args[0], rotr);
        }
    }

    /**
     * Highlight rotate right
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight rotate right in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }
}

export default RotateRight;
