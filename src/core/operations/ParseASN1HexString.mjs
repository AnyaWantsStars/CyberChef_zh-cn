/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import r from "jsrsasign";
import Operation from "../Operation.mjs";

/**
 * Parse ASN.1 hex string operation
 */
class ParseASN1HexString extends Operation {

    /**
     * ParseASN1HexString constructor
     */
    constructor() {
        super();

        this.name = "解析 ASN.1 十六进制字符串";
        this.module = "PublicKey";
        this.description = "抽象语法表示法一（ASN.1）是一种标准和表示法，描述了在电信和计算机网络中表示、编码、传输和解码数据的规则和结构。<br><br>此操作解析任意 ASN.1 数据（编码为十六进制字符串：如有必要，请使用 'To Hex' 操作），并呈现结果树。";
        this.infoURL = "https://wikipedia.org/wiki/Abstract_Syntax_Notation_One";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "起始索引",
                "type": "number",
                "value": 0
            },
            {
                "name": "截断八位组字符串超过",
                "type": "number",
                "value": 32
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [index, truncateLen] = args;
        return r.ASN1HEX.dump(input.replace(/\s/g, "").toLowerCase(), {
            "ommit_long_octet": truncateLen
        }, index);
    }

}

export default ParseASN1HexString;
