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
import { Jimp, JimpMime, ResizeStrategy } from "jimp";

/**
 * Resize Image operation
 */
class ResizeImage extends Operation {
    /**
     * ResizeImage constructor
     */
    constructor() {
        super();

        this.name = "调整大小";
        this.module = "Image";
        this.description =
            "将图像调整为指定的宽度和高度值。";
        this.infoURL = "https://wikipedia.org/wiki/Image_scaling";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "宽度",
                type: "number",
                value: 100,
                min: 1,
            },
            {
                name: "高度",
                type: "number",
                value: 100,
                min: 1,
            },
            {
                name: "单位类型",
                type: "option",
                value: [{name: "像素", value: "Pixels"}, {name: "百分号", value: "Percent"}],
            },
            {
                name: "保持宽高比",
                type: "boolean",
                value: false,
            },
            {
                name: "缩放算法",
                type: "option",
                value: [{name: "最近邻", value: "Nearest Neighbour"}, {name: "双线性", value: "Bilinear"}, {name: "双三次", value: "Bicubic"}, {name: "埃尔米特", value: "Hermite"}, {name: "贝塞尔", value: "Bezier"}],
                defaultIndex: 1,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    async run(input, args) {
        let width = args[0],
            height = args[1];
        const unit = args[2],
            aspect = args[3],
            resizeAlg = args[4];

        const resizeMap = {
            "Nearest Neighbour": ResizeStrategy.NEAREST_NEIGHBOR,
            Bilinear: ResizeStrategy.BILINEAR,
            Bicubic: ResizeStrategy.BICUBIC,
            Hermite: ResizeStrategy.HERMITE,
            Bezier: ResizeStrategy.BEZIER,
        };

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
            if (unit === "Percent") {
                width = image.width * (width / 100);
                height = image.height * (height / 100);
            }

            if (isWorkerEnvironment())
                self.sendStatusMessage("正在调整图片大小...");
            if (aspect) {
                image.scaleToFit({
                    w: width,
                    h: height,
                    mode: resizeMap[resizeAlg],
                });
            } else {
                image.resize({
                    w: width,
                    h: height,
                    mode: resizeMap[resizeAlg],
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
            throw new OperationError(`调整图像大小时出错。（${err}）`);
        }
    }

    /**
     * Displays the resized image using HTML for web apps
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

export default ResizeImage;
