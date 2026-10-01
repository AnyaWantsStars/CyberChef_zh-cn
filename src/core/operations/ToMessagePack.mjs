/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import notepack from "notepack.io";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * To MessagePack operation
 */
class ToMessagePack extends Operation {

    /**
     * ToMessagePack constructor
     */
    constructor() {
        super();

        this.name = "转为 MessagePack";
        this.module = "Code";
        this.description = "将 JSON 转换为 MessagePack 编码的字节缓冲区。MessagePack 是一种计算机数据交换格式。它是一种用于表示简单数据结构（如数组和关联数组）的二进制形式。";
        this.infoURL = "https://wikipedia.org/wiki/MessagePack";
        this.inputType = "JSON";
        this.outputType = "ArrayBuffer";
        this.args = [];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        try {
            if (isWorkerEnvironment()) {
                return notepack.encode(input);
            } else {
                const res = notepack.encode(input);
                // Safely convert from Node Buffer to ArrayBuffer using the correct view of the data
                return (new Uint8Array(res)).buffer;
            }
        } catch (err) {
            throw new OperationError(`无法将 JSON 编码为 MessagePack： ${err}`);
        }
    }

}

export default ToMessagePack;
