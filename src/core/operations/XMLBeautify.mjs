/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import vkbeautify from "vkbeautify";
import Operation from "../Operation.mjs";

/**
 * XML Beautify operation
 */
class XMLBeautify extends Operation {

    /**
     * XMLBeautify constructor
     */
    constructor() {
        super();

        this.name = "XML 美化";
        this.module = "Code";
        this.description = "缩进和美化可扩展标记语言（XML）代码。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "缩进字符串", "type": "binaryShortString",
                "value": "\\t"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const indentStr = args[0];
        return vkbeautify.xml(input, indentStr);
    }

}

export default XMLBeautify;
