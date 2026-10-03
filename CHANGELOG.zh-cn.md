# CyberChef zh-cn Changelog

本文件记录当前仓库维护的简体中文版本变化。官方 CyberChef 的变更记录仍保留在 [CHANGELOG.md](./CHANGELOG.md)。

## v1.0.0 - 2026-10-04

- 基于官方 CyberChef 11.5.0 及后续提交
- 完成主要界面、操作名称、说明、参数提示和错误信息汉化
- 增加中英文流程（recipe）双向兼容
- 恢复 Node.js API 的英文参数、英文描述搜索和官方返回值兼容
- 修复下载窗口中官方版本与汉化版本共用同一版本变量的问题
- 统一汉化兼容层目录为 `src/core/zh-cn/`
- 修复 Windows 下 Babel 只识别正斜杠，导致 `node_modules` 被误处理的问题
- 修复 `.fnt` 和 `bmfonts` PNG 资源在 Windows 构建中被误当作 JavaScript 的问题
- 完整 Node.js 与操作测试通过
- 保留 Apache 2.0 许可和 Crown Copyright

## v1.0.0-rc.1 - 2026-10-01

- 第一个公开预发布版本
- 保留 CyberChef 的 500 多个操作
- 提供 GitHub Pages 在线版本和离线 ZIP
- 已知限制：部分 Node.js API 和英文流程（recipe）兼容性尚未完成
