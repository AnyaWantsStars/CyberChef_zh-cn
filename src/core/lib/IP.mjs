/**
 * IP resources.
 *
 * @author picapi
 * @author n1474335 [n1474335@gmail.com]
 * @author Klaxon [klaxon@veyr.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Parses an IPv4 CIDR range (e.g. 192.168.0.0/24) and displays information about it.
 *
 * @param {RegExp} cidr
 * @param {boolean} includeNetworkInfo
 * @param {boolean} enumerateAddresses
 * @param {boolean} allowLargeList
 * @returns {string}
 */
export function ipv4CidrRange(cidr, includeNetworkInfo, enumerateAddresses, allowLargeList) {
    const network = strToIpv4(cidr[1]),
        cidrRange = parseInt(cidr[2], 10);
    let output = "";

    if (cidrRange < 0 || cidrRange > 31) {
        throw new OperationError("IPv4 CIDR 必须小于 32");
    }

    const mask = ~(0xFFFFFFFF >>> cidrRange),
        ip1 = network & mask,
        ip2 = ip1 | ~mask;

    if (includeNetworkInfo) {
        output += "网络：" + ipv4ToStr(ip1) + "\n";
        output += "CIDR：" + cidrRange + "\n";
        output += "掩码：" + ipv4ToStr(mask) + "\n";
        output += "范围：" + ipv4ToStr(ip1) + " - " + ipv4ToStr(ip2) + "\n";
        output += "范围内地址总数：" + (((ip2 - ip1) >>> 0) + 1) + "\n\n";
    }

    if (enumerateAddresses) {
        if (cidrRange >= 16 || allowLargeList) {
            output += generateIpv4Range(ip1, ip2).join("\n");
        } else {
            output += _LARGE_RANGE_ERROR;
        }
    }
    return output;
}

/**
 * Parses an IPv6 CIDR range (e.g. ff00::/48) and displays information about it.
 *
 * @param {RegExp} cidr
 * @param {boolean} includeNetworkInfo
 * @returns {string}
 */
export function ipv6CidrRange(cidr, includeNetworkInfo) {
    let output = "";
    const network = strToIpv6(cidr[1]),
        cidrRange = parseInt(cidr[cidr.length-1], 10);

    if (cidrRange < 0 || cidrRange > 127) {
        throw new OperationError("IPv6 CIDR 必须小于 128");
    }

    const ip1 = new Array(8),
        ip2 = new Array(8),
        total = new Array(128);

    const mask = genIpv6Mask(cidrRange);
    let totalDiff = "";


    for (let i = 0; i < 8; i++) {
        ip1[i] = network[i] & mask[i];
        ip2[i] = ip1[i] | (~mask[i] & 0x0000FFFF);
        totalDiff = (ip2[i] - ip1[i]).toString(2);

        if (totalDiff !== "0") {
            for (let n = 0; n < totalDiff.length; n++) {
                total[i*16 + 16-(totalDiff.length-n)] = totalDiff[n];
            }
        }
    }

    if (includeNetworkInfo) {
        output += "网络：" + ipv6ToStr(ip1) + "\n";
        output += "缩写：" + ipv6ToStr(ip1, true) + "\n";
        output += "CIDR：" + cidrRange + "\n";
        output += "掩码：" + ipv6ToStr(mask) + "\n";
        output += "范围：" + ipv6ToStr(ip1) + " - " + ipv6ToStr(ip2) + "\n";
        output += "范围内地址总数：" + (parseInt(total.join(""), 2) + 1) + "\n\n";
    }

    return output;
}

/**
 * Parses an IPv4 hyphenated range (e.g. 192.168.0.0 - 192.168.0.255) and displays information
 * about it.
 *
 * @param {RegExp} range
 * @param {boolean} includeNetworkInfo
 * @param {boolean} enumerateAddresses
 * @param {boolean} allowLargeList
 * @returns {string}
 */
