# Codex 项目指南

本文件是 Codex 专属的项目指南。

Codex 应将 `docs/` 目录下的文档视为产品契约，保持代码、测试和文档同步。

## 必读顺序

1. `README.md` — 项目目的和快速入门
2. `docs/ai-guide.md` — 如何阅读和更新项目文档
3. `docs/tech-stack.md` — 技术选型和约束
4. `docs/architecture.md` — 系统边界和依赖关系
5. `docs/modules/` — 各模块的设计和职责文档
6. `docs/business-flow.md` — 用户流程和验收条件
7. `docs/api-contracts/` — HTTP 契约和响应格式
8. `docs/database-schema.md` — 数据表、所有权和迁移规则
9. `docs/coding-standards.md` — 命名、分层和实现规范
10. `docs/frontend-design.md` — 前端组件和样式约定
11. `docs/testing.md` — 测试策略和命令
12. `docs/security.md` — 认证、授权和 AI 安全约束
13. `docs/deployment.md` — 环境、环境变量和部署检查清单

## 工作规则

- 优先小步变更，避免大范围重写
- 行为、API、环境变量、数据表结构或命令变更时，同步更新文档
- 除非任务明确要求，否则不引入新框架
- 不在代码中硬编码密钥、token、密码或环境相关 URL
- 保持示例代码可运行，或明确标注为模板示例
- API 使用统一响应信封：`success`、`data`、`error`、`meta`
- Codex 专属行为写在本文件或 `.codex/` 目录下

## 决策记录

在做影响架构的修改之前，先阅读 `docs/decisions/` 目录下相关的决策记录。
理解已有决策的原因。如果新方案与已有决策冲突，先与用户讨论。

## 验证

- 仅文档变更时，检查链接、路径和示例的一致性
- 后端变更时，优先运行最相关的后端测试
- 前端变更时，优先运行最相关的前端测试
- 如果验证命令不可用，在最终回复中说明

## Demo 领域

默认 Demo 是一个带用户和任务的 Todo 应用。用它来展示认证、授权、CRUD、校验、分页、错误处理和部署的约定。
