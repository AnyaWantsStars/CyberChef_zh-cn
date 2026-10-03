/**
 * @author n1474335 [n1474335@gmail.com]
 * @author mshwed [m@ttshwed.com]
 * @author Matt C [me@mitt.dev]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isImage } from "../lib/FileType.mjs";
import { toBase64 } from "../lib/Base64.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";

import { createWorker } from "tesseract.js";

const OEM_MODES = [{"name": "仅 Tesseract", "value": "Tesseract only"}, {"name": "仅 LSTM", "value": "LSTM only"}, {"name": "Tesseract/LSTM 组合", "value": "Tesseract/LSTM Combined"}];

const STATUS_TRANSLATIONS = {
    "loading tesseract core": "正在加载 Tesseract 核心",
    "initializing tesseract": "正在初始化 Tesseract",
    "loading language traineddata": "正在加载语言训练数据",
    "initializing api": "正在初始化 API",
    "recognizing text": "正在识别文字",
    "Recognition done": "识别完成",
    "done": "完成"
};

/**
 * Optical Character Recognition operation
 */
class OpticalCharacterRecognition extends Operation {

    /**
     * OpticalCharacterRecognition constructor
     */
    constructor() {
        super();

        this.name = "光学字符识别";
        this.module = "OCR";
        this.description = "光学字符识别（OCR）是将打字、手写或印刷文本的图像机械或电子转换为机器编码文本。<br><br>支持的图像格式：png、jpg、bmp、pbm。";
        this.infoURL = "https://wikipedia.org/wiki/Optical_character_recognition";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "显示置信度",
                type: "boolean",
                value: true
            },
            {
                name: "OCR 引擎模式",
                type: "option",
                value: OEM_MODES,
                defaultIndex: 1
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const [showConfidence, oemChoice] = args;

        if (!isWorkerEnvironment()) throw new OperationError("此操作仅在浏览器中有效");

        const type = isImage(input);
        if (!type) {
            throw new OperationError("不支持的文件类型（支持：jpg、png、pbm、bmp）或未提供文件");
        }

        const assetDir = `${self.docURL}/assets/`;
        const oem = OEM_MODES.findIndex(opt => opt.value === oemChoice);

        try {
            self.sendStatusMessage("正在启动 Tesseract 工作进程...");
            const image = `data:${type};base64,${toBase64(input)}`;
            const worker = await createWorker("eng", oem, {
                workerPath: `${assetDir}tesseract/worker.min.js`,
                langPath: `${assetDir}tesseract/lang-data`,
                corePath: `${assetDir}tesseract/tesseract-core.wasm.js`,
                logger: progress => {
                    if (isWorkerEnvironment()) {
                        const status = STATUS_TRANSLATIONS[progress.status] || progress.status;
                        self.sendStatusMessage(`状态: ${status}${progress.status === "recognizing text" ? ` - ${(parseFloat(progress.progress)*100).toFixed(2)}%`: "" }`);
                    }
                }
            });
            self.sendStatusMessage("正在查找文字...");
            const result = await worker.recognize(image);

            if (showConfidence) {
                return `置信度：${result.data.confidence}%\n\n${result.data.text}`;
            } else {
                return result.data.text;
            }
        } catch (err) {
            throw new OperationError(`对图像执行 OCR 时出错。（${err}）`);
        }
    }
}

export default OpticalCharacterRecognition;
