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
 * AES Key Wrap operation
 */
class AESKeyWrap extends Operation {

    /**
     * AESKeyWrap constructor
     */
    constructor() {
        super();

        this.name = "AES 密钥包装";
        this.module = "Ciphers";
        this.description = "RFC3394 定义的密钥封装算法，用于在不可信存储或通信中保护密钥，使用 AES。<br><br>此算法使用 AES 密钥（KEK：密钥加密密钥）和 64 位 IV 来加密 64 位块。";
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
        if (inputData.length % 8 !== 0 || inputData.length < 16) {
            throw new OperationError("输入长度必须为 8n（n≥2）字节（当前为 " + inputData.length + " bytes)");
        }

        const cipher = forge.cipher.createCipher("AES-ECB", kek);

        let A = iv;
        const R = [];
        for (let i = 0; i < inputData.length; i += 8) {
            R.push(inputData.substring(i, i + 8));
        }
        let cntLower = 1, cntUpper = 0;
        for (let j = 0; j < 6; j++) {
            for (let i = 0; i < R.length; i++) {
                cipher.start();
                cipher.update(forge.util.createBuffer(A + R[i]));
                cipher.finish();
                const B = cipher.output.getBytes();
                const msbBuffer = Utils.strToArrayBuffer(B.substring(0, 8));
                const msbView = new DataView(msbBuffer);
                msbView.setUint32(0, msbView.getUint32(0) ^ cntUpper);
                msbView.setUint32(4, msbView.getUint32(4) ^ cntLower);
                A = Utils.arrayBufferToStr(msbBuffer, false);
                R[i] = B.substring(8, 16);
                cntLower++;
                if (cntLower > 0xffffffff) {
                    cntUpper++;
                    cntLower = 0;
                }
            }
        }
        const C = A + R.join("");

        if (outputType === "Hex") {
            return toHexFast(Utils.strToArrayBuffer(C));
        }
        return C;
    }

}

export default AESKeyWrap;
