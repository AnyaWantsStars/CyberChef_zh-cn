/**
 * Base45 tests.
 *
 * @author Thomas Weißschuh [thomas@t-8ch.de]
 *
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import TestRegister from "../../lib/TestRegister.mjs";

const defaultB45Alph = "0-9A-Z $%*+\\-./:";

TestRegister.addTests([
    {
        name: "To Base45: nothing",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "To Base45",
                args: [defaultB45Alph],
            },
        ],
    },
    {
        name: "To Base45: Spec encoding example 1",
        input: "AB",
        expectedOutput: "BB8",
        recipeConfig: [
            {
                op: "To Base45",
                args: [defaultB45Alph],
            },
        ],
    },
    {
        name: "To Base45: Spec encoding example 2",
        input: "Hello!!",
        expectedOutput: "%69 VD92EX0",
        recipeConfig: [
            {
                op: "To Base45",
                args: [defaultB45Alph],
            },
        ],
    },
    {
        name: "To Base45: Spec encoding example 3",
        input: "base-45",
        expectedOutput: "UJCLQE7W581",
        recipeConfig: [
            {
                op: "To Base45",
                args: [defaultB45Alph],
            },
        ],
    },
    {
        name: "From Base45: nothing",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                op: "From Base45",
                args: [defaultB45Alph],
            },
        ],
    },
    {
        name: "From Base45: Spec decoding example 1",
        input: "QED8WEX0",
        expectedOutput: "ietf!",
        recipeConfig: [
            {
                op: "From Base45",
                args: [defaultB45Alph],
            },
        ],
    },
    {
        name: "From Base45: Invalid character",
        input: "!",
        expectedOutput: "字符不在字母表中：'!'",
        recipeConfig: [
            {
                op: "From Base45",
                args: [defaultB45Alph],
            },
        ],
    },
    {
        name: "From Base45: Invalid triplet value",
        input: "ZZZ",
        expectedOutput: "三元组过大：'ZZZ'",
        recipeConfig: [
            {
                op: "From Base45",
                args: [defaultB45Alph],
            },
        ],
    },
]);
