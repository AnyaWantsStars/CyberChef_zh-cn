/**
 * Character encoding resources.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import cptable from "codepage";

/**
 * Character encoding format mappings.
 */
export const CHR_ENC_CODE_PAGES = {
    "UTF-8 (65001)": 65001,
    "UTF-7 (65000)": 65000,
    "UTF-16LE (1200)": 1200,
    "UTF-16BE (1201)": 1201,
    "UTF-32LE (12000)": 12000,
    "UTF-32BE (12001)": 12001,
    "IBM EBCDIC 国际 (500)": 500,
    "IBM EBCDIC 美国-加拿大 (37)": 37,
    "IBM EBCDIC 多语言/ROECE（拉丁 2）(870)": 870,
    "IBM EBCDIC 希腊语现代 (875)": 875,
    "IBM EBCDIC 法语 (1010)": 1010,
    "IBM EBCDIC 土耳其语（拉丁 5）(1026)": 1026,
    "IBM EBCDIC 拉丁 1/开放系统 (1047)": 1047,
    "IBM EBCDIC 老挝语 (1132/1133/1341)": 1132,
    "IBM EBCDIC 美国-加拿大（037 + 欧元符号）(1140)": 1140,
    "IBM EBCDIC 德语（20273 + 欧元符号）(1141)": 1141,
    "IBM EBCDIC 丹麦-挪威语（20277 + 欧元符号）(1142)": 1142,
    "IBM EBCDIC 芬兰-瑞典语（20278 + 欧元符号）(1143)": 1143,
    "IBM EBCDIC 意大利语（20280 + 欧元符号）(1144)": 1144,
    "IBM EBCDIC 拉丁美洲-西班牙语（20284 + 欧元符号）(1145)": 1145,
    "IBM EBCDIC 英国（20285 + 欧元符号）(1146)": 1146,
    "IBM EBCDIC 法语（20297 + 欧元符号）(1147)": 1147,
    "IBM EBCDIC 国际（500 + 欧元符号）(1148)": 1148,
    "IBM EBCDIC 冰岛语（20871 + 欧元符号）(1149)": 1149,
    "IBM EBCDIC 德语 (20273)": 20273,
    "IBM EBCDIC 丹麦-挪威语 (20277)": 20277,
    "IBM EBCDIC 芬兰-瑞典语 (20278)": 20278,
    "IBM EBCDIC 意大利语 (20280)": 20280,
    "IBM EBCDIC 拉丁美洲-西班牙语 (20284)": 20284,
    "IBM EBCDIC 英国 (20285)": 20285,
    "IBM EBCDIC 日语片假名扩展 (20290)": 20290,
    "IBM EBCDIC 法语 (20297)": 20297,
    "IBM EBCDIC 阿拉伯语 (20420)": 20420,
    "IBM EBCDIC 希腊语 (20423)": 20423,
    "IBM EBCDIC 希伯来语 (20424)": 20424,
    "IBM EBCDIC 韩语扩展 (20833)": 20833,
    "IBM EBCDIC 泰语 (20838)": 20838,
    "IBM EBCDIC 冰岛语 (20871)": 20871,
    "IBM EBCDIC 西里尔文俄语 (20880)": 20880,
    "IBM EBCDIC 土耳其语 (20905)": 20905,
    "IBM EBCDIC 拉丁 1/开放系统（1047 + 欧元符号）(20924)": 20924,
    "IBM EBCDIC 西里尔文塞尔维亚-保加利亚语 (21025)": 21025,
    "OEM 美国 (437)": 437,
    "OEM 希腊语（原 437G）；希腊语 (DOS) (737)": 737,
    "OEM 波罗的海语；波罗的海语 (DOS) (775)": 775,
    "OEM 俄语；西里尔文 + 欧元符号 (808)": 808,
    "OEM 多语言拉丁 1；西欧 (DOS) (850)": 850,
    "OEM 拉丁 2；中欧 (DOS) (852)": 852,
    "OEM 西里尔文（主要为俄语）(855)": 855,
    "OEM 土耳其语；土耳其语 (DOS) (857)": 857,
    "OEM 多语言拉丁 1 + 欧元符号 (858)": 858,
    "OEM 葡萄牙语；葡萄牙语 (DOS) (860)": 860,
    "OEM 冰岛语；冰岛语 (DOS) (861)": 861,
    "OEM 希伯来语；希伯来语 (DOS) (862)": 862,
    "OEM 法语（加拿大）；法语（加拿大）(DOS) (863)": 863,
    "OEM 阿拉伯语；阿拉伯语 (864) (864)": 864,
    "OEM 北欧；北欧 (DOS) (865)": 865,
    "OEM 俄语；西里尔文 (DOS) (866)": 866,
    "OEM 现代希腊语；希腊语现代 (DOS) (869)": 869,
    "OEM 西里尔文（主要为俄语）+ 欧元符号 (872)": 872,
    "Windows-874 泰语 (874)": 874,
    "Windows-1250 中欧 (1250)": 1250,
    "Windows-1251 西里尔文 (1251)": 1251,
    "Windows-1252 拉丁 (1252)": 1252,
    "Windows-1253 希腊语 (1253)": 1253,
    "Windows-1254 土耳其语 (1254)": 1254,
    "Windows-1255 希伯来语 (1255)": 1255,
    "Windows-1256 阿拉伯语 (1256)": 1256,
    "Windows-1257 波罗的海语 (1257)": 1257,
    "Windows-1258 越南 (1258)": 1258,
    "ISO-8859-1 拉丁 1 西欧 (28591)": 28591,
    "ISO-8859-2 拉丁 2 中欧 (28592)": 28592,
    "ISO-8859-3 拉丁 3 南欧 (28593)": 28593,
    "ISO-8859-4 拉丁 4 北欧 (28594)": 28594,
    "ISO-8859-5 拉丁/西里尔文 (28595)": 28595,
    "ISO-8859-6 拉丁/阿拉伯语 (28596)": 28596,
    "ISO-8859-7 拉丁/希腊语 (28597)": 28597,
    "ISO-8859-8 拉丁/希伯来语 (28598)": 28598,
    "ISO 8859-8 希伯来语（ISO 逻辑）(38598)": 38598,
    "ISO-8859-9 拉丁 5 土耳其语 (28599)": 28599,
    "ISO-8859-10 拉丁 6 北欧 (28600)": 28600,
    "ISO-8859-11 拉丁/泰语 (28601)": 28601,
    "ISO-8859-13 拉丁 7 波罗的海沿岸 (28603)": 28603,
    "ISO-8859-14 拉丁 8 凯尔特语 (28604)": 28604,
    "ISO-8859-15 拉丁 9 (28605)": 28605,
    "ISO-8859-16 拉丁 10 (28606)": 28606,
    "ISO 2022 JIS 日语（无半角片假名）(50220)": 50220,
    "ISO 2022 JIS 日语（带半角片假名）(50221)": 50221,
    "ISO 2022 日语 JIS X 0201-1989（1 字节假名-SO/SI）(50222)": 50222,
    "ISO 2022 韩语 (50225)": 50225,
    "ISO 2022 简体中文 (50227)": 50227,
    "ISO 6937 非间距重音 (20269)": 20269,
    "EUC 日语 (51932)": 51932,
    "EUC 简体中文 (51936)": 51936,
    "EUC 韩语 (51949)": 51949,
    "ISCII 天城文 (57002)": 57002,
    "ISCII 孟加拉语 (57003)": 57003,
    "ISCII 泰米尔语 (57004)": 57004,
    "ISCII 泰卢固语 (57005)": 57005,
    "ISCII 阿萨姆语 (57006)": 57006,
    "ISCII 奥里亚语 (57007)": 57007,
    "ISCII 坎纳达语 (57008)": 57008,
    "ISCII 马拉雅拉姆语 (57009)": 57009,
    "ISCII 古吉拉特语 (57010)": 57010,
    "ISCII 旁遮普语 (57011)": 57011,
    "日语 Shift-JIS (932)": 932,
    "简体中文 GBK (936)": 936,
    "韩语 (949)": 949,
    "繁体中文 Big5 (950)": 950,
    "US-ASCII（7 位）(20127)": 20127,
    "简体中文 GB2312 (20936)": 20936,
    "KOI8-R 俄语西里尔文 (20866)": 20866,
    "KOI8-U 乌克兰语西里尔文 (21866)": 21866,
    "Mazovia（波兰语）MS-DOS (620)": 620,
    "阿拉伯语 (ASMO 708) (708)": 708,
    "阿拉伯语（透明 ASMO）；阿拉伯语 (DOS) (720)": 720,
    "Kamenický（捷克语）MS-DOS (895)": 895,
    "韩语 (Johab) (1361)": 1361,
    "MAC 罗马 (10000)": 10000,
    "日语 (Mac) (10001)": 10001,
    "MAC 繁体中文 (Big5) (10002)": 10002,
    "韩语 (Mac) (10003)": 10003,
    "阿拉伯语 (Mac) (10004)": 10004,
    "希伯来语 (Mac) (10005)": 10005,
    "希腊语 (Mac) (10006)": 10006,
    "西里尔文 (Mac) (10007)": 10007,
    "MAC 简体中文 (GB 2312) (10008)": 10008,
    "罗马尼亚语 (Mac) (10010)": 10010,
    "乌克兰语 (Mac) (10017)": 10017,
    "泰语 (Mac) (10021)": 10021,
    "MAC 拉丁 2（中欧）(10029)": 10029,
    "冰岛语 (Mac) (10079)": 10079,
    "土耳其语 (Mac) (10081)": 10081,
    "克罗地亚语 (Mac) (10082)": 10082,
    "CNS 台湾（繁体中文）(20000)": 20000,
    "TCA 台湾 (20001)": 20001,
    "ETEN 台湾（繁体中文）(20002)": 20002,
    "IBM5550 台湾 (20003)": 20003,
    "TeleText 台湾 (20004)": 20004,
    "Wang 台湾 (20005)": 20005,
    "西欧 IA5（IRV 国际字母表 5）(20105)": 20105,
    "IA5 德语（7 位）(20106)": 20106,
    "IA5 瑞典语（7 位）(20107)": 20107,
    "IA5 挪威语（7 位）(20108)": 20108,
    "T.61 (20261)": 20261,
    "日语（JIS 0208-1990 与 0212-1990）(20932)": 20932,
    "韩语 Wansung (20949)": 20949,
    "扩展/扩展 Alpha 小写 (21027)": 21027,
    "Europa 3 (29001)": 29001,
    "Atari ST/TT (47451)": 47451,
    "HZ-GB2312 简体中文 (52936)": 52936,
    "简体中文 GB18030 (54936)": 54936,
};

