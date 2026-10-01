/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";

/**
 * Fletcher-8 Checksum operation
 */
class Fletcher8Checksum extends Operation {

    /**
     * Fletcher8Checksum constructor
     */
    constructor() {
        super();

        this.name = "Fletcher-8 校验和";
        this.module = "Crypto";
        this.description = "Fletcher 校验和是一种用于计算位置相关校验和的算法，由 John Gould Fletcher 于 20 世纪 70 年代末在 Lawrence Livermore Labs 设计。<br><br>Fletcher 校验和的目标是提供接近循环冗余校验的检错特性，但具有求和技术的较低计算开销。";
        this.infoURL = "https://wikipedia.org/wiki/Fletcher%27s_checksum";
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
        let a = 0,
            b = 0;
        input = new Uint8Array(input);

        for (let i = 0; i < input.length; i++) {
            a = (a + input[i]) % 0xf;
            b = (b + a) % 0xf;
        }

        return Utils.hex(((b << 4) | a) >>> 0, 2);
    }

}

export default Fletcher8Checksum;
