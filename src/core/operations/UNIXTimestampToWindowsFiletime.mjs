/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import BigNumber from "bignumber.js";
import OperationError from "../errors/OperationError.mjs";

/**
 * UNIX Timestamp to Windows Filetime operation
 */
class UNIXTimestampToWindowsFiletime extends Operation {

    /**
     * UNIXTimestampToWindowsFiletime constructor
     */
    constructor() {
        super();

        this.name = "UNIX 时间戳转 Windows 文件时间";
        this.module = "Default";
        this.description = "将 UNIX 时间戳转换为 Windows Filetime 值。<br><br>Windows Filetime 是一个 64 位值，表示自 1601 年 1 月 1 日 UTC 以来经过的 100 纳秒间隔数。<br><br>UNIX 时间戳是一个 32 位值，表示自 1970 年 1 月 1 日 UTC（UNIX 纪元）以来经过的秒数。<br><br>此操作还支持毫秒、微秒和纳秒级别的 UNIX 时间戳。";
        this.infoURL = "https://msdn.microsoft.com/en-us/library/windows/desktop/ms724284(v=vs.85).aspx";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": [
                    {name: "秒", value: "Seconds (s)"},
                    {name: "毫秒", value: "Milliseconds (ms)"},
                    {name: "微秒", value: "Microseconds (μs)"},
                    {name: "纳秒", value: "Nanoseconds (ns)"}
                ]
            },
            {
                "name": "输出格式", "type": "option",
                "value": [
                    {name: "十进制", value: "Decimal"},
                    {name: "Hex (大端序)", value: "Hex (big endian)"},
                    {name: "Hex (小端序)", value: "Hex (little endian)"}
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
        const [units, format] = args;

        if (!input) return "";

        input = new BigNumber(input);

        if (units === "Seconds (s)") {
            input = input.multipliedBy(new BigNumber("10000000"));
        } else if (units === "Milliseconds (ms)") {
            input = input.multipliedBy(new BigNumber("10000"));
        } else if (units === "Microseconds (μs)") {
            input = input.multipliedBy(new BigNumber("10"));
        } else if (units === "Nanoseconds (ns)") {
            input = input.dividedBy(new BigNumber("100"));
        } else {
            throw new OperationError("无法识别的单位");
        }

        input = input.plus(new BigNumber("116444736000000000"));

        let result;
        if (format.startsWith("Hex")) {
            result = input.toString(16);
        } else {
            result = input.toFixed();
        }

        if (format === "Hex (little endian)") {
            // Swap endianness
            let flipped = "";
            for (let i = result.length - 2; i >= 0; i -= 2) {
                flipped += result.charAt(i);
                flipped += result.charAt(i + 1);
            }
            if (result.length % 2 !== 0) {
                flipped += "0" + result.charAt(0);
            }
            result = flipped;
        }

        return result;
    }

}

export default UNIXTimestampToWindowsFiletime;
