# AI 开发指南

> 本文档是 AI 工具在项目中的「操作手册」——它定义了 AI 应该**如何阅读、使用和更新**所有项目文档，以及遵循怎样的工作流程。

## 核心原则

项目文档是 AI 的「唯一真相来源」。所有关于项目的行为约束、架构规则、API 契约和业务逻辑，都以 `docs/` 目录下的文档为准，不依赖对话历史中的口头约定。

**文档即契约：代码必须服从文档。如果文档和代码不一致，文档是正确的一方，代码需要修正。**

---

## 文档读取规则

### 接到任务时的读取顺序

AI 在接受任何开发任务后，第一步不是写代码，而是按以下顺序读取文档：

```text
1. README.md                        → 了解项目目的、结构和快速入门
2. docs/ai-guide.md （本文件）        → 理解如何阅读和更新文档的工作流
3. docs/tech-stack.md               → 确认技术栈和明确不用的技术
4. docs/architecture.md             → 理解系统分层、模块边界和依赖方向
5. docs/modules/                    → 阅读与任务相关的模块设计文档
6. docs/business-flow.md            → 阅读与任务相关的业务流程和验收条件
7. docs/api-contracts/              → 阅读与任务相关的 API 契约
8. docs/database-schema.md          → 了解数据模型（如表结构变更）
9. docs/coding-standards.md         → 了解命名、类型、错误处理等规范
10. docs/frontend-design.md         → 了解前端组件、样式、交互规范（如涉及前端）
11. docs/testing.md                 → 了解测试策略和测试命令（如涉及写测试）
12. docs/security.md                → 了解安全规则和 AI 安全约束（如涉及认证/授权）
13. docs/deployment.md              → 了解环境变量和部署流程（如涉及配置变更）
```

### 读取策略

- **不是每次都读全部**：根据任务范围，只读相关文档。但 1-4 步是每次必读的基线。
- **涉及多个模块时**：先读 `docs/modules/README.md` 了解模块总览，再深入相关模块文档。
- **不确定时多读**：如果判断不了某个文档是否相关，宁可多读一个文件，不要漏掉关键约束。

---

## 文档更新规则

### 黄金法则：代码变，文档必须同步变

**任何代码变更，如果导致以下内容发生变化，必须同时更新对应文档。这是强制性规则，不是建议。**

### 变更 → 文档映射表

| 代码变更类型 | 必须更新的文档 | 说明 |
| --- | --- | --- |
| 新增/修改/删除 API 端点 | `docs/api-contracts/` | 更新请求/响应示例、状态码、错误场景 |
| 业务行为或验收条件变化 | `docs/business-flow.md` | 更新流程描述和验收条件 |
| 数据表、字段、索引变更 | `docs/database-schema.md` | 更新表结构、所有权规则、约束说明 |
| 新增数据库迁移 | `apps/demo-backend/migrations/` | 创建 up/down 迁移文件对 |
| 新增/修改错误码 | `docs/api-contracts/error-codes.md` | 添加错误码定义、含义和触发条件 |
| 认证、权限、校验、安全规则变更 | `docs/security.md` | 更新安全规则和 AI 安全约束 |
| 新增或重构业务模块 | `docs/modules/xxx-module.md` + `docs/modules/README.md` | 创建模块文档并更新模块索引 |
| 技术栈变更（加新库/去旧库） | `docs/tech-stack.md` + `docs/decisions/` | 更新技术表，并创建决策记录 |
| 端口、环境变量、部署流程变更 | `docs/deployment.md` | 更新配置说明 |
| 编码模式或命名规范变更 | `docs/coding-standards.md` | 更新规范并附示例 |
| 前端组件结构、样式方案变更 | `docs/frontend-design.md` | 更新组件分类和交互规则 |
| 新增测试或测试策略变更 | `docs/testing.md` | 更新测试命令、覆盖范围说明 |
| 重要技术决策 | `docs/decisions/YYYY-MM-DD-xxx.md` | 创建决策记录，写清原因和否决方案 |

### 更新质量要求

- 更新文档时，保持文档内格式与现有内容一致
- 如果某个 API 契约有多个端点示例，新端点要遵循相同的模板结构
- 决策记录必须包含「为什么」——只记录结果没有价值
- 不要在技术栈文档中留下了旧版本号

---

## AI 标准工作流程

以下是 AI 处理任何非平凡开发任务的标准流程：

### 第一步：理解现状（Read）

1. 按「文档读取规则」读取相关文档
2. 如果任务涉及多个模块，列出所有受影响的文件
3. 如果发现文档中的信息不足以做出判断，**先向用户提问**，不要猜测

### 第二步：总结确认（Confirm）

1. 用自己的话复述对当前系统行为的理解
2. 列出将要修改的文件清单
3. 简述实现方案（3-5 句话即可）
4. 如果方案可能与已有决策记录冲突，明确指出并讨论

### 第三步：小步实现（Implement）

