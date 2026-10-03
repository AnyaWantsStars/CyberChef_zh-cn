/**
 * @author GCHQ Contributor [2]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import {fromHex} from "../lib/Hex.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Hamming Distance operation
 */
class HammingDistance extends Operation {

    /**
     * HammingDistance constructor
     */
    constructor() {
        super();

        this.name = "Hamming 距离";
        this.module = "Default";
        this.description = "计算输入数据与指定数据之间的汉明距离。";
        this.infoURL = "https://wikipedia.org/wiki/Hamming_distance";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "分隔符", "type": "binaryShortString",
                "value": "\\n\\n"
            },
            {
                "name": "单位",
                "type": "option",
                "value": [
                    {name: "字节", value: "Byte"},
                    {name: "位", value: "Bit"}
                ]
            },
            {
                "name": "输入类型", "type": "option",
                "value": [
                    {name: "原始字符串", value: "Raw string"},
                    "Hex"
                ]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const delim = args[0],
            byByte = args[1] === "Byte",
            inputType = args[2],
            samples = input.split(delim);

        if (samples.length !== 2) {
            throw new OperationError("错误：只能计算两个字符串之间的编辑距离。请确保恰好提供两个输入，并用指定的分隔符分隔.");
        }

        if (samples[0].length !== samples[1].length) {
            throw new OperationError("错误：两个输入必须长度相同。");
        }

        if (inputType === "Hex") {
            samples[0] = fromHex(samples[0]);
            samples[1] = fromHex(samples[1]);
        } else {
            samples[0] = new Uint8Array(Utils.strToArrayBuffer(samples[0]));
            samples[1] = new Uint8Array(Utils.strToArrayBuffer(samples[1]));
        }

        let dist = 0;

        for (let i = 0; i < samples[0].length; i++) {
            const lhs = samples[0][i],
                rhs = samples[1][i];

            if (byByte && lhs !== rhs) {
                dist++;
            } else if (!byByte) {
                let xord = lhs ^ rhs;

                while (xord) {
                    dist++;
                    xord &= xord - 1;
                }
            }
        }

        return dist.toString();
    }

}

export default HammingDistance;
