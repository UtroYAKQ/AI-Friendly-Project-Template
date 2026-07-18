# AI 项目入门指南

> 本教程教你如何为 AI 编程助手（Codex、Claude Code）编写高质量的项目文档，让 AI 准确理解项目、遵守约束、少犯错误。

本仓库是一个用于学习如何构建 **AI 友好软件项目** 的模板。它的目标不仅是提供一个 Demo 应用，更重要的是教你如何组织项目知识，让 Codex、Claude Code 等 AI 工具能准确理解项目、遵守约束、产出更可靠的代码。

核心思想很简单：

> 当项目有清晰的上下文、稳定的契约、明确的边界、可运行的示例和可验证的规则时，AI 能写出更好的代码。

---

## 写给 AI 看的项目文档：完整教程

本教程将带你从零开始，学习如何为 AI 编写高质量的项目文档（AGENTS.md、CLAUDE.md 及 docs/ 目录下的各类文档），让你的 AI 编程助手真正理解项目、遵守规则、少犯错误。

### 第一章：理解 AGENTS.md 和 CLAUDE.md

#### 它们是什么？

`AGENTS.md` 和 `CLAUDE.md` 是 AI 编程工具的 **入口指令文件**。当你在项目中打开 Codex 或 Claude Code 时，这些工具会 **自动读取** 对应的文件，将其中的指令作为系统提示词的一部分。

| 文件 | 工具 | 存放位置 |
| --- | --- | --- |
| `AGENTS.md` | Codex（OpenAI Codex CLI） | 项目根目录，或 `.codex/AGENTS.md` |
| `CLAUDE.md` | Claude Code（Anthropic） | 项目根目录，或 `.claude/CLAUDE.md` |

#### 最重要的设计原则：工具指令分离

**不要把 Codex 的指令和 Claude Code 的指令混在同一个文件里。**

```text
❌ 错误做法：
   把所有 AI 指令都写在 AGENTS.md 里，期望 Claude Code 也能读取。

✅ 正确做法：
   - AGENTS.md → 只写 Codex 专属行为
   - .claude/CLAUDE.md → 只写 Claude Code 专属行为
   - docs/ → 写共享的产品知识和工程规范
```

为什么必须分离？因为：
- 不同工具的读取机制不同（Codex 读 `AGENTS.md`，Claude Code 读 `CLAUDE.md`）
- 工具专属配置混在一起会导致指令冲突或遗漏
- 共享知识放在 `docs/` 中，由两个工具的入口文件各自引用

#### 入口文件应该写什么？

**AGENTS.md / CLAUDE.md 应该写的是"这个工具应该怎么在这个项目里工作"**，而不是"这个项目是做什么的"。

一个好的入口文件通常包含以下内容：

```markdown
# [工具名] Project Instructions

## 上下文文件（Context Files）
- 先读 README.md 了解项目目的。
- 读 docs/ai-guide.md 了解共享工作流。
- 读 docs/architecture.md 了解系统边界。
- 读 docs/coding-standards.md 了解编码规范。
- 读 docs/tech-stack.md 了解技术栈约束。

## 行为规则（Behavior）
- 实现模糊需求前先解释你的假设。
- 保持代码变更与架构文档一致。
- API 行为变更时同步更新文档、错误码和测试。
- 不要在 Demo 代码中使用过度抽象。
```

**关键技巧**：用"先读 X 文件"的方式建立引用链。AI 会顺着这条链自动获取上下文，你不需要在每次对话中重复说明。

---

### 第二章：如何编写 AI 能准确执行的规范

#### 2.1 技术栈要写清楚——这是最容易踩的坑

**很多人在项目一开始没有明确告诉 AI 用了什么技术栈。** AI 只能靠猜，结果就是：

```text
❌ 你心里想的：Express + TypeScript + PostgreSQL
   AI 生成的：Koa + JavaScript + MongoDB
   然后你花一下午改回来。
```

**正确做法**：在 `docs/` 下创建 `tech-stack.md`，明确列出使用的技术和不使用的技术：

```markdown
## 技术栈

| 层 | 技术 | 版本 | 备注 |
| --- | --- | --- | --- |
| 运行时 | Node.js | >= 20 LTS | |
| 语言 | TypeScript | 5.x | strict 模式 |
| 后端框架 | Express | 4.x | |
| 数据库 | PostgreSQL | 16 | 通过 pg 驱动连接 |
| ORM | 无，手写 SQL | - | 迁移文件在 apps/demo-backend/migrations/ |
| 前端框架 | React | 18.x | |
| 构建工具 | Vite | 5.x | |
| 包管理 | npm | - | 不使用 yarn 或 pnpm |
| 测试 | Vitest | - | 前端和后端统一使用 |
| 代码风格 | Biome | - | 用于格式化和 lint |

## 明确不使用的技术
- 不使用 Prisma / Drizzle 等 ORM
- 不使用 Next.js（前端是纯 React SPA）
- 不使用 Redis
```

**为什么要写"不使用的技术"？** 因为 AI 在不确定时会倾向于使用流行的默认选择。如果你明确排除了某些技术，AI 就不会浪费时间生成你不需要的代码。

#### 2.2 模块设计和分层架构——不说清楚 AI 就乱放代码

**这是第二大坑：没有告诉 AI 代码应该放在哪里。** 结果就是业务逻辑跑到路由处理器里、数据库查询写到 UI 组件里。

在 `docs/architecture.md` 中，你必须描述清楚分层规则：

```markdown
## 分层架构

route/controller → service → repository → database

### 各层职责

| 层 | 职责 | 不能做的事 |
| --- | --- | --- |
| Route | 解析 HTTP 请求，调用 Service，返回 HTTP 响应 | 不能包含业务逻辑 |
| Service | 实现业务规则，校验数据，调用 Repository | 不能直接操作数据库 |
| Repository | 封装所有数据库查询 | 不能包含业务判断 |
| Shared | 通用工具：错误类、响应格式化、日志 | 不能依赖任何业务模块 |

### 依赖方向

上层可以依赖下层，下层绝不能依赖上层。
Shared 可以被任何层依赖。

### 目录结构反映架构

apps/demo-backend/src/
  server.ts          ← 入口
  shared/            ← 跨层共享
    http-error.ts
    response.ts
  todos/             ← 按领域模块组织
    todo-model.ts    ← 类型定义
    todo-routes.ts   ← 路由层
    todo-service.ts  ← 业务层
    todo-repository.ts ← 数据层
```

**关键技巧**：不仅说"应该做什么"，还要说"不能做什么"。AI 对否定句同样敏感，明确的禁止比模糊的提倡更有效。

#### 2.3 编码规范——抽象不如具体

很多人在 `docs/coding-standards.md` 里写：

```text
❌ "Write clean, readable code."
❌ "Follow best practices."
❌ "Use proper error handling."
```

这些 AI **无法可靠执行**。什么是 "clean"？什么是 "best practice"？AI 只能猜。

正确写法——把每一条规范变成可验证的规则：

```markdown
## 命名规范

| 对象 | 规范 | 示例 |
| --- | --- | --- |
| 文件名 | kebab-case | `todo-service.ts` |
| 类型/接口 | PascalCase | `TodoService`、`CreateTodoInput` |
| 函数/变量 | camelCase | `createTodo`、`todoList` |
| 常量 | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` |
| 数据库列 | snake_case | `user_id`、`created_at` |

## 错误处理

- API 错误必须使用 `docs/api-contracts/error-codes.md` 中定义的标准错误码
- 返回给客户端的错误响应使用统一信封格式（见 API Rules）
- 不得在 API 响应中暴露堆栈跟踪
- 数据库错误必须在 Repository 层转换为业务错误
- Service 层不得直接抛出数据库驱动错误

## 文件组织

- 每个文件只导出一个主要模块
- 类型定义放在 `*-model.ts` 中
- 测试文件与源文件同目录，命名为 `*.test.ts`
```

#### 2.4 用好"示例代码"——AI 通过模仿学习

AI 编码工具最强的能力之一是**模式匹配和模仿**。在 Demo 应用中放几个小而完整的代码示例，比写十页规范文档更有效：

```text
后端 Demo 展示了：
- Route → Service → Repository 三层分离的完整实现
- 统一的响应信封格式
- 类型化 HTTP 错误
- 输入校验模式
- 数据所有权检查模式

当 AI 需要添加新功能时，它会自动复制附近的代码风格。
```

**关键技巧**：Demo 代码要刻意保持简单。过度设计（大量抽象层、泛型、工厂模式）的 Demo 不能帮助 AI——它会学到错误的复杂度。

---

### 第三章：决策记录——让 AI 理解"为什么这么做"

#### 为什么需要决策记录？

代码告诉 AI "做了什么"，但不会告诉它"为什么这样做"。当你对 AI 说"把这个模块重构一下"时，没有决策记录，AI 可能把你刻意选择的架构又改回去了。

**决策记录（Decision Records）** 就是用来保存这些"为什么"的文档。

#### 决策记录模板

在 `docs/decisions/` 目录下为每个重要决策创建一个文件，命名格式：`YYYY-MM-DD-简短描述.md`

```markdown
# 决策：手写 SQL 而非使用 ORM

**日期**：2026-07-18
**状态**：已采纳
**决策者**：开发团队

## 背景

项目需要一个数据访问层。社区普遍推荐 Prisma 或 Drizzle 等 ORM 工具。

## 决策

使用手写 SQL + `pg` 驱动，不使用 ORM。

## 原因

- 本项目是一个教学模板，手写 SQL 让学习者更清楚数据库操作
- SQL 迁移文件对 AI 完全透明，AI 可以直接读取 SQL 理解数据模型
- 避免 ORM 的"魔法"——AI 难以推断 ORM 生成的查询，调试更困难
- 项目数据模型简单，不需要 ORM 的关系映射功能

## 替代方案

- **Prisma**：被否决，因为引入额外的 schema 语法学习成本，生成的 SQL 不透明
- **Drizzle**：被否决，虽然比 Prisma 更轻量，但仍增加了抽象层

## 影响

