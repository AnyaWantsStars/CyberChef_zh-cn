/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Remove whitespace operation
 */
class RemoveWhitespace extends Operation {

    /**
     * RemoveWhitespace constructor
     */
    constructor() {
        super();

        this.name = "移除空白字符";
        this.module = "Default";
        this.description = "可选择性地移除输入数据中的所有空格、回车、换行、制表符和换页符。<br><br>此操作还支持移除句号，句号有时用于表示 ASCII 输出中的不可打印字节。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "空格",
                "type": "boolean",
                "value": true
            },
            {
                "name": "回车符（\\r）",
                "type": "boolean",
                "value": true
            },
            {
                "name": "换行符（\\n）",
                "type": "boolean",
                "value": true
            },
            {
                "name": "制表符",
                "type": "boolean",
                "value": true
            },
            {
                "name": "换页符（\\f）",
                "type": "boolean",
                "value": true
            },
            {
                "name": "句号",
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
        const [
            removeSpaces,
            removeCarriageReturns,
            removeLineFeeds,
            removeTabs,
            removeFormFeeds,
            removeFullStops
        ] = args;
        let data = input;

        if (removeSpaces) data = data.replace(/ /g, "");
        if (removeCarriageReturns) data = data.replace(/\r/g, "");
        if (removeLineFeeds) data = data.replace(/\n/g, "");
        if (removeTabs) data = data.replace(/\t/g, "");
        if (removeFormFeeds) data = data.replace(/\f/g, "");
        if (removeFullStops) data = data.replace(/\./g, "");
        return data;
    }

}

export default RemoveWhitespace;
