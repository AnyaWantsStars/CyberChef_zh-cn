/**
 * Automated Parameter Validation tests
 *
 * @author CyberChef
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Automated Validation: Valid values",
        input: "test",
        expectedOutput: "Success",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Integer Number under min limit",
        input: "test",
        expectedOutput: "整数 必须大于或等于 5。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [4, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Integer Number over max limit",
        input: "test",
        expectedOutput: "整数 必须小于或等于 10。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [11, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Integer Number not an integer",
        input: "test",
        expectedOutput: "整数 必须为整数。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5.5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Real Number under min limit",
        input: "test",
        expectedOutput: "实数 必须大于或等于 1.5。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.4, "hello", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Real Number over max limit",
        input: "test",
        expectedOutput: "实数 必须小于或等于 5.5。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 5.6, "hello", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Non Empty String over maxLength limit",
        input: "test",
        expectedOutput: "非空字符串 的长度不能超过 5。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "helloooo", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Non Empty String is empty",
        input: "test",
        expectedOutput: "非空字符串 不能为空。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Empty Allowed String is empty (allowed)",
        input: "test",
        expectedOutput: "Success",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Non Empty Toggle String is empty",
        input: "test",
        expectedOutput: "非空开关字符串 不能为空。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "" }, "Option 1"]
            }
        ]
    },
    {
        name: "Automated Validation: Invalid Option value",
        input: "test",
        expectedOutput: "选项成分 必须为以下之一：选项 1，选项 2，选项 3。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 4"]
            }
        ]
    },
    {
        name: "Automated Validation: Option value as optgroup heading (invalid)",
        input: "test",
        expectedOutput: "选项成分 必须为以下之一：选项 1，选项 2，选项 3。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "[Group 1]"]
            }
        ]
    },
    {
        name: "Automated Validation: Option value empty (invalid)",
        input: "test",
        expectedOutput: "选项成分 不能为空。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, ""]
            }
        ]
    },
    {
        name: "Automated Validation: Valid Arg Selector value",
        input: "test",
        expectedOutput: "Success",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1", "Option 2"]
            }
        ]
    },
    {
        name: "Automated Validation: Invalid Arg Selector value",
        input: "test",
        expectedOutput: "参数选择器成分 必须为以下之一：选项 1，选项 2。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1", "Option 3"]
            }
        ]
    },
    {
        name: "Automated Validation: Arg Selector value empty (invalid)",
        input: "test",
        expectedOutput: "参数选择器成分 不能为空。",
        recipeConfig: [
            {
                op: "Automated Validation Test Op",
                args: [5, 1.5, "hello", "", { "option": "Option A", "string": "test" }, "Option 1", ""]
            }
        ]
    }
]);
