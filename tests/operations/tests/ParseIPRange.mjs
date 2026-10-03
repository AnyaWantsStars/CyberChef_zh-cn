/**
 * Parse IP Range tests.
 *
 * @author Klaxon [klaxon@veyr.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Parse IPv4 CIDR",
        input: "10.0.0.0/30",
        expectedOutput: "网络：10.0.0.0\nCIDR：30\n掩码：255.255.255.252\n范围：10.0.0.0 - 10.0.0.3\n范围内地址总数：4\n\n10.0.0.0\n10.0.0.1\n10.0.0.2\n10.0.0.3",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv4 CIDR with host bits set",
        input: "10.0.0.1/30",
        expectedOutput: "网络：10.0.0.0\nCIDR：30\n掩码：255.255.255.252\n范围：10.0.0.0 - 10.0.0.3\n范围内地址总数：4\n\n10.0.0.0\n10.0.0.1\n10.0.0.2\n10.0.0.3",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv6 CIDR with host bits set",
        input: "2404:6800:4001:0001:0000:0000:0000:0000/48",
        expectedOutput: "网络：2404:6800:4001:0000:0000:0000:0000:0000\n缩写：2404:6800:4001::\nCIDR：48\n掩码：ffff:ffff:ffff:0000:0000:0000:0000:0000\n范围：2404:6800:4001:0000:0000:0000:0000:0000 - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n范围内地址总数：1.2089258196146292e+24\n\n",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv4 hyphenated",
        input: "10.0.0.0 - 10.0.0.3",
        expectedOutput: "容纳此范围所需的最小子网：\n\t网络：10.0.0.0\n\tCIDR：30\n\t掩码：255.255.255.252\n\t子网范围：10.0.0.0 - 10.0.0.3\n\t子网内地址总数：4\n\n范围：10.0.0.0 - 10.0.0.3\n范围内地址总数：4\n\n10.0.0.0\n10.0.0.1\n10.0.0.2\n10.0.0.3",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv4 list",
        input: "10.0.0.8\n10.0.0.5/30\n10.0.0.1\n10.0.0.3",
        expectedOutput: "容纳此范围所需的最小子网：\n\t网络：10.0.0.0\n\tCIDR：28\n\t掩码：255.255.255.240\n\t子网范围：10.0.0.0 - 10.0.0.15\n\t子网内地址总数：16\n\n范围：10.0.0.1 - 10.0.0.8\n范围内地址总数：8\n\n10.0.0.1\n10.0.0.2\n10.0.0.3\n10.0.0.4\n10.0.0.5\n10.0.0.6\n10.0.0.7\n10.0.0.8",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv6 CIDR - full",
        input: "2404:6800:4001:0000:0000:0000:0000:0000/48",
        expectedOutput: "网络：2404:6800:4001:0000:0000:0000:0000:0000\n缩写：2404:6800:4001::\nCIDR：48\n掩码：ffff:ffff:ffff:0000:0000:0000:0000:0000\n范围：2404:6800:4001:0000:0000:0000:0000:0000 - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n范围内地址总数：1.2089258196146292e+24\n\n",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv6 CIDR - collapsed",
        input: "2404:6800:4001::/48",
        expectedOutput: "网络：2404:6800:4001:0000:0000:0000:0000:0000\n缩写：2404:6800:4001::\nCIDR：48\n掩码：ffff:ffff:ffff:0000:0000:0000:0000:0000\n范围：2404:6800:4001:0000:0000:0000:0000:0000 - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n范围内地址总数：1.2089258196146292e+24\n\n",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv6 hyphenated",
        input: "2404:6800:4001:: - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff",
        expectedOutput: "范围：2404:6800:4001:0000:0000:0000:0000:0000 - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n缩写范围：2404:6800:4001:: - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n范围内地址总数：1.2089258196146292e+24\n\n",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "Parse IPv6 list",
        input: "2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n2404:6800:4001::ffff\n2404:6800:4001:ffff:ffff::1111\n2404:6800:4001::/64",
        expectedOutput: "范围：2404:6800:4001:0000:0000:0000:0000:0000 - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n缩写范围：2404:6800:4001:: - 2404:6800:4001:ffff:ffff:ffff:ffff:ffff\n范围内地址总数：1.2089258196146292e+24\n\n",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "IPv4 subnet out of range error",
        input: "10.1.1.1/34",
        expectedOutput: "IPv4 CIDR 必须小于 32",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "invalid IPv4 address error",
        input: "444.1.1.1/30",
        expectedOutput: "块超出范围。",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "IPv6 subnet out of range error",
        input: "2404:6800:4001::/129",
        expectedOutput: "IPv6 CIDR 必须小于 128",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
    {
        name: "invalid IPv6 address error",
        input: "2404:6800:4001:/12",
        expectedOutput: "无效的输入。\n\n请输入 CIDR 范围（例如 10.0.0.0/24）或连字符范围（例如 10.0.0.0 - 10.0.1.0）。同时支持 IPv6。",
        recipeConfig: [
            {
                "op": "Parse IP range",
                "args": [true, true, false]
            },
        ],
    },
]);
