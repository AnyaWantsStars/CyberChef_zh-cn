/**
 * @author mikecat
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        "name": "AES Key Wrap: RFC Test Vector, 128-bit data, 128-bit KEK",
        "input": "00112233445566778899aabbccddeeff",
        "expectedOutput": "1fa68b0a8112b447aef34bd8fb5a7b829d3e862371d2cfe5",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: RFC Test Vector, 128-bit data, 192-bit KEK",
        "input": "00112233445566778899aabbccddeeff",
        "expectedOutput": "96778b25ae6ca435f92b5b97c050aed2468ab8a17ad84e5d",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f1011121314151617"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: RFC Test Vector, 128-bit data, 256-bit KEK",
        "input": "00112233445566778899aabbccddeeff",
        "expectedOutput": "64e8c3f9ce0f5ba263e9777905818a2a93c8191e7d6e8ae7",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: RFC Test Vector, 192-bit data, 192-bit KEK",
        "input": "00112233445566778899aabbccddeeff0001020304050607",
        "expectedOutput": "031d33264e15d33268f24ec260743edce1c6c7ddee725a936ba814915c6762d2",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f1011121314151617"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: RFC Test Vector, 192-bit data, 256-bit KEK",
        "input": "00112233445566778899aabbccddeeff0001020304050607",
        "expectedOutput": "a8f9bc1612c68b3ff6e6f4fbe30e71e4769c8b80a32cb8958cd5d17d6b254da1",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: RFC Test Vector, 256-bit data, 256-bit KEK",
        "input": "00112233445566778899aabbccddeeff000102030405060708090a0b0c0d0e0f",
        "expectedOutput": "28c9f404c4b810f4cbccb35cfb87f8263f5786e2d80ed326cbc7f0e71a99f43bfb988b9b7a02dd21",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: RFC Test Vector, 128-bit data, 128-bit KEK",
        "input": "1fa68b0a8112b447aef34bd8fb5a7b829d3e862371d2cfe5",
        "expectedOutput": "00112233445566778899aabbccddeeff",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: RFC Test Vector, 128-bit data, 192-bit KEK",
        "input": "96778b25ae6ca435f92b5b97c050aed2468ab8a17ad84e5d",
        "expectedOutput": "00112233445566778899aabbccddeeff",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f1011121314151617"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: RFC Test Vector, 128-bit data, 256-bit KEK",
        "input": "64e8c3f9ce0f5ba263e9777905818a2a93c8191e7d6e8ae7",
        "expectedOutput": "00112233445566778899aabbccddeeff",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: RFC Test Vector, 192-bit data, 192-bit KEK",
        "input": "031d33264e15d33268f24ec260743edce1c6c7ddee725a936ba814915c6762d2",
        "expectedOutput": "00112233445566778899aabbccddeeff0001020304050607",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f1011121314151617"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: RFC Test Vector, 192-bit data, 256-bit KEK",
        "input": "a8f9bc1612c68b3ff6e6f4fbe30e71e4769c8b80a32cb8958cd5d17d6b254da1",
        "expectedOutput": "00112233445566778899aabbccddeeff0001020304050607",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: RFC Test Vector, 256-bit data, 256-bit KEK",
        "input": "28c9f404c4b810f4cbccb35cfb87f8263f5786e2d80ed326cbc7f0e71a99f43bfb988b9b7a02dd21",
        "expectedOutput": "00112233445566778899aabbccddeeff000102030405060708090a0b0c0d0e0f",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: invalid KEK length",
        "input": "00112233445566778899aabbccddeeff",
        "expectedOutput": "KEK（密钥加密密钥）必须为 16、24 或 32 字节（当前为 10 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "00010203040506070809"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: invalid IV length",
        "input": "00112233445566778899aabbccddeeff",
        "expectedOutput": "IV（初始化向量）必须为 8 字节（当前为 6 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: input length not multiple of 8",
        "input": "00112233445566778899aabbccddeeff0102",
        "expectedOutput": "输入长度必须为 8n（n≥2）字节（当前为 18 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Wrap: input too short",
        "input": "0011223344556677",
        "expectedOutput": "输入长度必须为 8n（n≥2）字节（当前为 8 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Wrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: invalid KEK length",
        "input": "1fa68b0a8112b447aef34bd8fb5a7b829d3e862371d2cfe5",
        "expectedOutput": "KEK（密钥加密密钥）必须为 16、24 或 32 字节（当前为 10 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "00010203040506070809"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: invalid IV length",
        "input": "1fa68b0a8112b447aef34bd8fb5a7b829d3e862371d2cfe5",
        "expectedOutput": "IV（初始化向量）必须为 8 字节（当前为 6 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: input length not multiple of 8",
        "input": "1fa68b0a8112b447aef34bd8fb5a7b829d3e862371d2cfe5e621",
        "expectedOutput": "输入长度必须为 8n（n≥3）字节（当前为 26 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: input too short",
        "input": "1fa68b0a8112b447aef34bd8fb5a7b82",
        "expectedOutput": "输入长度必须为 8n（n≥3）字节（当前为 16 bytes)",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
    {
        "name": "AES Key Unwrap: corrupted input",
        "input": "1fa68b0a8112b447aef34bd8fb5a7b829d3e862371d2cfe6",
        "expectedOutput": "IV 不匹配",
        "recipeConfig": [
            {
                "op": "AES Key Unwrap",
                "args": [
                    {"option": "Hex", "string": "000102030405060708090a0b0c0d0e0f"},
                    {"option": "Hex", "string": "a6a6a6a6a6a6a6a6"},
                    "Hex", "Hex"
                ],
            },
        ],
    },
]);
