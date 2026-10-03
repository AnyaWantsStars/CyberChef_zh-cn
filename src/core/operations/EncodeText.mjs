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
 * Encode text operation
 */
class EncodeText extends Operation {

    /**
     * EncodeText constructor
     */
    constructor() {
        super();

        this.name = "编码文本";
        this.module = "Encodings";
        this.description = [
            "将文本编码为所选字符编码。",
            "<br><br>",
            "支持的字符集：",
            "<ul>",
            Object.keys(CHR_ENC_CODE_PAGES).map(e => `<li>${e}</li>`).join("\n"),
            "</ul>",
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Character_encoding";
        this.inputType = "string";
        this.outputType = "ArrayBuffer";
        this.args = [
            {
                "name": "编码", "type": "option",
                "value": Object.keys(CHR_ENC_CODE_PAGES),
                "englishValueAllowed": true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const format = CHR_ENC_CODE_PAGES[args[0]] || CHR_ENC_CODE_PAGES_EN[args[0]];
        if (!format) {
            throw new OperationError("无效编码");
        }
        const encoded = cptable.utils.encode(format, input);
        return new Uint8Array(encoded).buffer;
    }

}


export default EncodeText;
