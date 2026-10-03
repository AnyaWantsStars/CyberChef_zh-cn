/**
 * @author gchq77703 []
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */
import Operation from "../Operation.mjs";
import jwt from "jsonwebtoken";
import OperationError from "../errors/OperationError.mjs";
import {JWT_ALGORITHMS} from "../lib/JWT.mjs";


/**
 * JWT Sign operation
 */
class JWTSign extends Operation {

    /**
     * JWTSign constructor
     */
    constructor() {
        super();

        this.name = "JWT 签名";
        this.module = "Crypto";
        this.description = "使用提供的密钥/私钥将 JSON 对象签名为 JSON Web Token。<br><br>密钥应为 HMAC 算法的密钥或 RSA 和 ECDSA 的 PEM 编码私钥。";
        this.infoURL = "https://wikipedia.org/wiki/JSON_Web_Token";
        this.inputType = "JSON";
        this.outputType = "string";
        this.args = [
            {
                name: "私钥/密钥",
                type: "text",
                value: "secret"
            },
            {
                name: "签名算法",
                type: "option",
                value: JWT_ALGORITHMS
            },
            {
                name: "头部",
                type: "text",
                value: "{}"
            }
        ];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [key, algorithm, header] = args;

        try {
            return jwt.sign(input, key, {
                algorithm: algorithm === "None" ? "none" : algorithm,
                header: JSON.parse(header || "{}")
            });
        } catch (err) {
            throw new OperationError(`错误：密钥是否输入正确？密钥应为 HMAC 算法的密钥，或 RSA 与 ECDSA 的 PEM 编码私钥。

${err}`);
        }
    }

}

export default JWTSign;