- 需要手写迁移 SQL 文件
- Repository 层代码中直接写 SQL 查询
- AI 可以通过读取 .sql 文件完全理解数据结构
- 新加入的开发者需要熟悉 SQL
```

#### 什么时候需要写决策记录？

| 场景 | 示例 |
| --- | --- |
| 选择了一个非主流的技术方案 | 手写 SQL vs ORM |
| 有意违反了一个常见模式 | 不使用依赖注入框架 |
| 未来可能会被质疑的设计 | 单体仓库 vs 多仓库 |
| 两个方案各有优劣时的取舍 | React Context vs Redux |

#### 如何让 AI 利用决策记录

在 AGENTS.md 或 CLAUDE.md 中加入：

```markdown
## 决策记录

在做影响架构的修改之前，先阅读 docs/decisions/ 目录下相关的决策记录。
理解已有决策的原因。如果新方案与已有决策冲突，先与用户讨论。
```

这样 AI 在提出"要不要引入 Prisma"这类建议之前，会先读到项目已经做出了相反的决定。

---

### 第四章：文档驱动的工作流

#### AI 的操作手册：`docs/ai-guide.md`

`docs/ai-guide.md` 是整个文档体系中**最重要的文件之一**。它不是讲"项目是做什么的"，而是讲 **"AI 应该怎么和这些文档互动"**——它是 AI 在这个项目里的操作手册。

这个文件必须写清楚三件事：

```text
1. 读文档的规则 — AI 接到任务后，按什么顺序读哪些文档
2. 更新文档的规则 — 代码改了之后，哪些文档必须同步更新
3. 标准工作流程 — 从接到任务到完成报告的完整步骤
```

完整的 `ai-guide.md` 示例见下方「第八章 → Demo 3」。

#### AI 的标准工作流程

AI 在项目中遵循以下工作流（定义在 `docs/ai-guide.md` 中）：

```markdown
# AI 开发工作流

对于任何非平凡的变更，按以下步骤进行：

1. **读取相关文档** — 理解当前约定
2. **总结当前行为** — 复述你对现状的理解
3. **列出要修改的文件** — 明确变更范围
4. **制定小计划** — 先计划后执行
5. **实现最小的有用变更** — 小步前进
6. **运行聚焦的验证** — 验证你改了的东西
7. **更新文档** — 对照映射表逐项更新
8. **结构化报告** — 按固定格式输出：变更摘要 + 代码变更 + 文档同步检查 + 验证结果 + 注意事项
```

#### 文档同步规则——最重要的工作习惯

这是 AI 友好项目最重要的习惯：**文档和代码必须一起演化**。

在 AGENTS.md/CLAUDE.md 中明确：

```markdown
## 文档同步规则

| 如果你改了 | 同时检查并更新 |
| --- | --- |
| API 路径、请求体、响应体、HTTP 状态码 | docs/api-contracts/ |
| 业务行为、验收条件 | docs/business-flow.md |
| 数据表、字段、索引 | docs/database-schema.md + 创建迁移文件 |
| 错误码含义 | docs/api-contracts/error-codes.md |
| 认证、权限、校验、安全规则 | docs/security.md |
| 端口、环境变量、Docker、部署流程 | docs/deployment.md |
| 编码模式、命名规范 | docs/coding-standards.md |
| 前端组件、样式、交互规范 | docs/frontend-design.md |
| 测试策略、测试命令 | docs/testing.md |
| 新增或重构业务模块 | docs/modules/xxx-module.md + docs/modules/README.md |
| 技术栈选型（加新库/去旧库） | docs/tech-stack.md + docs/decisions/ |
| 重要技术决策 | docs/decisions/YYYY-MM-DD-xxx.md |
```

---

### 第五章：新手最常踩的坑（深度解析）

#### 坑 #1：没在第一步说清楚技术栈

**症状**：AI 生成的代码用了错误的框架、语言特性或第三方库，需要大量返工。

**真实场景**：

```text
你：帮我加一个用户注册接口。
AI：（生成了一个用 Prisma + Redis 的实现）
你：我们没有用 Prisma 和 Redis...
AI：好的，那我用 Knex + MongoDB...
你：也不是，我们手写 SQL + PostgreSQL...
```

**为什么会这样？** AI 没有关于你技术栈的上下文，它只能从训练数据中按概率选择最常见的组合。而大多数项目的技术栈对于 AI 来说是"隐藏信息"。

**解决方案**：
1. 在项目中创建 `docs/tech-stack.md`，列出所有使用的技术及版本
2. 同时列出**明确不使用**的技术（避免 AI 反复推荐）
3. 在 AGENTS.md / CLAUDE.md 中的"Context Files"部分列出 tech-stack.md，让 AI 第一步就读到

#### 坑 #2：模块边界模糊——AI 不知道代码往哪放

**症状**：AI 把业务逻辑写在路由处理器里，把数据库查询写在 UI 组件里，代码越写越乱。

**真实场景**：

```text
你：帮我加一个"已完成 Todo 归档"功能。
AI：（在 todo-routes.ts 里写了 200 行业务逻辑 + 数据库查询）
你：逻辑应该放在 service 层...
AI：好的。（下次又在另一个路由里写了一样的错误模式）
```

**为什么会这样？** 很多项目没有文档记录模块边界，架构只存在于老员工的脑子里。AI 看不到这些"隐形知识"。

**解决方案**：
1. `docs/architecture.md` 必须描述每一层的职责和禁止事项
2. `docs/modules/` 为每个业务模块单独写文档，描述其职责、依赖和边界
3. Demo 代码要正确展示三层分离，AI 会模仿就近的代码
4. 在 AGENTS.md 中明确："实现新功能前，先读架构文档确认代码应该放在哪一层"

#### 坑 #3：没有写数据所有权规则

**症状**：AI 生成的查询忘记加 `WHERE user_id = ?`，导致用户可以访问其他人的数据。

**真实场景**：

```text
你：帮我加一个获取 Todo 详情的接口。
AI：SELECT * FROM todos WHERE id = ?
你：（差点上线了一个越权漏洞）
```

**为什么会这样？** AI 知道怎么做 CRUD，但不知道你的数据所有权模型——除非你明确告诉它。

**解决方案**：在 `docs/database-schema.md` 中明确写：

```markdown
## 数据所有权

- 每个 Todo 通过 `todos.user_id` 归属到唯一用户
- 用户只能读取和修改自己的 Todo
- **所有涉及 Todo 的查询都必须包含 `WHERE user_id = ?` 条件**
- 软删除记录（deleted_at 不为 NULL）在普通查询中应被排除
- 分享功能尚未实现，不要自行添加
```

#### 坑 #4：错误处理各自为政

**症状**：API A 返回 `{ error: "not found" }`，API B 返回 `{ code: 404, msg: "资源不存在" }`，前端对接疯掉。

**为什么会这样？** 你没有在文档中定义统一的错误格式，AI 每次都是"即兴发挥"。

**解决方案**：
1. 在 `docs/api-contracts/error-codes.md` 中定义所有错误码和响应格式
2. 创建 `shared/http-error.ts` 作为统一的错误类
3. 在 API Rules 中写清楚：所有错误必须使用该格式
4. Demo 代码中给出正确的错误返回示例

#### 坑 #5：把什么都写在一个文件里

**症状**：AGENTS.md 写了几千行，既有产品描述、又有 API 文档、又有代码规范、又有部署指南。

**为什么会这样？** 一开始觉得方便，但：
- AI 的上下文窗口有限，超长文件可能被截断
- 更新困难，改一个小规则要翻很久
- 不同 AI 工具的配置混在一起

**解决方案**：

```text
✅ 正确的文件拆分：

项目根目录：
  AGENTS.md              → Codex 入口（~50 行），引用 docs/ 下的共享文档
  CLAUDE.md              → Claude Code 入口（~50 行），引用 docs/ 下的共享文档

.claude/
  CLAUDE.md              → Claude Code 入口指令
  settings.json          → 项目设置

docs/                    → 工具无关的共享产品知识
  tech-stack.md           → 技术栈
  ai-guide.md             → AI 工作流（如何读文档、更新文档）
  architecture.md          → 系统架构和分层
  modules/                → 按模块拆分的详细设计文档
    user-module.md         → 用户模块
  business-flow.md         → 业务流程和验收条件
  api-contracts/           → API 契约（按资源拆分）
    user-api.md            → 用户相关 API
    error-codes.md         → 错误码定义
  frontend-design.md       → 前端设计规范
  database-schema.md       → 数据库设计
  coding-standards.md      → 编码规范
  testing.md               → 测试策略
  security.md              → 安全规范
  deployment.md            → 部署说明
  decisions/               → 架构决策记录
```

#### 坑 #6：Demo 代码太复杂或没有 Demo

**症状**：项目里全是生产代码，抽象了七八层，AI 看完不知道怎么写一个简单的 CRUD。

**为什么会这样？** AI 通过模仿就近代码来工作。如果最近的代码是一个高度抽象的工厂模式的泛型依赖注入框架，AI 会学着写同样的复杂度。

**解决方案**：
- 保留一两个刻意简化的 Demo 模块（如本模板的 Todo Backend/Frontend）
- Demo 代码的复杂度要低于生产代码，模式要清晰
- 当项目变大后，Demo 可以留在 `/apps/demo-*/` 或 `/examples/` 目录

#### 坑 #7：文档和代码脱节

**症状**：文档说 API 返回 `{ data: [...] }`，代码实际返回 `{ items: [...] }`。AI 读了文档后写的代码符合文档但不符合实际。

**为什么会这样？** 因为文档和代码的更新没有建立强制关联。人们改完代码就忘了更新文档。

**解决方案**：
1. 在 AGENTS.md/CLAUDE.md 中设置硬性规则："代码行为变更时，必须同时更新相关文档"
2. 每次 AI 完成变更后，让它列出修改了哪些文件、更新了哪些文档
3. 做 Code Review 时同时检查文档是否同步

#### 坑 #8：需求描述太模糊

**症状**：对 AI 说"帮我加个搜索功能"，然后收到一个跟预期完全不同的实现。

**为什么会这样？** "搜索"可以有很多理解：前端过滤？后端 LIKE 查询？全文索引？Elasticsearch？AI 只能猜。

**解决方案**：在 `docs/business-flow.md` 中用**验收条件**的方式写需求：

```markdown
## 流程：搜索 Todo

1. 用户在输入框输入关键词
2. 前端将关键词作为 query param 发给后端
3. 后端对 `todos.title` 做 `LIKE %keyword%` 查询
4. 结果按 `created_at DESC` 排序
5. 返回匹配当前用户的所有 Todo，分页

