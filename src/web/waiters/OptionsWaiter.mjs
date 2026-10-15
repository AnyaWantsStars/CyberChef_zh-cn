/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import { ALL_THEME_PACKS, getThemePackById } from "../themes/ThemePacks.mjs";
import { ZH_BUILTIN_VARS, ZH_BUILTIN_KEYS } from "../themes/ZhBuiltinThemes.mjs";

/**
 * 自定义主题「精简填写」模式下的关键色字段（浅色/深色各一套）。
 * 用户只需提供 3 个关键色，其余整套 CSS 变量由 deriveVars() 自动派生
 * （选中高亮色不再作为关键色，由主色按明度阶梯自动派生，高级 JSON 区仍可手工改）。
 */
const CUSTOM_KEY_FIELDS = [
    { name: "primary", label: "主色调", hint: "按钮与链接" },
    { name: "background", label: "背景色", hint: "页面底色" },
    { name: "foreground", label: "文字色", hint: "正文" }
];

/**
 * 关键色 → 直接对应的 CSS 变量名（用于「高级 JSON 优先」保存时，
 * 表单关键色仅覆盖同名基准变量，其余高级定制变量保留）。
 * 三个关键色均映射到 UI 中真实被引用的可见变量：
 * - primary    → 主操作按钮背景（_overrides.css 引用 --btn-success-bg-colour）
 * - background → 页面主体背景（IO / 弹窗通用背景）
 * - foreground → 正文文字（正文 / 标题 / 控件文字）
 * 选中高亮（--selected-operation-bg-colour 等）不再映射关键色，
 * 由 deriveVars 依主色明度自动派生（背景同主色系、文字同主色系深浅对比色，
 * 不固定黄调），边框以官方设计模式为基准（官方关键色保护 + 差异联动）；
 * 高级 JSON 区仍保留全量变量可手工改。
 */
const KEY_VAR_MAP = {
    primary: "--btn-success-bg-colour",
    background: "--primary-background-colour",
    foreground: "--primary-font-colour"
};

/**
 * 可派生/可回填的完整 CSS 变量名清单（与 _zh-theme-extra.css 及
 * deriveVars() 输出一致；新建时用于从当前生效主题回填完整字段）。
 */
const CUSTOM_VAR_NAMES = [
    "--primary-font-colour", "--subtext-font-colour",
    "--primary-background-colour", "--secondary-background-colour",
    "--primary-border-colour", "--secondary-border-colour",
    "--title-colour", "--title-background-colour",
    "--banner-font-colour", "--banner-bg-colour", "--banner-url-colour",
    "--banner-focus-bg-colour",
    "--category-list-font-colour",
    "--op-list-operation-font-colour", "--op-list-operation-bg-colour", "--op-list-operation-border-colour",
    "--rec-list-operation-font-colour", "--rec-list-operation-bg-colour", "--rec-list-operation-border-colour",
    "--selected-operation-font-color", "--selected-operation-bg-colour", "--selected-operation-border-colour",
    "--breakpoint-font-colour", "--breakpoint-bg-colour", "--breakpoint-border-colour",
    "--disabled-font-colour", "--disabled-bg-colour", "--disabled-border-colour",
    "--fc-operation-font-colour", "--fc-operation-bg-colour", "--fc-operation-border-colour",
    "--fc-breakpoint-operation-font-colour", "--fc-breakpoint-operation-bg-colour", "--fc-breakpoint-operation-border-colour",
    "--arg-font-colour", "--arg-background", "--arg-border-colour", "--arg-disabled-background", "--arg-label-colour",
    "--disable-icon-colour", "--disable-icon-selected-colour",
    "--btn-default-font-colour", "--btn-default-bg-colour", "--btn-default-border-colour",
    "--btn-default-hover-font-colour", "--btn-default-hover-bg-colour", "--btn-default-hover-border-colour",
    "--btn-success-font-colour", "--btn-success-bg-colour", "--btn-success-border-colour",
    "--btn-success-hover-font-colour", "--btn-success-hover-bg-colour", "--btn-success-hover-border-colour",
    "--scrollbar-track", "--scrollbar-thumb", "--scrollbar-hover",
    "--drop-file-border-colour", "--table-border-colour",
    "--popover-background", "--popover-border-colour",
    "--code-background", "--code-font-colour",
    "--input-highlight-colour", "--input-border-colour",
    "--io-status-bar-bg-colour", "--io-status-bar-hover-bg-colour", "--io-status-bar-border-colour",
    "--io-error-colour", "--op-icon-danger-colour",
    "--modals-link-focus-colour",
    "--json-dict-border-colour", "--json-summary-colour", "--json-summary-hover-colour",
    // —— 官方通用项（21）：字体排版 10 / Loader 4 / Highlighter 5 / 断点图标 2 ——
    "--primary-font-family", "--primary-font-size", "--primary-line-height",
    "--fixed-width-font-family", "--fixed-width-font-colour", "--fixed-width-font-size",
    "--subtext-font-size", "--title-size", "--title-weight", "--op-title-font-weight",
    "--loader-background-colour", "--loader-inner-colour", "--loader-middle-colour", "--loader-outer-colour",
    "--hl1", "--hl2", "--hl3", "--hl4", "--hl5",
    "--breakpoint-icon-colour", "--breakpoint-icon-selected-colour"
];

/**
 * 官方通用变量的兜底值（字体排版 / Loader / Highlighter）。
 * deriveVars 已覆盖全部 94 键（含本表 19 项），此处仅作最后保险：
 * 仅在 deriveVars 因异常未产出某键时生效，保证补全后 JSON 区全量不缺失。
 */
const CUSTOM_VAR_DEFAULTS = {
    "--primary-font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    "--primary-font-size": "14px",
    "--primary-line-height": "20px",
    "--fixed-width-font-family": "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    "--fixed-width-font-colour": "inherit",
    "--fixed-width-font-size": "inherit",
    "--subtext-font-size": "13px",
    "--title-size": "16px",
    "--title-weight": "bold",
    "--op-title-font-weight": "bold",
    "--loader-background-colour": "var(--secondary-border-colour)",
    "--loader-inner-colour": "#f9c922",
    "--loader-middle-colour": "#e74c3c",
    "--loader-outer-colour": "#3498db",
    "--hl1": "#ffee00aa",
    "--hl2": "#95dfffaa",
    "--hl3": "#ffb6b6aa",
    "--hl4": "#fcf8e3aa",
    "--hl5": "#8de768aa"
};

/**
 * 内置主题（官方 5 套 + 汉化/开源 27 套，共 32 套配色变体）的 3 个关键色静态表。
 * 用于 getPackLightDarkVars：CSSOM 解析受跨域 / 样式表未就绪影响时，
 * 表单浅/深列关键色仍能回填到该主题包的 light/dark 实际值（根治
 * “深色 = 浅色”的解析回退隐患）。仅影响关键色回填，其余变量仍走 CSSOM。
 */
const BUILTIN_SCHEME_KEYS = {
    "classic":        { primary: "#5cb85c", background: "#ffffff", foreground: "#333333" },
    "dark":           { primary: "#073655", background: "#1e1e1e", foreground: "#c5c5c5" },
    "geocities":      { primary: "#7cfc00", background: "#0000ff", foreground: "#000000" },
    "solarizedDark":  { primary: "#002b36", background: "#002b36", foreground: "#839496" },
    "solarizedLight": { primary: "#fdf6e3", background: "#fdf6e3", foreground: "#657b83" },
    "classic-dark":   { primary: "#33691e", background: "#1b201b", foreground: "#d8e6d8" },
    "marine-light":   { primary: "#1565c0", background: "#f4f8fd", foreground: "#263238" },
    "marine-dark":    { primary: "#1976d2", background: "#101c30", foreground: "#cfe0f2" },
    "violet-light":   { primary: "#8e24aa", background: "#faf6fd", foreground: "#2b2440" },
    "violet-dark":    { primary: "#8e24aa", background: "#1d1230", foreground: "#d8c6ec" },
    "ember-light":    { primary: "#bf360c", background: "#fffaf3", foreground: "#3a2b1e" },
    "ember-dark":     { primary: "#bf360c", background: "#251a10", foreground: "#f0dcc2" },
    "rose-light":     { primary: "#d81b60", background: "#fff7f9", foreground: "#4a2530" },
    "rose-dark":      { primary: "#d81b60", background: "#2a1219", foreground: "#f2cdd6" },
    "teal-light":     { primary: "#00796b", background: "#f3faf8", foreground: "#1f3a35" },
    "teal-dark":      { primary: "#00796b", background: "#0f2b26", foreground: "#c2e8e0" },
    "slate-light":    { primary: "#546e7a", background: "#f6f8fa", foreground: "#263238" },
    "slate-dark":     { primary: "#546e7a", background: "#1a232b", foreground: "#cfd8dc" },
    "gold-light":     { primary: "#c49a2e", background: "#fffcf4", foreground: "#3d3020" },
    "gold-dark":      { primary: "#c49a2e", background: "#2e2412", foreground: "#f0e2bc" },
    "lime-light":     { primary: "#33691e", background: "#fbfdf4", foreground: "#2f3a1e" },
    "lime-dark":      { primary: "#33691e", background: "#1f2a0e", foreground: "#dce8be" },
    "sky-light":      { primary: "#01579b", background: "#f4f9ff", foreground: "#1e3a5c" },
    "sky-dark":       { primary: "#01579b", background: "#0c2736", foreground: "#c5ddf3" },
    "catppuccin-dark":  { primary: "#89b4fa", background: "#1e1e2e", foreground: "#cdd6f4" },
    "catppuccin-light": { primary: "#1e66f5", background: "#eff1f5", foreground: "#4c4f69" },
    "nord-dark":        { primary: "#5e81ac", background: "#2e3440", foreground: "#d8dee9" },
    "nord-light":       { primary: "#5e81ac", background: "#e5e9f0", foreground: "#2e3440" },
    "dracula-dark":     { primary: "#bd93f9", background: "#282a36", foreground: "#f8f8f2" },
    "dracula-light":    { primary: "#bd93f9", background: "#f8f8f2", foreground: "#44475a" },
    "tokyonight-dark":  { primary: "#7aa2f7", background: "#1a1b26", foreground: "#c0caf5" },
    "tokyonight-light": { primary: "#34548a", background: "#e1e2e7", foreground: "#343b58" }
};

/* ==================== 内置方案克隆（关键色命中 → 完整变量） ==================== */

/**
 * 关键色归一化（hex 展开为 #rrggbb 小写；rgb()/hsl()/命名色原样小写）。
 */
