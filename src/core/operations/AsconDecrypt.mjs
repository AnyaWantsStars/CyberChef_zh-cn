/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHexFast } from "../lib/Hex.mjs";
import JsAscon from "js-ascon";

/**
 * Ascon Decrypt operation
 */
class AsconDecrypt extends Operation {

    /**
     * AsconDecrypt constructor
     */
    constructor() {
        super();

        this.name = "Ascon 解密";
        this.module = "Ciphers";
        this.description = "Ascon-AEAD128 认证解密，遵循 NIST SP 800-232 标准。解密密文并验证认证标签。如果密文或关联数据被篡改，解密将失败。<br><br><b>密钥：</b>必须恰好为 16 字节（128 位）。<br><br><b>Nonce：</b>必须恰好为 16 字节（128 位）。必须与加密时使用的 Nonce 匹配。<br><br><b>关联数据：</b>必须与加密时使用的关联数据匹配。任何不匹配都将导致认证失败。";
        this.infoURL = "https://wikipedia.org/wiki/Ascon_(cipher)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "随机数",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "关联数据",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "输入", "type": "option",
                "value": [
                    "Hex",
                    {name: "原始", value: "Raw"}
                ]
            },
            {
                "name": "输出",
                "type": "option",
                "value": [
                    {name: "原始", value: "Raw"},
                    "Hex"
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     * @throws {OperationError} if invalid key or nonce length, or authentication fails
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            nonce = Utils.convertToByteArray(args[1].string, args[1].option),
            ad = Utils.convertToByteArray(args[2].string, args[2].option),
            inputType = args[3],
            outputType = args[4];

        if (key.length !== 16) {
            throw new OperationError(`无效密钥长度：${key.length} 字节。

Ascon-AEAD128 需要恰好 16 字节（128 位）的密钥。`);
        }

        if (nonce.length !== 16) {
            throw new OperationError(`无效 Nonce 长度：${nonce.length} 字节。

Ascon-AEAD128 需要恰好 16 字节（128 位）的 Nonce。`);
        }

        // Convert input to byte array
        const inputData = Utils.convertToByteArray(input, inputType);

        const keyUint8 = new Uint8Array(key);
        const nonceUint8 = new Uint8Array(nonce);
        const adUint8 = new Uint8Array(ad);
        const ciphertextUint8 = new Uint8Array(inputData);

        try {
            // Decrypt (returns Uint8Array containing plaintext)
            const plaintext = JsAscon.decrypt(keyUint8, nonceUint8, adUint8, ciphertextUint8);

            // Return in requested format
            if (outputType === "Hex") {
                return toHexFast(plaintext);
            } else {
                return Utils.arrayBufferToStr(Uint8Array.from(plaintext).buffer);
            }
        } catch (e) {
            throw new OperationError("无法解密：身份验证失败。密文、密钥、Nonce 或关联数据可能不正确或被篡改。");
        }
    }

}

export default AsconDecrypt;
