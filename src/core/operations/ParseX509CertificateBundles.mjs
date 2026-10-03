/**
 * @author Pål Sollie [sollie@gmail.com]
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import ParseX509Certificate from "./ParseX509Certificate.mjs";

/**
 * Parse X.509 certificate bundles operation
 */
class ParseX509CertificateBundles extends Operation {

    /**
     * ParseX509CertificateBundles constructor
     */
    constructor() {
        super();

        this.name = "解析 X.509 证书捆绑包";
        this.module = "PublicKey";
        this.description = "解析包含一个或多个 X.509 证书的 PEM 文件，并按顺序显示每个证书的有效期、颁发者、主题、扩展等详细信息。";
        this.infoURL = "https://wikipedia.org/wiki/X.509";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {string} input
     * @returns {string}
     */
    run(input) {
        if (!input.length) return "无输入";
        if (input.length > 2_000_000) throw new OperationError("证书捆绑包超过 2 MB");

        const begin = "-----BEGIN CERTIFICATE-----";
        const end = "-----END CERTIFICATE-----";
        const parser = new ParseX509Certificate();
        const output = [];
        let position = 0;

        while (position < input.length) {
            const start = input.indexOf(begin, position);
            if (start === -1) break;
            if (input.slice(position, start).trim()) throw new OperationError("无效的证书捆绑包内容");
            if (output.length >= 100) throw new OperationError("证书捆绑包超过 100 个证书");

            const finish = input.indexOf(end, start + begin.length);
            if (finish === -1) throw new OperationError(`证书 ${output.length + 1}：未找到 PEM 尾部`);

            try {
                if (!/^[A-Za-z0-9+/=\s]+$/.test(input.slice(start + begin.length, finish))) throw new Error("无效的 PEM 主体");
                output.push(`证书 ${output.length + 1}：\n${parser.run(input.slice(start, finish + end.length), ["PEM"])}`);
            } catch (err) {
                throw new OperationError(`证书 ${output.length + 1}：证书加载错误（输入不是证书？）`);
            }
            position = finish + end.length;
        }

        if (input.slice(position).trim() || !output.length) throw new OperationError("无效的证书捆绑包内容");
        return output.join("\n\n");
    }

}

export default ParseX509CertificateBundles;
