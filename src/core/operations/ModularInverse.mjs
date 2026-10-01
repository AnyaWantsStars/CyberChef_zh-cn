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
 * Modular Inverse operation
 */
class ModularInverse extends Operation {

    /**
     * ModularInverse constructor
     */
    constructor() {
        super();

        this.name = "模逆";
        this.module = "Crypto";
        this.description =
            "计算 <i>a</i> 模 <i>m</i> 的模乘逆元。<br><br>找到 <i>x</i> 使得 a*x = 1 (mod m)。<br><br><b>输入处理：</b>如果 <i>a</i> 或 <i>m</i> 留空，其值将从输入字段中获取。";
        this.infoURL = "https://wikipedia.org/wiki/Modular_multiplicative_inverse";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "值 (a)",
                type: "string",
                value: ""
            },
            {
                name: "模数 (m)",
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
        const [aStr, mStr] = args;

        // Trim everything so "" and "   " count as empty
        const aParam = aStr?.trim();
        const mParam = mStr?.trim();
        const inputVal = input?.trim();

        let a, m;

        if (aParam && mParam) {
            // Case 1: value and modulus both given as parameters
            a = aParam;
            m = mParam;
        } else if (!aParam && mParam) {
            // Case 2: value missing - take from input
            a = inputVal;
            m = mParam;
            if (!a) throw new OperationError("值 (a) 必须已定义");
        } else if (aParam && !mParam) {
            // Case 3: modulus missing - take from input
            a = aParam;
            m = inputVal;
            if (!m) throw new OperationError("模数 (m) 必须已定义");
        } else if (!aParam && !mParam) {
            // Case 4: value and modulus both missing
            throw new OperationError("值 (a) 和模数 (m) 必须已定义");
        }

        const aBI = parseBigInt(a, "Value (a)");
        const mBI = parseBigInt(m, "Modulus (m)");

        if (mBI <= 0n) {
            throw new OperationError("模数必须大于零");
        }

        const aNorm = ((aBI % mBI) + mBI) % mBI;
        const [g, x] = egcd(aNorm, mBI);

        if (g !== 1n && g !== -1n) {
            throw new OperationError("逆元不存在，因为 gcd(a, m) ≠ 1");
        }

        let inv = x;
        if (g === -1n) inv = -inv;

        inv = ((inv % mBI) + mBI) % mBI;


        return inv.toString();
    }
}

export default ModularInverse;
