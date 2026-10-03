/**
 * Emulation of the Bombe machine.
 *
 * Tested against the Bombe Rebuild at Bletchley Park's TNMOC
 * using a variety of inputs and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isWorkerEnvironment } from "../Utils.mjs";
import { BombeMachine } from "../lib/Bombe.mjs";
import { ROTORS, ROTORS_FOURTH, REFLECTORS, Reflector } from "../lib/Enigma.mjs";

/**
 * Bombe operation
 */
class Bombe extends Operation {
    /**
     * Bombe constructor
     */
    constructor() {
        super();

        this.name = "Bombe";
        this.module = "Bletchley";
        this.description = "模拟布莱切利园用于破解 Enigma 的 Bombe 机，基于波兰和英国密码分析学家的工作。<br><br>运行此操作需要一个 crib（目标密文某段的已知明文），并知道所使用的转子。（如果不知道转子，请参阅「多重 Bombe」操作。）机器将建议 Enigma 的可能配置。每个建议包含转子起始位置（从左到右）和已知的插线板对。<br><br>选择 crib：首先，注意 Enigma 不能将字母加密为自身，这允许你排除某些位置的 crib。其次，Bombe 不模拟 Enigma 中间转子的步进。crib 越长，其中发生步进的可能性越大，这将阻止攻击生效。但除此之外，更长的 crib 通常更好。攻击生成一个将密文字母映射到明文的菜单，目标是产生循环：例如，密文 ABC 和 crib CAB，我们有映射 A↔C、B↔A 和 C↔B，产生循环 A-B-C-A。循环越多，crib 越好。操作将输出此信息：如果菜单循环太少或太短，通常会生成大量错误输出。尝试不同的 crib。如果菜单看起来不错但未产生正确答案，crib 可能错误，或可能已跨越中间转子步进——尝试不同的 crib。<br><br>输出不足以完全解密数据。你需要通过检查恢复其余的插线板设置。环位未考虑：这会影响中间转子步进的时机。如果输出在一段时间内正确然后出错，同时调整右侧转子的环位和起始位置，直到输出改善。如有必要，对中间转子重复此操作。<br><br>默认情况下，此操作对每个停止点运行检查机（验证 Bombe 停止点质量的手动过程），丢弃未通过检查的停止点。如果想查看给定输入下硬件实际停止的次数，请禁用检查机。";
        this.infoURL = "https://wikipedia.org/wiki/Bombe";
        this.inputType = "string";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                name: "模型",
                type: "argSelector",
                value: [
                    {
                        name: "3 转子",
                        value: "3-rotor",
                        off: [1]
                    },
                    {
                        name: "4 转子",
                        value: "4-rotor",
                        on: [1]
                    }
                ]
            },
            {
                name: "最左侧转子",
                type: "editableOption",
                value: ROTORS_FOURTH,
                defaultIndex: 0
            },
            {
                name: "左侧转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "中间转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "右侧转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "反射器",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "已知明文",
                type: "string",
                value: ""
            },
            {
                name: "已知明文偏移",
                type: "number",
                value: 0
            },
            {
                name: "使用校验机",
                type: "boolean",
                value: true
            }
        ];
    }

    /**
     * Format and send a status update message.
     * @param {number} nLoops - Number of loops in the menu
     * @param {number} nStops - How many stops so far
     * @param {number} progress - Progress (as a float in the range 0..1)
     */
    updateStatus(nLoops, nStops, progress) {
        const msg = `Bombe 运行 ${nLoops} 圈菜单（建议 2 圈以上）：${nStops} 停位，已完成 ${Math.floor(100 * progress)}%`;
        self.sendStatusMessage(msg);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const model = args[0];
        const reflectorstr = args[5];
        let crib = args[6];
        const offset = args[7];
        const check = args[8];
        const rotors = [];
        for (let i=0; i<4; i++) {
            if (i === 0 && model === "3-rotor") {
                // No fourth rotor
                continue;
            }
            let rstr = args[i + 1];
            // The Bombe doesn't take stepping into account so we'll just ignore it here
            if (rstr.includes("<")) {
                rstr = rstr.split("<", 2)[0];
            }
            rotors.push(rstr);
        }
        // Rotors are handled in reverse
        rotors.reverse();
        if (crib.length === 0) {
            throw new OperationError("Crib（已知明文字符串）不能为空");
        }
        if (offset < 0) {
            throw new OperationError("偏移量不能为负数");
        }
        // For symmetry with the Enigma op, for the input we'll just remove all invalid characters
        input = input.replace(/[^A-Za-z]/g, "").toUpperCase();
        crib = crib.replace(/[^A-Za-z]/g, "").toUpperCase();
        const ciphertext = input.slice(offset);
        const reflector = new Reflector(reflectorstr);
        let update;
        if (isWorkerEnvironment()) {
            update = this.updateStatus;
        } else {
            update = undefined;
        }
        const bombe = new BombeMachine(rotors, reflector, ciphertext, crib, check, update);
        const result = bombe.run();
        return {
            nLoops: bombe.nLoops,
            result: result
        };
    }


    /**
     * Displays the Bombe results in an HTML table
     *
     * @param {Object} output
     * @param {number} output.nLoops
     * @param {Array[]} output.result
     * @returns {html}
     */
    present(output) {
        let html = `Bombe run on menu with ${output.nLoops} loop${output.nLoops === 1 ? "" : "s"} (2+ desirable). Note: Rotor positions are listed left to right and start at the beginning of the crib, and ignore stepping and the ring setting. Some plugboard settings are determined. A decryption preview starting at the beginning of the crib and ignoring stepping is also provided.\n\n`;
        html += "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>转轮停止位置</th>  <th>部分插线板</th>  <th>解密预览</th></tr>\n";
        for (const [setting, stecker, decrypt] of output.result) {
            html += `<tr><td>${setting}</td>  <td>${stecker}</td>  <td>${decrypt}</td></tr>\n`;
        }
        html += "</table>";
        return html;
    }
}

export default Bombe;
