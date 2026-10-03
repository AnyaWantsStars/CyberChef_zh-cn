/**
 * @author Tan Zhen Yong [tzy@beyondthesprawl.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import argon2 from "argon2-browser";

/**
 * Argon2 operation
 */
class Argon2 extends Operation {

    /**
     * Argon2 constructor
     */
    constructor() {
        super();

        this.name = "Argon2";
        this.module = "Crypto";
        this.description = "Argon2 是一种密钥派生函数，于 2015 年 7 月被选为密码哈希竞赛的获胜者。它由卢森堡大学的 Alex Biryukov、Daniel Dinu 和 Dmitry Khovratovich 设计。<br><br>在输入中输入密码以生成其哈希。";
        this.infoURL = "https://wikipedia.org/wiki/Argon2";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "盐值", "type": "toggleString",
                "value": "somesalt",
                "toggleValues": ["UTF8", "Hex", "Base64", "Latin1"]
            },
            {
                "name": "迭代次数",
                "type": "number",
                "value": 3
            },
            {
                "name": "内存（KiB）",
                "type": "number",
                "value": 4096
            },
            {
                "name": "并行度",
                "type": "number",
                "value": 1
            },
            {
                "name": "哈希长度（字节）",
                "type": "number",
                "value": 32
            },
            {
                "name": "类型", "type": "option",
                "value": ["Argon2i", "Argon2d", "Argon2id"],
                "defaultIndex": 0
            },
            {
                "name": "输出格式", "type": "option",
                "value": [
                    {name: "编码哈希", value: "Encoded hash"},
                    {name: "Hex 哈希", value: "Hex hash"},
                    {name: "原始哈希", value: "Raw hash"}
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const argon2Types = {
            "Argon2i": argon2.ArgonType.Argon2i,
            "Argon2d": argon2.ArgonType.Argon2d,
            "Argon2id": argon2.ArgonType.Argon2id
        };

        const salt = Utils.convertToByteString(args[0].string || "", args[0].option),
            time = args[1],
            mem = args[2],
            parallelism = args[3],
            hashLen = args[4],
            type = argon2Types[args[5]],
            outFormat = args[6];

        try {
            const result = await argon2.hash({
                pass: input,
                salt,
                time,
                mem,
                parallelism,
                hashLen,
                type,
            });

            switch (outFormat) {
                case "Hex hash":
                    return result.hashHex;
                case "Raw hash":
                    return Utils.arrayBufferToStr(result.hash);
                case "Encoded hash":
                default:
                    return result.encoded;
            }
        } catch (err) {
            throw new OperationError(`错误：${err.message}`);
        }
    }

}

export default Argon2;
