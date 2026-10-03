/**
 * @author Matt C (matt@artemisbot.uk)
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import {JSONPath} from "jsonpath-plus";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * JPath expression operation
 */
class JPathExpression extends Operation {

    /**
     * JPathExpression constructor
     */
    constructor() {
        super();

        this.name = "JPath 表达式";
        this.module = "Code";
        this.description = "使用 JPath 查询从 JSON 对象中提取信息。";
        this.infoURL = "http://goessner.net/articles/JsonPath/";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "查询",
                type: "string",
                value: ""
            },
            {
                name: "结果分隔符",
                type: "binaryShortString",
                value: "\\n"
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [query, delimiter] = args;
        let results, jsonObj;

        try {
            jsonObj = JSON.parse(input);
        } catch (err) {
            throw new OperationError(`无效输入 JSON：${err.message}`);
        }

        try {
            results = JSONPath({
                path: query,
                json: jsonObj
            });
        } catch (err) {
            throw new OperationError(`无效 JPath 表达式：${err.message}`);
        }

        return results.map(result => JSON.stringify(result)).join(delimiter);
    }

}

export default JPathExpression;
