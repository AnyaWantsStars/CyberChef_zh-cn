/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";
import OperationError from "../errors/OperationError.mjs";
import { toHexFast } from "../lib/Hex.mjs";

/**
 * AES Encrypt operation
 */
class AESEncrypt extends Operation {

    /**
     * AESEncrypt constructor
     */
    constructor() {
        super();

        this.name = "AES 加密";
        this.module = "Ciphers";
        this.description = "高级加密标准（AES）是美国联邦信息处理标准（FIPS）。经过 5 年对 15 个竞争设计的评估后选出。<br><br><b>密钥：</b>根据密钥大小使用以下算法：<ul><li>16 字节 = AES-128</li><li>24 字节 = AES-192</li><li>32 字节 = AES-256</li></ul>您可以使用 KDF 操作生成基于密码的密钥。<br><br><b>IV：</b>初始化向量应为 16 字节。如果未输入，则默认为 16 个空字节。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，将使用 PKCS#7 填充。";
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
                "name": "模式", "type": "argSelector",
                "value": [
                    {
                        name: "CBC",
                        off: [5]
                    },
                    {
                        name: "CFB",
                        off: [5]
                    },
                    {
                        name: "OFB",
                        off: [5]
                    },
                    {
                        name: "CTR",
                        off: [5]
                    },
                    {
                        name: "GCM",
                        on: [5]
                    },
                    {
                        name: "ECB",
                        off: [5]
                    },
                    {
                        name: "CBC/NoPadding",
                        off: [5]
                    },
                    {
                        name: "ECB/NoPadding",
                        off: [5]
                    }
                ]
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
                "name": "附加认证数据",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "输出包含 IV",
                "type": "option",
                "value": [
                    {name: "关", value: "Off"},
                    {name: "前置", value: "Prepend"},
                    {name: "追加", value: "Append"}
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if invalid key length
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            mode = args[2].split("/")[0],
            noPadding = args[2].endsWith("NoPadding"),
            inputType = args[3],
            outputType = args[4],
            aad = Utils.convertToByteString(args[5].string, args[5].option),
            includeIV = args[6];

        if ([16, 24, 32].indexOf(key.length) < 0) {
            throw new OperationError(`无效密钥长度：${key.length} 字节

将根据密钥大小使用以下算法：
  16 字节 = AES-128
  24 字节 = AES-192
  32 字节 = AES-256`);
        }

        input = Utils.convertToByteString(input, inputType);

        // Handle NoPadding modes
        if (noPadding && input.length % 16 !== 0) {
            throw new OperationError("对于 NoPadding 模式，输入长度必须为 16 字节的倍数。");
        }
        const cipher = forge.cipher.createCipher("AES-" + mode, key);
        cipher.start({
            iv: iv,
            additionalData: mode === "GCM" ? aad : undefined
        });
        if (noPadding) {
            cipher.mode.pad = function (output, options) {
                return true;
            };
        }
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        let output = cipher.output.getBytes();

        if (includeIV === "Prepend") {
            output = iv + output;
        } else if (includeIV === "Append") {
            output = output + iv;
        }

        if (outputType === "Hex") {
            output = toHexFast(Utils.strToByteArray(output));

            if (mode === "GCM") {
                return output + "\n\n" +
                    "标签: " + cipher.mode.tag.toHex();
            }
        } else if (mode === "GCM") {
            return output + "\n\n" +
                "标签: " + cipher.mode.tag.getBytes();
        }

        return output;
    }

}

export default AESEncrypt;
