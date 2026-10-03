/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { genPolybiusSquare } from "../lib/Ciphers.mjs";

/**
 * Bifid Cipher Encode operation
 */
class BifidCipherEncode extends Operation {

    /**
     * BifidCipherEncode constructor
     */
    constructor() {
        super();

        this.name = "Bifid 密码 编码";
        this.module = "Ciphers";
        this.description = "Bifid 密码是一种使用 Polybius 方阵结合换位的密码，在不知道字母表关键词的情况下很难破译。";
        this.infoURL = "https://wikipedia.org/wiki/Bifid_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "关键词",
                "type": "string",
                "value": ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     *
     * @throws {OperationError} if key is invalid
     */
    run(input, args) {
        const keywordStr = args[0].toUpperCase().replace("J", "I"),
            keyword = keywordStr.split("").unique(),
            alpha = "ABCDEFGHIKLMNOPQRSTUVWXYZ",
            xCo = [],
            yCo = [],
            structure = [];

        let output = "",
            count = 0;


        if (!/^[A-Z]+$/.test(keywordStr) && keyword.length > 0)
            throw new OperationError("密钥必须仅由英文字母表中的字母组成");

        const polybius = genPolybiusSquare(keywordStr);

        input.replace("J", "I").split("").forEach(letter => {
            const alpInd = alpha.split("").indexOf(letter.toLocaleUpperCase()) >= 0;
            let polInd;

            if (alpInd) {
                for (let i = 0; i < 5; i++) {
                    polInd = polybius[i].indexOf(letter.toLocaleUpperCase());
                    if (polInd >= 0) {
                        xCo.push(polInd);
                        yCo.push(i);
                    }
                }

                if (alpha.split("").indexOf(letter) >= 0) {
                    structure.push(true);
                } else if (alpInd) {
                    structure.push(false);
                }
            } else {
                structure.push(letter);
            }
        });

        const trans = `${yCo.join("")}${xCo.join("")}`;

        structure.forEach(pos => {
            if (typeof pos === "boolean") {
                const coords = trans.substr(2*count, 2).split("");

                output += pos ?
                    polybius[coords[0]][coords[1]] :
                    polybius[coords[0]][coords[1]].toLocaleLowerCase();
                count++;
            } else {
                output += pos;
            }
        });

        return output;
    }

    /**
     * Highlight Bifid Cipher Encode
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight Bifid Cipher Encode in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default BifidCipherEncode;
