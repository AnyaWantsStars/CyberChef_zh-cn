/**
 * @author Imantas Lukenskas [imantas@lukenskas.dev]
 * @copyright Imantas Lukenskas 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {toCobs} from "../lib/COBS.mjs";

/**
 * To COBS operation
 */
class ToCOBS extends Operation {
    /**
     * ToCOBS constructor
     */
    constructor() {
        super();

        this.name = "编码 COBS";
        this.module = "Default";
        this.description = "将字节编码为 COBS 格式";
        this.infoURL = "https://wikipedia.org/wiki/Consistent_Overhead_Byte_Stuffing";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        return toCobs(input);
    }
}

export default ToCOBS;