export const CHR_ENC_SIMPLE_LOOKUP = {};
export const CHR_ENC_SIMPLE_REVERSE_LOOKUP = {};

for (const name in CHR_ENC_CODE_PAGES) {
    const simpleName = name.match(/(^.+)\([\d/]+\)$/)[1].trim();

    CHR_ENC_SIMPLE_LOOKUP[simpleName] = CHR_ENC_CODE_PAGES[name];
    CHR_ENC_SIMPLE_REVERSE_LOOKUP[CHR_ENC_CODE_PAGES[name]] = simpleName;
}

/**
 * Returns the width of the character set for the given codepage.
 * For example, UTF-8 is a Single Byte Character Set, whereas
 * UTF-16 is a Double Byte Character Set.
 *
 * @param {number} page - The codepage number
 * @returns {number}
 */
export function chrEncWidth(page) {
    if (typeof page !== "number") return 0;

    // Raw Bytes have a width of 1
    if (page === 0) return 1;

    const pageStr = page.toString();
    // Confirm this page is legitimate
    if (!Object.prototype.hasOwnProperty.call(CHR_ENC_SIMPLE_REVERSE_LOOKUP, pageStr))
        return 0;

    // Statically defined code pages
    if (Object.prototype.hasOwnProperty.call(cptable, pageStr))
        return cptable[pageStr].dec.length > 256 ? 2 : 1;

    // Cached code pages
    if (cptable.utils.cache.sbcs.includes(pageStr))
        return 1;
    if (cptable.utils.cache.dbcs.includes(pageStr))
        return 2;

    // Dynamically generated code pages
    if (Object.prototype.hasOwnProperty.call(cptable.utils.magic, pageStr)) {
        // Generate a single character and measure it
        const a = cptable.utils.encode(page, "a");
        return a.length;
    }

    return 0;
}

