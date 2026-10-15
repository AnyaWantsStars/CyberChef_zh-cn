/**
 * Waiter to handle the built-in recipe templates library.
 *
 * 内置流程模板库：Recipe 面板标题栏"模板库"按钮打开面板，
 * 模板按分类以手风琴方式折叠展示（同一时间最多展开一个分类，默认展开收藏夹）；
 * 名称与说明固定显示中文，不随 recipeLanguage 选项切换；
 * 模板卡片为紧凑列表式：默认仅显示模板名称，一行两列排布，
 * 鼠标悬停时弹出仿官方操作说明的气泡弹窗（popover），
 * 弹窗内不加标题行，上方为较详细中文介绍性说明，下方统一展示中文操作链；
 * 星标位于卡片右侧同行，点击星标即时收藏/取消收藏；
 * 同时支持将模板卡片拖拽到"收藏夹"分类实现收藏（仿官方 favourites 拖拽交互），
 * 两种收藏方式并存；
 * "收藏夹"分类标题行右侧为星形管理按钮，点击弹出收藏夹管理弹窗
 * （仿官方 favourites manager）：列出已收藏模板、支持移除、含"恢复默认收藏"设置；
 * 收藏保存到独立 localStorage key（cyberchef-template-favs），
 * 与官方操作收藏（favourites）互不冲突。
 * 点击模板即将该 recipe 加载到当前流程并关闭面板。
 */

import RecipeTemplates from "../../core/zh-cn/RecipeTemplates.json" with { type: "json" };
import RecipeCompatibility from "../../core/zh-cn/RecipeCompatibility.mjs";


/**
 * RecipeTemplatesWaiter
 *
 * @param {App} app - The main view object for CyberChef.
 * @param {Manager} manager - The CyberChef event manager.
 */
class RecipeTemplatesWaiter {

    /**
     * localStorage key for template favourites (independent from official
     * operation favourites which use "favourites").
     */
    static STORAGE_KEY = "cyberchef-template-favs";

    /**
     * Default set of favourite template ids (common daily-use templates).
     */
    static DEFAULT_FAVS = [
        "base64-url-decode",
        "md5-upper",
        "caesar-decrypt",
        "emotet-recipe-20201229"
    ];


    /**
     * RecipeTemplatesWaiter constructor.
     *
     * @param {App} app - The main view object for CyberChef.
     * @param {Manager} manager - The CyberChef event manager.
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;
        this.templates = RecipeTemplates.templates;
        this.categories = RecipeTemplates.categories;
        this.filter = "";
        this.favs = this.loadFavs();
        // 当前展开的分类；默认只展开收藏夹
        this.openCat = "fav";
        // 拖拽收藏相关状态：当前拖拽中的模板 id；拖拽事件是否已绑定
        this.dragTemplateId = null;
        this._dragBound = false;
        // 收藏夹管理弹窗的点击事件是否已绑定
        this._favModalBound = false;
    }


    /**
     * Opens the templates library modal and renders the current filter.
     */
    open() {
        this.favs = this.loadFavs();
        this.bindDragDrop();
        this.bindFavManagerEvents();
        this.render();
        $("#recipe-templates-modal").modal();
    }


