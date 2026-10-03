/**
 * @author Thomas Weißschuh [thomas@t-8ch.de]
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { toHex } from "../lib/Hex.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * XOR Checksum operation
 */
class XORChecksum extends Operation {
    /**
     * XORChecksum constructor
     */
    constructor() {
        super();

        this.name = "XOR 校验和";
        this.module = "Crypto";
        this.description =
            "XOR 校验和将输入分割为可配置大小的块，并对这些块执行 XOR 运算。";
        this.infoURL = "https://wikipedia.org/wiki/XOR";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "块大小",
                type: "number",
                value: 4,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const blocksize = args[0];


        if (!Number.isInteger(blocksize) || blocksize <= 0) {
            throw new OperationError("块大小必须为正整数。");
        }

        input = new Uint8Array(input);

        const res = Array(blocksize);
        res.fill(0);

        for (const chunk of Utils.chunked(input, blocksize)) {
            for (let i = 0; i < blocksize; i++) {
                res[i] ^= chunk[i];
            }
        }

        return toHex(res, "");
    }
}

export default XORChecksum;