function normKeyColor(v) {
    const s = String(v || "").trim().toLowerCase();
    const m3 = s.match(/^#([0-9a-f]{3})$/);
    if (m3) {
        const h = m3[1];
        return "#" + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (/^#[0-9a-f]{6}$/.test(s)) return s;
    return s;
}

/**
 * 3 关键色命中内置方案检测：归一化后与内置静态关键色表（ZH_BUILTIN_KEYS）
 * 完全一致时返回该内置 schemeId，否则 null。
 * （3 色唯一性已验证：32 套内置方案 primary/background/foreground 三元组无冲突，
 * 降级后仍可精确匹配。）
 */
function matchBuiltinScheme(keys) {
    if (!keys || !keys.primary || !keys.background || !keys.foreground) return null;
    const k = {
        primary: normKeyColor(keys.primary),
        background: normKeyColor(keys.background),
        foreground: normKeyColor(keys.foreground)
    };
    for (const [sid, bk] of Object.entries(ZH_BUILTIN_KEYS)) {
        if (bk.primary === k.primary && bk.background === k.background &&
            bk.foreground === k.foreground) {
            return sid;
        }
    }
    return null;
}

/**
 * 关键色命中内置方案 → 返回该内置方案完整变量（CUSTOM_VAR_NAMES 全量，
 * var() 引用已解析为具体色值）。未命中返回 null，由调用方回退 deriveVars。
 *
 * @param {Object} keys 3 关键色
 * @param {"light"|"dark"} mode 派生方向（与方案明暗不一致时拒绝克隆）
 * @returns {Object<string,string>|null}
 */
function builtinCloneVars(keys, mode) {
    const sid = matchBuiltinScheme(keys);
    if (!sid) return null;
    const meta = ZH_BUILTIN_KEYS[sid];
    if (meta && meta.mode !== mode) return null;
    const vars = ZH_BUILTIN_VARS[sid];
    return vars ? Object.assign({}, vars) : null;
}

/* ==================== 颜色工具（模块级，纯函数） ==================== */

/** #rgb / #rrggbb → {r,g,b}（0-255）；rgb()/hsl()/常见命名色也尽力解析；失败返回 null */
function parseColorToRgb(value) {
    const v = String(value || "").trim().toLowerCase();
    let m;
    if ((m = v.match(/^#([0-9a-f]{3})$/))) {
        const s = m[1];
        return { r: parseInt(s[0] + s[0], 16), g: parseInt(s[1] + s[1], 16), b: parseInt(s[2] + s[2], 16) };
    }
    if ((m = v.match(/^#([0-9a-f]{6})$/))) {
        return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4, 6), 16) };
    }
    if ((m = v.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/))) {
        return { r: +m[1], g: +m[2], b: +m[3] };
    }
    if ((m = v.match(/^rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(,\s*[\d.]+\s*)?\)$/))) {
        const nums = v.match(/[\d.]+/g).map(Number);
        return { r: nums[0], g: nums[1], b: nums[2] };
    }
    if ((m = v.match(/^hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/))) {
        return hslToRgb(+m[1], +m[2] / 100, +m[3] / 100);
    }
    const NAMED = {
        black: "#000000", white: "#ffffff", red: "#ff0000", green: "#008000",
        blue: "#0000ff", yellow: "#ffff00", cyan: "#00ffff", magenta: "#ff00ff",
        gray: "#808080", grey: "#808080", orange: "#ffa500", purple: "#800080",
        pink: "#ffc0cb", brown: "#a52a2a", silver: "#c0c0c0", navy: "#000080",
        teal: "#008080", lime: "#00ff00", maroon: "#800000", olive: "#808000"
    };
    if (NAMED[v]) return parseColorToRgb(NAMED[v]);
    return null;
}

/** hsl → {r,g,b}（h 0-360, s/l 0-1） */
function hslToRgb(h, s, l) {
    const hue = ((h % 360) + 360) % 360 / 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((hue * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (hue < 1 / 6) {
        r = c; g = x;
    } else if (hue < 2 / 6) {
        r = x; g = c;
    } else if (hue < 3 / 6) {
        g = c; b = x;
    } else if (hue < 4 / 6) {
        g = x; b = c;
    } else if (hue < 5 / 6) {
        r = x; b = c;
    } else {
        r = c; b = x;
    }
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}

/** rgb 分量 → #rrggbb（自动钳位 0-255 并取整） */
function rgbToHex(r, g, b) {
    const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
    const h = (n) => clamp(n).toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
}

/** 混合两种颜色：t=0 全取 c1，t=1 全取 c2 */
function mix(c1, c2, t) {
    const a = parseColorToRgb(c1);
    const b = parseColorToRgb(c2);
    if (!a || !b) return null;
    const k = Math.max(0, Math.min(1, t));
    return rgbToHex(a.r + (b.r - a.r) * k, a.g + (b.g - a.g) * k, a.b + (b.b - a.b) * k);
}

/** 向黑混合 t（0-1）：加深 */
function shade(c, t) {
    return mix(c, "#000000", t);
}

/** 向白混合 t（0-1）：提亮 */
function tint(c, t) {
    return mix(c, "#ffffff", t);
}

/** WCAG 相对亮度（0-1） */
function relativeLuminance(color) {
    const rgb = parseColorToRgb(color);
    if (!rgb) return 0;
    const lin = (n) => {
        const s = n / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

/** 依据背景亮度选择对比文字（白或黑） */
/** HSL 明度调整：保留色相 / 饱和度，仅移动明度档位（deltaL ∈ -1..1），返回 #rrggbb；解析失败返回 null */
function adjustLightness(color, deltaL) {
    const rgb = parseColorToRgb(color);
    if (!rgb) return null;
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
            case g: h = ((b - r) / d + 2) * 60; break;
            default: h = ((r - g) / d + 4) * 60;
        }
    }
    l = Math.max(0, Math.min(1, l + deltaL));
    const out = hslToRgb(h, s, l);
    return rgbToHex(out.r, out.g, out.b);
}

/** WCAG 对比度（1-21） */
function contrastRatio(c1, c2) {
    const L1 = relativeLuminance(c1), L2 = relativeLuminance(c2);
    const hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
}

/** 任意颜色 → CIE Lab（D65 参考白，用于 deltaE 色差计算）；解析失败返回 null */
function rgbToLab(color) {
    const rgb = parseColorToRgb(color);
    if (!rgb) return null;
    let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    const X = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    const Y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    const Z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fx = f(X), fy = f(Y), fz = f(Z);
    return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** CIEDE2000 色差 deltaE00（0-100+，接近人眼感知；阈值建议：<4 难以分辨、>=4 容易分辨）；解析失败返回 0 */
function colourDeltaE(c1, c2) {
    const l1 = rgbToLab(c1), l2 = rgbToLab(c2);
    if (!l1 || !l2) return 0;
    return ciede2000(l1, l2);
}

/** CIEDE2000 标准公式（输入 Lab 对象 {L,a,b}） */
function ciede2000(x, y) {
    const rad = (deg) => (deg * Math.PI) / 180;
    const deg = (rad) => (rad * 180) / Math.PI;
    const { L: L1, a: a1, b: b1 } = x;
    const { L: L2, a: a2, b: b2 } = y;
    const C1 = Math.sqrt(a1 * a1 + b1 * b1);
    const C2 = Math.sqrt(a2 * a2 + b2 * b2);
    const Cbar = (C1 + C2) / 2;
    const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));
    const a1p = (1 + G) * a1;
    const a2p = (1 + G) * a2;
    const C1p = Math.sqrt(a1p * a1p + b1 * b1);
    const C2p = Math.sqrt(a2p * a2p + b2 * b2);
    const h1p = (C1p === 0) ? 0 : (deg(Math.atan2(b1, a1p)) + 360) % 360;
    const h2p = (C2p === 0) ? 0 : (deg(Math.atan2(b2, a2p)) + 360) % 360;
    const dLp = L2 - L1;
    const dCp = C2p - C1p;
    let dhp = 0;
    if (C1p * C2p !== 0) {
        dhp = h2p - h1p;
        if (dhp > 180) dhp -= 360;
        else if (dhp < -180) dhp += 360;
    }
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp) / 2);
    const Lbarp = (L1 + L2) / 2;
    const Cbarp = (C1p + C2p) / 2;
    let hbarp = (h1p + h2p) / 2;
    if (C1p * C2p !== 0) {
        if (Math.abs(h1p - h2p) > 180) {
            if (h1p + h2p < 360) hbarp = (h1p + h2p + 360) / 2;
            else hbarp = (h1p + h2p - 360) / 2;
        }
    }
    const T = 1 - 0.17 * Math.cos(rad(hbarp - 30)) + 0.24 * Math.cos(rad(2 * hbarp)) +
        0.32 * Math.cos(rad(3 * hbarp + 6)) - 0.20 * Math.cos(rad(4 * hbarp - 63));
    const dtheta = 30 * Math.exp(-Math.pow((hbarp - 275) / 25, 2));
    const RC = 2 * Math.sqrt(Math.pow(Cbarp, 7) / (Math.pow(Cbarp, 7) + Math.pow(25, 7)));
    const SL = 1 + 0.015 * Math.pow(Lbarp - 50, 2) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2));
    const SC = 1 + 0.045 * Cbarp;
    const SH = 1 + 0.015 * Cbarp * T;
    const RT = -Math.sin(rad(2 * dtheta)) * RC;
    const dL = dLp / SL, dC = dCp / SC, dH = dHp / SH;
    return Math.sqrt(dL * dL + dC * dC + dH * dH + RT * dC * dH);
}

/**
 * 选中高亮下边框动态算法：边框强度由「选中高亮色 vs 未选中操作项实际外观」
 * 的视觉差异（CIE76 deltaE + WCAG 对比度双判据）动态决定。
 *
 * 参照对象：未选中操作项外观色（操作项文字色 / 默认背景色），取感知差异最大
 * 者作为参照——只比操作项背景时，marine 等部分高亮与未选中项的实际感知差异
 * 会被低估。
 *
 * - 差异大（deltaE >= 60 或对比度 >= 4.5，WCAG AA 正文标准）：颜色本身已足够
 *   区分，边框弱化（transparent）。预期大部分方案走此分支（高亮与未选中项
 *   外观差异大，如 marine 高亮 vs 未选中项），仅少数真正接近者保留边框。
 * - 差异小：需边框辅助区分，返回与高亮色形成可见对比的颜色
 *   （亮高亮用深边框、暗高亮用浅边框，逐档加深/提亮直到与高亮色对比 >= 2.0）。
 * - 颜色解析失败时回退既有静态规则（dark #86733f / light #b8860b），保证派生链路不断。
 *
 * @param {string} selBg 选中高亮背景色（--selected-operation-bg-colour）
 * @param {string} opFont 未选中操作项文字色（--op-list-operation-font-colour）
 * @param {string} opBg 未选中操作项默认背景色（--op-list-operation-bg-colour）
 * @param {"light"|"dark"} mode 派生方向（回退用）
 * @returns {string} --selected-operation-border-colour 取值
 */
function computeSelectedBorderColour(selBg, opFont, opBg, mode, keys) {
    if (!parseColorToRgb(selBg)) {
        return mode === "dark" ? "#86733f" : "#b8860b";
    }
    // 官方 5 套关键色保护：命中即返回官方原始设计边框，算法不覆盖官方设计
    if (keys) {
        const OFFICIAL_BORDER = {
            "classic": "#fbeed5",
            "dark": "#444",
            "geocities": "blue",
            "solarizedDark": "#586e75",
            "solarizedLight": "#93a1a1"
        };
        const OFFICIAL_KEYS = {
            "classic": { primary: "#5cb85c", background: "#ffffff", foreground: "#333333" },
            "dark": { primary: "#073655", background: "#1e1e1e", foreground: "#c5c5c5" },
            "geocities": { primary: "#7cfc00", background: "#0000ff", foreground: "#000000" },
            "solarizedDark": { primary: "#002b36", background: "#002b36", foreground: "#839496" },
            "solarizedLight": { primary: "#fdf6e3", background: "#fdf6e3", foreground: "#657b83" }
        };
        for (const name of Object.keys(OFFICIAL_KEYS)) {
            const k = OFFICIAL_KEYS[name];
            if (keys.primary === k.primary && keys.background === k.background && keys.foreground === k.foreground) {
                return OFFICIAL_BORDER[name];
            }
        }
        // zh 三字色系 18 套设计保护：按「人眼感知判定」生成——选中高亮 vs 相邻未选中背景
        // 难分辨（CIEDE2000 ΔE<4 且 对比<1.6）的 6 套浅色方案需要搭调边框；
        // 其余 12 套容易分辨（ΔE>=4 或 对比>=1.6）不显示边框（transparent）。
        // 命中即返回该套设计边框值，保证「用三字色系关键色派生即完全复现其设计（含边框有无）」。
        const TRICOLOR_BORDER = {
            "rose-light": "#e87aa2", "rose-dark": "transparent",
            "teal-light": "#62ada4", "teal-dark": "transparent",
            "slate-light": "#94a5ac", "slate-dark": "transparent",
            "gold-light": "transparent", "gold-dark": "transparent",
            "lime-light": "transparent", "lime-dark": "transparent",
            "sky-light": "#73a3c8", "sky-dark": "transparent",
            "marine-light": "#73a3d9", "marine-dark": "transparent",
            "violet-light": "#c289d1", "violet-dark": "transparent",
            "ember-light": "transparent", "ember-dark": "transparent"
        };
        const TRICOLOR_KEYS = {
            "rose-light": { primary: "#d81b60", background: "#fff7f9", foreground: "#4a2530" },
            "rose-dark": { primary: "#d81b60", background: "#2a1219", foreground: "#f2cdd6" },
            "teal-light": { primary: "#00796b", background: "#f3faf8", foreground: "#1f3a35" },
            "teal-dark": { primary: "#00796b", background: "#0f2b26", foreground: "#c2e8e0" },
            "slate-light": { primary: "#546e7a", background: "#f6f8fa", foreground: "#263238" },
            "slate-dark": { primary: "#546e7a", background: "#1a232b", foreground: "#cfd8dc" },
            "gold-light": { primary: "#c49a2e", background: "#fffcf4", foreground: "#3d3020" },
            "gold-dark": { primary: "#c49a2e", background: "#2e2412", foreground: "#f0e2bc" },
            "lime-light": { primary: "#33691e", background: "#fbfdf4", foreground: "#2f3a1e" },
            "lime-dark": { primary: "#33691e", background: "#1f2a0e", foreground: "#dce8be" },
            "sky-light": { primary: "#01579b", background: "#f4f9ff", foreground: "#1e3a5c" },
            "sky-dark": { primary: "#01579b", background: "#0c2736", foreground: "#c5ddf3" },
            "marine-light": { primary: "#1565c0", background: "#f4f8fd", foreground: "#263238" },
            "marine-dark": { primary: "#1976d2", background: "#101c30", foreground: "#cfe0f2" },
            "violet-light": { primary: "#8e24aa", background: "#faf6fd", foreground: "#2b2440" },
            "violet-dark": { primary: "#8e24aa", background: "#1d1230", foreground: "#d8c6ec" },
            "ember-light": { primary: "#bf360c", background: "#fffaf3", foreground: "#3a2b1e" },
            "ember-dark": { primary: "#bf360c", background: "#251a10", foreground: "#f0dcc2" }
        };
        for (const name of Object.keys(TRICOLOR_KEYS)) {
            const k = TRICOLOR_KEYS[name];
            if (keys.primary === k.primary && keys.background === k.background && keys.foreground === k.foreground) {
                return TRICOLOR_BORDER[name];
            }
        }
    }
    // 参照 = 相邻未选中操作项背景（选中高亮背景 vs 未选中操作项背景）。
    // 背景不可解析时回退到未选中文字色；以感知差异更小的参照为准（更保守：宁要边框不模糊）。
    let minDiff = Infinity, minContr = Infinity;
    const refs = [];
    if (parseColorToRgb(opBg)) refs.push(opBg);
    if (refs.length === 0 && parseColorToRgb(opFont)) refs.push(opFont);
    for (const ref of refs) {
        const de = colourDeltaE(selBg, ref);
        const cr = contrastRatio(selBg, ref);
        if (de < minDiff) minDiff = de;
        if (cr < minContr) minContr = cr;
    }
    // 容易分辨（CIEDE2000 ΔE>=4 或 对比>=1.6）→ 不需要边框，直接透明
    if (minDiff >= 4 || minContr >= 1.6) return "transparent";
    // 难分辨 → 需要边框：生成与高亮色同色相搭调的边框色，
    // 逐档加深/提亮直到与高亮色对比足够（CIEDE2000 ΔE>=10 或 对比>=2.0）
    const selLum = relativeLuminance(selBg);
    let border = null;
    if (selLum >= 0.40) {
        for (let n = 1; n <= 20; n++) {
            border = shade(selBg, 0.05 * n);
            if (colourDeltaE(border, selBg) >= 10 || contrastRatio(border, selBg) >= 2.0) break;
        }
    } else {
        for (let n = 1; n <= 20; n++) {
            border = tint(selBg, 0.05 * n);
            if (colourDeltaE(border, selBg) >= 10 || contrastRatio(border, selBg) >= 2.0) break;
        }
    }
    return border || (mode === "dark" ? "#86733f" : "#b8860b");
}

