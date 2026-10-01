/**
 * @author Vel0x [dalemy@microsoft.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import jsesc from "jsesc";

/**
 * Escape string operation
 */
class EscapeString extends Operation {

    /**
     * EscapeString constructor
     */
    constructor() {
        super();

        this.name = "转义字符串";
        this.module = "Default";
        this.description = "转义字符串中的特殊字符，使其不会引发冲突。例如：<code>Don't stop me now</code> 变为 <code>Don\\\\'t stop me now</code>。<br><br>支持以下转义序列：<ul><li><code>\\\\n</code>（换行）</li><li><code>\\\\r</code>（回车）</li><li><code>\\\\t</code>（水平制表符）</li><li><code>\\\\b</code>（退格）</li><li><code>\\\\f</code>（换页）</li><li><code>\\\\xnn</code>（十六进制）</li><li><code>\\\\</code>（反斜杠）</li><li><code>\\\\'</code>（单引号）</li><li><code>\\\\&quot;</code>（双引号）</li><li><code>\\\\unnnn</code>（Unicode 字符）</li><li><code>\\\\u{nnnnnn}</code>（Unicode 码点）</li></ul>";
        this.infoURL = "https://wikipedia.org/wiki/Escape_sequence";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "转义级别",
                "type": "option",
                "value": [
                    {name: "特殊字符", value: "Special chars"},
                    {name: "全部", value: "Everything"},
                    {name: "最小", value: "Minimal"}
                ]
            },
            {
                "name": "转义引号",
                "type": "option",
                "value": [
                    {name: "单引号", value: "Single"},
                    {name: "双引号", value: "Double"},
                    {name: "反引号", value: "Backtick"}
                ]
            },
            {
                "name": "JSON兼容",
                "type": "boolean",
                "value": false
            },
            {
                "name": "ES6兼容",
                "type": "boolean",
                "value": true
            },
            {
                "name": "大写十六进制",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @example
     * EscapeString.run("Don't do that", [])
     * > "Don\'t do that"
     * EscapeString.run(`Hello
     * World`, [])
     * > "Hello\nWorld"
     */
    run(input, args) {
        const level = args[0],
            quotes = args[1],
            jsonCompat = args[2],
            es6Compat = args[3],
            lowercaseHex = !args[4];

        return jsesc(input, {
            quotes: quotes.toLowerCase(),
            es6: es6Compat,
            escapeEverything: level === "Everything",
            minimal: level === "Minimal",
            json: jsonCompat,
            lowercaseHex: lowercaseHex,
        });
    }

}

export default EscapeString;
