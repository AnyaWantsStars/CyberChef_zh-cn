/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Stream from "../lib/Stream.mjs";
import {toHexFast, fromHex} from "../lib/Hex.mjs";
import {toBinary} from "../lib/Binary.mjs";
import {objToTable, bytesToLargeNumber} from "../lib/Protocol.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";
import BigNumber from "bignumber.js";

/**
 * Parse TCP operation
 */
class ParseTCP extends Operation {

    /**
     * ParseTCP constructor
     */
    constructor() {
        super();

        this.name = "解析 TCP";
        this.module = "Default";
        this.description = "解析 TCP 头部和负载（如果存在）。";
        this.infoURL = "https://wikipedia.org/wiki/Transmission_Control_Protocol";
        this.inputType = "string";
        this.outputType = "json";
        this.presentType = "html";
        this.args = [
            {
                name: "输入格式",
                type: "option",
                value: ["Hex", {name: "原始", value: "Raw"}]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const format = args[0];

        if (format === "Hex") {
            input = fromHex(input);
        } else if (format === "Raw") {
            input = Utils.strToArrayBuffer(input);
        } else {
            throw new OperationError("无法识别的输入格式。");
        }

        const s = new Stream(new Uint8Array(input));
        if (s.length < 20) {
            throw new OperationError("TCP 报头至少需要 20 字节");
        }

        // Parse Header
        const TCPPacket = {
            "源端口": s.readInt(2),
            "目的端口": s.readInt(2),
            "序号": bytesToLargeNumber(s.getBytes(4)),
            "确认号": s.readInt(4),
            "数据偏移": s.readBits(4),
            "Flags": {
                "保留": toBinary(s.readBits(3), "", 3),
                "NS": s.readBits(1),
                "CWR": s.readBits(1),
                "ECE": s.readBits(1),
                "URG": s.readBits(1),
                "ACK": s.readBits(1),
                "PSH": s.readBits(1),
                "RST": s.readBits(1),
                "SYN": s.readBits(1),
                "FIN": s.readBits(1),
            },
            "窗口大小": s.readInt(2),
            "校验和": "0x" + toHexFast(s.getBytes(2)),
            "紧急指针": "0x" + toHexFast(s.getBytes(2))
        };

        // Parse options if present
        let windowScaleShift = 0;
        if (TCPPacket["数据偏移"] > 5) {
            let remainingLength = TCPPacket["数据偏移"] * 4 - 20;

            const options = {};
            while (remainingLength > 0) {
                const option = {
                    "Kind": s.readInt(1)
                };

                let opt = { name: "保留", length: true };
                if (Object.prototype.hasOwnProperty.call(TCP_OPTION_KIND_LOOKUP, option.Kind)) {
                    opt = TCP_OPTION_KIND_LOOKUP[option.Kind];
                }

                // Add Length and Value fields
                if (opt.length) {
                    option.Length = s.readInt(1);

                    if (option.Length > 2) {
                        if (Object.prototype.hasOwnProperty.call(opt, "parser")) {
                            option.Value = opt.parser(s.getBytes(option.Length - 2));
                        } else {
                            option.Value = option.Length <= 6 ?
                                s.readInt(option.Length - 2):
                                "0x" + toHexFast(s.getBytes(option.Length - 2));
                        }

                        // Store 窗口缩放 shift for later
                        if (option.Kind === 3 && option.Value) {
                            windowScaleShift = option.Value["移位计数"];
                        }
                    }
                }
                options[opt.name] = option;

                const length = option.Length || 1;
                remainingLength -= length;
            }
            TCPPacket.Options = options;
        }

        if (s.hasMore()) {
            TCPPacket.Data = "0x" + toHexFast(s.getBytes());
        }

        // Improve values
        TCPPacket["数据偏移"] = `${TCPPacket["数据偏移"]} (${TCPPacket["数据偏移"] * 4} bytes)`;
        const trueWndSize = BigNumber(TCPPacket["窗口大小"]).multipliedBy(BigNumber(2).pow(BigNumber(windowScaleShift)));
        TCPPacket["窗口大小"] = `${TCPPacket["窗口大小"]} (Scaled: ${trueWndSize})`;

        return TCPPacket;
    }

    /**
     * Displays the TCP Packet in a tabular style
     * @param {Object} data
     * @returns {html}
     */
    present(data) {
        return objToTable(data);
    }

}

// Taken from https://www.iana.org/assignments/tcp-parameters/tcp-parameters.xhtml
// on 2022-05-30
const TCP_OPTION_KIND_LOOKUP = {
    0: { name: "选项列表结束", length: false },
    1: { name: "无操作", length: false },
    2: { name: "最大报文段大小", length: true },
    3: { name: "窗口缩放", length: true, parser: windowScaleParser },
    4: { name: "允许选择性确认(SACK)", length: true },
    5: { name: "选择性确认(SACK)", length: true },
    6: { name: "回声(已被选项8取代)", length: true },
    7: { name: "回声应答(已被选项8取代)", length: true },
    8: { name: "时间戳", length: true, parser: tcpTimestampParser },
    9: { name: "部分有序连接许可(已废弃)", length: true },
    10: { name: "部分有序服务概要(已废弃)", length: true },
    11: { name: "连接计数CC(已废弃)", length: true },
    12: { name: "CC.NEW(已废弃)", length: true },
    13: { name: "CC.ECHO(已废弃)", length: true },
    14: { name: "TCP备用校验和请求(已废弃)", length: true, parser: tcpAlternateChecksumParser },
    15: { name: "TCP备用校验和数据(已废弃)", length: true },
    16: { name: "Skeeter", length: true },
    17: { name: "Bubba", length: true },
    18: { name: "尾部校验和选项", length: true },
    19: { name: "MD5签名选项(已被选项29取代)", length: true },
    20: { name: "SCPS能力", length: true },
    21: { name: "选择性否定确认", length: true },
    22: { name: "记录边界", length: true },
    23: { name: "遭遇损坏", length: true },
    24: { name: "SNAP", length: true },
    25: { name: "未分配(2000-12-18发布)", length: true },
    26: { name: "TCP压缩过滤器", length: true },
    27: { name: "快速启动响应", length: true },
    28: { name: "用户超时选项(亦含其他已知未授权用途)", length: true },
    29: { name: "TCP认证选项(TCP-AO)", length: true },
    30: { name: "多路径TCP(MPTCP)", length: true },
    69: { name: "加密协商(TCP-ENO)", length: true },
    70: { name: "保留(未获IANA正式分配的已知未授权用途)", length: true },
    76: { name: "保留(未获IANA正式分配的已知未授权用途)", length: true },
    77: { name: "保留(未获IANA正式分配的已知未授权用途)", length: true },
    78: { name: "保留(未获IANA正式分配的已知未授权用途)", length: true },
    253: { name: "RFC3692风格实验1(亦被不当用于量产产品) ", length: true },
    254: { name: "RFC3692风格实验2(亦被不当用于量产产品) ", length: true }
};

/**
 * Parses the TCP Alternate Checksum Request field
 * @param {Uint8Array} data
 */
function tcpAlternateChecksumParser(data) {
    const lookup = {
        0: "TCP Checksum",
        1: "8-bit Fletchers's algorithm",
        2: "16-bit Fletchers's algorithm",
        3: "冗余校验和规避"
    }[data[0]];

    return `${lookup} (0x${toHexFast(data)})`;
}

/**
 * Parses the TCP Timestamp field
 * @param {Uint8Array} data
 */
function tcpTimestampParser(data) {
    const s = new Stream(data);

    if (s.length !== 8)
        return `Error: Timestamp field should be 8 bytes long (received 0x${toHexFast(data)})`;

    const tsval = bytesToLargeNumber(s.getBytes(4)),
        tsecr = bytesToLargeNumber(s.getBytes(4));

    return {
        "Current Timestamp": tsval,
        "Echo Reply": tsecr
    };
}

/**
 * Parses the 窗口缩放 field
 * @param {Uint8Array} data
 */
function windowScaleParser(data) {
    if (data.length !== 1)
        return `Error: 窗口缩放 should be one byte long (received 0x${toHexFast(data)})`;

    return {
        "移位计数": data[0],
        "乘数": 1 << data[0]
    };
}

export default ParseTCP;
