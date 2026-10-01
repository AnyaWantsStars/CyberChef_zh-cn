/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import kbpgp from "kbpgp";
import { ASP, importPrivateKey, importPublicKey } from "../lib/PGP.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * PGP Encrypt and Sign operation
 */
class PGPEncryptAndSign extends Operation {

    /**
     * PGPEncryptAndSign constructor
     */
    constructor() {
        super();

        this.name = "PGP 加密并签名";
        this.module = "PGP";
        this.description = [
            "输入：要签名的明文。",
            "<br><br>",
            "参数：签名者的 ASCII-armoured 私钥（以及必要时私钥的密码）",
            "和收件人的 ASCII-armoured PGP 公钥。",
            "<br><br>",
            "此操作使用 PGP 生成加密的数字签名。",
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
                "name": "签名方私钥",
                "type": "text",
                "value": ""
            },
            {
                "name": "私钥密码",
                "type": "string",
                "value": ""
            },
            {
                "name": "接收方公钥",
                "type": "text",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if failure to sign message
     */
    async run(input, args) {
        const message = input,
            [privateKey, passphrase, publicKey] = args;
        let signedMessage;

        if (!privateKey) throw new OperationError("请输入签名者的私钥。");
        if (!publicKey) throw new OperationError("请输入接收者的公钥。");
        const privKey = await importPrivateKey(privateKey, passphrase);
        const pubKey = await importPublicKey(publicKey);

        try {
            signedMessage = await promisify(kbpgp.box)({
                "msg": message,
                "encrypt_for": pubKey,
                "sign_with": privKey,
                "asp": ASP
            });
        } catch (err) {
            throw new OperationError(`无法对消息签名：${err}`);
        }

        return signedMessage;
    }

}

export default PGPEncryptAndSign;
