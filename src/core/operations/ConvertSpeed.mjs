/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * Convert speed operation
 */
class ConvertSpeed extends Operation {

    /**
     * ConvertSpeed constructor
     */
    constructor() {
        super();

        this.name = "转换速度";
        this.module = "Default";
        this.description = "将速度单位转换为另一种格式。";
        this.infoURL = "https://wikipedia.org/wiki/Orders_of_magnitude_(speed)";
        this.inputType = "BigNumber";
        this.outputType = "BigNumber";
        this.args = [
            {
                "name": "输入单位",
                "type": "option",
                "value": SPEED_UNITS
            },
            {
                "name": "输出单位",
                "type": "option",
                "value": SPEED_UNITS
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

        input = input.times(SPEED_FACTOR[inputUnits]);
        return input.div(SPEED_FACTOR[outputUnits]);
    }

}

const SPEED_UNITS = [
    {"name": "[公制]", "value": "[Metric]"}, {"name": "米每秒 (m/s)", "value": "Metres per second (m/s)"}, {"name": "千米每小时 (km/h)", "value": "Kilometres per hour (km/h)"}, {"name": "[/公制]", "value": "[/Metric]"},
    {"name": "[英制]", "value": "[Imperial]"}, {"name": "英里每小时 (mph)", "value": "Miles per hour (mph)"}, {"name": "节 (kn)", "value": "Knots (kn)"}, {"name": "[/英制]", "value": "[/Imperial]"},
    {"name": "[对比]", "value": "[Comparisons]"}, {"name": "人类头发生长速度", "value": "Human hair growth rate"}, {"name": "竹子生长速度", "value": "Bamboo growth rate"}, {"name": "世界上最快蜗牛的速度", "value": "World's fastest snail"}, {"name": "博尔特最高速度", "value": "Usain Bolt's top speed"}, {"name": "喷气客机巡航速度", "value": "Jet airliner cruising speed"}, {"name": "协和式客机", "value": "Concorde"}, {"name": "SR-71 黑鸟侦察机", "value": "SR-71 Blackbird"}, {"name": "航天飞机", "value": "Space Shuttle"}, {"name": "国际空间站", "value": "International Space Station"}, {"name": "[/对比]", "value": "[/Comparisons]"},
    {"name": "[科学]", "value": "[Scientific]"}, {"name": "标准大气中的声速", "value": "Sound in standard atmosphere"}, {"name": "水中声速", "value": "Sound in water"}, {"name": "月球逃逸速度", "value": "Lunar escape velocity"}, {"name": "地球逃逸速度", "value": "Earth escape velocity"}, {"name": "地球绕太阳轨道速度", "value": "Earth's solar orbit"}, {"name": "太阳系绕银河系轨道速度", "value": {"name": "太阳系绕银河系轨道速度", "value": "Solar system's Milky Way orbit"}}, {"name": "银河系相对宇宙微波背景的速度", "value": "Milky Way relative to the cosmic microwave background"}, {"name": "太阳逃逸速度", "value": "Solar escape velocity"}, {"name": "中子星逃逸速度 (0.3c)", "value": "Neutron star escape velocity (0.3c)"}, {"name": "钻石中的光速 (0.4136c)", "value": "Light in a diamond (0.4136c)"}, {"name": "光纤中的信号速度 (0.667c)", "value": "Signal in an optical fibre (0.667c)"}, {"name": "光速 (c)", "value": "Light (c)"}, {"name": "[/科学]", "value": "[/Scientific]"},
];

const SPEED_FACTOR = { // Multiples of m/s
    // Metric
    "Metres per second (m/s)":           1,
    "Kilometres per hour (km/h)":        0.2778,

    // Imperial
    "Miles per hour (mph)":              0.44704,
    "Knots (kn)":                        0.5144,

    // Comparisons
    "Human hair growth rate":            4.8e-9,
    "Bamboo growth rate":                1.4e-5,
    "World's fastest snail":             0.00275,
    "Usain Bolt's top speed":            12.42,
    "Jet airliner cruising speed":       250,
    "Concorde":                          603,
    "SR-71 Blackbird":                   981,
    "Space Shuttle":                     1400,
    "International Space Station":       7700,

    // Scientific
    "Sound in standard atmosphere":      340.3,
    "Sound in water":                    1500,
    "Lunar escape velocity":             2375,
    "Earth escape velocity":             11200,
    "Earth's solar orbit":               29800,
    "Solar system's Milky Way orbit":    200000,
    "Milky Way relative to the cosmic microwave background": 552000,
    "Solar escape velocity":             617700,
    "Neutron star escape velocity (0.3c)": 100000000,
    "Light in a diamond (0.4136c)":      124000000,
    "Signal in an optical fibre (0.667c)": 200000000,
    "Light (c)":                         299792458,
};


export default ConvertSpeed;
