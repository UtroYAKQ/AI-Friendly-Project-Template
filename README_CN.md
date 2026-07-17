# AI 友好项目模板

这个仓库是一个用于学习如何构建 **AI 友好项目** 的模板。它不只是提供一个 demo 应用，更重要的是展示如何组织项目知识，让 Codex、Claude Code 等 AI 编程工具能更准确地理解项目、遵守约束，并写出更贴近项目风格的代码。

核心思想很简单：

> 当项目拥有清晰上下文、稳定契约、明确边界、可复制示例和验证规则时，AI 写代码会明显更可靠。

## 适合谁学习

如果你想学习下面这些内容，这个模板会很适合：

- 如何设计一个方便 AI 阅读的项目结构。
- 如何区分“产品知识”和“某个 AI 工具自己的配置”。
- 如何在让 AI 写代码前提供足够上下文。
- 如何保持文档、API 契约、数据库设计、测试和部署说明同步。
- 如何用小型 demo 应用教会未来贡献者和 AI 项目的代码风格。

## 什么是 AI 友好项目

普通项目经常依赖团队成员脑子里的隐性知识；AI 友好项目会把这些知识显式写出来。

| 领域 | AI 需要知道什么 | 本模板放在哪里 |
| --- | --- | --- |
| 项目目标 | 系统做什么，为什么存在 | `README.md` / `README_CN.md` |
| AI 工作流 | AI 做任务时应该先读什么、怎么验证 | `docs/ai-guide.md` |
| 架构 | 模块边界、依赖方向、职责划分 | `docs/architecture.md` |
| 业务逻辑 | 用户流程和验收标准 | `docs/business-flow.md` |
| API 契约 | 请求、响应、状态码、分页、错误格式 | `docs/api-contracts.md` |
| 数据库设计 | 表、字段、索引、约束、迁移规则 | `docs/database-schema.md` |
| 数据库迁移 | 可执行的建表、回滚、变更脚本 | `apps/demo-backend/migrations/` |
| 错误处理 | 稳定的机器可读错误码 | `docs/error-codes.md` |
| 编码规范 | 命名、分层、日志、校验、错误处理 | `docs/coding-standards.md` |
| 测试 | 应该测什么、如何运行测试 | `docs/testing.md` |
| 安全 | 鉴权、权限、输入校验、敏感信息 | `docs/security.md` |
| 部署 | 环境变量、Docker、生产检查项 | `docs/deployment.md` |
| 工具规则 | Codex 或 Claude Code 自己的行为约束 | `AGENTS.md`、`.claude/CLAUDE.md` |

## 项目结构

```text
apps/
  demo-backend/          最小 Todo API 示例
    migrations/          数据库迁移示例
  demo-frontend/         最小 Todo UI 示例

docs/
  ai-guide.md            AI 辅助开发的共享工作流
  architecture.md        系统边界和依赖方向
  business-flow.md       产品流程和验收标准
  api-contracts.md       API 请求/响应示例
  database-schema.md     表、字段、索引、迁移规则
  error-codes.md         稳定后端错误码
  coding-standards.md    命名、分层、校验、日志规则
  testing.md             单测、集成测试、E2E 测试策略
  security.md            鉴权、权限、校验、密钥管理
  deployment.md          本地、开发、生产部署说明

docker/
  docker-local/          本地完整 demo 的 Compose 文件
  docker-dev/            共享开发环境 Compose 文件
  docker-prod/           生产风格 Compose 示例

.claude/
  CLAUDE.md              Claude Code 专用项目说明
  rules/api.md           Claude Code 的 API 规则

.codex/
  AGENTS.md              `.codex/` 目录下的 Codex 局部规则
  config.toml            Codex 本地配置占位

AGENTS.md                Codex 项目说明
.env.example             安全的环境变量示例
.gitignore               忽略生成文件、本地文件和敏感文件
```

## 重要设计原则

不要混用不同 AI 工具的配置。

- `AGENTS.md` 给 **Codex** 使用。
- `.claude/CLAUDE.md` 给 **Claude Code** 使用。
- `docs/` 放 **共享的产品知识和工程规范**。

