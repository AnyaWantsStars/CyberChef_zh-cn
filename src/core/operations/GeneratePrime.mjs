/**
 * @author p-leriche [philip.leriche@cantab.net]
 * @copyright Crown Copyright 2025
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { modPow } from "../lib/BigIntUtils.mjs";

/* ---------- helper functions ---------- */

/**
 * Generate random BigInt with specified bit length
 */
function randBigInt(bits) {
    const bytes = Math.ceil(bits / 8);
    const a = new Uint8Array(bytes);
    crypto.getRandomValues(a);

    // Set high bit to ensure correct bit length
    a[0] |= 1 << (7 - ((8 * bytes - bits)));
    // Set low bit to ensure odd (primes > 2 are odd)
    a[bytes - 1] |= 1;

    let h = "";
    for (const b of a) h += b.toString(16).padStart(2, "0");
    return BigInt("0x" + h);
}

/**
 * Miller-Rabin primality test
 */
function isProbablePrime(n, rounds) {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    // Write n-1 as 2^r * d
    let d = n - 1n;
    let r = 0n;
    while (d % 2n === 0n) {
        d /= 2n;
        r++;
    }

    // Witness loop
    for (let i = 0; i < rounds; i++) {
        const a = randBigInt(n.toString(2).length - 1) % (n - 3n) + 2n;
        let x = modPow(a, d, n);

        if (x === 1n || x === n - 1n) continue;

        let composite = true;
        for (let j = 0n; j < r - 1n; j++) {
            x = modPow(x, 2n, n);
            if (x === n - 1n) {
                composite = false;
                break;
            }
        }

        if (composite) return false;
    }

    return true;
}

/* ---------- operation class ---------- */

/**
 * Generate Prime Number operation
 */
class GeneratePrime extends Operation {
    /**
     * GeneratePrime constructor
     */
    constructor() {
        super();

        this.name = "伪随机素数生成器";
        this.module = "Crypto";
        this.description =
            "使用 Miller-Rabin 素性测试生成指定位长的随机可能素数。<br><br><b>素性保证：</b><br>对于 ≤ 3,317 的数字，结果保证为素数（确定性测试）。<br>对于更大的数字，使用概率测试：<br>- <b>标准（7 轮）：</b>合数概率约 1/16,000<br><br>- <b>加密等级（40 轮）：</b>合数概率约 1/10^24<br>加密等级推荐用于密码学应用（RSA、Diffie-Hellman 等）。<br><br>";
        this.infoURL = "https://wikipedia.org/wiki/Miller-Rabin_primality_test";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "位长度",
                type: "number",
                value: 512,
                min: 2
            },
            {
                name: "加密等级",
                type: "boolean",
                value: false
            },
            {
                name: "输出格式",
                type: "option",
                value: [{name: "十进制", value: "Decimal"}, {name: "十六进制", value: "Hexadecimal"}]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [bits, cryptoGrade, outputFormat] = args;

        if (bits < 2) {
            throw new OperationError("位长度必须至少为 2");
        }

        if (bits > 4096) {
            throw new OperationError("出于性能考虑，位长度限制为 4096 位");
        }

        const rounds = cryptoGrade ? 40 : 7;
        let attempts = 0;
        const maxAttempts = 10000;

        let n = randBigInt(bits);

        while (!isProbablePrime(n, rounds)) {
            n = randBigInt(bits);
            attempts++;

            if (attempts > maxAttempts) {
                throw new OperationError(`经过 ${maxAttempts} 次尝试后仍无法生成素数。请尝试不同的位长度。`);
            }
        }

        // Return only the prime for pipeability
        if (outputFormat === "Hexadecimal") {
            return "0x" + n.toString(16);
        } else {
            return n.toString();
        }
    }
}

export default GeneratePrime;
