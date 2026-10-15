/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

// Styles
import "./stylesheets/index.js";

// Libs
import "arrive";
import "snackbarjs";
import "bootstrap-material-design/js/index";
import "bootstrap-colorpicker";
import moment from "moment-timezone";
import * as CanvasComponents from "../core/lib/CanvasComponents.mjs";

// CyberChef
import App from "./App.mjs";
import Categories from "../core/config/Categories.json" with { type: "json" };
import OperationConfig from "../core/config/OperationConfig.json" with { type: "json" };
import HiddenOperations from "../core/zh-cn/HiddenOperations.json" with { type: "json" };


/**
 * Main function used to build the CyberChef web app.
 */
function main() {
    const defaultFavourites = [
        "转为 Base64",
        "解码 Base64",
        "转为 Hex",
        "解码 Hex",
        "转为 Hexdump",
        "解码 Hexdump",
        "URL 解码",
        "正则表达式",
        "信息熵",
        "分支",
        "Magic 检测"
    ];

    const defaultOptions = {
        updateUrl:           true,
        showHighlighter:     true,
        wordWrap:            true,
        showErrors:          true,
        errorTimeout:        4000,
        attemptHighlight:    true,
        theme:               "classic",
        useMetaKey:          false,
        logLevel:            "info",
        autoMagic:           true,
        imagePreview:        true,
        syncTabs:            true,
        showCatCount:        false,
        recipeLanguage:      "en",
        // zh-cn 扩展：主题系统（跟随系统 / 固定浅深 / 自定义配色）
        themeMode:           "light",
        lightScheme:         "classic",
        darkScheme:          "classic-dark",
        customSchemes:       [],
        // zh-cn 扩展：不常用操作折叠隐藏（默认隐藏名单来自 HiddenOperations.json，可编辑）
        showAllOps:          false,
        hiddenOps:           HiddenOperations.hidden,
    };

    document.removeEventListener("DOMContentLoaded", main, false);
    window.app = new App(Categories, OperationConfig, defaultFavourites, defaultOptions);
    window.app.setup();
}

window.compileTime = moment.tz(COMPILE_TIME, "DD/MM/YYYY HH:mm:ss z", "UTC").valueOf();
window.compileMessage = COMPILE_MSG;

// Make libs available to operation outputs
window.CanvasComponents = CanvasComponents;

document.addEventListener("DOMContentLoaded", main, false);