export function ipv4HyphenatedRange(range, includeNetworkInfo, enumerateAddresses, allowLargeList) {
    const ip1 = strToIpv4(range[0].split("-")[0].trim()),
        ip2 = strToIpv4(range[0].split("-")[1].trim());

    let output = "";

    // Calculate mask
    let diff = ip1 ^ ip2,
        cidr = 32,
        mask = 0;

    while (diff !== 0) {
        diff >>= 1;
        cidr--;
        mask = (mask << 1) | 1;
    }

    mask = ~mask >>> 0;
    const network = ip1 & mask,
        subIp1 = network & mask,
        subIp2 = subIp1 | ~mask;

    if (includeNetworkInfo) {
        output += `容纳此范围所需的最小子网：
\t网络：${ipv4ToStr(network)}
\tCIDR：${cidr}
\t掩码：${ipv4ToStr(mask)}
\t子网范围：${ipv4ToStr(subIp1)} - ${ipv4ToStr(subIp2)}
\t子网内地址总数：${(((subIp2 - subIp1) >>> 0) + 1)}

范围：${ipv4ToStr(ip1)} - ${ipv4ToStr(ip2)}
范围内地址总数：${(((ip2 - ip1) >>> 0) + 1)}

`;
    }

    if (enumerateAddresses) {
        if (((ip2 - ip1) >>> 0) <= 65536 || allowLargeList) {
            output += generateIpv4Range(ip1, ip2).join("\n");
        } else {
            output += _LARGE_RANGE_ERROR;
        }
    }
    return output;
}

/**
 * Parses an IPv6 hyphenated range (e.g. ff00:: - ffff::) and displays information about it.
 *
 * @param {RegExp} range
 * @param {boolean} includeNetworkInfo
 * @returns {string}
 */
export function ipv6HyphenatedRange(range, includeNetworkInfo) {
    const ip1 = strToIpv6(range[0].split("-")[0].trim()),
        ip2 = strToIpv6(range[0].split("-")[1].trim()),
        total = new Array(128).fill();

    let output = "",
        t = "",
        i;

    for (i = 0; i < 8; i++) {
        t = (ip2[i] - ip1[i]).toString(2);
        if (t !== "0") {
            for (let n = 0; n < t.length; n++) {
                total[i*16 + 16-(t.length-n)] = t[n];
            }
        }
    }

    if (includeNetworkInfo) {
        output += "范围：" + ipv6ToStr(ip1) + " - " + ipv6ToStr(ip2) + "\n";
        output += "缩写范围：" + ipv6ToStr(ip1, true) + " - " + ipv6ToStr(ip2, true) + "\n";
        output += "范围内地址总数：" + (parseInt(total.join(""), 2) + 1) + "\n\n";
    }

    return output;
}

/**
 * Parses a list of IPv4 addresses separated by a new line (\n) and displays information
 * about it.
 *
 * @param {RegExp} list
 * @param {boolean} includeNetworkInfo
 * @param {boolean} enumerateAddresses
 * @param {boolean} allowLargeList
 * @returns {string}
 */
export function ipv4ListedRange(match, includeNetworkInfo, enumerateAddresses, allowLargeList) {

    let ipv4List = match[0].split("\n");
    ipv4List = ipv4List.filter(Boolean);

    const ipv4CidrList = ipv4List.filter(function(a) {
        return a.includes("/");
    });
    for (let i = 0; i < ipv4CidrList.length; i++) {
        const network = strToIpv4(ipv4CidrList[i].split("/")[0]);
        const cidrRange = parseInt(ipv4CidrList[i].split("/")[1], 10);
        if (cidrRange < 0 || cidrRange > 31) {
            throw new OperationError("IPv4 CIDR 必须小于 32");
        }
        const mask = ~(0xFFFFFFFF >>> cidrRange),
            cidrIp1 = network & mask,
            cidrIp2 = cidrIp1 | ~mask;
        ipv4List.splice(ipv4List.indexOf(ipv4CidrList[i]), 1);
        ipv4List.push(ipv4ToStr(cidrIp1), ipv4ToStr(cidrIp2));
    }

    ipv4List = ipv4List.sort(ipv4Compare);
    const ip1 = ipv4List[0];
    const ip2 = ipv4List[ipv4List.length - 1];
    const range = [ip1 + " - " + ip2];
    return ipv4HyphenatedRange(range, includeNetworkInfo, enumerateAddresses, allowLargeList);
}

