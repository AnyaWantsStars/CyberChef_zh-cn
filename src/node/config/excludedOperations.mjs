/**
 * Operations to exclude from the Node API
 *
 * @author d98762656 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */
export default  [
    // This functionality can be done more easily using JavaScript
    "分支",
    "合并",
    "跳转",
    "条件跳转",
    "标签",
    "注释",

    // esprima doesn't work in .mjs
    "JavaScript 美化",
    "JavaScript 压缩",
    "JavaScript 解析器",

    // Irrelevant in Node console
    "语法高亮",
];
