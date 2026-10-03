/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import bcrypt from "bcryptjs";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * Bcrypt operation
 */
class Bcrypt extends Operation {

    /**
     * Bcrypt constructor
     */
    constructor() {
        super();

        this.name = "Bcrypt";
        this.module = "Crypto";
        this.description = "bcrypt 是 Niels Provos 和 David Mazières 设计的密码哈希函数，基于 Blowfish 密码，于 1999 年在 USENIX 上发表。除了包含盐值以防止彩虹表攻击外，bcrypt 还是一个自适应函数：随着时间的推移，迭代次数（轮数）可以增加以使其更慢，从而即使在计算能力不断增加的情况下也能抵抗暴力搜索攻击。<br><br>在输入中输入密码以生成其哈希。";
        this.infoURL = "https://wikipedia.org/wiki/Bcrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "轮数", "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const rounds = args[0];
        const salt = await bcrypt.genSalt(rounds);

        return await bcrypt.hash(input, salt, undefined, p => {
            // Progress callback
            if (isWorkerEnvironment())
                self.sendStatusMessage(`进度: ${(p * 100).toFixed(0)}%`);
        });

    }

}

export default Bcrypt;
