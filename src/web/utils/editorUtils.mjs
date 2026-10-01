/**
 * CodeMirror utilities that are relevant to both the input and output
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Utils from "../../core/Utils.mjs";

// Descriptions for named control characters
const Names = {
    0: "空字符（Null）",
    7: "响铃（Bell）",
    8: "退格（Backspace）",
    10: "换行符（Line Feed）",
    11: "垂直制表符（Vertical Tab）",
    13: "回车符（Carriage Return）",
    27: "转义（Escape）",
    8203: "零宽空格（Zero Width Space）",
    8204: "零宽不连接符（Zero Width Non-Joiner）",
    8205: "零宽连接符（Zero Width Joiner）",
    8206: "从左到右标记（Left-to-Right Mark）",
    8207: "从右到左标记（Right-to-Left Mark）",
    8232: "行分隔符（Line Separator）",
    8237: "从左到右强制（Left-to-Right Override）",
    8238: "从右到左强制（Right-to-Left Override）",
    8294: "从左到右隔离（Left-to-Right Isolate）",
    8295: "从右到左隔离（Right-to-Left Isolate）",
    8297: "弹出方向隔离（Pop Directional Isolate）",
    8233: "段分隔符（Paragraph Separator）",
    65279: "零宽不换行空格（Zero Width No-Break Space）",
    65532: "对象替换符（Object Replacement）"
};

// Regex for Special Characters to be replaced
const UnicodeRegexpSupport = /x/.unicode != null ? "gu" : "g";
const Specials = new RegExp("[\u0000-\u0008\u000a-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc\ue000-\uf8ff]", UnicodeRegexpSupport);


/**
 * Override for rendering special characters.
 * Should mirror the toDOM function in
 * https://github.com/codemirror/view/blob/main/src/special-chars.ts#L153
 * But reverts the replacement of line feeds with newline control pictures.
 *
 * @param {number} code
 * @param {string} desc
 * @param {string} placeholder
 * @returns {element}
 */
export function renderSpecialChar(code, desc, placeholder) {
    const s = document.createElement("span");

    // CodeMirror changes 0x0a to "NL" instead of "LF". We change it back along with its description.
    if (code === 0x0a) {
        placeholder = "\u240a";
        desc = desc.replace("newline", "换行符（Line Feed）");
    }

    // Render CyberChef escaped characters correctly - see Utils.escapeWhitespace
    if (code >= 0xe000 && code <= 0xf8ff) {
        code = code - 0xe000;
        placeholder = String.fromCharCode(0x2400 + code);
        desc = "控制字符 " + (Names[code] || "0x" + code.toString(16));
    }

    s.textContent = placeholder;
    s.title = desc;
    s.setAttribute("aria-label", desc);
    s.className = "cm-specialChar";
    return s;
}


/**
 * Given a string, returns that string with any control characters replaced with HTML
 * renderings of control pictures.
 *
 * @param {string} str
 * @param {boolean} [preserveWs=false]
 * @param {string} [lineBreak="\n"]
 * @returns {html}
 */
export function escapeControlChars(str, preserveWs=false, lineBreak="\n") {
    if (!preserveWs)
        str = Utils.escapeWhitespace(str);

    return str.replace(Specials, function(c) {
        if (lineBreak.includes(c)) return c;
        const code = c.charCodeAt(0);
        const desc = "控制字符 " + (Names[code] || "0x" + code.toString(16));
        const placeholder = code > 32 ? "\u2022" : String.fromCharCode(9216 + code);
        const n = renderSpecialChar(code, desc, placeholder);
        return n.outerHTML;
    });
}

/**
 * Convert and EOL sequence to its name
 */
export const eolSeqToCode = {
    "\u000a": "LF",
    "\u000b": "VT",
    "\u000c": "FF",
    "\u000d": "CR",
    "\u000d\u000a": "CRLF",
    "\u0085": "NEL",
    "\u2028": "LS",
    "\u2029": "PS"
};

/**
 * Convert an EOL name to its sequence
 */
export const eolCodeToSeq = {
    "LF": "\u000a",
    "VT": "\u000b",
    "FF": "\u000c",
    "CR": "\u000d", "回车换行": "\u000d\u000a",
    "NEL": "\u0085",
    "LS": "\u2028",
    "PS": "\u2029"
};

export const eolCodeToName = {
    "LF": "换行符（LF）",
    "VT": "垂直制表符（VT）",
    "FF": "换页符（FF）",
    "CR": "回车符（CR）",
    "CRLF": "回车换行（CRLF）",
    "NEL": "下一行（NEL）",
    "LS": "行分隔符（LS）",
    "PS": "段落分隔符（PS）"
};
