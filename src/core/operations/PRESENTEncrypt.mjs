/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { encryptPRESENT } from "../lib/Present.mjs";

/**
 * PRESENT Encrypt operation
 */
class PRESENTEncrypt extends Operation {

    /**
     * PRESENTEncrypt constructor
     */
    constructor() {
        super();

        this.name = "PRESENT 加密";
        this.module = "Ciphers";
        this.description = "PRESENT 是一种超轻量级分组密码，专为 RFID 标签和传感器网络等受限环境设计。它使用 64 位分组，支持 80 位或 128 位密钥，共 31 轮。已标准化为 ISO/IEC 29192-2:2019。<br><br>使用 CBC 模式时，将采用 PKCS#7 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/PRESENT_(cipher)";
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
                "value": ["CBC", "ECB"]
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

        if (key.length !== 10 && key.length !== 16)
            throw new OperationError(`无效密钥长度：${key.length} 字节

PRESENT 使用 10 字节（80 位）或 16 字节（128 位）的密钥长度。`);

        if (iv.length !== 8 && mode !== "ECB")
            throw new OperationError(`无效 IV 长度：${iv.length} 字节。

PRESENT 使用 8 字节（64 位）的 IV 长度。
请确保您已正确指定类型（例如 Hex 与 UTF8）。`);

        input = Utils.convertToByteArray(input, inputType);
        const output = encryptPRESENT(input, key, iv, mode, padding);
        return outputType === "Hex" ? toHex(output, "") : Utils.byteArrayToUtf8(output);
    }

}

export default PRESENTEncrypt;
