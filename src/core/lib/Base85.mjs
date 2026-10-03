import Utils from "../Utils.mjs";

/**
 * Base85 resources.
 *
 * @author PenguinGeorge [george@penguingeorge.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

/**
 * Base85 alphabet options.
 */
export const ALPHABET_OPTIONS = [
    {
        name: "标准",
        value: "!-u",
    },
    {
        name: "Z85 (ZeroMQ)",
        value: "0-9a-zA-Z.\\-:+=^!/*?&<>()[]{}@%$#",
    },
    {
        name: "IPv6",
        value: "0-9A-Za-z!#$%&()*+\\-;<=>?@^_`{|}~",
    }
];


/**
 * Returns the canonical (English) name of the alphabet, when given the alphabet.
 * Internal logic relies on the English identifiers ("Standard" etc), so the
 * translated UI names must not be used here.
 *
 * @param {string} alphabet
 * @returns {string}
 */
export function alphabetName(alphabet) {
    alphabet = escape(alphabet);
    let name;

    ALPHABET_OPTIONS.forEach(function(a) {
        const expanded = Utils.expandAlphRange(a.value).join("");
        if (alphabet === escape(expanded)) name = a.name;
    });

    if (name === "标准") return "Standard";
    return name;
}