### 验收条件
- 空关键词返回全部 Todo（不过滤）
- 关键词少于 2 个字符时返回 VALIDATION_ERROR
- 搜索仅限当前用户的 Todo（带上 user_id）
- 不搜索软删除的 Todo
- 前端在用户停止输入 300ms 后才发送请求（debounce）

### 不在范围内（暂不实现）
- 全文搜索/分词
- 搜索 Todo 描述内容
- 搜索历史记录
```

好需求 = 明确的输入/输出 + 边界条件 + 排除范围。

---

### 第六章：AI 友好文档的自检清单

用这个清单检查你的项目文档是否"AI 就绪"：

- [ ] AI 工具能在 3 步以内找到技术栈信息（通过 AGENTS.md → docs/tech-stack.md 的引用链）
- [ ] 架构文档描述了"什么代码属于哪一层"和"什么是禁止的"
- [ ] 每个业务模块有独立的 `docs/modules/xxx-module.md` 描述职责和边界
- [ ] 有一个 Demo 模块展示正确的代码模式
- [ ] API 错误格式有文档且被所有端点一致使用
- [ ] 数据所有权规则有明确文档（谁的数据、谁能读、谁能写）
- [ ] 数据库文档不仅列字段，还解释关系和约束
- [ ] 前端设计规范独立成文（`docs/frontend-design.md`），不混在后端规范中
- [ ] 重要决策有记录，包含"为什么选择这个方案"
- [ ] 编码规范是具体的、可验证的规则（不是"写干净的代码"）
- [ ] 文档和代码的同步关系有明确维护规则
- [ ] AGENTS.md 和 CLAUDE.md 只包含该工具专属的指令
- [ ] 所有文档文件路径都是稳定的（AI 和其他开发者能找到）
- [ ] 业务流程文档包含验收条件和不在范围内的说明

---

### 第七章：给 AI 写 Prompt 的实战技巧

#### 弱 Prompt vs 强 Prompt

**弱 Prompt**——AI 需要猜测一切：

```text
帮我加个编辑功能。
```

**强 Prompt**——给 AI 画好了边界：

```text
添加 Todo 标题编辑功能。

先读取以下文件：
- docs/business-flow.md（了解编辑流程的验收条件）
- docs/api-contracts/（了解 PATCH 端点的契约）
- docs/coding-standards.md（了解命名和分层规则）
- docs/api-contracts/error-codes.md（了解可用错误码）

要求：
- 使用 PATCH /api/v1/todos/{id}
- 保持 API 响应信封格式不变
- 复用现有的标题长度校验规则
- 更新前端状态不刷新页面
- 添加测试：成功编辑、空标题、Todo 不存在
- 如果 API 契约有变化，更新对应文档
```

#### 让 AI 先读文档再动手

在 AGENTS.md 或 CLAUDE.md 中写好引用链后，你可以直接用一句话触发：

```text
按项目规范，帮我加一个 Todo 优先级字段。
```

AI 会自动按照入口文件 → ai-guide.md → architecture.md → coding-standards.md 的链条获取上下文，然后：
- 知道去 `database-schema.md` 了解数据模型
- 知道去 `migrations/` 创建迁移文件
- 知道三层分离的代码应该怎么写
- 知道更新的文档范围

这就是**文档驱动开发**的核心价值：一次写好文档，无数次复用。

---

### 第八章：文档编写实战 Demo

> 本章给出每种文档的完整示例。你可以直接复制这些模板，填入你项目的内容。每个 Demo 都标注了「为什么这样写」——理解这些设计意图，比照抄模板更重要。

---

#### Demo 1：AGENTS.md — AI 工具的入口文件

**文件路径**：`AGENTS.md`

```markdown
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
```

**为什么这样写？**
- 「必读顺序」建立了引用链——AI 看到这个列表会按顺序去读，获取完整上下文
- 每一条路径都是项目中真实存在的文件，AI 读了不会 404
- 「工作规则」是工具专属的行为约束，不是产品知识
- 「决策记录」段落告诉 AI 在提架构建议前先读历史决策
- 「验证」段落明确要求不谎称测试通过，分场景说明验证方式

---

#### Demo 2：.claude/CLAUDE.md — Claude Code 入口文件

**文件路径**：`.claude/CLAUDE.md`

> AGENTS.md 是 Codex 的入口，CLAUDE.md 是 Claude Code 的入口。两者结构相似但各自独立，保持工具指令分离。

```markdown
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
```

**为什么这样写？**
- 和 AGENTS.md 结构对称但内容独立——两个工具的入口互不干扰
- 「上下文文件」建立的引用链与 AGENTS.md 一致，确保不同工具读取到相同的共享文档
- 「输出要求」是 Claude Code 特定的约束——比如不准谎称测试通过，要求列出修改文件
- 文件放在 `.claude/` 下而非根目录——Claude Code 的自动发现机制会读取这个路径

---

#### Demo 3：docs/ai-guide.md — AI 的操作手册

**文件路径**：`docs/ai-guide.md`

> 这是整个文档体系中最重要的文件之一。它定义了 AI **如何读文档、如何更新文档、遵循什么工作流程**。如果说 AGENTS.md 是"入口"，ai-guide.md 就是"操作手册"。

```markdown
# AI 开发指南

> 本文档是 AI 工具在项目中的「操作手册」——它定义了 AI 应该
> 如何阅读、使用和更新所有项目文档，以及遵循怎样的工作流程。

## 核心原则

项目文档是 AI 的「唯一真相来源」。所有关于项目的行为约束、
架构规则、API 契约和业务逻辑，都以 docs/ 目录下的文档为准，
不依赖对话历史中的口头约定。

文档即契约：代码必须服从文档。
如果文档和代码不一致，文档是正确的一方，代码需要修正。

## 文档读取规则

### 接到任务时的读取顺序

AI 在接受任何开发任务后，第一步不是写代码，而是按顺序读取文档：

1. README.md                    → 项目目的、结构和快速入门
2. docs/ai-guide.md（本文件）    → 理解文档的读写工作流
3. docs/tech-stack.md           → 确认技术栈和明确不用的技术
4. docs/architecture.md         → 系统分层、模块边界和依赖方向
5. docs/modules/                → 阅读与任务相关的模块设计文档
6. docs/business-flow.md        → 阅读相关业务流程和验收条件
7. docs/api-contracts/          → 阅读相关 API 契约
8. docs/database-schema.md      → 了解数据模型（如表结构变更）
9. docs/coding-standards.md     → 命名、类型、错误处理等规范
10. docs/frontend-design.md     → 前端组件、样式、交互规范
11. docs/testing.md             → 了解测试策略和命令（如涉及写测试）
12. docs/security.md            → 了解安全约束（如涉及认证/授权）
13. docs/deployment.md          → 了解环境变量和部署流程（如涉及配置）

### 读取策略

- 不是每次都读全部。1-4 步是每次必读的基线，其余按任务范围选择。
- 涉及多个模块时：先读 docs/modules/README.md 了解总览。
- 不确定时宁可多读一个文件，不要漏掉关键约束。

## 文档更新规则

### 黄金法则

任何代码变更导致以下内容变化时，必须同时更新对应文档。
这是强制性规则，不是建议。

### 变更 → 文档映射表

| 代码变更类型 | 必须更新的文档 |
| --- | --- |
| 新增/修改/删除 API 端点 | docs/api-contracts/ |
| 业务行为或验收条件变化 | docs/business-flow.md |
| 数据表、字段、索引变更 | docs/database-schema.md |
| 新增数据库迁移 | apps/demo-backend/migrations/ |
| 新增/修改错误码 | docs/api-contracts/error-codes.md |
| 认证、权限、校验、安全规则变更 | docs/security.md |
| 新增或重构业务模块 | docs/modules/xxx-module.md + docs/modules/README.md |
| 技术栈变更（加新库/去旧库） | docs/tech-stack.md + docs/decisions/ |
| 端口、环境变量、部署流程变更 | docs/deployment.md |
| 编码模式或命名规范变更 | docs/coding-standards.md |
| 前端组件结构、样式方案变更 | docs/frontend-design.md |
| 新增测试或测试策略变更 | docs/testing.md |
| 重要技术决策 | docs/decisions/YYYY-MM-DD-xxx.md |

## AI 标准工作流程

### 第一步：理解现状（Read）
- 按「文档读取规则」读取相关文档
- 如果文档信息不足以做出判断，先向用户提问，不要猜测

### 第二步：总结确认（Confirm）
- 用自己的话复述对当前系统行为的理解
- 列出将要修改的文件清单，简述实现方案

### 第三步：小步实现（Implement）
- 每次只做最小的有用变更
- 代码风格模仿同目录下的现有代码
- 遵循 architecture.md 的分层规则和 coding-standards.md 的编码规范

### 第四步：聚焦验证（Verify）
- 查阅 docs/testing.md 了解测试命令和策略
- 运行与变更最相关的测试
- 如果测试命令不存在或无法运行，在回复中明确说明

### 第五步：文档同步（Document）
- 检查「变更 → 文档映射表」，更新所有受影响的文档
- 新增模块 → 创建 docs/modules/xxx-module.md
- 重要决策 → 创建 docs/decisions/ 记录

### 第六步：报告（Report）

每次代码变更完成后，必须按以下固定结构输出报告：

```markdown
## 变更摘要
（一句话：做了什么）

## 代码变更
- `path/to/file.ts` — 变更描述

## 文档同步检查
| 应检查的文档 | 状态 | 说明 |
| --- | --- | --- |
| docs/api-contracts/ | ✅/⬜/❌ | 说明 |
| docs/business-flow.md | ✅/⬜/❌ | 说明 |
| docs/database-schema.md | ✅/⬜/❌ | 说明 |
| ...（对照变更→文档映射表逐项列出） | | |

> 状态：✅ 已更新 | ⬜ 无需更新 | ❌ 需要更新

## 验证
- 运行：`命令` — 结果
- 跳过：`命令` — 原因

## 注意事项
（需要人工确认的地方、已知限制、后续建议）
```

关键规则：
- 文档同步检查必须逐项列出，大部分「无需更新」也要写出来
- 验证命令必须给出实际输出，没运行就写跳过及原因
- 绝不伪造结果

## 文档先行原则

新功能开发的推荐顺序：

