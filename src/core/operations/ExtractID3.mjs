/**
 * @author n1073645 [n1073645@gmail.com]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";

/**
 * Extract ID3 operation
 */
class ExtractID3 extends Operation {

    /**
     * ExtractID3 constructor
     */
    constructor() {
        super();

        this.name = "提取 ID3";
        this.module = "Default";
        this.description = "此操作从 MP3 文件中提取 ID3 元数据。<br><br>ID3 是一种元数据容器，最常用于 MP3 音频文件格式。它允许将标题、艺术家、专辑、曲目编号以及其他文件信息存储在文件本身中。";
        this.infoURL = "https://wikipedia.org/wiki/ID3";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.presentType = "html";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        input = new Uint8Array(input);

        /**
         * Extracts the ID3 header fields.
         */
        function extractHeader() {
            if (!Array.from(input.slice(0, 3)).equals([0x49, 0x44, 0x33]))
                throw new OperationError("无效的 ID3 头。");

            const header = {
                "Type": "ID3",
                // Tag version
                "Version": input[3].toString() + "." + input[4].toString(),
                // Header version
                "Flags": input[5].toString()
            };

            input = input.slice(6);
            return header;
        }

        /**
         * Converts the size fields to a single integer.
         *
         * @param {number} num
         * @returns {string}
         */
        function readSize(num) {
            let result = 0;

            // The sizes are 7 bit numbers stored in 8 bit locations
            for (let i = (num) * 7; i; i -= 7) {
                result = (result << i) | input[0];
                input = input.slice(1);
            }
            return result;
        }

        /**
         * Reads frame header based on ID.
         *
         * @param {string} id
         * @returns {number}
         */
        function readFrame(id) {
            const frame = {};

            // Size of frame
            const size = readSize(4);
            frame.Size = size.toString();
            frame.Description = FRAME_DESCRIPTIONS[id];
            input = input.slice(2);

            // Read data from frame
            let data = "";
            for (let i = 1; i < size; i++)
                data += String.fromCharCode(input[i]);
            frame.Data = data;

            // Move to next Frame
            input = input.slice(size);

            return [frame, size];
        }

        const result = extractHeader();

        const headerTagSize = readSize(4);
        result.Size = headerTagSize.toString();

        const tags = {};
        let pos = 10;

        // While the current element is in the header
        while (pos < headerTagSize) {

            // Frame Identifier of frame
            let id = String.fromCharCode(input[0]) + String.fromCharCode(input[1]) + String.fromCharCode(input[2]);
            input = input.slice(3);

            // If the next character is non-zero it is an identifier
            if (input[0] !== 0) {
                id += String.fromCharCode(input[0]);
            }
            input = input.slice(1);

            if (id in FRAME_DESCRIPTIONS) {
                const [frame, size] = readFrame(id);
                tags[id] = frame;
                pos += 10 + size;
            } else if (id === "\x00\x00\x00") { // end of header
                break;
            } else {
                throw new OperationError("未知帧标识符：" + id);
            }
        }

        result.Tags = tags;

        return result;
    }

    /**
     * Displays the extracted data in a more accessible format for web apps.
     * @param {JSON} data
     * @returns {html}
     */
    present(data) {
        if (!data || !Object.prototype.hasOwnProperty.call(data, "Tags"))
            return JSON.stringify(data, null, 4);

        let output = `<table class="table table-hover table-sm table-bordered table-nonfluid">
            <tr><th>标签</th><th>描述</th><th>数据</th></tr>`;

        for (const tagID in data.Tags) {
            const description = data.Tags[tagID].Description,
                contents = data.Tags[tagID].Data;
            output += `<tr><td>${tagID}</td><td>${Utils.escapeHtml(description)}</td><td>${Utils.escapeHtml(contents)}</td></tr>`;
        }
        output += "</table>";
        return output;
    }

}

