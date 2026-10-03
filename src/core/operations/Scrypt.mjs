/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import scryptsy from "scryptsy";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Scrypt operation
 */
class Scrypt extends Operation {

    /**
     * Scrypt constructor
     */
    constructor() {
        super();

        this.name = "Scrypt";
        this.module = "Crypto";
        this.description = "scrypt 是 Colin Percival 创建的基于密码的密钥派生函数（PBKDF）。该算法专门设计为通过需要大量内存来使大规模定制硬件攻击成本高昂。2016 年，scrypt 算法由 IETF 发布为 RFC 7914。<br><br>在输入中输入密码以生成其哈希。";
        this.infoURL = "https://wikipedia.org/wiki/Scrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "盐值", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "Base64", "UTF8", "Latin1"]
            },
            {
                "name": "迭代次数（N）",
                "type": "number",
                "value": 16384
            },
            {
                "name": "内存因子（r）",
                "type": "number",
                "value": 8
            },
            {
                "name": "并行因子（p）",
                "type": "number",
                "value": 1
            },
            {
                "name": "密钥长度",
                "type": "number",
                "value": 64
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const salt = Buffer.from(Utils.convertToByteArray(args[0].string || "", args[0].option)),
            iterations = args[1],
            memFactor = args[2],
            parallelFactor = args[3],
            keyLength = args[4];

        try {
            const data = scryptsy(
                input, salt, iterations, memFactor, parallelFactor, keyLength,
                p => {
                    // Progress callback
                    if (isWorkerEnvironment())
                        self.sendStatusMessage(`进度: ${p.percent.toFixed(0)}%`);
                }
            );

            return data.toString("hex");
        } catch (err) {
            throw new OperationError("错误：" + err.toString());
        }
    }

}

export default Scrypt;
