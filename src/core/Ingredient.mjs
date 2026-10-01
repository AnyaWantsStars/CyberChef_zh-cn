/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Utils from "./Utils.mjs";
import { fromHex } from "./lib/Hex.mjs";
import OperationError from "./errors/OperationError.mjs";

/**
 * The arguments to operations.
 */
class Ingredient {

    /**
     * Ingredient constructor
     *
     * @param {Object} ingredientConfig
     */
    constructor(ingredientConfig) {
        this.name  = "";
        this.type  = "";
        this._value = null;
        this.disabled = false;
        this.hint = "";
        this.rows = 0;
        this.toggleValues = [];
        this.target = null;
        this.defaultIndex = 0;
        this.maxLength = null;
        this.min = null;
        this.max = null;
        this.step = 1;
        this.integer = false;
        this.allowEmpty = true;

        if (ingredientConfig) {
            this._parseConfig(ingredientConfig);
        }
    }


    /**
     * Reads and parses the given config.
     *
     * @private
     * @param {Object} ingredientConfig
     */
    _parseConfig(ingredientConfig) {
        this.name = ingredientConfig.name;
        this.type = ingredientConfig.type;
        this.defaultValue = ingredientConfig.value;
        this.disabled = !!ingredientConfig.disabled;
        this.hint = ingredientConfig.hint || false;
        this.rows = ingredientConfig.rows || false;
        this.toggleValues = ingredientConfig.toggleValues;
        this.target = typeof ingredientConfig.target !== "undefined" ? ingredientConfig.target : null;
        this.defaultIndex = typeof ingredientConfig.defaultIndex !== "undefined" ? ingredientConfig.defaultIndex : 0;
        this.maxLength = ingredientConfig.maxLength || null;
        this.min = ingredientConfig.min;
        this.max = ingredientConfig.max;
        this.step = ingredientConfig.step;
        this.integer = typeof ingredientConfig.integer !== "undefined" ? !!ingredientConfig.integer : false;
        this.allowEmpty = typeof ingredientConfig.allowEmpty !== "undefined" ? !!ingredientConfig.allowEmpty : true;
    }