// Borrowed from https://github.com/aadsm/jsmediatags
const FRAME_DESCRIPTIONS = {
    // v2.2
    "BUF": "推荐缓冲区大小",
    "CNT": "播放计数",
    "COM": "注释",
    "CRA": "音频加密",
    "CRM": "加密元帧",
    "ETC": "事件定时码",
    "EQU": "均衡",
    "GEO": "通用封装对象",
    "IPL": "参与人员列表",
    "LNK": "链接信息",
    "MCI": "音乐 CD 标识",
    "MLL": "MPEG 位置查找表",
    "PIC": "附加图片",
    "POP": "流行度",
    "REV": "混响",
    "RVA": "相对音量调整",
    "SLT": "同步歌词/文本",
    "STC": "同步节拍码",
    "TAL": "专辑/电影/节目标题",
    "TBP": "BPM(每分钟节拍数)",
    "TCM": "作曲者",
    "TCO": "内容类型",
    "TCR": "版权信息",
    "TDA": "日期",
    "TDY": "播放延迟",
    "TEN": "编码者",
    "TFT": "文件类型",
    "TIM": "时间",
    "TKE": "初始调性",
    "TLA": "语言",
    "TLE": "长度",
    "TMT": "媒体类型",
    "TOA": "原始表演者",
    "TOF": "原始文件名",
    "TOL": "原始作词者/文本作者",
    "TOR": "原始发行年份",
    "TOT": "原始专辑/电影/节目标题",
    "TP1": "主要表演者/独奏者",
    "TP2": "乐队/管弦乐队/伴奏",
    "TP3": "指挥/表演细化",
    "TP4": "被演绎、混音或以其他方式修改",
    "TPA": "所属套装部分",
    "TPB": "出版商",
    "TRC": "ISRC(国际标准录制代码)",
    "TRD": "录制日期",
    "TRK": "音轨号/套装位置",
    "TSI": "大小",
    "TSS": "编码所用软件/硬件及设置",
    "TT1": "内容组描述",
    "TT2": "标题/歌名/内容描述",
    "TT3": "副标题/描述细化",
    "TXT": "作词者/文本作者",
    "TXX": "用户自定义文本信息帧",
    "TYE": "年份",
    "UFI": "唯一文件标识",
    "ULT": "非同步歌词/文本转写",
    "WAF": "官方音频文件网页",
    "WAR": "官方表演者网页",
    "WAS": "官方音频来源网页",
    "WCM": "商业信息",
    "WCP": "版权/法律信息",
    "WPB": "出版商官方网页",
    "WXX": "用户自定义 URL 链接帧",
    // v2.3
    "AENC": "音频加密",
    "APIC": "附加图片",
    "ASPI": "音频查找点索引",
    "CHAP": "章节",
    "CTOC": "目录",
    "COMM": "注释",
    "COMR": "商业帧",
    "ENCR": "加密方法注册",
    "EQU2": "均衡(2)",
    "EQUA": "均衡",
    "ETCO": "事件定时码",
    "GEOB": "通用封装对象",
    "GRID": "组标识注册",
    "IPLS": "参与人员列表",
    "LINK": "链接信息",
    "MCDI": "音乐 CD 标识",
    "MLLT": "MPEG 位置查找表",
    "OWNE": "所有权帧",
    "PRIV": "私有帧",
    "PCNT": "播放计数",
    "POPM": "流行度",
    "POSS": "位置同步帧",
    "RBUF": "推荐缓冲区大小",
    "RVA2": "相对音量调整(2)",
    "RVAD": "相对音量调整",
    "RVRB": "混响",
    "SEEK": "查找帧",
    "SYLT": "同步歌词/文本",
    "SYTC": "同步节拍码",
    "TALB": "专辑/电影/节目标题",
    "TBPM": "BPM(每分钟节拍数)",
    "TCOM": "作曲者",
    "TCON": "内容类型",
    "TCOP": "版权信息",
    "TDAT": "日期",
    "TDLY": "播放延迟",
    "TDRC": "录制时间",
    "TDRL": "发行时间",
    "TDTG": "标记时间",
    "TENC": "编码者",
    "TEXT": "作词者/文本作者",
    "TFLT": "文件类型",
    "TIME": "时间",
    "TIPL": "参与人员列表",
    "TIT1": "内容组描述",
    "TIT2": "标题/歌名/内容描述",
    "TIT3": "副标题/描述细化",
    "TKEY": "初始调性",
    "TLAN": "语言",
    "TLEN": "长度",
    "TMCL": "乐手名单",
    "TMED": "媒体类型",
    "TMOO": "心情",
    "TOAL": "原始专辑/电影/节目标题",
    "TOFN": "原始文件名",
    "TOLY": "原始作词者/文本作者",
    "TOPE": "原始表演者",
    "TORY": "原始发行年份",
    "TOWN": "文件所有者/被许可人",
    "TPE1": "主要表演者/独奏者",
    "TPE2": "乐队/管弦乐队/伴奏",
    "TPE3": "指挥/表演细化",
    "TPE4": "被演绎、混音或以其他方式修改",
    "TPOS": "所属套装部分",
    "TPRO": "制作通告",
    "TPUB": "出版商",
    "TRCK": "音轨号/套装位置",
    "TRDA": "录制日期",
    "TRSN": "网络电台名称",
    "TRSO": "网络电台所有者",
    "TSOA": "专辑排序",
    "TSOP": "表演者排序",
    "TSOT": "标题排序",
    "TSIZ": "大小",
    "TSRC": "ISRC(国际标准录制代码)",
    "TSSE": "编码所用软件/硬件及设置",
    "TSST": "套装副标题",
    "TYER": "年份",
    "TXXX": "用户自定义文本信息帧",
    "UFID": "唯一文件标识",
    "USER": "使用条款",
    "USLT": "非同步歌词/文本转写",
    "WCOM": "商业信息",
    "WCOP": "版权/法律信息",
    "WOAF": "官方音频文件网页",
    "WOAR": "官方表演者网页",
    "WOAS": "官方音频来源网页",
    "WORS": "官方网络电台主页",
    "WPAY": "付费",
    "WPUB": "出版商官方网页",
    "WXXX": "用户自定义 URL 链接帧"
};

export default ExtractID3;
