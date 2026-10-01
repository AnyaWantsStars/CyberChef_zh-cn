/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert area operation
 */
class ConvertArea extends Operation {

    /**
     * ConvertArea constructor
     */
    constructor() {
        super();

        this.name = "转换面积";
        this.module = "Default";
        this.description = "将面积单位转换为另一种格式。";
        this.infoURL = "https://wikipedia.org/wiki/Orders_of_magnitude_(area)";
        this.inputType = "BigNumber";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": AREA_UNITS
            },
            {
                "name": "输出单位",
                "type": "option",
                "value": AREA_UNITS
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

        input = input.times(AREA_FACTOR[inputUnits]);
        return input.div(AREA_FACTOR[outputUnits]);
    }

}


const AREA_UNITS = [
    {"name": "[公制]", "value": {"name": "[公制]", "value": "[Metric]"}}, {"name": "平方米 (sq m)", "value": "Square metre (sq m)"}, {"name": "平方千米 (sq km)", "value": "Square kilometre (sq km)"}, {"name": "平方厘公亩 (ca)", "value": "Centiare (ca)"}, {"name": "平方公亩 (da)", "value": "Deciare (da)"}, {"name": "公亩 (a)", "value": "Are (a)"}, {"name": "平方十公亩 (daa)", "value": "Decare (daa)"}, {"name": "公顷 (ha)", "value": "Hectare (ha)"}, {"name": "[/公制]", "value": "[/Metric]"},
    {"name": "[英制]", "value": {"name": "[英制]", "value": "[Imperial]"}}, {"name": "平方英寸 (sq in)", "value": "Square inch (sq in)"}, {"name": "平方英尺 (sq ft)", "value": "Square foot (sq ft)"}, {"name": "平方码 (sq yd)", "value": "Square yard (sq yd)"}, {"name": "平方英里 (sq mi)", "value": "Square mile (sq mi)"}, {"name": "平方杆 (sq per)", "value": "Perch (sq per)"}, {"name": "路得 (ro)", "value": "Rood (ro)"}, {"name": "国际英亩 (ac)", "value": "International acre (ac)"}, {"name": "[/英制]", "value": "[/Imperial]"},
    {"name": "[美制常用单位]", "value": {"name": "[美制常用单位]", "value": "[US customary units]"}}, {"name": "美国测量英亩 (ac)", "value": "US survey acre (ac)"}, {"name": "美国测量平方英里 (sq mi)", "value": "US survey square mile (sq mi)"}, {"name": "美国测量镇区", "value": "US survey township"}, {"name": "[/美制常用单位]", "value": "[/US customary units]"},
    {"name": "[核物理]", "value": {"name": "[核物理]", "value": "[Nuclear physics]"}}, {"name": "攸靶恩 (yb)", "value": "Yoctobarn (yb)"}, {"name": "仄靶恩 (zb)", "value": "Zeptobarn (zb)"}, {"name": "阿靶恩 (ab)", "value": "Attobarn (ab)"}, {"name": "飞靶恩 (fb)", "value": "Femtobarn (fb)"}, {"name": "皮靶恩 (pb)", "value": "Picobarn (pb)"}, {"name": "纳靶恩 (nb)", "value": "Nanobarn (nb)"}, {"name": "微靶恩 (μb)", "value": "Microbarn (μb)"}, {"name": "毫靶恩 (mb)", "value": "Millibarn (mb)"}, {"name": "靶恩 (b)", "value": "Barn (b)"}, {"name": "千靶恩 (kb)", "value": "Kilobarn (kb)"}, {"name": "兆靶恩 (Mb)", "value": "Megabarn (Mb)"}, {"name": "户外厕所", "value": "Outhouse"}, {"name": "棚屋", "value": "Shed"}, {"name": "普朗克面积", "value": "Planck area"}, {"name": "[/核物理]", "value": "[/Nuclear physics]"},
    {"name": "[对比]", "value": {"name": "[对比]", "value": "[Comparisons]"}}, {"name": "华盛顿特区", "value": "Washington D.C."}, {"name": "怀特岛", "value": "Isle of Wight"}, {"name": "威尔士", "value": "Wales"}, {"name": "得克萨斯州", "value": "Texas"}, {"name": "[/对比]", "value": "[/Comparisons]"},
];

const AREA_FACTOR = { // Multiples of a square metre
    // Metric
    "Square metre (sq m)":      1,
    "Square kilometre (sq km)": 1e6,

    "Centiare (ca)":            1,
    "Deciare (da)":             10,
    "Are (a)":                  100,
    "Decare (daa)":             1e3,
    "Hectare (ha)":             1e4,

    // Imperial
    "Square inch (sq in)":      0.00064516,
    "Square foot (sq ft)":      0.09290304,
    "Square yard (sq yd)":      0.83612736,
    "Square mile (sq mi)":      2589988.110336,
    "Perch (sq per)":           42.21,
    "Rood (ro)":                1011,
    "International acre (ac)":  4046.8564224,

    // US customary units
    "US survey acre (ac)":      4046.87261,
    "US survey square mile (sq mi)": 2589998.470305239,
    "US survey township":       93239944.9309886,

    // Nuclear physics
    "Yoctobarn (yb)":           1e-52,
    "Zeptobarn (zb)":           1e-49,
    "Attobarn (ab)":            1e-46,
    "Femtobarn (fb)":           1e-43,
    "Picobarn (pb)":            1e-40,
    "Nanobarn (nb)":            1e-37,
    "Microbarn (μb)":           1e-34,
    "Millibarn (mb)":           1e-31,
    "Barn (b)":                 1e-28,
    "Kilobarn (kb)":            1e-25,
    "Megabarn (Mb)":            1e-22,

    "Planck area":              2.6e-70,
    "Shed":                     1e-52,
    "Outhouse":                 1e-34,

    // Comparisons
    "Washington D.C.":          176119191.502848,
    "Isle of Wight":            380000000,
    "Wales":                    20779000000,
    "Texas":                    696241000000,
};


export default ConvertArea;
