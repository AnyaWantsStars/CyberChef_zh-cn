/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Bzip2 from "libbzip2-wasm";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Bzip2 Compress operation
 */
class Bzip2Compress extends Operation {

    /**
     * Bzip2Compress constructor
     */
    constructor() {
        super();

        this.name = "Bzip2 压缩";
        this.module = "Compression";
        this.description = "Bzip2 是 Julian Seward（以 GHC 闻名）开发的压缩库，使用 Burrows-Wheeler 算法。它仅支持压缩单个文件，压缩速度较慢，但比 Deflate（.gz 和 .zip）更有效。";
        this.infoURL = "https://wikipedia.org/wiki/Bzip2";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                name: "块大小（100KB）",
                type: "number",
                value: 9,
                min: 1,
                max: 9
            },
            {
                name: "工作因子",
                type: "number",
                value: 30
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {File}
     */
    async run(input, args) {
        const [blockSize, workFactor] = args;
        if (input.byteLength <= 0) {
            throw new OperationError("请提供输入。");
        }
        if (isWorkerEnvironment()) self.sendStatusMessage("正在加载 Bzip2...");
        return new Promise((resolve, reject) => {
            Bzip2().then(bzip2 => {
                if (isWorkerEnvironment()) self.sendStatusMessage("正在压缩数据...");
                const inpArray = new Uint8Array(input);
                const bzip2cc = bzip2.compressBZ2(inpArray, blockSize, workFactor);
                if (bzip2cc.error !== 0) {
                    reject(new OperationError(bzip2cc.error_msg));
                } else {
                    const output = bzip2cc.output;
                    resolve(output.buffer.slice(output.byteOffset, output.byteLength + output.byteOffset));
                }
            });
        });
    }

}

export default Bzip2Compress;
