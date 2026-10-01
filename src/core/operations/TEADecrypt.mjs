/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { decryptTEA, TEA_BLOCK_SIZE } from "../lib/TEA.mjs";

/**
 * TEA Decrypt operation
 */
class TEADecrypt extends Operation {

    /**
     * TEADecrypt constructor
     */
    constructor() {
        super();

        this.name = "TEA 解密";
        this.module = "Ciphers";
        this.description = "TEA（微型加密算法）是一种由 David Wheeler 和 Roger Needham 于 1994 年设计的分组密码。它使用 128 位密钥对 64 位分组进行操作，执行 32 个周期（64 轮 Feistel 轮），使用源自黄金比例的 DELTA 常量 0x9E3779B9。<br><br>TEA 以其简洁和紧凑的实现著称，因此在恶意软件分析和 CTF 挑战中经常遇到。尽管设计优雅，TEA 存在已知弱点，包括等效密钥和易受相关密钥攻击，从而催生了后继者 XTEA 和 XXTEA。<br><br><b>密钥：</b>必须恰好为 16 字节（128 位）。<br><br><b>IV：</b>初始化向量应为 8 字节（64 位）。如果未输入，则默认为空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，使用 PKCS#5 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/Tiny_Encryption_Algorithm";
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

        if (key.length !== 16)
            throw new OperationError(`无效密钥长度：${key.length} 字节。

TEA 需要 16 字节（128 位）的密钥长度。
请确保您已正确指定类型（例如 Hex 与 UTF8）。`);

        if (iv.length !== TEA_BLOCK_SIZE && iv.length !== 0 && mode !== "ECB")
            throw new OperationError(`无效 IV 长度：${iv.length} 字节

TEA 使用 ${TEA_BLOCK_SIZE} 字节（${TEA_BLOCK_SIZE * 8} 位）的 IV 长度。
请确保您正确指定了类型（例如 Hex 与 UTF8）。`);

        // Default IV to null bytes if empty (like AES)
        const actualIv = iv.length === 0 ? new Array(TEA_BLOCK_SIZE).fill(0) : iv;

        input = Utils.convertToByteArray(input, inputType);
        const output = decryptTEA(input, key, actualIv, mode, padding);
        return outputType === "Hex" ? toHex(output, "") : Utils.byteArrayToUtf8(output);
    }

}

export default TEADecrypt;