1. docs/business-flow.md    → 先写业务流程和验收条件
2. docs/api-contracts/      → 再写 API 契约
3. docs/database-schema.md  → 更新数据模型（如需要）
4. （写代码实现）            → 最后根据文档实现代码

好处：AI 实现时有明确的契约可参考，文档和代码一开始就是一致的。

## 常见场景速查

### 新增 API 端点
读：api-contracts/ + architecture.md + business-flow.md
做：Route → Service → Repository 分层实现
改：api-contracts/ + business-flow.md（如有）+ error-codes.md（如有）

### 修改数据库表结构
读：database-schema.md + migrations/
做：创建 up/down 迁移文件，更新 Repository
改：database-schema.md + api-contracts/（如影响响应）

### 新增业务模块
读：architecture.md + modules/
做：创建 model → repository → service → routes
改：modules/xxx-module.md + modules/README.md + database-schema.md + api-contracts/

### 写测试或修改测试策略
读：testing.md + coding-standards.md
做：按测试金字塔分层，新增功能同步加测试
改：testing.md（如策略变化）

### 修改安全相关逻辑
读：security.md + database-schema.md
做：检查 user_id 过滤、passwordHash 排除、校验不放松
改：security.md（如规则变化）

### 前端新增页面或组件
读：frontend-design.md + api-contracts/
做：页面级管状态，展示型纯渲染，覆盖四种状态
改：frontend-design.md（如有新交互模式）

## 禁止事项

- ❌ 不读文档直接开始写代码
- ❌ 修改代码但不更新对应文档
- ❌ 文档说一套、代码做另一套
- ❌ 引入 tech-stack.md 明确排除的技术
- ❌ 无决策记录就推翻已有架构决策
- ❌ 谎称测试通过
- ❌ API 响应中暴露堆栈跟踪或敏感信息
- ❌ 业务逻辑写在 Route 层
```

**为什么这样写？**
- 「文档即契约」确立了文档的权威性——AI 不会在发现文档和代码不一致时自行"修正"文档
- 「读取顺序」给了 AI 一个清晰的启动脚本，每次新对话都先按这个流程走
- 「变更 → 文档映射表」是本文档最有价值的部分——它把"更新文档"这个模糊要求变成了可执行的对应关系
- 「常见场景速查」让 AI 快速定位需要读什么、做什么、改什么，减少遗漏
- 「第六步：报告」定义了标准化的输出结构——变更摘要 + 代码变更 + 文档同步检查表 + 验证 + 注意事项，让每次变更都有据可查
- 「禁止事项」用 ❌ 视觉强化，每一条都是实际项目中 AI 常犯的错误

---

#### Demo 4：docs/tech-stack.md — 技术栈声明

**文件路径**：`docs/tech-stack.md`

```markdown
# 技术栈

> AI 在生成代码前必须先读此文件。此文件定义了项目使用和不使用的技术。

## 运行时与语言

| 项目 | 选型 | 版本 | 备注 |
| --- | --- | --- | --- |
| 运行时 | Node.js | >= 20 LTS | |
| 语言 | TypeScript | 5.x | strict 模式，禁用 any |
| 包管理 | npm | 最新稳定版 | 统一使用 npm，不使用 yarn/pnpm |

## 后端

| 项目 | 选型 | 版本 | 备注 |
| --- | --- | --- | --- |
| HTTP 框架 | Express | 4.x | |
| 数据库 | PostgreSQL | 16 | |
| 数据库驱动 | pg | 最新 | 原生驱动，不使用 ORM |
| 校验 | 手写 | - | 在 Service 层校验，不使用 Zod/Joi |
| 认证 | JWT (jsonwebtoken) | - | |
| 密码哈希 | bcrypt | - | |

## 前端

| 项目 | 选型 | 版本 | 备注 |
| --- | --- | --- | --- |
| UI 框架 | React | 18.x | 函数组件 + Hooks |
| 构建工具 | Vite | 5.x | |
| 样式方案 | 纯 CSS | - | 不使用 Tailwind/CSS-in-JS |
| 状态管理 | React 内置 | - | useState/useContext，不用 Redux |
| 路由 | 无 | - | 当前为单页面应用 |
| HTTP 客户端 | fetch (原生) | - | 不引入 axios |

## 测试

| 项目 | 选型 | 备注 |
| --- | --- | --- |
| 测试框架 | Vitest | 前后端统一 |
| E2E | Playwright | 仅关键流程 |

## 代码质量

| 项目 | 选型 | 备注 |
| --- | --- | --- |
| 格式化 | Biome | |
| Lint | Biome | |
| Git Hooks | 无 | 暂不引入 husky/lint-staged |

## 明确不使用的技术

以下技术在社区中很流行，但本项目**刻意不使用**。AI 不要引入它们：

- **Prisma / Drizzle / TypeORM** — 本项目手写 SQL
- **Next.js / Remix** — 本项目前端是纯 React SPA，后端是 Express，分离部署
- **Tailwind CSS / styled-components** — 本项目使用纯 CSS
- **Redis / Memcached** — 当前不需要缓存层
- **GraphQL / tRPC** — 本项目使用 REST API
- **Docker Swarm / Kubernetes** — 当前用 Docker Compose
- **Zod / Joi** — 校验逻辑手写在 Service 层
- **Redux / Zustand / MobX** — 当前应用状态简单，React 内置方案足够
```

**为什么这样写？**
- 分了「运行时」「后端」「前端」「测试」「代码质量」五个区域，AI 可以快速定位
- 「明确不使用的技术」是本文档最重要的部分——它能阻止 AI 自动引入流行但不需要的技术
- 每个排除项都解释了原因，AI 理解了"为什么不用"之后就不会反复建议
- 文件开头的 `> AI 在生成代码前必须先读此文件` 是个给 AI 的强提示

---

#### Demo 5：docs/architecture.md — 系统架构和分层

**文件路径**：`docs/architecture.md`

```markdown
# 系统架构

## 整体拓扑

```text
[Browser] → [Express Server] → [PostgreSQL]
                ↑
           [Migrations]
```

- 前端是独立 Vite 项目，通过 `fetch` 调用后端 API
- 后端是 Express HTTP 服务，连接 PostgreSQL
- 数据库迁移通过手写 SQL 文件管理

## 分层架构

```text
Route → Service → Repository → Database
  ↓        ↓          ↓
Shared  （横切关注点：错误类、响应工具、日志）
```

### 各层职责与禁入规则

| 层 | 职责 | 绝对不能做的事 |
| --- | --- | --- |
| **Route** | 解析 HTTP 请求参数，调用 Service，返回 HTTP 响应 | ❌ 业务逻辑、数据库查询 |
| **Service** | 业务规则、数据校验、流程编排，调用 Repository | ❌ 直接操作数据库、处理 HTTP 细节 |
| **Repository** | 封装 SQL 查询，返回业务对象 | ❌ 业务判断、HTTP 相关代码 |
| **Shared** | HTTP 错误类、响应信封格式化、日志工具 | ❌ 依赖任何业务模块 |

### 依赖方向

```text
Route ──→ Service ──→ Repository ──→ Database
  │           │             │
  └───────────┴─────────────┴──→ Shared

依赖方向永远向下。下层绝不引用上层。
Shared 是唯一可以被所有层引用的模块。
```

## 代码组织：按领域模块分包

```text
apps/demo-backend/src/
  server.ts              ← 入口：创建 Express 实例，注册路由
  shared/                ← 跨模块共享
    http-error.ts         ← 类型化 HTTP 错误类
    response.ts           ← 统一响应信封
  users/                 ← 用户模块
    user-model.ts         ← 类型定义
    user-routes.ts        ← 路由
    user-service.ts       ← 业务逻辑
    user-repository.ts    ← 数据访问
  todos/                 ← Todo 模块
    todo-model.ts
    todo-routes.ts
    todo-service.ts
    todo-repository.ts
```

### 模块间通信规则

- 模块之间通过 Service 层通信（一个 Service 可以调用另一个 Service）
- 模块之间不能直接访问对方的 Repository
- 共享类型放在各自的 `*-model.ts` 中，不设全局 types 目录

## 模块文档

每个业务模块在 `docs/modules/` 下有对应的详细设计文档，包含：
- 模块职责和边界
- 核心数据模型
- 对外接口（Service 方法签名）
- 依赖的其他模块
- 数据库表关系

AI 在修改某个模块之前，必须先读 `docs/modules/` 中对应的模块文档。
```

**为什么这样写？**
- 先给拓扑图（文本版），AI 能快速建立系统全局观
- 「绝对不能做的事」用 ❌ 标记——视觉上更醒目，AI 更容易注意到禁止项
- 目录结构体现架构——文件夹名就是层名，AI 看到 `todos/` 就知道所有相关文件都在里面
- 模块间通信规则防止 AI 写出跨模块的"野调用"
- 最后一段引向 `docs/modules/`，形成架构 → 模块详情的分层文档结构

---

#### Demo 6：docs/modules/README.md — 模块文档索引

**文件路径**：`docs/modules/README.md`

> 这是模块文档目录的"总目录"。AI 在处理跨模块任务时，先读本文件了解有哪些模块、各自负责什么，再深入具体模块文档。

```markdown
# 模块文档索引

> 本文件是 docs/modules/ 目录的索引。AI 在处理涉及多个模块的任务时，
> 先读本文件了解模块总览，再深入具体模块的设计文档。

## 模块列表

| 模块 | 文档 | 一句话描述 |
| --- | --- | --- |
| 用户模块 | user-module.md | 用户注册、登录、JWT 认证、个人信息管理 |
| Todo 模块 | （待创建） | Todo 的创建、编辑、完成、删除 |

## AI 使用方式

### 何时先读本文件

- 任务涉及多个模块（如"给 Todo 加指派给用户的功能"）
- 不确定某个功能应该属于哪个模块
- 新增业务模块后，需要更新本索引和创建模块文档

### 新增模块的步骤

1. 在 docs/modules/ 下创建 xxx-module.md（参考 user-module.md 格式）
2. 在本文件的「模块列表」中新增一行
3. 如涉及新数据表，更新 docs/database-schema.md
4. 如涉及新 API，更新 docs/api-contracts/

### 模块文档的标准格式

