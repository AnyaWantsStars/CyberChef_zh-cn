/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Decode NetBIOS Name operation
 */
class DecodeNetBIOSName extends Operation {

    /**
     * DecodeNetBIOSName constructor
     */
    constructor() {
        super();

        this.name = "解码 NetBIOS 名称";
        this.module = "Default";
        this.description = "通过客户端接口看到的 NetBIOS 名称恰好是 16 字节长。在 NetBIOS-over-TCP 协议中，使用更长的表示。<br><br>有两个编码级别。第一级将 NetBIOS 名称映射为域名系统名称。第二级将域名系统名称映射为与域名系统交互所需的压缩表示。<br><br>此操作解码第一级编码。详见 RFC 1001。";
        this.infoURL = "https://wikipedia.org/wiki/NetBIOS";
        this.inputType = "byteArray";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "偏移量", "type": "number",
                "value": 65
            }
        ];
        this.checks = [
            {
                pattern:  "^\\s*\\S{32}$",
                flags:  "",
                args:   [65]
            }
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        const output = [],
            offset = args[0];

        if (input.length <= 32 && (input.length % 2) === 0) {
            for (let i = 0; i < input.length; i += 2) {
                output.push((((input[i] & 0xff) - offset) << 4) |
                            (((input[i + 1] & 0xff) - offset) & 0xf));
            }
            for (let i = output.length - 1; i > 0; i--) {
                if (output[i] === 32) output.splice(i, i);
                else break;
            }
        }

        return output;
    }

}

export default DecodeNetBIOSName;
