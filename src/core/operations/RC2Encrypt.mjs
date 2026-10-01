/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import forge from "node-forge";


/**
 * RC2 Encrypt operation
 */
class RC2Encrypt extends Operation {

    /**
     * RC2Encrypt constructor
     */
    constructor() {
        super();

        this.name = "RC2 加密";
        this.module = "Ciphers";
        this.description = "RC2（也称为 ARC2）是 Ron Rivest 于 1987 年设计的对称密钥分组密码。RC 代表 Rivest Cipher。<br><br><b>密钥：</b>RC2 使用可变大小的密钥。<br><br>您可以使用 KDF 操作生成基于密码的密钥。<br><br><b>IV：</b>要以 CBC 模式运行密码，初始化向量应为 8 字节。如果 IV 留空，密码将以 ECB 模式运行。<br><br><b>填充：</b>在 CBC 和 ECB 模式下，将使用 PKCS#7 填充。";
        this.infoURL = "https://wikipedia.org/wiki/RC2";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "初始向量", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "输入", "type": "option",
                "value": [
                    {name: "原始", value: "Raw"},
                    "Hex"
                ]
            },
            {
                "name": "输出",
                "type": "option",
                "value": [
                    "Hex",
                    {name: "原始", value: "Raw"}
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteString(args[1].string, args[1].option),
            [,, inputType, outputType] = args,
            cipher = forge.rc2.createEncryptionCipher(key);

        input = Utils.convertToByteString(input, inputType);

        cipher.start(iv || null);
        cipher.update(forge.util.createBuffer(input));
        cipher.finish();

        return outputType === "Hex" ? cipher.output.toHex() : cipher.output.getBytes();
    }

}

export default RC2Encrypt;
