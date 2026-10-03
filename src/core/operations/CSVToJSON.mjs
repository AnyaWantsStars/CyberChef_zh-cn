/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";

/**
 * CSV to JSON operation
 */
class CSVToJSON extends Operation {

    /**
     * CSVToJSON constructor
     */
    constructor() {
        super();

        this.name = "CSV 转 JSON";
        this.module = "Default";
        this.description = "将 CSV 文件转换为 JSON 格式。";
        this.infoURL = "https://wikipedia.org/wiki/Comma-separated_values";
        this.inputType = "string";
        this.outputType = "JSON";
        this.args = [
            {
                name: "单元格分隔符",
                type: "binaryShortString",
                value: ","
            },
            {
                name: "行分隔符",
                type: "binaryShortString",
                value: "\\r\\n"
            },
            {
                name: "格式",
                type: "option",
                value: [{name: "字典数组", value: "Array of dictionaries"}, {name: "数组的数组", value: "Array of arrays"}]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        const [cellDelims, rowDelims, format] = args;
        let json, header;

        try {
            json = Utils.parseCSV(input, cellDelims.split(""), rowDelims.split(""));
        } catch (err) {
            throw new OperationError("无法解析 CSV：" + err);
        }

        switch (format) {
            case "Array of dictionaries":
                header = json[0];
                return json.slice(1).map(row => {
                    const obj = {};
                    header.forEach((h, i) => {
                        obj[h] = row[i];
                    });
                    return obj;
                });
            case "Array of arrays":
            default:
                return json;
        }
    }

}

export default CSVToJSON;
