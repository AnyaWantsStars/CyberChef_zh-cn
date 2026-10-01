/**
 * @author tomgond [tom.gonda@gmail.com]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import moment from "moment-timezone";
import {DATETIME_FORMATS, FORMAT_EXAMPLES} from "../lib/DateTime.mjs";

/**
 * DateTime Delta operation
 */
class DateTimeDelta extends Operation {

    /**
     * DateTimeDelta constructor
     */
    constructor() {
        super();

        this.name = "日期时间差值";
        this.module = "Default";
        this.description = "根据输入的日期时间值和与输入值的时间差，计算新的日期时间值。";
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
                "name": "时间操作",
                "type": "option",
                "value": [
                    {name: "加", value: "Add"},
                    {name: "减", value: "Subtract"}
                ]
            },
            {
                "name": "天数",
                "type": "number",
                "value": 0
            },
            {
                "name": "小时",
                "type": "number",
                "value": 0
            },
            {
                "name": "分钟",
                "type": "number",
                "value": 0
            },
            {
                "name": "秒",
                "type": "number",
                "value": 0
            }

        ];
    }


    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const inputTimezone = "UTC";
        const inputFormat = args[1];
        const operationType = args[2];
        const daysDelta = args[3];
        const hoursDelta = args[4];
        const minutesDelta = args[5];
        const secondsDelta = args[6];
        let date = "";

        try {
            date = moment.tz(input, inputFormat, inputTimezone);
            if (!date || date.format() === "Invalid date") throw Error;
        } catch (err) {
            return `无效的格式。\n\n${FORMAT_EXAMPLES}`;
        }
        let newDate;
        if (operationType === "Add") {
            newDate = date.add(daysDelta, "days")
                .add(hoursDelta, "hours")
                .add(minutesDelta, "minutes")
                .add(secondsDelta, "seconds");

        } else {
            newDate = date.add(-daysDelta, "days")
                .add(-hoursDelta, "hours")
                .add(-minutesDelta, "minutes")
                .add(-secondsDelta, "seconds");
        }
        return newDate.tz(inputTimezone).format(inputFormat.replace(/[<>]/g, ""));
    }
}

export default DateTimeDelta;
