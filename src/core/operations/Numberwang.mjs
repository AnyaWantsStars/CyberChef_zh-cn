/**
 * @author Unknown Male 282
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Numberwang operation. Remain indoors.
 */
class Numberwang extends Operation {

    /**
     * Numberwang constructor
     */
    constructor() {
        super();

        this.name = "Numberwang";
        this.module = "Default";
        this.description = "基于 Mitchell 和 Webb 的热门游戏节目。";
        this.infoURL = "https://wikipedia.org/wiki/That_Mitchell_and_Webb_Look#Recurring_sketches";
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
        let output;
        if (!input) {
            output = "让我们来玩 Wangernumb！";
        } else {
            const match = input.match(/(f0rty-s1x|shinty-six|filth-hundred and neeb|-?√?\d+(\.\d+)?i?([a-z]?)%?)/i);
            if (match) {
                if (match[3]) output = match[0] + "！这是 AlphaNumericWang！";
                else output = match[0] + "！这是 Numberwang！";
            } else {
                // That's a bad miss!
                output = "抱歉，那不是 Numberwang。让我们转动棋盘！";
            }
        }

        const rand = Math.floor(Math.random() * didYouKnow.length);
        return output + "\n\n你知道吗：" + didYouKnow[rand];
    }

}

/**
 * Taken from http://numberwang.wikia.com/wiki/Numberwang_Wikia
 *
 * @constant
 */
const didYouKnow = [
    "Numberwang，与普遍看法相反，是一种水果，而不是蔬菜。",
    "罗伯特·韦伯曾在主持一期 Numberwang 时得到了 WordWang。",
    "圆周率的第 6705 位数字是 Numberwang。",
    "Numberwang 是在某个星期七被发明的。",
    "与普遍看法相反，阿尔伯特·爱因斯坦上学时 Numberwang 成绩一直很好。他曾在一次测验中得了 ^4$ 分。",
    "有 680 颗小行星以 Numberwang 命名。",
    "阿基米德最出名的事迹，是在洗澡时突然领悟了排水原理，高呼“这就是 Numberwang！”。",
    "在日本，除了 6 月 6 日，一年中的每一天都庆祝 Numberwang 日。",
    "生物学家最近在人类 DNA 链中发现了 Numberwang。",
    "Numbernot 是一种特殊的非 Numberwang 数字。它能被 3 和字母“y”整除。",
    "朱莉曾在《艾默戴尔》的一集里一口气得到了 612.04 个 Numberwang。",
    "在印度，下棋时高喊“Numberwang！”而不是“将死”是一项传统。",
    "《倒计时》有一条规则：如果在数字环节得到了 Numberwang，就能自动获胜。该规则至今只被触发过两次。",
    "1722 年的一段短暂时期里，“Numberwang”曾是第三常见的婴儿名字。",
    "《狮子王》大体上是以 Numberwang 为原型改编的。",
    "“每天一个 Numberwang，医生远离我”——世界最长寿老人唐尼·科西正是这样解释自己 136 岁仍如此健康的秘诀。",
    "键盘上的“数字锁定”键，灵感来自《Numberwang》中同名的人气环节。",
    "1567 年，剑桥成为第一所开设 Numberwang 课程的大学。",
    "薛定谔的 Numberwang 是一个让牙医们困惑了几个世纪的数字。",
    "《哈利·波特与 Numberwang 的 Numberwang》在被出版商拒绝了 -41 次之后成为了畅销书。",
    "《Numberwang》是英国历史上播出时间最长的游戏节目；它播出了 226 季，每季 19 集，共计 132 集。",
    "三重 Numberwang 奖励是由考古学家托马斯·杰斐逊在萨默塞特发现的。",
    "在捷克斯洛伐克的部分地区，Numberwang 是违法的。",
    "Numberwang 于 12 世纪在印度被发现。",
    "Numberwang 的化学式为 Zn4SO2(HgEs)3。",
    "人类创造的第一副扑克牌中，有两张“Numberwang”牌代替了小丑牌。",
    "尤利乌斯·凯撒死于 Numberwang 过量。",
    "最具 Numberwang 属性的音符是 G#。",
    "1934 年，第四十三个谷歌涂鸦为即将播出的电视节目《Numberwang on Ice》做了宣传。",
    "最近一项心理学研究发现，幼儿识别 Numberwang 数字的速度要快 17%。",
    "电视节目《Numberwang》中共有 700 种犯规方式。1473 年，朱莉在单独一集里就犯下了全部 700 种。",
    "天文学家怀疑上帝就是 Numberwang。",
    "Numberwang 是加拿大的官方饮品。",
    "在《价格猜猜猜》的试播集中，如果参赛者猜对了商品的准确价格，就会被告知“这就是 Numberwang！”，并立刻赢得 ₹5.7032。",
    "第一个连续获得三个 Numberwang 的人是麦当娜。",
    "“Numberwang”在 Unicode 中的编码是 U+46402。",
    "音符“Numberwang”位于 D# 和 E♮ 之间。",
    "1834 年，Numberwang 首次在月球上被游玩。",
];

export default Numberwang;
