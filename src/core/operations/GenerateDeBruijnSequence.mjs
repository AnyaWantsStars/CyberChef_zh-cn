/**
 * @author gchq77703 [gchq77703@gchq.gov.uk]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Generate De Bruijn Sequence operation
 */
class GenerateDeBruijnSequence extends Operation {

    /**
     * GenerateDeBruijnSequence constructor
     */
    constructor() {
        super();

        this.name = "生成 De Bruijn 序列";
        this.module = "Default";
        this.description = "根据给定的字母表大小和密钥长度生成滚动密钥组合。";
        this.infoURL = "https://wikipedia.org/wiki/De_Bruijn_sequence";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "字符集大小（k）",
                type: "number",
                value: 2
            },
            {
                name: "密钥长度（n）",
                type: "number",
                value: 3
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [k, n] = args;

        if (k < 2 || k > 9) {
            throw new OperationError("无效的字母表大小，需要在 2 到 9（含）之间。");
        }

        if (!Number.isInteger(k)) {
            throw new OperationError("无效的字母表大小，必须为整数。");
        }

        if (!Number.isInteger(n)) {
            throw new OperationError("无效的密钥长度，必须为整数。");
        }

        if (n < 2) {
            throw new OperationError("无效的密钥长度，必须至少为 2。");
        }

        if (Math.pow(k, n) > 50000) {
            throw new OperationError("排列数过多，请将 k^n 降至 50,000 以下。");
        }

        const a = new Array(k * n).fill(0);
        const sequence = [];

        (function db(t = 1, p = 1) {
            if (t > n) {
                if (n % p !== 0) return;
                for (let j = 1; j <= p; j++) {
                    sequence.push(a[j]);
                }
                return;
            }

            a[t] = a[t - p];
            db(t + 1, p);
            for (let j = a[t - p] + 1; j < k; j++) {
                a[t] = j;
                db(t + 1, t);
            }
        })();

        return sequence.join("");
    }
}

export default GenerateDeBruijnSequence;
