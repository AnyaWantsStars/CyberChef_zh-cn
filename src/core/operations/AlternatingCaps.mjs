/**
 * @author sw5678
 * @copyright Crown Copyright 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Alternating caps operation
 */
class AlternatingCaps extends Operation {

    /**
     * AlternatingCaps constructor
     */
    constructor() {
        super();

        this.name = "交替大小写";
        this.module = "Default";
        this.description = "交替大小写，也称为驼峰式大小写、粘性大小写或海绵大小写，是一种文本表示法，其中字母的大小写按某种模式或任意变化。<br><br>此操作将输入字符串的大小写交替转换。";
        this.infoURL = "https://en.wikipedia.org/wiki/Alternating_caps";
        this.inputType = "string";
        this.outputType = "string";
        this.args= [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let output = "";
        let previousCaps = true;
        for (let i = 0; i < input.length; i++) {
            // Check if the element is a letter
            if (!RegExp(/^\p{L}/, "u").test(input[i])) {
                output += input[i];
            } else if (previousCaps) {
                output += input[i].toLowerCase();
                previousCaps = false;
            } else {
                output += input[i].toUpperCase();
                previousCaps = true;
            }
        }
        return output;
    }
}

export default AlternatingCaps;
