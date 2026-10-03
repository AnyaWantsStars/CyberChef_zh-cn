/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import bcrypt from "bcryptjs";
import { isWorkerEnvironment } from "../Utils.mjs";


/**
 * Bcrypt compare operation
 */
class BcryptCompare extends Operation {

    /**
     * BcryptCompare constructor
     */
    constructor() {
        super();

        this.name = "Bcrypt 比较";
        this.module = "Crypto";
        this.description = "测试输入是否与给定的 bcrypt 哈希匹配。要测试多个可能的密码，请使用「分支」操作。";
        this.infoURL = "https://wikipedia.org/wiki/Bcrypt";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "哈希",
                "type": "string",
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
        const hash = args[0];

        let match;
        try {
            match = await bcrypt.compare(input, hash, undefined, p => {
                // Progress callback
                if (isWorkerEnvironment())
                    self.sendStatusMessage(`进度: ${(p * 100).toFixed(0)}%`);
            });
        } catch (err) {
            throw new OperationError(err.toString());
        }

        return match ? "匹配：" + input : "无匹配";

    }

}

export default BcryptCompare;