/**
 * 前景对比度自检 nudge：前景对背景对比不足 target 时，沿「提高对比」方向逐档移动
 * 前景明度（比背景亮则更亮、比背景暗则更暗；与参考几乎同亮时沿模式反方向逃生），
 * 最多 maxNudge 次；返回 {color, nudged}。
 * @param {"light"|"dark"} mode
 */
function nudgeForeground(fg, bg, target, mode, maxNudge = 10) {
    let cur = fg, n = 0;
    const step = mode === "dark" ? 0.05 : -0.05;
    const dir = () => {
        const Lf = relativeLuminance(cur), Lb = relativeLuminance(bg);
        if (Math.abs(Lf - Lb) < 0.02) return Lb < 0.5 ? Math.abs(step) : -Math.abs(step); // 同亮：背景暗则提亮、亮则加深
        return Lf > Lb ? Math.abs(step) : -Math.abs(step);
    };
    while (contrastRatio(cur, bg) < target && n < maxNudge) {
        const next = adjustLightness(cur, dir());
        if (!next || next === cur) break;
        cur = next;
        n++;
    }
    // 细调段：大步跳过头仍未达标时，用 0.01 步继续逼近目标
    if (contrastRatio(cur, bg) < target) {
        const fine = dir() < 0 ? -0.01 : 0.01;
        let f = cur, fn = 0;
        while (contrastRatio(f, bg) < target && fn < 20) {
            const next = adjustLightness(f, fine);
            if (!next || next === f) break;
            f = next;
            fn++;
        }
        if (contrastRatio(f, bg) > contrastRatio(cur, bg)) {
            cur = f;
            n += fn;
        }
    }
    // 反向段：主方向到极限（如前景已黑无法再暗）仍不达标时，反方向逃生
    if (contrastRatio(cur, bg) < target) {
        const revStep = dir() < 0 ? Math.abs(0.06) : -Math.abs(0.06);
        let rev = cur, rn = 0;
        while (contrastRatio(rev, bg) < target && rn < maxNudge) {
            const next = adjustLightness(rev, revStep);
            if (!next || next === rev) break;
            rev = next;
            rn++;
        }
        if (contrastRatio(rev, bg) > contrastRatio(cur, bg)) {
            cur = rev;
            n += rn;
        }
    }
    return { color: cur, nudged: n };
}

/** 关键色归一化：#rgb/#rrggbb → 小写 6 位 hex；rgb/hsl/命名色原样返回 */
function normalizeKeyColor(value) {
    const v = String(value || "").trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
        let hex = v.slice(1);
        if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
        return "#" + hex.toLowerCase();
    }
    return v;
}

/** 颜色值白名单校验（与注入/保存校验同源：hex / rgb(a) / hsl(a) / 命名色） */
function isValidColorValue(value) {
    const v = String(value || "").trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) return true;
    if (/^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(,\s*[\d.]+\s*)?\)$/.test(v)) return true;
    if (/^hsla?\(\s*[\d.]+\s*,\s*[\d.]+\s*%?\s*,\s*[\d.]+\s*%?\s*(,\s*[\d.]+\s*)?\)$/.test(v)) return true;
    if (/^[a-zA-Z]+$/.test(v)) return true;
    return false;
}

/**
 * 由 3 个关键色自动派生整套 CSS 变量。
 * 以关键色为锚，按明度档位派生背景/边框/主色深浅/悬停/选中高亮等变量，
 * 并对关键配对做 WCAG 对比度自检 nudge（详见 nudgeForeground）。
 *
 * @param {Object} keys - 关键色对象 {primary, background, foreground}
 * @param {string} mode - "light" | "dark"
 * @returns {Object<string,string>} 派生后的整套 CSS 变量映射（键不含 -- 前缀）
 */
