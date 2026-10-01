/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert mass operation
 */
class ConvertMass extends Operation {

    /**
     * ConvertMass constructor
     */
    constructor() {
        super();

        this.name = "转换质量";
        this.module = "Default";
        this.description = "将质量单位转换为另一种格式。";
        this.infoURL = "https://wikipedia.org/wiki/Orders_of_magnitude_(mass)";
        this.inputType = "BigNumber";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": MASS_UNITS
            },
            {
                "name": "输出单位",
                "type": "option",
                "value": MASS_UNITS
            }
        ];
    }

    /**
     * @param {BigNumber} input
     * @param {Object[]} args
     * @returns {BigNumber}
     */
    run(input, args) {
        const [inputUnits, outputUnits] = args;

        input = input.times(MASS_FACTOR[inputUnits]);
        return input.div(MASS_FACTOR[outputUnits]);
    }

}


const MASS_UNITS = [
    {"name": "[公制]", "value": "[Metric]"}, {"name": "攸克 (yg)", "value": "Yoctogram (yg)"}, {"name": "仄克 (zg)", "value": "Zeptogram (zg)"}, {"name": "阿克 (ag)", "value": "Attogram (ag)"}, {"name": "飞克 (fg)", "value": "Femtogram (fg)"}, {"name": "皮克 (pg)", "value": "Picogram (pg)"}, {"name": "纳克 (ng)", "value": "Nanogram (ng)"}, {"name": "微克 (μg)", "value": "Microgram (μg)"}, {"name": "毫克 (mg)", "value": "Milligram (mg)"}, {"name": "厘克 (cg)", "value": "Centigram (cg)"}, {"name": "分克 (dg)", "value": "Decigram (dg)"}, {"name": "克 (g)", "value": "Gram (g)"}, {"name": "十克 (dag)", "value": "Decagram (dag)"}, {"name": "百克 (hg)", "value": "Hectogram (hg)"}, {"name": "千克 (kg)", "value": "Kilogram (kg)"}, {"name": "兆克 (Mg)", "value": "Megagram (Mg)"}, {"name": "吨 (t)", "value": "Tonne (t)"}, {"name": "吉克 (Gg)", "value": "Gigagram (Gg)"}, {"name": "太克 (Tg)", "value": "Teragram (Tg)"}, {"name": "拍克 (Pg)", "value": "Petagram (Pg)"}, {"name": "艾克 (Eg)", "value": "Exagram (Eg)"}, {"name": "泽克 (Zg)", "value": "Zettagram (Zg)"}, {"name": "尧克 (Yg)", "value": "Yottagram (Yg)"}, {"name": "[/公制]", "value": "[/Metric]"},
    {"name": "[英制常衡]", "value": "[Imperial Avoirdupois]"}, {"name": "格令 (gr)", "value": "Grain (gr)"}, {"name": "打兰 (dr)", "value": "Dram (dr)"}, {"name": "盎司 (oz)", "value": "Ounce (oz)"}, {"name": "磅 (lb)", "value": "Pound (lb)"}, {"name": "钉（英制重量单位）", "value": "Nail"}, {"name": "英石 (st)", "value": "Stone (st)"}, {"name": "夸特 (gr)", "value": "Quarter (gr)"}, {"name": "托德", "value": "Tod"}, {"name": "美制英担 (cwt)", "value": "US hundredweight (cwt)"}, {"name": "英制英担 (cwt)", "value": "Imperial hundredweight (cwt)"}, {"name": "美制吨 (t)", "value": "US ton (t)"}, {"name": "英制吨 (t)", "value": "Imperial ton (t)"}, {"name": "[/英制常衡]", "value": "[/Imperial Avoirdupois]"},
    {"name": "[英制金衡]", "value": "[Imperial Troy]"}, {"name": "格令 (gr)", "value": "Grain (gr)"}, {"name": "本尼威特 (dwt)", "value": "Pennyweight (dwt)"}, {"name": "金衡打兰 (dr t)", "value": "Troy dram (dr t)"}, {"name": "金衡盎司 (oz t)", "value": "Troy ounce (oz t)"}, {"name": "金衡磅 (lb t)", "value": "Troy pound (lb t)"}, {"name": "马克", "value": "Mark"}, {"name": "[/英制金衡]", "value": "[/Imperial Troy]"},
    {"name": "[古制]", "value": "[Archaic]"}, {"name": "韦", "value": "Wey"}, {"name": "羊毛韦", "value": "Wool wey"}, {"name": "萨福克韦", "value": "Suffolk wey"}, {"name": "羊毛袋", "value": "Wool sack"}, {"name": "煤袋", "value": "Coal sack"}, {"name": "驮（载重单位）", "value": "Load"}, {"name": "拉斯特", "value": "Last"}, {"name": "亚麻或羽毛拉斯特", "value": "Flax or feather last"}, {"name": "火药拉斯特", "value": "Gunpowder last"}, {"name": "担（石）", "value": "Picul"}, {"name": "稻米拉斯特", "value": "Rice last"}, {"name": "[/古制]", "value": "[/Archaic]"},
    {"name": "[对比]", "value": "[Comparisons]"}, {"name": "大本钟 (14 吨)", "value": "Big Ben (14 tonnes)"}, {"name": "蓝鲸 (180 吨)", "value": "Blue whale (180 tonnes)"}, {"name": "国际空间站 (417 吨)", "value": "International Space Station (417 tonnes)"}, {"name": "航天飞机 (2,041 吨)", "value": "Space Shuttle (2,041 tonnes)"}, {"name": "泰坦尼克号 (52,000 吨)", "value": "RMS Titanic (52,000 tonnes)"}, {"name": "吉萨大金字塔 (6,000,000 吨)", "value": "Great Pyramid of Giza (6,000,000 tonnes)"}, {"name": "地球海洋 (1.4 尧克)", "value": "Earth's oceans (1.4 yottagrams)"}, {"name": "[/对比]", "value": "[/Comparisons]"},
    {"name": "[天文]", "value": "[Astronomical]"}, {"name": "一茶匙中子星 (5,500 万吨)", "value": "A teaspoon of neutron star (5,500 million tonnes)"}, {"name": "月球质量 (ML)", "value": "Lunar mass (ML)"}, {"name": "地球质量 (M⊕)", "value": "Earth mass (M⊕)"}, {"name": "木星质量 (MJ)", "value": "Jupiter mass (MJ)"}, {"name": "太阳质量 (M☉)", "value": "Solar mass (M☉)"}, {"name": "人马座 A* (约 7.5 x 10^36 千克)", "value": "Sagittarius A* (7.5 x 10^36 kgs-ish)"}, {"name": "银河系 (1.2 x 10^42 千克)", "value": "Milky Way galaxy (1.2 x 10^42 kgs)"}, {"name": "可观测宇宙 (1.45 x 10^53 千克)", "value": "The observable universe (1.45 x 10^53 kgs)"}, {"name": "[/天文]", "value": "[/Astronomical]"},
];