1. 每次只做最小的有用变更
2. 保持代码风格与同目录下的现有代码一致
3. 遵循 `docs/architecture.md` 的分层规则：Route → Service → Repository
4. 使用 `docs/coding-standards.md` 中的命名、类型、错误处理规范
5. 遵循 `docs/frontend-design.md` 的前端规范（如涉及前端）

### 第四步：聚焦验证（Verify）

1. 查阅 `docs/testing.md` 了解测试命令和策略
2. 运行与变更最相关的测试（不是全量测试）
3. 如果变更涉及多模块，验证模块间的接口仍然匹配
4. 如果测试命令不存在或无法运行，在回复中明确说明

### 第五步：文档同步（Document）

1. 检查「变更 → 文档映射表」，更新所有受影响的文档
2. 如果新增了模块，在 `docs/modules/` 下创建模块文档
3. 如果做了重要技术决策，在 `docs/decisions/` 下创建决策记录

### 第六步：报告（Report）

每次代码变更完成后，必须按照以下固定结构输出报告。
不得省略任何章节，没有内容时写「无」。

---

## 输出结构

```markdown
## 变更摘要

（一句话描述：做了什么、为什么做）

## 代码变更

（列出所有修改的代码文件，每行一个，附变更说明）

- `path/to/file.ts` — 新增了 xxx 函数
- `path/to/another.ts` — 修改了 xxx 逻辑

## 文档同步检查

（对照「变更 → 文档映射表」，逐项检查本次变更涉及的文档类型。
每项必须打勾或说明）

| 应检查的文档 | 状态 | 说明 |
| --- | --- | --- |
| docs/api-contracts/ | ✅ 已更新 | 新增了 POST /api/v1/todos 的契约 |
| docs/business-flow.md | ✅ 无需更新 | 本次变更不涉及业务流程 |
| docs/database-schema.md | ✅ 已更新 | 为 todos 表新增了 priority 列 |
| docs/api-contracts/error-codes.md | ⬜ 无需更新 | 未新增错误码 |
| docs/security.md | ⬜ 无需更新 | 未变更安全逻辑 |
| docs/testing.md | ⬜ 无需更新 | 未变更测试策略 |
| docs/coding-standards.md | ⬜ 无需更新 | 未变更编码规范 |
| docs/frontend-design.md | ⬜ 无需更新 | 本次不涉及前端 |
| docs/modules/ | ⬜ 无需更新 | 未新增模块 |
| docs/deployment.md | ⬜ 无需更新 | 未变更环境配置 |
| docs/tech-stack.md | ⬜ 无需更新 | 未引入新技术 |
| docs/decisions/ | ⬜ 无需更新 | 本次无新的架构决策 |

> 状态说明：✅ 已更新 | ⬜ 无需更新 | ❌ 需要更新（说明原因及计划）

## 验证

（列出实际运行的验证命令和结果）

- 运行：`npm test` — ✅ 12 passed, 0 failed
- 运行：`npx tsc --noEmit` — ✅ 无类型错误
- 跳过：`npm run test:e2e` — 原因：当前环境无 Playwright

## 注意事项

（如果本次变更有需要特别说明的事项：

- 需要人工确认的地方
- 已知的限制或待完成的工作
- 对后续开发的建议
- 与已有决策记录的冲突及处理方式）

无
```

---

## 输出规则

### 必须遵守

1. **文档同步检查表必须逐项列出**——即使大部分是「无需更新」。这让用户一眼看出你检查了哪些文档、跳过了哪些。
2. **验证命令必须给出实际输出**——`npm test` 的结果写 `12 passed`，不是 `测试通过`。如果没运行，写跳过及原因。
3. **绝不伪造结果**——没运行就是没运行，写清楚原因，不要编造。

### 文档同步状态的判断

| 你做了什么 | 哪些文档必须标记为 ✅ 已更新 |
| --- | --- |
| 新增/修改 API | `docs/api-contracts/`，如有新错误码还要更新 `error-codes.md` |
| 改业务流程 | `docs/business-flow.md` |
| 改数据库 | `docs/database-schema.md` + 创建迁移文件 |
| 新增模块 | `docs/modules/xxx-module.md` + `docs/modules/README.md` + `docs/database-schema.md`（如有新表） |
| 改编码规范 | `docs/coding-standards.md` |
| 改前端组件 | `docs/frontend-design.md`（如有新的交互模式） |
| 改测试策略 | `docs/testing.md` |
| 改安全规则 | `docs/security.md` |
| 改环境/部署 | `docs/deployment.md` |
| 引入新技术 | `docs/tech-stack.md` + `docs/decisions/` |
| 做架构决策 | `docs/decisions/YYYY-MM-DD-xxx.md` |

### 注意事项章节的使用场景

以下情况必须在「注意事项」中说明：

- 变更引入了已知的技术债务
- 需要用户手动执行某些操作（如数据库迁移、环境变量更新）
- 有与现有决策记录冲突但经过讨论的方案
- 某部分工作因为信息不足而暂未实现

