/**
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import * as LS47 from "../lib/LS47.mjs";

/**
 * LS47 Encrypt operation
 */
class LS47Encrypt extends Operation {

    /**
     * LS47Encrypt constructor
     */
    constructor() {
        super();

        this.name = "LS47 加密";
        this.module = "Crypto";
        this.description = "这是 Alan Kaminsky 描述的 ElsieFour 密码的轻微改进。我们使用 7x7 字符而不是原始的（勉强适合的）6x6，以便能够加密一些结构化信息。我们还描述了一个简单的密钥扩展算法，因为记住密码很流行。与 ElsieFour 类似的安全考虑适用。<br>LS47 字母表由以下字符组成：<code>_abcdefghijklmnopqrstuvwxyz.0123456789,-+*/:?!'()</code><br>LS47 密钥是字母表的一个排列，然后将其表示在用于加密或解密的 7x7 网格中。";
        this.infoURL = "https://github.com/exaexa/ls47";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "密码",
                type: "string",
                value: ""
            },
            {
                name: "填充",
                type: "number",
                value: 10
            },
            {
                name: "签名",
                type: "string",
                value: ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        this.paddingSize = parseInt(args[1], 10);

        LS47.initTiles();

        const key = LS47.deriveKey(args[0]);
        return LS47.encryptPad(key, input, args[2], this.paddingSize);
    }

}

export default LS47Encrypt;
