/**
 * @author mikecat
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import CryptoApi from "crypto-api/src/crypto-api.mjs";

/**
 * Derive HKDF Key operation
 */
class DeriveHKDFKey extends Operation {

    /**
     * DeriveHKDFKey constructor
     */
    constructor() {
        super();

        this.name = "派生 HKDF 密钥";
        this.module = "Crypto";
        this.description = "一种简单的基于哈希消息认证码（HMAC）的密钥派生函数（HKDF），定义于 RFC5869。";
        this.infoURL = "https://wikipedia.org/wiki/HKDF";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "盐值",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "Decimal", "Base64", "UTF8", "Latin1"]
            },
            {
                "name": "信息",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "Decimal", "Base64", "UTF8", "Latin1"]
            },
            {
                "name": "哈希函数",
                "type": "option",
                "value": [
                    "MD2",
                    "MD4",
                    "MD5",
                    "SHA0",
                    "SHA1",
                    "SHA224",
                    "SHA256",
                    "SHA384",
                    "SHA512",
                    "SHA512/224",
                    "SHA512/256",
                    "RIPEMD128",
                    "RIPEMD160",
                    "RIPEMD256",
                    "RIPEMD320",
                    "HAS160",
                    "Whirlpool",
                    "Whirlpool-0",
                    "Whirlpool-T",
                    "Snefru"
                ],
                "defaultIndex": 6
            },
            {
                "name": "提取模式",
                "type": "argSelector",
                "value": [
                    {
                        "name": "带盐",
                        "on": [0]
                    },
                    {
                        "name": "无盐",
                        "off": [0]
                    },
                    {
                        "name": "跳过",
                        "off": [0]
                    }
                ]
            },
            {
                "name": "L（输出八位字节数）",
                "type": "number",
                "value": 16,
                "min": 0
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const argSalt = Utils.convertToByteString(args[0].string || "", args[0].option),
            info = Utils.convertToByteString(args[1].string || "", args[1].option),
            hashFunc = args[2].toLowerCase(),
            extractMode = args[3],
            L = args[4],
            IKM = Utils.arrayBufferToStr(input, false),
            hasher = CryptoApi.getHasher(hashFunc),
            HashLen = hasher.finalize().length;

        if (L < 0) {
            throw new OperationError("L 必须为非负数");
        }
        if (L > 255 * HashLen) {
            throw new OperationError("L 过大（最大长度为 " + args[2] + " is " + (255 * HashLen) + ")");
        }

        const hmacHash = function(key, data) {
            hasher.reset();
            const mac = CryptoApi.getHmac(key, hasher);
            mac.update(data);
            return mac.finalize();
        };
        const salt = extractMode === "with salt" ? argSalt : "\0".repeat(HashLen);
        const PRK = extractMode === "skip" ? IKM : hmacHash(salt, IKM);
        let T = "";
        let result = "";
        for (let i = 1; i <= 255 && result.length < L; i++) {
            const TNext = hmacHash(PRK, T + info + String.fromCharCode(i));
            result += TNext;
            T = TNext;
        }
        return CryptoApi.encoder.toHex(result.substring(0, L));
    }

}

export default DeriveHKDFKey;
