/**
 * @author HarelKatz [github.com/HarelKatz]
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Escape Smart Characters operation
 */
class EscapeSmartCharacters extends Operation {

    /**
     * EscapeSmartCharacters constructor
     */
    constructor() {
        super();

        this.name = "转义智能字符";
        this.module = "Default";
        this.description = "将智能（排版）Unicode 字符（如智能引号、em/en 破折号、省略号、©、®、™、箭头）转换为其纯 ASCII 等效形式。<br><br>对于没有 ASCII 映射的字符（如 <code>☣</code>），根据「不可映射字符」选项处理。<br><br>例如：<code>“Hello” — world…</code> 变为 <code>\"Hello\" -- world...</code>";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "不可映射字符",
                type: "option",
                value: [{name: "包含", value: "Include"}, {name: "移除", value: "Remove"}, {name: "替换为'.'", value: "Replace with '.'"}]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [unmappable] = args;
        let result = "";
        for (const ch of input) {
            if (ch.codePointAt(0) < 128) {
                result += ch;
            } else if (Object.prototype.hasOwnProperty.call(SMART_MAP, ch)) {
                result += SMART_MAP[ch];
            } else {
                switch (unmappable) {
                    case "Remove":
                        break;
                    case "Replace with '.'":
                        result += ".";
                        break;
                    case "Include":
                    default:
                        result += ch;
                        break;
                }
            }
        }
        return result;
    }

}

const SMART_MAP = {
    // Smart double quotes
    "“": "\"",   // “ left double quotation mark
    "”": "\"",   // ” right double quotation mark
    "„": "\"",   // „ double low-9 quotation mark
    "‟": "\"",   // ‟ double high-reversed-9 quotation mark
    "″": "\"",   // ″ double prime

    // Smart single quotes / apostrophes
    "‘": "'",    // ‘ left single quotation mark
    "’": "'",    // ’ right single quotation mark / apostrophe
    "‚": "'",    // ‚ single low-9 quotation mark
    "‛": "'",    // ‛ single high-reversed-9 quotation mark
    "′": "'",    // ′ prime

    // Dashes & hyphens
    "‐": "-",    // ‐ hyphen
    "‑": "-",    // ‑ non-breaking hyphen
    "‒": "-",    // ‒ figure dash
    "–": "-",    // – en dash
    "—": "--",   // — em dash
    "―": "--",   // ― horizontal bar

    // Ellipsis
    "…": "...",  // …

    // Trademark / copyright symbols
    "©": "(c)",  // ©
    "®": "(r)",  // ®
    "™": "(tm)", // ™

    // Arrows
    "←": "<--",  // ←
    "→": "-->",  // →
    "↑": "^",    // ↑
    "↓": "v",    // ↓
    "↔": "<->",  // ↔
    "⇐": "<==",  // ⇐
    "⇒": "==>",  // ⇒
    "⇔": "<=>",  // ⇔

    // Guillemets
    "«": "<<",   // «
    "»": ">>",   // »
    "‹": "<",    // ‹
    "›": ">",    // ›

    // Math & misc symbols
    "×": "x",    // ×
    "÷": "/",    // ÷
    "±": "+/-",  // ±
    "•": "*",    // •
    "·": ".",    // ·

    // Non-ASCII spaces
    "\u00A0": " ",    // NBSP
    "\u2002": " ",    // en space
    "\u2003": " ",    // em space
    "\u2009": " ",    // thin space
    "\u200A": " "     // hair space
};

export default EscapeSmartCharacters;
