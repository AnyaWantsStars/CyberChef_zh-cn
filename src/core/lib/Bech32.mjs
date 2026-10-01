/**
 * Pure JavaScript implementation of Bech32 and Bech32m encoding.
 *
 * Bech32 is defined in BIP-0173: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
 * Bech32m is defined in BIP-0350: https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki
 *
 * @author Medjedtxm
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import OperationError from "../errors/OperationError.mjs";

/** Bech32 character set (32 characters, excludes 1, b, i, o) */
const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

/** Reverse lookup table for decoding */
const CHARSET_REV = {};
for (let i = 0; i < CHARSET.length; i++) {
    CHARSET_REV[CHARSET[i]] = i;
}

/** Checksum constant for Bech32 (BIP-0173) */
const BECH32_CONST = 1;

/** Checksum constant for Bech32m (BIP-0350) */
const BECH32M_CONST = 0x2bc830a3;

/** Generator polynomial coefficients for checksum */
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

/**
 * Compute the polymod checksum
 * @param {number[]} values - Array of 5-bit values
 * @returns {number} - Checksum value
 */
function polymod(values) {
    let chk = 1;
    for (const v of values) {
        const top = chk >> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ v;
        for (let i = 0; i < 5; i++) {
            if ((top >> i) & 1) {
                chk ^= GENERATOR[i];
            }
        }
    }
    return chk;
}

/**
 * Expand HRP for checksum computation
 * @param {string} hrp - Human-readable part (lowercase)
 * @returns {number[]} - Expanded values
 */
function hrpExpand(hrp) {
    const result = [];
    for (let i = 0; i < hrp.length; i++) {
        result.push(hrp.charCodeAt(i) >> 5);
    }
    result.push(0);
    for (let i = 0; i < hrp.length; i++) {
        result.push(hrp.charCodeAt(i) & 31);
    }
    return result;
}

/**
 * Verify checksum of a Bech32/Bech32m string
 * @param {string} hrp - Human-readable part (lowercase)
 * @param {number[]} data - Data including checksum (5-bit values)
 * @param {string} encoding - "Bech32" or "Bech32m"
 * @returns {boolean} - True if checksum is valid
 */
function verifyChecksum(hrp, data, encoding) {
    const constant = encoding === "Bech32m" ? BECH32M_CONST : BECH32_CONST;
    return polymod(hrpExpand(hrp).concat(data)) === constant;
}

/**
 * Create checksum for Bech32/Bech32m encoding
 * @param {string} hrp - Human-readable part (lowercase)
 * @param {number[]} data - Data values (5-bit)
 * @param {string} encoding - "Bech32" or "Bech32m"
 * @returns {number[]} - 6 checksum values
 */
function createChecksum(hrp, data, encoding) {
    const constant = encoding === "Bech32m" ? BECH32M_CONST : BECH32_CONST;
    const values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
    const mod = polymod(values) ^ constant;
    const result = [];
    for (let i = 0; i < 6; i++) {
        result.push((mod >> (5 * (5 - i))) & 31);
    }
    return result;
}

/**
 * Convert 8-bit bytes to 5-bit words
 * @param {number[]|Uint8Array} data - Input bytes
 * @returns {number[]} - 5-bit words
 */
export function toWords(data) {
    let value = 0;
    let bits = 0;
    const result = [];

    for (let i = 0; i < data.length; i++) {
        value = (value << 8) | data[i];
        bits += 8;

        while (bits >= 5) {
            bits -= 5;
            result.push((value >> bits) & 31);
        }
    }

    // Pad remaining bits
    if (bits > 0) {
        result.push((value << (5 - bits)) & 31);
    }

    return result;
}

/**
 * Convert 5-bit words to 8-bit bytes
 * @param {number[]} words - 5-bit words
 * @returns {number[]} - Output bytes
 */