    /**
     * Loads the favourite template id list from localStorage.
     * When no key exists yet, returns the default favourite set so that
     * first-time users get the built-in favourites immediately.
     *
     * @returns {string[]}
     */
    loadFavs() {
        try {
            const raw = localStorage.getItem(RecipeTemplatesWaiter.STORAGE_KEY);
            if (raw === null) return [...RecipeTemplatesWaiter.DEFAULT_FAVS];
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                return arr.filter(id => this.templates.some(t => t.id === id));
            }
            return [...RecipeTemplatesWaiter.DEFAULT_FAVS];
        } catch (err) {
            return [...RecipeTemplatesWaiter.DEFAULT_FAVS];
        }
    }


    /**
     * Persists the favourite template id list to localStorage.
     */
    saveFavs() {
        localStorage.setItem(RecipeTemplatesWaiter.STORAGE_KEY, JSON.stringify(this.favs));
    }


    /**
     * Toggles the favourite state of a template and re-renders the panel.
     *
     * @param {string} id - Template id
     */
    toggleFav(id) {
        const idx = this.favs.indexOf(id);
        if (idx >= 0) {
            this.favs.splice(idx, 1);
        } else {
            this.favs.push(id);
        }
        this.saveFavs();
        this.render();
    }


    /**
     * Restores the default favourite set and re-renders the panel.
     */
    resetFavs() {
        this.favs = [...RecipeTemplatesWaiter.DEFAULT_FAVS];
        this.saveFavs();
        this.render();
    }


    /**
     * Opens the favourite manager modal (mimicking the official operation
     * favourites manager): lists the collected templates, allows removing
     * them, and exposes the "restore default favourites" setting.
     */
    openFavManager() {
        this.renderFavManager();
        $("#recipe-templates-fav-modal").modal("show");
    }


    /**
     * Renders the collected template list inside the favourite manager modal.
     */
    renderFavManager() {
        const listEl = document.getElementById("recipe-templates-fav-list");
        if (!listEl) return;
        const favTemplates = this.favs
            .map(id => this.templates.find(t => t.id === id))
            .filter(t => t !== undefined);
        listEl.innerHTML = favTemplates.map(t =>
            `<li class="template-item" draggable="true" data-fav-id="${this.escapeHtml(t.id)}" title="拖动排序">
                <div class="template-item-row">
                    <span class="template-item-name">${this.escapeHtml(t.name.zh || t.name.en)}</span>
                    <span class="template-manage-del" data-fav-id="${this.escapeHtml(t.id)}" title="移除收藏">
                        <i class="material-icons">delete</i>
                    </span>
                </div>
            </li>`
        ).join("");
    }


    /**
     * Binds the favourite manager modal click handlers once (event delegation
     * on the static modal container): removing a favourite entry or restoring
     * the default favourites.
     */
    bindFavManagerEvents() {
        if (this._favModalBound) return;
        this._favModalBound = true;
        const modalEl = document.getElementById("recipe-templates-fav-modal");
        if (!modalEl) return;
        const self = this;
        let dragFavId = null;

        modalEl.addEventListener("click", function(e) {
            const removeEl = e.target.closest("#recipe-templates-fav-list .template-manage-del");
            if (removeEl) {
                const id = removeEl.getAttribute("data-fav-id");
                if (!id) return;
                self.favs = self.favs.filter(f => f !== id);
                self.saveFavs();
                self.renderFavManager();
                self.render();
                return;
            }
            const resetEl = e.target.closest("#recipe-templates-reset-favs");
            if (resetEl) {
                self.resetFavs();
                self.renderFavManager();
            }
        });

        // 拖拽排序：在收藏夹管理弹窗列表中上下拖动重排收藏顺序
        modalEl.addEventListener("dragstart", function(e) {
            const item = e.target.closest("#recipe-templates-fav-list .template-item");
            if (!item) return;
            dragFavId = item.getAttribute("data-fav-id");
            item.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
            try {
                e.dataTransfer.setData("text/plain", dragFavId);
            } catch (err) { /* ignore */ }
        });

        modalEl.addEventListener("dragover", function(e) {
            const listEl = document.getElementById("recipe-templates-fav-list");
            if (!listEl || dragFavId === null) return;
            const target = e.target.closest("#recipe-templates-fav-list .template-item");
            if (!target) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            const rect = target.getBoundingClientRect();
            const after = (e.clientY - rect.top) > rect.height / 2;
            const dragEl = listEl.querySelector(".template-item.dragging");
            if (!dragEl || dragEl === target) return;
            if (after) {
                if (target.nextElementSibling !== dragEl) {
                    listEl.insertBefore(dragEl, target.nextElementSibling);
                }
            } else {
                listEl.insertBefore(dragEl, target);
            }
        });

        modalEl.addEventListener("drop", function(e) {
            const listEl = document.getElementById("recipe-templates-fav-list");
            if (!listEl || dragFavId === null) return;
            e.preventDefault();
        });

        modalEl.addEventListener("dragend", function(e) {
            const item = e.target.closest(".template-item");
            if (item) item.classList.remove("dragging");
            const listEl = document.getElementById("recipe-templates-fav-list");
            if (!listEl || dragFavId === null) return;
            dragFavId = null;
            const ordered = Array.from(listEl.querySelectorAll(".template-item"))
                .map(el => el.getAttribute("data-fav-id"))
                .filter(id => id && self.favs.includes(id));
            const missing = self.favs.filter(id => !ordered.includes(id));
            self.favs = ordered.concat(missing);
            self.saveFavs();
            self.renderFavManager();
            self.render();
        });
    }


    /**
     * Renders the template list grouped by category using an accordion layout.
     * The "Favourites" category is always rendered first and is the default
     * expanded one; only one category is expanded at a time.
     * Names and descriptions are always shown in Chinese regardless of the
     * recipeLanguage option.
     */
    render() {
        const listEl = document.getElementById("recipe-templates-list");
        const q = this.filter.trim().toLowerCase();

        let html = "";
        let count = 0;

        // Favourites category first
        const favTemplates = this.favs
            .map(id => this.templates.find(t => t.id === id))
            .filter(t => t !== undefined);
        const favMatched = q === "" ? favTemplates : favTemplates.filter(t => this.matches(t, q));
        if (favMatched.length > 0) {
            count += favMatched.length;
            html += this.renderCategoryHtml("fav", "收藏夹", favMatched, true);
        }

        // Remaining categories follow the original order
        for (const catId of Object.keys(this.categories)) {
            const catTemplates = this.templates.filter(t => t.category === catId);
            const matched = q === "" ? catTemplates : catTemplates.filter(t => this.matches(t, q));
            if (matched.length === 0) continue;
            count += matched.length;
            html += this.renderCategoryHtml(catId, this.categories[catId].zh, matched, false);
        }

        if (count === 0) {
            html = `<div class="template-empty">未找到匹配的模板，换个关键词试试</div>`;
        }

        listEl.innerHTML = html;
        this.enablePopovers();
    }


    /**
     * Builds one accordion category section.
     *
     * @param {string} catId - Category id (or "fav" for the favourites section)
     * @param {string} zhName - Chinese category title
     * @param {Object[]} matched - Template objects to show in this category
     * @param {boolean} isFav - Whether this is the favourites section
     * @returns {string}
     */
    renderCategoryHtml(catId, zhName, matched, isFav) {
        const shown = this.openCat === catId;
        const anchor = "tplcat-" + catId;
        const editBtn = isFav ?
            `<button type="button" aria-label="编辑收藏" class="btn btn-warning bmd-btn-icon template-cat-edit-fav" id="recipe-templates-edit-fav" data-toggle="tooltip" title="编辑收藏"><i class="material-icons" aria-hidden="true">edit</i></button>` :
            "";
        return `<div class="panel category template-category" data-cat="${catId}">
            <a class="category-title" aria-expanded="${shown}">
                ${this.escapeHtml(zhName)}
                <span class="template-cat-count">${matched.length}</span>
                ${editBtn}
            </a>
            <div id="${anchor}" class="panel-collapse collapse ${shown ? " show" : ""}">
                <div class="template-grid">
                    ${matched.map(t => this.renderCard(t)).join("")}
                </div>
            </div>
        </div>`;
    }


    /**
     * Bilingual match: searches Chinese/English names, descriptions, the
     * operation chain (Chinese and English operation names) and the Chinese
     * keyword tags (t.tags, e.g. 凯撒 / Emotet / 取证).
     *
     * @param {Object} t - Template object
     * @param {string} q - Lowercased query string
     * @returns {boolean}
     */
    // 模板搜索匹配：检索范围 = 中/英文名、中/英文描述、操作链（官方操作名）与 tags 中文关键词，
    // 四类字段拼接成单个 haystack 后做不区分大小写的包含匹配；q 由调用方统一转小写
    matches(t, q) {
        const opChain = t.recipe.map(o => o.op).join(" ");
        const tags = Array.isArray(t.tags) ? t.tags.join(" ") : "";
        const haystack = [
            t.name.en, t.name.zh,
            t.description.en, t.description.zh,
            opChain,
            tags
        ].join(" ").toLowerCase();
        return haystack.includes(q);
    }


    /**
     * Builds the HTML card for a template: compact list item showing only
     * the Chinese name by default, with the favourite star on the same row
     * at the right side, a Bootstrap popover (official operation-info style,
     * no title line: top shows the Chinese introductory description, bottom
     * shows the Chinese operation chain), and HTML5 drag support so that
     * dragging the card onto the "收藏夹" category collects it as a
     * favourite.
     *
     * @param {Object} t - Template object
     * @returns {string}
     */
    renderCard(t) {
        const name = t.name.zh || t.name.en;
        const desc = t.description.zh || t.description.en;
        const ops = t.recipe.map(o => RecipeCompatibility.opNameToChinese(o.op)).join(" > ");
        const isFav = this.favs.includes(t.id);
        const content = `<div class="recipe-tpl-popover">
            <div class="template-tip-desc">${this.escapeHtml(desc)}</div>
            <div class="template-tip-ops">${this.escapeHtml(ops)}</div>
        </div>`;
        return `<div class="template-item" data-template-id="${this.escapeHtml(t.id)}" draggable="true"
                data-container="body" data-toggle="popover" data-placement="right" data-html="true"
                data-trigger="hover" data-boundary="viewport" role="button"
                data-content="${this.escapeHtml(content)}">
            <div class="template-item-row">
                <span class="template-item-name">${this.escapeHtml(name)}</span>
                <span class="template-item-fav${isFav ? " active" : ""}" data-fav-id="${this.escapeHtml(t.id)}" title="${isFav ? "取消收藏" : "收藏"}">
                    <i class="material-icons">${isFav ? "star" : "star_border"}</i>
                </span>
            </div>
        </div>`;
    }


    /**
     * Initialises Bootstrap popovers on template cards, mimicking the
     * official operation-list popover behaviour: popover is shown on
     * mouseenter (unless the mouse button is held down, e.g. dragging) and
     * can keep focus/scroll while hovered.
     */
    enablePopovers() {
        const el = document.getElementById("recipe-templates-list");
        if (!el) return;
        const self = this;
        $(el).find("[data-toggle=popover]")
            .popover({trigger: "manual"})
            .on("mouseenter", function(e) {
                if (e.buttons > 0 || self.dragTemplateId !== null) return;
                const _this = this;
                $(this).popover("show");
                $(".popover").on("mouseleave", function() {
                    $(_this).popover("hide");
                });
            })
            .on("mouseleave", function() {
                const _this = this;
                setTimeout(function() {
                    if ($(_this).data("bs.popover") &&
                        ($(_this).data("bs.popover").tip && !$($(_this).data("bs.popover").tip).is(":hover"))) {
                        $(_this).popover("hide");
                    }
                }, 50);
            });
    }


    /**
     * Binds HTML5 drag & drop events once (event delegation on the static
     * list container). Dragging a template card onto the "收藏夹" category
     * adds the template to favourites (official favourites-style interaction).
     */
    bindDragDrop() {
        if (this._dragBound) return;
        this._dragBound = true;
        const listEl = document.getElementById("recipe-templates-list");
        if (!listEl) return;
        const self = this;

        listEl.addEventListener("dragstart", function(e) {
            const itemEl = e.target.closest(".template-item");
            if (!itemEl) return;
            const id = itemEl.getAttribute("data-template-id");
            if (!id) return;
            self.dragTemplateId = id;
            try {
                e.dataTransfer.setData("text/plain", id);
                e.dataTransfer.effectAllowed = "copy";
            } catch (err) { /* ignore */ }
        });

        listEl.addEventListener("dragend", function() {
            self.dragTemplateId = null;
            self.clearDragOver();
        });

        listEl.addEventListener("dragover", function(e) {
            const catEl = e.target.closest(".template-category[data-cat='fav']");
            if (!catEl || self.dragTemplateId === null) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            catEl.classList.add("drag-over");
        });

        listEl.addEventListener("dragleave", function(e) {
            const catEl = e.target.closest(".template-category[data-cat='fav']");
            if (catEl && (!e.relatedTarget || !catEl.contains(e.relatedTarget))) {
                catEl.classList.remove("drag-over");
            }
        });

        listEl.addEventListener("drop", function(e) {
            const catEl = e.target.closest(".template-category[data-cat='fav']");
            if (!catEl || self.dragTemplateId === null) return;
            e.preventDefault();
            catEl.classList.remove("drag-over");
            const id = self.dragTemplateId;
            self.dragTemplateId = null;
            if (self.favs.includes(id)) return;
            self.favs.push(id);
            self.saveFavs();
            self.render();
        });
    }


    /**
     * Clears the drag-over highlight from all template categories.
     */
    clearDragOver() {
        const listEl = document.getElementById("recipe-templates-list");
        if (!listEl) return;
        listEl.querySelectorAll(".template-category.drag-over").forEach(el => {
            el.classList.remove("drag-over");
        });
    }


    /**
     * Handles search input.
     *
     * @param {Event} e
     */
    searchChange(e) {
        this.filter = e.target.value;
        this.render();
    }


    /**
     * Handles clicks inside the template list: category accordion toggling,
     * favourite star toggling, "restore default favourites" button, or
     * loading the clicked template.
     *
     * @param {Event} e
     */
    itemClick(e) {
        const favEl = e.target.closest(".template-item-fav");
        if (favEl) {
            e.stopPropagation();
            this.toggleFav(favEl.getAttribute("data-fav-id"));
            return;
        }

        const editFavEl = e.target.closest("#recipe-templates-edit-fav");
        if (editFavEl) {
            e.stopPropagation();
            this.openFavManager();
            return;
        }

        const titleEl = e.target.closest(".category-title");
        if (titleEl) {
            const catEl = titleEl.closest(".template-category");
            const catId = catEl.getAttribute("data-cat");
            // Accordion: only one category expanded at a time; clicking the
            // expanded one collapses it.
            this.openCat = (this.openCat === catId) ? null : catId;
            this.render();
            return;
        }

        const itemEl = e.target.closest(".template-item");
        if (!itemEl) return;
        const id = itemEl.getAttribute("data-template-id");
        const template = this.templates.find(t => t.id === id);
        if (!template) return;

        this.app.setRecipeConfig(template.recipe);
        this.app.autoBake();
        $("#recipe-templates-modal").modal("hide");
    }


    /**
     * Escapes a string for safe HTML injection.
     *
     * @param {string} str
     * @returns {string}
     */
    escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

}

export default RecipeTemplatesWaiter;
