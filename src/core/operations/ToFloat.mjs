/**
 * @author tcode2k16 [tcode2k16@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import ieee754 from "ieee754";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * To Float operation
 */
class ToFloat extends Operation {

    /**
     * ToFloat constructor
     */
    constructor() {
        super();

        this.name = "转为浮点数";
        this.module = "Default";
        this.description = "转换为 IEEE754 浮点数";
        this.infoURL = "https://wikipedia.org/wiki/IEEE_754";
        this.inputType = "byteArray";
        this.outputType = "string";
        this.args = [
            {
                "name": "字节序",
                "type": "option",
                "value": [
                    {name: "大端序", value: "Big Endian"},
                    {name: "小端序", value: "Little Endian"}
                ]
            },
            {
                "name": "大小", "type": "option",
                "value": [
                    {name: "单精度浮点 (4字节)", value: "Float (4 bytes)"},
                    {name: "双精度浮点 (8字节)", value: "Double (8 bytes)"}
                ]
            },
            {
                "name": "分隔符", "type": "option",
                "value": DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [endianness, size, delimiterName] = args;
        const delim = Utils.charRep(delimiterName || "空格");
        const byteSize = size === "Double (8 bytes)" ? 8 : 4;
        const isLE = endianness === "Little Endian";
        const mLen = byteSize === 4 ? 23 : 52;

        if (input.length % byteSize !== 0) {
            throw new OperationError(`输入不是 ${byteSize} 的倍数`);
        }

        const output = [];
        for (let i = 0; i < input.length; i+=byteSize) {
            output.push(ieee754.read(input, i, isLE, mLen, byteSize));
        }
        return output.join(delim);
    }

}

export default ToFloat;
