/**
 * Binary Code Decimal resources.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

/**
 * BCD encoding schemes.
 */
export const ENCODING_SCHEME = [
    {"name": "8421 码", "value": "8 4 2 1"},
    {"name": "7421 码", "value": "7 4 2 1"},
    {"name": "4221 码", "value": "4 2 2 1"},
    {"name": "2421 码", "value": "2 4 2 1"},
    {"name": "84-2-1 码", "value": "8 4 -2 -1"},
    {"name": "余3码", "value": "Excess-3"},
    {"name": "IBM 8421 码", "value": "IBM 8 4 2 1"},
];

/**
 * Lookup table for the binary value of each digit representation.
 *
 * I wrote a very nice algorithm to generate 8 4 2 1 encoding programmatically,
 * but unfortunately it's much easier (if less elegant) to use lookup tables
 * when supporting multiple encoding schemes.
 *
 * "Practicality beats purity" - PEP 20
 *
 * In some schemes it is possible to represent the same value in multiple ways.
 * For instance, in 4 2 2 1 encoding, 0100 and 0010 both represent 2. Support
 * has not yet been added for this.
 */
export const ENCODING_LOOKUP = {
    "8 4 2 1":     [0,  1,  2,  3,  4,  5,  6,  7,  8,  9],
    "7 4 2 1":     [0,  1,  2,  3,  4,  5,  6,  8,  9,  10],
    "4 2 2 1":     [0,  1,  4,  5,  8,  9,  12, 13, 14, 15],
    "2 4 2 1":     [0,  1,  2,  3,  4,  11, 12, 13, 14, 15],
    "8 4 -2 -1":   [0,  7,  6,  5,  4,  11, 10, 9,  8,  15],
    "Excess-3":    [3,  4,  5,  6,  7,  8,  9,  10, 11, 12],
    "IBM 8 4 2 1": [10, 1,  2,  3,  4,  5,  6,  7,  8,  9],
};

/**
 * BCD formats.
 */
export const FORMAT = [{name: "半字节", value: "Nibbles"}, {name: "字节", value: "Bytes"}, {name: "原始", value: "Raw"}];
