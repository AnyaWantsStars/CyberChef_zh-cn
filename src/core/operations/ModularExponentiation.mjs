/**
 * @author p-leriche [philip.leriche@cantab.net]
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { parseBigInt, modPow } from "../lib/BigIntUtils.mjs";

/* ---------- operation class ---------- */

/**
 * Modular Exponentiation operation
 */
class ModularExponentiation extends Operation {

    /**
     * ModularExponentiation constructor
     */
    constructor() {
        super();

        this.name = "模幂运算";
        this.module = "Crypto";
        this.description = "执行模幂运算，用于 Diffie-Hellman 和 RSA。<br><br>计算 基数 ^ 指数 mod 模数。<br><br><b>输入处理：</b>如果 <i>基数</i> 或 <i>指数</i> 留空，其值将从输入字段中获取。";
        this.infoURL = "https://wikipedia.org/wiki/Modular_exponentiation";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "基数",
                type: "string",
                value: ""
            },
            {
                name: "模数",
                type: "string",
                value: "1"
            },
            {
                name: "指数",
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
        const [baseStr, modStr, expStr] = args;

        // Trim everything so "" and "   " count as empty
        const baseParam = baseStr?.trim();
        const expParam  = expStr?.trim();
        const modParam  = modStr?.trim();
        const inputVal  = input?.trim();

        const mod = modParam;
        if (!mod) {
            throw new OperationError("必须定义模数");
        }

        // Base *or* Exponent (but not both) are taken from the Input
        // if their boxes are empty.
        let base, exp;
        if (baseParam && expParam) {
            // Case 1: base and exponent both given as parameters
            base = baseParam;
            exp  = expParam;
        } else if (!baseParam && expParam) {
            // Case 2: base missing - take from input
            base = inputVal;
            exp  = expParam;
            if (!base) {
                throw new OperationError("必须定义基数");
            }
        } else if (baseParam && !expParam) {
            // Case 3: exponent missing - take from input
            base = baseParam;
            exp  = inputVal;
            if (!exp) {
                throw new OperationError("必须定义指数");
            }
        } else if (!inputVal) {
            // Case 4: base and exponent both missing
            throw new OperationError("必须定义基数和指数");
        } else throw new OperationError("输入有歧义：使用输入时请指定基数或指数");

        // Parse numbers
        const baseBI = parseBigInt(base, "Base");
        const expBI  = parseBigInt(exp, "Exponent");
        const modBI  = parseBigInt(mod, "Modulus");

        // Check for invalid modulus (parseBigInt eliminates negatives)
        if (modBI === 0n) {
            throw new OperationError("模数必须大于零");
        }

        return modPow(baseBI, expBI, modBI).toString();
    }
}

export default ModularExponentiation;
