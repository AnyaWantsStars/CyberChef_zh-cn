/**
 * @author Medjedtxm
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { toHexFast } from "../lib/Hex.mjs";
import AsconMac from "../vendor/ascon.mjs";

/**
 * Ascon MAC operation
 */
class AsconMAC extends Operation {

    /**
     * AsconMAC constructor
     */
    constructor() {
        super();

        this.name = "Ascon MAC";
        this.module = "Crypto";
        this.description = "Ascon-Mac 生成 128 位（16 字节）消息认证码，属于 NIST SP 800-232 标准化的 Ascon 家族。它使用密钥对消息进行认证，确保数据完整性和真实性。<br><br>Ascon 专为 IoT 传感器和嵌入式系统等受限设备上的轻量级密码学设计。";
        this.infoURL = "https://wikipedia.org/wiki/Ascon_(cipher)";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "密钥", "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     * @throws {OperationError} if invalid key length
     */
    run(input, args) {
        const keyArray = Utils.convertToByteArray(args[0].string, args[0].option);

        if (keyArray.length !== 16) {
            throw new OperationError(`无效密钥长度：${keyArray.length} 字节。

Ascon-Mac 需要恰好 16 字节（128 位）的密钥。`);
        }

        // Convert to Uint8Array for vendor Ascon implementation
        const keyUint8 = new Uint8Array(keyArray);
        const inputUint8 = new Uint8Array(input);

        // Compute MAC (returns Uint8Array)
        const macResult = AsconMac.mac(keyUint8, inputUint8);

        // Convert to hex string
        return toHexFast(macResult);
    }

}

export default AsconMAC;