每个模块文档应包含：
- 概述、职责边界、核心数据模型、Service 接口、
- 依赖关系、数据库表引用、安全规则
```

**为什么这样写？**
- 「模块列表」让 AI 一目了然——不需要逐个打开文件就知道有哪些模块
- 「新增模块的步骤」把"创建模块文档"这个模糊任务变成了 4 步可执行动作
- 「标准格式」确保所有模块文档结构一致——AI 创建新模块文档时不会漏章节
- 文件本身很轻量（~40 行），AI 读完不会占用太多上下文

---

#### Demo 7：docs/modules/user-module.md — 模块设计文档

**文件路径**：`docs/modules/user-module.md`

```markdown
# 用户模块（User Module）

## 概述

用户模块负责用户身份管理：注册、登录、个人信息管理。
这是整个系统的身份基础——所有其他业务模块依赖用户模块提供身份认证。

## 职责边界

### 本模块负责
- 用户注册（邮箱 + 密码）
- 用户登录 / 登出（JWT 签发与验证）
- 获取当前用户信息
- 更新用户资料（昵称、头像）
- 密码修改

### 本模块不负责
- 权限/角色管理（未来独立为 RBAC 模块）
- OAuth 第三方登录（未来扩展）
- 用户间关系（好友、关注等，未来独立模块）

## 核心数据模型

```typescript
interface User {
  id: string;           // user_xxx 格式
  email: string;
  passwordHash: string; // bcrypt 哈希，绝对不返回给客户端
  nickname: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Service 接口

```typescript
class UserService {
  // 注册新用户，返回不含密码的用户对象
  register(input: RegisterInput): Promise<User>;

  // 验证邮箱+密码，返回 JWT token pair
  login(input: LoginInput): Promise<TokenPair>;

  // 通过 JWT payload 获取当前用户
  getCurrentUser(userId: string): Promise<User>;

  // 更新当前用户资料
  updateProfile(userId: string, input: UpdateProfileInput): Promise<User>;

  // 修改密码（需要旧密码验证）
  changePassword(userId: string, input: ChangePasswordInput): Promise<void>;
}
```

## 依赖关系

```text
User Module 依赖：
  - shared/http-error.ts     ← 抛出类型化错误
  - shared/response.ts       ← （间接通过 Route 层使用）

User Module 被依赖：
  - Todo Module              ← 通过 JWT 中的 userId 确定 Todo 所有权
  - 所有需要身份认证的模块   ← 通过 Auth 中间件
```

## 数据库表

| 表 | 说明 |
| --- | --- |
| `users` | 用户主表，详见 `docs/database-schema.md` |

## 安全规则

- 密码用 bcrypt 哈希存储（salt rounds >= 10）
- JWT 使用 RS256 算法，私钥通过环境变量注入
- `passwordHash` 绝对不能在任何 API 响应中出现
- 登录接口需要速率限制（防止暴力破解）
- 注册邮箱需要唯一性校验
```

**为什么这样写？**
- 「本模块负责」和「本模块不负责」把边界画清楚——这是 AI 最需要的约束
- Service 接口用了伪代码签名，AI 能看懂每个方法的输入输出
- 「依赖关系」明确写了谁依赖本模块、本模块依赖谁，AI 修改时不会破坏依赖链
- 安全规则是模块级的硬约束，写在这里比写在通用 security.md 中更具体、更容易被 AI 读到

---

#### Demo 8：docs/business-flow.md — 业务流程

**文件路径**：`docs/business-flow.md`

```markdown
# 业务流程

> 本文档描述用户操作流程和验收条件。AI 实现功能前必须先读此文档。

## 流程：用户注册

### 主流程

1. 用户在前端填写邮箱、密码、昵称
2. 前端校验：邮箱格式合法、密码 >= 8 位、昵称非空
3. 前端发送 `POST /api/v1/users/register`
4. 后端校验邮箱未被注册、密码强度满足要求
5. 后端用 bcrypt 哈希密码
6. 后端创建 User 记录
7. 后端返回用户信息（不含密码）和 JWT token

### 验收条件

- 邮箱格式不合法 → 400 + `VALIDATION_ERROR`，消息："邮箱格式不正确"
- 密码少于 8 位 → 400 + `VALIDATION_ERROR`，消息："密码至少需要 8 个字符"
- 邮箱已被注册 → 409 + `EMAIL_ALREADY_EXISTS`
- 昵称为空 → 400 + `VALIDATION_ERROR`
- 成功注册 → 201，返回用户对象 + token
- 返回的用户对象中不包含 `passwordHash` 字段

### 不在范围内

- 邮箱验证（发送验证邮件）
- 手机号注册
- 邀请码注册

---

## 流程：创建 Todo

### 主流程

1. 已登录用户在前端输入 Todo 标题
2. 前端发送 `POST /api/v1/todos`，Authorization header 携带 Bearer token
3. 后端从 JWT 中解析 userId
4. 后端校验标题：非空、不超过 120 字符
5. 后端创建 Todo，绑定到当前 userId
6. 后端返回创建的 Todo 对象

### 验收条件

- 未登录请求 → 401 + `UNAUTHORIZED`
- Token 过期/无效 → 401 + `INVALID_TOKEN`
- 空标题 → 400 + `VALIDATION_ERROR`
- 标题超过 120 字符 → 400 + `VALIDATION_ERROR`
- 成功创建 → 201，返回 Todo 对象，`completed` 为 false
- 创建的 Todo 的 `userId` 必须等于当前登录用户

### 前端行为

- 创建成功后，新 Todo 出现在列表顶部
- 输入框清空
- 不刷新整个页面
- 网络错误时显示错误提示，不清空输入框（用户可重试）

---

## 流程：编辑 Todo 标题

### 主流程

1. 用户在 Todo 列表中找到要编辑的项，点击编辑按钮
2. 前端将 Todo 切换为编辑模式（内联编辑，不跳转页面）
3. 用户修改标题后按 Enter 或点击保存
4. 前端发送 `PATCH /api/v1/todos/{id}`
5. 后端校验 Todo 存在且属于当前用户
6. 后端校验新标题合法
7. 后端更新 Todo 并返回更新后的对象

### 验收条件

- Todo 不存在 → 404 + `TODO_NOT_FOUND`
- Todo 属于其他用户 → 403 + `FORBIDDEN`
- 新标题为空 → 400 + `VALIDATION_ERROR`
- 新标题超过 120 字符 → 400 + `VALIDATION_ERROR`
- 成功更新 → 200，返回更新后的 Todo 对象
- 前端不刷新页面，仅更新对应列表项

### 不在范围内

- 编辑 Todo 描述/优先级/截止日期
- 批量编辑
- 编辑历史/版本记录
```

**为什么这样写？**
- 每个流程分「主流程」「验收条件」「不在范围内」三段——结构统一，AI 容易解析
- 验收条件写清楚了每个错误场景的 HTTP 状态码和错误码——AI 不需要猜测
- 「不在范围内」防止 AI 自动"加戏"——你不说清楚边界，AI 会自行扩展功能
- 前端行为写在一起，AI 做全栈变更时知道前后端如何协作

---

#### Demo 9：docs/api-contracts/user-api.md — API 契约

**文件路径**：`docs/api-contracts/user-api.md`

```markdown
# 用户 API 契约

> 所有用户相关 API 的请求/响应格式定义。新增端点必须遵循此格式。

## 通用规范

- Base URL：`/api/v1`
- 需要认证的端点标注 `🔒`
- 所有响应使用统一信封格式
- 错误码定义见 `docs/api-contracts/error-codes.md`

## POST /api/v1/users/register

注册新用户。

- **Auth**：不需要

### Request

```json
{
  "email": "alice@example.com",
  "password": "password123",
  "nickname": "Alice"
}
```

| 字段 | 类型 | 必填 | 约束 |
| --- | --- | --- | --- |
| email | string | 是 | 合法邮箱格式，最长 255 字符 |
| password | string | 是 | 8-128 字符 |
| nickname | string | 是 | 1-50 字符，不能为空 |

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "email": "alice@example.com",
    "nickname": "Alice",
    "avatarUrl": null,
    "createdAt": "2026-07-18T10:30:00Z",
    "updatedAt": "2026-07-18T10:30:00Z"
  },
  "meta": {
    "requestId": "req_001"
  }
}
```

### Error Responses

**邮箱已被注册 (409)**

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "该邮箱已被注册"
  },
  "meta": {
    "requestId": "req_001"
  }
}
```

**校验失败 (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "密码至少需要 8 个字符",
    "details": {
      "field": "password",
      "constraint": "minLength",
      "minLength": 8
    }
  },
  "meta": {
    "requestId": "req_001"
  }
}
```

---

## POST /api/v1/users/login 🔒

用户登录。

- **Auth**：不需要

### Request

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "user": {
      "id": "user_abc123",
      "email": "alice@example.com",
      "nickname": "Alice",
      "avatarUrl": null
    }
  },
  "meta": {
    "requestId": "req_001"
  }
}
```

### Error Responses

**邮箱或密码错误 (401)**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "邮箱或密码错误"
  },
  "meta": {
    "requestId": "req_001"
  }
}
```

---

## GET /api/v1/users/me 🔒

获取当前登录用户信息。

- **Auth**：需要 Bearer Token

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "email": "alice@example.com",
    "nickname": "Alice",
    "avatarUrl": null,
    "createdAt": "2026-07-18T10:30:00Z"
  },
  "meta": {
    "requestId": "req_001"
  }
}
```
```

**为什么这样写？**
- 每个端点都给出完整的 Request/Response JSON——AI 可以直接"照抄"格式
- 字段约束用表格列出（类型 + 必填 + 约束），AI 能据此生成校验代码
- 每种错误场景都有对应的 JSON 示例，AI 知道每个错误码应该返回什么
- 用 🔒 标记认证需求，一眼能看出哪些端点需要 token
- 文件开头引用了 error-codes.md，AI 知道去那里查完整的错误码定义

---

#### Demo 10：docs/api-contracts/error-codes.md — 错误码定义

**文件路径**：`docs/api-contracts/error-codes.md`

```markdown
# 错误码定义

> 所有 API 错误必须使用本文档中定义的错误码。不得自行发明新的错误码格式。

## 响应信封格式

所有错误响应使用统一信封：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误描述",
    "details": {}  // 可选，附加上下文（如校验失败的字段名）
  },
  "meta": {
    "requestId": "req_xxx"
  }
}
```

## 错误码列表

### 通用错误

