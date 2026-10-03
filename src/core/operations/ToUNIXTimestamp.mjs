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
 * To UNIX Timestamp operation
 */
class ToUNIXTimestamp extends Operation {

    /**
     * ToUNIXTimestamp constructor
     */
    constructor() {
        super();

        this.name = "转为 UNIX 时间戳";
        this.module = "Default";
        this.description = "解析 UTC 日期时间字符串并返回对应的 UNIX 时间戳。<br><br>例如 <code>Mon 1 January 2001 11:00:00</code> 变为 <code>978346800</code><br><br>UNIX 时间戳是一个 32 位值，表示自 1970 年 1 月 1 日 UTC（UNIX 纪元）以来的秒数。";
        this.infoURL = "https://wikipedia.org/wiki/Unix_time";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "单位",
                "type": "option",
                "value": UNITS
            },
            {
                "name": "视为 UTC",
                "type": "boolean",
                "value": true
            },
            {
                "name": "显示解析后日期时间",
                "type": "boolean",
                "value": true
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if unit unrecognised
     */
    run(input, args) {
        const [units, treatAsUTC, showDateTime] = args,
            d = treatAsUTC ? moment.utc(input) : moment(input);

        let result = "";

        if (units === "Seconds (s)") {
            result = d.unix();
        } else if (units === "Milliseconds (ms)") {
            result = d.valueOf();
        } else if (units === "Microseconds (μs)") {
            result = d.valueOf() * 1000;
        } else if (units === "Nanoseconds (ns)") {
            result = d.valueOf() * 1000000;
        } else {
            throw new OperationError("无法识别的单位");
        }

        return showDateTime ? `${result} (${d.tz("UTC").format("ddd D MMMM YYYY HH:mm:ss")} UTC)` : result.toString();
    }

}

export default ToUNIXTimestamp;
