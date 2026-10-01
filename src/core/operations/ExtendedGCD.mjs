/**
 * @author p-leriche [philip.leriche@cantab.net]
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { parseBigInt, egcd } from "../lib/BigIntUtils.mjs";

/* ---------- operation class ---------- */

/**
 * Extended GCD operation
 */
class ExtendedGCD extends Operation {
    /**
     * ExtendedGCD constructor
     */
    constructor() {
        super();

        this.name = "扩展 GCD";
        this.module = "Crypto";
        this.description =
            "计算整数 <i>a</i> 和 <i>b</i> 的扩展欧几里得算法。<br><br>找到整数 <i>x</i> 和 <i>y</i>（贝祖系数），使得：<br>a*x + b*y = gcd(a, b)<br><br>这是许多数论算法的基础，包括模逆、求解线性丢番图方程和密码操作。<br><br><b>输入处理：</b>如果 <i>a</i> 或 <i>b</i> 留空，其值将从输入字段中获取。";
        this.infoURL = "https://wikipedia.org/wiki/Extended_Euclidean_algorithm";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "值 a",
                type: "string",
                value: ""
            },
            {
                name: "值 b",
                type: "string",
                value: ""
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [aStr, bStr] = args;

        // Trim everything so "" and "   " count as empty
        const aParam = aStr?.trim();
        const bParam = bStr?.trim();
        const inputVal = input?.trim();

        let a, b;

        if (aParam && bParam) {
            // Case 1: both values given as parameters
            a = aParam;
            b = bParam;
        } else if (!aParam && bParam) {
            // Case 2: a missing - take from input
            a = inputVal;
            b = bParam;
            if (!a) throw new OperationError("值 a 必须已定义");
        } else if (aParam && !bParam) {
            // Case 3: b missing - take from input
            a = aParam;
            b = inputVal;
            if (!b) throw new OperationError("值 b 必须已定义");
        } else if (!aParam && !bParam) {
            // Case 4: both values missing
            throw new OperationError("值 a 和 b 必须已定义");
        }

        const aBI = parseBigInt(a, "Value a");
        const bBI = parseBigInt(b, "Value b");

        const [g, x, y] = egcd(aBI, bBI);
        const gcd = g < 0n ? -g : g;

        // Format output string bearing in mind that crypto-grade numbers
        // may greatly exceed the line length.
        let output = "gcd: " + gcd.toString() + "\n\n";
        output += "Bezout coefficients:\n";
        output += "x = " + x.toString() + "\n";
        output += "y = " + y.toString() + "\n\n";

        return output;
    }
}

export default ExtendedGCD;
