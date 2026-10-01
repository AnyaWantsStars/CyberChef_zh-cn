/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert distance operation
 */
class ConvertDistance extends Operation {

    /**
     * ConvertDistance constructor
     */
    constructor() {
        super();

        this.name = "转换距离";
        this.module = "Default";
        this.description = "将距离单位转换为另一种格式。";
        this.infoURL = "https://wikipedia.org/wiki/Orders_of_magnitude_(length)";
        this.inputType = "BigNumber";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": DISTANCE_UNITS
            },
            {
                "name": "输出单位",
                "type": "option",
                "value": DISTANCE_UNITS
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

        input = input.times(DISTANCE_FACTOR[inputUnits]);
        return input.div(DISTANCE_FACTOR[outputUnits]);
    }

}

const DISTANCE_UNITS = [
    {"name": "[公制]", "value": "[Metric]"}, {"name": "纳米 (nm)", "value": "Nanometres (nm)"}, {"name": "微米 (µm)", "value": "Micrometres (µm)"}, {"name": "毫米 (mm)", "value": "Millimetres (mm)"}, {"name": "厘米 (cm)", "value": "Centimetres (cm)"}, {"name": "米 (m)", "value": "Metres (m)"}, {"name": "千米 (km)", "value": "Kilometers (km)"}, {"name": "[/公制]", "value": "[/Metric]"},
    {"name": "[英制]", "value": "[Imperial]"}, {"name": "密耳 (th)", "value": "Thou (th)"}, {"name": "英寸 (in)", "value": "Inches (in)"}, {"name": "英尺 (ft)", "value": "Feet (ft)"}, {"name": "码 (yd)", "value": "Yards (yd)"}, {"name": "链 (ch)", "value": "Chains (ch)"}, {"name": "浪 (fur)", "value": "Furlongs (fur)"}, {"name": "英里 (mi)", "value": "Miles (mi)"}, {"name": "里格 (lea)", "value": "Leagues (lea)"}, {"name": "[/英制]", "value": "[/Imperial]"},
    {"name": "[海事]", "value": "[Maritime]"}, {"name": "英寻 (ftm)", "value": "Fathoms (ftm)"}, {"name": "链节（海里）", "value": "Cables"}, {"name": "海里", "value": "Nautical miles"}, {"name": "[/海事]", "value": "[/Maritime]"},
    {"name": "[对比]", "value": "[Comparisons]"}, {"name": "汽车 (4m)", "value": "Cars (4m)"}, {"name": "公交车 (8.4m)", "value": "Buses (8.4m)"}, {"name": "美式足球场 (91m)", "value": "American football fields (91m)"}, {"name": "足球场 (105m)", "value": "Football pitches (105m)"}, {"name": "[/对比]", "value": "[/Comparisons]"},
    {"name": "[天文]", "value": "[Astronomical]"}, {"name": "地月距离", "value": "Earth-to-Moons"}, {"name": "地球赤道", "value": "Earth's equators"}, {"name": "天文单位 (au)", "value": "Astronomical units (au)"}, {"name": "光年 (ly)", "value": "Light-years (ly)"}, {"name": "秒差距 (pc)", "value": "Parsecs (pc)"}, {"name": "[/天文]", "value": "[/Astronomical]"},
];

const DISTANCE_FACTOR = { // Multiples of a metre
    "Nanometres (nm)":         1e-9,
    "Micrometres (µm)":        1e-6,
    "Millimetres (mm)":        1e-3,
    "Centimetres (cm)":        1e-2,
    "Metres (m)":              1,
    "Kilometers (km)":         1e3,

    "Thou (th)":               0.0000254,
    "Inches (in)":             0.0254,
    "Feet (ft)":               0.3048,
    "Yards (yd)":              0.9144,
    "Chains (ch)":             20.1168,
    "Furlongs (fur)":          201.168,
    "Miles (mi)":              1609.344,
    "Leagues (lea)":           4828.032,

    "Fathoms (ftm)":           1.853184,
    "Cables":                  185.3184,
    "Nautical miles":          1853.184,

    "Cars (4m)":               4,
    "Buses (8.4m)":            8.4,
    "American football fields (91m)": 91,
    "Football pitches (105m)": 105,

    "Earth-to-Moons":          380000000,
    "Earth's equators":        40075016.686,
    "Astronomical units (au)": 149597870700,
    "Light-years (ly)":        9460730472580800,
    "Parsecs (pc)":            3.0856776e16
};


export default ConvertDistance;
