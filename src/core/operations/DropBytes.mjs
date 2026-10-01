/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Drop bytes operation
 */
class DropBytes extends Operation {

    /**
     * DropBytes constructor
     */
    constructor() {
        super();

        this.name = "丢弃字节";
        this.module = "Default";
        this.description = "从数据中截去指定数量的字节。支持负值。";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "起始值",
                "type": "number",
                "value": 0
            },
            {
                "name": "长度", "type": "number",
                "value": 5
            },
            {
                "name": "应用到每行", "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     *
     * @throws {OperationError} if invalid input
     */
    run(input, args) {
        let start = args[0],
            length = args[1];
        const applyToEachLine = args[2];

        if (!applyToEachLine) {
            if (start < 0) { // Take from the end
                start = input.byteLength + start;
            }

            if (length < 0) { // Flip start point
                start = start + length;
                if (start < 0) {
                    start = input.byteLength + start;
                    length = start - length;
                } else {
                    length = -length;
                }
            }

            const left = input.slice(0, start),
                right = input.slice(start + length, input.byteLength);
            const result = new Uint8Array(left.byteLength + right.byteLength);
            result.set(new Uint8Array(left), 0);
            result.set(new Uint8Array(right), left.byteLength);
            return result.buffer;
        }

        // Split input into lines
        const data = new Uint8Array(input);
        const lines = [];
        let line = [],
            i;

        for (i = 0; i < data.length; i++) {
            if (data[i] === 0x0a) {
                lines.push(line);
                line = [];
            } else {
                line.push(data[i]);
            }
        }
        lines.push(line);

        let output = [],
            s = start,
            l = length;
        for (i = 0; i < lines.length; i++) {
            if (s < 0) { // Take from the end
                s = lines[i].length + s;
            }

            if (l < 0) { // Flip start point
                s = s + l;
                if (s < 0) {
                    s = lines[i].length + s;
                    l = s - l;
                } else {
                    l = -l;
                }
            }

            output = output.concat(lines[i].slice(0, s).concat(lines[i].slice(s+l, lines[i].length)));
            output.push(0x0a);
            s = start;
            l = length;
        }
        return new Uint8Array(output.slice(0, output.length-1)).buffer;
    }

}

export default DropBytes;
