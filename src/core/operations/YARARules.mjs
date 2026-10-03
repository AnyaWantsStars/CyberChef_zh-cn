/**
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Yara from "libyara-wasm";
import { isWorkerEnvironment } from "../Utils.mjs";

/**
 * YARA Rules operation
 */
class YARARules extends Operation {

    /**
     * YARARules constructor
     */
    constructor() {
        super();

        this.name = "YARA 规则";
        this.module = "Yara";
        this.description = "YARA 是 VirusTotal 开发的一款工具，主要旨在帮助恶意软件研究人员识别和分类恶意软件样本。它根据用户指定的规则进行匹配，规则包含文本或二进制模式以及布尔表达式。有关编写规则的帮助，请参阅<a href='https://yara.readthedocs.io/en/latest/writingrules.html'>YARA 文档。</a>";
        this.infoURL = "https://wikipedia.org/wiki/YARA";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
            {
                name: "规则",
                type: "text",
                value: "",
                rows: 5
            },
            {
                name: "显示字符串",
                type: "boolean",
                value: false
            },
            {
                name: "显示字符串长度",
                type: "boolean",
                value: false
            },
            {
                name: "显示元数据",
                type: "boolean",
                value: false
            },
            {
                name: "显示计数",
                type: "boolean",
                value: true
            },
            {
                name: "显示规则警告",
                type: "boolean",
                value: true
            },
            {
                name: "显示控制台模块消息",
                type: "boolean",
                value: true
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    async run(input, args) {
        if (isWorkerEnvironment())
            self.sendStatusMessage("正在初始化 YARA...");
        const [rules, showStrings, showLengths, showMeta, showCounts, showRuleWarns, showConsole] = args;
        return new Promise((resolve, reject) => {
            Yara().then(yara => {
                if (isWorkerEnvironment()) self.sendStatusMessage("正在转换 YARA 数据。");
                let matchString = "";

                const inpArr = new Uint8Array(input); // Turns out embind knows that JS uint8array <==> C++ std::string

                if (isWorkerEnvironment()) self.sendStatusMessage("正在运行 YARA 匹配。");

                const resp = yara.run(inpArr, rules);

                if (isWorkerEnvironment()) self.sendStatusMessage("正在处理数据。");

                if (resp.compileErrors.size() > 0) {
                    for (let i = 0; i < resp.compileErrors.size(); i++) {
                        const compileError = resp.compileErrors.get(i);
                        if (!compileError.warning) {
                            reject(new OperationError(`第 ${compileError.lineNumber} 行出错：${compileError.message}`));
                        } else if (showRuleWarns) {
                            matchString += `第 ${compileError.lineNumber} 行警告：${compileError.message}\n`;
                        }
                    }
                }

                if (showConsole) {
                    const consoleLogs = resp.consoleLogs;
                    for (let i = 0; i < consoleLogs.size(); i++) {
                        matchString += consoleLogs.get(i) + "\n";
                    }
                }

                const matchedRules = resp.matchedRules;
                for (let i = 0; i < matchedRules.size(); i++) {
                    const rule = matchedRules.get(i);
                    const matches = rule.resolvedMatches;
                    let meta = "";
                    if (showMeta && rule.metadata.size() > 0) {
                        meta += " [";
                        for (let j = 0; j < rule.metadata.size(); j++) {
                            meta += `${rule.metadata.get(j).identifier}: ${rule.metadata.get(j).data}, `;
                        }
                        meta = meta.slice(0, -2) + "]";
                    }
                    const countString = matches.size() === 0 ? "" : (showCounts ? ` （${matches.size()} 次）` : "");
                    if (matches.size() === 0 || !(showStrings || showLengths)) {
                        matchString += `输入匹配规则 "${rule.ruleName}"${meta}${countString.length > 0 ? ` ${countString}`: ""}。\n`;
                    } else {
                        matchString += `Rule "${rule.ruleName}"${meta} matches${countString}:\n`;
                        for (let j = 0; j < matches.size(); j++) {
                            const match = matches.get(j);
                            if (showStrings || showLengths) {
                                matchString += `位置 ${match.location}，${showLengths ? `长度 ${match.matchLength}，` : ""}标识符 ${match.stringIdentifier}${showStrings ? `，数据："${match.data}"` : ""}\n`;
                            }
                        }
                    }
                }
                resolve(matchString);
            });
        });
    }

}

export default YARARules;
