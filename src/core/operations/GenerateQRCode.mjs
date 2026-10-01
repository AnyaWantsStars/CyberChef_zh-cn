/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { generateQrCode } from "../lib/QRCode.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { isImage } from "../lib/FileType.mjs";
import Utils from "../Utils.mjs";

/**
 * Generate QR Code operation
 */
class GenerateQRCode extends Operation {

    /**
     * GenerateQRCode constructor
     */
    constructor() {
        super();

        this.name = "生成 QR Code";
        this.module = "Image";
        this.description = "从输入文本生成快速响应（QR）码。<br><br>QR 码是一种二维条码，可以被智能手机摄像头读取。";
        this.infoURL = "https://wikipedia.org/wiki/QR_code";
        this.inputType = "string";
        this.outputType = "ArrayBuffer";
        this.presentType = "html";
        this.args = [
            {
                "name": "图片格式",
                "type": "option",
                "value": ["PNG", "SVG", "EPS", "PDF"]
            },
            {
                "name": "模块大小（像素）",
                "type": "number",
                "value": 5,
                "min": 1
            },
            {
                "name": "边距（模块数）",
                "type": "number",
                "value": 4,
                "min": 0
            },
            {
                "name": "纠错级别",
                "type": "option",
                "value": [
                    {name: "低", value: "Low"},
                    {name: "中", value: "Medium"},
                    {name: "四分位", value: "Quartile"},
                    {name: "高", value: "High"}
                ],
                "defaultIndex": 1
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        const [format, size, margin, errorCorrection] = args;

        return generateQrCode(input, format, size, margin, errorCorrection);
    }

    /**
     * Displays the QR image using HTML for web apps
     *
     * @param {ArrayBuffer} data
     * @returns {html}
     */
    present(data, args) {
        if (!data.byteLength && !data.length) return "";
        const dataArray = new Uint8Array(data),
            [format] = args;
        if (format === "PNG") {
            const type = isImage(dataArray);
            if (!type) {
                throw new OperationError("无效的文件类型。");
            }

            return `<img src="data:${type};base64,${toBase64(dataArray)}">`;
        }

        return Utils.arrayBufferToStr(data);
    }

}

export default GenerateQRCode;
