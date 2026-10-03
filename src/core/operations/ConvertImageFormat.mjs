/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { Jimp, JimpMime, PNGFilterType } from "jimp";

/**
 * Convert Image Format operation
 */
class ConvertImageFormat extends Operation {
    /**
     * ConvertImageFormat constructor
     */
    constructor() {
        super();

        this.name = "转换图像格式";
        this.module = "Image";
        this.description =
            "在不同格式之间转换图像。支持的格式：<br><ul><li>联合图像专家组（JPEG）</li><li>便携式网络图形（PNG）</li><li>位图（BMP）</li><li>标记图像文件格式（TIFF）</li></ul><br>注意：GIF 文件支持作为输入，但不能输出。";
        this.infoURL = "https://wikipedia.org/wiki/Image_file_formats";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "输出格式",
                type: "option",
                value: ["JPEG", "PNG", "BMP", "TIFF"],
            },
            {
                name: "JPEG 质量",
                type: "number",
                value: 80,
                min: 1,
                max: 100,
            },
            {
                name: "PNG 过滤器类型",
                type: "option",
                value: [{name: "自动", value: "Auto"}, {name: "无", value: "None"}, {name: "子", value: "Sub"}, {name: "上", value: "Up"}, {name: "平均", value: "Average"}, "Paeth"],
            },
            {
                name: "PNG 压缩级别",
                type: "number",
                value: 9,
                min: 0,
                max: 9,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [format, jpegQuality, pngFilterType, pngDeflateLevel] = args;
        const formatMap = {
            JPEG: JimpMime.jpeg,
            PNG: JimpMime.png,
            BMP: JimpMime.bmp,
            TIFF: JimpMime.tiff,
        };

        const pngFilterMap = {
            Auto: PNGFilterType.AUTO,
            None: PNGFilterType.NONE,
            Sub: PNGFilterType.SUB,
            Up: PNGFilterType.UP,
            Average: PNGFilterType.AVERAGE,
            Paeth: PNGFilterType.PATH,
        };

        const mime = formatMap[format];

        if (!isImage(input)) {
            throw new OperationError("无效的文件格式。");
        }
        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`打开图像文件时出错。（${err}）`);
        }
        try {
            let buffer;
            switch (mime) {
                case JimpMime.jpeg:
                    buffer = await image.getBuffer(mime, {
                        quality: jpegQuality,
                    });
                    break;
                case JimpMime.png:
                    buffer = await image.getBuffer(mime, {
                        filterType: pngFilterMap[pngFilterType],
                        deflateLevel: pngDeflateLevel,
                    });
                    break;
                default:
                    buffer = await image.getBuffer(mime);
                    break;
            }

            return buffer.buffer;
        } catch (err) {
            throw new OperationError(`转换图像格式时出错。（${err}）`);
        }
    }

    /**
     * Displays the converted image using HTML for web apps
     *
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const dataArray = new Uint8Array(data);

        const type = isImage(dataArray);
        if (!type) {
            throw new OperationError("无效的文件类型。");
        }

        return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
    }
}

export default ConvertImageFormat;
