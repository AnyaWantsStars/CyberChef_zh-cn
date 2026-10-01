/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import OperationError from "../errors/OperationError.mjs";
import Operation from "../Operation.mjs";
import * as terser from "terser";

/**
 * JavaScript Minify operation
 */
class JavaScriptMinify extends Operation {

    /**
     * JavaScriptMinify constructor
     */
    constructor() {
        super();

        this.name = "JavaScript 压缩";
        this.module = "Code";
        this.description = "压缩 JavaScript 代码。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const result = await terser.minify(input);
        if (result.error) {
            throw new OperationError(`JavaScript 压缩错误。（${result.error}）`);
        }
        return result.code;
    }

}

export default JavaScriptMinify;