const MASS_FACTOR = { // Multiples of a gram
    // Metric
    "Yoctogram (yg)":     1e-24,
    "Zeptogram (zg)":     1e-21,
    "Attogram (ag)":      1e-18,
    "Femtogram (fg)":     1e-15,
    "Picogram (pg)":      1e-12,
    "Nanogram (ng)":      1e-9,
    "Microgram (μg)":     1e-6,
    "Milligram (mg)":     1e-3,
    "Centigram (cg)":     1e-2,
    "Decigram (dg)":      1e-1,
    "Gram (g)":           1,
    "Decagram (dag)":     10,
    "Hectogram (hg)":     100,
    "Kilogram (kg)":      1000,
    "Megagram (Mg)":      1e6,
    "Tonne (t)":          1e6,
    "Gigagram (Gg)":      1e9,
    "Teragram (Tg)":      1e12,
    "Petagram (Pg)":      1e15,
    "Exagram (Eg)":       1e18,
    "Zettagram (Zg)":     1e21,
    "Yottagram (Yg)":     1e24,

    // Imperial Avoirdupois
    "Grain (gr)":         64.79891e-3,
    "Dram (dr)":          1.7718451953125,
    "Ounce (oz)":         28.349523125,
    "Pound (lb)":         453.59237,
    "Nail":               3175.14659,
    "Stone (st)":         6.35029318e3,
    "Quarter (gr)":       12700.58636,
    "Tod":                12700.58636,
    "US hundredweight (cwt)": 45.359237e3,
    "Imperial hundredweight (cwt)": 50.80234544e3,
    "US ton (t)":         907.18474e3,
    "Imperial ton (t)":   1016.0469088e3,

    // Imperial Troy
    "Pennyweight (dwt)":  1.55517384,
    "Troy dram (dr t)":   3.8879346,
    "Troy ounce (oz t)":  31.1034768,
    "Troy pound (lb t)":  373.2417216,
    "Mark":               248.8278144,

    // Archaic
    "Wey":                76.5e3,
    "Wool wey":           101.7e3,
    "Suffolk wey":        161.5e3,
    "Wool sack":          153000,
    "Coal sack":          50.80234544e3,
    "Load":               918000,
    "Last":               1836000,
    "Flax or feather last": 770e3,
    "Gunpowder last":     1090e3,
    "Picul":              60.478982e3,
    "Rice last":          1200e3,

    // Comparisons
    "Big Ben (14 tonnes)": 14e6,
    "Blue whale (180 tonnes)": 180e6,
    "International Space Station (417 tonnes)": 417e6,
    "Space Shuttle (2,041 tonnes)": 2041e6,
    "RMS Titanic (52,000 tonnes)": 52000e6,
    "Great Pyramid of Giza (6,000,000 tonnes)": 6e12,
    "Earth's oceans (1.4 yottagrams)": 1.4e24,

    // Astronomical
    "A teaspoon of neutron star (5,500 million tonnes)": 5.5e15,
    "Lunar mass (ML)":    7.342e25,
    "Earth mass (M⊕)":    5.97219e27,
    "Jupiter mass (MJ)":  1.8981411476999997e30,
    "Solar mass (M☉)":    1.98855e33,
    "Sagittarius A* (7.5 x 10^36 kgs-ish)": 7.5e39,
    "Milky Way galaxy (1.2 x 10^42 kgs)": 1.2e45,
    "The observable universe (1.45 x 10^53 kgs)": 1.45e56,
};


export default ConvertMass;
