/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as OTPAuth from "otpauth";

/**
 * Generate HOTP operation
 */
class GenerateHOTP extends Operation {
    /**
     *
     */
    constructor() {
        super();

        this.name = "生成 HOTP";
        this.module = "Default";
        this.description = "基于 HMAC 的一次性密码算法（HOTP）是一种从共享密钥和递增计数器计算一次性密码的算法。它已被采纳为互联网工程任务组标准 RFC 4226，是开放式认证倡议（OAUTH）的基石，并用于许多双因素认证系统。<br><br>输入密钥或留空以生成随机密钥。密钥必须是有效的 base32 字符串（字符 A–Z 和 2–7）。";
        this.infoURL = "https://wikipedia.org/wiki/HMAC-based_One-time_Password_algorithm";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "名称",
                "type": "string",
                "value": "Account",
                "allowEmpty": false
            },
            {
                "name": "编码长度",
                "type": "number",
                "value": 6,
                "min": 6,
                "max": 8,
                "integer": true
            },
            {
                "name": "计数器",
                "type": "number",
                "value": 0,
                "min": 0,
                "integer": true
            }
        ];
    }

    /**
     *
     */
    run(input, args) {
        const secretStr = new TextDecoder("utf-8").decode(input).trim();

        let secret;
        try {
            secret = secretStr ?
                OTPAuth.Secret.fromBase32(secretStr.toUpperCase().replace(/\s+/g, "")) :
                new OTPAuth.Secret();
        } catch {
            throw new OperationError("无效的密钥。输入必须是有效的 base32 字符串（字符 A–Z 和 2–7）。");
        }

        const hotp = new OTPAuth.HOTP({
            issuer: "",
            label: args[0],
            algorithm: "SHA1",
            digits: args[1],
            counter: args[2],
            secret
        });

        const uri = hotp.toString();
        const code = hotp.generate();

        return `URI：${uri}\n\n密码：${code}`;
    }
}

export default GenerateHOTP;
