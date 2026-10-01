/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import JSSHA3 from "js-sha3";

/**
 * Shake operation
 */
class Shake extends Operation {

    /**
     * Shake constructor
     */
    constructor() {
        super();

        this.name = "Shake";
        this.module = "Crypto";
        this.description = "Shake 是 SHA-3 哈希算法的可扩展输出函数（XOF），属于 Keccak 家族，允许可变输出长度/大小。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-3#Instances";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "容量",
                "type": "option",
                "value": ["256", "128"]
            },
            {
                "name": "大小", "type": "number",
                "value": 512
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const capacity = parseInt(args[0], 10),
            size = args[1];
        let algo;

        if (size < 0)
            throw new OperationError("大小必须大于 0");

        switch (capacity) {
            case 128:
                algo = JSSHA3.shake128;
                break;
            case 256:
                algo = JSSHA3.shake256;
                break;
            default:
                throw new OperationError("无效的大小");
        }

        return algo(input, size);
    }

}

export default Shake;
