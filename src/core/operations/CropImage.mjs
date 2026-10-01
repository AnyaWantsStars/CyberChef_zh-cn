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
 * Crop Image operation
 */
class CropImage extends Operation {
    /**
     * CropImage constructor
     */
    constructor() {
        super();

        this.name = "裁剪图像";
        this.module = "Image";
        this.description =
            "将图像裁剪到指定区域，或自动裁剪边缘。<br><br><b><u>自动裁剪</u></b><br>自动裁剪图像中同色边框。<br><br><u>自动裁剪容差</u><br>像素间颜色差异的容差百分比值。<br><br><u>仅自动裁剪边框</u><br>仅裁剪真实边框（所有边必须有相同的边框）<br><br><u>对称自动裁剪</u><br>强制自动裁剪对称（上下和左右裁剪相同的量）<br><br><u>自动裁剪保留边框</u><br>图像周围保留的边框像素数。";
        this.infoURL = "https://wikipedia.org/wiki/Cropping_(image)";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "X位置",
                type: "number",
                value: 0,
                min: 0,
            },
            {
                name: "Y位置",
                type: "number",
                value: 0,
                min: 0,
            },
            {
                name: "宽度",
                type: "number",
                value: 10,
                min: 1,
            },
            {
                name: "高度",
                type: "number",
                value: 10,
                min: 1,
            },
            {
                name: "自动裁剪",
                type: "boolean",
                value: false,
            },
            {
                name: "自动裁剪容差（%）",
                type: "number",
                value: 0.02,
                min: 0,
                max: 100,
                step: 0.01,
            },
            {
                name: "仅自动裁剪帧",
                type: "boolean",
                value: true,
            },
            {
                name: "对称自动裁剪",
                type: "boolean",
                value: false,
            },
            {
                name: "自动裁剪保留边框（px）",
                type: "number",
                value: 0,
                min: 0,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        const [
            xPos,
            yPos,
            width,
            height,
            autocrop,
            autoTolerance,
            autoFrames,
            autoSymmetric,
            autoBorder,
        ] = args;
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
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在裁剪图片...");
            if (autocrop) {
                image.autocrop({
                    tolerance: autoTolerance / 100,
                    cropOnlyFrames: autoFrames,
                    cropSymmetric: autoSymmetric,
                    leaveBorder: autoBorder,
                });
            } else {
                image.crop({
                    x: xPos,
                    y: yPos,
                    w: width,
                    h: height,
                });
            }

            let imageBuffer;
            if (image.mime === "image/gif") {
                imageBuffer = await image.getBuffer(JimpMime.png);
            } else {
                imageBuffer = await image.getBuffer(image.mime);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`裁剪图像时出错。（${err}）`);
        }
    }

    /**
     * Displays the cropped image using HTML for web apps
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

export default CropImage;