这样设计是因为不同 AI 工具会自动读取不同文件。如果把所有规则混在一起，AI 可能读错上下文，或者把某个工具的行为规则误用到另一个工具里。

## 推荐阅读顺序

如果你是第一次学习这个模板，建议按这个顺序看：

1. `README_CN.md` - 理解项目目的和整体结构。
2. `docs/ai-guide.md` - 理解 AI 应该如何做任务。
3. `docs/architecture.md` - 理解系统分层和模块边界。
4. `docs/business-flow.md` - 理解 Todo demo 的业务流程。
5. `docs/api-contracts.md` - 学习如何写 API 契约。
6. `docs/database-schema.md` - 学习如何写数据库结构说明。
7. `apps/demo-backend/migrations/` - 学习数据库迁移文件如何落地。
8. `docs/coding-standards.md` - 学习如何给 AI 明确编码规范。
9. `docs/testing.md` 和 `docs/security.md` - 学习质量和安全要求。
10. `apps/demo-backend/README.md` 和 `apps/demo-frontend/README.md` - 看文档如何映射到代码。

## 如何把这个模板用到真实项目

### 1. 先写业务流程

在让 AI 写代码前，先把真实用户流程写进 `docs/business-flow.md`。

好的例子：

```text
流程：创建 Todo
1. 用户输入标题。
2. 后端校验标题不能为空，并且最多 120 个字符。
3. 后端创建属于当前用户的 Todo。
4. 前端把新 Todo 放到列表顶部。

验收标准：
- 空标题返回 VALIDATION_ERROR。
- 未登录请求返回 UNAUTHORIZED。
- 新建 Todo 的 completed 默认为 false。
```

不好的例子：

```text
用户可以管理 Todo。
```

坏例子太模糊。AI 会被迫猜测校验规则、数据归属、响应结构和异常场景。

### 2. 先定义 API 契约，再实现接口

在让 AI 实现接口之前，先在 `docs/api-contracts.md` 写清楚请求和响应。

好的 API 契约应该包含：

- HTTP 方法和路径。
- 是否需要鉴权。
- 请求体示例。
- 成功响应示例。
- 错误响应示例。
- 列表接口的分页格式。
- 稳定错误码。

这样可以避免 AI 为不同接口发明不同的响应格式。

### 3. 文档和迁移文件要同时存在

`docs/database-schema.md` 负责解释数据库设计意图，`apps/demo-backend/migrations/` 负责保存可执行的数据库变更脚本。

两者职责不同：

- 文档回答“为什么这样设计”。
- 迁移文件回答“数据库如何实际变更”。

好的规则：

```text
每次修改表、字段、索引或约束时，都必须同步更新：
1. docs/database-schema.md
2. apps/demo-backend/migrations/
3. 相关 API 或业务文档
```

这能帮助 AI 避免只改代码、不改数据库脚本，或者只改文档、不提供可执行迁移的情况。

### 4. 明确数据归属和权限边界

在 `docs/database-schema.md` 中，不要只列字段，还要写清楚数据归属和重要约束。

例子：

```text
每个 Todo 都通过 todos.user_id 属于一个用户。
用户只能读取和修改自己的 Todo。
普通列表查询必须排除 deleted_at 不为空的数据。
```

这样可以帮助 AI 避免返回其他用户数据这类安全问题。

### 5. 明确架构边界

在 `docs/architecture.md` 中告诉 AI 逻辑应该放在哪里。

例子：

```text
route/controller -> service -> repository -> database
```

然后解释每层职责：

- Route 负责解析 HTTP 输入和输出。
- Service 负责业务规则。
- Repository 负责持久化。
- Shared 工具负责错误、响应、配置、日志。

如果不写清楚，AI 很容易把业务逻辑写进路由，或者把数据库代码写进 UI 组件。

### 6. 编码规范要具体

`docs/coding-standards.md` 里的规则要让 AI 可以直接执行。

好的规则：

