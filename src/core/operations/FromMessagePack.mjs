/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import notepack from "notepack.io";

/**
 * From MessagePack operation
 */
class FromMessagePack extends Operation {

    /**
     * FromMessagePack constructor
     */
    constructor() {
        super();

        this.name = "解码 MessagePack";
        this.module = "Code";
        this.description = "将 MessagePack 编码的数据转换为 JSON。MessagePack 是一种计算机数据交换格式。它是一种用于表示简单数据结构（如数组和关联数组）的二进制形式。";
        this.infoURL = "https://wikipedia.org/wiki/MessagePack";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        try {
            const buf = Buffer.from(new Uint8Array(input));
            return notepack.decode(buf);
        } catch (err) {
            throw new OperationError(`无法将 MessagePack 解码为 JSON: ${err}`);
        }
    }

}

export default FromMessagePack;
