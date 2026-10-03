/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Decode operation
 */
class RisonDecode extends Operation {

    /**
     * RisonDecode constructor
     */
    constructor() {
        super();

        this.name = "Rison 解码";
        this.module = "Encodings";
        this.description = "Rison 是一种针对 URI 紧凑性优化的数据序列化格式。Rison 是 JSON 的轻微变体，在 URI 编码后看起来更加简洁。Rison 表达的数据结构集与 JSON 完全相同，因此数据可以在两者之间无损转换，无需猜测。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "string";
        this.outputType = "Object";
        this.args = [
            {
                name: "解码选项",
                type: "editableOption",
                value: [{name: "解码", value: "Decode"}, {name: "解码对象", value: "Decode Object"}, {name: "解码数组", value: "Decode Array"}]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {Object}
     */
    run(input, args) {
        const [decodeOption] = args;
        switch (decodeOption) {
            case "Decode":
                return rison.decode(input);
            case "Decode Object":
                return rison.decode_object(input);
            case "Decode Array":
                return rison.decode_array(input);
            default:
                throw new OperationError("无效的解码选项");
        }
    }
}

export default RisonDecode;
