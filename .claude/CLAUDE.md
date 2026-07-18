# Claude 项目指令

本文件是 Claude Code 专属的项目指南。

在使用 Claude Code 编辑此仓库之前，先阅读本文件。

## 上下文文件

- 先读 `README.md` 了解项目目的
- 读 `docs/ai-guide.md` 了解共享 AI 工作流（如何读/更新文档）
- 读 `docs/tech-stack.md` 了解技术约束
- 读 `docs/architecture.md` 了解系统边界和分层
- 读 `docs/modules/` 了解各模块设计文档
- 读 `docs/business-flow.md` 了解用户流程和验收条件
- 读 `docs/api-contracts/` 了解 HTTP 契约
- 读 `docs/database-schema.md` 了解数据表结构和所有权规则
- 读 `docs/coding-standards.md` 了解命名和实现规范
- 读 `docs/frontend-design.md` 了解前端约定
- 读 `docs/testing.md` 了解测试策略和命令
- 读 `docs/security.md` 了解安全约束
- 读 `docs/deployment.md` 了解环境和环境变量

## 行为规则

- 实现模糊需求前先解释你的假设
- 保持代码变更与架构文档一致
- API 行为变更时同步更新文档、错误码和测试
- 在 Demo 代码中优先使用可读性强的示例，而非过度抽象
- Claude Code 专属行为写在本文件中

## 决策记录

在做影响架构的修改之前，先阅读 `docs/decisions/` 目录下相关的决策记录。
理解已有决策的原因。如果新方案与已有决策冲突，先与用户讨论。

## 输出要求

- 在最终回复中列出所有修改过的文件
- 说明运行或跳过了哪些验证命令
- 绝不谎称测试通过——只有实际运行了测试才能这么说