export function fromWords(words) {
    let value = 0;
    let bits = 0;
    const result = [];

    for (let i = 0; i < words.length; i++) {
        value = (value << 5) | words[i];
        bits += 5;

        while (bits >= 8) {
            bits -= 8;
            result.push((value >> bits) & 255);
        }
    }

    // Check for invalid padding per BIP-0173
    // Condition 1: Cannot have 5+ bits remaining (would indicate incomplete byte)
    if (bits >= 5) {
        throw new OperationError("无效填充：剩余位数过多");
    }
    // Condition 2: Remaining padding bits must all be zero
    if (bits > 0) {
        const paddingValue = (value << (8 - bits)) & 255;
        if (paddingValue !== 0) {
            throw new OperationError("无效填充：填充中存在非零位");
        }
    }

    return result;
}

/**
 * Encode data to Bech32/Bech32m string
 *
 * @param {string} hrp - Human-readable part
 * @param {number[]|Uint8Array} data - Data bytes to encode
 * @param {string} encoding - "Bech32" or "Bech32m"
 * @param {boolean} segwit - If true, treat first byte as witness version (for Bitcoin SegWit)
 * @returns {string} - Encoded Bech32/Bech32m string
 */
export function encode(hrp, data, encoding = "Bech32", segwit = false) {
    // Validate HRP
    if (!hrp || hrp.length === 0) {
        throw new OperationError("人类可读部分（HRP）不能为空。");
    }

    // Check HRP characters (ASCII 33-126)
    for (let i = 0; i < hrp.length; i++) {
        const c = hrp.charCodeAt(i);
        if (c < 33 || c > 126) {
            throw new OperationError(`HRP 在位置 ${i} 包含无效字符。仅允许可打印的 ASCII 字符（33-126）。`);
        }
    }

    // Convert HRP to lowercase
    const hrpLower = hrp.toLowerCase();

    let words;
    if (segwit && data.length >= 2) {
        // SegWit encoding: first byte is witness version (0-16), rest is witness program
        const witnessVersion = data[0];
        if (witnessVersion > 16) {
            throw new OperationError(`无效的 witness 版本：${witnessVersion}。必须为 0-16。`);
        }
        const witnessProgram = Array.prototype.slice.call(data, 1);

        // Validate witness program length per BIP-0141
        if (witnessProgram.length < 2 || witnessProgram.length > 40) {
            throw new OperationError(`无效的 witness 程序长度：${witnessProgram.length}。必须为 2-40 字节。`);
        }
        if (witnessVersion === 0 && witnessProgram.length !== 20 && witnessProgram.length !== 32) {
            throw new OperationError(`v0 的 witness 程序长度无效：${witnessProgram.length}。必须为 20 或 32 字节。`);
        }

        // Witness version is kept as single 5-bit value, program is converted
        words = [witnessVersion].concat(toWords(witnessProgram));
    } else {
        // Generic encoding: convert all bytes to 5-bit words
        words = toWords(data);
    }

    // Create checksum
    const checksum = createChecksum(hrpLower, words, encoding);

    // Build result string
    let result = hrpLower + "1";
    for (const w of words.concat(checksum)) {
        result += CHARSET[w];
    }

    // Check maximum length (90 characters)
    if (result.length > 90) {
        throw new OperationError(`编码字符串超过 90 个字符的最大长度（当前 ${result.length}）。请考虑使用更小的输入数据。`);
    }

    return result;
}

/**
 * Decode a Bech32/Bech32m string
 *
 * @param {string} str - Bech32/Bech32m encoded string
 * @param {string} encoding - "Bech32", "Bech32m" 或 "自动检测"
 * @returns {{hrp: string, data: number[]}} - Decoded HRP and data bytes
 */
