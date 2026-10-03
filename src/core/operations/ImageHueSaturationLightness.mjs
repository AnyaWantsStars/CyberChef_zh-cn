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
 * Image Hue/Saturation/Lightness operation
 */
class ImageHueSaturationLightness extends Operation {
    /**
     * ImageHueSaturationLightness constructor
     */
    constructor() {
        super();

        this.name = "图像色相/饱和度/亮度";
        this.module = "Image";
        this.description =
            "调整图像的色相/饱和度/亮度（HSL）值。";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "色相",
                type: "number",
                value: 0,
                min: -360,
                max: 360,
            },
            {
                name: "饱和度",
                type: "number",
                value: 0,
                min: -100,
                max: 100,
            },
            {
                name: "明度",
                type: "number",
                value: 0,
                min: -100,
                max: 100,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [hue, saturation, lightness] = args;

        if (!isImage(input)) {
            throw new OperationError("无效的文件类型。");
        }

        let image;
        try {
            image = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`加载图像时出错。（${err}）`);
        }
        try {
            if (hue !== 0) {
                if (isWorkerEnvironment())
                    self.sendStatusMessage("正在调整图片色相...");
                image.color([
                    {
                        apply: "hue",
                        params: [hue],
                    },
                ]);
            }
            if (saturation !== 0) {
                if (isWorkerEnvironment())
                    self.sendStatusMessage("正在调整图片饱和度...");
                image.color([
                    {
                        apply: "saturate",
                        params: [saturation],
                    },
                ]);
            }
            if (lightness !== 0) {
                if (isWorkerEnvironment())
                    self.sendStatusMessage("正在调整图片明度...");
                image.color([
                    {
                        apply: "lighten",
                        params: [lightness],
                    },
                ]);
            }

            let imageBuffer;
            if (image.mime === "image/gif") {
                imageBuffer = await image.getBuffer(JimpMime.png);
            } else {
                imageBuffer = await image.getBuffer(image.mime);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(
                `调整图像色相/饱和度/明度时出错。（${err}）`,
            );
        }
    }

    /**
     * Displays the image using HTML for web apps
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

export default ImageHueSaturationLightness;
