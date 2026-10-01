# CyberChef 中文版

[中文](#中文版) | [English](#english)

![CyberChef 中文版界面截图](docs/screenshot.png)

## 中文版

CyberChef 中文版是社区维护的非官方简体中文版本，基于 [gchq/CyberChef](https://github.com/gchq/CyberChef)。项目保留了 CyberChef 的核心功能和执行流程，并将界面、操作名称、操作说明、参数提示和错误信息翻译为简体中文。

除 HTTP 请求、DNS over HTTPS 等需要主动访问网络的操作外，数据均在浏览器本地处理，不会上传到本项目服务器，适合离线环境使用。

### 下载与使用

在线使用：[GitHub Pages](https://anyawantsstars.github.io/CyberChef_zh-cn/)

离线使用：前往 [Releases](https://github.com/AnyaWantsStars/CyberChef_zh-cn/releases) 下载最新的离线包，解压后直接打开 `CyberChef_v11.5.5_zh-cn_v1.0.0-rc.1.html`。

如果需要自行构建：

```bash
git clone https://github.com/AnyaWantsStars/CyberChef_zh-cn.git
cd CyberChef_zh-cn
npm install
npm run build
```

构建结果位于 `build/prod`。该目录可直接部署，ZIP 离线包内含单文件版本和全部资源。

### 版本说明

- 当前汉化版本：`11.5.5`
- 对应上游：官方 `11.5.0` 及后续提交
- 社区版本：`v1.0.0-rc.1`
- 构建文件：`CyberChef_v11.5.5_zh-cn_v1.0.0-rc.1.zip`

汉化版版本号与官方版本号分开维护，下载窗口会分别显示两个版本。

### 功能特性

- 覆盖主要界面、操作名称、参数和错误提示的简体中文翻译
- 核心算法和执行流程沿用官方实现
- 支持拖放排序、自动执行、Magic 自动检测、断点调试和流程分享
- 流程和数据只保存在本地，可下载后离线使用
- 保留 Node.js API 入口，可直接在 Node.js 中调用操作

### 开发与构建

需要 Node.js 24 或 26。推荐使用 Node.js 24，项目也提供了 [.nvmrc](./.nvmrc)。

| 命令               | 说明                                  |
| ---------------- | ----------------------------------- |
| `npm start`      | 启动开发服务器，地址为 `http://localhost:8080` |
| `npm run build`  | 生成生产版本到 `build/prod`                |
| `npm test`       | 运行 Node.js 和操作测试                    |
| `npm run testui` | 运行浏览器 UI 测试，需先完成生产构建                |
| `npm run lint`   | 检查代码规范                              |
| `npm run node`   | 生成 Node.js 包                        |
| `npm run repl`   | 启动 Node.js 交互环境                     |

### 汉化约定

- 只翻译用户可见的文案，包括操作名称、说明、参数名称、帮助信息和错误信息。
- 保留算法及协议缩写，例如 `Hex`、`AES`、`XOR`、`Base64`、`SHA`、`ADD`、`OR`、`Binary` 和 `Auto`。完整单词可根据上下文翻译，例如 `Decimal` 译为“十进制”。
- 不翻译对象键、选项值、内部比较串和影响执行逻辑的标识符。`argSelector` 的 `name` 可以汉化，但对应的 `value` 必须保持原样。
- 统一使用“执行”对应 `Bake`、“流程”对应 `Recipe`。
- 中英文混排时在英数词与中文之间加空格，例如 `0x 带逗号`、`IV 长度`。
- 修改翻译后应运行相关操作测试；涉及浏览器交互时还需运行 UI 测试。

### 维护说明

- CodeMirror 的查找和替换面板文案来自 `@codemirror/search`。项目通过 `postinstall` 执行 `patch-codemirror-zh.cjs` 应用中文补丁，更新该依赖后需要重新验证。
- 源码统一使用 UTF-8 和 LF 换行。不要提交 CRLF 文件，否则 lint 和构建可能失败。
- 合并上游更新后，需要检查 `Gruntfile.js` 中的 Windows 构建兼容补丁、版本注入逻辑和汉化文本是否仍然有效。

### 已知限制

- 分享链接中的操作名为中文，官方英文 recipe 链接无法直接在本版本中解析。
- 500 多个操作尚未全部逐一测试。部分问题可能来自官方版本，并非都由汉化引入。
- 这是源码级汉化，不使用运行时 i18n 框架。上游更新涉及相同字符串时，需要在合并过程中人工确认。
- 源码级汉化会改变 Node.js API 的参数名称和部分返回文本。依赖官方英文接口的现有脚本需要先做兼容性验证。

### 问题反馈

请通过 [Issues](https://github.com/AnyaWantsStars/CyberChef_zh-cn/issues) 提交问题，也可以在帮助弹窗的“汉化问题”页签中查看反馈方式。

提交问题时请尽量提供：

- 汉化版本和对应官方版本
- 操作名称或完整的 recipe
- 输入数据、复现步骤和实际结果
- 必要的截图或错误信息

欢迎提交汉化修正 PR。改动请尽量限定在翻译文本范围内，并说明修改原因。

### 安全

安全问题请按照 [SECURITY.md](./SECURITY.md) 中的方式报告。

### 许可证

本项目基于官方 CyberChef 派生，遵循 [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0)，并受 Crown Copyright 约束。

## English

CyberChef zh-cn is an unofficial, community-maintained Simplified Chinese build of [CyberChef](https://github.com/gchq/CyberChef). Processing is client-side by default, and user-facing strings are localized directly in the source code.

Try the online version at [GitHub Pages](https://anyawantsstars.github.io/CyberChef_zh-cn/).

### What This Version Provides

- Simplified Chinese translations for the main interface, operation names, descriptions, arguments, and errors
- The standard CyberChef workflow, including drag-and-drop recipes, Magic detection, breakpoints, URL sharing, and offline use
- A Node.js API for invoking operations from scripts
- No runtime i18n layer and no external translation service

Operations such as HTTP Request and DNS over HTTPS will contact the endpoints you configure. This project does not operate a translation or data service.

### Build

Use Node.js 24 or 26, then run:

```bash
npm install
npm start
```

Run `npm run build` to create a production build in `build/prod`. The ZIP package contains a standalone HTML file and all required assets.

Other available commands:

| Command          | Purpose                                       |
| ---------------- | --------------------------------------------- |
| `npm test`       | Run Node.js and operation tests               |
| `npm run testui` | Run browser UI tests after a production build |
| `npm run lint`   | Run code linting                              |
| `npm run node`   | Build the Node.js package                     |
| `npm run repl`   | Start the Node.js REPL                        |

### Architecture

The public `main` branch contains this localized build and is used for GitHub Pages. Development history is kept on the local `zh-cn` branch, and upstream changes are fetched from `gchq/CyberChef`.

This approach avoids maintaining a separate key table and language runtime. The tradeoff is that translated strings can conflict with upstream changes, so merges require review.

### Localization Changes

Translate user-visible text only. Keep algorithm names, protocol abbreviations, object keys, option values, and internal comparison strings unchanged. See the Chinese section above for the full terminology and testing conventions.

The `postinstall` command applies a patch from `patch-codemirror-zh.cjs` to localize the CodeMirror search panel. Keep source files UTF-8 encoded with LF line endings.

### Compatibility

Chinese operation names are stored in recipe URLs, so recipe links generated for the official English build cannot be loaded directly. Source-level localization can also change Node.js API argument names and some returned text, so existing scripts should be checked before migration. Not every operation has been tested in this localization, and some failures may also exist upstream.

### Contributing

Issues and pull requests are welcome. Report the localization version, official base version, recipe, input, expected result, and actual result when possible.

### License

This project is derived from CyberChef and is distributed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0), subject to Crown Copyright.