| 错误码 | HTTP 状态码 | 说明 |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | 输入参数不符合要求 |
| `UNAUTHORIZED` | 401 | 未提供认证信息 |
| `INVALID_TOKEN` | 401 | Token 无效或已过期 |
| `FORBIDDEN` | 403 | 已认证但无权限操作该资源 |
| `NOT_FOUND` | 404 | 请求的资源不存在 |

### 用户模块

| 错误码 | HTTP 状态码 | 说明 |
| --- | --- | --- |
| `EMAIL_ALREADY_EXISTS` | 409 | 注册邮箱已被使用 |
| `INVALID_CREDENTIALS` | 401 | 邮箱或密码错误 |
| `PASSWORD_TOO_WEAK` | 400 | 密码强度不足 |

### Todo 模块

| 错误码 | HTTP 状态码 | 说明 |
| --- | --- | --- |
| `TODO_NOT_FOUND` | 404 | Todo 不存在或不属于当前用户 |

### 服务端错误

| 错误码 | HTTP 状态码 | 说明 |
| --- | --- | --- |
| `INTERNAL_ERROR` | 500 | 服务端未预期的错误（不暴露详情） |

## 新增错误码规则

1. 错误码使用 `UPPER_SNAKE_CASE`
2. 按模块分组，不要创建通用但语义不清的错误码
3. 新增错误码时必须更新本文档
4. 不要在代码中写死错误消息字符串——统一引用错误码
```

**为什么这样写？**
- 错误信封格式放在最前面——这是所有 API 的共同契约
- 错误码按模块分组——AI 新增端点时知道从哪个模块选择合适的错误码
- 「新增错误码规则」确保错误码风格一致性——`UPPER_SNAKE_CASE`、按模块分组
- 文档自身也是规则书——不仅列出错误码，还规定了怎么加新的

---

#### Demo 11：docs/database-schema.md — 数据库设计

**文件路径**：`docs/database-schema.md`

```markdown
# 数据库设计

## 通用规则

- 主键使用 UUID 格式：`user_xxx`、`todo_xxx`（带前缀便于识别类型）
- 所有表包含 `created_at` 和 `updated_at` 时间戳列
- 使用软删除（`deleted_at` 列），不做物理删除
- 外键关系在应用层维护，不在数据库层使用 FK 约束

## 表结构

### users

| 列 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| id | VARCHAR(50) | PK | 格式：`user_{uuid}` |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 登录邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 哈希，绝不返回给客户端 |
| nickname | VARCHAR(50) | NOT NULL | 显示名称 |
| avatar_url | VARCHAR(500) | NULL | 头像链接 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | 软删除标记 |

### todos

| 列 | 类型 | 约束 | 说明 |
| --- | --- | --- | --- |
| id | VARCHAR(50) | PK | 格式：`todo_{uuid}` |
| user_id | VARCHAR(50) | NOT NULL | 所属用户 |
| title | VARCHAR(120) | NOT NULL | 标题 |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | 是否完成 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULL | 软删除标记 |

### 索引

- `todos(user_id)` — 按用户查询所有 Todo 的主索引
- `todos(user_id, completed)` — 按完成状态过滤
- `todos(user_id, created_at DESC)` — 按时间排序查询

## 数据所有权

- 每个 Todo 通过 `todos.user_id` 归属到唯一用户
- 用户只能读取和修改自己的 Todo
- **所有涉及 Todo 的 SQL 查询必须包含 `WHERE user_id = ?`**
- 软删除的记录在普通查询中应被排除（`WHERE deleted_at IS NULL`）
- 用户注销时，其所有 Todo 标记为软删除，而非物理删除

## AI 开发约束

- 新增查询必须检查是否包含 `user_id` 过滤
- 新增列时必须同步更新本文档的表结构
- 表结构变更必须同步创建迁移文件（`apps/demo-backend/migrations/`）
- 不得在应用代码中使用 `SELECT *`——显式列出需要的列
```

**为什么这样写？**
- 表结构用表格而不是纯 SQL——AI 更容易解析字段名和类型
- 「数据所有权」是安全关键——在这里写清楚比在代码注释里写更可靠
- 「AI 开发约束」把所有权规则翻译成了 AI 可以逐条检查的动作
- 索引设计解释了每个索引用途——AI 写新查询时知道该用哪个索引

---

#### Demo 12：docs/coding-standards.md — 编码规范

**文件路径**：`docs/coding-standards.md`

```markdown
# 编码规范

> 本文档定义所有代码的编写规则。AI 生成或修改代码时必须遵守。

## 命名规范

| 对象 | 规范 | 正确示例 | 错误示例 |
| --- | --- | --- | --- |
| 文件名 | kebab-case | `todo-service.ts` | `TodoService.ts` |
| 目录名 | kebab-case | `demo-backend/` | `demoBackend/` |
| 类/接口/类型 | PascalCase | `TodoService`、`CreateTodoInput` | `todoService` |
| 函数/方法/变量 | camelCase | `createTodo`、`todoList` | `CreateTodo`、`todo_list` |
| 常量 | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH` | `maxTitleLength` |
| 数据库表 | snake_case 复数 | `todos`、`user_sessions` | `Todo`、`todoList` |
| 数据库列 | snake_case | `user_id`、`created_at` | `userId`、`createdAt` |
| 环境变量 | UPPER_SNAKE_CASE | `DATABASE_URL` | `databaseUrl` |
| API 路径 | kebab-case 复数名词 | `/api/v1/todo-items` | `/api/v1/getTodoItems` |

## TypeScript 规则

### 类型定义

- 所有函数必须声明参数和返回值类型
- 禁止使用 `any`——使用 `unknown` 替代
- 接口用 `interface`（可扩展），类型别名用 `type`（联合/交叉类型）
- DTO/Input 类型结尾加 `Input`：`CreateTodoInput`、`UpdateUserInput`
- 数据库行类型结尾加 `Row`：`TodoRow`、`UserRow`

```typescript
// ✅ 正确
async function createTodo(input: CreateTodoInput): Promise<Todo> {
  // ...
}

// ❌ 错误 —— 缺少返回类型
async function createTodo(input) {
  // ...
}
```

### 空值处理

- 使用 `null` 表示故意为空（需要显式处理），不使用 `undefined`
- 数据库可空列映射为 `Type | null`，不可省列映射为 `Type`
- 函数返回值不允许 `undefined` 表示"没有结果"——用 `Type | null`

```typescript
// ✅ 正确
function findById(id: string): Promise<Todo | null> {
  // ...
}

// ❌ 错误 —— 混用 undefined 和 null
function findById(id: string): Promise<Todo | undefined> {
  // ...
}
```

## 错误处理

### 后端

- 所有 API 错误通过 `HttpError` 类抛出（定义在 `shared/http-error.ts`）
- 错误码必须来自 `docs/api-contracts/error-codes.md`
- Route 层统一 catch 错误并格式化为响应信封
- 不得在 catch 块中 `console.error` 后吞掉错误

```typescript
// ✅ 正确 —— 使用项目统一的 HttpError
import { HttpError } from '../shared/http-error';

if (!todo) {
  throw new HttpError(404, 'TODO_NOT_FOUND', 'Todo does not exist');
}

// ❌ 错误 —— 手写不兼容的错误格式
if (!todo) {
  res.status(404).json({ msg: 'not found' });
  return;
}
```

### 前端

- API 调用统一通过 `api/` 目录下的客户端进行
- 错误状态在组件中处理，展示用户可读的错误信息
- 网络错误和业务错误要区分处理

## 文件组织

- 每个文件导出一个主要模块（类/函数集）
- 类型定义放在 `*-model.ts`（或 `*.types.ts`）
- 测试文件：`src/` 下与被测文件同目录，命名 `*.test.ts`
- Demo 代码放在 `apps/demo-*/` 下

## 日志

- 使用结构化日志（JSON 格式）
- 日志级别：`error` > `warn` > `info` > `debug`
- 不在生产环境输出 `debug` 级别日志
- 不在日志中记录密码、token 等敏感信息
```

**为什么这样写？**
- 命名规范表同时给出「正确示例」和「错误示例」——AI 通过对比学习，比只给正例更有效
- TypeScript 规则附带代码片段——AI 看到 `// ✅` 和 `// ❌` 的对比能直接模仿
- 错误处理部分不仅说了"用 HttpError"，还给出了 import 路径——AI 知道该从哪引入
- 每一条规则都是可自动检查的（不是模糊的"写干净的代码"）

---

#### Demo 13：docs/frontend-design.md — 前端设计规范

**文件路径**：`docs/frontend-design.md`

```markdown
# 前端设计规范

> 本文档定义前端 UI 的结构、样式、交互和状态管理规则。

## 组件结构

### 页面级组件 vs 展示型组件

| 类型 | 职责 | 位置 | 示例 |
| --- | --- | --- | --- |
| 页面级（Page） | 管理状态、调用 API、协调子组件 | `src/App.tsx` 或独立的 Page 组件 | `TodoPage` |
| 展示型（Presentational） | 接收 props、渲染 UI、触发回调 | `src/components/` | `TodoList`、`TodoForm` |

规则：
- 展示型组件不能直接调用 API
- 展示型组件不能直接操作全局状态
- 页面级组件负责处理 loading、error、empty、success 四种状态

### 组件必须覆盖的四种状态

每个处理异步数据的组件必须覆盖：

```typescript
// ✅ 正确 —— 四种状态都有处理
function TodoList() {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error.message} onRetry={refetch} />;
  if (todos.length === 0) return <EmptyState message="还没有 Todo，创建一个吧" />;
  return (
    <ul>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  );
}

// ❌ 错误 —— 没有处理 loading 和 error
function TodoList() {
  return (
    <ul>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </ul>
  );
}
```

## 样式规则

- 样式写在组件同级目录的 `styles.css` 中
- 使用 BEM 命名法：`.block__element--modifier`
- 不使用 CSS-in-JS 或 Tailwind
- 颜色值使用 CSS 变量（定义在 `:root` 中，方便主题切换）

```css
/* ✅ 正确 —— BEM + CSS 变量 */
.todo-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
.todo-item--completed {
  opacity: 0.6;
}
.todo-item__title {
  font-size: 1rem;
}

