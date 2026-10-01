/**
 * @author klaxon [klaxon@veyr.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { GenerateParagraphs, GenerateSentences, GenerateWords, GenerateBytes } from "../lib/LoremIpsum.mjs";

// arbitrary limits set to avoid DoS by requesting ridiculous amounts of data
const maxLoremWords = 100_000; // same limit also used for paragraphs/sentences
const maxLoremCharacters = 1_000_000;

/**
 * Generate Lorem Ipsum operation
 */
class GenerateLoremIpsum extends Operation {

    /**
     * GenerateLoremIpsum constructor
     */
    constructor() {
        super();

        this.name = "生成 Lorem Ipsum";
        this.module = "Default";
        this.description = "生成不同长度的 Lorem Ipsum 占位文本。";
        this.infoURL = "https://wikipedia.org/wiki/Lorem_ipsum";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "长度", "type": "number",
                "value": "3"
            },
            {
                "name": "长度单位",
                "type": "option",
                "value": [
                    {name: "段落", value: "Paragraphs"},
                    {name: "句子", value: "Sentences"},
                    {name: "词", value: "Words"},
                    {name: "字节", value: "Bytes"}
                ]
            }

        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [length, lengthType] = args;
        checkLimits(lengthType, length);
        switch (lengthType) {
            case "Paragraphs":
                return GenerateParagraphs(length);
            case "Sentences":
                return GenerateSentences(length);
            case "Words":
                return GenerateWords(length);
            case "Bytes":
                return GenerateBytes(length);
            default:
                throw new OperationError("无效的长度类型");

        }
    }

}

export default GenerateLoremIpsum;

/**
 * check combined validity of lengthType and length arguments
 * @param {string} lengthType
 * @param {number} length
 * @throws {OperationError}
 */
function checkLimits(lengthType, length) {
    if (length < 1) {
        throw new OperationError("长度必须大于 0");
    }

    switch (lengthType) {
        case "Paragraphs":
        case "Sentences":
        case "Words":
            if (length > maxLoremWords) {
                throw new OperationError("长度必须小于 " + maxLoremWords);
            }
            break;
        case "Bytes":
            if (length > maxLoremCharacters) {
                throw new OperationError("长度必须小于 " + maxLoremCharacters);
            }
            break;
        default:
            throw new OperationError("无效的长度类型");
    }
}
