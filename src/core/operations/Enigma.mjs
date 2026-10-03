/**
 * Emulation of the Enigma machine.
 *
 * Tested against various genuine Enigma machines using a variety of inputs
 * and settings to confirm correctness.
 *
 * @author s2224834
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import {ROTORS, LETTERS, ROTORS_FOURTH, REFLECTORS, Rotor, Reflector, Plugboard, EnigmaMachine} from "../lib/Enigma.mjs";

/**
 * Enigma operation
 */
class Enigma extends Operation {
    /**
     * Enigma constructor
     */
    constructor() {
        super();

        this.name = "Enigma";
        this.module = "Bletchley";
        this.description = "使用二战时期的 Enigma 密码机进行加密/解密。<br><br>Enigma 在二战时期被德国军方等广泛使用，作为一种便携式密码机，用于保护敏感的军事、外交和商业通信。<br><br>提供了标准的德国军用转子和反射器。要配置插线板，请输入连接的字母对字符串，例如 <code>AB CD EF</code> 将 A 连接到 B、C 连接到 D、E 连接到 F。这也可用于创建自定义反射器。要创建自定义转子，请按顺序输入转子将 A 映射到 Z 的字母，可选地后跟 <code>&lt;</code> 然后是步进点列表。<br>与真实的 Enigma 相比，此操作在转子位置等方面故意保持相对宽松（例如，真实的四转子 Enigma 仅使用薄反射器，并在第 4 个插槽中使用 beta 或 gamma 转子）。<br><br>有关 Enigma、Typex 和 Bombe 操作的更详细说明<a href='https://github.com/gchq/CyberChef/wiki/Enigma,-the-Bombe,-and-Typex'>可在此处找到</a>。";
        this.infoURL = "https://wikipedia.org/wiki/Enigma_machine";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "模型",
                type: "argSelector",
                value: [
                    {
                        name: "3 转子",
                        value: "3-rotor",
                        off: [1, 2, 3]
                    },
                    {
                        name: "4 转子",
                        value: "4-rotor",
                        on: [1, 2, 3]
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
                name: "最左侧转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "最左侧转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "左侧转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 0
            },
            {
                name: "左侧转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "左侧转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "中间转子",
                type: "editableOption",
                value: ROTORS,
                defaultIndex: 1
            },
            {
                name: "中间转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "中间转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "右侧转子",
                type: "editableOption",
                value: ROTORS,
                // Default config is the rotors I-III *left to right*
                defaultIndex: 2
            },
            {
                name: "右侧转子环设置",
                type: "option",
                value: LETTERS
            },
            {
                name: "右侧转子初始值",
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
                name: "严格输出",
                hint: "去除非字母字符并按组输出",
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
        const model = args[0];
        const reflectorstr = args[13];
        const plugboardstr = args[14];
        const removeOther = args[15];
        const rotors = [];
        for (let i=0; i<4; i++) {
            if (i === 0 && model === "3-rotor") {
                // Skip the 4th rotor settings
                continue;
            }
            const [rotorwiring, rotorsteps] = this.parseRotorStr(args[i*3 + 1], 1);
            rotors.push(new Rotor(rotorwiring, rotorsteps, args[i*3 + 2], args[i*3 + 3]));
        }
        // Rotors are handled in reverse
        rotors.reverse();
        const reflector = new Reflector(reflectorstr);
        const plugboard = new Plugboard(plugboardstr);
        if (removeOther) {
            input = input.replace(/[^A-Za-z]/g, "");
        }
        const enigma = new EnigmaMachine(rotors, reflector, plugboard);
        let result = enigma.crypt(input);
        if (removeOther) {
            // Five character cipher groups is traditional
            result = result.replace(/([A-Z]{5})(?!$)/g, "$1 ");
        }
        return result;
    }

    /**
     * Highlight Enigma
     * This is only possible if we're passing through non-alphabet characters.
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        if (args[13] === false) {
            return pos;
        }
    }

    /**
     * Highlight Enigma in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        if (args[13] === false) {
            return pos;
        }
    }

}

export default Enigma;
