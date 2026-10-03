/**
 * @author n1073645 [n1073645@gmail.com]
 * @author k3ach [k3ach@proton.me]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Luhn Checksum operation
 */
class LuhnChecksum extends Operation {

    /**
     * LuhnChecksum constructor
     */
    constructor() {
        super();

        this.name = "Luhn 校验和";
        this.module = "Default";
        this.description = "使用英文字母表的 Luhn mod N 算法。Luhn mod N 算法是 Luhn 算法（也称为 mod 10 算法）的扩展，使其能够处理任何偶数进制中的值序列。当需要校验位来验证由字母、字母和数字的组合或任意 N 个字符组成的标识字符串（其中 N 可被 2 整除）时，这非常有用。";
        this.infoURL = "https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "基数",
                "type": "number",
                "value": 10
            }
        ];
    }

    /**
     * Generates the Luhn checksum from the input.
     *
     * @param {string} inputStr
     * @returns {number}
     */
    checksum(inputStr, radix = 10) {
        let even = false;
        return inputStr.split("").reverse().reduce((acc, elem) => {
            // Convert element to an integer based on the provided radix.
            let temp = parseInt(elem, radix);

            // If element is not a valid number in the given radix.
            if (isNaN(temp)) {
                throw new OperationError("字符：" + elem + " 在基数 " + radix + " 中无效。");
            }

            // If element is in an even position
            if (even) {
                // Double the element and sum the quotient and remainder.
                temp = 2 * temp;
                temp = Math.floor(temp / radix) + (temp % radix);
            }

            even = !even;
            return acc + temp;
        }, 0) % radix; // Use radix as the modulus base
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (!input) return "";

        const radix = args[0];

        if (radix < 2 || radix > 36) {
            throw new OperationError("错误：基数必须在 2 到 36 之间");
        }

        if (radix % 2 !== 0) {
            throw new OperationError("错误：基数必须能被 2 整除");
        }

        const checkSum = this.checksum(input, radix).toString(radix);
        let checkDigit = this.checksum(input + "0", radix);
        checkDigit = checkDigit === 0 ? 0 : (radix - checkDigit);
        checkDigit = checkDigit.toString(radix);

        return `校验和：${checkSum}
校验位：${checkDigit}
Luhn 校验字符串：${input + "" + checkDigit}`;
    }

}

export default LuhnChecksum;
