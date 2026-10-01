/**
 * @author GCHQ Contributor [3]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Protobuf from "../lib/Protobuf.mjs";

/**
 * Protobuf Decode operation
 */
class ProtobufDecode extends Operation {

    /**
     * ProtobufDecode constructor
     */
    constructor() {
        super();

        this.name = "Protobuf 解码";
        this.module = "Protobuf";
        this.description = "将任何 Protobuf 编码的数据解码为 JSON 表示，使用字段编号作为字段键。<br><br>如果定义了 .proto 模式，编码数据将参考该模式进行解码。仅解码一个消息实例。<br><br><u>显示未知字段</u><br>使用模式时，此选项显示输入数据中存在但模式中未定义的字段。<br><br><u>显示类型</u><br>在字段名称旁边显示字段类型。对于未定义的字段，则显示线类型和示例类型。";
        this.infoURL = "https://wikipedia.org/wiki/Protocol_Buffers";
        this.inputType = "ArrayBuffer";
        this.outputType = "JSON";
        this.args = [
            {
                name: "Schema（.proto文本）",
                type: "text",
                value: "",
                rows: 8,
                hint: "此成分已启用拖放"
            },
            {
                name: "显示未知字段",
                type: "boolean",
                value: false
            },
            {
                name: "显示类型",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {JSON}
     */
    run(input, args) {
        input = new Uint8Array(input);
        try {
            return Protobuf.decode(input, args);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            const offset = Number.isInteger(err?.byteOffset) ? ` at byte offset ${err.byteOffset}` : "";
            throw new OperationError(message + offset);
        }
    }

}

export default ProtobufDecode;