/* ❌ 错误 —— 乱命名，硬编码颜色 */
.item1 {
  background: #fff;
}
```

## API 调用规则

- 所有后端 API 调用集中放在 `src/api/` 目录下
- 每个资源一个文件：`todo-api.ts`、`user-api.ts`
- API 函数返回类型化数据，不返回原始 Response 对象
- 错误在 API 层统一解析为业务错误对象

```typescript
// ✅ 正确 —— src/api/todo-api.ts 集中管理
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const response = await fetch('/api/v1/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.error.code, error.error.message);
  }
  const body = await response.json();
  return body.data;
}

// ❌ 错误 —— 在组件中直接 fetch
function TodoForm() {
  const handleSubmit = async () => {
    const res = await fetch('/api/v1/todos', { method: 'POST', ... });
    // ...
  };
}
```

## 交互规范

- 所有可点击元素必须有 hover 和 focus 样式
- 表单提交时，提交按钮显示 loading 状态并禁用
- 删除操作需要确认（使用浏览器 confirm 或自定义弹窗）
- 网络请求失败时展示可重试的错误提示
- 输入框在用户停止输入 300ms 后才触发搜索（debounce）

## 状态管理

- 当前项目使用 React 内置 `useState` + `useContext`，不引入外部状态库
- 跨组件共享状态通过提升到最近的公共父组件
- 全局状态（如当前用户信息）通过 Context 传递
- 如果未来状态复杂度显著增加，需写决策记录后再引入状态管理库
```

**为什么这样写？**
- 组件分类表告诉 AI 什么代码该放哪——页面逻辑和展示逻辑分离
- 「四种状态」是前端最容易遗漏的——明确要求 AI 每次都处理 loading/error/empty/success
- 样式规则给出了具体的命名法和禁止项，AI 不会引入 Tailwind 等未授权的方案
- API 调用规则给出了具体的文件路径和代码模式，AI 能直接复制
- 最后一段「如果未来…需写决策记录」教 AI 不要自己做主引入新库

---

#### Demo 14：docs/testing.md — 测试策略

**文件路径**：`docs/testing.md`

```markdown
# 测试策略

## 测试金字塔

```text
        /\
       /E2E\          ← 少量：仅关键用户流程
      /------\
     / 集成测试\       ← 适量：模块间接口
    /----------\
   /  单元测试    \     ← 大量：纯逻辑、工具函数
  /--------------\
```

## 单元测试

### 什么必须测

- Service 层的所有业务逻辑
- Repository 层的查询逻辑（需测试数据库 mock）
- Shared 层的工具函数（错误类、响应格式化）
- 输入校验函数

### 什么不测

- 简单的 getter/setter
- 框架样板代码（Express 路由注册、React 组件渲染）
- 第三方库的内部逻辑

### 命名和位置

- 测试文件放在被测文件同目录，命名为 `*.test.ts`
- 测试描述用中文：「should 创建 Todo 时标题为空则抛出 VALIDATION_ERROR」

## 集成测试

- 测试 API 端点的完整链路（Route → Service → Repository → 真实测试数据库）
- 每个端点覆盖：成功场景 + 每种错误码场景 + 边界值

## E2E 测试

- 使用 Playwright
- 仅覆盖关键用户流程：注册 → 登录 → 创建 Todo → 编辑 → 删除
- 不追求覆盖率，追求关键路径不中断

## 运行测试

```bash
npm test              # 运行所有单元和集成测试
npm run test:e2e      # 运行 E2E 测试
```

## AI 的测试要求

- 每次代码变更必须运行相关测试
- 新增功能必须添加测试
- 如果测试命令不可用，在回复中说明，不要谎称"测试通过"
```

**为什么这样写？**
- 测试金字塔用 ASCII 图——AI 能理解测试分层的优先级
- 「什么不测」和「什么必须测」同等重要——防止 AI 给简单 getter 写一堆无意义测试
- 「AI 的测试要求」明确禁止谎称测试通过——这是 AI 最容易犯的错误之一

---

#### Demo 15：docs/security.md — 安全规范

**文件路径**：`docs/security.md`

```markdown
# 安全规范

## 认证

- 使用 JWT（RS256 算法）进行用户认证
- Token 通过 `Authorization: Bearer <token>` 传递
- Access Token 有效期 1 小时
- 私钥通过环境变量注入，不在代码中硬编码

## 授权

- 每个 Todo 通过 `user_id` 归属到唯一用户
- **所有涉及用户数据的查询必须带 `WHERE user_id = ?`**
- 用户只能操作自己的资源，禁止跨用户访问

## 输入校验

| 端点类型 | 校验要求 |
| --- | --- |
| 所有输入 | trim 空白字符，拒绝纯空白字符串 |
| 邮箱 | 验证格式合法性 |
| 密码 | 最少 8 位，注册/修改时校验 |
| 字符串长度 | 标题 ≤ 120 字符，昵称 ≤ 50 字符 |
| SQL 注入 | 使用参数化查询（`$1`, `$2`），绝不拼接 SQL |

## 敏感数据

- 密码使用 bcrypt 哈希存储（salt rounds ≥ 10）
- `passwordHash` 绝不能出现在任何 API 响应中
- JWT 私钥、数据库密码等通过环境变量注入
- 日志中不记录密码、token、身份证号等敏感信息

## 通用安全规则

- API 响应不暴露堆栈跟踪
- 生产环境关闭详细错误信息
- CORS 仅允许已知的前端域名
- 登录接口需要速率限制（5 分钟内最多 10 次尝试）
- `.env` 和所有包含密钥的文件在 `.gitignore` 中

## AI 开发安全约束

- 新增查询时，必须检查是否加了所有权过滤（`WHERE user_id = ?`）
- 返回用户对象时，必须排除 `passwordHash` 字段
- 不得为了方便而放宽校验规则
- 不得在代码注释中写真实密码或密钥
```

**为什么这样写？**
- 把安全规则写成 AI 可以逐条检查的清单
- 「AI 开发安全约束」是本文档最独特的价值——把容易犯的安全错误变成硬约束
- 数据所有权规则在这里再次强调（与 database-schema.md 呼应，双重保险）

---

#### Demo 16：docs/deployment.md — 部署说明

**文件路径**：`docs/deployment.md`

```markdown
# 部署说明

## 环境概览

| 环境 | 用途 | 配置文件 |
| --- | --- | --- |
| 本地开发 | 个人开发调试 | `docker/docker-local/docker-compose.yml` |
| 共享开发 | 团队联调 | `docker/docker-dev/docker-compose.yml` |
| 生产 | 面向用户 | `docker/docker-prod/docker-compose.yml` |

## 本地运行（不用 Docker）

```bash
cd apps/demo-backend && npm install && npm run dev
cd apps/demo-frontend && npm install && npm run dev
```

- 后端：`http://localhost:3000`
- 前端：`http://localhost:5173`

## Docker 运行

```bash
# 本地全栈
docker compose -f docker/docker-local/docker-compose.yml up --build
```

## 环境变量

所有环境变量在 `.env.example` 中列出。本地使用时复制并填写：

```bash
cp .env.example .env
```

### 必需变量

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL 连接串 | `postgresql://user:pass@localhost:5432/mydb` |
| `JWT_PRIVATE_KEY` | JWT RS256 私钥 | （文件路径或 PEM 内容） |
| `PORT` | 后端监听端口 | `3000` |

### 可选变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `LOG_LEVEL` | 日志级别 | `info` |
| `CORS_ORIGIN` | 允许的来源 | `http://localhost:5173` |

## 生产检查清单

部署到生产前确认：

- [ ] 所有环境变量已配置且无默认弱值
- [ ] 数据库迁移已执行
- [ ] CORS 限制为实际域名
- [ ] HTTPS 已启用
- [ ] 日志级别设为 `info` 或 `warn`
- [ ] `.env` 文件未提交到版本控制
- [ ] 健康检查端点 `/health` 可访问

## 禁止事项

- 不在代码中硬编码 URL、端口、密钥
- 不在 Dockerfile 中写死环境变量值
- 不在镜像中打包 `.env` 文件
- 不在生产环境暴露 `debug` 级别日志
```

**为什么这样写？**
- 环境表让 AI 快速了解部署拓扑，不会搞混本地和生产的配置
- 环境变量用「必需」和「可选」分开，AI 不会漏掉关键配置
- 「生产检查清单」是一个可验证的列表——部署前逐项打勾
- 「禁止事项」防止最常见的安全错误（硬编码密钥、打包 .env 等）

---

#### Demo 17：docs/decisions/2026-07-18-no-orm.md — 决策记录

**文件路径**：`docs/decisions/2026-07-18-no-orm.md`

```markdown
# 决策：手写 SQL 而非使用 ORM

**日期**：2026-07-18
**状态**：已采纳
**决策者**：开发团队

## 背景

项目启动时需要一个数据访问层。Node.js 社区主流方案是 Prisma 或 Drizzle ORM。

## 决策

使用 `pg` 原生驱动 + 手写 SQL，不使用任何 ORM。

## 原因

1. **对 AI 透明度**：SQL 迁移文件是纯文本，AI 可以直接读取理解完整数据模型。ORM 生成的 SQL 是运行时的、不可见的。
2. **教学目的**：本模板旨在展示"如何写 AI 友好项目"，手写 SQL 让学习者更清楚每一行数据库交互。
3. **简洁性**：当前数据模型仅 3-5 张核心表，ORM 的 Migration/Schema/Client 三层抽象得不偿失。
4. **无魔法原则**：ORM 的关系懒加载、查询缓存等"魔法"行为让 AI 和人类都难以推断实际执行的 SQL。

## 替代方案及否决原因

| 方案 | 否决原因 |
| --- | --- |
| Prisma | 引入独立 schema 语法学习成本；生成的 SQL 在 AI 上下文中不可见 |
| Drizzle | 虽比 Prisma 轻量，但仍是 TypeScript→SQL 的抽象层，增加 AI 理解负担 |
| Knex | 查询构建器，介于 ORM 和原生驱动之间；本项目 SQL 足够简单，不需要查询构建 |

## 影响

- Repository 层代码直接写 SQL 字符串
- 数据库迁移使用手写 `.sql` 文件（`apps/demo-backend/migrations/`）
- 每个迁移文件需要配对的 `up` 和 `down` 文件
- 新成员需要具备基础 SQL 能力
- AI 生成代码时必须用 SQL 而非 ORM API

