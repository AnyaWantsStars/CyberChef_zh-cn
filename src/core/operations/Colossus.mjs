/**
 * Emulation of Colossus.
 *
 * Tested against the Colossus Rebuild at Bletchley Park's TNMOC
 * using a variety of inputs and settings to confirm correctness.
 *
 * @author VirtualColossus [martin@virtualcolossus.co.uk]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { ColossusComputer } from "../lib/Colossus.mjs";
import { SWITCHES, VALID_ITA2 } from "../lib/Lorenz.mjs";

/**
 * Colossus operation
 */
class Colossus extends Operation {

    /**
     * Colossus constructor
     */
    constructor() {
        super();
        this.name = "Colossus";
        this.module = "Bletchley";
        this.description = "Colossus 是世界上第一台电子计算机。十台 Colossus 由 Tommy Flowers 设计，于 1943 年二战期间在 Dollis Hill 的邮政研究所建造。它们协助破解德国 Lorenz 密码附件，这是一种用于加密希特勒与其前线将军之间通信的机器。<br><br>要了解更多，Virtual Colossus 是一个基于浏览器的在线 Colossus 计算机模拟，可在 <a href='https://virtualcolossus.co.uk' target='_blank'>virtualcolossus.co.uk</a> 访问。<br><br>此操作更详细的描述可在<a href='https://github.com/gchq/CyberChef/wiki/Colossus' target='_blank'>此处</a>找到。";
        this.infoURL = "https://wikipedia.org/wiki/Colossus_computer";
        this.inputType = "string";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [
            {
                name: "输入",
                type: "label"
            },
            {
                name: "模式",
                type: "option",
                value: [{name: "KH模式", value: "KH Pattern"}, {name: "ZMUG模式", value: "ZMUG Pattern"}, {name: "BREAM模式", value: "BREAM Pattern"}]
            },
            {
                name: "Q总线Z",
                type: "option",
                value: ["", "Z", "ΔZ"]
            },
            {
                name: "QBusΧ",
                type: "option",
                value: ["", "Χ", "ΔΧ"]
            },
            {
                name: "QBusΨ",
                type: "option",
                value: ["", "Ψ", "ΔΨ"]
            },
            {
                name: "限制",
                type: "option",
                value: ["无", "Χ2", "Χ2 + P5", "X2 + Ψ1", "X2 + Ψ1 + P5"]
            },
            {
                name: "K架选项",
                type: "argSelector",
                value: [
                    {
                        name: "选择程序",
                        value: "Select Program",
                        on: [7],
                        off: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
                    },
                    {
                        name: "顶部区域 - 条件",
                        on: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
                        off: [7, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
                    },
                    {
                        name: "底部区域 - 加法",
                        on: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
                        off: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    },
                    {
                        name: "高级",
                        on: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
                        off: [7]
                    }
                ]
            },
            {
                name: "运行程序",
                type: "option",
                value: ["", {name: "字母计数", value: "Letter Count"}, {"name": "1+2=. (1+2 切入，求 X1、X2)", "value": "1+2=. (1+2 Break In, Find X1,X2)"}, {"name": "4=5=/1=2 (已知 X1、X2 求 X4、X5)", "value": "4=5=/1=2 (Given X1,X2 find X4,X5)"}, {"name": "/,5,U (计数字符求 X3)", "value": "/,5,U (Count chars to find X3)"}]
            },
            {
                name: "K 机架：条件",
                type: "label"
            },
            {
                name: "R1-Q1",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R1-Q2",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R1-Q3",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R1-Q4",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R1-Q5",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R1取反",
                type: "boolean",
                value: false
            },
            {
                name: "R1计数器",
                type: "option",
                value: ["", "1", "2", "3", "4", "5"]
            },
            {
                name: "R2-Q1",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R2-Q2",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R2-Q3",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R2-Q4",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R2-Q5",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R2取反",
                type: "boolean",
                value: false
            },
            {
                name: "R2计数器",
                type: "option",
                value: ["", "1", "2", "3", "4", "5"]
            },
            {
                name: "R3-Q1",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R3-Q2",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R3-Q3",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R3-Q4",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R3-Q5",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "R3取反",
                type: "boolean",
                value: false
            },
            {
                name: "R3计数器",
                type: "option",
                value: ["", "1", "2", "3", "4", "5"]
            },
            {
                name: "全部取反",
                type: "boolean",
                value: false
            },
            {
                name: "K 架：加法",
                type: "label"
            },
            {
                name: "添加Q1",
                type: "boolean",
                value: false
            },
            {
                name: "添加Q2",
                type: "boolean",
                value: false
            },
            {
                name: "添加Q3",
                type: "boolean",
                value: false
            },
            {
                name: "添加Q4",
                type: "boolean",
                value: false
            },
            {
                name: "添加Q5",
                type: "boolean",
                value: false
            },
            {
                name: "加法等于",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "添加计数器1",
                type: "boolean",
                value: false
            },
            {
                name: "添加全部取反",
                type: "boolean",
                value: false
            },
            {
                name: "总电机",
                type: "editableOptionShort",
                value: SWITCHES,
                defaultIndex: 1
            },
            {
                name: "主控制面板",
                type: "label"
            },
            {
                name: "设置总数",
                type: "number",
                value: 0
            },
            {
                name: "快速步进",
                type: "option",
                value: ["", "X1", "X2", "X3", "X4", "X5", "M37", "M61", "S1", "S2", "S3", "S4", "S5"]
            },
            {
                name: "慢速步进",
                type: "option",
                value: ["", "X1", "X2", "X3", "X4", "X5", "M37", "M61", "S1", "S2", "S3", "S4", "S5"]
            },
            {
                name: "起始 Χ1",
                type: "number",
                value: 1
            },
            {
                name: "起始 Χ2",
                type: "number",
                value: 1
            },
            {
                name: "起始 Χ3",
                type: "number",
                value: 1
            },
            {
                name: "起始 Χ4",
                type: "number",
                value: 1
            },
            {
                name: "起始 Χ5",
                type: "number",
                value: 1
            },
            {
                name: "起始M61",
                type: "number",
                value: 1
            },
            {
                name: "起始M37",
                type: "number",
                value: 1
            },
            {
                name: "起始 Ψ1",
                type: "number",
                value: 1
            },
            {
                name: "起始 Ψ2",
                type: "number",
                value: 1
            },
            {
                name: "起始 Ψ3",
                type: "number",
                value: 1
            },
            {
                name: "起始 Ψ4",
                type: "number",
                value: 1
            },
            {
                name: "起始 Ψ5",
                type: "number",
                value: 1
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {Object}
     */
    run(input, args) {
        input = input.toUpperCase();
        for (const character of input) {
            if (VALID_ITA2.indexOf(character) === -1) {
                let errltr = character;
                if (errltr === "\n") errltr = "Carriage Return";
                if (errltr === " ") errltr = "Space";
                throw new OperationError("无效的 ITA2 字符：" + errltr);
            }
        }

        const pattern = args[1];
        const qbusin = {
            "Z": args[2],
            "Chi": args[3],
            "Psi": args[4],
        };

        const limitation = args[5];
        const lm = [false, false, false];
        if (limitation.includes("Χ2")) lm[0] = true;
        if (limitation.includes("Ψ1")) lm[1] = true;
        if (limitation.includes("P5")) lm[2] = true;
        const limit = {
            X2: lm[0], S1: lm[1], P5: lm[2]
        };

        const KRackOpt = args[6];
        const setProgram = args[7];

        if (KRackOpt === "Select Program" && setProgram !== "") {
            args = this.selectProgram(setProgram, args);
        }

        const re = new RegExp("^$|^[.x]$");
        for (let qr=0;qr<3;qr++) {
            for (let a=0;a<5;a++) {
                if (!re.test(args[((qr*7)+(a+9))]))
                    throw new OperationError("开关 R"+(qr+1)+"-Q"+(a+1)+" can only be set to blank, . or x");
            }
        }

        if (!re.test(args[37])) throw new OperationError("开关 Add-Equals 只能设置为空白、. 或 x");
        if (!re.test(args[40])) throw new OperationError("开关 Total Motor 只能设置为空白、. 或 x");

        // Q1,Q2,Q3,Q4,Q5,negate,counter1
        const qbusswitches = {
            condition: [
                {Qswitches: [args[9], args[10], args[11], args[12], args[13]], Negate: args[14], Counter: args[15]},
                {Qswitches: [args[16], args[17], args[18], args[19], args[20]], Negate: args[21], Counter: args[22]},
                {Qswitches: [args[23], args[24], args[25], args[26], args[27]], Negate: args[28], Counter: args[29]}
            ],
            condNegateAll: args[30],
            addition: [
                {Qswitches: [args[32], args[33], args[34], args[35], args[36]], Equals: args[37], C1: args[38]}
            ],
            addNegateAll: args[39],
            totalMotor: args[40]
        };

        const settotal = parseInt(args[42], 10);
        if (settotal < 0 || settotal > 9999)
            throw new OperationError("Set Total 必须在 0000 到 9999 之间");

        // null|fast|slow for each of S1-5,M1-2,X1-5
        const control = {
            fast: args[43],
            slow: args[44]
        };

        // Start positions
        if (args[52]<1 || args[52]>43) throw new OperationError("Ψ1 起始值必须在 1 到 43 之间");
        if (args[53]<1 || args[53]>47) throw new OperationError("Ψ2 起始值必须在 1 到 47 之间");
        if (args[54]<1 || args[54]>51) throw new OperationError("Ψ3 起始值必须在 1 到 51 之间");
        if (args[55]<1 || args[55]>53) throw new OperationError("Ψ4 起始值必须在 1 到 53 之间");
        if (args[56]<1 || args[57]>59) throw new OperationError("Ψ5 起始值必须在 1 到 59 之间");
        if (args[51]<1 || args[51]>37) throw new OperationError("Μ37 起始值必须在 1 到 37 之间");
        if (args[50]<1 || args[50]>61) throw new OperationError("Μ61 起始值必须在 1 到 61 之间");
        if (args[45]<1 || args[45]>41) throw new OperationError("Χ1 起始值必须在 1 到 41 之间");
        if (args[46]<1 || args[46]>31) throw new OperationError("Χ2 起始值必须在 1 到 31 之间");
        if (args[47]<1 || args[47]>29) throw new OperationError("Χ3 起始值必须在 1 到 29 之间");
        if (args[48]<1 || args[48]>26) throw new OperationError("Χ4 起始值必须在 1 到 26 之间");
        if (args[49]<1 || args[49]>23) throw new OperationError("Χ5 起始值必须在 1 到 23 之间");

        const starts = {
            X1: args[45], X2: args[46], X3: args[47], X4: args[48], X5: args[49],
            M61: args[50], M37: args[51],
            S1: args[52], S2: args[53], S3: args[54], S4: args[55], S5: args[56]
        };

        const colossus = new ColossusComputer(input, pattern, qbusin, qbusswitches, control, starts, settotal, limit);
        const result = colossus.run();

        return result;
    }

    /**
     * Select Program
     *
     * @param {string} progname
     * @param {Object[]} args
     * @returns {Object[]}
     */
    selectProgram(progname, args) {

        // Basic Letter Count
        if (progname === "Letter Count") {
            // Set Conditional R1 : count every character into counter 1
            args[9] = "";
            args[10] = "";
            args[11] = "";
            args[12] = "";
            args[13] = "";
            args[14] = false;
            args[15] = "1";
            // clear Conditional R2 & R3
            args[22] = "";
            args[29] = "";
            // Clear Negate result
            args[30] = false;
            // Clear Addition row counter
            args[38] = false;
        }

        // Bill Tutte's 1+2 Break In
        if (progname === "1+2=. (1+2 Break In, Find X1,X2)") {
            // Clear any other counters
            args[15] = ""; // Conditional R1
            args[22] = ""; // Conditional R2
            args[29] = ""; // Conditional R3
            // Set Add Q1+Q2=. into Counter 1
            args[32] = true;
            args[33] = true;
            args[34] = false;
            args[35] = false;
            args[36] = false;
            args[37] = ".";
            args[38] = true;
        }

        // 4=3=/1=2 : Find X4 & X5 where X1 & X2 are known
        if (progname === "4=5=/1=2 (Given X1,X2 find X4,X5)") {
            // Set Conditional R1 : Match NOT ..?.. into counter 1
            args[9] = ".";
            args[10] = ".";
            args[11] = "";
            args[12] = ".";
            args[13] = ".";
            args[14] = true;
            args[15] = "1";
            // Set Conditional R2 : AND Match NOT xx?xx into counter 1
            args[16] = "x";
            args[17] = "x";
            args[18] = "";
            args[19] = "x";
            args[20] = "x";
            args[21] = true;
            args[22] = "1";
            // clear Conditional R3
            args[29] = "";
            // Negate result, giving NOT(NOT Q1 AND NOT Q2) which is equivalent to Q1 OR Q2
            args[30] = true;
            // Clear Addition row counter
            args[38] = false;
        }

        // /,5,U : Count number of matches of /, 5 & U to find X3
        if (progname === "/,5,U (Count chars to find X3)") {
            // Set Conditional R1 : Match / char, ITA2 = ..... into counter 1
            args[9] = ".";
            args[10] = ".";
            args[11] = ".";
            args[12] = ".";
            args[13] = ".";
            args[14] = false;
            args[15] = "1";
            // Set Conditional R2 : Match 5 char, ITA2 = xx.xx into counter 2
            args[16] = "x";
            args[17] = "x";
            args[18] = ".";
            args[19] = "x";
            args[20] = "x";
            args[21] = false;
            args[22] = "2";
            // Set Conditional R3 : Match U char, ITA2 = xxx.. into counter 3
            args[23] = "x";
            args[24] = "x";
            args[25] = "x";
            args[26] = ".";
            args[27] = ".";
            args[28] = false;
            args[29] = "3";
            // Clear Negate result
            args[30] = false;
            // Clear Addition row counter
            args[38] = false;
        }

        return args;
    }

    /**
     * Displays Colossus results in an HTML table
     *
     * @param {Object} output
     * @param {Object[]} output.counters
     * @returns {html}
     */
    present(output) {
        let html = "Colossus Printer\n\n";
        html += output.printout + "\n\n";
        html += "Colossus Counters\n\n";
        html += "<table class='table table-hover table-sm table-bordered table-nonfluid'><tr><th>C1</th>  <th>C2</th>  <th>C3</th>  <th>C4</th>  <th>C5</th></tr>\n";
        html += "<tr>";
        for (const ct of output.counters) {
            html += `<td>${ct}</td>\n`;
        }
        html += "</tr>";
        html += "</table>";
        return html;
    }

}

export default Colossus;
