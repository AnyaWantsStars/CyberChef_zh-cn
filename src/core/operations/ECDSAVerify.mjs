/**
 * @author cplussharp
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { fromBase64 } from "../lib/Base64.mjs";
import { toHexFast } from "../lib/Hex.mjs";
import r from "jsrsasign";
import Utils from "../Utils.mjs";

/**
 * ECDSA Verify operation
 */
class ECDSAVerify extends Operation {

    /**
     * ECDSAVerify constructor
     */
    constructor() {
        super();

        this.name = "ECDSA 验证";
        this.module = "Ciphers";
        this.description = "使用签名和 PEM 编码的 EC 公钥验证消息。";
        this.infoURL = "https://wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "输入格式",
                type: "option",
                value: [{name: "自动", value: "Auto"}, "ASN.1 HEX", "P1363 HEX", {name: "JSON Web 签名", value: "JSON Web Signature"}, {name: "原始 JSON", value: "Raw JSON"}]
            },
            {
                name: "消息摘要算法",
                type: "option",
                value: ["SHA-256", "SHA-384", "SHA-512", "SHA-1", "MD5"]
            },
            {
                name: "ECDSA公钥（PEM）",
                type: "text",
                value: "-----BEGIN PUBLIC KEY-----"
            },
            {
                name: "消息",
                type: "text",
                value: ""
            },
            {
                name: "消息格式",
                type: "option",
                value: [{name: "原始", value: "Raw"}, "Hex", "Base64"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let inputFormat = args[0];
        const [, mdAlgo, keyPem, msg, msgFormat] = args;

        if (keyPem.replace("-----BEGIN PUBLIC KEY-----", "").length === 0) {
            throw new OperationError("请输入公钥。");
        }

        // detect input format
        let inputJson;
        if (inputFormat === "Auto") {
            try {
                inputJson = JSON.parse(input);
                if (typeof(inputJson) === "object") {
                    inputFormat = "Raw JSON";
                }
            } catch {}
        }

        if (inputFormat === "Auto") {
            const hexRegex = /^[a-f\d]{2,}$/gi;
            if (hexRegex.test(input)) {
                if (input.substring(0, 2) === "30" && r.ASN1HEX.isASN1HEX(input)) {
                    inputFormat = "ASN.1 HEX";
                } else {
                    inputFormat = "P1363 HEX";
                }
            }
        }

        let inputBase64;
        if (inputFormat === "Auto") {
            try {
                inputBase64 = fromBase64(input, "A-Za-z0-9-_", false);
                inputFormat = "JSON Web Signature";
            } catch {}
        }

        // convert to ASN.1 signature
        let signatureASN1Hex;
        switch (inputFormat) {
            case "Auto":
                throw new OperationError("无法检测签名格式");
            case "ASN.1 HEX":
                signatureASN1Hex = input;
                break;
            case "P1363 HEX":
                signatureASN1Hex = r.KJUR.crypto.ECDSA.concatSigToASN1Sig(input);
                break;
            case "JSON Web Signature":
                if (!inputBase64) inputBase64 = fromBase64(input, "A-Za-z0-9-_");
                signatureASN1Hex = r.KJUR.crypto.ECDSA.concatSigToASN1Sig(toHexFast(inputBase64));
                break;
            case "Raw JSON": {
                if (!inputJson) inputJson = JSON.parse(input);
                if (!inputJson.r) {
                    throw new OperationError('签名 JSON 中缺少 "r" 值');
                }
                if (!inputJson.s) {
                    throw new OperationError('签名 JSON 中缺少 "s" 值');
                }
                signatureASN1Hex = r.KJUR.crypto.ECDSA.hexRSSigToASN1Sig(inputJson.r, inputJson.s);
                break;
            }
        }

        // verify signature
        const internalAlgorithmName = mdAlgo.replace("-", "") + "withECDSA";
        const sig = new r.KJUR.crypto.Signature({ alg: internalAlgorithmName });
        const key = r.KEYUTIL.getKey(keyPem);
        if (key.type !== "EC") {
            throw new OperationError("提供的密钥不是 EC 密钥。");
        }
        if (!key.isPublic) {
            throw new OperationError("提供的密钥不是公钥。");
        }
        sig.init(key);
        const messageStr = Utils.convertToByteString(msg, msgFormat);
        sig.updateString(messageStr);
        const result = sig.verify(signatureASN1Hex);
        return result ? "验证通过" : "验证失败";
    }
}

export default ECDSAVerify;
