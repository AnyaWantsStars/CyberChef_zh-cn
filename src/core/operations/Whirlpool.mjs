/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {runHash} from "../lib/Hash.mjs";

/**
 * Whirlpool operation
 */
class Whirlpool extends Operation {

    /**
     * Whirlpool constructor
     */
    constructor() {
        super();

        this.name = "Whirlpool";
        this.module = "Crypto";
        this.description = "Whirlpool 是 Vincent Rijmen（AES 共同创建者）和 Paulo S. L. M. Barreto 设计的密码哈希函数，于 2000 年首次描述。<br><br>存在多个变体：<ul><li>Whirlpool-0 是 2000 年发布的原始版本。</li><li>Whirlpool-T 是 2001 年发布的第一次修订，改进了 s-box 的生成。</li><li>Whirlpool 是 2003 年发布的最新修订，修复了扩散矩阵中的一个缺陷。</li></ul>";
        this.infoURL = "https://wikipedia.org/wiki/Whirlpool_(cryptography)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "变体",
                type: "option",
                value: ["Whirlpool", "Whirlpool-T", "Whirlpool-0"]
            },
            {
                name: "轮数",
                type: "number",
                value: 10,
                min: 1,
                max: 10
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const variant = args[0].toLowerCase();
        return runHash(variant, input, {rounds: args[1]});
    }

}

export default Whirlpool;