function deriveVars(keys, mode) {
    const dark = mode === "dark";
    const k = {
        primary: normalizeKeyColor(keys.primary),
        background: normalizeKeyColor(keys.background),
        foreground: normalizeKeyColor(keys.foreground)
    };
    const bg = parseColorToRgb(k.background) ? k.background : null;
    const fg = parseColorToRgb(k.foreground) ? k.foreground : null;
    const p = parseColorToRgb(k.primary) ? k.primary : null;
    // 无法解析的关键色回退中性灰，保证派生链路不断
    const fallback = dark ? "#3a3a3a" : "#cfcfcf";
    const M = (name, c1, c2, t) => {
        const mixed = mix(c1, c2, t);
        return mixed || fallback;
    };
    const B = (v) => v || fallback;
    const pShade = (t) => shade(p || fallback, t);
    const pTint = (t) => tint(p || fallback, t);
    const bgMix = (c, t) => M("--bg", bg || fallback, c, t);
    const bgFg = (t) => M("--bgfg", bg || fallback, fg || fallback, t);
    const fgGrey = (t) => M("--fggrey", fg || fallback, "#9e9e9e", t);
    const mainBg = B(k.background);
    const mainFg = B(k.foreground);
    // 主色明度（HSL L），用于决定链接提亮/压暗方向与边框主色占比
    const pL = (() => {
        const c = parseColorToRgb(p || fallback);
        if (!c) {
            return 0.5;
        }
        const r = c.r / 255, g = c.g / 255, b = c.b / 255;
        return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
    })();
    // 链接/强调色：暗色用主色提亮；浅色按主色明度决定提亮或压暗（贴近内置 Material 色阶）
    const uiPrimary = dark ? pTint(0.35) : (pL < 0.41 ? (adjustLightness(p, 0.05) || p) : (adjustLightness(p, -0.05) || p));
    // 边框：浅色用主色淡彩+灰降饱和；暗色按主色明度决定主色占比（深主色方案需更高占比）
    const edgeSoft = (tTint, tGrey) => M("--edge", tint(p || fallback, tTint), "#9e9e9e", tGrey);
    const edgeMix = (base, t) => M("--edge", base || bg || fallback, p || fallback, t);

    const vars = {};
    const set = (n, v) => {
        vars[n] = v;
    };
    const nudgeStats = [];
    const ensure = (fgColor, bgColor, target, label) => {
        const r = nudgeForeground(fgColor, bgColor, target, mode);
        nudgeStats.push({ label: label, from: fgColor, to: r.color, target: target, nudged: r.nudged });
        return r.color;
    };

    // 背景 / 前景
    set("--primary-background-colour", B(k.background));
    set("--secondary-background-colour", bgMix(p || fallback, dark ? 0.08 : 0.07));
    set("--primary-font-colour", ensure(mainFg, mainBg, 4.5, "正文/背景"));
    set("--subtext-font-colour", dark ? fgGrey(0.60) : fgGrey(0.50));
    set("--title-colour", vars["--primary-font-colour"]);
    set("--title-background-colour", bgMix(p || fallback, dark ? 0.08 : 0.07));
    set("--primary-border-colour", dark ? (pL < 0.40 ? tint(edgeMix(mainBg, 0.55), 0.14) : tint(edgeMix(mainBg, 0.35), 0.14)) : edgeSoft(0.55, 0.25));
    set("--secondary-border-colour", dark ? edgeMix(mainBg, 0.18) : tint(p || fallback, 0.82));

    // 横幅 / 分类 / 输入框
    set("--banner-font-colour", dark ? (adjustLightness(uiPrimary, 0.06) || uiPrimary) : pShade(0.15));
    set("--banner-bg-colour", bgMix(p || fallback, dark ? 0.18 : 0.15));
    set("--banner-url-colour", uiPrimary);
    set("--input-highlight-colour", uiPrimary);
    set("--input-border-colour", bgFg(dark ? 0.62 : 0.74));
    set("--modals-link-focus-colour", uiPrimary);
    set("--banner-focus-bg-colour", bgMix(p || fallback, dark ? 0.18 : 0.15));

    // 操作列表（op / rec / 收藏夹）
    const opBg = bgMix(p || fallback, dark ? 0.18 : 0.12);
    set("--category-list-font-colour", uiPrimary);
    set("--op-list-operation-font-colour", dark ? (adjustLightness(uiPrimary, 0.06) || uiPrimary) : uiPrimary);
    set("--op-list-operation-bg-colour", opBg);
    set("--op-list-operation-border-colour", dark ? (pL < 0.40 ? tint(edgeMix(opBg, 0.45), 0.05) : tint(edgeMix(opBg, 0.15), 0.05)) : edgeMix(opBg, 0.20));
    const recBg = bgMix(p || fallback, dark ? 0.16 : 0.09);
    set("--rec-list-operation-font-colour", dark ? (adjustLightness(uiPrimary, 0.10) || uiPrimary) : (adjustLightness(uiPrimary, -0.05) || uiPrimary));
    set("--rec-list-operation-bg-colour", recBg);
    set("--rec-list-operation-border-colour", dark ? (pL < 0.40 ? tint(edgeMix(recBg, 0.45), 0.05) : tint(edgeMix(recBg, 0.15), 0.05)) : edgeMix(recBg, 0.18));
    const fcBg = bgMix(p || fallback, dark ? 0.20 : 0.14);
    set("--fc-operation-font-colour", dark ? (adjustLightness(uiPrimary, 0.06) || uiPrimary) : (adjustLightness(uiPrimary, -0.05) || uiPrimary));
    set("--fc-operation-bg-colour", fcBg);
    set("--fc-operation-border-colour", dark ? (pL < 0.40 ? tint(edgeMix(fcBg, 0.45), 0.15) : tint(edgeMix(fcBg, 0.25), 0.05)) : edgeMix(fcBg, 0.22));

    // 选中高亮 / 断点
    // 高亮背景：不再作为关键色，由主色按明度阶梯自动派生——
    // 浅色 = 主色淡彩（tint 0.82），深色 = 主色加深（shade 0.75），
    // 保证与背景/未选中项有感知差异且主色相延续（高级 JSON 区仍可手工改）。
    const selBg = dark ? shade(p || fallback, 0.75) : tint(p || fallback, 0.82);
    set("--selected-operation-bg-colour", selBg);
    // 选中文字色：按主题色系派生（蓝主题→蓝系、灰主题→灰系），不再固定黄调；
    // 以主色为锚取同色系深浅文字，再经 nudge 保证与高亮背景对比 >= 4.5。
    const selFontBase = dark ?
        (p ? tint(p, 0.45) : (fg || "#e0e0e0")) :
        (p ? shade(p, 0.30) : (fg || "#333333"));
    const selFont = ensure(selFontBase, selBg, 4.5, "选中文字/高亮背景");
    set("--selected-operation-font-color", selFont);
    // 下边框：以官方设计模式为基准（官方 5 套关键色直接返回官方原始边框）；
    // 自定义方案按「高亮色 vs 未选中操作项外观色」差异联动（差异大→同系微调弱边框，
    // 差异小→适度可见分界），见 computeSelectedBorderColour 说明。
    const opFont = vars["--op-list-operation-font-colour"];
    set("--selected-operation-border-colour", computeSelectedBorderColour(selBg, opFont, opBg, mode, k));
    const breakFontBase = dark ? "#e57373" : "#c62828";
    const breakBgBase = dark ? "#3d2323" : "#fbe3e3";
    const breakBg2 = dark ? "#3d2828" : "#f5d4d4";
    const breakBorder = dark ? "#573333" : "#f0caca";
    const breakBorder2 = dark ? "#553a3a" : "#eabbbb";
    set("--breakpoint-font-colour", breakFontBase);
    set("--breakpoint-bg-colour", breakBgBase);
    set("--breakpoint-border-colour", breakBorder);
    set("--breakpoint-icon-colour", "#9e9e9e");
    set("--breakpoint-icon-selected-colour", "#f44336");
    set("--fc-breakpoint-operation-font-colour", breakFontBase);
    set("--fc-breakpoint-operation-bg-colour", breakBg2);
    set("--fc-breakpoint-operation-border-colour", breakBorder2);

    // 禁用
    set("--disabled-font-colour", dark ? (adjustLightness(fgGrey(0.60), -0.25) || fgGrey(0.60)) : fgGrey(0.60));
    set("--disabled-bg-colour", bgFg(dark ? 0.13 : 0.10));
    set("--disabled-border-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));

    // 参数区
    set("--arg-font-colour", vars["--primary-font-colour"]);
    set("--arg-background", dark ? B(k.background) : "#ffffff");
    set("--arg-border-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));
    set("--arg-disabled-background", bgMix(p || fallback, dark ? 0.08 : 0.06));
    set("--arg-label-colour", uiPrimary);
    set("--disable-icon-colour", dark ? (adjustLightness(fgGrey(0.60), -0.25) || fgGrey(0.60)) : fgGrey(0.90));
    set("--disable-icon-selected-colour", dark ? "#e57373" : "#e53935");

    // 按钮
    const btnBg = B(k.primary);
    set("--btn-success-font-colour", "#ffffff");
    set("--btn-success-bg-colour", btnBg);
    set("--btn-success-border-colour", dark ? pShade(0.13) : (adjustLightness(btnBg, -0.03) || btnBg));
    const btnHoverBg = pShade(0.13);
    set("--btn-success-hover-font-colour", "#ffffff");
    set("--btn-success-hover-bg-colour", btnHoverBg);
    set("--btn-success-hover-border-colour", dark ? pShade(0.30) : (adjustLightness(btnHoverBg, -0.05) || btnHoverBg));
    const defaultBg = dark ? bgFg(0.12) : "#ffffff";
    set("--btn-default-font-colour", ensure(mainFg, defaultBg, 4.5, "默认按钮文字/背景"));
    set("--btn-default-bg-colour", defaultBg);
    set("--btn-default-border-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));
    set("--btn-default-hover-font-colour", shade(fg || fallback, 0.12));
    set("--btn-default-hover-bg-colour", bgMix(p || fallback, dark ? 0.18 : 0.06));
    set("--btn-default-hover-border-colour", dark ? tint(edgeMix(mainBg, 0.35), 0.15) : tint(p || fallback, 0.65));

    // 滚动条 / 杂项
    set("--scrollbar-track", bgMix(p || fallback, dark ? 0.07 : 0.06));
    set("--scrollbar-thumb", dark ? tint(edgeMix(mainBg, 0.30), 0.06) : tint(p || fallback, 0.68));
    set("--scrollbar-hover", dark ? tint(edgeMix(mainBg, 0.45), 0.08) : tint(p || fallback, 0.57));
    set("--drop-file-border-colour", uiPrimary);
    set("--table-border-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));
    set("--popover-background", dark ? bgMix(p || fallback, 0.08) : "#ffffff");
    set("--popover-border-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));
    set("--code-background", bgFg(dark ? 0.06 : 0.04));
    set("--code-font-colour", dark ? "#ef9a9a" : "#c7254e");

    // IO 状态栏 / 错误 / JSON
    set("--io-status-bar-bg-colour", bgMix(p || fallback, dark ? 0.05 : 0.07));
    set("--io-status-bar-hover-bg-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));
    set("--io-status-bar-border-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));
    set("--io-error-colour", dark ? "#ff6b6b" : "#e53935");
    set("--op-icon-danger-colour", dark ? "#e57373" : "#e53935");
    set("--json-dict-border-colour", dark ? tint(edgeMix(mainBg, 0.28), 0.08) : edgeMix(mainBg, 0.18));
    set("--json-summary-colour", dark ? fgGrey(0.60) : fgGrey(0.90));
    set("--json-summary-hover-colour", dark ? fg : fgGrey(0.45));

    // —— 官方通用项派生（21）：字体排版 10 / Loader 4 / Highlighter 5 / 断点图标 2 ——
    // 断点图标 2 项已在「选中高亮 / 断点」段派生（#9e9e9e / #f44336），此处不重复。
    // 字体排版：非颜色项，与关键色无关，按明暗模式取官方默认字体栈/字号。
    const fontFamily = dark ?
        '"Helvetica Neue", Helvetica, Arial, sans-serif' :
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
    const monoFamily = dark ?
        '"Monaco", "Droid Sans Mono", "Consolas", monospace' :
        'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    set("--primary-font-family", fontFamily);
    set("--primary-font-size", "14px");
    set("--primary-line-height", "20px");
    set("--fixed-width-font-family", monoFamily);
    set("--fixed-width-font-colour", "inherit");
    set("--fixed-width-font-size", "inherit");
    set("--subtext-font-size", "13px");
    set("--title-size", "16px");
    set("--title-weight", "bold");
    set("--op-title-font-weight", "bold");

    // Loader 加载动画三色：从主色派生（外圈=主色强调、中圈=主色提亮、内圈=主色压暗），
    // 背景随主题边框色，保证自定义主题加载动画与主题色统一。
    set("--loader-background-colour", vars["--secondary-border-colour"]);
    set("--loader-outer-colour", uiPrimary);
    set("--loader-middle-colour", pTint(0.35));
    set("--loader-inner-colour", pShade(0.20));

    // Highlighter 语法高亮五色：按明暗模式取官方默认（light=classic 半透明五色、
    // dark=dark 深色五色），保证语义色区分度。
    set("--hl1", dark ? "#264f78" : "#ffee00aa");
    set("--hl2", dark ? "#675351" : "#95dfffaa");
    set("--hl3", dark ? "#c40000" : "#ffb6b6aa");
    set("--hl4", dark ? "#fcf8e3" : "#fcf8e3aa");
    set("--hl5", dark ? "#38811b" : "#8de768aa");

    Object.defineProperty(vars, "_nudge", {
        value: nudgeStats,
        enumerable: false,
        configurable: true,
        writable: true
    });

    return vars;
}


/**
 * 由完整 CSS 变量集反推 3 个关键色（兼容旧的自定义主题数据：
 * 旧结构保存完整 vars 而无 keys，进入编辑时用反推值回填精简表单）。
 * 选中高亮不再反推为关键色（表单无对应字段），保存时由派生链重新生成；
 * 高级 JSON 区仍保留 vars 中的原高亮变量，手工改过则原样保留。
 *
 * @param {Object<string,string>} vars
 * @returns {{primary:string, background:string, foreground:string}}
 */
function reverseKeysFromVars(vars) {
    const pick = (...names) => {
        for (const n of names) {
            if (vars && vars[n]) return vars[n];
        }
        return "";
    };
    return {
        primary: pick("--btn-success-bg-colour", "--banner-url-colour", "--category-list-font-colour", "--modals-link-focus-colour"),
        background: pick("--primary-background-colour"),
        foreground: pick("--primary-font-colour", "--title-colour")
    };
}

/**
 * 自定义主题变量补全：以已有变量为基准，缺失的 CUSTOM_VAR_NAMES 项
 * 用反推关键色 deriveVars 派生补齐（历史脏数据 / 仅存 3 关键色的主题，
 * 编辑或加载时保证 JSON 区浅/深两列均为 73 全量）。
 *
 * @param {Object<string,string>} partial 已保存变量（可能不全，甚至只有 3 键）
 * @param {"light"|"dark"} mode 派生方向
 * @returns {Object<string,string>} 补全后的完整变量集（缺失项派生填充，已有项原样保留）
 */
function completeCustomVars(partial, mode) {
    const result = Object.assign({}, partial);
    if (Object.keys(result).length >= CUSTOM_VAR_NAMES.length) return result;
    const rk = reverseKeysFromVars(result);
    if (rk.primary && rk.background && rk.foreground) {
        const derived = deriveVars(rk, mode);
        for (const name of CUSTOM_VAR_NAMES) {
            if (result[name] === undefined) {
                const v = derived[name] !== undefined ? derived[name] : CUSTOM_VAR_DEFAULTS[name];
                if (v !== undefined) result[name] = v;
            }
        }
    }
    return result;
}

/**
 * 旧结构「单份完整 vars」浅深分离。
 * 历史自定义主题只保存一份完整 vars（浅深共用，导致深色模式显示浅色套）。
 * 此处按背景明度判定：
 * - 背景明显偏暗（亮度 < 0.35）→ 视为单套暗色主题，浅深共用原值（不强推亮色派生）；
 * - 否则视为浅色主题 → 深色套由 4 关键色反推后按 dark 模式派生（deriveVars），
 *   保证旧数据保存/编辑后浅深两套分离，深色模式不再回落到浅色。
 *
 * @param {Object<string,string>} vars 单份完整 CSS 变量集
 * @returns {{light: Object<string,string>, dark: Object<string,string>}}
 */
function splitFlatVars(vars) {
    const src = vars || {};
    const bg = src[KEY_VAR_MAP.background];
    const lum = bg ? relativeLuminance(bg) : 1;
    if (lum < 0.35) {
        return { light: Object.assign({}, src), dark: Object.assign({}, src) };
    }
    const keys = reverseKeysFromVars(src);
    const dark = keys.primary && keys.background && keys.foreground ?
        deriveVars(keys, "dark") : Object.assign({}, src);
    return { light: Object.assign({}, src), dark: dark };
}

/**
 * Waiter to handle events related to the CyberChef options.
 */
class OptionsWaiter {

    /**
     * OptionsWaiter constructor.
     *
     * @param {App} app - The main view object for CyberChef.
     * @param {Manager} manager - The CyberChef event manager.
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;

        // 跟随系统模式：监听 prefers-color-scheme 变化，无需刷新
        if (window.matchMedia) {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = () => {
                if (this.app.options && this.app.options.themeMode === "system") {
                    this.applyTheme();
                }
            };
            if (mq.addEventListener) {
                mq.addEventListener("change", handler);
            } else if (mq.addListener) {
                mq.addListener(handler);
            }
        }
    }

    /**
     * Loads options and sets values of switches and inputs to match them.
     *
     * @param {Object} options
     */
    load(options) {
        Object.assign(this.app.options, options);

        // Set options to match object
        document.querySelectorAll("#options-body input[type=checkbox]").forEach(cbox => {
            cbox.checked = this.app.options[cbox.getAttribute("option")];
        });

        document.querySelectorAll("#options-body input[type=number]").forEach(nbox => {
            nbox.value = this.app.options[nbox.getAttribute("option")];
            nbox.dispatchEvent(new CustomEvent("change", {bubbles: true}));
        });

        document.querySelectorAll("#options-body select").forEach(select => {
            const val = this.app.options[select.getAttribute("option")];
            if (val) {
                select.value = val;
                select.dispatchEvent(new CustomEvent("change", {bubbles: true}));
            } else {
                select.selectedIndex = 0;
            }
        });

        // Initialise options
        this.setWordWrap();
        this.manager.ops.setCatCount();

        // 应用 zh-cn 主题系统（跟随系统 / 固定浅深 / 自定义配色）
        this.applyTheme();
    }


    /**
     * Handler for options click events.
     * Displays the options pane.
     *
     * @param {event} e
     */
    optionsClick(e) {
        e.preventDefault();
        $("#options-modal").modal();
    }


    /**
     * 打开独立的「界面设置」窗口（外观与操作列表），
     * 入口为选项窗口内的"界面设置…"按钮。
     */
    uiSettingsClick(e) {
        e.preventDefault();
        this.renderUISettings();
        $("#ui-settings-modal").modal();
    }


    /**
     * 修复 Bootstrap 4 双弹窗滚动锁问题（根因）：
     * Bootstrap 4 的 .modal 默认 overflow: hidden，滚动依赖
     * .modal-open .modal { overflow-y: auto }；而 Modal._hideModal
     * 会无条件移除 body 的 modal-open 类（无多弹窗栈计数）。
     * 当 options-modal 与 ui-settings-modal 叠加时，关闭任一弹窗都会
     * 移除 modal-open，使仍在打开的弹窗失去内部滚动能力。
     * 这里在 hidden.bs.modal 后检查本项目两个弹窗是否仍有打开，
     * 若有则重新补回 body.modal-open，保证两者独立开关互不影响。
     */
    modalScrollLockFix() {
        const ids = ["options-modal", "ui-settings-modal", "confirm-modal"];
        const openIds = ids.filter(id => {
            const el = document.getElementById(id);
            return el && el.classList.contains("show");
        });
        // 防重复绑定（同名命名空间，先清后绑）
        $(document).off("keydown.bsmodal.fix").off("mousedown.bsmodal.fix");
        if (openIds.length) {
            document.body.classList.add("modal-open");

            // Bootstrap 4.6.2 多弹窗叠加关闭失效修复（两处根因）：
            // ① Esc：4.6.2 将 keydown.dismiss.bs.modal 绑定在 modal 元素上，
            //    多弹窗叠加时后打开的弹窗获得焦点，下层弹窗收不到 keydown，
            //    Esc 只能关最上层（甚至上层 hidden 后下层依旧无焦点，永远关不掉）；
            // ② 点击空白/backdrop：.modal 根元素铺满视口且透明，叠在 backdrop 之上，
            //    点击空白区命中 .modal 而非 .modal-backdrop，Bootstrap 关闭判定不成立；
            //    小视口下面板全屏时 backdrop 完全不可达。
            // 本项目 options/ui-settings 弹窗无关闭按钮，两条路径失效即"界面卡死"。
            // 此处以 document 级独立命名空间补回，关闭当前最上层弹窗，逐层可退。
            $(document).on("keydown.bsmodal.fix", (e) => {
                if (e.which !== 27) return;
                const topId = ids.filter(id => {
                    const el = document.getElementById(id);
                    return el && el.classList.contains("show");
                }).pop();
                if (!topId) return;
                const inst = $("#" + topId).data("bs.modal");
                if (inst && inst._isShown) inst.hide(e);
            });
            $(document).on("mousedown.bsmodal.fix", (e) => {
                if (e.which !== 1) return;
                const topId = ids.filter(id => {
                    const el = document.getElementById(id);
                    return el && el.classList.contains("show");
                }).pop();
                if (!topId) return;
                const modalEl = document.getElementById(topId);
                if (!modalEl || !modalEl.classList.contains("show")) return;
                if (e.target && e.target.closest && e.target.closest(".modal-dialog")) return;
                const inst = $("#" + topId).data("bs.modal");
                if (inst && inst._isShown) inst.hide(e);
            });
        } else {
            document.body.classList.remove("modal-open");
        }
    }


    /**
     * Handler for reset options click events.
     * Resets options back to their default values.
     */
    resetOptionsClick() {
        this.load(this.app.doptions);
        this.app.populateOperationsList();
        this.applyTheme();
    }


    /**
     * 「重置为默认值」（界面设置弹窗专用，位于关闭按钮旁）。
     * 重置范围：界面设置弹窗覆盖的全部选项（主题模式、浅/深配色方案、
     * 显示全部操作开关、操作隐藏名单）。
     * 分支逻辑：
     * - 无自定义配色方案：直接重置，不弹确认；
     * - 有自定义配色方案：弹出应用内确认弹窗（红色确认 / 绿色取消）询问是否一并删除，
     *   选择「是」→ 删除全部自定义方案并重置；选择「否」→ 保留自定义方案、仅重置其他值；
     *   直接关闭弹窗（answer 为 undefined）→ 视为取消，不执行任何重置。
     */
    resetUISettings() {
        const opts = this.app.options;
        const customCount = (opts.customSchemes || []).length;

        const doReset = (removeCustom) => {
            if (removeCustom) {
                opts.customSchemes = [];
                this.updateOption("customSchemes", []);
            }
            const d = this.app.doptions;
            const def = {
                themeMode: "light",
                lightScheme: "classic",
                darkScheme: "classic-dark",
                showAllOps: false,
                hiddenOps: []
            };
            ["themeMode", "lightScheme", "darkScheme", "showAllOps", "hiddenOps"].forEach(k => {
                opts[k] = (d[k] !== undefined) ? d[k] : def[k];
                if (k === "hiddenOps") opts[k] = (opts[k] || []).slice();
                this.updateOption(k, opts[k]);
            });
            // 表单回到新建态：清空编辑引用与方案名
            const nameEl = document.getElementById("ui-custom-name");
            if (nameEl) {
                nameEl.removeAttribute("data-edit-id");
                nameEl.value = "";
            }
            this._editingLegacy = false;
            this._jsonDirty = false;
            this.syncCustomEditButtons(false);
            this.renderUISettings();
            this.app.populateOperationsList();
            this.applyTheme();
        };

        if (customCount === 0) {
            doReset(false);
            return;
        }

        this.app.confirm(
            "重置为默认值",
            `当前有 ${customCount} 个自定义配色方案，是否一并删除？<br>` +
            "选择「否」将保留自定义配色方案，仅将其他界面设置重置为默认值。",
            "是，删除并重置",
            "否，仅重置",
            (answer) => {
                if (answer === undefined) return;
                doReset(!!answer);
            },
            this
        );
    }


    /**
     * Handler for switch change events.
     *
     * @param {event} e
     */
    switchChange(e) {
        const el = e.target;
        const option = el.getAttribute("option");
        const state = el.checked;

        this.updateOption(option, state);
    }


    /**
     * Handler for number change events.
     *
     * @param {event} e
     */
    numberChange(e) {
        const el = e.target;
        const option = el.getAttribute("option");
        const val = parseInt(el.value, 10);

        this.updateOption(option, val);
    }


    /**
     * Handler for select change events.
     *
     * @param {event} e
     */
    selectChange(e) {
        const el = e.target;
        const option = el.getAttribute("option");

        this.updateOption(option, el.value);
    }

    /**
     * Modifies an option value and saves it to local storage.
     *
     * @param {string} option - The option to be updated
     * @param {string|number|boolean} value - The new value of the option
     */
    updateOption(option, value) {
        log.debug(`Setting ${option} to ${value}`);
        this.app.options[option] = value;

        if (this.app.isLocalStorageAvailable())
            localStorage.setItem("options", JSON.stringify(this.app.options));
    }


    /**
     * Sets or unsets word wrap on the input and output depending on the wordWrap option value.
     */
    setWordWrap() {
        this.manager.input.setWordWrap(this.app.options.wordWrap);
        this.manager.output.setWordWrap(this.app.options.wordWrap);
    }


    /**
     * Theme change event listener（官方选项窗口 #theme 下拉）
     * 保持官方 options.theme 字符串兼容：用户手动选择即视为固定该主题。
     *
     * @param {Event} e
     */
    themeChange(e) {
        const themeClass = e.target.value;
        // 程序回填（load 初始化 / 恢复设置时对 #theme 下拉的 dispatchEvent，
        // isTrusted=false）：仅同步选中项，不覆盖 themeMode / 配色，
        // 避免把用户保存的「深色 / 跟随系统」模式强改为浅色导致深色方案不生效。
        if (!e.isTrusted) return;
        const pack = ALL_THEME_PACKS.find(tp =>
            tp.light === themeClass || tp.dark === themeClass);
        if (pack) {
            // 选择浅色方案 = 固定浅色；选择深色方案（内置 -dark 或官方 dark 系列）= 固定深色。
            // lightScheme / darkScheme 同步写为该主题包 id（applyTheme 再按 mode 取 pack.light/dark），
            // 保证后续「界面设置 · 新建自定义主题」回填时能拿到该包浅深两套真实配色。
            const isDark = (pack.dark === themeClass && pack.dark !== pack.light) ||
                /dark/i.test(themeClass);
            this.app.options.themeMode = isDark ? "dark" : "light";
            this.app.options.lightScheme = pack.id;
            this.app.options.darkScheme = pack.id;
            this.updateOption("lightScheme", pack.id);
            this.updateOption("darkScheme", pack.id);
        }
        this.changeTheme(themeClass);
        this.updateOption("theme", themeClass);
    }


    /**
     * Changes the theme by setting the class of the <html> element.
     * 兼容官方 changeTheme：?theme= URL 参数与外部调用仍可直达某套配色。
     *
     * @param (string} theme - scheme 的 CSS class 名（内置方案或自定义方案 id）
     */
    changeTheme(theme) {
        document.querySelector(":root").className = theme;
        this.applyCustomThemeVars(theme);

        // Update theme selection in the official options modal
        const themeSelect = document.getElementById("theme");
        if (themeSelect) {
            let themeOption = themeSelect.querySelector(`option[value="${theme}"]`);
            if (!themeOption) {
                // 新内置/自定义方案：选择其所属主题包的首选（浅色）方案
                const pack = ALL_THEME_PACKS.find(tp =>
                    tp.light === theme || tp.dark === theme);
                if (pack) {
                    themeOption = themeSelect.querySelector(`option[value="${pack.light}"]`);
                }
            }
            if (themeOption) themeSelect.selectedIndex = themeOption.index;
        }
    }


    /**
     * 为自定义配色方案注入 CSS 变量（防止 CSS 注入：仅接受白名单变量名与颜色值）。
     * 自定义主题为整套（含浅色/深色两份变量），schemeId 形如 custom-xxx-light /
     * custom-xxx-dark（旧格式 custom-xxx 直接存单份 vars 时浅深共用）。
     * 非自定义方案时清空注入的 <style>。
     *
     * @param {string} schemeId
     */
    applyCustomThemeVars(schemeId) {
        let styleEl = document.getElementById("zh-custom-theme-vars");
        const schemes = this.app.options.customSchemes || [];
        let custom = schemes.find(s => s.id === schemeId);
        let side = "";
        if (!custom && schemeId && schemeId.endsWith("-light")) {
            custom = schemes.find(s => schemeId === s.id + "-light") || null;
            side = "light";
        } else if (!custom && schemeId && schemeId.endsWith("-dark")) {
            custom = schemes.find(s => schemeId === s.id + "-dark") || null;
            side = "dark";
        }
        // 兼容老配置：schemeId 无 -light/-dark 后缀（如 darkScheme 直接存 custom-xxx）
        // 时，按当前 themeMode 判定取浅色还是深色变量，避免深色模式错误回落到浅色。
        if (!side && custom) {
            const mode = this.app.options.themeMode || "light";
            const isDark = mode === "dark" || (mode === "system" &&
                window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
            side = isDark ? "dark" : "light";
        }

        if (!custom || (!custom.light && !custom.dark && !custom.vars)) {
            if (styleEl) styleEl.textContent = "";
            return;
        }

        const lightVars = (custom.light && (custom.light.vars || custom.light)) || custom.vars || {};
        const darkVars = (custom.dark && (custom.dark.vars || custom.dark)) || custom.vars || {};
        const vars = side === "dark" ? darkVars : lightVars;

        const lines = [];
        for (const [name, value] of Object.entries(vars)) {
            if (!name.startsWith("--")) continue;
            if (!/^--[a-zA-Z0-9-]+$/.test(name)) continue;
            // 颜色值白名单：hex / rgb(a) / hsl(a) / 命名色，拒绝 url()、表达式、分号等
            if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value) &&
                !/^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(,\s*[\d.]+\s*)?\)$/.test(value) &&
                !/^hsla?\(\s*[\d.]+\s*,\s*[\d.]+\s*%?\s*,\s*[\d.]+\s*%?\s*(,\s*[\d.]+\s*)?\)$/.test(value) &&
                !/^[a-zA-Z]+$/.test(value)) {
                continue;
            }
            lines.push(`  ${name}: ${value};`);
        }

        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "zh-custom-theme-vars";
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `:root.${CSS.escape ? CSS.escape(schemeId) : schemeId.replace(/[^a-zA-Z0-9_-]/g, "")} {\n${lines.join("\n")}\n}`;
    }


    /**
     * 应用 zh-cn 主题系统：
     * - 跟随系统：按 prefers-color-scheme 选取 lightScheme / darkScheme 主题包
     * - 固定浅色 / 固定深色：直接应用对应主题包
     * 主题包含浅深两套配色（可相同），官方 options.theme 字符串保持兼容。
     */
    applyTheme() {
        const opts = this.app.options;
        const mode = opts.themeMode || "light";

        let schemeId;
        if (mode === "system") {
            const isDark = window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            schemeId = isDark ? (opts.darkScheme || "classic-dark") : (opts.lightScheme || "classic");
        } else if (mode === "dark") {
            schemeId = opts.darkScheme || "classic-dark";
        } else {
            schemeId = opts.lightScheme || "classic";
        }

        // 主题包 id → 浅/深配色 scheme；若配置直接为 scheme id（老配置/自定义方案）则原样使用
        const pack = getThemePackById(schemeId);
        if (pack) {
            const isDarkMode = mode === "dark" || (mode === "system" &&
                window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
            schemeId = isDarkMode ? pack.dark : pack.light;
        }

        this.changeTheme(schemeId);
        if (opts.theme !== schemeId) {
            this.updateOption("theme", schemeId);
        }
    }


    /**
     * Applies the user's preferred color scheme using the `prefers-color-scheme` media query.
     * zh-cn：委托给 applyTheme()（保留官方入口名，App.setup / loadURIParams 仍可调用）。
     */
    applyPreferredColorScheme() {
        this.applyTheme();
    }

    /**
     * Get the user's preferred color scheme using the `prefers-color-scheme` media query.
     */
    getPreferredColorScheme() {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDarkScheme ? "dark" : "classic";
    }


    /* ==================== 界面设置窗口（主题区 + 操作列表区） ==================== */

    /**
     * 渲染「界面设置」窗口的全部内容。
     */
    renderUISettings() {
        this.renderThemeMode();
        this.renderThemePackSelect();
        // 每次打开设置窗口重置表单/JSON 同步状态：
        // - _jsonDirty：用户是否手动编辑过高级 JSON 区（手动编辑后表单关键色只覆盖同名基准）
        // - _editingLegacy：当前编辑的是否为旧结构（仅完整 vars、无 keys）主题
        this._jsonDirty = false;
        const sel = document.getElementById("ui-theme-pack");
        const currentPack = (sel && sel.value) || this.getCurrentPackId();
        const custom = (this.app.options.customSchemes || []).find(s => s.id === currentPack);
        const nameEl = document.getElementById("ui-custom-name");
        if (custom) {
            // 当前生效为自定义方案 → 打开即进入编辑态（方案名可自由修改，保存按同名匹配）
            nameEl.value = custom.name;
            nameEl.setAttribute("data-edit-id", custom.id);
            this._editingLegacy = !(custom.keys && custom.keys.light && custom.keys.dark &&
                custom.keys.light.primary && custom.keys.dark.primary);
        } else {
            // 当前生效为内置方案 → 新建态（选中内置方案保存须改名另存为自定义）
            nameEl.removeAttribute("data-edit-id");
            nameEl.value = "";
            this._editingLegacy = false;
        }
        this.syncCustomEditButtons(!!custom);
        this.renderCustomThemeForm();
        // 高级 JSON 区默认给出当前主题完整字段（新建 = 当前生效主题，编辑 = 该自定义主题）
        const jsonEl = document.getElementById("ui-custom-json");
        if (jsonEl) {
            // 一次性绑定手动编辑脏标记（DOM 元素常驻，避免每次渲染重复绑定）
            if (!jsonEl.dataset.zhKeyBound) {
                jsonEl.dataset.zhKeyBound = "1";
                jsonEl.addEventListener("input", () => {
                    this._jsonDirty = true;
                });
            }
            const { light, dark } = this.getEditingCustomVars();
            jsonEl.value = JSON.stringify({ light: light, dark: dark }, null, 2);
        }
        this.renderHiddenOpsList();
    }


    /**
     * 渲染跟随系统单选（themeMode）。
     */
    renderThemeMode() {
        const mode = this.app.options.themeMode || "light";
        document.querySelectorAll("#ui-settings-modal input[name=themeMode]").forEach(radio => {
            radio.checked = (radio.value === mode);
        });
    }


    /**
     * 渲染整套主题包下拉（内置在前，官方垫底；自定义主题追加在末尾）。
     * 每套主题包含 light/dark 两套配色，跟随系统时自动切换、固定浅深取对应一套。
     */
    renderThemePackSelect() {
        const sel = document.getElementById("ui-theme-pack");
        if (!sel) return;
        const options = [];
        ALL_THEME_PACKS.forEach(tp => {
            options.push(`<option value="${tp.id}">${tp.name}</option>`);
        });
        (this.app.options.customSchemes || []).forEach(cs => {
            options.push(`<option value="${cs.id}">自定义 · ${cs.name}</option>`);
        });
        sel.innerHTML = options.join("");
        sel.value = this.getCurrentPackId();
    }


    /**
     * 当前正在使用的主题包 id（根据 themeMode 与 light/darkScheme 反推）。
     * 兼容旧配置：直接存的 scheme id（classic / classic-dark / custom-xxx）
     * 会归一化回所属主题包 id；自定义主题取去 -light/-dark 后缀的主 id。
     */
    getCurrentPackId() {
        const opts = this.app.options;
        const mode = opts.themeMode || "light";
        let activeScheme;
        if (mode === "system") {
            const isDark = window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            activeScheme = isDark ? (opts.darkScheme || "classic-dark") : (opts.lightScheme || "classic");
        } else if (mode === "dark") {
            activeScheme = opts.darkScheme || "classic-dark";
        } else {
            activeScheme = opts.lightScheme || "classic";
        }
        const pack = ALL_THEME_PACKS.find(tp =>
            tp.light === activeScheme || tp.dark === activeScheme);
        if (pack) return pack.id;
        if (activeScheme && activeScheme.endsWith("-light")) return activeScheme.slice(0, -6);
        if (activeScheme && activeScheme.endsWith("-dark")) return activeScheme.slice(0, -5);
        return activeScheme || "classic";
    }


    /**
     * 渲染隐藏名单编辑区（勾选 = 显示，未勾选 = 隐藏）。
     * 按主界面分类顺序分组（与 App.populateOperationsList 顺序一致），
     * 每组分类可手风琴折叠；搜索时过滤所有分类下匹配项并自动展开。
     * 收藏分类（收藏夹）不参与隐藏名单编辑：主界面收藏始终显示全部，
     * 因此编辑列表不展示收藏分类及其操作，搜索过滤时同样不显示。
     */
    renderHiddenOpsList() {
        const list = document.getElementById("ui-hidden-ops-list");
        if (!list) return;

        const hiddenSet = new Set(this.app.options.hiddenOps || []);
        const filter = ((document.getElementById("ui-hidden-ops-search") || {}).value || "").trim();
        const ops = this.app.operations || {};
        // 与主界面一致：按 this.app.categories 顺序遍历（Categories.json，首类为收藏夹）
        const categories = (this.app.categories || []).filter(c => c.name !== "收藏夹");
        let html = "";
        categories.forEach(catConf => {
            const cat = catConf.name;
            const catOps = (catConf.ops || []).filter(opName => opName in ops);
            if (!catOps.length) return;
            if (filter) {
                const matched = catOps.filter(opName => opName.indexOf(filter) >= 0);
                if (!matched.length) return;
            }
            const visibleCount = catOps.filter(opName => !hiddenSet.has(opName)).length;
            const totalCount = filter ?
                catOps.filter(opName => opName.indexOf(filter) >= 0).length : catOps.length;
            const checkedCount = filter ?
                catOps.filter(opName => !hiddenSet.has(opName) && opName.indexOf(filter) >= 0).length : visibleCount;
            html += `<div class="zh-op-cat" data-cat="${cat.replace(/"/g, "&quot;")}">
                <div class="zh-op-cat-header" role="button" tabindex="0">
                    <span class="zh-op-cat-arrow">▸</span>
                    <span class="zh-op-cat-name">${cat}</span>
                    <span class="zh-op-cat-count">${checkedCount}/${totalCount}</span>
                </div>
                <div class="zh-op-cat-body">`;
            // 收集本分类（过滤后）的操作项
            const items = [];
            catOps.forEach(opName => {
                if (filter && opName.indexOf(filter) < 0) return;
                // 勾选 = 显示：不在 hiddenSet 中的操作显示为勾选
                const checked = hiddenSet.has(opName) ? "" : " checked";
                const opTitle = opName.replace(/"/g, "&quot;");
                items.push(`<div class="checkbox zh-hidden-op-item">
                    <label title="${opTitle}">
                        <input type="checkbox" class="zh-hidden-op-toggle" value="${opTitle}"${checked}>
                        <span class="zh-hidden-op-name">${opName}</span>
                    </label>
                </div>`);
            });
            // 稳定四列：JS 按均分分组（base=floor(n/4)，前 n%4 列各多 1 个），
            // 每列数量不超过 ceil(n/4)，列与列数量差不超过 1；
            // 顺序先上到下再左到右（第一列填满→第二列→…），配合 CSS Grid 强制 4 列。
            const base = Math.floor(items.length / 4);
            const extra = items.length % 4;
            let idx = 0;
            for (let i = 0; i < 4; i++) {
                const colCount = base + (i < extra ? 1 : 0);
                const slice = items.slice(idx, idx + colCount);
                idx += colCount;
                html += `<div class="zh-hidden-op-col">${slice.join("")}</div>`;
            }
            html += `</div></div>`;
        });

        if (!html) {
            html = "<p class='text-muted zh-no-op-match'>没有匹配的操作。</p>";
        }

        list.innerHTML = html;

        // 展开策略：默认全部折叠；搜索时仅展开第一个含匹配操作的分类。
        // 分类之间保持手风琴互斥（uiHiddenCatToggle 同时只展开一个），
        // 保证任何时刻视觉上最多一个分类展开 = 最多四列宽度，避免多分类
        // 各自 4 列纵向堆叠造成的"好多列"观感。
        let openCats = [];
        if (filter) {
            const firstMatched = categories.find(catConf => {
                const catOps = (catConf.ops || []).filter(opName => opName in ops && opName.indexOf(filter) >= 0);
                return catOps.length > 0;
            });
            if (firstMatched) openCats = [firstMatched.name];
        }
        openCats.forEach(catName => {
            const node = list.querySelector(`.zh-op-cat[data-cat="${catName.replace(/"/g, "&quot;")}"]`);
            if (node) node.classList.add("open");
        });

        // 手风琴点击直接绑定（渲染会整体替换 innerHTML，每次渲染后必须重新绑定；
        // 不再依赖 Manager 的 dynamic listener —— 后者只匹配点击目标自身，
        // 点击分类头内部文字/箭头时 target 是子元素，无法触发，导致“点击无反应”）。
        list.querySelectorAll(".zh-op-cat-header").forEach(header => {
            header.addEventListener("click", this.uiHiddenCatToggle.bind(this));
        });
    }


    /**
     * 分类手风琴切换：同时最多展开一个分类，展开新分类自动收起上一个。
     */
    uiHiddenCatToggle(e) {
        const header = e.target.closest(".zh-op-cat-header");
        if (!header) return;
        const cat = header.parentElement;
        const list = cat.parentElement;
        if (cat.classList.contains("open")) {
            cat.classList.remove("open");
        } else {
            list.querySelectorAll(".zh-op-cat.open").forEach(c => c.classList.remove("open"));
            cat.classList.add("open");
        }
    }


    /**
     * 渲染自定义主题「精简填写」表单（表格式：字段文字共用一套）。
     * 每行 = 关键色名 + 浅色控件 + 深色控件；浅/深各 3 个关键色
     * （主色调 / 背景色 / 文字色），其余整套 CSS 变量由 deriveVars() 在保存时
     * 自动派生，其中选中高亮色由主色按明度阶梯自动派生（高级 JSON 区仍可手工改）。
     * 不再渲染逐变量全量字段。
     */
    renderCustomThemeForm() {
        const form = document.getElementById("ui-custom-form");
        if (!form) return;
        const keys = this.getEditingCustomKeys();
        const renderField = (key, scheme) => {
            const value = keys[scheme][key] || "#cfcfcf";
            return `<div class="zh-key-field" data-key="${key}" data-scheme="${scheme}">
                <input type="color" class="zh-key-color" data-key="${key}" data-scheme="${scheme}" value="${this.toHex(value) || "#cfcfcf"}">
                <input type="text" class="form-control zh-key-value" data-key="${key}" data-scheme="${scheme}" value="${String(value).replace(/"/g, "&quot;")}" spellcheck="false">
                <span class="zh-key-swatch" style="background: ${value}"></span>
            </div>`;
        };
        const rowsHtml = CUSTOM_KEY_FIELDS.map(field => `
            <div class="zh-key-row">
                <span class="zh-key-row-label" title="${field.hint || field.name}">${field.label}<em class="zh-key-row-hint">${field.hint || ""}</em></span>
                <div class="zh-key-side">${renderField(field.name, "light")}</div>
                <div class="zh-key-side">${renderField(field.name, "dark")}</div>
            </div>`).join("");
        form.innerHTML = `
            <div class="zh-key-head">
                <span class="zh-key-head-label">关键色</span>
                <span class="zh-key-head-scheme">浅色配色方案</span>
                <span class="zh-key-head-scheme">深色配色方案</span>
            </div>
            ${rowsHtml}`;
    }


    /**
     * 当前正在编辑的自定义主题关键色（3 个：light / dark 各一套）。
     * - 新结构主题：直接取该主题保存的 keys（含 primary/background/foreground）；
     * - 旧结构主题（仅完整 vars、无 keys）：由 vars 反推关键色回填（reverseKeysFromVars）；
     * - 新建态：回填当前生效主题（document 计算样式）反推的关键色作为起点，
     *   避免新建时表单默认全黑。
     *
     * @returns {{light: Object<string,string>, dark: Object<string,string>}}
     */
    getEditingCustomKeys() {
        const nameEl = document.getElementById("ui-custom-name");
        const editId = nameEl ? nameEl.getAttribute("data-edit-id") : null;
        if (editId) {
            const cs = (this.app.options.customSchemes || []).find(s => s.id === editId);
            if (cs) {
                if (cs.keys && cs.keys.light && cs.keys.dark &&
                    cs.keys.light.primary && cs.keys.dark.primary) {
                    return {
                        light: Object.assign({}, cs.keys.light),
                        dark: Object.assign({}, cs.keys.dark)
                    };
                }
                // 旧结构：从完整 vars 反推关键色；
                // 浅深共用（单份 vars，无独立 dark）时深色自动派生暗色套
                const lv = (cs.light && (cs.light.vars || cs.light)) || cs.vars || {};
                const dv = (cs.dark && (cs.dark.vars || cs.dark)) || cs.vars || {};
                const hasSeparateDark = !!(cs.dark && (cs.dark.vars || cs.dark));
                const flat = splitFlatVars(lv);
                return {
                    light: reverseKeysFromVars(lv),
                    dark: hasSeparateDark ? reverseKeysFromVars(dv) : reverseKeysFromVars(flat.dark)
                };
            }
        }

        // 新建：按当前所选主题包分别回填浅色/深色关键色（联动主题包切换）
        const { light: lv, dark: dv } = this.getPackLightDarkVars();
        return {
            light: Object.assign({}, reverseKeysFromVars(lv)),
            dark: Object.assign({}, reverseKeysFromVars(dv))
        };
    }


    /**
     * 当前正在编辑的自定义主题变量（整套：light / dark 两列）。
     * 编辑态：取该主题自身的 light/dark 变量（新结构 keys 主题保存时已含派生 vars；
     * 旧格式单份 vars 浅深共用）；新建态：回填当前生效主题（document 计算样式）
     * 的变量值作为起点，避免新建时 JSON 区默认全黑；var() 引用做有限递归解析。
     *
     * @returns {{light: Object<string,string>, dark: Object<string,string>}}
     */
    getEditingCustomVars() {
        const nameEl = document.getElementById("ui-custom-name");
        const editId = nameEl ? nameEl.getAttribute("data-edit-id") : null;
        if (editId) {
            const cs = (this.app.options.customSchemes || []).find(s => s.id === editId);
            if (cs) {
                // 旧格式单份 vars 浅深共用 → 深色套自动派生暗色，避免编辑后仍浅深同色
                const lv = (cs.light && (cs.light.vars || cs.light)) || cs.vars || {};
                const dv = (cs.dark && (cs.dark.vars || cs.dark)) || cs.vars || {};
                const hasSeparateDark = !!(cs.dark && (cs.dark.vars || cs.dark));
                const flat = splitFlatVars(lv);
                // 已存变量可能不全（历史脏数据 / 仅存 3 键）：缺失项按反推关键色派生补齐，
                // 保证高级 JSON 区浅/深两列加载即为 CUSTOM_VAR_NAMES 全量。
                return {
                    light: this.resolveVarRefs(completeCustomVars(lv, "light")),
                    dark: this.resolveVarRefs(completeCustomVars(hasSeparateDark ? dv : flat.dark, "dark"))
                };
            }
        }

        // 新建：按当前所选主题包分别回填浅色/深色变量（联动主题包切换）
        const { light: lv, dark: dv } = this.getPackLightDarkVars();
        return { light: Object.assign({}, lv), dark: Object.assign({}, dv) };
    }


    /**
     * 将变量值中的 var(--xxx) 引用解析为具体色值（深度上限 4）。
     * 同对象内已解析值优先，其次当前文档计算样式；解析失败保留原值。
     * 用于 JSON 区回填：避免内置包 CSSOM 中的 var() 引用被保存校验拒绝，
     * 也兼容历史脏数据中残留的变量引用。
     *
     * @param {Object<string,string>} vars 变量集合（原地修改）
     * @returns {Object<string,string>}
     */
    resolveVarRefs(vars) {
        const computed = window.getComputedStyle(document.documentElement);
        for (const [k, v] of Object.entries(vars)) {
            const m = String(v).match(/^var\(\s*(--[a-zA-Z0-9-]+)\s*\)$/);
            if (!m) continue;
            let ref = m[1];
            let depth = 0;
            let resolved = "";
            while (depth < 4) {
                const cur = vars[ref] !== undefined ? vars[ref] : computed.getPropertyValue(ref).trim();
                const m2 = String(cur).match(/^var\(\s*(--[a-zA-Z0-9-]+)\s*\)$/);
                if (!m2) {
                    resolved = cur;
                    break;
                }
                ref = m2[1];
                depth++;
            }
            vars[k] = resolved;
        }
        return vars;
    }


    /**
     * 当前所选主题包的浅色 / 深色两套变量：
     * - 自定义主题：从 customSchemes 对应条目取 vars；
     * - 内置 / 官方主题：从页面样式规则中解析 :root.<schemeId> 变量块
     *   （不切换渲染、不闪屏）；解析失败时回退当前生效主题的计算样式。
     * 用于「新建自定义主题」时联动回填所选主题包实际配色。
     *
     * @returns {{light: Object<string,string>, dark: Object<string,string>}}
     */
    getPackLightDarkVars() {
        const packId = this.getCurrentPackId();
        const custom = (this.app.options.customSchemes || []).find(s => s.id === packId);
        if (custom) {
            // 自定义主题：已有 vars 可能不全（历史脏数据 / 仅存 3 键），
            // 缺失项按反推关键色派生补齐，保证新建联动回填即为 73 全量。
            return {
                light: this.resolveVarRefs(completeCustomVars((custom.light && (custom.light.vars || custom.light)) || {}, "light")),
                dark: this.resolveVarRefs(completeCustomVars((custom.dark && (custom.dark.vars || custom.dark)) || {}, "dark"))
            };
        }

        // 内置 / 官方主题：解析样式规则中的 :root.<schemeId> 变量块
        // lightScheme / darkScheme 可能存的是主题包 id（如 "rose"，来自官方 #theme
        // 下拉的 themeChange），需先归一化为具体 scheme id（rose-light / rose-dark），
        // 否则 :root.rose 规则不存在 → 解析为空 → 回退计算样式导致深色列=浅色列。
        const lightScheme0 = this.app.options.lightScheme || "classic";
        const darkScheme0 = this.app.options.darkScheme || "classic-dark";
        const lightPack = getThemePackById(lightScheme0);
        const darkPack = getThemePackById(darkScheme0);
        const lightScheme = lightPack ? lightPack.light : lightScheme0;
        const darkScheme = darkPack ? darkPack.dark : darkScheme0;
        const parseScheme = (schemeId) => {
            const vars = {};
            // 关键色静态内联（BUILTIN_SCHEME_KEYS）：浅/深各取该主题包真实值，
            // 避免 CSSOM 跨域 / 样式表未就绪时回退计算样式导致“深色列 = 浅色列”。
            const staticKeys = BUILTIN_SCHEME_KEYS[schemeId];
            if (staticKeys) {
                vars[KEY_VAR_MAP.primary] = staticKeys.primary;
                vars[KEY_VAR_MAP.background] = staticKeys.background;
                vars[KEY_VAR_MAP.foreground] = staticKeys.foreground;
            }
            const wanted = new Set(CUSTOM_VAR_NAMES);
            try {
                for (const sheet of document.styleSheets) {
                    let rules;
                    try {
                        rules = sheet.cssRules;
                    } catch (e) {
                        continue;
                    }
                    for (const rule of rules) {
                        // 兼容组合选择器（官方 _classic.css 为 ":root, :root.classic"，
                        // 构建合并后可能变为 ":root.classic, :root.dark" 等）：
                        // 只要选择器列表包含目标 :root.<schemeId> 即视为命中，
                        // 避免精确比较导致 classic 等主题永远解析不到 CSSOM 变量。
                        if (!rule || !rule.selectorText) {
                            continue;
                        }
                        const selectors = rule.selectorText.split(",").map(s => s.trim());
                        if (!selectors.includes(`:root.${schemeId}`)) {
                            continue;
                        }
                        const st = rule.style;
                        for (const name of wanted) {
                            if (vars[name]) continue;
                            const v = st.getPropertyValue(name).trim();
                            if (v) vars[name] = v;
                        }
                    }
                }
            } catch (e) { /* 样式跨域等无法读取时保留静态关键色 */ }
            // 后处理：把 var(--xxx) 引用解析为具体色值（同 rule 内已解析值优先，
            // 其次当前文档计算样式），避免 JSON 区回填 var() 引用被保存校验拒绝。
            return this.resolveVarRefs(vars);
        };
        // 补全到 73 全量：静态关键色 + CSSOM 解析结果为基准，缺失项按
        // 关键色（静态表优先，其次反推解析值）deriveVars 派生补齐。
        // 静态内置变量表优先：命中即有 73 项权威全量（var() 已解析为具体色值），
        // 直接返回，避免 CSSOM 解析不完整时缺失项被 deriveVars 派生造成视觉差异。
        if (ZH_BUILTIN_VARS[lightScheme] && ZH_BUILTIN_VARS[darkScheme]) {
            return {
                light: Object.assign({}, ZH_BUILTIN_VARS[lightScheme]),
                dark: Object.assign({}, ZH_BUILTIN_VARS[darkScheme])
            };
        }
        const light = this.ensurePackVars(parseScheme(lightScheme), "light", lightScheme);
        const dark = this.ensurePackVars(parseScheme(darkScheme), "dark", darkScheme);
        if (!Object.keys(light).length && !Object.keys(dark).length) {
            // 回退：当前生效主题的计算样式（浅深共用同一套）
            const computed = window.getComputedStyle(document.documentElement);
            const resolveVar = (name, depth) => {
                if (depth > 3) return "";
                const val = computed.getPropertyValue(name).trim();
                const m = val.match(/^var\(\s*(--[a-zA-Z0-9-]+)\s*\)$/);
                if (m) return resolveVar(m[1], depth + 1);
                return val;
            };
            const vars = {};
            CUSTOM_VAR_NAMES.forEach(name => {
                const val = resolveVar(name, 0);
                if (val) vars[name] = val;
            });
            return { light: vars, dark: vars };
        }
        return { light: light, dark: dark };
    }

    /**
     * 内置/官方主题变量补全：以「静态关键色 + CSSOM 解析」得到的部分变量为基准，
     * 缺失的 CUSTOM_VAR_NAMES 项用关键色（静态表优先，其次反推已有解析值）
     * deriveVars 派生补齐，保证返回的浅/深两列均为 73 全量（解析失败时
     * 以关键色派生整套兜底，不再只回 4 键）。
     *
     * @param {Object<string,string>} partial 静态关键色 + CSSOM 解析到的部分变量
     * @param {"light"|"dark"} mode 派生方向
     * @param {string} schemeId 主题方案 id（用于查静态表）
     * @returns {Object<string,string>} 补全后的完整变量集
     */
    ensurePackVars(partial, mode, schemeId) {
        const result = Object.assign({}, partial);
        if (Object.keys(result).length >= CUSTOM_VAR_NAMES.length) return result;
        const staticKeys = BUILTIN_SCHEME_KEYS[schemeId] || {};
        const rk = reverseKeysFromVars(result);
        const keys = {
            primary: rk.primary || staticKeys.primary || "",
            background: rk.background || staticKeys.background || "",
            foreground: rk.foreground || staticKeys.foreground || ""
        };
        if (keys.primary && keys.background && keys.foreground) {
            const derived = deriveVars(keys, mode);
            for (const name of CUSTOM_VAR_NAMES) {
                if (result[name] === undefined) {
                    const v = derived[name] !== undefined ? derived[name] : CUSTOM_VAR_DEFAULTS[name];
                    if (v !== undefined) result[name] = v;
                }
            }
        }
        return result;
    }


    /**
     * 自定义主题表单交互：色值选择器 / 文本输入 / 预览联动（按浅/深列同步），
     * 并同步高级 JSON 折叠区（关键色变化 → 重新派生整套变量）。
     */
    customFormPreview() {
        const el = arguments[0] && arguments[0].target || null;
        if (!el) return;
        const key = el.getAttribute("data-key");
        if (!key) return;
        let value;
        if (el.classList.contains("zh-key-color")) {
            value = el.value;
        } else {
            value = el.value.trim();
        }
        if (!value) return;
        // 同步同关键色同列（light/dark）控件
        const field = el.closest(".zh-key-field") || document;
        const color = field.querySelector(".zh-key-color");
        const text = field.querySelector(".zh-key-value");
        const swatch = field.querySelector(".zh-key-swatch");
        const hex = this.toHex(value);
        if (color && hex) color.value = hex;
        if (text && text !== el) text.value = value;
        if (swatch) swatch.style.background = value;
        this.syncCustomJson();
    }


    /**
     * 表单关键色 → 高级 JSON 折叠区同步：
     * - 编辑旧结构主题（仅完整 vars、无 keys，_editingLegacy=true）：
     *   JSON 区保持原 vars，表单关键色仅覆盖同名基准变量（KEY_VAR_MAP），
     *   其余高级定制变量原样保留；
     * - 编辑/新建新结构主题且用户未手动编辑过 JSON（_jsonDirty=false）：
     *   以表单关键色重新派生整套变量刷新 JSON 区；
     * - 用户手动编辑过 JSON（_jsonDirty=true）：表单关键色仅覆盖同名基准变量，
     *   不打断用户的高级定制。
     * 旧格式 JSON（顶层直接为变量对象，视为浅深共用）会被迁移为
     * {"light": {...}, "dark": {...}}。
     */
    syncCustomJson() {
        const jsonEl = document.getElementById("ui-custom-json");
        if (!jsonEl) return;
        // 收集表单当前 3 关键色（light/dark）
        const keys = { light: {}, dark: {} };
        document.querySelectorAll("#ui-custom-form .zh-key-field").forEach(field => {
            const scheme = field.getAttribute("data-scheme") === "dark" ? "dark" : "light";
            const key = field.getAttribute("data-key");
            const value = field.querySelector(".zh-key-value").value.trim();
            if (key && value) keys[scheme][key] = value;
        });
        const lightKeys = keys.light.primary && keys.light.background &&
            keys.light.foreground ? keys.light : null;
        const darkKeys = keys.dark.primary && keys.dark.background &&
            keys.dark.foreground ? keys.dark : null;
        if (!lightKeys && !darkKeys) return;

        // 旧结构主题：JSON 区保持原 vars，仅覆盖同名基准
        if (this._editingLegacy || this._jsonDirty) {
            let parsed = null;
            try {
                parsed = JSON.parse(jsonEl.value || "{}");
                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) parsed = {};
            } catch (e) {
                parsed = {};
            }
            const hasLight = parsed.light && typeof parsed.light === "object" && !Array.isArray(parsed.light);
            const hasDark = parsed.dark && typeof parsed.dark === "object" && !Array.isArray(parsed.dark);
            let data;
            if (hasLight || hasDark) {
                data = { light: hasLight ? parsed.light : {}, dark: hasDark ? parsed.dark : {} };
            } else {
                // 旧格式平铺：浅深分离（亮色派生暗色套），不再浅深共用
                const split = splitFlatVars(parsed);
                data = { light: split.light, dark: split.dark };
            }
            [["light", lightKeys], ["dark", darkKeys]].forEach(([scheme, ks]) => {
                if (!ks) return;
                CUSTOM_KEY_FIELDS.forEach(field => {
                    const name = KEY_VAR_MAP[field.name];
                    if (name && ks[field.name]) data[scheme][name] = ks[field.name];
                });
            });
            jsonEl.value = JSON.stringify(data, null, 2);
            return;
        }

        // 新结构主题且未手动编辑：以关键色重新派生整套变量
        // （3 关键色命中内置方案时直接克隆内置完整变量，保证视觉一致）
        const data = {
            light: lightKeys ? (builtinCloneVars(lightKeys, "light") || deriveVars(lightKeys, "light")) : {},
            dark: darkKeys ? (builtinCloneVars(darkKeys, "dark") || deriveVars(darkKeys, "dark")) : {}
        };
        jsonEl.value = JSON.stringify(data, null, 2);
    }


    /**
     * 颜色值归一化为 #rrggbb（仅 hex 可转；rgb()/hsl()/命名色返回空）。
     */
    toHex(value) {
        const v = (value || "").trim();
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
            let hex = v.slice(1);
            if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
            return "#" + hex.toLowerCase();
        }
        return "";
    }


    /**
     * 跟随系统单选变化。
     */
    themeModeChange(e) {
        this.app.options.themeMode = e.target.value;
        this.updateOption("themeMode", e.target.value);
        this.applyTheme();
    }


    /**
     * 整套主题包下拉变化：选择一套主题包后，
     * 同时写入 lightScheme / darkScheme（自定义主题为 -light/-dark 后缀 id），
     * 再由 applyTheme 依据 themeMode 决定当前显示浅色还是深色。
     */
    themePackChange(e) {
        const val = e.target.value;
        const pack = getThemePackById(val);
        if (pack) {
            this.app.options.lightScheme = pack.light;
            this.app.options.darkScheme = pack.dark;
        } else {
            // 自定义主题（整套）：light/dark 各用一份 vars（id 加后缀区分）
            this.app.options.lightScheme = val + "-light";
            this.app.options.darkScheme = val + "-dark";
        }
        this.updateOption("lightScheme", this.app.options.lightScheme);
        this.updateOption("darkScheme", this.app.options.darkScheme);
        this.applyTheme();

        // 下拉选择即加载：选中自定义方案 → 进入编辑态（回填表单+JSON、显示删除按钮，
        // 方案名可自由修改，保存按同名匹配）；选中内置方案 → 新建态（基于该内置方案回填配色）。
        const nameEl = document.getElementById("ui-custom-name");
        const custom = (this.app.options.customSchemes || []).find(s => s.id === val);
        this._jsonDirty = false;
        if (custom) {
            nameEl.value = custom.name;
            nameEl.setAttribute("data-edit-id", custom.id);
            this._editingLegacy = !(custom.keys && custom.keys.light && custom.keys.dark &&
                custom.keys.light.primary && custom.keys.dark.primary);
        } else {
            nameEl.removeAttribute("data-edit-id");
            nameEl.value = "";
            this._editingLegacy = false;
        }
        this.syncCustomEditButtons(!!custom);
        this.renderCustomThemeForm();
        const jsonEl = document.getElementById("ui-custom-json");
        if (jsonEl) {
            const { light, dark } = this.getEditingCustomVars();
            jsonEl.value = JSON.stringify({ light: light, dark: dark }, null, 2);
        }
    }


    /**
     * 「显示全部 / 仅常用」开关。
     */
    showAllOpsChange(e) {
        this.app.options.showAllOps = e.target.checked;
        this.updateOption("showAllOps", e.target.checked);
        this.app.populateOperationsList();
    }


    /**
     * 隐藏名单勾选变化：勾选 = 显示，未勾选 = 隐藏。
     * 以「未勾选」集合覆盖保存 hiddenOps（存储层仍为隐藏名单）。
     */
    hiddenOpsChange() {
        const hidden = [];
        document.querySelectorAll("#ui-hidden-ops-list .zh-hidden-op-toggle").forEach(cb => {
            if (!cb.checked) hidden.push(cb.value);
        });
        this.app.options.hiddenOps = hidden;
        this.updateOption("hiddenOps", hidden);
        this.app.populateOperationsList();
    }


    /**
     * 隐藏名单搜索过滤（仅影响显示，不改名单）；重渲染并自动展开匹配分类。
     */
    hiddenOpsSearch() {
        this.renderHiddenOpsList();
    }


    /**
     * 依据当前编辑态显示/隐藏自定义方案的操作按钮：
     * 编辑自定义方案时显示「删除方案」；新建态（选中内置方案）隐藏。
     * 「保存方案」按钮常驻；方案名始终可编辑，保存按同名匹配（同名覆盖/异名新建）。
     *
     * @param {boolean} editing 是否为编辑自定义方案
     */
    syncCustomEditButtons(editing) {
        const del = document.getElementById("ui-custom-delete");
        if (del) del.classList.toggle("d-none", !editing);
    }


    /**
     * 删除当前编辑的自定义方案（整套，含浅色与深色两套变量）。
     * 使用应用内 Bootstrap modal 确认弹窗（非原生 alert/confirm），
     * 确认后删除并切回内置「经典」新建态。
     */
    deleteCustomTheme() {
        const nameEl = document.getElementById("ui-custom-name");
        const id = nameEl ? nameEl.getAttribute("data-edit-id") : null;
        if (!id) return;
        const schemes = this.app.options.customSchemes || [];
        const idx = schemes.findIndex(s => s.id === id);
        if (idx < 0) return;
        const cs = schemes[idx];
        this.app.confirm(
            "删除配色方案",
            `确定删除自定义配色方案「${cs.name}」吗？删除后不可恢复。`,
            "确认删除",
            "取消",
            (answer) => {
                if (!answer) return;
                schemes.splice(idx, 1);
                this.app.options.customSchemes = schemes;
                this.updateOption("customSchemes", schemes);

                // 切回内置「经典」新建态
                nameEl.removeAttribute("data-edit-id");
                nameEl.value = "";
                this._editingLegacy = false;
                this._jsonDirty = false;
                this.syncCustomEditButtons(false);
                this.renderThemePackSelect();
                const sel = document.getElementById("ui-theme-pack");
                if (sel) sel.value = "classic";
                this.app.options.lightScheme = "classic";
                this.app.options.darkScheme = "classic-dark";
                this.updateOption("lightScheme", "classic");
                this.updateOption("darkScheme", "classic-dark");
                this.applyTheme();
                this.renderCustomThemeForm();
                const jsonEl = document.getElementById("ui-custom-json");
                if (jsonEl) {
                    const { light, dark } = this.getEditingCustomVars();
                    jsonEl.value = JSON.stringify({ light: light, dark: dark }, null, 2);
                }
            },
            this
        );
    }


    /**
     * 新增 / 保存自定义主题（整套：light + dark 两列变量）。
     * 保存策略：
     * - 新结构（keys 表单）且未手动编辑过高级 JSON：由 3 关键色派生整套变量，
     *   同时保存 keys（供再次编辑回填）与派生 vars（供即时应用，兼容运行时）；
     * - 编辑旧结构主题（仅完整 vars、无 keys）或用户手动编辑过高级 JSON：
     *   高级 JSON 优先，表单关键色仅覆盖同名基准变量（KEY_VAR_MAP），
     *   其余高级定制变量原样保留；保存完整 vars（无 keys），
     *   再次编辑时由 vars 反推关键色回填。
     * 保存校验防注入逻辑保留：变量名必须合法，颜色值必须匹配白名单，
     * 非法项给出提示并中止保存；关键色格式先统一校验。
     * 方案名按同名匹配：同名自定义方案直接更新覆盖，无同名则新建；
     * 与内置/官方方案同名则拒绝覆盖（内置保护策略，须改名保存）。
     */
    customThemeSave() {
        const nameEl = document.getElementById("ui-custom-name");
        const jsonEl = document.getElementById("ui-custom-json");
        const name = (nameEl.value || "").trim();
        if (!name) {
            this.app.alert("请输入主题名称", 3000);
            return;
        }

        // 内置方案保护策略：名称与任一内置/官方方案显示名相同则拒绝同名保存覆盖，
        // 必须改名后保存为自定义方案（与编辑/新建态无关，改名撞内置名同样拦截）。
        // 同名自定义方案不在此拦截：由 saveCustomTheme 按方案名匹配直接更新覆盖。
        const builtinNames = ALL_THEME_PACKS.map(tp => tp.name);
        if (builtinNames.indexOf(name) >= 0) {
            this.app.alert(`「${name}」是内置配色方案，不可同名保存覆盖；请改名后保存为自定义方案`, 5000);
            return;
        }

        // 收集表单 3 关键色（light/dark），并做基本校验
        const formKeys = { light: {}, dark: {} };
        document.querySelectorAll("#ui-custom-form .zh-key-field").forEach(field => {
            const scheme = field.getAttribute("data-scheme") === "dark" ? "dark" : "light";
            const key = field.getAttribute("data-key");
            const value = field.querySelector(".zh-key-value").value.trim();
            if (key && value) formKeys[scheme][key] = value;
        });
        const keysComplete = (side) => CUSTOM_KEY_FIELDS.every(f => formKeys[side][f.name]);
        const keyInvalid = (side) => {
            for (const f of CUSTOM_KEY_FIELDS) {
                const v = formKeys[side][f.name];
                if (v && !isValidColorValue(v)) return f.label;
            }
            return "";
        };
        const lightKeysComplete = keysComplete("light");
        const darkKeysComplete = keysComplete("dark");
        const lightKeyInvalid = keyInvalid("light");
        const darkKeyInvalid = keyInvalid("dark");
        if (lightKeyInvalid || darkKeyInvalid) {
            this.app.alert(`关键色格式不合法（仅支持 #hex / rgb() / hsl() / 命名色）：${lightKeyInvalid || darkKeyInvalid}`, 5000);
            return;
        }
        if (!lightKeysComplete && !darkKeysComplete) {
            this.app.alert("请至少填写完整一套关键色（浅色或深色的 3 个颜色：主色/背景/文字）", 3000);
            return;
        }

        const validate = (obj) => {
            const safe = {};
            for (const [k, v] of Object.entries(obj)) {
                if (!/^--[a-zA-Z0-9-]+$/.test(k)) continue;
                const val = String(v).trim();
                if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val) &&
                    !/^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(,\s*[\d.]+\s*)?\)$/.test(val) &&
                    !/^hsla?\(\s*[\d.]+\s*,\s*[\d.]+\s*%?\s*,\s*[\d.]+\s*%?\s*(,\s*[\d.]+\s*)?\)$/.test(val) &&
                    !/^[a-zA-Z]+$/.test(val)) {
                    this.app.alert(`变量 ${k} 的颜色值不合法（仅支持 #hex / rgb() / hsl() / 命名色）：${val}`, 5000);
                    return null;
                }
                safe[k] = val;
            }
            return safe;
        };

        let light = {};
        let dark = {};
        const jsonText = (jsonEl.value || "").trim();

        // 分支 1：编辑旧结构主题 / 用户手动编辑过高级 JSON → 高级 JSON 优先
        if (this._editingLegacy || this._jsonDirty) {
            if (jsonText) {
                let parsed;
                try {
                    parsed = JSON.parse(jsonText);
                } catch (e) {
                    this.app.alert("高级 JSON 格式错误：" + e.message + "，请修正后再保存", 5000);
                    return;
                }
                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                    this.app.alert("高级 JSON 必须是对象：{\"light\": {\"--变量名\": \"颜色值\"}, \"dark\": {...}}", 5000);
                    return;
                }
                if (parsed.light && typeof parsed.light === "object" && !Array.isArray(parsed.light)) {
                    const safe = validate(parsed.light);
                    if (!safe) return;
                    light = safe;
                } else {
                    // 旧格式：顶层直接为变量对象（单份 vars）→ 浅深分离（亮色派生暗色套）
                    const safe = validate(parsed);
                    if (!safe) return;
                    const split = splitFlatVars(safe);
                    light = split.light;
                    dark = split.dark;
                }
                if (parsed.dark && typeof parsed.dark === "object" && !Array.isArray(parsed.dark)) {
                    const safe = validate(parsed.dark);
                    if (!safe) return;
                    dark = safe;
                }
            } else if (!this._editingLegacy && (lightKeysComplete || darkKeysComplete)) {
                // 新结构方案用户清空高级 JSON 区：完整关键色 → 走纯派生整套变量，
                // 避免仅存 3 个关键色基准变量导致其余边框/分隔变量缺失、视觉回退默认值。
                if (lightKeysComplete) {
                    const dl = builtinCloneVars(formKeys.light, "light") || deriveVars(formKeys.light, "light");
                    if (dl && Object.keys(dl).length) light = dl;
                }
                if (darkKeysComplete) {
                    const dd = builtinCloneVars(formKeys.dark, "dark") || deriveVars(formKeys.dark, "dark");
                    if (dd && Object.keys(dd).length) dark = dd;
                }
            }
            // 表单关键色覆盖同名基准变量（其余高级定制变量保留）
            if (lightKeysComplete) {
                CUSTOM_KEY_FIELDS.forEach(f => {
                    const name = KEY_VAR_MAP[f.name];
                    if (name) light[name] = formKeys.light[f.name];
                });
            }
            if (darkKeysComplete) {
                CUSTOM_KEY_FIELDS.forEach(f => {
                    const name = KEY_VAR_MAP[f.name];
                    if (name) dark[name] = formKeys.dark[f.name];
                });
            }
            if (!Object.keys(light).length) light = Object.assign({}, dark);
            if (!Object.keys(dark).length) dark = Object.assign({}, light);
            if (!Object.keys(light).length) {
                this.app.alert("未解析到有效变量，请填写至少一个颜色选项", 3000);
                return;
            }
            // 浅深两套关键色齐全时同步存 keys（旧结构单份主题经拆分后转新结构，
            // 后续编辑直接回填两套关键色，避免再次走单份兼容路径）
            const storeKeys = (lightKeysComplete && darkKeysComplete) ? formKeys : null;
            this.saveCustomTheme(name, light, dark, storeKeys, nameEl, jsonEl);
            return;
        }

        // 分支 2：新结构、JSON 区有内容（未手动编辑 = 表单派生结果）→ 校验后直接保存
        if (jsonText) {
            let parsed;
            try {
                parsed = JSON.parse(jsonText);
            } catch (e) {
                this.app.alert("高级 JSON 格式错误：" + e.message + "，请修正后再保存", 5000);
                return;
            }
            if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
                this.app.alert("高级 JSON 必须是对象：{\"light\": {\"--变量名\": \"颜色值\"}, \"dark\": {...}}", 5000);
                return;
            }
            if (parsed.light && typeof parsed.light === "object" && !Array.isArray(parsed.light)) {
                const safe = validate(parsed.light);
                if (!safe) return;
                light = safe;
            } else {
                // 旧格式：顶层直接为变量对象（单份 vars）→ 浅深分离（亮色派生暗色套）
                const safe = validate(parsed);
                if (!safe) return;
                const split = splitFlatVars(safe);
                light = split.light;
                dark = split.dark;
            }
            if (parsed.dark && typeof parsed.dark === "object" && !Array.isArray(parsed.dark)) {
                const safe = validate(parsed.dark);
                if (!safe) return;
                dark = safe;
            }
            if (!Object.keys(light).length) light = Object.assign({}, dark);
            if (!Object.keys(dark).length) dark = Object.assign({}, light);
            if (!Object.keys(light).length) {
                this.app.alert("未解析到有效变量，请填写至少一个颜色选项", 3000);
                return;
            }
            this.saveCustomTheme(name, light, dark, formKeys, nameEl, jsonEl);
            return;
        }

        // 分支 3：新结构、JSON 区为空 → 由 3 关键色派生整套变量
        light = lightKeysComplete ? (builtinCloneVars(formKeys.light, "light") || deriveVars(formKeys.light, "light")) : {};
        dark = darkKeysComplete ? (builtinCloneVars(formKeys.dark, "dark") || deriveVars(formKeys.dark, "dark")) : {};
        if (!Object.keys(light).length) light = Object.assign({}, dark);
        if (!Object.keys(dark).length) dark = Object.assign({}, light);
        if (!Object.keys(light).length) {
            this.app.alert("未解析到有效变量，请填写至少一个颜色选项", 3000);
            return;
        }
        this.saveCustomTheme(name, light, dark, formKeys, nameEl, jsonEl);
    }


    /**
     * 落盘自定义主题并刷新设置界面。
     * 保存按方案名匹配：同名自定义方案 → 更新覆盖该方案；无同名 → 新建。
     * （内置同名已在 customThemeSave 中按保护策略拒绝，不会走到这里。）
     * @param {string} name 主题名称
     * @param {Object} light 浅色整套 vars
     * @param {Object} dark 深色整套 vars
     * @param {Object|null} keys 表单 3 关键色（新结构保存 keys 供再次编辑回填；旧结构传 null 不存 keys）
     */
    saveCustomTheme(name, light, dark, keys, nameEl, jsonEl) {
        const schemes = this.app.options.customSchemes || [];
        const storeKeys = !!(keys && keys.light && keys.dark);

        // 同名匹配：存在同名自定义方案 → 更新覆盖；否则新建
        let savedId = null;
        const existing = schemes.find(s => s.name === name);
        if (existing) {
            savedId = existing.id;
            existing.light = { vars: light };
            existing.dark = { vars: dark };
            if (storeKeys) existing.keys = { light: keys.light, dark: keys.dark };
            else {
                existing.keys = undefined; delete existing.keys;
            }
            existing.vars = undefined;
            delete existing.vars; // 清理旧格式单份字段
        } else {
            savedId = "custom-" + Date.now().toString(36);
            schemes.push({
                id: savedId,
                name: name,
                light: { vars: light },
                dark: { vars: dark },
                ...(storeKeys ? { keys: { light: keys.light, dark: keys.dark } } : {})
            });
        }

        this.app.options.customSchemes = schemes;
        this.updateOption("customSchemes", schemes);

        // 保存后立即应用该方案，并刷新下拉选中之（保存成功即进入编辑态，便于继续调整）。
        this.renderThemePackSelect();
        const sel = document.getElementById("ui-theme-pack");
        if (sel) sel.value = savedId;
        this.app.options.lightScheme = savedId + "-light";
        this.app.options.darkScheme = savedId + "-dark";
        this.updateOption("lightScheme", this.app.options.lightScheme);
        this.updateOption("darkScheme", this.app.options.darkScheme);
        this.applyTheme();

        nameEl.value = name;
        nameEl.setAttribute("data-edit-id", savedId);
        // 方案名可自由修改，保存时再按新名称匹配覆盖/新建
        this._editingLegacy = !storeKeys;
        this._jsonDirty = false;
        this.syncCustomEditButtons(true);
        this.renderCustomThemeForm();
        if (jsonEl) {
            const { light: lv, dark: dv } = this.getEditingCustomVars();
            jsonEl.value = JSON.stringify({ light: lv, dark: dv }, null, 2);
        }
    }


    /**
     * Changes the console logging level.
     *
     * @param {Event} e
     */
    logLevelChange(e) {
        const level = e.target.value;
        log.setLevel(level, false);
        this.manager.worker.setLogLevel();
        this.manager.input.setLogLevel();
        this.manager.output.setLogLevel();
        this.manager.background.setLogLevel();
    }
}

export default OptionsWaiter;