/**
 * Parses a list of IPv6 addresses separated by a new line (\n) and displays information
 * about it.
 *
 * @param {RegExp} list
 * @param {boolean} includeNetworkInfo
 * @returns {string}
 */
export function ipv6ListedRange(match, includeNetworkInfo) {

    let ipv6List = match[0].split("\n");
    ipv6List = ipv6List.filter(function(str) {
        return str.trim();
    });
    for (let i =0; i < ipv6List.length; i++) {
        ipv6List[i] = ipv6List[i].trim();
    }
    const ipv6CidrList = ipv6List.filter(function(a) {
        return a.includes("/");
    });

    for (let i = 0; i < ipv6CidrList.length; i++) {

        const network = strToIpv6(ipv6CidrList[i].split("/")[0]);
        const cidrRange = parseInt(ipv6CidrList[i].split("/")[1], 10);

        if (cidrRange < 0 || cidrRange > 127) {
            throw new OperationError("IPv6 CIDR 必须小于 128");
        }

        const cidrIp1 = new Array(8),
            cidrIp2 = new Array(8);

        const mask = genIpv6Mask(cidrRange);

        for (let j = 0; j < 8; j++) {
            cidrIp1[j] = network[j] & mask[j];
            cidrIp2[j] = cidrIp1[j] | (~mask[j] & 0x0000FFFF);
        }
        ipv6List.splice(ipv6List.indexOf(ipv6CidrList[i]), 1);
        ipv6List.push(ipv6ToStr(cidrIp1), ipv6ToStr(cidrIp2));
    }
    ipv6List = ipv6List.sort(ipv6Compare);
    const ip1 = ipv6List[0];
    const ip2 = ipv6List[ipv6List.length - 1];
    const range = [ip1 + " - " + ip2];
    return ipv6HyphenatedRange(range, includeNetworkInfo);
}

/**
 * Converts an IPv4 address from string format to numerical format.
 *
 * @param {string} ipStr
 * @returns {number}
 *
 * @example
 * // returns 168427520
 * strToIpv4("10.10.0.0");
 */
export function strToIpv4(ipStr) {
    const blocks = ipStr.split("."),
        numBlocks = parseBlocks(blocks);
    let result = 0;

    result += numBlocks[0] << 24;
    result += numBlocks[1] << 16;
    result += numBlocks[2] << 8;
    result += numBlocks[3];

    return result;

    /**
     * Converts a list of 4 numeric strings in the range 0-255 to a list of numbers.
     */
    function parseBlocks(blocks) {
        if (blocks.length !== 4)
            throw new OperationError("超过 4 个块。");

        const numBlocks = [];
        for (let i = 0; i < 4; i++) {
            numBlocks[i] = parseInt(blocks[i], 10);
            if (numBlocks[i] < 0 || numBlocks[i] > 255)
                throw new OperationError("块超出范围。");
        }
        return numBlocks;
    }
}

/**
 * Converts an IPv4 address from numerical format to string format.
 *
 * @param {number} ipInt
 * @returns {string}
 *
 * @example
 * // returns "10.10.0.0"
 * ipv4ToStr(168427520);
 */
export function ipv4ToStr(ipInt) {
    const blockA = (ipInt >> 24) & 255,
        blockB = (ipInt >> 16) & 255,
        blockC = (ipInt >> 8) & 255,
        blockD = ipInt & 255;

    return blockA + "." + blockB + "." + blockC + "." + blockD;
}


/**
 * Converts an IPv6 address from string format to numerical array format.
 *
 * @param {string} ipStr
 * @returns {number[]}
 *
 * @example
 * // returns [65280, 0, 0, 0, 0, 0, 4369, 8738]
 * strToIpv6("ff00::1111:2222");
 */
