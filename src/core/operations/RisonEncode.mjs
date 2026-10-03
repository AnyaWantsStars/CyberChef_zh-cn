/**
 * @author sg5506844 [sg5506844@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import rison from "rison";

/**
 * Rison Encode operation
 */
class RisonEncode extends Operation {

    /**
     * RisonEncode constructor
     */
    constructor() {
        super();

        this.name = "Rison 编码";
        this.module = "Encodings";
        this.description = "Rison 是一种针对 URI 紧凑性优化的数据序列化格式。Rison 是 JSON 的轻微变体，在 URI 编码后看起来更加简洁。Rison 表达的数据结构集与 JSON 完全相同，因此数据可以在两者之间无损转换，无需猜测。";
        this.infoURL = "https://github.com/Nanonid/rison";
        this.inputType = "Object";
        this.outputType = "string";
        this.args = [
            {
                name: "编码选项",
                type: "option",
                value: [{name: "编码", value: "Encode"}, {name: "编码对象", value: "Encode Object"}, {name: "编码数组", value: "Encode Array"}, {name: "编码 URI", value: "Encode URI"}]
            },
        ];
    }

    /**
     * @param {Object} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [encodeOption] = args;
        switch (encodeOption) {
            case "Encode":
                return rison.encode(input);
            case "Encode Object":
                return rison.encode_object(input);
            case "Encode Array":
                return rison.encode_array(input);
            case "Encode URI":
                return rison.encode_uri(input);
            default:
                throw new OperationError("无效的编码选项");
        }
    }
}

export default RisonEncode;
