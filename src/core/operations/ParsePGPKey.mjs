/**
 * @author GCHQDeveloper581
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import * as openpgp from "openpgp";

/**
 * Convert a numeric public-key algorithm ID to its algorithm name.
 *
 * @param {number} id
 * @returns {string}
 */
function getAlgorithmName(id) {
    const algorithms = {
        1: "RSA（加密或签名）",
        2: "RSA 仅加密",
        3: "RSA 仅签名",
        16: "ElGamal 仅加密",
        17: "DSA",
        18: "ECDH",
        19: "ECDSA",
        22: "EdDSA",
        25: "X25519",
        27: "Ed25519"
    };

    return algorithms[id] || `未知（${id}）`;
}

/**
 * Extract the curve name from a PGP keyPacket.
 *
 * @param {Object} keyPacket
 * @returns {string|null}
 */
function getCurveName(keyPacket) {
    // Preferred, reliable path: read the OID name directly.
    if (keyPacket.publicParams?.oid?.getName) {
        return keyPacket.publicParams.oid.getName();
    }

    // Fallback for algorithms that imply a fixed curve.
    switch (keyPacket.algorithm) {
        case 25:
            return "Curve25519（X25519）";
        case 27:
            return "Ed25519";
        default:
            return null;
    }
}

/**
 * Compute the true bit length of an MPI (multi-precision integer) from its
 * big-endian byte representation, ignoring leading zero bytes.
 *
 * @param {Uint8Array} bytes
 * @returns {number}
 */
function mpiBitLength(bytes) {
    let i = 0;

    // Skip leading zero bytes.
    while (i < bytes.length && bytes[i] === 0) {
        i++;
    }

    if (i === bytes.length) {
        return 0;
    }

    // Bits contributed by the most significant non-zero byte, plus the
    // remaining full bytes.
    const msb = bytes[i];
    let topBits = 0;
    for (let b = msb; b > 0; b >>= 1) {
        topBits++;
    }

    return topBits + (bytes.length - i - 1) * 8;
}

/**
 * Parse PGP Key operation
 */
class ParsePGPKey extends Operation {

    /**
     * ParsePGPKey constructor
     */
    constructor() {
        super();

        this.name = "解析 PGP 密钥";
        this.module = "PGP";
        this.description = "解析 PGP 密钥（v4 或 v6）的内容";
        this.infoURL = "https://wikipedia.org/wiki/Pretty_Good_Privacy";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        if (!input.length) {
            throw new OperationError("未提供密钥");
        }

        let key;
        try {
            key = await openpgp.readKey({armoredKey: input});
        } catch (err) {
            // Surface only the message, never the raw error object/stack, to
            // avoid disclosing internal paths or echoing untrusted input.
            throw new OperationError("无法解析密钥：" + (err && err.message ? err.message : "无效的密钥数据"));
        }

        const keyPacket = key.keyPacket;
        let output = "";

        output += "公钥信息\n";
        output += "======================\n";
        output += `版本           : ${keyPacket.version}\n`;
        output += `创建日期       : ${key.getCreationTime().toISOString()}\n`;
        output += `密钥 ID        : ${key.getKeyID().toHex().toUpperCase()}\n`;
        output += `指纹           : ${key.getFingerprint().toUpperCase()}\n`;
        output += `算法           : ${getAlgorithmName(keyPacket.algorithm)}\n`;

        // RSA: report the true modulus bit length rather than byte-length * 8,
        // which can be off-by-a-few due to leading zero bytes.
        if (keyPacket.publicParams?.n) {
            const keySize = mpiBitLength(keyPacket.publicParams.n);
            output += `密钥大小       : ${keySize} 位\n`;
        }

        // EC: report the curve where applicable.
        const curve = getCurveName(keyPacket);
        if (curve) {
            output += `曲线           : ${curve}\n`;
        }

        return output;
    }
}

export default ParsePGPKey;
