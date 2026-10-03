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
 * Ascon Encrypt operation
 */
class AsconEncrypt extends Operation {

    /**
     * AsconEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Ascon 加密";
        this.module = "Ciphers";
        this.description = "Ascon-AEAD128 认证加密，遵循 NIST SP 800-232 标准。Ascon 是一系列轻量级认证加密算法，专为 IoT 传感器和嵌入式系统等受限设备设计。<br><br><b>密钥：</b>必须恰好为 16 字节（128 位）。<br><br><b>Nonce：</b>必须恰好为 16 字节（128 位）。使用相同密钥时，每次加密应使用唯一的 Nonce。切勿对相同密钥重复使用 Nonce。<br><br><b>关联数据：</b>可选的附加数据，经认证但不加密。可用于包含元数据，如头部或时间戳。<br><br>输出包含密文和 128 位认证标签。";
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
                    {name: "原始", value: "Raw"},
                    "Hex"
                ]
            },
            {
                "name": "输出",
                "type": "option",
                "value": [
                    "Hex",
                    {name: "原始", value: "Raw"}
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     * @throws {OperationError} if invalid key or nonce length
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
        const inputUint8 = new Uint8Array(inputData);

        // Encrypt (returns Uint8Array containing ciphertext + tag)
        const ciphertext = JsAscon.encrypt(keyUint8, nonceUint8, adUint8, inputUint8);

        // Return in requested format
        if (outputType === "Hex") {
            return toHexFast(ciphertext);
        } else {
            return Utils.arrayBufferToStr(Uint8Array.from(ciphertext).buffer);
        }
    }

}

export default AsconEncrypt;