## 未来重新评估的触发条件

- 数据表超过 20 张，手写 SQL 维护成本显著上升
- 需要支持多种数据库（PostgreSQL + MySQL + SQLite）
- 团队决定引入自动化 Migration 管理工具
```

**为什么这样写？**
- 记录了「被否决的方案及原因」——这是决策记录最有价值的部分，防止后来者（或 AI）重新提出已否决的方案
- 每一条原因都解释了对 AI 工作流的影响——这对 AI 友好项目尤其重要
- 「未来重新评估的触发条件」是一种务实的写法——表明这个决策不是教条，在特定情况下可以被重新审视
- 文件名带日期和 slug，方便排序和搜索

---

### 文档 Demo 速查表

| 你想写 | 参考 Demo | 核心技巧 |
| --- | --- | --- |
| AI 入口指令（Codex） | Demo 1：AGENTS.md | 引用链 + 工具专属指令 |
| AI 入口指令（Claude Code） | Demo 2：.claude/CLAUDE.md | 与 AGENTS.md 对称但独立 |
| AI 操作手册 | Demo 3：ai-guide.md | 读取顺序 + 更新映射表 + 标准工作流 |
| 技术栈声明 | Demo 4：tech-stack.md | 列出"不用的技术"比列出"用的技术"更重要 |
| 架构分层 | Demo 5：architecture.md | 每层写上"绝对不能做的事" |
| 模块索引 | Demo 6：modules/README.md | 模块总览表 + 新增模块的 4 步流程 |
| 模块设计 | Demo 7：user-module.md | 边界 + 接口签名 + 依赖关系 |
| 业务流程 | Demo 8：business-flow.md | 主流程 + 验收条件 + 不在范围内 |
| API 契约 | Demo 9：user-api.md | 每个端点给完整 JSON 示例 |
| 错误码定义 | Demo 10：error-codes.md | 按模块分组 + 统一信封格式 |
| 数据库设计 | Demo 11：database-schema.md | 所有权限定 user_id + AI 开发约束 |
| 编码规范 | Demo 12：coding-standards.md | 正确示例 + 错误示例成对出现 |
| 前端规范 | Demo 13：frontend-design.md | 组件分类 + 四种状态 + 交互规则 |
| 测试策略 | Demo 14：testing.md | 金字塔 + 什么不测 + 禁止谎称通过 |
| 安全规范 | Demo 15：security.md | 所有权 + 校验 + AI 安全约束清单 |
| 部署说明 | Demo 16：deployment.md | 环境表 + 变量分类 + 生产检查清单 |
| 决策记录 | Demo 17：no-orm.md | 否决方案及原因 + 重新评估条件 |

---

## 本模板的项目结构

```text
AGENTS.md                   Codex 项目指令
CLAUDE.md                   Claude Code 项目指令（根目录入口）

.claude/
  CLAUDE.md                 Claude Code 专属项目指令
  settings.json             Claude Code 项目设置

apps/
  demo-backend/             最小 Todo API 示例
    migrations/             数据库迁移文件（手写 SQL）
    src/
      server.ts             入口
      shared/               跨模块共享（错误类、响应工具）
      todos/                Todo 模块（routes → service → repository）
      users/                用户模块
  demo-frontend/            最小 Todo UI 示例
    src/
      App.tsx               页面级组件
      api/                  集中 API 调用
      components/           展示型组件

docs/
  tech-stack.md             技术栈（AI 第一步就要读）
  ai-guide.md               AI 辅助开发的共享工作流
  architecture.md           系统边界、分层和依赖方向
  business-flow.md          产品流程和验收条件
  frontend-design.md        前端组件、样式、交互规范
  database-schema.md        数据表、字段、索引、所有权规则
  coding-standards.md       命名、类型、错误处理、日志规则
  testing.md                单元/集成/E2E 测试策略
  security.md               认证、授权、校验、密钥管理
  deployment.md             本地/开发/生产部署说明
  api-contracts/            API 契约（按资源拆分）
    user-api.md             用户相关端点
    error-codes.md          稳定错误码定义
  modules/                  模块详细设计文档
    user-module.md          用户模块设计
  decisions/                架构决策记录
    2026-07-18-no-orm.md    手写 SQL vs ORM

docker/
  docker-local/             本地全栈 Demo compose 文件
  docker-dev/               共享开发环境 compose 文件
  docker-prod/              生产风格 compose 示例

.env.example                安全的示例环境变量
.gitignore                  忽略规则
```

---

## 如何阅读本模板

如果你是第一次接触 AI 友好项目，请按以下顺序阅读：

1. **本文件（AI项目入门指南.md）** — 理解 AI 友好项目的核心理念 + 浏览所有 Demo 的速查表
2. `AGENTS.md` 和 `.claude/CLAUDE.md` — 看入口文件怎么写（两个工具各自独立）
3. `docs/ai-guide.md` — 看 AI 如何读文档、更新文档、遵循工作流
4. `docs/tech-stack.md` — 看技术栈怎么声明（尤其是"不用的技术"）
5. `docs/architecture.md` — 看系统边界和分层禁入规则
6. `docs/modules/` — 看各模块的详细设计文档（职责、接口、依赖）
7. `docs/business-flow.md` — 看业务流程和验收条件怎么写
8. `docs/api-contracts/` — 看 API 契约怎么文档化（按资源拆分）
9. `docs/api-contracts/error-codes.md` — 看错误码怎么统一管理
10. `docs/database-schema.md` — 看数据库设计、所有权规则怎么记录
11. `apps/demo-backend/migrations/` — 看迁移文件怎么和文档配合
12. `docs/coding-standards.md` — 看编码规范怎么做到可验证（正反例对比）
13. `docs/frontend-design.md` — 看前端组件、样式、交互规范
14. `docs/testing.md` — 看测试金字塔和 AI 测试要求
15. `docs/security.md` — 看安全规范怎么写成 AI 可检查的清单
16. `docs/deployment.md` — 看部署环境和环境变量怎么管理
17. `docs/decisions/` — 看架构决策怎么记录"为什么"
18. `apps/demo-backend/` 和 `apps/demo-frontend/` — 看文档反映在代码中的样子

---

## 将本模板应用到你的项目

### 第一步：从业务流程开始

在写代码之前，先用 `docs/business-flow.md` 描述真实的用户工作流。好的业务文档包含验收条件，坏的只有一句话概括。

### 第二步：先写 API 契约再实现

在 `docs/api-contracts/` 中按资源拆分写清请求和响应格式，然后再让 AI 实现端点。

### 第三步：迁移文件和 Schema 文档一起维护

`docs/database-schema.md` 解释设计意图，`migrations/` 存储可执行的数据库变更。

### 第四步：记录数据所有权

不要只列字段，要解释：谁的数据、谁能访问、软删除规则、级联关系。

### 第五步：明确架构边界

告诉 AI 什么代码属于哪一层，什么是禁止的。每个模块在 `docs/modules/` 下有独立的职责文档。

### 第六步：编码规范要具体可验证

避免"写干净的代码"这种模糊要求，改用具体、可检查的规则。正确和错误示例成对出现。

### 第七步：保留小而清晰的 Demo 代码

AI 通过模仿工作，给一个好的示例比写十页文档更有效。

### 第八步：记录重要决策

在 `docs/decisions/` 中为重要的技术选型和架构决策创建记录，写清楚"为什么"和"否决了什么"。

---

## 运行 Demo

```bash
# 后端
cd apps/demo-backend
npm install
npm run dev

# 前端
cd apps/demo-frontend
npm install
npm run dev
```

或使用 Docker Compose：

```bash
docker compose -f docker/docker-local/docker-compose.yml up --build
```

预期本地地址：
- 后端：`http://localhost:3000/api/v1/todos`
- 前端：`http://localhost:5173`

---

## 为什么这套方法论有效

AI 编码工具在能够**复制一致的本地模式**时最强，在必须**推断隐藏意图**时最弱。这套模板通过以下方式减少 AI 的猜测：

- 清晰的入口点（AGENTS.md / CLAUDE.md 的引用链）
- 明确的项目边界（architecture.md 中的分层和禁止项 + modules/ 中的模块边界）
- 具体的代码示例（Demo 应用展示正确模式）
- 稳定的契约（API Contracts + Error Codes）
- 可验证的期望（Testing + Coding Standards）
- 分离的 AI 工具指令（不同工具各自有专属配置）
- 决策的"为什么"（Decision Records 防止 AI 推翻历史决策）

结果不是完美的自动化，而是让 AI 有更大的概率产出**匹配你项目的代码**，而不是记忆中的泛用代码。

---

## 项目自检清单

将本模板适配到真实项目时，检查以下各项：

- [ ] README.md 解释项目目的、结构、设置和阅读路径
- [ ] AGENTS.md 仅包含 Codex 专属指令 + 正确的阅读顺序引用链
- [ ] .claude/CLAUDE.md 仅包含 Claude Code 专属指令（与 AGENTS.md 对称但独立）
- [ ] docs/ai-guide.md 写清文档读取规则、更新规则和标准工作流
- [ ] docs/tech-stack.md 列出使用的技术和明确不使用的技术
- [ ] 共享规范放在 docs/，不放在某个工具的私有配置中
- [ ] docs/business-flow.md 描述真实用户流程和验收条件
- [ ] docs/api-contracts/ 包含按资源拆分的具体请求/响应示例
- [ ] docs/database-schema.md 记录所有权、索引和迁移规则
- [ ] docs/modules/ 为每个业务模块提供独立的职责文档
- [ ] docs/frontend-design.md 定义组件结构、样式方案和交互规范
- [ ] apps/demo-backend/migrations/ 包含可执行迁移和回滚迁移
- [ ] docs/api-contracts/error-codes.md 包含稳定的机器可读错误码
- [ ] docs/coding-standards.md 给出具体的、可验证的规则（附正确/错误示例）
- [ ] docs/testing.md 解释什么需要测试、怎么运行测试
- [ ] docs/security.md 记录认证、权限、校验、密钥管理
- [ ] docs/deployment.md 记录环境、环境变量和发布检查
- [ ] docs/decisions/ 记录重要架构决策及被否决的方案
- [ ] Demo 代码覆盖最重要的后端和前端模式
- [ ] .env.example 列出安全的示例配置值
- [ ] .gitignore 排除生成文件、密钥、缓存和本地数据