/**
 * Unicode Normalisation Forms
 *
 * @author Matthieu [m@tthieu.xyz]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */
export const UNICODE_NORMALISATION_FORMS = ["NFD", "NFC", "NFKD", "NFKC"];

/**
 * Detects whether the input buffer is valid UTF8.
 *
 * @param {ArrayBuffer} data
 * @returns {number} - 0 = not UTF8, 1 = ASCII, 2 = UTF8
 */
export function isUTF8(data) {
    const bytes = new Uint8Array(data);
    let i = 0;
    let onlyASCII = true;
    while (i < bytes.length) {
        if (( // ASCII
            bytes[i] === 0x09 ||
            bytes[i] === 0x0A ||
            bytes[i] === 0x0D ||
            (0x20 <= bytes[i] && bytes[i] <= 0x7E)
        )) {
            i += 1;
            continue;
        }

        onlyASCII = false;

        if (( // non-overlong 2-byte
            (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
            (0x80 <= bytes[i+1] && bytes[i+1] <= 0xBF)
        )) {
            i += 2;
            continue;
        }

        if (( // excluding overlongs
            bytes[i] === 0xE0 &&
            (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
        ) ||
        ( // straight 3-byte
            ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
            bytes[i] === 0xEE ||
            bytes[i] === 0xEF) &&
            (0x80 <= bytes[i + 1] && bytes[i+1] <= 0xBF) &&
            (0x80 <= bytes[i+2] && bytes[i+2] <= 0xBF)
        ) ||
        ( // excluding surrogates
            bytes[i] === 0xED &&
            (0x80 <= bytes[i+1] && bytes[i+1] <= 0x9F) &&
            (0x80 <= bytes[i+2] && bytes[i+2] <= 0xBF)
        )) {
            i += 3;
            continue;
        }

        if (( // planes 1-3
            bytes[i] === 0xF0 &&
            (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
            (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
        ) ||
        ( // planes 4-15
            (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
            (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
            (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
        ) ||
        ( // plane 16
            bytes[i] === 0xF4 &&
            (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
            (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
        )) {
            i += 4;
            continue;
        }

        return 0;
    }

    return onlyASCII ? 1 : 2;
}