- 文件使用 kebab-case，例如 `todo-service.ts`。
- 类型使用 PascalCase，例如 `TodoService`。
- 函数使用 camelCase，例如 `createTodo`。
- API 错误必须使用 `docs/error-codes.md` 中的错误码。
- API 响应不能暴露内部堆栈。

不好的规则：

```text
写干净的代码。
```

这类规则太抽象，AI 不知道具体应该怎么做。

### 7. 保留小而完整的 demo 代码

本项目的 demo app 故意很小。它的作用不是作为生产框架，而是给 AI 和新人提供可复制的局部模式。

后端 demo 展示：

- Route、Service、Repository 分层。
- 统一响应 envelope。
- 类型化 HTTP 错误。
- 输入校验。
- 具备所有权概念的 Todo 模型。
- 数据库迁移文件示例。

前端 demo 展示：

- 页面级状态管理。
- 展示型组件。
- 集中的 API client。
- loading、empty、error、success 状态。

真实项目变大后，也建议保留一两个清晰的小示例。AI 经常会复制附近的代码模式。

## 如何更好地给 AI 下任务

### 弱提示词

```text
加一个编辑 Todo 的功能。
```

这个提示太弱，因为 AI 必须猜 UI 行为、API 形状、校验规则、测试和文档更新。

### 强提示词

```text
添加 Todo 标题编辑功能。

先阅读这些文件：
- docs/business-flow.md
- docs/api-contracts.md
- docs/coding-standards.md
- docs/error-codes.md
- docs/database-schema.md

要求：
- 使用 PATCH /api/v1/todos/{id}。
- 保持 API response envelope 不变。
- 使用后端已有的标题长度校验规则。
- 前端更新状态时不要刷新页面。
- 添加或更新成功、空标题、Todo 不存在的测试。
- 如果契约变化，同步更新文档。
- 如果数据库结构变化，同步添加 migration。
```

强提示词给了 AI 上下文、边界和验收标准。

## 推荐 AI 工作流

对于非简单修改，建议使用这个循环：

```text
1. 阅读相关文档。
2. 总结当前行为。
3. 确认要修改的文件。
4. 制定小计划。
5. 实现最小可用改动。
6. 运行聚焦验证。
7. 如果行为变化，同步更新文档。
8. 汇报改了什么、验证了什么。
```

更详细的工作流见 `docs/ai-guide.md`。

## Demo 应用概览

本模板使用个人 Todo 应用作为 demo 领域。

### 后端

路径：`apps/demo-backend/`

关键文件：

- `src/server.ts` - 创建 HTTP server。
- `src/todos/todo-routes.ts` - 把 HTTP 请求映射到 service。
- `src/todos/todo-service.ts` - 做校验和业务规则。
- `src/todos/todo-repository.ts` - 使用内存保存 Todo。
- `src/shared/response.ts` - 创建成功/失败响应 envelope。
- `src/shared/http-error.ts` - 定义类型化 API 错误。
- `migrations/0001_create_users_and_todos.sql` - 创建 users 和 todos 表。
- `migrations/0001_create_users_and_todos.down.sql` - 回滚 users 和 todos 表。

### 前端

路径：`apps/demo-frontend/`

关键文件：

- `src/App.tsx` - 协调加载、变更和页面状态。
- `src/api/todo-api.ts` - 统一管理后端 API 请求。
- `src/components/TodoForm.tsx` - 创建 Todo 表单。
- `src/components/TodoList.tsx` - Todo 列表和用户操作。
- `src/styles.css` - demo 本地样式。

## 运行 Demo

如果直接运行 demo app，可以分别安装依赖：

```bash
cd apps/demo-backend
npm install
npm run dev
```

```bash
cd apps/demo-frontend
npm install
npm run dev
```

也可以在仓库根目录使用 Docker Compose：

```bash
docker compose -f docker/docker-local/docker-compose.yml up --build
```

本地 URL：

- 后端：`http://localhost:3000/api/v1/todos`
- 前端：`http://localhost:5173`

## 环境变量

创建真实本地环境文件时，可以复制 `.env.example`。

```bash
cp .env.example .env
```

