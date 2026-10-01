/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import { toHex } from "../lib/Hex.mjs";
import { decryptRC6, getBlockSize, getDefaultRounds } from "../lib/RC6.mjs";

/**
 * RC6 Decrypt operation
 */
class RC6Decrypt extends Operation {

    /**
     * RC6Decrypt constructor
     */
    constructor() {
        super();

        this.name = "RC6 解密";
        this.module = "Ciphers";
        this.description = "RC6 是从 RC5 派生出的对称密钥分组密码。由 Ron Rivest、Matt Robshaw、Ray Sidney 和 Yiqun Lisa Yin 设计，以满足 AES 竞赛的要求，并成为五个最终入围者之一。<br><br>RC6 参数化为 RC6-w/r/b，其中 w 是字大小（位，8 的倍数，8-256），r 是轮数（1-255），b 是密钥长度（字节）。标准 AES 提交使用 w=32，r=20。常见字大小：8、16、32（标准）、64、128。<br><br><b>IV：</b>初始化向量应为 4*w/8 字节（例如 w=32 时为 16 字节）。如果未输入，则默认为空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，使用 PKCS#7 填充方案。";
        this.infoURL = "https://wikipedia.org/wiki/RC6";
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
            },
            {
                "name": "字大小",
                "type": "number",
                "value": 32,
                "min": 8,
                "max": 256,
                "step": 8
            },
            {
                "name": "轮数", "type": "number",
                "value": 20,
                "min": 1,
                "max": 255
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
            [,, mode, inputType, outputType, padding, wordSize, rounds] = args;

        // Validate word size
        if (!Number.isInteger(wordSize) || wordSize < 8 || wordSize > 256 || wordSize % 8 !== 0)
            throw new OperationError(`无效字大小：${wordSize}。必须为 8 到 256 之间 8 的倍数。`);

        const blockSize = getBlockSize(wordSize);
        const defaultRounds = getDefaultRounds(wordSize);

        if (iv.length !== blockSize && iv.length !== 0 && mode !== "ECB")
            throw new OperationError(`无效 IV 长度：${iv.length} 字节。

RC6-${wordSize} 使用 ${blockSize} 字节（${blockSize * 8} 位）的 IV 长度。
请确保您已正确指定类型（例如 Hex 与 UTF8）。`);

        if (!Number.isInteger(rounds) || rounds < 1 || rounds > 255)
            throw new OperationError(`无效轮数：${rounds}

轮数必须为 1 到 255 之间的整数。w=${wordSize} 的标准值为 ${defaultRounds}。`);

        // Default IV to null bytes if empty (like AES)
        const actualIv = iv.length === 0 ? new Array(blockSize).fill(0) : iv;

        input = Utils.convertToByteArray(input, inputType);
        const output = decryptRC6(input, key, actualIv, mode, padding, rounds, wordSize);
        return outputType === "Hex" ? toHex(output, "") : Utils.byteArrayToUtf8(output);
    }

}

export default RC6Decrypt;
