/**
 * @author tcode2k16 [tcode2k16@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import ieee754 from "ieee754";
import {DELIM_OPTIONS} from "../lib/Delim.mjs";

/**
 * From Float operation
 */
class FromFloat extends Operation {

    /**
     * FromFloat constructor
     */
    constructor() {
        super();

        this.name = "解码浮点数";
        this.module = "Default";
        this.description = "从 IEEE754 浮点数转换";
        this.infoURL = "https://wikipedia.org/wiki/IEEE_754";
        this.inputType = "string";
        this.outputType = "byteArray";
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
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        if (input.length === 0) return [];

        const [endianness, size, delimiterName] = args;
        const delim = Utils.charRep(delimiterName || "空格");
        const byteSize = size === "Double (8 bytes)" ? 8 : 4;
        const isLE = endianness === "Little Endian";
        const mLen = byteSize === 4 ? 23 : 52;
        const floats = input.split(delim);

        const output = new Array(floats.length*byteSize);
        for (let i = 0; i < floats.length; i++) {
            ieee754.write(output, parseFloat(floats[i]), i*byteSize, isLE, mLen, byteSize);
        }
        return output;
    }

}

export default FromFloat;
