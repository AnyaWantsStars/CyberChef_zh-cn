/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { search, URL_REGEX } from "../lib/Extract.mjs";
import { caseInsensitiveSort } from "../lib/Sort.mjs";

/**
 * Extract URLs operation
 */
class ExtractURLs extends Operation {

    /**
     * ExtractURLs constructor
     */
    constructor() {
        super();

        this.name = "提取 URL";
        this.module = "Regex";
        this.description = "从输入中提取统一资源定位符（URL）。需要协议（http、ftp 等），否则会产生太多误报。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "显示总计",
                type: "boolean",
                value: false
            },
            {
                name: "排序",
                type: "boolean",
                value: false
            },
            {
                name: "去重",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [displayTotal, sort, unique] = args;
        const results = search(
            input,
            URL_REGEX,
            null,
            sort ? caseInsensitiveSort : null,
            unique
        );

        if (displayTotal) {
            return `Total found: ${results.length}\n\n${results.join("\n")}`;
        } else {
            return results.join("\n");
        }
    }

}

export default ExtractURLs;
