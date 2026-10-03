/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";

/**
 * Derive PBKDF2 key operation
 */
class DerivePBKDF2Key extends Operation {

    /**
     * DerivePBKDF2Key constructor
     */
    constructor() {
        super();

        this.name = "派生 PBKDF2 密钥";
        this.module = "Ciphers";
        this.description = "PBKDF2 是一种基于密码的密钥派生函数。它是 RSA Laboratories 公钥密码学标准（PKCS）系列的一部分，具体为 PKCS #5 v2.0，也发布为 IETF RFC 2898。<br><br>在许多密码学应用中，用户安全最终依赖于密码，而密码通常不能直接用作密码学密钥，因此需要一些处理。<br><br>盐值为任何给定密码提供大量密钥，迭代计数增加了从密码生成密钥的成本，从而也增加了攻击的难度。<br><br>如果盐值参数留空，将生成随机盐值。";
        this.infoURL = "https://wikipedia.org/wiki/PBKDF2";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密码短语",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["UTF8", "Latin1", "Hex", "Base64"]
            },
            {
                "name": "密钥大小",
                "type": "number",
                "value": 128
            },
            {
                "name": "迭代次数",
                "type": "number",
                "value": 1
            },
            {
                "name": "哈希函数",
                "type": "option",
                "value": ["SHA1", "SHA256", "SHA384", "SHA512", "MD5"]
            },
            {
                "name": "盐值", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const passphrase = Utils.convertToByteString(args[0].string, args[0].option),
            keySize = args[1],
            iterations = args[2],
            hasher = args[3],
            salt = Utils.convertToByteString(args[4].string, args[4].option) ||
                forge.random.getBytesSync(keySize),
            derivedKey = forge.pkcs5.pbkdf2(passphrase, salt, iterations, keySize / 8, hasher.toLowerCase());

        return forge.util.bytesToHex(derivedKey);
    }

}

export default DerivePBKDF2Key;
