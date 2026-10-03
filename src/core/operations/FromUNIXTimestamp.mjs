/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import moment from "moment-timezone";
import {UNITS} from "../lib/DateTime.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * From UNIX Timestamp operation
 */
class FromUNIXTimestamp extends Operation {

    /**
     * FromUNIXTimestamp constructor
     */
    constructor() {
        super();

        this.name = "解码 UNIX 时间戳";
        this.module = "Default";
        this.description = "将 UNIX 时间戳转换为日期时间字符串。<br><br>例如：<code>978346800</code> 变为 <code>Mon 1 January 2001 11:00:00 UTC</code><br><br>UNIX 时间戳是一个 32 位值，表示自 1970 年 1 月 1 日 UTC（UNIX 纪元）以来的秒数。";
        this.infoURL = "https://wikipedia.org/wiki/Unix_time";
        this.inputType = "number";
        this.outputType = "string";
        this.args = [
            {
                "name": "单位",
                "type": "option",
                "value": UNITS
            }
        ];
        this.checks = [
            {
                pattern: "^1?\\d{9}$",
                flags: "",
                args: ["Seconds (s)"]
            },
            {
                pattern: "^1?\\d{12}$",
                flags: "",
                args: ["Milliseconds (ms)"]
            },
            {
                pattern: "^1?\\d{15}$",
                flags: "",
                args: ["Microseconds (μs)"]
            },
            {
                pattern: "^1?\\d{18}$",
                flags: "",
                args: ["Nanoseconds (ns)"]
            }
        ];
    }

    /**
     * @param {number} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if invalid unit
     */
    run(input, args) {
        const units = args[0];
        let d;

        input = parseFloat(input);

        if (units === "Seconds (s)") {
            d = moment.unix(input);
            return d.tz("UTC").format("ddd D MMMM YYYY HH:mm:ss") + " UTC";
        } else if (units === "Milliseconds (ms)") {
            d = moment(input);
            return d.tz("UTC").format("ddd D MMMM YYYY HH:mm:ss.SSS") + " UTC";
        } else if (units === "Microseconds (μs)") {
            d = moment(input / 1000);
            return d.tz("UTC").format("ddd D MMMM YYYY HH:mm:ss.SSS") + " UTC";
        } else if (units === "Nanoseconds (ns)") {
            d = moment(input / 1000000);
            return d.tz("UTC").format("ddd D MMMM YYYY HH:mm:ss.SSS") + " UTC";
        } else {
            throw new OperationError("无法识别的单位");
        }
    }

}

export default FromUNIXTimestamp;
