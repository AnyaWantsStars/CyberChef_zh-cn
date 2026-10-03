/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import NodeMD6 from "node-md6";

/**
 * MD6 operation
 */
class MD6 extends Operation {

    /**
     * MD6 constructor
     */
    constructor() {
        super();

        this.name = "MD6";
        this.module = "Crypto";
        this.description = "MD6（Message-Digest 6）算法是一种加密哈希函数。它使用类似 Merkle 树的结构，允许对非常长的输入进行大规模的并行哈希计算。";
        this.infoURL = "https://wikipedia.org/wiki/MD6";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "大小", "type": "number",
                "value": 256
            },
            {
                "name": "级别",
                "type": "number",
                "value": 64
            },
            {
                "name": "密钥", "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [size, levels, key] = args;

        if (size < 0 || size > 512)
            throw new OperationError("大小必须在 0 到 512 之间");
        if (levels < 0)
            throw new OperationError("层级数必须大于 0");

        return NodeMD6.getHashOfText(input, size, key, levels);
    }

}

export default MD6;
