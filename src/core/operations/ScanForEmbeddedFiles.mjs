/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import { scanForFileTypes } from "../lib/FileType.mjs";
import { FILE_SIGNATURES } from "../lib/FileSignatures.mjs";

// 文件类别显示名（与发行版汉化一致）
const CATEGORY_NAMES = {
    "Images": "图片",
    "Video": "视频",
    "Audio": "音频",
    "Documents": "文档",
    "Applications": "应用程序",
    "Archives": "归档文件",
    "Miscellaneous": "其他"
};

/**
 * Scan for Embedded Files operation
 */
class ScanForEmbeddedFiles extends Operation {

    /**
     * ScanForEmbeddedFiles constructor
     */
    constructor() {
        super();

        this.name = "扫描嵌入式文件";
        this.module = "Default";
        this.description = "通过在所有偏移量处查找魔数字节来扫描数据中可能嵌入的文件。此操作容易产生误报。<br><br>警告：大小超过约 100KB 的文件将需要很长时间来处理。";
        this.infoURL = "https://wikipedia.org/wiki/List_of_file_signatures";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = Object.keys(FILE_SIGNATURES).map(cat => {
            return {
                name: CATEGORY_NAMES[cat] || cat,
                type: "boolean",
                value: cat === "Miscellaneous" ? false : true
            };
        });
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let output = "正在扫描数据中的'魔术字节'，其可能表示内嵌文件。以下结果可能存在误报，不应被完全信任。任何足够长的文件都可能偶然包含这些魔术字节。\n",
            numFound = 0;
        const categories = [],
            data = new Uint8Array(input);

        args.forEach((cat, i) => {
            if (cat) categories.push(Object.keys(FILE_SIGNATURES)[i]);
        });

        const types = scanForFileTypes(data, categories);

        if (types.length) {
            types.forEach(type => {
                numFound++;
                output += `\n偏移 ${type.offset} (0x${Utils.hex(type.offset)}):
  文件类型：   ${type.fileDetails.name}
  扩展名：   ${type.fileDetails.extension}
  MIME 类型：   ${type.fileDetails.mime}\n`;

                if (type?.fileDetails?.description?.length) {
                    output += `  描述: ${type.fileDetails.description}\n`;
                }
            });
        }

        if (numFound === 0) {
            output += "\n未找到内嵌文件。";
        }

        return output;
    }

}

export default ScanForEmbeddedFiles;
