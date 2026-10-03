# Security Policy

本项目是 CyberChef 的非官方简体中文版本，安全问题按来源分别报告。

## 官方 CyberChef

核心算法、依赖、官方 operation 或上游代码中的漏洞，请按照 [GCHQ CyberChef Security Policy](https://github.com/gchq/CyberChef/security/policy) 私下报告。

请勿在公开 Issue 中披露未修复的安全问题。

## 当前仓库

以下问题属于当前仓库维护范围：

- 汉化兼容层引入的安全问题
- 当前仓库的构建、Pages 或 Release 流程问题
- 为解决英文流程（recipe）或 Node.js API 兼容性而引入的问题

请使用当前仓库的 GitHub Private Vulnerability Reporting 功能私下报告。

当前 fork 不承诺与 GCHQ 官方项目相同的安全响应时限。使用密码学功能时，不应仅依赖 CyberChef 的输出来保证安全性。

## 支持范围

修复通常只应用于最新版本，不保证回溯修复旧版本。
