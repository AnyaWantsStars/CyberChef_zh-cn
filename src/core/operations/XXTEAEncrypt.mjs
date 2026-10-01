/**
 * @author devcydo [devcydo@gmail.com]
 * @author Ma Bingyao [mabingyao@gmail.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {encrypt} from "../lib/XXTEA.mjs";

/**
 * XXTEA Encrypt operation
 */
class XXTEAEncrypt extends Operation {

    /**
     * XXTEAEncrypt constructor
     */
    constructor() {
        super();

        this.name = "XXTEA 加密";
        this.module = "Ciphers";
        this.description = "修正 Block TEA（通常称为 XXTEA）是一种分组密码，旨在修正原始 Block TEA 的弱点。XXTEA 操作可变长度的块，块大小是 32 位的任意倍数（最少 64 位）。完整循环次数取决于块大小，但至少有六次（小块大小最多 32 次）。原始 Block TEA 将 XTEA 轮函数应用于块中的每个字，并与其左邻居进行加法组合。解密过程的缓慢扩散率立即被利用来破解该密码。修正 Block TEA 使用更复杂的轮函数，在处理块中的每个字时利用其两个直接邻居。";
        this.infoURL = "https://wikipedia.org/wiki/XXTEA";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "密钥", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = new Uint8Array(Utils.convertToByteArray(args[0].string, args[0].option));
        return encrypt(new Uint8Array(input), key).buffer;
    }

}

export default XXTEAEncrypt;
