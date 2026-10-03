/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import forge from "node-forge";
import { MD_ALGORITHMS } from "../lib/RSA.mjs";
import Utils from "../Utils.mjs";

/**
 * RSA Verify operation
 */
class RSAVerify extends Operation {

    /**
     * RSAVerify constructor
     */
    constructor() {
        super();

        this.name = "RSA 验证";
        this.module = "Ciphers";
        this.description = "使用 PEM 编码的 RSA 公钥验证消息与签名。";
        this.infoURL = "https://wikipedia.org/wiki/RSA_(cryptosystem)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "RSA 公钥（PEM）",
                type: "text",
                value: "-----BEGIN RSA PUBLIC KEY-----"
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
            },
            {
                name: "消息摘要算法",
                type: "option",
                value: Object.keys(MD_ALGORITHMS)
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [pemKey, message, format, mdAlgo] = args;
        if (pemKey.replace("-----BEGIN RSA PUBLIC KEY-----", "").length === 0) {
            throw new OperationError("请输入公钥。");
        }
        try {
            // Load public key
            const pubKey = forge.pki.publicKeyFromPem(pemKey);
            // Generate message digest
            const md = MD_ALGORITHMS[mdAlgo].create();
            const messageStr = Utils.convertToByteString(message, format);
            md.update(messageStr, "raw");
            // Compare signed message digest and generated message digest
            const result = pubKey.verify(md.digest().bytes(), input);
            return result ? "验证通过" : "验证失败";
        } catch (err) {
            if (err.message === "Encrypted message length is invalid.") {
                throw new OperationError(`签名长度（${err.length}）与基于密钥的预期长度（${err.expected}）不匹配。`);
            }
            throw new OperationError(err);
        }
    }

}

export default RSAVerify;