---

## 文档先行原则

### 先写文档再写代码

对于新功能开发，推荐的顺序是：

```text
1. docs/business-flow.md        → 先写业务流程和验收条件
2. docs/api-contracts/xxx.md    → 再写 API 契约（请求/响应格式）
3. docs/database-schema.md      → 更新数据模型（如需要）
4. （写代码实现）                → 最后根据文档实现代码
5. docs/decisions/              → 如有重要决策，补充决策记录
```

这样做的好处：
- AI 实现代码时有明确的契约可参考，减少猜测
- 文档和代码一开始就是一致的，不会出现后续同步问题
- 业务流程中的「不在范围内」能防止 AI 过度实现

### Demo 代码的价值

`apps/demo-backend/` 和 `apps/demo-frontend/` 中的代码是活文档。它们展示了：
- 正确的三层分离模式
- 统一的错误处理方式
- 一致的 API 调用模式

AI 在写新代码时，应该先查看 Demo 中与之最相似的代码，模仿其结构和风格。

---

## 决策记录的使用

### 何时读取决策记录

在以下情况下，必须先读 `docs/decisions/`：
- 提出技术选型建议前
- 重构某个模块前
- 打算引入新的第三方库前
- 修改系统架构前

### 何时创建决策记录

在以下情况下，必须创建决策记录：
- 做出了一个可能被未来开发者质疑的选型
- 在两个可行方案中做出了取舍
- 故意违反了一个常见的社区最佳实践
- 采用了非主流的技术方案

### 决策记录的引用

在 AGENTS.md 和 CLAUDE.md 中，通过以下指令让 AI 自动读取决策记录：

```markdown
## 决策记录

在做影响架构的修改之前，先阅读 docs/decisions/ 目录下相关的决策记录。
理解已有决策的原因。如果新方案与已有决策冲突，先与用户讨论。
```

---

## 常见场景速查

### 场景：新增一个 API 端点

```text
读：docs/api-contracts/（了解现有格式）
    docs/architecture.md（确认分层规则）
    docs/business-flow.md（了解相关业务流程）
做：按 Route → Service → Repository 分层实现
改：docs/api-contracts/（添加新端点的契约）
    docs/business-flow.md（如有新业务流程）
    docs/api-contracts/error-codes.md（如有新错误码）
```

### 场景：修改数据库表结构

```text
读：docs/database-schema.md（了解当前模型）
    apps/demo-backend/migrations/（了解迁移命名规范）
做：创建 up/down 迁移文件
    更新相关 Repository 代码
改：docs/database-schema.md（更新表结构文档）
    docs/api-contracts/（如影响 API 响应字段）
    docs/business-flow.md（如影响业务行为）
```

### 场景：新增一个业务模块

```text
读：docs/architecture.md（了解分层规则）
    docs/modules/（了解现有模块的组织方式）
做：创建模块目录和文件（model → repository → service → routes）
改：docs/modules/xxx-module.md（创建模块文档）
    docs/modules/README.md（更新模块索引）
    docs/database-schema.md（如有新表）
    docs/api-contracts/（如有新 API）
    docs/business-flow.md（如有新流程）
```

### 场景：写测试或修改测试策略

```text
读：docs/testing.md（了解测试分层和命令）
    docs/coding-standards.md（了解测试文件命名和位置）
做：按测试金字塔分层写测试
    单元测试覆盖 Service 逻辑，集成测试覆盖 API 链路
    新增功能必须同步添加测试
改：docs/testing.md（如测试命令或策略变化）
```

### 场景：修改安全相关逻辑

```text
读：docs/security.md（了解安全约束清单）
    docs/database-schema.md（确认数据所有权规则）
做：新增查询必须加 user_id 过滤
    返回用户对象必须排除 passwordHash
    不得放宽校验规则
改：docs/security.md（如安全规则变化）
```

### 场景：前端新增页面或组件

```text
读：docs/frontend-design.md（了解组件分类和样式规范）
    docs/api-contracts/（了解使用的 API 契约）
做：页面级组件管理状态，展示型组件纯渲染
    覆盖 loading/error/empty/success 四种状态
改：docs/frontend-design.md（如有新的交互模式）
```

---

## 禁止事项

以下行为在任何情况下都是禁止的：

- ❌ 不读文档直接开始写代码
- ❌ 修改代码行为但不更新对应文档
- ❌ 在文档中说一套、在代码中做另一套
- ❌ 引入 `docs/tech-stack.md` 中「明确不使用」列表中的技术
- ❌ 在没有决策记录的情况下推翻已有的架构决策
- ❌ 谎称测试通过（没运行就说通过了）
- ❌ 在 API 响应中暴露堆栈跟踪或敏感信息
- ❌ 把业务逻辑写在 Route 层
- ❌ 把数据库查询写在 Service 层之外
