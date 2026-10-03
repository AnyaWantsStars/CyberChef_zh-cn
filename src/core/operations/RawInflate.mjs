/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {INFLATE_BUFFER_TYPE} from "../lib/Zlib.mjs";
import rawinflate from "zlibjs/bin/rawinflate.min.js";

const Zlib = rawinflate.Zlib;

const RAW_BUFFER_TYPE_LOOKUP = {
    "Adaptive": Zlib.RawInflate.BufferType.ADAPTIVE,
    "Block":    Zlib.RawInflate.BufferType.BLOCK,
};

/**
 * Raw Inflate operation
 */
class RawInflate extends Operation {

    /**
     * RawInflate constructor
     */
    constructor() {
        super();

        this.name = "原始 Deflate 解压";
        this.module = "Compression";
        this.description = "解压使用无头信息的 deflate 算法压缩的数据。";
        this.infoURL = "https://wikipedia.org/wiki/DEFLATE";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                name: "起始索引",
                type: "number",
                value: 0
            },
            {
                name: "初始输出缓冲区大小",
                type: "number",
                value: 0
            },
            {
                name: "缓冲区扩展类型",
                type: "option",
                value: INFLATE_BUFFER_TYPE
            },
            {
                name: "解压后调整缓冲区大小",
                type: "boolean",
                value: false
            },
            {
                name: "验证结果",
                type: "boolean",
                value: false
            }
        ];
        this.checks = [
            {
                entropyRange: [7.5, 8],
                args: [0, 0, INFLATE_BUFFER_TYPE, false, false]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const inflate = new Zlib.RawInflate(new Uint8Array(input), {
                index: args[0],
                bufferSize: args[1],
                bufferType: RAW_BUFFER_TYPE_LOOKUP[args[2]],
                resize: args[3],
                verify: args[4]
            }),
            result = new Uint8Array(inflate.decompress());

        return result.buffer;
    }

}

export default RawInflate;
