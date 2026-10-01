/**
 * @author kendallgoto [k@kgo.to]
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Handlebars from "handlebars";

/**
 * Template operation
 */
class Template extends Operation {

    /**
     * Template constructor
     */
    constructor() {
        super();

        this.name = "模板";;
        this.module = "Handlebars";
        this.description = "使用 Handlebars/Mustache 模板引擎渲染模板，通过 JSON 输入替换变量。为防止 XSS 攻击，模板将仅渲染为纯文本。";
        this.infoURL = "https://handlebarsjs.com/";
        this.inputType = "JSON";
        this.outputType = "string";
        this.args = [
            {
                name: "模板定义（.handlebars）",
                type: "text",
                value: ""
            }
        ];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [templateStr] = args;
        try {
            const template = Handlebars.compile(templateStr);
            return template(input);
        } catch (e) {
            throw new OperationError(e);
        }
    }
}

export default Template;
