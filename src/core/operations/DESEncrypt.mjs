/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";

/**
 * DES Encrypt operation
 */
class DESEncrypt extends Operation {

    /**
     * DESEncrypt constructor
     */
    constructor() {
        super();

        this.name = "DES 加密";
        this.module = "Ciphers";
        this.description = "DES 曾是主流的加密算法，被发布为美国联邦信息处理标准（FIPS）。由于其密钥长度较短，现在被认为是不安全的。<br><br><b>密钥：</b>DES 使用 8 字节（64 位）的密钥长度。<br><br>您可以使用 KDF 操作生成基于密码的密钥。<br><br><b>IV：</b>初始化向量应为 8 字节。如果未输入，则默认为 8 个空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，将使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/Data_Encryption_Standard";
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
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            [,, mode, inputType, outputType] = args;

        if (key.length !== 8) {
            throw new OperationError(`无效密钥长度：${key.length} 字节

DES 使用 8 字节（64 位）的密钥长度。`);
        }
        if (iv.length !== 8 && mode !== "ECB") {
            throw new OperationError(`无效 IV 长度：${iv.length} 字节

DES 使用 8 字节（64 位）的 IV 长度。
请确保您已正确指定类型（例如 Hex 与 UTF8）。`);
        }

        input = Utils.convertToByteString(input, inputType);

        const cipher = forge.cipher.createCipher("DES-" + mode, key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        return outputType === "Hex" ? cipher.output.toHex() : cipher.output.getBytes();
    }

}

export default DESEncrypt;
