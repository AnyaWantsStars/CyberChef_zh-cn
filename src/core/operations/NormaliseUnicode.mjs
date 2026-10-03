/**
 * @author Matthieu [m@tthieu.xyz]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {UNICODE_NORMALISATION_FORMS} from "../lib/ChrEnc.mjs";
import unorm from "unorm";

/**
 * Normalise Unicode operation
 */
class NormaliseUnicode extends Operation {

    /**
     * NormaliseUnicode constructor
     */
    constructor() {
        super();

        this.name = "规范化 Unicode";
        this.module = "Encodings";
        this.description = "将 Unicode 字符转换为一种规范化形式";
        this.infoURL = "https://wikipedia.org/wiki/Unicode_equivalence#Normal_forms";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "规范形式",
                type: "option",
                value: UNICODE_NORMALISATION_FORMS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [normalForm] = args;

        switch (normalForm) {
            case "NFD":
                return unorm.nfd(input);
            case "NFC":
                return unorm.nfc(input);
            case "NFKD":
                return unorm.nfkd(input);
            case "NFKC":
                return unorm.nfkc(input);
            default:
                throw new OperationError("未知的规范化形式");
        }
    }

}

export default NormaliseUnicode;
