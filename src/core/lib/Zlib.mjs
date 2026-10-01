/**
 * Zlib exports.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import zlibAndGzip from "zlibjs/bin/zlib_and_gzip.min.js";

const Zlib = zlibAndGzip.Zlib;

export const COMPRESSION_TYPE = [{name: "动态霍夫曼编码", value: "Dynamic Huffman Coding"}, {name: "固定霍夫曼编码", value: "Fixed Huffman Coding"}, {name: "无 (存储)", value: "None (Store)"}];
export const INFLATE_BUFFER_TYPE = [{name: "自适应", value: "Adaptive"}, {name: "块", value: "Block"}];
export const ZLIB_COMPRESSION_TYPE_LOOKUP = {
    "Fixed Huffman Coding":   Zlib.Deflate.CompressionType.FIXED,
    "Dynamic Huffman Coding": Zlib.Deflate.CompressionType.DYNAMIC,
    "None (Store)":           Zlib.Deflate.CompressionType.NONE,
};
