/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import { Jimp, JimpMime } from "jimp";

/**
 * Flip Image operation
 */
class FlipImage extends Operation {
    /**
     * FlipImage constructor
     */
    constructor() {
        super();

        this.name = "翻转图像";
        this.module = "Image";
        this.description = "沿 X 轴或 Y 轴翻转图像。";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "轴",
                type: "option",
                value: [{name: "水平", value: "Horizontal"}, {name: "垂直", value: "Vertical"}],
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [flipAxis] = args;
        if (!isImage(input)) {
            throw new OperationError("无效的输入文件类型。");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`加载图像时出错。（${err}）`);
        }
        try {
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在翻转图片...");
            switch (flipAxis) {
                case "Horizontal":
                    image.flip({
                        horizontal: true,
                        vertical: false,
                    });
                    break;
                case "Vertical":
                    image.flip({
                        horizontal: false,
                        vertical: true,
                    });
                    break;
            }

            let imageBuffer;
            if (image.mime === "image/gif") {
                imageBuffer = await image.getBuffer(JimpMime.png);
            } else {
                imageBuffer = await image.getBuffer(image.mime);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`翻转图像时出错。（${err}）`);
        }
    }

    /**
     * Displays the flipped image using HTML for web apps
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

export default FlipImage;
