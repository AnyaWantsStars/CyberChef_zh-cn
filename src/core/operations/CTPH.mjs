/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import ctphjs from "ctph.js";

/**
 * CTPH operation
 */
class CTPH extends Operation {

    /**
     * CTPH constructor
     */
    constructor() {
        super();

        this.name = "CTPH";
        this.module = "Crypto";
        this.description = "上下文触发分段哈希，也称为模糊哈希，可以匹配具有同源性的输入。这些输入具有相同顺序的相同字节序列，尽管这些序列之间的字节在内容和长度上可能不同。<br><br>CTPH 最初基于 Andrew Tridgell 博士的工作和一个名为 SpamSum 的垃圾邮件检测器。此方法由 Jesse Kornblum 改编，并于 2006 年在 DFRWS 会议上以论文「使用上下文触发分段哈希识别几乎相同的文件」发表。";
        this.infoURL = "https://forensics.wiki/context_triggered_piecewise_hashing/";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        return ctphjs.digest(input);
    }

}

export default CTPH;
