/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {INPUT_DELIM_OPTIONS} from "../lib/Delim.mjs";
import {caseInsensitiveSort, ipSort, numericSort, hexadecimalSort, lengthSort} from "../lib/Sort.mjs";

/**
 * Sort operation
 */
class Sort extends Operation {

    /**
     * Sort constructor
     */
    constructor() {
        super();

        this.name = "排序";
        this.module = "Default";
        this.description = "按字母顺序对由指定分隔符分隔的字符串进行排序。<br><br>IP 地址选项仅支持 IPv4。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符", "type": "option",
                "value": INPUT_DELIM_OPTIONS
            },
            {
                "name": "反转",
                "type": "boolean",
                "value": false
            },
            {
                "name": "顺序",
                "type": "option",
                "value": [
                    {name: "字母序（区分大小写）", value: "Alphabetical (case sensitive)"},
                    {name: "字母序（不区分大小写）", value: "Alphabetical (case insensitive)"},
                    {name: "IP 地址", value: "IP address"},
                    {name: "数字", value: "Numeric"},
                    {name: "数字（十六进制）", value: "Numeric (hexadecimal)"},
                    {name: "长度", value: "Length"}
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = Utils.charRep(args[0]),
            sortReverse = args[1],
            order = args[2];
        let sorted = input.split(delim);

        if (order === "Alphabetical (case sensitive)") {
            sorted = sorted.sort();
        } else if (order === "Alphabetical (case insensitive)") {
            sorted = sorted.sort(caseInsensitiveSort);
        } else if (order === "IP address") {
            sorted = sorted.sort(ipSort);
        } else if (order === "Numeric") {
            sorted = sorted.sort(numericSort);
        } else if (order === "Numeric (hexadecimal)") {
            sorted = sorted.sort(hexadecimalSort);
        } else if (order === "Length") {
            sorted = sorted.sort(lengthSort);
        }

        if (sortReverse) sorted.reverse();
        return sorted.join(delim);
    }

}

export default Sort;
