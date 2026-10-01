/**
 * Emulation of the SIGABA machine.
 *
 * @author hettysymes
 * @copyright hettysymes 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {LETTERS} from "../lib/Enigma.mjs";
import {NUMBERS, CR_ROTORS, I_ROTORS, SigabaMachine, CRRotor, IRotor} from "../lib/SIGABA.mjs";

/**
 * Sigaba operation
 */
class Sigaba extends Operation {

    /**
     * Sigaba constructor
     */
    constructor() {
        super();

        this.name = "SIGABA";
        this.module = "Bletchley";
        this.description = "使用二战 SIGABA 密码机进行加密/解密。<br><br>SIGABA，也称为 ECM Mark II，在二战期间至 20 世纪 50 年代被美国用于消息加密。它于 20 世纪 30 年代由美国陆军和海军开发，至今从未被破解。SIGABA 由 15 个转子组成：5 个密码转子和 10 个转子（5 个控制转子和 5 个索引转子）控制密码转子的步进，SIGABA 的转子步进比同时期的其他转子密码机（如 Enigma）复杂得多。所有示例转子接线均为随机示例集。<br><br>要配置转子接线，对于密码转子和控制转子，输入从 A 到 Z 映射的字母串；对于索引转子，输入从 0 到 9 映射的数字序列。请注意，加密与解密不同，因此请先选择所需的模式。<br><br>注意：虽然已与其他软件模拟器进行了测试，但尚未与硬件进行测试。";
        this.infoURL = "https://wikipedia.org/wiki/SIGABA";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "第1个（左侧）密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第1个密码转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第1个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第2个密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第2个密码转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第2个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第3个（中间）密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第3个密码转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第3个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第4个密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第4个密码转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第4个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第5个（右侧）密码转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第5个密码转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第5个密码转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第1个（左侧）控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第1个控制转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第1个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第2个控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第2个控制转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第2个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第3个（中间）控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第3个控制转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第3个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第4个控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第4个控制转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第4个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第5个（右侧）控制转子",
                type: "editableOption",
                value: CR_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第5个控制转子反转",
                type: "boolean",
                value: false
            },
            {
                name: "第5个控制转子初始值",
                type: "option",
                value: LETTERS
            },
            {
                name: "第1个（左侧）索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第1个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第2个索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第2个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第3个（中间）索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第3个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第4个索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第4个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "第5个（右侧）索引转子",
                type: "editableOption",
                value: I_ROTORS,
                defaultIndex: 0
            },
            {
                name: "第5个索引转子初始值",
                type: "option",
                value: NUMBERS
            },
            {
                name: "SIGABA 模式",
                type: "option",
                value: [{name: "加密", value: "Encrypt"}, {name: "解密", value: "Decrypt"}]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const sigabaSwitch = args[40];
        const cipherRotors = [];
        const controlRotors = [];
        const indexRotors = [];
        for (let i=0; i<5; i++) {
            const rotorWiring = args[i*3];
            cipherRotors.push(new CRRotor(rotorWiring, args[i*3+2], args[i*3+1]));
        }
        for (let i=5; i<10; i++) {
            const rotorWiring = args[i*3];
            controlRotors.push(new CRRotor(rotorWiring, args[i*3+2], args[i*3+1]));
        }
        for (let i=15; i<20; i++) {
            const rotorWiring = args[i*2];
            indexRotors.push(new IRotor(rotorWiring, args[i*2+1]));
        }
        const sigaba = new SigabaMachine(cipherRotors, controlRotors, indexRotors);
        let result;
        if (sigabaSwitch === "Encrypt") {
            result = sigaba.encrypt(input);
        } else if (sigabaSwitch === "Decrypt") {
            result = sigaba.decrypt(input);
        }
        return result;
    }

}
export default Sigaba;
