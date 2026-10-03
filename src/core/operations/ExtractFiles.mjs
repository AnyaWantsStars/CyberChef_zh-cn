/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import {scanForFileTypes, extractFile} from "../lib/FileType.mjs";
import {FILE_SIGNATURES} from "../lib/FileSignatures.mjs";

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
 * Extract Files operation
 */
class ExtractFiles extends Operation {

    /**
     * ExtractFiles constructor
     */
    constructor() {
        super();

        // Get the first extension for each signature that can be extracted
        let supportedExts = Object.keys(FILE_SIGNATURES).map(cat => {
            return FILE_SIGNATURES[cat]
                .filter(sig => sig.extractor)
                .map(sig => sig.extension.toUpperCase());
        });

        // Flatten categories and remove duplicates
        supportedExts = [].concat(...supportedExts).unique();

        this.name = "提取文件";
        this.module = "Default";
        this.description = `执行文件雕刻，尝试从输入中提取文件。
<br><br>
此操作目前能够提取以下格式：
            <ul>
                <li>
                ${supportedExts.join("</li><li>")}
            </ul>可以使用最小文件大小来修剪小的误报。`;
        this.infoURL = "https://forensics.wiki/file_carving";
        this.inputType = "ArrayBuffer";
        this.outputType = "List<File>";
        this.presentType = "html";
        this.args = Object.keys(FILE_SIGNATURES).map(cat => {
            return {
                name: CATEGORY_NAMES[cat] || cat,
                type: "boolean",
                value: cat === "Miscellaneous" ? false : true
            };
        }).concat([
            {
                name: "忽略失败的提取",
                type: "boolean",
                value: true
            },
            {
                name: "最小文件大小",
                type: "number",
                value: 100
            }
        ]);
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {List<File>}
     */
    run(input, args) {
        const bytes = new Uint8Array(input),
            categories = [],
            minSize = args.pop(1),
            ignoreFailedExtractions = args.pop(1);

        args.forEach((cat, i) => {
            if (cat) categories.push(Object.keys(FILE_SIGNATURES)[i]);
        });

        // Scan for embedded files
        const detectedFiles = scanForFileTypes(bytes, categories);

        // Extract each file that we support
        const files = [];
        const errors = [];
        detectedFiles.forEach(detectedFile => {
            try {
                const file = extractFile(bytes, detectedFile.fileDetails, detectedFile.offset);
                if (file.size >= minSize)
                    files.push(file);
            } catch (err) {
                if (!ignoreFailedExtractions && err.message.indexOf("No extraction algorithm available") < 0) {
                    errors.push(
                        `尝试提取 ${detectedFile.fileDetails.name} ` +
                        `（偏移量 ${detectedFile.offset}）：\n` +
                        `${err.message}`
                    );
                }
            }
        });

        if (errors.length) {
            throw new OperationError(errors.join("\n\n"));
        }

        return files;
    }


    /**
     * Displays the files in HTML for web apps.
     *
     * @param {File[]} files
     * @returns {html}
     */
    async present(files) {
        return await Utils.displayFilesAsHTML(files);
    }

}

export default ExtractFiles;
