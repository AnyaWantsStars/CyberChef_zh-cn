/**
 * @author Ge0rg3 [georgeomnet+cyberchef@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { Jimp } from "jimp";

/**
 * View Bit Plane operation
 */
class ViewBitPlane extends Operation {
    /**
     * ViewBitPlane constructor
     */
    constructor() {
        super();

        this.name = "查看位平面";
        this.module = "Image";
        this.description =
            "提取并显示任意图像的一个位平面。位平面仅显示每个像素的单个位，可用于隐写术中隐藏消息。";
        this.infoURL = "https://wikipedia.org/wiki/Bit_plane";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "颜色",
                type: "option",
                value: COLOUR_OPTIONS,
            },
            {
                name: "位",
                type: "number",
                value: 0,
            },
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    async run(input, args) {
        if (!isImage(input))
            throw new OperationError("请输入有效的图像文件。");

        const [colour, bit] = args;
        let parsedImage;
        try {
            parsedImage = await Jimp.read(input);
        } catch (err) {
            throw new OperationError(`加载图像时出错。（${err}）`);
        }

        const width = parsedImage.bitmap.width,
            height = parsedImage.bitmap.height,
            colourIndex = COLOUR_OPTIONS.findIndex(opt => opt.value === colour),
            bitIndex = 7 - bit;

        if (bit < 0 || bit > 7) {
            throw new OperationError(
                "错误：位参数必须在 0 到 7 之间",
            );
        }

        let pixel, bin, newPixelValue;

        parsedImage.scan(0, 0, width, height, function (x, y, idx) {
            pixel = this.bitmap.data[idx + colourIndex];
            bin = Utils.bin(pixel);
            newPixelValue = 255;

            if (bin.charAt(bitIndex) === "1") newPixelValue = 0;

            for (let i = 0; i < 3; i++) {
                this.bitmap.data[idx + i] = newPixelValue;
            }
            this.bitmap.data[idx + 3] = 255;
        });

        const imageBuffer = await parsedImage.getBuffer(parsedImage.mime);

        return new Uint8Array(imageBuffer).buffer;
    }

    /**
     * Displays the extracted data as an image for web apps.
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data) {
        if (!data.byteLength) return "";
        const type = isImage(data);

        return `<img src="data:${type};base64,${toBase64(data)}">`;
    }
}

const COLOUR_OPTIONS = [{"name": "红色", "value": "Red"}, {"name": "绿色", "value": "Green"}, {"name": "蓝色", "value": "Blue"}, {"name": "Alpha 通道", "value": "Alpha"}];

export default ViewBitPlane;
