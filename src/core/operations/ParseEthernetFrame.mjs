/**
 * @author tedk [tedk@ted.do]
 * @copyright Crown Copyright 2024
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";
import {fromHex, toHex} from "../lib/Hex.mjs";

/**
 * Parse Ethernet frame operation
 */
class ParseEthernetFrame extends Operation {

    /**
     * ParseEthernetFrame constructor
     */
    constructor() {
        super();

        this.name = "解析 Ethernet 帧";
        this.module = "Default";
        this.description = "解析以太网帧，显示推导值（源和目标 MAC 地址、协议）或展示原始十六进制数据。";
        this.infoURL = "https://en.wikipedia.org/wiki/Ethernet_frame#Frame_%E2%80%93_data_link_layer";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                name: "输入类型",
                type: "option",
                value: [{name: "原始", value: "Raw"}, "Hex"],
                defaultIndex: 0,
            },
            {
                name: "返回类型",
                type: "option",
                value: [{name: "文本输出", value: "Text output"}, {name: "数据包数据", value: "Packet data"}, {name: "数据包数据 (十六进制)", value: "Packet data (hex)"}],
                defaultIndex: 0,
            }
        ];
    }


    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const format = args[0];
        const outputFormat = args[1];

        if (format === "Hex") {
            input = fromHex(input);
        } else if (format === "Raw") {
            input = new Uint8Array(Utils.strToArrayBuffer(input));
        } else {
            throw new OperationError("选择了无效的输入格式。");
        }

        const destinationMac = input.slice(0, 6);
        const sourceMac = input.slice(6, 12);

        let offset = 12;
        const vlans = [];

        while (offset < input.length) {
            const ethType = Utils.byteArrayToChars(input.slice(offset, offset+2));
            offset += 2;

            if (ethType === "\x81\x00" || ethType === "\x88\xA8") {
                // Parse the VLAN tag:
                // [0000] 0000 0000 0000
                //  ^^^ PRIO  - Ignored
                //     ^ DEI  - Ignored
                //        ^^^^ ^^^^ ^^^^ VLAN ID
                const vlanTag = input.slice(offset, offset+2);
                vlans.push(((vlanTag[0] & 0b00001111) << 8) | vlanTag[1]);

                offset += 2;
            } else {
                break;
            }
        }

        const packetData = input.slice(offset);

        if (outputFormat === "Packet data") {
            return Utils.escapeHtml(Utils.byteArrayToChars(packetData));
        } else if (outputFormat === "Packet data (hex)") {
            return toHex(packetData);
        } else if (outputFormat === "Text output") {
            let retval = `源 MAC: ${toHex(sourceMac, ":")}\n目的 MAC: ${toHex(destinationMac, ":")}\n`;
            if (vlans.length > 0) {
                retval += `VLAN: ${vlans.join(", ")}\n`;
            }
            retval += `Data:\n${toHex(packetData)}`;
            return retval;
        }

    }


}

export default ParseEthernetFrame;
