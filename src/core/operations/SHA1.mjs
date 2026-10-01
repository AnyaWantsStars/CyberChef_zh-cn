/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * SHA1 operation
 */
class SHA1 extends Operation {

    /**
     * SHA1 constructor
     */
    constructor() {
        super();

        this.name = "SHA1";
        this.module = "Crypto";
        this.description = "SHA（安全哈希算法）哈希函数由 NSA 设计。SHA-1 是现有 SHA 哈希函数中最成熟的，被用于各种安全应用和协议中。<br><br>然而，随着新攻击的发现或改进，SHA-1 的抗碰撞性一直在减弱。消息摘要算法默认由 80 轮组成。";
        this.infoURL = "https://wikipedia.org/wiki/SHA-1";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "轮数",
                type: "number",
                value: 80,
                min: 16
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return runHash("sha1", input, {rounds: args[0]});
    }

}

export default SHA1;
