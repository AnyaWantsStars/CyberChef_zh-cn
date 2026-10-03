/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { parseQrCode } from "../lib/QRCode.mjs";

/**
 * Parse QR Code operation
 */
class ParseQRCode extends Operation {
    /**
     * ParseQRCode constructor
     */
    constructor() {
        super();

        this.name = "解析 QR Code";
        this.module = "Image";
        this.description =
            "读取图像文件，尝试从图像中检测并读取快速响应（QR）码。<br><br><u>图像标准化</u><br>在解析前尝试对图像进行标准化处理，以提高 QR 码的检测率。";
        this.infoURL = "https://wikipedia.org/wiki/QR_code";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "标准化图像",
                type: "boolean",
                value: false,
            },
        ];
        // No Magic checks: detecting a QR code in arbitrary image data requires
        // actually attempting to parse one, which is expensive and produces
        // spurious "Could not read a QR code from the image" log messages for
        // any image input via Magic. Users can add Parse QR Code manually when
        // they know the image contains a QR code. See issue #2610.
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const [normalise] = args;

        if (!isImage(input)) {
            throw new OperationError("无效的文件类型。");
        }
        return parseQrCode(input, normalise);
    }
}

export default ParseQRCode;
