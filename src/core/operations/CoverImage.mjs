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
import {
    Jimp,
    JimpMime,
    ResizeStrategy,
    HorizontalAlign,
    VerticalAlign,
} from "jimp";

/**
 * Cover Image operation
 */
class CoverImage extends Operation {
    /**
     * CoverImage constructor
     */
    constructor() {
        super();

        this.name = "覆盖图像";
        this.module = "Image";
        this.description =
            "将图像缩放到给定的宽度和高度，保持宽高比。图像可能会被裁剪。";
        this.infoURL = "";
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
                name: "水平对齐",
                type: "option",
                value: [{name: "左", value: "Left"}, {name: "中", value: "Center"}, {name: "右", value: "Right"}],
                defaultIndex: 1,
            },
            {
                name: "垂直对齐",
                type: "option",
                value: [{name: "上", value: "Top"}, {name: "中", value: "Center"}, {name: "下", value: "Bottom"}],
                defaultIndex: 1,
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
        const [width, height, hAlign, vAlign, alg] = args;

        const resizeMap = {
            "Nearest Neighbour": ResizeStrategy.NEAREST_NEIGHBOR,
            Bilinear: ResizeStrategy.BILINEAR,
            Bicubic: ResizeStrategy.BICUBIC,
            Hermite: ResizeStrategy.HERMITE,
            Bezier: ResizeStrategy.BEZIER,
        };

        const alignMap = {
            Left: HorizontalAlign.LEFT,
            Center: HorizontalAlign.CENTER,
            Right: HorizontalAlign.RIGHT,
            Top: VerticalAlign.TOP,
            Middle: VerticalAlign.MIDDLE,
            Bottom: VerticalAlign.BOTTOM,
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
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在覆盖图片...");
            image.cover({
                w: width,
                h: height,
                align: alignMap[hAlign] | alignMap[vAlign],
                mode: resizeMap[alg],
            });
            let imageBuffer;
            if (image.mime === "image/gif") {
                imageBuffer = await image.getBuffer(JimpMime.png);
            } else {
                imageBuffer = await image.getBuffer(image.mime);
            }
            return imageBuffer.buffer;
        } catch (err) {
            throw new OperationError(`铺满图像时出错。（${err}）`);
        }
    }

    /**
     * Displays the covered image using HTML for web apps
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

export default CoverImage;
