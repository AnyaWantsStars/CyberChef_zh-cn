/**
 * @author Jon K (jon@ajarsoftware.com)
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import jsonata from "jsonata";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Jsonata Query operation
 */
class JsonataQuery extends Operation {
    /**
     * JsonataQuery constructor
     */
    constructor() {
        super();

        this.name = "Jsonata 查询";
        this.module = "Code";
        this.description =
            "使用 jsonata 查询来查询和转换 JSON 数据。";
        this.infoURL = "https://docs.jsonata.org/overview.html";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "查询",
                type: "text",
                value: "string",
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        const [query] = args;
        let result, jsonObj;

        try {
            jsonObj = JSON.parse(input);
        } catch (err) {
            throw new OperationError(`无效输入 JSON：${err.message}`);
        }

        try {
            const expression = jsonata(query);
            // Override built-in base64 functions which fail in Web Worker
            // context where `window` is undefined. The jsonata library falls
            // back to `global.Buffer` which also does not exist in workers.
            // `atob`/`btoa` are available in both browser and worker scopes.
            expression.registerFunction("base64decode", (str) => {
                if (typeof str === "undefined") return undefined;
                return atob(str);
            }, "<s-:s>");
            expression.registerFunction("base64encode", (str) => {
                if (typeof str === "undefined") return undefined;
                return btoa(str);
            }, "<s-:s>");
            result = await expression.evaluate(jsonObj);
        } catch (err) {
            throw new OperationError(
                `无效的 Jsonata 表达式：${err.message}`
            );
        }

        return JSON.stringify(result === undefined ? "" : result);
    }
}

export default JsonataQuery;
