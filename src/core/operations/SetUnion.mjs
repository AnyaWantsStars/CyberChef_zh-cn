/**
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Set Union operation
 */
class SetUnion extends Operation {

    /**
     * Set Union constructor
     */
    constructor() {
        super();

        this.name = "集合并集";
        this.module = "Default";
        this.description = "计算两个集合的并集。";
        this.infoURL = "https://wikipedia.org/wiki/Union_(set_theory)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                name: "样本分隔符",
                type: "binaryString",
                value: "\\n\\n"
            },
            {
                name: "项目分隔符",
                type: "binaryString",
                value: ","
            },
        ];
    }

    /**
     * Validate input length
     *
     * @param {Object[]} sets
     * @throws {Error} if not two sets
     */
    validateSampleNumbers(sets) {
        if (!sets || (sets.length !== 2)) {
            throw new OperationError("集合数量不正确，也许您需要修改样本分隔符或添加更多样本？");
        }
    }

    /**
     * Run the union operation
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     * @throws {OperationError}
     */
    run(input, args) {
        [this.sampleDelim, this.itemDelimiter] = args;
        const sets = input.split(this.sampleDelim);

        this.validateSampleNumbers(sets);

        return this.runUnion(...sets.map(s => s.split(this.itemDelimiter)));
    }

    /**
     * Get the union of the two sets.
     *
     * @param {Object[]} a
     * @param {Object[]} b
     * @returns {Object[]}
     */
    runUnion(a, b) {
        const result = {};

        /**
         * Only add non-existing items
         * @param {Object} hash
         */
        const addUnique = (hash) => (item) => {
            if (!hash[item]) {
                hash[item] = true;
            }
        };

        a.map(addUnique(result));
        b.map(addUnique(result));

        return Object.keys(result).join(this.itemDelimiter);
    }
}

export default SetUnion;
