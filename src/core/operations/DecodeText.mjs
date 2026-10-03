/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import cptable from "codepage";
import {CHR_ENC_CODE_PAGES, CHR_ENC_CODE_PAGES_EN} from "../lib/ChrEnc.mjs";

/**
 * Decode text operation
 */
class DecodeText extends Operation {

    /**
     * DecodeText constructor
     */
    constructor() {
        super();

        this.name = "解码文本";
        this.module = "Encodings";
        this.description = [
            "从所选字符编码解码文本。",
            "<br><br>",
            "支持的字符集：",
            "<ul>",
            Object.keys(CHR_ENC_CODE_PAGES).map(e => `<li>${e}</li>`).join("\n"),
            "</ul>",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Character_encoding";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                "name": "编码", "type": "option",
                "value": Object.keys(CHR_ENC_CODE_PAGES),
                "englishValueAllowed": true
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const format = CHR_ENC_CODE_PAGES[args[0]] || CHR_ENC_CODE_PAGES_EN[args[0]];
        if (!format) {
            throw new OperationError("无效编码");
        }
        return cptable.utils.decode(format, new Uint8Array(input));
    }

}

export default DecodeText;
