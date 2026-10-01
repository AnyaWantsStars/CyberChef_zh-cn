/**
 * @author Danh4 [dan.h4@ncsc.gov.uk]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import { encode } from "cbor2";
import { sortCoreDeterministic } from "cbor2/sorts";

/**
 * CBOR Encode operation
 */
class CBOREncode extends Operation {

    /**
     * CBOREncode constructor
     */
    constructor() {
        super();

        this.name = "CBOR 编码";
        this.module = "Serialise";
        this.description = "简洁二进制对象表示（CBOR）是一种基于 JSON 的二进制数据序列化格式。与 JSON 一样，它允许传输包含名称-值对的数据对象，但方式更简洁。这以牺牲人类可读性为代价提高了处理和传输速度。它定义于 IETF RFC 8949。";
        this.infoURL = "https://wikipedia.org/wiki/CBOR";
        this.inputType = "JSON";
        this.outputType = "ArrayBuffer";
        this.args = [];
    }

    /**
     * @param {JSON} input
     * @param {Object[]} args
     * @returns {ArrayBuffer}
     */
    run(input, args) {
        return new Uint8Array(encode(input, {sortKeys: sortCoreDeterministic})).buffer;
    }

}

export default CBOREncode;
