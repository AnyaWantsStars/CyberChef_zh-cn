/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as OTPAuth from "otpauth";

/**
 * Generate TOTP operation
 */
class GenerateTOTP extends Operation {
    /**
     *
     */
    constructor() {
        super();
        this.name = "生成 TOTP";
        this.module = "Default";
        this.description = "基于时间的一次性密码算法（TOTP）是一种从共享密钥和当前时间计算一次性密码的算法。它已被采纳为互联网工程任务组标准 RFC 6238，是开放式认证倡议（OAUTH）的基石，并用于许多双因素认证系统。TOTP 是一种计数器为当前时间的 HOTP。<br><br>输入密钥或留空以生成随机密钥。密钥必须是有效的 base32 字符串（字符 A–Z 和 2–7）。T0 和 T1 以秒为单位。";
        this.infoURL = "https://wikipedia.org/wiki/Time-based_One-time_Password_algorithm";
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
                "name": "时间偏移（T0）",
                "type": "number",
                "value": 0,
                "min": 0,
                "integer": true
            },
            {
                "name": "时间间隔（T1）",
                "type": "number",
                "value": 30,
                "min": 1,
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

        const totp = new OTPAuth.TOTP({
            issuer: "",
            label: args[0],
            algorithm: "SHA1",
            digits: args[1],
            period: args[3],
            epoch: args[2] * 1000, // Convert seconds to milliseconds
            secret
        });

        const uri = totp.toString();
        const code = totp.generate();

        return `URI: ${uri}\n\nPassword: ${code}`;
    }
}

export default GenerateTOTP;
