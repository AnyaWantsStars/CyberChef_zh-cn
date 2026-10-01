/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import moment from "moment-timezone";
import {DATETIME_FORMATS, FORMAT_EXAMPLES} from "../lib/DateTime.mjs";

/**
 * Parse DateTime operation
 */
class ParseDateTime extends Operation {

    /**
     * ParseDateTime constructor
     */
    constructor() {
        super();

        this.name = "解析 DateTime";
        this.module = "Default";
        this.description = "以指定格式解析日期时间字符串，并显示所有可用时区的结果。";
        this.infoURL = "https://momentjs.com/docs/#/parsing/string-format/";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                "name": "内置格式",
                "type": "populateOption",
                "value": DATETIME_FORMATS,
                "target": 1
            },
            {
                "name": "输入格式字符串",
                "type": "binaryString",
                "value": "DD/MM/YYYY HH:mm:ss"
            },
            {
                "name": "输入时区",
                "type": "option",
                "value": ["UTC"].concat(moment.tz.names())
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const inputFormat = args[1],
            inputTimezone = args[2];
        let date,
            output = "";

        try {
            date = moment.tz(input, inputFormat, inputTimezone);
            if (!date || date.format() === "Invalid date") throw Error;
        } catch (err) {
            return `无效的格式。\n\n${FORMAT_EXAMPLES}`;
        }

        output += "日期: " + date.format("dddd Do MMMM YYYY") +
            "\n时间: " + date.format("HH:mm:ss") +
            "\n时段: " + date.format("A") +
            "\n时区: " + date.format("z") +
            "\nUTC 偏移: " + date.format("ZZ") +
            "\n\n夏令时: " + date.isDST() +
            "\n闰年: " + date.isLeapYear() +
            "\n本月天数: " + date.daysInMonth() +
            "\n\n年内日序: " + date.dayOfYear() +
            "\n周数: " + date.week() +
            "\n季度: " + date.quarter();

        return output;
    }

}

export default ParseDateTime;
