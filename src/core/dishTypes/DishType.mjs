/**
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */


/**
 * Abstract class for dish translation methods
 */
class DishType {

    /**
     * Warn translations don't work without value from bind
     */
    static checkForValue(value) {
        if (value === undefined) {
            throw new Error("请仅通过 .bind 使用翻译方法");
        }
    }

    /**
     * convert the given value to a ArrayBuffer
     * @param {*} value
     */
    static toArrayBuffer() {
        throw new Error("toArrayBuffer 尚未实现");
    }

    /**
     * convert the given value from a ArrayBuffer
     */
    static fromArrayBuffer() {
        throw new Error("fromArrayBuffer 尚未实现");
    }
}

export default DishType;