    /**
     * Validates the given value against the constraints of this ingredient.
     *
     * @param {*} val
     * @returns {boolean}
     */
    validate(val) {
        if (this.disabled) return true;

        let checkVal = val;
        if (checkVal === null || checkVal === undefined) {
            checkVal = this.defaultValue;
        }

        if (this.type === "toggleString" && checkVal && typeof checkVal === "object" && "string" in checkVal) {
            checkVal = checkVal.string;
        }
        if (this.type === "option" && Array.isArray(checkVal)) {
            checkVal = checkVal[this.defaultIndex ?? 0];
        }
        if (this.type === "argSelector" && Array.isArray(checkVal)) {
            checkVal = checkVal[this.defaultIndex ?? 0]?.name || "";
        }

        // 1. check if empty
        let isEmpty = false;
        if (checkVal === null || checkVal === undefined || checkVal === "") {
            isEmpty = true;
        } else if (typeof checkVal.length === "number" && checkVal.length === 0) {
            isEmpty = true;
        }

        if (isEmpty) {
            let isAllowedOptionEmpty = false;
            if (this.type === "option" && Array.isArray(this.defaultValue)) {
                isAllowedOptionEmpty = this.defaultValue.includes("");
            } else if (this.type === "argSelector" && Array.isArray(this.defaultValue)) {
                isAllowedOptionEmpty = this.defaultValue.some(opt => opt.name === "");
            }
            if (this.allowEmpty === false || ((this.type === "option" || this.type === "argSelector") && !isAllowedOptionEmpty)) {
                throw new OperationError(`${this.name} 不能为空。`);
            }
            return true;
        }

        // 2. maxLength check
        if (typeof this.maxLength === "number" && checkVal !== null && checkVal !== undefined) {
            if (typeof checkVal === "string" && checkVal.length > this.maxLength) {
                throw new OperationError(`${this.name} 的长度不能超过 ${this.maxLength}。`);
            }
            if (Array.isArray(checkVal) && checkVal.length > this.maxLength) {
                throw new OperationError(`${this.name} 的长度不能超过 ${this.maxLength}。`);
            }
            if (checkVal instanceof Uint8Array && checkVal.length > this.maxLength) {
                throw new OperationError(`${this.name} 的长度不能超过 ${this.maxLength}。`);
            }
        }

        // 3. number checks
        if (this.type === "number") {
            if (checkVal === null || checkVal === undefined || isNaN(checkVal)) {
                throw new OperationError(`${this.name} 必须为数字。`);
            }
            if (this.integer && !Number.isInteger(checkVal)) {
                throw new OperationError(`${this.name} 必须为整数。`);
            }
            if (typeof this.min === "number" && checkVal < this.min) {
                throw new OperationError(`${this.name} 必须大于或等于 ${this.min}。`);
            }
            if (typeof this.max === "number" && checkVal > this.max) {
                throw new OperationError(`${this.name} 必须小于或等于 ${this.max}。`);
            }
        }

        // 4. option checks
        if (this.type === "option") {
            if (Array.isArray(this.defaultValue)) {
                // Support both plain string arrays and {name, value} objects (zh-cn localisation)
                const permittedValues = this.defaultValue
                    .map(opt => (typeof opt === "object" && opt !== null && "value" in opt) ? opt.value : opt)
                    .filter(opt => {
                        if (typeof opt !== "string") return false;
                        return !opt.match(/^\[[^[\]]+\]$/);
                    });
                const permittedNames = this.defaultValue
                    .map(opt => (typeof opt === "object" && opt !== null && "name" in opt) ? opt.name : opt)
                    .filter(opt => typeof opt === "string" && !opt.match(/^\[[^[\]]+\]$/));
                const valStr = (checkVal !== null && checkVal !== undefined) ? String(checkVal).toLowerCase() : "";
                const matchedOption = permittedValues.find(opt => opt.toLowerCase() === valStr);
                if (!matchedOption) {
                    const display = permittedNames.length > 0 ? permittedNames.join("，") : permittedValues.join("，");
                    throw new OperationError(`${this.name} 必须为以下之一：${display}。`);
                }
            }
        }

        // 5. argSelector checks
        if (this.type === "argSelector") {
            if (Array.isArray(this.defaultValue)) {
                const permittedOptions = this.defaultValue
                    .map(opt => opt.name)
                    .filter(optName => {
                        if (typeof optName !== "string") return false;
                        return !optName.match(/^\[[^[\]]+\]$/);
                    });
                const valStr = (checkVal !== null && checkVal !== undefined) ? String(checkVal).toLowerCase() : "";
                const matchedOption = permittedOptions.find(opt => opt.toLowerCase() === valStr);
                if (!matchedOption) {
                    throw new OperationError(`${this.name} 必须为以下之一：${permittedOptions.join("，")}。`);
                }
            }
        }

        return true;
    }


    /**
     * Returns the value of the Ingredient as it should be displayed in a recipe config.
     *
     * @returns {*}
     */
    get config() {
        return this._value;
    }


    /**
     * Sets the value of the Ingredient.
     *
     * @param {*} value
     */
    set value(value) {
        this._value = Ingredient.prepare(value, this.type);
    }


    /**
     * Gets the value of the Ingredient.
     *
     * @returns {*}
     */
    get value() {
        return this._value;
    }


    /**
     * Most values will be strings when they are entered. This function converts them to the correct
     * type.
     *
     * @param {*} data
     * @param {string} type - The name of the data type.
    */
    static prepare(data, type) {
        let number;

        switch (type) {
            case "binaryString":
            case "binaryShortString":
            case "editableOption":
            case "editableOptionShort":
                return Utils.parseEscapedChars(data);
            case "byteArray":
                if (typeof data == "string") {
                    data = data.replace(/\s+/g, "");
                    return fromHex(data);
                } else {
                    return data;
                }
            case "number":
                if (data === null) return data;
                number = parseFloat(data);
                if (isNaN(number)) {
                    const sample = Utils.truncate(data.toString(), 10);
                    throw new OperationError(
                        "无效的参数值。不是数字：" + sample,
                    );
                }
                return number;
            default:
                return data;
        }
    }

}

export default Ingredient;
