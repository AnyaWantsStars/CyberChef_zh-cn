/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

/**
 * Object to handle the creation of operation categories.
 */
class HTMLCategory {

    /**
     * HTMLCategory constructor.
     *
     * @param {string} name - The name of the category.
     * @param {boolean} selected - Whether this category is pre-selected or not.
     * @param {Set<string>} [hiddenSet] - 默认隐藏的操作名集合（仅常用模式过滤用）。
     * @param {boolean} [showAll] - 是否显示全部操作（false 时按 hiddenSet 过滤）。
     */
    constructor(name, selected, hiddenSet, showAll) {
        this.name = name;
        this.selected = selected;
        this.hiddenSet = hiddenSet || new Set();
        this.showAll = !!showAll;
        this.opList = [];
    }


    /**
     * Adds an operation to this category.
     *
     * @param {HTMLOperation} operation - The operation to add.
     */
    addOperation(operation) {
        this.opList.push(operation);
    }


    /**
     * Renders the category and all operations within it in HTML.
     *
     * @returns {string}
     */
    toHtml() {
        const catName = "cat" + this.name.replace(/[\s/\-:_]/g, "");
        let html = `<div class="panel category">
        <a class="category-title" data-toggle="collapse" data-target="#${catName}">
            ${this.name}
            <span class="op-count hidden">
                ${this.opList.length}
            </span>
        </a>
        <div id="${catName}" class="panel-collapse collapse ${(this.selected ? " show" : "")}" data-parent="#categories">
            <ul class="op-list">`;

        for (let i = 0; i < this.opList.length; i++) {
            // 仅常用模式下按隐藏名单过滤；分类计数保持全量（op-count 使用 opList.length）
            if (!this.showAll && this.hiddenSet.has(this.opList[i].name)) continue;
            html += this.opList[i].toStubHtml();
        }

        html += "</ul></div></div>";
        return html;
    }

}

export default HTMLCategory;
