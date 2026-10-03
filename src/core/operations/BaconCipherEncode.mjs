/**
 * @author Karsten Silkenbäumer [github.com/kassi]
 * @copyright Karsten Silkenbäumer 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {
    BACON_ALPHABETS,
    BACON_TRANSLATIONS_FOR_ENCODING, BACON_TRANSLATION_AB,
    swapZeroAndOne
} from "../lib/Bacon.mjs";

/**
 * Bacon Cipher Encode operation
 */
class BaconCipherEncode extends Operation {
    /**
     * BaconCipherEncode constructor
     */
    constructor() {
        super();

        this.name = "培根密码 编码";
        this.module = "Default";
        this.description = "培根密码是一种由 Francis Bacon 于 1605 年设计的隐写术方法。消息隐藏在文本的呈现方式中，而非其内容中。";
        this.infoURL = "https://wikipedia.org/wiki/Bacon%27s_cipher";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "字符集", "type": "option",
                "value": Object.keys(BACON_ALPHABETS)
            },
            {
                "name": "翻译",
                "type": "option",
                "value": BACON_TRANSLATIONS_FOR_ENCODING
            },
            {
                "name": "保留额外字符",
                "type": "boolean",
                "value": false
            },
            {
                "name": "反向翻译",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const [alphabet, translation, keep, invert] = args;

        const alphabetObject = BACON_ALPHABETS[alphabet];
        const charCodeA = "A".charCodeAt(0);
        const charCodeZ = "Z".charCodeAt(0);

        let output = input.replace(/./g, function (c) {
            const charCode = c.toUpperCase().charCodeAt(0);
            if (charCode >= charCodeA && charCode <= charCodeZ) {
                let code = charCode - charCodeA;
                if (alphabetObject.codes !== undefined) {
                    code = alphabetObject.codes[code];
                }
                const bacon = ("00000" + code.toString(2)).substr(-5, 5);
                return bacon;
            } else {
                return c;
            }
        });

        if (invert) {
            output = swapZeroAndOne(output);
        }
        if (!keep) {
            output = output.replace(/[^01]/g, "");
            const outputArray = output.match(/(.{5})/g) || [];
            output = outputArray.join(" ");
        }
        if (translation === BACON_TRANSLATION_AB) {
            output = output.replace(/[01]/g, function (c) {
                return {
                    "0": "A",
                    "1": "B"
                }[c];
            });
        }

        return output;
    }
}

export default BaconCipherEncode;