export function decode(str, encoding = "自动检测") {
    // Check for empty input
    if (!str || str.length === 0) {
        throw new OperationError("输入不能为空。");
    }

    // Check maximum length
    if (str.length > 90) {
        throw new OperationError(`无效的 Bech32 字符串：超过 90 个字符的最大长度（当前 ${str.length}）。`);
    }

    // Check for mixed case
    const hasUpper = /[A-Z]/.test(str);
    const hasLower = /[a-z]/.test(str);
    if (hasUpper && hasLower) {
        throw new OperationError("无效的 Bech32 字符串：不允许混合大小写。请全部使用大写或全部使用小写。");
    }

    // Convert to lowercase for processing
    str = str.toLowerCase();

    // Find separator (last occurrence of '1')
    const sepIndex = str.lastIndexOf("1");
    if (sepIndex === -1) {
        throw new OperationError("无效的 Bech32 字符串：未找到分隔符 '1'。");
    }

    if (sepIndex === 0) {
        throw new OperationError("无效的 Bech32 字符串：人类可读部分（HRP）不能为空。");
    }

    if (sepIndex + 7 > str.length) {
        throw new OperationError("无效的 Bech32 字符串：数据部分过短（校验和最少需要 6 个字符）。");
    }

    // Extract HRP and data part
    const hrp = str.substring(0, sepIndex);
    const dataPart = str.substring(sepIndex + 1);

    // Validate HRP characters
    for (let i = 0; i < hrp.length; i++) {
        const c = hrp.charCodeAt(i);
        if (c < 33 || c > 126) {
            throw new OperationError(`HRP 在位置 ${i} 包含无效字符。`);
        }
    }

    // Decode data characters to 5-bit values
    const data = [];
    for (let i = 0; i < dataPart.length; i++) {
        const c = dataPart[i];
        if (CHARSET_REV[c] === undefined) {
            throw new OperationError(`位置 ${sepIndex + 1 + i} 存在无效字符 '${c}'。`);
        }
        data.push(CHARSET_REV[c]);
    }

    // Verify checksum
    let usedEncoding;
    if (encoding === "Bech32") {
        if (!verifyChecksum(hrp, data, "Bech32")) {
            throw new OperationError("无效的 Bech32 校验和。");
        }
        usedEncoding = "Bech32";
    } else if (encoding === "Bech32m") {
        if (!verifyChecksum(hrp, data, "Bech32m")) {
            throw new OperationError("无效的 Bech32m 校验和。");
        }
        usedEncoding = "Bech32m";
    } else {
        // 自动检测：先尝试 Bech32，再尝试 Bech32m
        if (verifyChecksum(hrp, data, "Bech32")) {
            usedEncoding = "Bech32";
        } else if (verifyChecksum(hrp, data, "Bech32m")) {
            usedEncoding = "Bech32m";
        } else {
            throw new OperationError("无效的 Bech32/Bech32m 字符串：校验和验证失败。");
        }
    }

    // Remove checksum (last 6 values)
    const words = data.slice(0, data.length - 6);

    // Check if this is likely a SegWit address (Bitcoin, Litecoin, etc.)
    // For SegWit, the first 5-bit word is the witness version (0-16)
    // and should be extracted separately, not bit-converted with the rest
    const segwitHrps = ["bc", "tb", "ltc", "tltc", "bcrt"];
    const couldBeSegWit = segwitHrps.includes(hrp) && words.length > 0 && words[0] <= 16;

    let bytes;
    let witnessVersion = null;

    if (couldBeSegWit) {
        // Try SegWit decode first
        try {
            witnessVersion = words[0];
            const programWords = words.slice(1);
            const programBytes = fromWords(programWords);

            // Validate SegWit witness program length (20 or 32 bytes for v0, 2-40 for others)
            const validV0 = witnessVersion === 0 && (programBytes.length === 20 || programBytes.length === 32);
            const validOther = witnessVersion !== 0 && programBytes.length >= 2 && programBytes.length <= 40;

            if (validV0 || validOther) {
                // Valid SegWit address
                bytes = [witnessVersion, ...programBytes];
            } else {
                // Not valid SegWit, fall back to generic decode
                witnessVersion = null;
                bytes = fromWords(words);
            }
        } catch (e) {
            // SegWit decode failed, try generic decode
            witnessVersion = null;
            try {
                bytes = fromWords(words);
            } catch (e2) {
                throw new OperationError(`解码数据失败：${e2.message}`);
            }
        }
    } else {
        // Generic Bech32: convert all words
        try {
            bytes = fromWords(words);
        } catch (e) {
            throw new OperationError(`解码数据失败：${e.message}`);
        }
    }

    return {
        hrp: hrp,
        data: bytes,
        encoding: usedEncoding,
        witnessVersion: witnessVersion
    };
}
