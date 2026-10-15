/**
 * zh-cn 主题包定义
 *
 * 每个主题包（ThemePack）含一套浅色配色与一套深色配色：
 *   - light/dark 可相同（官方单色方案即如此）
 *   - scheme 的 id 即 :root 上的 class 名（changeTheme 会设置 :root.className）
 *
 * 内置主题包在前，官方原有方案（classic/dark/geocities/solarizedDark/
 * solarizedLight）作为单色方案排在内置列表末尾。
 *
 * 用户自定义主题（customSchemes）不在此文件，存于 options 的
 * customSchemes 字段，格式与内置 scheme 兼容：{id, name, vars}，
 * vars 为 {--css-var: value} 映射，由主题运行时注入 <style>。
 *
 * @license Apache-2.0
 */

/**
 * 内置配色方案（CSS class id + 显示名）
 */
const BUILTIN_SCHEMES = [
    { id: "classic", name: "经典" },
    { id: "classic-dark", name: "经典深色" },
    { id: "rose-light", name: "蔷薇粉（浅）" },
    { id: "rose-dark", name: "蔷薇粉（深）" },
    { id: "teal-light", name: "薄荷青（浅）" },
    { id: "teal-dark", name: "薄荷青（深）" },
    { id: "slate-light", name: "雾灰蓝（浅）" },
    { id: "slate-dark", name: "雾灰蓝（深）" },
    { id: "gold-light", name: "鎏金黄（浅）" },
    { id: "gold-dark", name: "鎏金黄（深）" },
    { id: "lime-light", name: "青柠绿（浅）" },
    { id: "lime-dark", name: "青柠绿（深）" },
    { id: "sky-light", name: "晴空蓝（浅）" },
    { id: "sky-dark", name: "晴空蓝（深）" },
    { id: "marine-light", name: "海洋蓝（浅）" },
    { id: "marine-dark", name: "海洋蓝（深）" },
    { id: "violet-light", name: "紫罗兰（浅）" },
    { id: "violet-dark", name: "紫罗兰（深）" },
    { id: "ember-light", name: "阳光橙（浅）" },
    { id: "ember-dark", name: "阳光橙（深）" },
    { id: "catppuccin-light", name: "Catppuccin（浅）" },
    { id: "catppuccin-dark", name: "Catppuccin（深）" },
    { id: "nord-light", name: "Nord（浅）" },
    { id: "nord-dark", name: "Nord（深）" },
    { id: "dracula-light", name: "Dracula（浅）" },
    { id: "dracula-dark", name: "Dracula（深）" },
    { id: "tokyonight-light", name: "Tokyo Night（浅）" },
    { id: "tokyonight-dark", name: "Tokyo Night（深）" }
];

/**
 * 内置主题包（配色方案组合）
 * 顺序：classic 在最前，内置 zh 方案随后；4 套开源方案
 * （Catppuccin / Nord / Dracula / Tokyo Night）置于阳光橙（ember）之后、
 * 官方方案（official-*）之前，官方原方案垫底。
 */
const BUILTIN_THEME_PACKS = [
    { id: "classic", name: "经典", light: "classic", dark: "classic-dark" },
    { id: "rose", name: "蔷薇粉", light: "rose-light", dark: "rose-dark" },
    { id: "teal", name: "薄荷青", light: "teal-light", dark: "teal-dark" },
    { id: "slate", name: "雾灰蓝", light: "slate-light", dark: "slate-dark" },
    { id: "gold", name: "鎏金黄", light: "gold-light", dark: "gold-dark" },
    { id: "lime", name: "青柠绿", light: "lime-light", dark: "lime-dark" },
    { id: "sky", name: "晴空蓝", light: "sky-light", dark: "sky-dark" },
    { id: "marine", name: "海洋蓝", light: "marine-light", dark: "marine-dark" },
    { id: "violet", name: "紫罗兰", light: "violet-light", dark: "violet-dark" },
    { id: "ember", name: "阳光橙", light: "ember-light", dark: "ember-dark" },
    { id: "catppuccin", name: "Catppuccin", light: "catppuccin-light", dark: "catppuccin-dark" },
    { id: "nord", name: "Nord", light: "nord-light", dark: "nord-dark" },
    { id: "dracula", name: "Dracula", light: "dracula-light", dark: "dracula-dark" },
    { id: "tokyonight", name: "Tokyo Night", light: "tokyonight-light", dark: "tokyonight-dark" }
];

/**
 * 官方原有方案（单色，浅深相同，排在内置列表之后）
 */
const OFFICIAL_THEME_PACKS = [
    { id: "official-classic", name: "官方 · 经典", light: "classic", dark: "classic" },
    { id: "official-dark", name: "官方 · 深色", light: "dark", dark: "dark" },
    { id: "official-geocities", name: "官方 · GeoCities", light: "geocities", dark: "geocities" },
    { id: "official-solarizedDark", name: "官方 · Solarized 深色", light: "solarizedDark", dark: "solarizedDark" },
    { id: "official-solarizedLight", name: "官方 · Solarized 浅色", light: "solarizedLight", dark: "solarizedLight" }
];

/**
 * 全部主题包：内置在前，官方垫底
 */
const ALL_THEME_PACKS = BUILTIN_THEME_PACKS.concat(OFFICIAL_THEME_PACKS);

/**
 * 由主题包 id 查主题包
 */
function getThemePackById(id) {
    return ALL_THEME_PACKS.find(tp => tp.id === id) || null;
}

/**
 * 由配色 scheme id 查显示名（内置方案或自定义方案）
 * @param {string} schemeId scheme id（CSS class 名）
 * @param {Array} customSchemes 自定义主题列表（可缺省）
 */
function getSchemeName(schemeId, customSchemes) {
    if (!schemeId) return "";
    const builtin = BUILTIN_SCHEMES.find(s => s.id === schemeId);
    if (builtin) return builtin.name;
    if (customSchemes && customSchemes.length) {
        const custom = customSchemes.find(s => s.id === schemeId);
        if (custom) return custom.name;
    }
    return schemeId;
}

export {
    BUILTIN_SCHEMES,
    BUILTIN_THEME_PACKS,
    OFFICIAL_THEME_PACKS,
    ALL_THEME_PACKS,
    getThemePackById,
    getSchemeName
};
