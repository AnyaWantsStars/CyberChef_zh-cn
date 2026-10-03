/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";
import OperationError from "../errors/OperationError.mjs";

/**
 * AES Decrypt operation
 */
class AESDecrypt extends Operation {

    /**
     * AESDecrypt constructor
     */
    constructor() {
        super();

        this.name = "AES 解密";
        this.module = "Ciphers";
        this.description = "高级加密标准（AES）是美国联邦信息处理标准（FIPS）。经过 5 年对 15 个竞争设计的评估后选出。<br><br><b>密钥：</b>根据密钥大小使用以下算法：<ul><li>16 字节 = AES-128</li><li>24 字节 = AES-192</li><li>32 字节 = AES-256</li></ul><br><br><b>IV：</b>初始化向量应为 16 字节。如果未输入，则默认为 16 个空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，默认使用 PKCS#7 填充。<br><br><b>GCM 标签：</b>除非使用 GCM 模式，否则忽略此字段。";
        this.infoURL = "https://wikipedia.org/wiki/Advanced_Encryption_Standard";
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
                "name": "IV 长度",
                "type": "number",
                "value": 16
            },
            {
                "name": "模式", "type": "argSelector",
                "value": [
                    {
                        name: "CBC",
                        off: [6, 7]
                    },
                    {
                        name: "CFB",
                        off: [6, 7]
                    },
                    {
                        name: "OFB",
                        off: [6, 7]
                    },
                    {
                        name: "CTR",
                        off: [6, 7]
                    },
                    {
                        name: "GCM",
                        on: [6, 7]
                    },
                    {
                        name: "ECB",
                        off: [6, 7]
                    },
                    {
                        name: "CBC/NoPadding",
                        off: [6, 7]
                    },
                    {
                        name: "ECB/NoPadding",
                        off: [6, 7]
                    }
                ]
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
                "name": "GCM 标签",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "附加认证数据",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "IV 来自输入",
                "type": "argSelector",
                "value": [
                    {name: "关", value: "Off", on: [1], off: [2]},
                    {name: "前置", value: "From start", on: [2], off: [1]},
                    {name: "追加", value: "From end", on: [2], off: [1]}
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if cannot decrypt input or invalid key length
     */
    run(input, args) {
        let iv;

        const key = Utils.convertToByteString(args[0].string, args[0].option),
            ivLength = args[2],
            mode = args[3].split("/")[0],
            noPadding = args[3].endsWith("NoPadding"),
            inputType = args[4],
            outputType = args[5],
            gcmTag = Utils.convertToByteString(args[6].string, args[6].option),
            aad = Utils.convertToByteString(args[7].string, args[7].option),
            ivFromInput = args[8];


        if ([16, 24, 32].indexOf(key.length) < 0) {
            throw new OperationError(`无效密钥长度：${key.length} 字节

将根据密钥大小使用以下算法：
  16 字节 = AES-128
  24 字节 = AES-192
  32 字节 = AES-256`);
        }

        input = Utils.convertToByteString(input, inputType);

        if (ivFromInput !== "Off") {
            if (input.length <= ivLength) {
                throw new OperationError(`输入太短，无法包含 ${ivLength} 字节的 IV。`);
            }

            if (ivFromInput === "From start") {
                iv = input.substr(0, ivLength);
                input = input.substr(ivLength);
            } else {
                iv = input.substr(input.length - ivLength);
                input = input.substr(0, input.length - ivLength);
            }
        } else {
            iv = Utils.convertToByteString(args[1].string, args[1].option);
        }

        const decipher = forge.cipher.createDecipher("AES-" + mode, key);

        /* Allow for a "no padding" mode */
        if (noPadding) {
            decipher.mode.unpad = function (output, options) {
                return true;
            };
        }

        decipher.start({
            iv: iv.length === 0 ? "" : iv,
            tag: mode === "GCM" ? gcmTag : undefined,
            additionalData: mode === "GCM" ? aad : undefined
        });
        decipher.update(forge.util.createBuffer(input));
        const result = decipher.finish();

        if (result) {
            return outputType === "Hex" ? decipher.output.toHex() : decipher.output.getBytes();
        } else {
            throw new OperationError("无法使用这些参数解密输入。");
        }
    }

}

export default AESDecrypt;