export function strToIpv6(ipStr) {
    let j = 0;
    const blocks = ipStr.split(":"),
        numBlocks = parseBlocks(blocks),
        ipv6 = new Array(8);

    for (let i = 0; i < 8; i++) {
        if (isNaN(numBlocks[j])) {
            ipv6[i] = 0;
            if (i === (8-numBlocks.slice(j).length)) j++;
        } else {
            ipv6[i] = numBlocks[j];
            j++;
        }
    }
    return ipv6;

    /**
     * Converts a list of 3-8 numeric hex strings in the range 0-65535 to a list of numbers.
     */
    function parseBlocks(blocks) {
        if (blocks.length < 3 || blocks.length > 8)
            throw new OperationError("格式错误的 IPv6 地址。");
        const numBlocks = [];
        for (let i = 0; i < blocks.length; i++) {
            numBlocks[i] = parseInt(blocks[i], 16);
            if (numBlocks[i] < 0 || numBlocks[i] > 65535)
                throw new OperationError("块超出范围。");
        }
        return numBlocks;
    }
}

/**
 * Converts an IPv6 address from numerical array format to string format.
 *
 * @param {number[]} ipv6
 * @param {boolean} compact - Whether or not to return the address in shorthand or not
 * @returns {string}
 *
 * @example
 * // returns "ff00::1111:2222"
 * ipv6ToStr([65280, 0, 0, 0, 0, 0, 4369, 8738], true);
 *
 * // returns "ff00:0000:0000:0000:0000:0000:1111:2222"
 * ipv6ToStr([65280, 0, 0, 0, 0, 0, 4369, 8738], false);
 */
export function ipv6ToStr(ipv6, compact) {
    let output = "",
        i = 0;

    if (compact) {
        let start = -1,
            end = -1,
            s = 0,
            e = -1;

        for (i = 0; i < 8; i++) {
            if (ipv6[i] === 0 && e === (i-1)) {
                e = i;
            } else if (ipv6[i] === 0) {
                s = i; e = i;
            }
            if (e >= 0 && (e-s) > (end - start)) {
                start = s;
                end = e;
            }
        }

        for (i = 0; i < 8; i++) {
            if (i !== start) {
                output += Utils.hex(ipv6[i], 1) + ":";
            } else {
                output += ":";
                i = end;
                if (end === 7) output += ":";
            }
        }
        if (output[0] === ":")
            output = ":" + output;
    } else {
        for (i = 0; i < 8; i++) {
            output += Utils.hex(ipv6[i], 4) + ":";
        }
    }
    return output.slice(0, output.length-1);
}

/**
 * Generates a list of IPv4 addresses in string format between two given numerical values.
 *
 * @param {number} ip
 * @param {number} endIp
 * @returns {string[]}
 *
 * @example
 * // returns ["0.0.0.1", "0.0.0.2", "0.0.0.3"]
 * IP.generateIpv4Range(1, 3);
 */
export function generateIpv4Range(ip, endIp) {
    const range = [];
    if (endIp >= ip) {
        for (; ip <= endIp; ip++) {
            range.push(ipv4ToStr(ip));
        }
    } else {
        range[0] = "第二个 IP 地址小于第一个。";
    }
    return range;
}

/**
 * Generates an IPv6 subnet mask given a CIDR value.
 *
 * @param {number} cidr
 * @returns {number[]}
 */
export function genIpv6Mask(cidr) {
    const mask = new Array(8);
    let shift;

    for (let i = 0; i < 8; i++) {
        if (cidr > ((i+1)*16)) {
            mask[i] = 0x0000FFFF;
        } else {
            shift = cidr-(i*16);
            if (shift < 0) shift = 0;
            mask[i] = ~((0x0000FFFF >>> shift) | 0xFFFF0000);
        }
    }

    return mask;
}

