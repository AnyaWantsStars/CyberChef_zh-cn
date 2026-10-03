/**
 * @author jarrodconnolly [jarrod@nestedquotes.ca]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import avro from "avsc";

/**
 * Avro to JSON operation
 */
class AvroToJSON extends Operation {

    /**
     * AvroToJSON constructor
     */
    constructor() {
        super();

        this.name = "Avro 转 JSON";
        this.module = "Serialise";
        this.description = "将 Avro 编码的数据转换为 JSON。";
        this.infoURL = "https://wikipedia.org/wiki/Apache_Avro";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "强制有效 JSON",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        if (input.byteLength <= 0) {
            throw new OperationError("请提供输入。");
        }

        const forceJSON = args[0];

        return new Promise((resolve, reject) => {
            const result = [];
            const inpArray = new Uint8Array(input);
            const decoder = new avro.streams.BlockDecoder();

            decoder
                .on("data", function (obj) {
                    result.push(obj);
                })
                .on("error", function () {
                    reject(new OperationError("解析 Avro 文件时出错。"));
                })
                .on("end", function () {
                    if (forceJSON) {
                        resolve(result.length === 1 ? JSON.stringify(result[0], null, 4) : JSON.stringify(result, null, 4));
                    } else {
                        const data = result.reduce((result, current) => result + JSON.stringify(current) + "\n", "");
                        resolve(data);
                    }
                });

            decoder.write(inpArray);
            decoder.end();
        });
    }
}

export default AvroToJSON;
