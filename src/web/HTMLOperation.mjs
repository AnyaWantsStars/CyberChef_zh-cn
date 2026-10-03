/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import HTMLIngredient from "./HTMLIngredient.mjs";
import Utils from "../core/Utils.mjs";
import url from "url";


/**
 * Object to handle the creation of operations.
 */
class HTMLOperation {

    /**
     * HTMLOperation constructor.
     *
     * @param {string} name - The name of the operation.
     * @param {Object} config - The configuration object for this operation.
     * @param {App} app - The main view object for CyberChef.
     * @param {Manager} manager - The CyberChef event manager.
     */
    constructor(name, config, app, manager) {
        this.app         = app;
        this.manager     = manager;

        this.name        = name;
        this.description = config.description;
        this.infoURL     = config.infoURL;
        this.manualBake  = config.manualBake || false;
        this.config      = config;
        this.ingList     = [];

        for (let i = 0; i < config.args.length; i++) {
            const ing = new HTMLIngredient(config.args[i], this.app, this.manager);
            this.ingList.push(ing);
        }
    }


    /**
     * Renders the operation in HTML as a stub operation with no ingredients.
     *
     * @param {boolean} removeIcon - show icon for removing operation
     * @param {string} elementId - element ID for aria usage
     * @returns {string}
     */
    toStubHtml(removeIcon = false, elementId = null) {
        let html = "<li class='operation'";

        if (elementId) {
            html += ` id='${elementId}'`;
        }

        if (this.description) {
            const infoLink = this.infoURL ? `<hr>${titleFromWikiLink(this.infoURL)}` : "";
            const content = Utils.escapeHtml(this.description + infoLink);

            html += ` data-container='body' data-toggle='popover' data-placement='right'
                data-content="${content}" data-html='true' data-trigger='hover'
                data-boundary='viewport' role='button'`;
        }

        html += ">" + this.name;

        if (removeIcon) {
            html += "<i class='material-icons remove-icon op-icon'>delete</i>";
        }

        html += "</li>";

        return html;
    }


    /**
     * Renders the operation in HTML as a full operation with ingredients.
     *
     * @returns {string}
     */
    toFullHtml() {
        let html = `<div class="op-title">${Utils.escapeHtml(this.name)}</div>
        <div class="ingredients">`;

        for (let i = 0; i < this.ingList.length; i++) {
            html += this.ingList[i].toHtml();
        }

        html += `</div>
        <div class="recip-icons">
            <i class="material-icons breakpoint" title="设置断点" break="false" data-help-title="设置断点" data-help="在操作上设置断点将导致流程执行到该操作时暂停。">pause</i>
            <i class="material-icons disable-icon" title="禁用操作" disabled="false" data-help-title="禁用操作" data-help="禁用操作将阻止其在流程执行时被执行。执行将跳过已禁用的操作并继续执行后续操作。">not_interested</i>
            <i class="material-icons hide-args-icon" title="隐藏操作参数" hide-args="false" data-help-title="隐藏操作参数" data-help="隐藏操作的参数将节省流程窗口中的空间。执行仍将使用所选的参数选项进行。">keyboard_arrow_up</i>
        </div>
        <div class="clearfix">&nbsp;</div>`;

        return html;
    }


    /**
     * Highlights searched strings in the name and description of the operation.
     *
     * @param {[[number]]} nameIdxs - Indexes of the search strings in the operation name [[start, length]]
     * @param {[[number]]} descIdxs - Indexes of the search strings in the operation description [[start, length]]
     */
    highlightSearchStrings(nameIdxs, descIdxs) {
        if (nameIdxs.length && typeof nameIdxs[0][0] === "number") {
            let opName = "",
                pos = 0;

            nameIdxs.forEach(idxs => {
                const [start, length] = idxs;
                if (typeof start !== "number") return;
                opName += this.name.slice(pos, start) + "<b>" +
                    this.name.slice(start, start + length) + "</b>";
                pos = start + length;
            });
            opName += this.name.slice(pos, this.name.length);
            this.name = opName;
        }

        if (this.description && descIdxs.length && descIdxs[0][0] >= 0) {
            // Find HTML tag offsets
            const re = /<[^>]+>/g;
            let match;
            while ((match = re.exec(this.description))) {
                // If the search string occurs within an HTML tag, return without highlighting it.
                const inHTMLTag = descIdxs.reduce((acc, idxs) => {
                    const start = idxs[0];
                    return start >= match.index && start <= (match.index + match[0].length);
                }, false);

                if (inHTMLTag) return;
            }

            let desc = "",
                pos = 0;

            descIdxs.forEach(idxs => {
                const [start, length] = idxs;
                desc += this.description.slice(pos, start) + "<b><u>" +
                    this.description.slice(start, start + length) + "</u></b>";
                pos = start + length;
            });
            desc += this.description.slice(pos, this.description.length);
            this.description = desc;
        }
    }

}


/**
 * Given a URL for a Wikipedia (or other wiki) page, this function returns a link to that page.
 *
 * @param {string} urlStr
 * @returns {string}
 */
function titleFromWikiLink(urlStr) {
    const urlObj = url.parse(urlStr);
    let wikiName = "",
        pageTitle = "";

    switch (urlObj.host) {
        case "forensics.wiki":
            wikiName = "Forensics Wiki";
            pageTitle = Utils.toTitleCase(urlObj.path.replace(/\//g, "").replace(/_/g, " "));
            break;
        case "wikipedia.org":
            wikiName = "Wikipedia";
            pageTitle = urlObj.pathname.substr(6).replace(/_/g, " "); // Chop off '/wiki/'
            break;
        default:
            // Not a wiki link, return full URL
            return `<a href='${urlStr}' target='_blank'>更多信息<i class='material-icons inline-icon'>open_in_new</i></a>`;
    }

    return `<a href='${urlObj.href}' target='_blank'>${pageTitle}<i class='material-icons inline-icon'>open_in_new</i></a>（${wikiName}）`;
}

export default HTMLOperation;
