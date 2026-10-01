/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import JSSHA3 from "js-sha3";
import OperationError from "../errors/OperationError.mjs";

/**
 * Keccak operation
 */
class Keccak extends Operation {

    /**
     * Keccak constructor
     */
    constructor() {
        super();

        this.name = "Keccak";
        this.module = "Crypto";
        this.description = "Keccak 哈希算法由 Guido Bertoni、Joan Daemen、Michaël Peeters 和 Gilles Van Assche 设计，基于 RadioGatún。它在 SHA-3 设计竞赛中获胜。<br><br>此版本算法为 Keccak[c=2d]，与 SHA-3 规范不同。";
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
                algo = JSSHA3.keccak224;
                break;
            case 384:
                algo = JSSHA3.keccak384;
                break;
            case 256:
                algo = JSSHA3.keccak256;
                break;
            case 512:
                algo = JSSHA3.keccak512;
                break;
            default:
                throw new OperationError("无效的大小");
        }

        return algo(input);
    }

}

export default Keccak;
