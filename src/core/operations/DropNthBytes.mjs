/**
 * @author Oshawk [oshawk@protonmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Drop nth bytes operation
 */
class DropNthBytes extends Operation {

    /**
     * DropNthBytes constructor
     */
    constructor() {
        super();

        this.name = "丢弃第 n 个字节";
        this.module = "Default";
        this.description = "从给定字节开始，每隔 n 个字节丢弃一个字节。";
        this.infoURL = "";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                name: "每隔丢弃",
                type: "number",
                value: 4
            },
            {
                name: "起始于",
                type: "number",
                value: 0
            },
            {
                name: "应用到每行",
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
        const n = args[0];
        const start = args[1];
        const eachLine = args[2];

        if (parseInt(n, 10) !== n || n <= 0) {
            throw new OperationError("'丢弃每个'必须为正整数。");
        }
        if (parseInt(start, 10) !== start || start < 0) {
            throw new OperationError("'起始于'必须为正整数或零。");
        }

        let offset = 0;
        const output = [];
        for (let i = 0; i < input.length; i++) {
            if (eachLine && input[i] === 0x0a) {
                output.push(0x0a);
                offset = i + 1;
            } else if (i - offset < start || (i - (start + offset)) % n !== 0) {
                output.push(input[i]);
            }
        }

        return output;
    }

}

export default DropNthBytes;
