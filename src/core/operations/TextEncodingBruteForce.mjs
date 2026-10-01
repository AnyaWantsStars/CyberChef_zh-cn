/**
 * @author Cynser
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import cptable from "codepage";
import {CHR_ENC_CODE_PAGES} from "../lib/ChrEnc.mjs";

/**
 * Text Encoding Brute Force operation
 */
class TextEncodingBruteForce extends Operation {

    /**
     * TextEncodingBruteForce constructor
     */
    constructor() {
        super();

        this.name = "文本编码暴力破解";
        this.module = "Encodings";
        this.description = [
            "枚举输入数据的所有受支持文本编码，帮助你快速找到正确的编码。",
            "<br><br>",
            "支持的字符集：",
            "<ul>",
            Object.keys(CHR_ENC_CODE_PAGES).map(e => `<li>${e}</li>`).join("\n"),
            "</ul>"
        ].join("\n");
        this.infoURL = "https://wikipedia.org/wiki/Character_encoding";
        this.inputType = "string";
        this.outputType = "json";
        this.presentType = "html";
        this.args = [
            {
                name: "模式",
                type: "option",
                value: [{name: "编码", value: "Encode"}, {name: "解码", value: "Decode"}]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {json}
     */
    run(input, args) {
        const output = {},
            charsets = Object.keys(CHR_ENC_CODE_PAGES),
            mode = args[0];

        charsets.forEach(charset => {
            try {
                if (mode === "Decode") {
                    output[charset] = cptable.utils.decode(CHR_ENC_CODE_PAGES[charset], input);
                } else {
                    output[charset] = Utils.arrayBufferToStr(cptable.utils.encode(CHR_ENC_CODE_PAGES[charset], input));
                }
            } catch (err) {
                output[charset] = "Could not decode.";
            }
        });

        return output;
    }

    /**
     * Displays the encodings in an HTML table for web apps.
     *
     * @param {Object[]} encodings
     * @returns {html}
     */
    present(encodings) {
        let table = "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>编码</th><th>值</th></tr>";

        for (const enc in encodings) {
            const value = Utils.escapeHtml(Utils.escapeWhitespace(encodings[enc]));
            table += `<tr><td>${enc}</td><td>${value}</td></tr>`;
        }

        table += "<table>";
        return table;
    }

}

export default TextEncodingBruteForce;
