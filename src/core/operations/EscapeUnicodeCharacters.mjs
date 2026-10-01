/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Escape Unicode Characters operation
 */
class EscapeUnicodeCharacters extends Operation {

    /**
     * EscapeUnicodeCharacters constructor
     */
    constructor() {
        super();

        this.name = "转义 Unicode 字符";
        this.module = "Default";
        this.description = "将字符转换为其 Unicode 转义表示。<br><br>支持以下前缀：<ul><li><code>\\\\u</code></li><li><code>%u</code></li><li><code>U+</code></li></ul>例如：<code>σου</code> 变为 <code>σου</code>";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "前缀",
                "type": "option",
                "value": ["\\u", "%u", "U+"]
            },
            {
                "name": "编码所有字符",
                "type": "boolean",
                "value": false
            },
            {
                "name": "填充", "type": "number",
                "value": 4
            },
            {
                "name": "大写十六进制",
                "type": "boolean",
                "value": true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const regexWhitelist = /[ -~]/i,
            [prefix, encodeAll, padding, uppercaseHex] = args;

        let output = "",
            character = "";

        for (let i = 0; i < input.length; i++) {
            character = input[i];
            if (!encodeAll && regexWhitelist.test(character)) {
                // It’s a printable ASCII character so don’t escape it.
                output += character;
                continue;
            }

            let cp = character.codePointAt(0).toString(16);
            if (uppercaseHex) cp = cp.toUpperCase();
            output += prefix + cp.padStart(padding, "0");
        }

        return output;
    }

}

export default EscapeUnicodeCharacters;
