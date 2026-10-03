/**
 * @author j433866 [j433866@gmail.com]
 * @copyright Crown Copyright 2019
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

/**
 * Render Markdown operation
 */
class RenderMarkdown extends Operation {

    /**
     * RenderMarkdown constructor
     */
    constructor() {
        super();

        this.name = "渲染 Markdown";
        this.module = "Code";
        this.description = "将输入的 Markdown 渲染为 HTML。为避免 XSS，HTML 渲染已禁用。";
        this.infoURL = "https://wikipedia.org/wiki/Markdown";
        this.inputType = "string";
        this.outputType = "html";
        this.args = [
            {
                name: "自动转换 URL 为链接",
                type: "boolean",
                value: false
            },
            {
                name: "启用语法高亮",
                type: "boolean",
                value: true
            },
            {
                name: "在新标签页中打开链接",
                type: "boolean",
                value: false
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {html}
     */
    run(input, args) {
        const [convertLinks, enableHighlighting, openLinksBlank] = args,
            md = new MarkdownIt({
                linkify: convertLinks,
                html: false, // Explicitly disable HTML rendering
                highlight: function(str, lang) {
                    if (lang && hljs.getLanguage(lang) && enableHighlighting) {
                        try {
                            return hljs.highlight(lang, str).value;
                        } catch (__) {}
                    }

                    return "";
                }
            });
        if (openLinksBlank) {
            this.makeLinksOpenInNewTab(md);
        }
        const rendered = md.render(input);
        return `<div style="font-family: var(--primary-font-family)">${rendered}</div>`;
    }

    /**
     * Adds target="_blank" to links.
     * @param {MarkdownIt} md
     */
    makeLinksOpenInNewTab(md) {
        // Adapted from: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
        // Remember old renderer, if overridden, or proxy to default renderer
        const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

        // eslint-disable-next-line camelcase
        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
            const token = tokens[idx];
            if (token.attrIndex("target") >= 0) {
                // Target attribute already set, do not replace.
                return defaultRender(tokens, idx, options, env, self);
            }
            token.attrPush(["target", "_blank"]); // add new attribute

            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        };
    }
}

export default RenderMarkdown;
