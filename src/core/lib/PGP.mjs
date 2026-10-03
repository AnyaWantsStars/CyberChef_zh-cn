/**
 * PGP functions.
 *
 * @author tlwr [toby@toby.codes]
 * @author Matt C [matt@artemisbot.uk]
 * @author n1474335 [n1474335@gmail.com]
 *
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 *
 */

import OperationError from "../errors/OperationError.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import kbpgp from "kbpgp";
import * as es6promisify from "es6-promisify";
const promisify = es6promisify.default ? es6promisify.default.promisify : es6promisify.promisify;

/**
 * Progress callback
 */
export const ASP = kbpgp.ASP({
    "progress_hook": info => {
        let msg = "";

        switch (info.what) {
            case "guess":
                msg = "正在猜测素数";
                break;
            case "fermat":
                msg = "使用费马分解法分解素数";
                break;
            case "mr":
                msg = "正在执行 Miller-Rabin 素性测试";
                break;
            case "passed_mr":
                msg = "通过 Miller-Rabin 素性测试";
                break;
            case "failed_mr":
                msg = "未通过 Miller-Rabin 素性测试";
                break;
            case "found":
                msg = "找到素数";
                break;
            default:
                msg = `阶段：${info.what}`;
        }

        if (isWorkerEnvironment())
            self.sendStatusMessage(msg);
    }
});

/**
 * Get size of subkey
 *
 * @param {number} keySize
 * @returns {number}
 */
export function getSubkeySize(keySize) {
    return {
        1024: 1024,
        2048: 1024,
        4096: 2048,
        256:   256,
        384:   256,
    }[keySize];
}

/**
* Import private key and unlock if necessary
*
* @param {string} privateKey
* @param {string} [passphrase]
* @returns {Object}
*/
export async function importPrivateKey(privateKey, passphrase) {
    try {
        const key = await promisify(kbpgp.KeyManager.import_from_armored_pgp)({
            armored: privateKey,
            opts: {
                "no_check_keys": true
            }
        });
        if (key.is_pgp_locked()) {
            if (passphrase) {
                await promisify(key.unlock_pgp.bind(key))({
                    passphrase
                });
            } else {
                throw new OperationError("未为锁定的私钥提供密码短语。");
            }
        }
        return key;
    } catch (err) {
        throw new OperationError(`无法导入私钥：${err}`);
    }
}

/**
 * Import public key
 *
 * @param {string} publicKey
 * @returns {Object}
 */
export async function importPublicKey (publicKey) {
    try {
        const key = await promisify(kbpgp.KeyManager.import_from_armored_pgp)({
            armored: publicKey,
            opts: {
                "no_check_keys": true
            }
        });
        return key;
    } catch (err) {
        throw new OperationError(`无法导入公钥：${err}`);
    }
}
