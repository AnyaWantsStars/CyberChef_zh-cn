/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { deserialize } from "bson";
import OperationError from "../errors/OperationError.mjs";

/**
 * BSON deserialise operation
 */
class BSONDeserialise extends Operation {

    /**
     * BSONDeserialise constructor
     */
    constructor() {
        super();

        this.name = "BSON 反序列化";
        this.module = "Serialise";
        this.description = "BSON 是一种计算机数据交换格式，主要用作 MongoDB 数据库中的数据存储和网络传输格式。它是用于表示简单数据结构、关联数组（在 MongoDB 中称为对象或文档）以及 MongoDB 特定的各种数据类型的二进制形式。BSON 名称基于 JSON 术语，代表 Binary JSON。<br><br>输入数据应为原始字节格式。";
        this.infoURL = "https://wikipedia.org/wiki/BSON";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input.byteLength) return "";

        try {
            const data = deserialize(new Uint8Array(input));
            return JSON.stringify(data, null, 2);
        } catch (err) {
            throw new OperationError(err.toString());
        }
    }

}

export default BSONDeserialise;
