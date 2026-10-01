/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import JSSHA3 from "js-sha3";
import OperationError from "../errors/OperationError.mjs";

/**
 * SHA3 operation
 */
class SHA3 extends Operation {

    /**
     * SHA3 constructor
     */
    constructor() {
        super();

        this.name = "SHA3";
        this.module = "Crypto";
        this.description = "SHA-3（安全哈希算法 3）哈希函数于 2015 年 8 月 5 日由 NIST 发布。虽然属于同一系列标准，但 SHA-3 在内部与 SHA-1 和 SHA-2 的 MD5 类结构有很大不同。<br><br>SHA-3 是由 Guido Bertoni、Joan Daemen、Michaël Peeters 和 Gilles Van Assche 设计的更广泛密码原语家族 Keccak 的子集，基于 RadioGatún。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-3";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "大小", "type": "option",
                "value": ["512", "384", "256", "224"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const size = parseInt(args[0], 10);
        let algo;

        switch (size) {
            case 224:
                algo = JSSHA3.sha3_224;
                break;
            case 384:
                algo = JSSHA3.sha3_384;
                break;
            case 256:
                algo = JSSHA3.sha3_256;
                break;
            case 512:
                algo = JSSHA3.sha3_512;
                break;
            default:
                throw new OperationError("无效的大小");
        }

        return algo(input);
    }

}

export default SHA3;
