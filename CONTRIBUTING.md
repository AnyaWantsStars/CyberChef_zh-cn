# Contributing

本项目是 CyberChef 的非官方简体中文版本。提交前请先判断改动属于哪一类，再选择对应的贡献流程。

## 汉化与兼容性改动

以下内容属于当前仓库维护范围：

- 翻译缺失、术语和中文排版修正
- 中英文流程（recipe）互转
- Node.js API 英文参数和返回值兼容
- 当前仓库的构建、Pages 和 Release 配置
- 汉化版本引入的功能回归

请先搜索现有 Issue，再提交 Pull Request。Pull Request 请面向 `main` 分支，并说明：

- 汉化版本和官方基线版本
- 修改前后的文本或行为
- 涉及的 operation、流程（recipe）或 Node.js API
- 已运行的测试

提交到当前仓库的纯汉化和兼容性改动不需要签署 GCHQ Contributor Licence Agreement。

## 官方功能改动

算法、协议、操作行为或官方架构相关的修复与新增功能，应优先提交到上游 [gchq/CyberChef](https://github.com/gchq/CyberChef)。

参与上游项目时，请遵守官方贡献指南，并按官方要求签署 [GCHQ Contributor Licence Agreement](https://cla-assistant.io/gchq/CyberChef)。

## 开发要求

- 使用 Node.js 24 或 26
- 源码使用 UTF-8、LF 换行和 4 空格缩进
- 不翻译对象键、内部选项值和功能依赖的英文标识符
- 修改 operation 行为或翻译时运行相关测试
- 修改浏览器交互时运行 UI 测试
- 新增或修改兼容映射时，补充对应 Node.js API 和流程（recipe）测试

常用命令：

```bash
npm run lint
npm test
npm run build
npm run testui
```

主要代码规范沿用官方项目：Vanilla JS 优先、保持客户端运行、避免新增大型依赖，并尽量降低浏览器端下载体积。
