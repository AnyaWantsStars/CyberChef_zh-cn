/**
 * Emulation of the Typex machine.
 *
 * Tested against a genuine Typex machine using a variety of inputs
 * and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {LETTERS, Reflector} from "../lib/Enigma.mjs";
import {ROTORS, REFLECTORS, TypexMachine, Plugboard, Rotor} from "../lib/Typex.mjs";

/**
 * Typex operation
 */
class Typex extends Operation {
    /**
     * Typex constructor
     */
    constructor() {
        super();

        this.name = "Typex";
        this.module = "Bletchley";
        this.description = "使用二战 Typex 密码机进行加密/解密。<br><br>Typex 最初由英国皇家空军在二战前制造，基于 Enigma 密码机并进行了改进，包括使用五个具有更多步进点和可互换接线核心的转子。它在英国和英联邦军队中广泛使用。后续产生了多个变体；此处我们模拟二战时期的 Mark 22 Typex，带有反射器和输入的插接板。Typex 转子定期更换，且没有公开的型号：这里提供了一组随机示例。<br><br>要配置反射器插接板，请在反射器框中输入成对连接的字母字符串，例如 <code>AB CD EF</code> 将 A 连接到 B，C 连接到 D，E 连接到 F（您需要连接每一个字母）。还有一个输入插接板：与 Enigma 的插接板不同，它不限于成对连接，因此像转子一样输入（无步进）。要创建自己的转子，请按顺序输入转子从 A 到 Z 映射的字母，可选地后跟 <code>&lt;</code> 和步进点列表。<br><br>关于 Enigma、Typex 和 Bombe 操作的更详细说明<a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>可在此处找到</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Typex";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "第1个（左侧）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "第1个转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第1个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第1个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第2个转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "第2个转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第2个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第2个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第3个（中间）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 2
            },
            {
                name: "第3个转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第3个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第3个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第4个（静态）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 3
            },
            {
                name: "第4个转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第4个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第4个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第5个（右侧，静态）转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 4
            },
            {
                name: "第5个转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第5个转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "第5个转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "反射器",
                type: "editableOption",
                value: REFLECTORS
            },
            {
                name: "插线板",
                type: "string",
                value: ""
            },
            {
                name: "Typex键盘模拟",
                type: "option",
                value: [{name: "无", value: "None"}, {name: "加密", value: "Encrypt"}, {name: "解密", value: "Decrypt"}]
            },
            {
                name: "严格输出",
                hint: "Remove non-alphabet letters and group output",
                type: "boolean",
                value: true
            },
        ];
    }

    /**
     * Helper - for ease of use rotors are specified as a single string; this
     * method breaks the spec string into wiring and steps parts.
     *
     * @param {string} rotor - Rotor specification string.
     * @param {number} i - For error messages, the number of this rotor.
     * @returns {string[]}
     */
    parseRotorStr(rotor, i) {
        if (rotor === "") {
            throw new OperationError(`必须提供转子 ${i}。`);
        }
        if (!rotor.includes("<")) {
            return [rotor, ""];
        }
        return rotor.split("<", 2);
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const reflectorstr = args[20];
        const plugboardstr = args[21];
        const typexKeyboard = args[22];
        const removeOther = args[23];
        const rotors = [];
        for (let i=0; i<5; i++) {
            const [rotorwiring, rotorsteps] = this.parseRotorStr(args[i*4]);
            rotors.push(new Rotor(rotorwiring, rotorsteps, args[i*4 + 1], args[i*4+2], args[i*4+3]));
        }
        // Rotors are handled in reverse
        rotors.reverse();
        const reflector = new Reflector(reflectorstr);
        let plugboardstrMod = plugboardstr;
        if (plugboardstrMod === "") {
            plugboardstrMod = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        const plugboard = new Plugboard(plugboardstrMod);
        if (removeOther) {
            if (typexKeyboard === "Encrypt") {
                input = input.replace(/[^A-Za-z0-9 /%£()',.-]/g, "");
            } else {
                input = input.replace(/[^A-Za-z]/g, "");
            }
        }
        const typex = new TypexMachine(rotors, reflector, plugboard, typexKeyboard);
        let result = typex.crypt(input);
        if (removeOther && typexKeyboard !== "Decrypt") {
            // Five character cipher groups is traditional
            result = result.replace(/([A-Z]{5})(?!$)/g, "$1 ");
        }
        return result;
    }

    /**
     * Highlight Typex
     * This is only possible if we're passing through non-alphabet characters.
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

    /**
     * Highlight Typex in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[18] === false) {
            return pos;
        }
    }

}

export default Typex;
