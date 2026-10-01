/**
 * @author CyberChef
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Automated validation test operation
 */
class AutomatedValidationTestOp extends Operation {

    /**
     * AutomatedValidationTestOp constructor
     */
    constructor() {
        super();

        this.name = "自动化验证测试操作";
        this.module = "Default";
        this.description = "专门用于测试自动化参数验证的操作。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "整数",
                "type": "number",
                "value": 5,
                "min": 5,
                "max": 10,
                "integer": true
            },
            {
                "name": "实数",
                "type": "number",
                "value": 1.5,
                "min": 1.5,
                "max": 5.5
            },
            {
                "name": "非空字符串",
                "type": "string",
                "value": "hello",
                "maxLength": 5,
                "allowEmpty": false
            },
            {
                "name": "允许空字符串",
                "type": "string",
                "value": "",
                "allowEmpty": true
            },
            {
                "name": "非空开关字符串",
                "type": "toggleString",
                "value": {
                    "option": "Option A",
                    "string": "test"
                },
                "toggleValues": [{"name": "选项 A", "value": "Option A"}, {"name": "选项 B", "value": "Option B"}],
                "allowEmpty": false
            },
            {
                "name": "选项成分",
                "type": "option",
                "value": ["[分组 1]", {"name": "选项 1", "value": "Option 1"}, {"name": "选项 2", "value": "Option 2"}, "[/分组 1]", "[分组 2]", {"name": "选项 3", "value": "Option 3"}, "[/分组 2]"],
                "allowEmpty": false
            },
            {
                "name": "Arg Selector Ingredient",
                "type": "argSelector",
                "value": [
                    {
                        name: "选项 1",
                        on: [0],
                        off: [1]
                    },
                    {
                        name: "选项 2",
                        on: [1],
                        off: [0]
                    }
                ],
                "allowEmpty": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return "Success";
    }

}

export default AutomatedValidationTestOp;
