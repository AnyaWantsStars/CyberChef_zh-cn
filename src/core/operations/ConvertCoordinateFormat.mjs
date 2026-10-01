/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import {FORMATS, convertCoordinates} from "../lib/ConvertCoordinates.mjs";

/**
 * Convert co-ordinate format operation
 */
class ConvertCoordinateFormat extends Operation {

    /**
     * ConvertCoordinateFormat constructor
     */
    constructor() {
        super();

        this.name = "转换坐标格式";
        this.module = "Hashing";
        this.description = "在不同格式之间转换地理坐标。<br><br>支持格式：<ul><li>度分秒（DMS）</li><li>度十进制分（DDM）</li><li>十进制度（DD）</li><li>Geohash</li><li>军事网格参考系统（MGRS）</li><li>英国地形测量局国家网格（OSNG）</li><li>通用横轴墨卡托（UTM）</li></ul><br>此操作可尝试自动检测输入坐标格式和分隔符，但可能不总是正确。";
        this.infoURL = "https://wikipedia.org/wiki/Geographic_coordinate_conversion";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "输入格式", "type": "option",
                "value": [
                    {name: "自动", value: "Auto"}
                ].concat(FORMATS)
            },
            {
                "name": "输入分隔符", "type": "option",
                "value": [
                    {name: "自动", value: "Auto"},
                    {name: "方向前导", value: "Direction Preceding"},
                    {name: "方向后随", value: "Direction Following"},
                    "\\n",
                    {name: "逗号", value: "Comma"},
                    {name: "分号", value: "Semi-colon"},
                    {name: "冒号", value: "Colon"}
                ]
            },
            {
                "name": "输出格式", "type": "option",
                "value": FORMATS
            },
            {
                "name": "输出分隔符",
                "type": "option",
                "value": [
                    {name: "空格", value: "Space"},
                    "\\n",
                    {name: "逗号", value: "Comma"},
                    {name: "分号", value: "Semi-colon"},
                    {name: "冒号", value: "Colon"}
                ]
            },
            {
                "name": "包含罗盘方向",
                "type": "option",
                "value": [
                    {name: "无", value: "None"},
                    {name: "之前", value: "Before"},
                    {name: "之后", value: "After"}
                ]
            },
            {
                "name": "精度",
                "type": "number",
                "value": 3
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.replace(/[\s+]/g, "") !== "") {
            const [inFormat, inDelim, outFormat, outDelim, incDirection, precision] = args;
            const result = convertCoordinates(input, inFormat, inDelim, outFormat, outDelim, incDirection, precision);
            return result;
        } else {
            return input;
        }
    }
}

export default ConvertCoordinateFormat;
