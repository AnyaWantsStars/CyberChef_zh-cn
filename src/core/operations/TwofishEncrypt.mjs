/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { encryptTwofish } from "../lib/Twofish.mjs";

/**
 * Twofish Encrypt operation
 */
class TwofishEncrypt extends Operation {

    /**
     * TwofishEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Twofish 加密";
        this.module = "Ciphers";
        this.description = "Twofish 是一种由 Bruce Schneier 设计的对称密钥分组密码。它是五个 AES 决赛入围者之一。Twofish 使用 128 位分组，支持 128、192 或 256 位密钥，共 16 轮 Feistel 网络。<br><br>使用 CBC 或 ECB 模式时，将采用 PKCS#7 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/Twofish";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "初始向量", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "模式", "type": "option",
                "value": ["CBC", "CFB", "OFB", "CTR", "ECB"]
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
            },
            {
                "name": "填充", "type": "option",
                "value": ["PKCS5", {name: "无", value: "NO"}, {name: "零", value: "ZERO"}, {name: "随机", value: "RANDOM"}, "BIT"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteArray(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            [,, mode, inputType, outputType, padding] = args;

        if (key.length !== 16 && key.length !== 24 && key.length !== 32)
            throw new OperationError(`无效密钥长度：${key.length} 字节

Twofish 使用 16 字节（128 位）、24 字节（192 位）或 32 字节（256 位）的密钥长度。`);

        if (iv.length !== 16 && mode !== "ECB")
            throw new OperationError(`无效 IV 长度：${iv.length} 字节。

Twofish 使用 16 字节（128 位）的 IV 长度。
请确保您已正确指定类型（例如 Hex 与 UTF8）。`);

        input = Utils.convertToByteArray(input, inputType);
        const output = encryptTwofish(input, key, iv, mode, padding);
        return outputType === "Hex" ? toHex(output, "") : Utils.byteArrayToUtf8(output);
    }

}

export default TwofishEncrypt;
