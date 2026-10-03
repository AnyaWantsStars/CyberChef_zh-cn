/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert data units operation
 */
class ConvertDataUnits extends Operation {

    /**
     * ConvertDataUnits constructor
     */
    constructor() {
        super();

        this.name = "转换数据单位";
        this.module = "Default";
        this.description = "将数据单位转换为另一种格式。";
        this.infoURL = "https://wikipedia.org/wiki/Orders_of_magnitude_(data)";
        this.inputType = "BigNumber";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": DATA_UNITS
            },
            {
                "name": "输出单位",
                "type": "option",
                "value": DATA_UNITS
            }
        ];
    }

    /**
     * @param {BigNumber} input
     * @param {Object[]} args
     * @returns {BigNumber}
     */
    run(input, args) {
        const [inputUnits, outputUnits] = args;

        input = input.times(DATA_FACTOR[inputUnits]);
        return input.div(DATA_FACTOR[outputUnits]);
    }

}

const DATA_UNITS = [
    {name: "比特 (b)", value: "Bits (b)"}, {name: "半字节", value: "Nibbles"}, {name: "八位组", value: "Octets"}, {name: "字节 (B)", value: "Bytes (B)"},
    "[二进制比特 (2^n)]", {name: "千比特 (Kib)", value: "Kibibits (Kib)"}, {name: "兆比特 (Mib)", value: "Mebibits (Mib)"}, {name: "吉比特 (Gib)", value: "Gibibits (Gib)"}, {name: "太比特 (Tib)", value: "Tebibits (Tib)"}, {name: "拍比特 (Pib)", value: "Pebibits (Pib)"}, {name: "艾比特 (Eib)", value: "Exbibits (Eib)"}, {name: "泽比特 (Zib)", value: "Zebibits (Zib)"}, {name: "尧比特 (Yib)", value: "Yobibits (Yib)"}, "[/二进制比特 (2^n)]",
    "[十进制比特 (10^n)]", {name: "十比特", value: "Decabits"}, {name: "百比特", value: "Hectobits"}, {name: "千比特 (Kb)", value: "Kilobits (Kb)"}, {name: "兆比特 (Mb)", value: "Megabits (Mb)"}, {name: "吉比特 (Gb)", value: "Gigabits (Gb)"}, {name: "太比特 (Tb)", value: "Terabits (Tb)"}, {name: "拍比特 (Pb)", value: "Petabits (Pb)"}, {name: "艾比特 (Eb)", value: "Exabits (Eb)"}, {name: "泽比特 (Zb)", value: "Zettabits (Zb)"}, {name: "尧比特 (Yb)", value: "Yottabits (Yb)"}, "[/十进制比特 (10^n)]",
    "[二进制字节 (8 x 2^n)]", {name: "千字节 (KiB)", value: "Kibibytes (KiB)"}, {name: "兆字节 (MiB)", value: "Mebibytes (MiB)"}, {name: "吉字节 (GiB)", value: "Gibibytes (GiB)"}, {name: "太字节 (TiB)", value: "Tebibytes (TiB)"}, {name: "拍字节 (PiB)", value: "Pebibytes (PiB)"}, {name: "艾字节 (EiB)", value: "Exbibytes (EiB)"}, {name: "泽字节 (ZiB)", value: "Zebibytes (ZiB)"}, {name: "尧字节 (YiB)", value: "Yobibytes (YiB)"}, "[/二进制字节 (8 x 2^n)]",
    "[十进制字节 (8 x 10^n)]", {name: "千字节 (KB)", value: "Kilobytes (KB)"}, {name: "兆字节 (MB)", value: "Megabytes (MB)"}, {name: "吉字节 (GB)", value: "Gigabytes (GB)"}, {name: "太字节 (TB)", value: "Terabytes (TB)"}, {name: "拍字节 (PB)", value: "Petabytes (PB)"}, {name: "艾字节 (EB)", value: "Exabytes (EB)"}, {name: "泽字节 (ZB)", value: "Zettabytes (ZB)"}, {name: "尧字节 (YB)", value: "Yottabytes (YB)"}, "[/十进制字节 (8 x 10^n)]"
];

const DATA_FACTOR = { // Multiples of a bit
    "Bits (b)":        1,
    "Nibbles":         4,
    "Octets":          8,
    "Bytes (B)":       8,

    // Binary bits (2^n)
    "Kibibits (Kib)":  1024,
    "Mebibits (Mib)":  1048576,
    "Gibibits (Gib)":  1073741824,
    "Tebibits (Tib)":  1099511627776,
    "Pebibits (Pib)":  1125899906842624,
    "Exbibits (Eib)":  1152921504606846976,
    "Zebibits (Zib)":  1180591620717411303424,
    "Yobibits (Yib)":  1208925819614629174706176,

    // Decimal bits (10^n)
    "Decabits":        10,
    "Hectobits":       100,
    "Kilobits (Kb)":   1e3,
    "Megabits (Mb)":   1e6,
    "Gigabits (Gb)":   1e9,
    "Terabits (Tb)":   1e12,
    "Petabits (Pb)":   1e15,
    "Exabits (Eb)":    1e18,
    "Zettabits (Zb)":  1e21,
    "Yottabits (Yb)":  1e24,

    // Binary bytes (8 x 2^n)
    "Kibibytes (KiB)": 8192,
    "Mebibytes (MiB)": 8388608,
    "Gibibytes (GiB)": 8589934592,
    "Tebibytes (TiB)": 8796093022208,
    "Pebibytes (PiB)": 9007199254740992,
    "Exbibytes (EiB)": 9223372036854775808,
    "Zebibytes (ZiB)": 9444732965739290427392,
    "Yobibytes (YiB)": 9671406556917033397649408,

    // Decimal bytes (8 x 10^n)
    "Kilobytes (KB)":  8e3,
    "Megabytes (MB)":  8e6,
    "Gigabytes (GB)":  8e9,
    "Terabytes (TB)":  8e12,
    "Petabytes (PB)":  8e15,
    "Exabytes (EB)":   8e18,
    "Zettabytes (ZB)": 8e21,
    "Yottabytes (YB)": 8e24,
};


export default ConvertDataUnits;
