/**
 * @author pointhi [thomas.pointhuber@gmx.at]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import { Jimp, JimpMime, ResizeStrategy, rgbaToInt } from "jimp";

// arbitrary limits to prevent resource exhaustion
// scale factor of 64 is big enough to likely result in scaling in the display
// window anyway
// pixels per row is harder to come up with a figure that won't inconvenience
// someone. 2048 feels like a reasonable compromise
const MAX_PIXEL_SCALE_FACTOR = 64;
const MAX_PIXELS_PER_ROW = 2048;

/**
 * Generate Image operation
 */
class GenerateImage extends Operation {
    /**
     * GenerateImage constructor
     */
    constructor() {
        super();

        this.name = "生成图像";
        this.module = "Image";
        this.description =
            "使用输入数据作为像素值生成图像。";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                name: "模式",
                type: "option",
                value: [{name: "灰度", value: "Greyscale"}, "RG", "RGB", "RGBA", {name: "位", value: "Bits"}],
            },
            {
                name: "像素缩放因子",
                type: "number",
                value: 8,
                integer: true,
                min: 1,
                max: MAX_PIXEL_SCALE_FACTOR,
            },
            {
                name: "每行像素数",
                type: "number",
                value: 64,
                integer: true,
                min: 1,
                max: MAX_PIXELS_PER_ROW,
            },
        ];
    }

    /**
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    async run(input, args) {
        const [mode, scale, width] = args;
        input = new Uint8Array(input);

        const bytePerPixelMap = {
            Greyscale: 1,
            RG: 2,
            RGB: 3,
            RGBA: 4,
            Bits: 1 / 8,
        };

        if (!Object.hasOwn(bytePerPixelMap, mode)) {
            throw new OperationError(`不支持的模式：（${mode}）`);
        }

        const bytesPerPixel = bytePerPixelMap[mode];

        if (bytesPerPixel > 0 && input.length % bytesPerPixel !== 0) {
            throw new OperationError(
                `字节数不是 ${bytesPerPixel} 的除数`,
            );
        }

        const height = Math.ceil(input.length / bytesPerPixel / width);
        const image = new Jimp({ width, height });

        if (isWorkerEnvironment())
            self.sendStatusMessage("正在根据数据生成图片...");

        if (mode === "Bits") {
            let index = 0;
            for (let j = 0; j < input.length; j++) {
                const curByte = Utils.bin(input[j]);
                for (let k = 0; k < 8; k++, index++) {
                    const x = index % width;
                    const y = Math.floor(index / width);

                    const value = curByte[k] === "0" ? 0xff : 0x00;
                    const pixel = rgbaToInt(value, value, value, 0xff);
                    image.setPixelColor(pixel, x, y);
                }
            }
        } else {
            let i = 0;
            while (i < input.length) {
                const index = i / bytesPerPixel;
                const x = index % width;
                const y = Math.floor(index / width);

                let red = 0x00;
                let green = 0x00;
                let blue = 0x00;
                let alpha = 0xff;

                switch (mode) {
                    case "Greyscale":
                        red = green = blue = input[i++];
                        break;

                    case "RG":
                        red = input[i++];
                        green = input[i++];
                        break;

                    case "RGB":
                        red = input[i++];
                        green = input[i++];
                        blue = input[i++];
                        break;

                    case "RGBA":
                        red = input[i++];
                        green = input[i++];
                        blue = input[i++];
                        alpha = input[i++];
                        break;

                    default:
                        throw new OperationError(`不支持的模式：（${mode}）`);
                }

                try {
                    const pixel = rgbaToInt(red, green, blue, alpha);
                    image.setPixelColor(pixel, x, y);
                } catch (err) {
                    throw new OperationError(
                        `从像素值生成图像时出错。（${err}）`,
                    );
                }
            }
        }

        if (scale !== 1) {
            if (isWorkerEnvironment())
                self.sendStatusMessage("正在缩放图片...");

            image.scaleToFit({
                w: width * scale,
                h: height * scale,
                mode: ResizeStrategy.NEAREST_NEIGHBOR,
            });
        }

        try {
            // see https://nodejs.org/docs/latest-v24.x/api/buffer.html#bufbyteoffset
            // for why we can't just return result.buffer
            const result = await image.getBuffer(JimpMime.png);
            return result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
        } catch (err) {
            throw new OperationError(`生成图像时出错。（${err}）`);
        }
    }

    /**
     * Displays the generated image using HTML for web apps
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

export default GenerateImage;
