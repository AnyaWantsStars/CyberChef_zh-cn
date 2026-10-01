/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Bit shift right operation
 */
class BitShiftRight extends Operation {

    /**
     * BitShiftRight constructor
     */
    constructor() {
        super();

        this.name = "位右移";
        this.module = "Default";
        this.description = "将每个字节中的位向右移动指定的位数。<br><br><i>逻辑移位</i>用零填充最左边的位。<br><i>算术移位</i>保留原始字节的最高有效位（MSB）。";
        this.infoURL = "https://wikipedia.org/wiki/Bitwise_operation#Bit_shifts";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "数量", "type": "number",
                "value": 1
            },
            {
                "name": "类型", "type": "option",
                "value": [
                    {name: "逻辑移位", value: "Logical shift"},
                    {name: "算术移位", value: "Arithmetic shift"}
                ]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const amount = args[0],
            type = args[1],
            mask = type === "Logical shift" ? 0 : 0x80;
        input = new Uint8Array(input);

        return input.map(b => {
            return (b >>> amount) ^ (b & mask);
        }).buffer;
    }

    /**
     * Highlight Bit shift right
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
     * Highlight Bit shift right in reverse
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

export default BitShiftRight;