不要提交真实 `.env` 文件。`.gitignore` 会忽略 `.env` 和 `.env.*`，但允许提交 `.env.example`。

## 数据库迁移约定

迁移文件放在 `apps/demo-backend/migrations/`。

推荐命名：

```text
0001_create_users_and_todos.sql
0001_create_users_and_todos.down.sql
0002_add_todo_priority.sql
0002_add_todo_priority.down.sql
```

规则：

- 每个正向迁移都要有对应的回滚迁移。
- 迁移文件只描述数据库结构或数据迁移，不写业务逻辑。
- 修改表结构时同步更新 `docs/database-schema.md`。
- 修改字段语义时同步更新 API、业务流程和测试文档。
- 生产环境删除字段前，先确认没有旧版本应用仍在读取该字段。

## 文档维护规则

代码变化时，文档要在同一个任务里更新：

| 如果你修改了 | 也要更新 |
| --- | --- |
| API 路径、请求、响应、状态码 | `docs/api-contracts.md` |
| 业务行为或验收标准 | `docs/business-flow.md` |
| 表、字段、索引、迁移 | `docs/database-schema.md`、`apps/demo-backend/migrations/` |
| 错误码或错误含义 | `docs/error-codes.md` |
| 鉴权、权限、校验、密钥 | `docs/security.md` |
| 测试命令或测试策略 | `docs/testing.md` |
| 端口、环境变量、Docker、部署流程 | `docs/deployment.md` |
| 编码模式或命名规则 | `docs/coding-standards.md` |

这是 AI 友好项目最重要的习惯之一：**文档和代码必须一起演进**。

## 项目检查清单

把这个模板改造成真实项目时，可以使用下面的清单：

- [ ] `README.md` / `README_CN.md` 说明项目目标、结构、启动方式和学习路径。
- [ ] `AGENTS.md` 只包含 Codex 指令。
- [ ] `.claude/CLAUDE.md` 只包含 Claude Code 指令。
- [ ] 共享规则放在 `docs/`，不放在某个 AI 工具的私有配置里。
- [ ] `docs/business-flow.md` 描述真实用户流程和验收标准。
- [ ] `docs/api-contracts.md` 包含具体请求/响应示例。
- [ ] `docs/database-schema.md` 记录数据归属、索引和迁移规则。
- [ ] `apps/demo-backend/migrations/` 包含可执行迁移和回滚迁移。
- [ ] `docs/error-codes.md` 包含稳定的机器可读错误码。
- [ ] `docs/coding-standards.md` 给出具体、可执行的编码规则。
- [ ] `docs/testing.md` 说明必须测试什么以及如何运行测试。
- [ ] `docs/security.md` 说明鉴权、权限、校验和敏感信息规则。
- [ ] `docs/deployment.md` 说明环境、环境变量和发布检查项。
- [ ] 核心后端和前端模式都有简单 demo 可供 AI 复制。
- [ ] `.env.example` 只包含安全示例配置。
- [ ] `.gitignore` 排除生成文件、密钥、缓存和本地数据。

## 常见错误

尽量避免这些做法：

- 只把产品需求写在 AI 聊天记录里，不落到项目文档。
- 不同接口使用不同响应格式。
- 混用 Codex 和 Claude Code 的配置文件。
- 还没写 API 契约就让 AI 实现接口。
- 文档说一套，代码做另一套。
- 只有复杂生产代码，没有小而清晰的示例给 AI 复制。
- 修改数据库结构但没有 migration。
- 提交真实密钥、本地数据库、构建产物或依赖目录。

## 为什么这样有效

AI 编程工具最擅长复制一致的本地模式，最不擅长猜测隐藏意图。这个模板通过下面这些方式减少猜测：

- 给 AI 清晰入口。
- 明确项目边界。
- 提供具体示例。
- 保持稳定契约。
- 写明验证要求。
- 区分不同 AI 工具的专用指令。
- 用数据库迁移文件把 schema 变更落地。

它不能让 AI 永远不犯错，但能显著提高 AI 写出“符合你项目”的代码的概率，而不是写出泛泛的通用代码。
