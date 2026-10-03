/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import vkbeautify from "vkbeautify";
import Operation from "../Operation.mjs";

/**
 * CSS Minify operation
 */
class CSSMinify extends Operation {

    /**
     * CSSMinify constructor
     */
    constructor() {
        super();

        this.name = "CSS 压缩";
        this.module = "Code";
        this.description = "压缩层叠样式表（CSS）代码。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "保留注释",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const preserveComments = args[0];
        return vkbeautify.cssmin(input, preserveComments);
    }

}

export default CSSMinify;
