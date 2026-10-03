/**
 * @author crespyl [peter@crespyl.net]
 * @copyright Peter Jacobs 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

import {COMPRESSION_OUTPUT_FORMATS, DECOMPRESSION_FUNCTIONS} from "../lib/LZString.mjs";

/**
 * LZString Decompress operation
 */
class LZStringDecompress extends Operation {

    /**
     * LZStringDecompress constructor
     */
    constructor() {
        super();

        this.name = "LZString 解压";
        this.module = "Compression";
        this.description = "解压缩使用 lz-string 压缩的数据。";
        this.infoURL = "https://pieroxy.net/blog/pages/lz-string/index.html";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "压缩格式",
                type: "option",
                defaultIndex: 0,
                value: COMPRESSION_OUTPUT_FORMATS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const decompress = DECOMPRESSION_FUNCTIONS[args[0]];
        if (decompress) {
            return decompress(input);
        } else {
            throw new OperationError("无法找到解压函数");
        }
    }


}

export default LZStringDecompress;