/**
 * Comparison operation for sorting of IPv4 addresses.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function ipv4Compare(a, b) {
    return strToIpv4(a) - strToIpv4(b);
}

/**
 * Comparison operation for sorting of IPv6 addresses.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function ipv6Compare(a, b) {

    const a_ = strToIpv6(a),
        b_ = strToIpv6(b);

    for (let i = 0; i < a_.length; i++) {
        if (a_[i] !== b_[i]) {
            return a_[i] - b_[i];
        }
    }
    return 0;
}

const _LARGE_RANGE_ERROR = "指定的范围包含超过 65,536 个地址。运行此查询可能导致浏览器崩溃。如果仍要运行，请选择“允许大型查询”选项。编辑大型范围时，建议关闭“自动执行”。";

/**
 * A regular expression that matches an IPv4 address
 */
export const IPV4_REGEX = /^\s*((?:\d{1,3}\.){3}\d{1,3})\s*$/;

/**
 * A regular expression that matches an IPv6 address
 */
export const IPV6_REGEX = /^\s*(((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\4)::|:\b|(?![\dA-F])))|(?!\3\4)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4}))\s*$/i;

/**
 * Lookup table for Internet Protocols.
 * Taken from https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml
 */
export const protocolLookup = {
    0: {keyword: "HOPOPT", protocol: "IPv6 逐跳选项"},
    1: {keyword: "ICMP", protocol: "Internet 控制报文"},
    2: {keyword: "IGMP", protocol: "Internet 组管理"},
    3: {keyword: "GGP", protocol: "网关到网关"},
    4: {keyword: "IPv4", protocol: "IPv4 封装"},
    5: {keyword: "ST", protocol: "流"},
    6: {keyword: "TCP", protocol: "传输控制"},
    7: {keyword: "CBT", protocol: "CBT"},
    8: {keyword: "EGP", protocol: "外部网关协议"},
    9: {keyword: "IGP", protocol: "任意私有内部网关（Cisco 用于其 IGRP）"},
    10: {keyword: "BBN-RCC-MON", protocol: "BBN RCC 监控"},
    11: {keyword: "NVP-II", protocol: "网络语音协议"},
    12: {keyword: "PUP", protocol: "PUP"},
    13: {keyword: "ARGUS (deprecated)", protocol: "ARGUS"},
    14: {keyword: "EMCON", protocol: "EMCON"},
    15: {keyword: "XNET", protocol: "交叉网络调试器"},
    16: {keyword: "CHAOS", protocol: "Chaos"},
    17: {keyword: "UDP", protocol: "用户数据报"},
    18: {keyword: "MUX", protocol: "多路复用"},
    19: {keyword: "DCN-MEAS", protocol: "DCN 测量子系统"},
    20: {keyword: "HMP", protocol: "主机监控"},
    21: {keyword: "PRM", protocol: "分组无线电测量"},
    22: {keyword: "XNS-IDP", protocol: "施乐 NS IDP"},
    23: {keyword: "TRUNK-1", protocol: "Trunk-1"},
    24: {keyword: "TRUNK-2", protocol: "Trunk-2"},
    25: {keyword: "LEAF-1", protocol: "Leaf-1"},
    26: {keyword: "LEAF-2", protocol: "Leaf-2"},
    27: {keyword: "RDP", protocol: "可靠数据协议"},
    28: {keyword: "IRTP", protocol: "Internet 可靠事务"},
    29: {keyword: "ISO-TP4", protocol: "ISO 传输协议第 4 类"},
    30: {keyword: "NETBLT", protocol: "批量数据传输协议"},
    31: {keyword: "MFE-NSP", protocol: "MFE 网络服务协议"},
    32: {keyword: "MERIT-INP", protocol: "MERIT 节点间协议"},
    33: {keyword: "DCCP", protocol: "数据报拥塞控制协议"},
    34: {keyword: "3PC", protocol: "第三方连接协议"},
    35: {keyword: "IDPR", protocol: "域间策略路由协议"},
    36: {keyword: "XTP", protocol: "XTP"},
    37: {keyword: "DDP", protocol: "数据报投递协议"},
    38: {keyword: "IDPR-CMTP", protocol: "IDPR 控制消息传输协议"},
    39: {keyword: "TP++", protocol: "TP++ 传输协议"},
    40: {keyword: "IL", protocol: "IL 传输协议"},
    41: {keyword: "IPv6", protocol: "IPv6 封装"},
    42: {keyword: "SDRP", protocol: "源需求路由协议"},
    43: {keyword: "IPv6-Route", protocol: "IPv6 路由头"},
    44: {keyword: "IPv6-Frag", protocol: "IPv6 分片头"},
    45: {keyword: "IDRP", protocol: "域间路由协议"},
    46: {keyword: "RSVP", protocol: "资源预留协议"},
    47: {keyword: "GRE", protocol: "通用路由封装"},
    48: {keyword: "DSR", protocol: "动态源路由协议"},
    49: {keyword: "BNA", protocol: "BNA"},
    50: {keyword: "ESP", protocol: "封装安全载荷"},
    51: {keyword: "AH", protocol: "认证头"},
    52: {keyword: "I-NLSP", protocol: "集成网络层安全 TUBA"},
    53: {keyword: "SWIPE (deprecated)", protocol: "带加密的 IP"},
    54: {keyword: "NARP", protocol: "NBMA 地址解析协议"},
    55: {keyword: "MOBILE", protocol: "IP 移动性"},
    56: {keyword: "TLSP", protocol: "使用 Kryptonet 密钥管理的传输层安全协议"},
    57: {keyword: "SKIP", protocol: "SKIP"},
    58: {keyword: "IPv6-ICMP", protocol: "IPv6 的 ICMP"},
    59: {keyword: "IPv6-NoNxt", protocol: "IPv6 无下一头部"},
    60: {keyword: "IPv6-Opts", protocol: "IPv6 目的选项"},
    61: {keyword: "", protocol: "任意主机内部协议"},
    62: {keyword: "CFTP", protocol: "CFTP"},
    63: {keyword: "", protocol: "任意本地网络"},
    64: {keyword: "SAT-EXPAK", protocol: "SATNET 与 Backroom EXPAK"},
    65: {keyword: "KRYPTOLAN", protocol: "Kryptolan"},
    66: {keyword: "RVD", protocol: "MIT 远程虚拟磁盘协议"},
    67: {keyword: "IPPC", protocol: "Internet Pluribus 分组核心"},
    68: {keyword: "", protocol: "任意分布式文件系统"},
    69: {keyword: "SAT-MON", protocol: "SATNET 监控"},
    70: {keyword: "VISA", protocol: "VISA 协议"},
    71: {keyword: "IPCV", protocol: "Internet 分组核心工具"},
    72: {keyword: "CPNX", protocol: "计算机协议网络执行"},
    73: {keyword: "CPHB", protocol: "计算机协议心跳"},
    74: {keyword: "WSN", protocol: "Wang Span 网络"},
    75: {keyword: "PVP", protocol: "分组视频协议"},
    76: {keyword: "BR-SAT-MON", protocol: "Backroom SATNET 监控"},
    77: {keyword: "SUN-ND", protocol: "SUN ND 协议（临时）"},
    78: {keyword: "WB-MON", protocol: "宽带监控"},
    79: {keyword: "WB-EXPAK", protocol: "宽带 EXPAK"},
    80: {keyword: "ISO-IP", protocol: "ISO Internet 协议"},
    81: {keyword: "VMTP", protocol: "VMTP"},
    82: {keyword: "SECURE-VMTP", protocol: "SECURE-VMTP"},
    83: {keyword: "VINES", protocol: "VINES"},
    84: {keyword: "TTP", protocol: "事务传输协议"},
    85: {keyword: "NSFNET-IGP", protocol: "NSFNET-IGP"},
    86: {keyword: "DGP", protocol: "异类网关协议"},
    87: {keyword: "TCF", protocol: "TCF"},
    88: {keyword: "EIGRP", protocol: "EIGRP"},
    89: {keyword: "OSPFIGP", protocol: "OSPFIGP"},
    90: {keyword: "Sprite-RPC", protocol: "Sprite RPC 协议"},
    91: {keyword: "LARP", protocol: "Locus 地址解析协议"},
    92: {keyword: "MTP", protocol: "组播传输协议"},
    93: {keyword: "AX.25", protocol: "AX.25 帧"},
    94: {keyword: "IPIP", protocol: "IP 内 IP 封装协议"},
    95: {keyword: "MICP (deprecated)", protocol: "移动互联网络控制协议"},
    96: {keyword: "SCC-SP", protocol: "Semaphore 通信安全协议"},
    97: {keyword: "ETHERIP", protocol: "IP 内以太网封装"},
    98: {keyword: "ENCAP", protocol: "封装头"},
    99: {keyword: "", protocol: "任意私有加密方案"},
    100: {keyword: "GMTP", protocol: "GMTP"},
    101: {keyword: "IFMP", protocol: "Ipsilon 流管理协议"},
    102: {keyword: "PNNI", protocol: "IP 上的 PNNI"},
    103: {keyword: "PIM", protocol: "协议无关组播"},
    104: {keyword: "ARIS", protocol: "ARIS"},
    105: {keyword: "SCPS", protocol: "SCPS"},
    106: {keyword: "QNX", protocol: "QNX"},
    107: {keyword: "A/N", protocol: "主动网络"},
    108: {keyword: "IPComp", protocol: "IP 载荷压缩协议"},
    109: {keyword: "SNP", protocol: "Sitara 网络协议"},
    110: {keyword: "Compaq-Peer", protocol: "Compaq 对等协议"},
    111: {keyword: "IPX-in-IP", protocol: "IP 中的 IPX"},
    112: {keyword: "VRRP", protocol: "虚拟路由器冗余协议"},
    113: {keyword: "PGM", protocol: "PGM 可靠传输协议"},
    114: {keyword: "", protocol: "任意 0 跳协议"},
    115: {keyword: "L2TP", protocol: "二层隧道协议"},
    116: {keyword: "DDX", protocol: "D-II 数据交换（DDX）"},
    117: {keyword: "IATP", protocol: "交互代理传输协议"},
    118: {keyword: "STP", protocol: "调度传输协议"},
    119: {keyword: "SRP", protocol: "SpectraLink 无线电协议"},
    120: {keyword: "UTI", protocol: "UTI"},
    121: {keyword: "SMP", protocol: "简单消息协议"},
    122: {keyword: "SM (deprecated)", protocol: "简单组播协议"},
    123: {keyword: "PTP", protocol: "性能透明协议"},
    124: {keyword: "ISIS over IPv4", protocol: ""},
    125: {keyword: "FIRE", protocol: ""},
    126: {keyword: "CRTP", protocol: "作战无线电传输协议"},
    127: {keyword: "CRUDP", protocol: "作战无线电用户数据报"},
    128: {keyword: "SSCOPMCE", protocol: ""},
    129: {keyword: "IPLT", protocol: ""},
    130: {keyword: "SPS", protocol: "安全分组防护"},
    131: {keyword: "PIPE", protocol: "IP 内私有 IP 封装"},
    132: {keyword: "SCTP", protocol: "流控制传输协议"},
    133: {keyword: "FC", protocol: "光纤通道"},
    134: {keyword: "RSVP-E2E-IGNORE", protocol: ""},
    135: {keyword: "Mobility Header", protocol: ""},
    136: {keyword: "UDPLite", protocol: ""},
    137: {keyword: "MPLS-in-IP", protocol: ""},
    138: {keyword: "manet", protocol: "MANET 协议"},
    139: {keyword: "HIP", protocol: "主机标识协议"},
    140: {keyword: "Shim6", protocol: "Shim6 协议"},
    141: {keyword: "WESP", protocol: "包装封装安全载荷"},
    142: {keyword: "ROHC", protocol: "鲁棒头压缩"},
    253: {keyword: "", protocol: "用于实验和测试"},
    254: {keyword: "", protocol: "用于实验和测试"},
    255: {keyword: "Reserved", protocol: ""}
};
