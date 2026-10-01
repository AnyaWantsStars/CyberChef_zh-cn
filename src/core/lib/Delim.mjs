/**
 * Various delimiters
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

/**
 * Generic sequence delimiters.
 */
export const DELIM_OPTIONS = [{name: "空格", value: "Space"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}, {name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}];

/**
 * Binary sequence delimiters.
 */
export const BIN_DELIM_OPTIONS = [{name: "空格", value: "Space"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}, {name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "无", value: "None"}];

/**
 * Letter sequence delimiters.
 */
export const LETTER_DELIM_OPTIONS = [{name: "空格", value: "Space"}, {name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "正斜杠", value: "Forward slash"}, {name: "反斜杠", value: "Backslash"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}];

/**
 * Word sequence delimiters.
 */
export const WORD_DELIM_OPTIONS = [{name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "正斜杠", value: "Forward slash"}, {name: "反斜杠", value: "Backslash"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}];

/**
 * Input sequence delimiters.
 */
export const INPUT_DELIM_OPTIONS = [{name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "空格", value: "Space"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}, {name: "无（逐字符分隔）", value: "Nothing (separate chars)"}];

/**
 * Arithmetic sequence delimiters
 */
export const ARITHMETIC_DELIM_OPTIONS = [{name: "换行", value: "Line feed"}, {name: "空格", value: "Space"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}, {name: "回车换行", value: "CRLF"}];

/**
 * Hash delimiters
 */
export const HASH_DELIM_OPTIONS = [{name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "空格", value: "Space"}, {name: "逗号", value: "Comma"}];

/**
 * IP delimiters
 */
export const IP_DELIM_OPTIONS = [{name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "空格", value: "Space"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}];

/**
 * Split delimiters.
 */
export const SPLIT_DELIM_OPTIONS = [{name: "逗号", value: "Comma"}, {name: "空格", value: "Space"}, {name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}, {name: "无（逐字符分隔）", value: "Nothing (separate chars)"}];

/**
 * Join delimiters.
 */
export const JOIN_DELIM_OPTIONS = [{name: "换行", value: "Line feed"}, {name: "回车换行", value: "CRLF"}, {name: "空格", value: "Space"}, {name: "逗号", value: "Comma"}, {name: "分号", value: "Semi-colon"}, {name: "冒号", value: "Colon"}, {name: "无（合并字符）", value: "Nothing (join chars)"}];

/**
 * RGBA list delimiters.
 */
export const RGBA_DELIM_OPTIONS = [
    {name: "逗号", value: ","},
    {name: "空格", value: " "},
    {name: "回车换行", value: "\\r\\n"},
    {name: "换行", value: "\n"}
];
