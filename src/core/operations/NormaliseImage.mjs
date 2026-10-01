/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { Jimp, JimpMime } from "jimp";

/**
 * Normalise Image operation
 */
class NormaliseImage extends Operation {
    /**
     * NormaliseImage constructor
     */
    constructor() {
        super();

        this.name = "规范化图像";
        this.module = "Image";
        this.description = "归一化图像颜色。";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        if (!isImage(input)) {
            throw new OperationError("无效的文件类型。");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`打开图像文件时出错。（${err}）`);
        }

        try {
            image.normalize();

            let imageBuffer;
            if (image.mime === "image/gif") {
                imageBuffer = await image.getBuffer(JimpMime.png);
            } else {
                imageBuffer = await image.getBuffer(image.mime);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`归一化图像时出错。（${err}）`);
        }
    }

    /**
     * Displays the normalised image using HTML for web apps
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

export default NormaliseImage;
