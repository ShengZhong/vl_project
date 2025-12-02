# 数据建模与实体关系规范

> **文档版本**：v1.1  
> **最后更新**：2025-01-15  
> **适用范围**：VisionLine 项目数据建模

---

## 📋 目录

1. [文档目标](#1-文档目标)
2. [核心原则](#2-核心原则)
3. [五步数据建模流程](#3-五步数据建模流程)
4. [实体拆分方法论](#4-实体拆分方法论)
5. [实体关系检查清单](#5-实体关系检查清单)
6. [标准提示词模板](#6-标准提示词模板)
7. [常见问题与解决方案](#7-常见问题与解决方案)
8. [最佳实践](#8-最佳实践)
9. [工具与资源](#9-工具与资源)

---

## 1. 文档目标

| 目标 | 说明 |
|------|------|
| **标准化流程** | 提供标准化的数据建模流程 |
| **完整性保证** | 确保实体关系设计的完整性和一致性 |
| **防止孤立数据** | 防止数据孤立和关联缺失问题 |
| **支持复杂查询** | 支持复杂查询场景和数据关联 |

---

## 2. 核心原则

### 2.1 实体独立性

- 每个实体应代表一个独立的业务概念
- 实体必须有明确的生命周期（创建、更新、删除）
- 实体必须有唯一标识（主键）

### 2.2 关系完整性

- 所有实体关系必须通过外键约束建立
- 外键字段必须创建索引以提升查询性能
- 必须明确定义级联删除/更新规则

### 2.3 数据一致性

- TypeScript 类型定义必须与数据库结构一致
- Mock 数据必须包含完整的关联关系
- 查询接口必须支持跨表关联查询

---

## 3. 五步数据建模流程

### 第一步：识别核心实体

从需求文档中识别所有需要持久化存储的业务对象。

#### 识别方法

| 方法 | 说明 |
|------|------|
| **名词提取法** | 标记需求中的所有核心名词 |
| **生命周期判断** | 判断对象是否有独立的创建、更新、删除操作 |
| **属性数量判断** | 如果对象有多个属性需要存储，则作为独立实体 |

#### 实体分类

| 类别 | 说明 |
|------|------|
| **主实体** | 功能主要操作的核心对象 |
| **关联实体** | 与主实体相关但有独立生命周期的对象 |
| **字段属性** | 只是某个实体的一个属性值，不需要独立存储 |

#### 示例

```
需求："管理 Meta 广告账户的指导建议，追踪客户采纳情况"

识别结果：
✅ 主实体：
  - 广告账户 (AdAccount) - 核心业务对象
  - 客户信息 (Customer) - 账户所有者

✅ 关联实体：
  - 指导建议 (Recommendation) - 有独立的创建、查询、删除操作
  - 指标数据 (Metric) - 有独立的数据和生命周期
  - 人员信息 (Personnel) - 签约销售、负责销售等

❌ 字段属性（不需要独立实体）：
  - 账户状态 - 只是账户的一个枚举值
  - 账户评分 - 只是账户的一个数值属性
```

---

### 第二步：定义实体属性

为每个实体明确定义属性（字段）。

#### 属性定义模板

```markdown
**实体名称：[EntityName]**
- 主键：[fieldName]（类型，说明）
- 属性1：[fieldName]（类型，是否必填，说明）
- 属性2：[fieldName]（类型，是否必填，说明）
- ...
- 外键字段：[foreignKey]（关联到哪个实体的哪个字段）
- 时间戳：createdAt, updatedAt（自动维护）
```

#### 示例

```markdown
**实体：客户信息 (Customer)**
- 主键：id（INTEGER，自增 ID）
- 属性1：customerId（TEXT，必填，客户唯一标识）
- 属性2：customerName（TEXT，必填，客户名称）
- 属性3：consolidatedEntity（TEXT，必填，合并主体）
- 属性4：customerType（TEXT，选填，客户类型：BV/MH/BMP）
- 外键字段：settlementEntityId（INTEGER，关联到 SettlementEntity.id）
- 时间戳：createdAt, updatedAt

**实体：广告账户 (AdAccount)**
- 主键：adAccountId（TEXT，Meta 广告账户 ID）
- 属性1：accountInfo（TEXT，账户信息）
- 属性2：accountScore（INTEGER，账户评分）
- 外键字段：customerId（INTEGER，关联到 Customer.id）
- 时间戳：createdAt, updatedAt
```

---

### 第三步：明确实体关系

定义实体之间的关系类型和关联方式。

#### 关系类型

| 类型 | 说明 |
|------|------|
| **1 对 1** | 一个实体对应另一个实体的一个实例 |
| **1 对多** | 一个实体对应另一个实体的多个实例 |
| **多对多** | 需要中间表建立关联 |

#### 关系定义模板

```
[实体A] ──(关系类型)──> [实体B]
  └─ 关系说明：[业务含义]
  └─ 外键：[B表.外键字段] 引用 [A表.主键]
  └─ 级联规则：[CASCADE / SET NULL / RESTRICT]
  └─ 业务规则：[具体的业务约束]
```

#### 级联规则说明

| 规则 | 说明 |
|------|------|
| **CASCADE** | 删除父实体时，自动删除所有子实体（强依赖关系）|
| **SET NULL** | 删除父实体时，子实体的外键设置为 NULL（弱依赖关系）|
| **RESTRICT** | 如果存在子实体，禁止删除父实体（保护性删除）|

#### 示例

```
Customer ──(1对多)──> AdAccount
  └─ 关系说明：一个客户可以拥有多个广告账户
  └─ 外键：AdAccount.customerId 引用 Customer.id
  └─ 级联规则：SET NULL（删除客户时，账户不删除但解除关联）
  └─ 业务规则：一个账户只能属于一个客户

AdAccount ──(1对多)──> Recommendation
  └─ 关系说明：一个广告账户可以有多条指导建议
  └─ 外键：Recommendation.adAccountId 引用 AdAccount.adAccountId
  └─ 级联规则：CASCADE（删除账户时，级联删除所有建议）
  └─ 业务规则：建议必须关联到具体的账户

Customer ──(1对多)──> Personnel
  └─ 关系说明：一个客户可以有多个相关人员（签约销售、负责销售等）
  └─ 外键：Personnel.customerId 引用 Customer.id
  └─ 级联规则：CASCADE（删除客户时，级联删除人员信息）
  └─ 业务规则：同一客户的同一角色只能有一个人员
```

#### 实体关系图

```
SettlementEntity (结算主体)
    └──(1:N)──> Customer (客户信息)
                   ├──(1:N)──> Personnel (人员信息)
                   │            ├─ 签约销售
                   │            └─ 负责销售
                   └──(1:N)──> AdAccount (广告账户)
                                  ├──(1:N)──> Recommendation (指导建议)
                                  └──(1:N)──> Metric (指标数据)
```

---

### 第四步：数据库表设计

基于实体关系设计具体的数据库表结构。

#### SQL DDL 模板

```sql
-- 父实体表
CREATE TABLE IF NOT EXISTS parent_entity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  field1 TEXT NOT NULL,
  field2 INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- 子实体表（包含外键）
CREATE TABLE IF NOT EXISTS child_entity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  field1 TEXT NOT NULL,
  parentId INTEGER NOT NULL,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (parentId) REFERENCES parent_entity(id) ON DELETE CASCADE
);

-- 为外键创建索引（提升查询性能）
CREATE INDEX IF NOT EXISTS idx_child_entity_parentId 
  ON child_entity(parentId);
```

#### 完整示例（Meta 广告指导）

```sql
-- 结算主体表
CREATE TABLE IF NOT EXISTS settlement_entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entityId TEXT UNIQUE NOT NULL,
  entityName TEXT NOT NULL,
  entityType TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- 客户信息表
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerId TEXT UNIQUE NOT NULL,
  customerName TEXT NOT NULL,
  consolidatedEntity TEXT NOT NULL,
  customerType TEXT,
  settlementEntityId INTEGER,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (settlementEntityId) REFERENCES settlement_entities(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_settlementEntityId 
  ON customers(settlementEntityId);

-- 人员信息表
CREATE TABLE IF NOT EXISTS personnel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  personnelName TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  customerId INTEGER NOT NULL,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_personnel_customerId 
  ON personnel(customerId);

-- 广告账户表
CREATE TABLE IF NOT EXISTS metaadguidance_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adAccountId TEXT UNIQUE NOT NULL,
  accountInfo TEXT,
  accountAttributes TEXT,
  accountScore INTEGER DEFAULT 0,
  guidanceCount INTEGER DEFAULT 0,
  lastUpdateTime TEXT,
  customerId INTEGER,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_metaadguidance_accounts_customerId 
  ON metaadguidance_accounts(customerId);

-- 广告指导建议表
CREATE TABLE IF NOT EXISTS metaadguidance_recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adAccountId TEXT NOT NULL,
  guidanceType TEXT,
  guidanceContent TEXT,
  accountImprovementScore INTEGER DEFAULT 0,
  guidanceUpdateTime TEXT,
  userBehavior TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (adAccountId) REFERENCES metaadguidance_accounts(adAccountId) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_metaadguidance_recommendations_adAccountId 
  ON metaadguidance_recommendations(adAccountId);

-- 广告指标数据表
CREATE TABLE IF NOT EXISTS metaadguidance_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adAccountId TEXT NOT NULL,
  guidanceType TEXT,
  guidanceContent TEXT,
  hasGuidance INTEGER DEFAULT 0,
  userReviewed INTEGER DEFAULT 0,
  callbackUpdateTime TEXT NOT NULL,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (adAccountId) REFERENCES metaadguidance_accounts(adAccountId) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_metaadguidance_metrics_adAccountId 
  ON metaadguidance_metrics(adAccountId);
```

---

### 第五步：数据查询场景

明确主要的数据查询需求，确保实体关系能支持这些查询。

#### 查询场景模板

```markdown
**查询场景 [N]**：[场景描述]
- 查询目的：[为什么需要这个查询]
- 查询内容：[需要获取什么数据]
- 关联表：[需要 JOIN 哪些表]
- 查询条件：[筛选条件]
- 性能要求：[响应时间要求]
- SQL 示例：[关键的 SQL 逻辑]
```

#### 示例：查询场景1

**列表页展示账户信息（包含客户和人员信息）**

| 项目 | 内容 |
|------|------|
| **查询目的** | 运营人员查看所有广告账户及其关联的客户、销售信息 |
| **查询内容** | 账户信息 + 客户信息 + 结算主体 + 签约销售 + 负责销售 |
| **关联表** | metaadguidance_accounts (主表)<br>JOIN customers (通过 customerId)<br>JOIN settlement_entities (通过 settlementEntityId)<br>JOIN personnel (通过 customerId，筛选不同 role)|
| **查询条件** | 支持按合并主体、结算主体、广告账户ID筛选 |
| **性能要求** | < 2 秒 |

**伪代码示例**：

```typescript
const accounts = await getAllData('metaadguidance.accounts');
const customers = await getAllData('customers');
const personnel = await getAllData('personnel');
const settlements = await getAllData('settlement_entities');

const result = accounts.map(account => {
  const customer = customers.find(c => c.id === account.customerId);
  const settlement = settlements.find(s => s.id === customer?.settlementEntityId);
  const contractSales = personnel.find(p => 
    p.customerId === account.customerId && p.role === 'CONTRACT_SALES'
  );
  const responsibleSales = personnel.find(p => 
    p.customerId === account.customerId && p.role === 'RESPONSIBLE_SALES'
  );
  
  return {
    ...account,
    customer,
    settlementEntity: settlement,
    contractSales,
    responsibleSales,
  };
});
```

#### 示例：查询场景2

**查看某个账户的所有指导建议**

| 项目 | 内容 |
|------|------|
| **查询目的** | 运营人员查看特定账户的指导建议详情 |
| **查询内容** | 账户基本信息 + 指导建议列表 |
| **关联表** | metaadguidance_accounts (主表)<br>JOIN metaadguidance_recommendations (通过 adAccountId)|
| **查询条件** | adAccountId = [指定账户ID] |
| **性能要求** | < 1 秒 |

**伪代码示例**：

```typescript
const recommendations = await findData(
  'metaadguidance.recommendations',
  (item) => item.adAccountId === adAccountId
);
```

---

## 4. 实体拆分方法论

### 4.1 名词提取法

#### 步骤

1. 阅读需求文档，标记所有业务相关的名词
2. 判断名词是否需要独立存储数据
3. 如果需要存储多个属性，则作为独立实体
4. 如果只是一个属性值，则作为字段

#### 判断标准

| 类型 | 判断标准 |
|------|---------|
| ✅ **独立实体** | 有多个属性、有独立的生命周期、需要单独查询 |
| ❌ **字段属性** | 只有单一值、依附于其他实体存在 |

#### 示例

```
需求分析：管理 Meta 广告账户、客户信息、结算主体、签约销售、负责销售

名词列表：
1. 广告账户 → ✅ 独立实体（有账户ID、状态、评分等多个属性）
2. 客户信息 → ✅ 独立实体（有客户名称、类型等属性）
3. 结算主体 → ✅ 独立实体（多个客户可能共享同一结算主体）
4. 签约销售 → ⚠️  人员角色（需要进一步分析）
5. 负责销售 → ⚠️  人员角色（需要进一步分析）

进一步分析：
- "签约销售"和"负责销售"都有邮箱、姓名等属性
- 它们是同一类对象（人员）的不同角色
- 应该创建统一的"人员信息"实体，通过 role 字段区分角色
→ ✅ Personnel 实体（包含 role 字段：CONTRACT_SALES / RESPONSIBLE_SALES）
```

### 4.2 生命周期分析法

#### 判断标准

- 对象是否可以独立创建？
- 对象是否可以独立更新？
- 对象是否可以独立删除？
- 对象的存在是否依赖其他对象？

#### 关系判断

| 生命周期 | 设计决策 |
|---------|---------|
| **独立生命周期** | 独立实体（可能通过外键关联）|
| **完全依赖** | 关联实体，使用 CASCADE 级联删除 |
| **部分依赖** | 关联实体，使用 SET NULL |

#### 示例

```
对象：广告指导建议

生命周期分析：
- 可以独立创建？❌ 必须属于某个广告账户
- 可以独立更新？✅ 可以更新建议内容、状态
- 可以独立删除？✅ 可以删除过期的建议
- 存在是否依赖广告账户？✅ 账户删除后，建议没有意义

结论：
→ 独立实体，但强依赖于广告账户
→ 使用 CASCADE 级联删除
→ 外键：Recommendation.adAccountId → AdAccount.adAccountId
```

### 4.3 关系识别法

#### 关系类型判断

| 关系类型 | 说明 | 示例 |
|---------|------|------|
| **1 对 1** | A 和 B 互相唯一对应 | 用户 - 个人资料 |
| **1 对多** | A 可以对应多个 B | 客户 - 广告账户 |
| **多对多** | A 可以对应多个 B，B 也可以对应多个 A | 需要中间表 |

#### 设计原则

- **1 对 1**：考虑是否可以合并为一个实体（除非数据量大或访问频率差异大）
- **1 对多**："多"的一方作为独立实体，包含"1"的外键
- **多对多**：创建中间关联表，包含两个外键

#### 示例

```
关系分析：客户 vs 广告账户

问题：一个客户可以有多少个广告账户？
答案：一个客户可以有多个广告账户

问题：一个广告账户可以属于多少个客户？
答案：一个广告账户只能属于一个客户

结论：1 对多关系
设计：
- Customer (1) ──> AdAccount (多)
- 外键：AdAccount.customerId 引用 Customer.id
```

---

## 5. 实体关系检查清单

### 5.1 创建功能前检查

- [ ] 我已经列出所有核心业务名词
- [ ] 我已经区分哪些是独立实体，哪些是字段
- [ ] 我已经明确每个实体的主键
- [ ] 我已经识别所有实体之间的关系（1对1/1对多/多对多）
- [ ] 我已经确定外键字段的位置
- [ ] 我已经考虑级联删除的规则
- [ ] 我已经列出主要的查询场景
- [ ] 我已经确认实体关系能支持所有查询场景
- [ ] 我已经绘制实体关系图（ER图）

### 5.2 数据库设计检查

- [ ] 所有实体都有对应的数据库表
- [ ] 每个表都有明确的主键
- [ ] 所有关联关系都有外键约束
- [ ] 外键字段已创建索引（性能优化）
- [ ] 级联规则已正确设置（CASCADE / SET NULL / RESTRICT）
- [ ] 表名遵循命名规范（小写、下划线分隔）
- [ ] 字段类型选择合理（TEXT / INTEGER / REAL）
- [ ] 必填字段设置了 NOT NULL 约束
- [ ] 包含时间戳字段（createdAt, updatedAt）

### 5.3 代码实现检查

- [ ] TypeScript 类型定义与数据库表结构一致
- [ ] 每个实体都有对应的 TypeScript 接口
- [ ] 接口中包含关联实体的类型（可选字段）
- [ ] Mock 数据包含关联数据的初始化
- [ ] Mock 数据使用数据库函数，不是硬编码数组
- [ ] 查询接口支持跨表关联查询（通过外键）
- [ ] 详情页面能通过外键查询关联数据
- [ ] 删除操作考虑了级联影响

### 5.4 文档完整性检查

- [ ] 完整的数据模型章节
- [ ] 实体关系图（ER图）
- [ ] 每个实体的说明（业务含义）
- [ ] 实体属性列表（字段说明）
- [ ] 关联关系说明（外键、级联规则）
- [ ] 主要查询场景说明
- [ ] 数据初始化说明

---

## 6. 标准提示词模板

### 6.1 完整提示词模板

```markdown
## 功能需求

创建新功能/修改功能：[功能名称]

功能点 ID: [如 AD-ACC-001]
所属模块: [媒介服务/投放服务/其他]
功能背景: [为什么需要这个功能，解决什么问题]
用户角色: [运营人员/广告主/管理员]
核心场景: [用户在什么情况下使用这个功能]

---

## 数据建模要求（⚠️ 必填）

### 第一步：识别核心实体

**主实体**（功能主要操作的对象）：
- [ ] 实体1：[名称]，说明：[该实体代表什么业务概念]
- [ ] 实体2：[名称]，说明：[该实体代表什么业务概念]

**关联实体**（与主实体相关的对象）：
- [ ] 实体A：[名称]，与主实体关系：[1对1 / 1对多 / 多对多]
- [ ] 实体B：[名称]，与主实体关系：[1对1 / 1对多 / 多对多]

### 第二步：定义实体属性

**实体1：[实体名称]**
- 主键：[字段名]（类型）
- 属性1：[字段名]（类型，是否必填，说明）
- 属性2：[字段名]（类型，是否必填，说明）
- 关联字段：[外键字段名]（关联到哪个实体）

**实体2：[实体名称]**
- 主键：[字段名]（类型）
- 属性1：[字段名]（类型，是否必填，说明）
- 关联字段：[外键字段名]（关联到哪个实体）

### 第三步：明确实体关系

\`\`\`
[主实体A] ──(关系类型)──> [关联实体B]
  └─ 关系说明：一个 A 可以有多个 B
  └─ 外键：B.aId 引用 A.id
  └─ 级联规则：删除 A 时如何处理 B（CASCADE / SET NULL / RESTRICT）
\`\`\`

### 第四步：数据库表设计

\`\`\`sql
CREATE TABLE IF NOT EXISTS [table_name] (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  [field1] TEXT NOT NULL,
  [foreignKey] TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY ([foreignKey]) REFERENCES [parent_table]([parent_key])
);

CREATE INDEX IF NOT EXISTS idx_[table_name]_[foreignKey] 
  ON [table_name]([foreignKey]);
\`\`\`

### 第五步：数据查询场景

**查询场景1**：[场景描述]
- 查询内容：[需要获取什么数据]
- 关联表：[需要 JOIN 哪些表]
- 查询条件：[筛选条件]

---

## 功能实现要求

请生成：
1. ✅ PRD 文档（包含完整的数据模型章节）
2. ✅ 数据库表结构定义（在 src/db/index.ts 中）
3. ✅ TypeScript 类型定义（包含所有实体和关联关系）
4. ✅ 前端原型代码（Umi + React + Ant Design v4）
5. ✅ Mock 数据（使用数据库，包含关联数据的初始化）

---

## 质量检查（AI 生成后必须确认）

### 数据建模检查
- [ ] 所有实体都有明确的主键
- [ ] 所有关联关系都有外键约束
- [ ] 外键字段已创建索引
- [ ] 每个实体至少关联到一个其他实体（除非是独立实体）
- [ ] 级联删除规则已明确定义

### 代码实现检查
- [ ] 数据库表结构包含所有实体和关系
- [ ] TypeScript 类型定义与数据库表结构一致
- [ ] Mock 数据包含关联数据的初始化
- [ ] 查询接口支持跨表查询（通过外键关联）
- [ ] 详情页面能正确显示关联数据
```

### 6.2 快速提示词模板（简化版）

```markdown
创建功能：[功能名称]

⚠️ 数据建模要求：
1. 核心实体：[列出所有实体及其关系]
2. 外键设计：[说明哪些表包含外键，关联到哪里]
3. 查询场景：[列出主要的查询需求]

请确保：
- 所有实体通过外键建立关联
- 为所有外键创建索引
- Mock 数据包含完整的关联初始化
- 查询接口支持 JOIN 操作
```

---

## 7. 常见问题与解决方案

### 问题 1：数据孤立，无法关联查询

#### 症状

- 每个页面都有数据，但数据之间没有关联
- 详情页显示的内容是硬编码，不是根据 ID 查询的
- 无法通过外键查询关联数据

#### 原因

- 数据库表没有外键约束
- Mock 数据是独立的硬编码数组
- 查询接口不支持跨表关联

#### 解决方案

1. 在数据库表中添加外键字段和约束
2. 为外键创建索引
3. 重构 Mock 数据，使用数据库函数
4. 在查询接口中通过外键进行 JOIN 操作

---

### 问题 2：实体拆分不合理

#### 症状

- 应该独立的实体被合并成一个表
- 应该作为字段的属性被拆成独立表
- 查询时需要多次 JOIN，性能差

#### 原因

- 没有正确识别实体的独立性
- 没有考虑实体的生命周期
- 过度设计或设计不足

#### 解决方案

1. 使用"名词提取法"识别核心实体
2. 使用"生命周期分析法"判断独立性
3. 根据查询场景调整实体粒度
4. 平衡规范化和性能

---

### 问题 3：级联删除规则不明确

#### 症状

- 删除父实体后，子实体变成孤立数据
- 删除父实体时，子实体应该删除但未删除
- 删除操作导致数据不一致

#### 原因

- 没有定义级联删除规则
- 级联规则选择不当

#### 解决方案

1. 明确每个关系的业务规则
2. 强依赖关系使用 CASCADE
3. 弱依赖关系使用 SET NULL
4. 需要保护的关系使用 RESTRICT

---

### 问题 4：TypeScript 类型与数据库不一致

#### 症状

- 类型定义缺少外键字段
- 类型定义与数据库字段名不匹配
- 类型定义缺少关联实体的引用

#### 原因

- 先写代码后设计数据库
- 数据库更新后未同步类型定义

#### 解决方案

1. 先设计数据库表结构
2. 根据表结构生成 TypeScript 类型
3. 包含可选的关联实体字段
4. 定期检查类型与数据库的一致性

---

## 8. 最佳实践

### 8.1 设计阶段

#### ✅ DO

- 先完成数据建模，再开始编码
- 绘制实体关系图（ER图）
- 明确所有关联关系和外键
- 考虑所有查询场景
- 与团队讨论实体拆分方案

#### ❌ DON'T

- 边写代码边设计数据结构
- 忽略实体关系，只关注单个表
- 不考虑级联删除影响
- 跳过数据建模流程

---

### 8.2 实现阶段

#### ✅ DO

- 所有关联关系使用外键约束
- 为所有外键创建索引
- Mock 数据包含完整的关联初始化
- 查询接口支持 JOIN 操作
- TypeScript 类型与数据库一致

#### ❌ DON'T

- 在 Mock 文件中硬编码数据数组
- 详情接口返回固定的假数据
- 忽略外键索引（影响性能）
- 创建孤立的数据表

---

### 8.3 验证阶段

#### ✅ DO

- 使用检查清单验证设计
- 测试跨表关联查询
- 验证级联删除行为
- 检查数据完整性约束
- 更新 PRD 文档

#### ❌ DON'T

- 跳过质量检查
- 不测试关联查询
- 不验证删除操作
- 忘记更新文档

---

## 9. 工具与资源

### 9.1 ER图绘制工具

- draw.io (免费)
- Lucidchart
- dbdiagram.io
- PlantUML

### 9.2 数据库设计工具

- SQLite Browser
- DBeaver
- TablePlus

### 9.3 参考资料

- 数据库设计范式
- 实体关系模型（ER模型）
- 外键约束最佳实践
- SQLite 文档

---

## 📝 文档变更记录

| 版本 | 日期 | 更新内容 |
|------|------|---------|
| v1.1 | 2025-01-15 | 重构文档结构，优化可读性，增加表格展示 |
| v1.0 | 2025-01-01 | 初始版本 |

---

**当前版本**：v1.1  
**最后更新**：2025-01-15  
**维护团队**：VisionLine 产品团队
