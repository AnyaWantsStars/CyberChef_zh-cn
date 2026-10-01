/**
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

import kbpgp from "kbpgp";
import { ASP, importPublicKey } from "../lib/PGP.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Verify operation
 */
class PGPVerify extends Operation {

    /**
     * PGPVerify constructor
     */
    constructor() {
        super();

        this.name = "PGP 验证";
        this.module = "PGP";
        this.description = [
            "输入：要验证的 ASCII-armoured 加密 PGP 消息。",
            "<br><br>",
            "参数：签名方的 ASCII-armoured PGP 公钥。",
            "<br><br>",
            "此操作使用 PGP 解密已清晰签名的消息。",
            "<br><br>",
            "Pretty Good Privacy 是一种加密标准（OpenPGP），用于加密、解密和签名消息。",
            "<br><br>",
            "此函数使用 Keybase 的 PGP 实现。",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "签名方公钥",
                "type": "text",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const signedMessage = input,
            [publicKey] = args,
            keyring = new kbpgp.keyring.KeyRing();
        let unboxedLiterals;

        if (!publicKey) throw new OperationError("请输入签名者的公钥。");
        const pubKey = await importPublicKey(publicKey);
        keyring.add_key_manager(pubKey);

        try {
            unboxedLiterals = await promisify(kbpgp.unbox)({
                armored: signedMessage,
                keyfetch: keyring,
                asp: ASP
            });
            const ds = unboxedLiterals[0].get_data_signer();
            if (ds) {
                const km = ds.get_key_manager();
                if (km) {
                    const signer = km.get_userids_mark_primary()[0].components;
                    let text = "签名者: ";
                    if (signer.email || signer.username || signer.comment) {
                        if (signer.username) {
                            text += `${signer.username} `;
                        }
                        if (signer.comment) {
                            text += `(${signer.comment}) `;
                        }
                        if (signer.email) {
                            text += `<${signer.email}>`;
                        }
                        text += "\n";
                    }
                    text += [
                        `PGP key ID: ${km.get_pgp_short_key_id()}`,
                        `PGP fingerprint: ${km.get_pgp_fingerprint().toString("hex")}`,
                        `Signed on ${new Date(ds.sig.when_generated() * 1000).toUTCString()}`,
                        "----------------------------------\n"
                    ].join("\n");
                    text += unboxedLiterals.toString();
                    return text.trim();
                } else {
                    throw new OperationError("无法识别密钥管理器。");
                }
            } else {
                throw new OperationError("数据似乎未经签名。");
            }
        } catch (err) {
            throw new OperationError(`无法验证消息：${err}`);
        }
    }

}

export default PGPVerify;
