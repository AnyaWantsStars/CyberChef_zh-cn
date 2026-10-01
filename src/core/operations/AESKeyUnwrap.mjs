/**
 * @author mikecat
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { toHexFast } from "../lib/Hex.mjs";
import forge from "node-forge";
import OperationError from "../errors/OperationError.mjs";

/**
 * AES Key Unwrap operation
 */
class AESKeyUnwrap extends Operation {

    /**
     * AESKeyUnwrap constructor
     */
    constructor() {
        super();

        this.name = "AES 密钥解包";
        this.module = "Ciphers";
        this.description = "RFC3394 定义的密钥封装算法解密器，用于在不可信存储或通信中保护密钥，使用 AES。<br><br>此算法使用 AES 密钥（KEK：密钥加密密钥）和 64 位 IV 来解密 64 位块。";
        this.infoURL = "https://wikipedia.org/wiki/Key_wrap";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥加密密钥",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "初始向量", "type": "toggleString",
                "value": "a6a6a6a6a6a6a6a6",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "输入", "type": "option",
                "value": [
                    "Hex",
                    {name: "原始", value: "Raw"}
                ]
            },
            {
                "name": "输出",
                "type": "option",
                "value": [
                    "Hex",
                    {name: "原始", value: "Raw"}
                ]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const kek = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            inputType = args[2],
            outputType = args[3];

        if (kek.length !== 16 && kek.length !== 24 && kek.length !== 32) {
            throw new OperationError("KEK（密钥加密密钥）必须为 16、24 或 32 字节（当前为 " + kek.length + " bytes)");
        }
        if (iv.length !== 8) {
            throw new OperationError("IV（初始化向量）必须为 8 字节（当前为 " + iv.length + " bytes)");
        }
        const inputData = Utils.convertToByteString(input, inputType);
        if (inputData.length % 8 !== 0 || inputData.length < 24) {
            throw new OperationError("输入长度必须为 8n（n≥3）字节（当前为 " + inputData.length + " bytes)");
        }

        const cipher = forge.cipher.createCipher("AES-ECB", kek);
        cipher.start();
        cipher.update(forge.util.createBuffer(""));
        cipher.finish();
        const paddingBlock = cipher.output.getBytes();

        const decipher = forge.cipher.createDecipher("AES-ECB", kek);

        let A = inputData.substring(0, 8);
        const R = [];
        for (let i = 8; i < inputData.length; i += 8) {
            R.push(inputData.substring(i, i + 8));
        }
        let cntLower = R.length >>> 0;
        let cntUpper = (R.length / ((1 << 30) * 4)) >>> 0;
        cntUpper = cntUpper * 6 + ((cntLower * 6 / ((1 << 30) * 4)) >>> 0);
        cntLower = cntLower * 6 >>> 0;
        for (let j = 5; j >= 0; j--) {
            for (let i = R.length - 1; i >= 0; i--) {
                const aBuffer = Utils.strToArrayBuffer(A);
                const aView = new DataView(aBuffer);
                aView.setUint32(0, aView.getUint32(0) ^ cntUpper);
                aView.setUint32(4, aView.getUint32(4) ^ cntLower);
                A = Utils.arrayBufferToStr(aBuffer, false);
                decipher.start();
                decipher.update(forge.util.createBuffer(A + R[i] + paddingBlock));
                decipher.finish();
                const B = decipher.output.getBytes();
                A = B.substring(0, 8);
                R[i] = B.substring(8, 16);
                cntLower--;
                if (cntLower < 0) {
                    cntUpper--;
                    cntLower = 0xffffffff;
                }
            }
        }
        if (A !== iv) {
            throw new OperationError("IV 不匹配");
        }
        const P = R.join("");

        if (outputType === "Hex") {
            return toHexFast(Utils.strToArrayBuffer(P));
        }
        return P;
    }

}

export default AESKeyUnwrap;
