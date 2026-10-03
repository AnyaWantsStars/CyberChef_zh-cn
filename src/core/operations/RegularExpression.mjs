/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import XRegExp from "xregexp";
import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { EMAIL_REGEX } from "../lib/Extract.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Regular expression operation
 */
class RegularExpression extends Operation {

    /**
     * RegularExpression constructor
     */
    constructor() {
        super();

        this.name = "正则表达式";
        this.module = "Regex";
        this.description = "定义您自己的正则表达式（regex）来搜索输入数据，可以选择从预定义的模式列表中选择。<br><br>支持扩展正则表达式语法，包括 'dot matches all' 标志、命名捕获组、完整的 Unicode 覆盖（包括 <code>\\\\p{}</code> 类别和脚本以及星体代码）和递归匹配。";
        this.infoURL = "https://wikipedia.org/wiki/Regular_expression";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                "name": "内置正则",
                "type": "populateOption",
                "value": [
                    {
                        name: "用户自定义",
                        value: ""
                    },
                    {
                        name: "IPv4 地址",
                        value: "(?:(?:\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d|\\d)(?:\\/\\d{1,2})?"
                    },
                    {
                        name: "IPv6 地址",
                        value: "((?=.*::)(?!.*::.+::)(::)?([\\dA-Fa-f]{1,4}:(:|\\b)|){5}|([\\dA-Fa-f]{1,4}:){6})((([\\dA-Fa-f]{1,4}((?!\\3)::|:\\b|(?![\\dA-Fa-f])))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})"
                    },
                    {
                        name: "邮箱地址",
                        value: EMAIL_REGEX.source // We use a different regex library, so just take the source regex string here
                    },
                    {
                        name: "URL",
                        value: "([A-Za-z]+://)([-\\w]+(?:\\.\\w[-\\w]*)+)(:\\d+)?(/[^.!,?\"<>\\[\\]{}\\s\\x7F-\\xFF]*(?:[.!,?]+[^.!,?\"<>\\[\\]{}\\s\\x7F-\\xFF]+)*)?"
                    },
                    {
                        name: "域名",
                        value: "\\b((?=[a-z0-9-]{1,63}\\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\\.)+[a-z]{2,63}\\b"
                    },
                    {
                        name: "Windows 文件路径",
                        value: "([A-Za-z]):\\\\((?:[A-Za-z\\d][A-Za-z\\d\\- \\x27_\\(\\)~]{0,61}\\\\?)*[A-Za-z\\d][A-Za-z\\d\\- \\x27_\\(\\)]{0,61})(\\.[A-Za-z\\d]{1,6})?"
                    },
                    {
                        name: "UNIX 文件路径",
                        value: "(?:/[A-Za-z\\d.][A-Za-z\\d\\-.]{0,61})+"
                    },
                    {
                        name: "MAC 地址",
                        value: "[A-Fa-f\\d]{2}(?:[:-][A-Fa-f\\d]{2}){5}"
                    },
                    {
                        name: "UUID",
                        value: "[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}"
                    },
                    {
                        name: "日期（年-月-日）",
                        value: "((?:19|20)\\d\\d)[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])"
                    },
                    {
                        name: "日期（日/月/年）",
                        value: "(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]((?:19|20)\\d\\d)"
                    },
                    {
                        name: "日期（月/日/年）",
                        value: "(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]((?:19|20)\\d\\d)"
                    },
                    {
                        name: "字符串",
                        value: "[A-Za-z\\d/\\-:.,_$%\\x27\"()<>= !\\[\\]{}@]{4,}"
                    },
                ],
                "target": 1
            },
            {
                "name": "正则表达式",
                "type": "text",
                "value": ""
            },
            {
                "name": "忽略大小写",
                "type": "boolean",
                "value": true
            },
            {
                "name": "^和$匹配换行符",
                "type": "boolean",
                "value": true
            },
            {
                "name": "点号匹配所有",
                "type": "boolean",
                "value": false
            },
            {
                "name": "Unicode 支持",
                "type": "boolean",
                "value": false
            },
            {
                "name": "Astral 支持",
                "type": "boolean",
                "value": false
            },
            {
                "name": "显示总计", "type": "boolean",
                "value": false
            },
            {
                "name": "输出格式", "type": "option",
                "value": [
                    {name: "高亮匹配", value: "Highlight matches"},
                    {name: "列出匹配", value: "List matches"},
                    {name: "列出捕获组", value: "List capture groups"},
                    {name: "列出匹配及捕获组", value: "List matches with capture groups"}
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const [,
            userRegex,
            i, m, s, u, a,
            displayTotal,
            outputFormat
        ] = args;
        let modifiers = "g";

        if (i) modifiers += "i";
        if (m) modifiers += "m";
        if (s) modifiers += "s";
        if (u) modifiers += "u";
        if (a) modifiers += "A";

        if (userRegex && userRegex !== "^" && userRegex !== "$") {
            try {
                const regex = new XRegExp(userRegex, modifiers);

                switch (outputFormat) {
                    case "Highlight matches":
                        return regexHighlight(input, regex, displayTotal);
                    case "List matches":
                        return Utils.escapeHtml(regexList(input, regex, displayTotal, true, false));
                    case "List capture groups":
                        return Utils.escapeHtml(regexList(input, regex, displayTotal, false, true));
                    case "List matches with capture groups":
                        return Utils.escapeHtml(regexList(input, regex, displayTotal, true, true));
                    default:
                        throw new OperationError("错误：无效的输出格式");
                }
            } catch (err) {
                throw new OperationError("无效的正则表达式。详情：" + err.message);
            }
        } else {
            return Utils.escapeHtml(input);
        }
    }

}

/**
 * Creates a string listing the matches within a string.
 *
 * @param {string} input
 * @param {RegExp} regex
 * @param {boolean} displayTotal
 * @param {boolean} matches - Display full match
 * @param {boolean} captureGroups - Display each of the capture groups separately
 * @returns {string}
 */
function regexList(input, regex, displayTotal, matches, captureGroups) {
    let output = "",
        total = 0,
        match;

    while ((match = regex.exec(input))) {
        // Moves pointer when an empty string is matched (prevents infinite loop)
        if (match.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        total++;
        if (matches) {
            output += match[0] + "\n";
        }
        if (captureGroups) {
            for (let i = 1; i < match.length; i++) {
                if (matches) {
                    output += "  组 " + i + ": ";
                }
                output += match[i] + "\n";
            }
        }
    }

    if (displayTotal)
        output = "共找到: " + total + "\n\n" + output;

    return output.slice(0, -1);
}

/**
 * Adds HTML highlights to matches within a string.
 *
 * @private
 * @param {string} input
 * @param {RegExp} regex
 * @param {boolean} displayTotal
 * @returns {string}
 */
function regexHighlight(input, regex, displayTotal) {
    let output = "",
        title = "",
        hl = 1,
        total = 0;
    const captureGroups = [];

    output = input.replace(regex, (match, ...args) => {
        // The replacer is called with (match, p1, ..., pn, offset, string) and, if the
        // regex contains named capture groups, a trailing `groups` object (ES2018).
        // Capture groups are only ever strings or undefined, so an object in the last
        // position can only be the named groups collection.
        if (args.length && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null)
            args.pop(); // Throw away named capture group object
        args.pop(); // Throw away full string
        const offset = args.pop(),
            groups = args;

        // Everything interpolated into the title attribute must be escaped, including
        // the offset, which is not guaranteed to be a number for all regex engines.
        title = `偏移量: ${Utils.escapeHtml(String(offset))}\n`;
        if (groups.length) {
            title += "分组:\n";
            for (let i = 0; i < groups.length; i++) {
                title += `\t${i+1}: ${Utils.escapeHtml(String(groups[i] ?? ""))}\n`;
            }
        }

        // Switch highlight
        hl = hl === 1 ? 2 : 1;

        // Store highlighted match and replace with a placeholder
        captureGroups.push(`<span class='hl${hl}' title='${title}'>${Utils.escapeHtml(match)}</span>`);
        return `[cc_capture_group_${total++}]`;
    });

    // Safely escape all remaining text, then replace placeholders
    output = Utils.escapeHtml(output);
    output = output.replace(/\[cc_capture_group_(\d+)\]/g, (_, i) => {
        return captureGroups[i];
    });

    if (displayTotal)
        output = "共找到: " + total + "\n\n" + output;

    return output;
}

export default RegularExpression;
