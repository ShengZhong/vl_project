# 数据建模与实体关系规范

## 1. 文档目标

- 提供标准化的数据建模流程和方法论
- 确保所有功能模块建立正确的实体关系
- 避免数据孤岛和硬编码问题
- 支持复杂的业务查询场景

## 2. 何时使用本规范

**必须使用**：
- 创建任何新功能时
- 修改现有功能的数据结构时
- 涉及多个业务实体交互时
- 需要跨表查询数据时

**可选使用**：
- 纯展示型页面（无数据存储）
- 简单的单表CRUD操作

## 3. 标准提示词模板

在创建或修改功能时，请使用以下完整模板与 AI 协作：

```markdown
## 功能需求

创建新功能/修改功能：[功能名称]

功能点 ID: [自动生成或手动指定，如 AD-ACC-001]
所属模块: [媒介服务/投放服务/其他]
功能背景: [为什么需要这个功能，解决什么问题]
用户角色: [运营人员/广告主/管理员]
核心场景: [用户在什么情况下使用这个功能]

---

## 数据建模要求（⚠️ 必填）

### 第一步：识别核心实体

请列出本功能涉及的所有核心实体（业务对象）：

**主实体**（功能主要操作的对象）：
- [ ] 实体1：[名称]，说明：[该实体代表什么业务概念]
- [ ] 实体2：[名称]，说明：[该实体代表什么业务概念]

**关联实体**（与主实体相关的对象）：
- [ ] 实体A：[名称]，与主实体关系：[1对1 / 1对多 / 多对多]
- [ ] 实体B：[名称]，与主实体关系：[1对1 / 1对多 / 多对多]

**示例**：
主实体：
- [x] 广告账户 (AdAccount)，说明：Meta 广告账户，是广告投放的基本单位
- [x] 客户信息 (Customer)，说明：广告账户的所有者/使用者

关联实体：
- [x] 广告指导建议 (AdGuidanceRecommendation)，与广告账户关系：1对多
- [x] 建议回传记录 (RecommendationCallback)，与广告指导建议关系：1对多
- [x] 指标数据 (MetricData)，与广告账户关系：1对多

### 第二步：定义实体属性

为每个实体列出关键属性（字段）：

**实体1：[实体名称]**
- 主键：[字段名]（类型）
- 属性1：[字段名]（类型，是否必填，说明）
- 属性2：[字段名]（类型，是否必填，说明）
- ...
- 关联字段：[外键字段名]（关联到哪个实体）

**示例**：
**实体1：广告账户 (AdAccount)**
- 主键：adAccountId（string，Meta 广告账户 ID）
- 属性1：accountName（string，必填，账户名称）
- 属性2：accountStatus（enum，必填，账户状态）
- 关联字段：customerId（外键，关联到 Customer.id）

**实体2：广告指导建议 (AdGuidanceRecommendation)**
- 主键：id（自增 ID）
- 属性1：guidanceType（string，必填，指导类型）
- 属性2：guidanceContent（string，必填，指导内容）
- 关联字段：adAccountId（外键，关联到 AdAccount.adAccountId）

### 第三步：明确实体关系

用文字或图形描述实体之间的关系：

```
[主实体A] ──(关系类型)──> [关联实体B]
  └─ 关系说明：一个 A 可以有多个 B
  └─ 外键：B.aId 引用 A.id
  └─ 级联规则：删除 A 时如何处理 B（CASCADE / SET NULL / RESTRICT）
```

**示例**：
```
Customer ──(1对多)──> AdAccount
  └─ 关系说明：一个客户可以拥有多个广告账户
  └─ 外键：AdAccount.customerId 引用 Customer.id
  └─ 级联规则：删除客户时，关联账户设置为 NULL

AdAccount ──(1对多)──> AdGuidanceRecommendation
  └─ 关系说明：一个广告账户可以有多条指导建议
  └─ 外键：AdGuidanceRecommendation.adAccountId 引用 AdAccount.adAccountId
  └─ 级联规则：删除账户时，级联删除所有相关建议

AdGuidanceRecommendation ──(1对多)──> RecommendationCallback
  └─ 关系说明：一条指导建议可以有多次回传记录
  └─ 外键：RecommendationCallback.recommendationId 引用 AdGuidanceRecommendation.id
  └─ 级联规则：删除建议时，级联删除所有回传记录
```

### 第四步：数据库表设计

基于上述实体关系，请设计数据库表结构：

**表1：[表名]**
```sql
CREATE TABLE IF NOT EXISTS [table_name] (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  [field1] TEXT NOT NULL,
  [field2] INTEGER DEFAULT 0,
  [foreignKey] TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY ([foreignKey]) REFERENCES [parent_table]([parent_key])
);

-- 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_[table_name]_[foreignKey] 
  ON [table_name]([foreignKey]);
```

**示例**：
```sql
-- 客户信息表
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerName TEXT NOT NULL,
  settlementEntity TEXT,        -- 结算主体
  registrationEntity TEXT,       -- 开户主体
  contractSales TEXT,            -- 签约销售
  responsibleSales TEXT,         -- 负责销售
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- 广告账户表
CREATE TABLE IF NOT EXISTS metaadguidance_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adAccountId TEXT UNIQUE NOT NULL,
  accountName TEXT,
  customerId INTEGER,            -- 外键：关联客户
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customerId) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_accounts_customerId 
  ON metaadguidance_accounts(customerId);

-- 广告指导建议表
CREATE TABLE IF NOT EXISTS metaadguidance_recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adAccountId TEXT NOT NULL,     -- 外键：关联广告账户
  guidanceType TEXT,
  guidanceContent TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (adAccountId) REFERENCES metaadguidance_accounts(adAccountId)
);

CREATE INDEX IF NOT EXISTS idx_recommendations_adAccountId 
  ON metaadguidance_recommendations(adAccountId);
```

### 第五步：数据查询场景

列出主要的查询场景，确保实体关系支持这些查询：

**查询场景1**：[场景描述]
- 查询内容：[需要获取什么数据]
- 关联表：[需要 JOIN 哪些表]
- 查询条件：[筛选条件]

**示例**：
**查询场景1**：查看某个客户的所有广告账户及其指导建议数量
- 查询内容：客户信息 + 账户列表 + 每个账户的建议数量
- 关联表：customers JOIN metaadguidance_accounts JOIN metaadguidance_recommendations
- 查询条件：customerId = [指定客户ID]

**查询场景2**：查看某个广告账户的所有指导建议及回传记录
- 查询内容：账户信息 + 建议列表 + 每条建议的回传记录
- 关联表：metaadguidance_accounts JOIN metaadguidance_recommendations JOIN recommendation_callbacks
- 查询条件：adAccountId = [指定账户ID]

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

### 文档检查
- [ ] PRD 包含完整的数据模型章节
- [ ] 数据模型图清晰展示实体关系
- [ ] 每个实体的作用都有说明
- [ ] 关联关系的业务含义已说明
```

---

## 4. 实体拆分方法论

### 方法 1：名词提取法

从需求描述中提取所有**核心名词**，这些通常是潜在实体。

**步骤**：
1. 阅读需求文档，标记所有业务名词
2. 判断名词是否需要独立存储数据
3. 如果需要存储多个属性，则作为独立实体
4. 如果只是一个属性值，则作为字段

**示例（Meta 广告指导）**：
- ✅ **广告账户**（核心实体）- 有多个属性（ID、名称、状态等）
- ✅ **客户**（独立实体）- 有独立的属性（客户名称、结算主体等）
- ✅ **指导建议**（独立实体）- 有独立的属性（类型、内容、时间等）
- ❌ **结算主体**（字段）- 是客户的一个属性，不需要独立实体（简单场景）
- ❌ **负责销售**（字段）- 是客户的一个属性
- ✅ **结算主体**（独立实体）- 如果多个客户共享同一结算主体，则需要独立实体（复杂场景）

**判断标准**：
- 是否有多个属性？→ 独立实体
- 是否会被多个实体引用？→ 独立实体
- 是否有独立的生命周期？→ 独立实体
- 只是一个简单值？→ 字段

### 方法 2：生命周期分析法

判断对象是否有独立的生命周期（创建、更新、删除）。

**规则**：
- **独立生命周期** → 独立实体
- **依赖其他对象** → 作为关联实体或字段

**示例**：
- ✅ **广告账户** - 可以独立创建、修改、删除 → 独立实体
- ✅ **指导建议** - 可以独立添加、修改、删除（但依赖账户存在）→ 独立实体
- ❌ **账户状态** - 不能独立存在，只是账户的一个状态 → 字段（枚举）
- ✅ **人员信息** - 可以独立管理（添加、删除人员）→ 独立实体

### 方法 3：关系识别法

识别对象之间的关系类型。

**关系类型**：

1. **1 对 1**：一个实体的一条记录对应另一个实体的一条记录
   - 示例：用户 - 个人资料
   - 实现：可以合并为一个表，或分两个表通过外键关联

2. **1 对多**：一个实体的一条记录对应另一个实体的多条记录
   - 示例：客户 - 广告账户、账户 - 指导建议
   - 实现："多"的一方存储"一"的外键

3. **多对多**：两个实体的记录可以相互对应多条
   - 示例：广告账户 - 标签、用户 - 角色
   - 实现：需要中间表（关联表）

**判断规则**：
- 如果是 **1 对多** 或 **多对多**，"多"的一方通常是独立实体
- 如果是 **1 对 1**，可以考虑合并为一个实体（除非数据量大或访问频率差异大）

**示例分析**：
```
客户 ──(1对多)──> 广告账户
  → 一个客户可以有多个账户
  → 账户表需要 customerId 外键

广告账户 ──(1对多)──> 指导建议
  → 一个账户可以有多条建议
  → 建议表需要 adAccountId 外键

广告账户 ──(多对多)──> 标签
  → 一个账户可以有多个标签，一个标签可以用于多个账户
  → 需要中间表：account_tags (adAccountId, tagId)
```

### 方法 4：领域驱动设计法（DDD）

从业务领域的角度识别聚合根和实体。

**核心概念**：
- **聚合根（Aggregate Root）**：领域模型中的核心实体，对外暴露
- **实体（Entity）**：有唯一标识的对象
- **值对象（Value Object）**：没有唯一标识，只有属性值的对象

**应用示例**：
```
聚合根：广告账户
  └─ 实体：指导建议
  └─ 实体：指标数据
  └─ 值对象：账户配置（bid, budget, targeting）

聚合根：客户
  └─ 实体：人员信息
  └─ 值对象：联系方式（email, phone）
```

---

## 5. 实体关系检查清单

### 创建功能前检查

```markdown
□ 我已经列出所有核心业务名词
□ 我已经区分哪些是独立实体，哪些是字段
□ 我已经明确每个实体的主键
□ 我已经识别所有实体之间的关系（1对1/1对多/多对多）
□ 我已经确定外键字段的位置
□ 我已经考虑级联删除的规则
□ 我已经列出主要的查询场景
□ 我已经确认实体关系能支持所有查询场景
```

### AI 生成后验证

```markdown
□ 数据库表结构包含所有实体
□ 每个关联关系都有对应的外键
□ 外键字段已创建索引（性能优化）
□ TypeScript 类型定义与数据库表一致
□ Mock 数据包含关联数据（不是孤立的硬编码数据）
□ 详情页面能通过外键查询关联数据
□ PRD 文档包含完整的数据模型图
□ 数据模型图清晰展示实体关系
```

---

## 6. 常见问题与解决方案

### 问题 1：数据孤岛

**症状**：
- 多个功能的数据无法关联
- 详情页面显示硬编码数据
- 相同实体在不同表中重复存储

**原因**：
- 缺少外键关联
- 表设计时未考虑实体关系

**解决方案**：
1. 识别共享的实体（如客户、账户）
2. 提取为独立表
3. 通过外键建立关联
4. 更新查询逻辑，使用 JOIN

**示例**：
```sql
-- 问题：账户和建议是独立的表，无法关联
SELECT * FROM accounts WHERE adAccountId = '123';
SELECT * FROM recommendations; -- 无法知道哪些属于账户123

-- 解决：添加外键
ALTER TABLE recommendations ADD COLUMN adAccountId TEXT;
ALTER TABLE recommendations ADD FOREIGN KEY (adAccountId) REFERENCES accounts(adAccountId);

-- 查询时关联
SELECT a.*, r.* 
FROM accounts a 
LEFT JOIN recommendations r ON a.adAccountId = r.adAccountId
WHERE a.adAccountId = '123';
```

### 问题 2：外键缺失或错误

**症状**：
- 删除父记录后，子记录成为孤儿数据
- 无法查询关联数据
- 数据一致性问题

**原因**：
- 未定义外键约束
- 外键指向错误的字段

**解决方案**：
1. 为所有关联关系添加外键约束
2. 定义级联规则（CASCADE / SET NULL / RESTRICT）
3. 创建外键索引

**示例**：
```sql
-- 添加外键约束
CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adAccountId TEXT NOT NULL,
  guidanceType TEXT,
  FOREIGN KEY (adAccountId) REFERENCES accounts(adAccountId) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_recommendations_adAccountId ON recommendations(adAccountId);
```

### 问题 3：过度规范化

**症状**：
- 查询需要 JOIN 太多表（>5个）
- 性能下降
- 代码复杂度高

**原因**：
- 实体拆分过细
- 每个小属性都独立成表

**解决方案**：
1. 合并低频访问的实体
2. 将简单值对象作为字段存储
3. 使用 JSON 字段存储扩展属性
4. 适当冗余数据

**示例**：
```typescript
// 过度规范化：账户配置独立成表
CREATE TABLE account_configs (
  id INTEGER PRIMARY KEY,
  adAccountId TEXT,
  bid REAL,
  budget REAL,
  FOREIGN KEY (adAccountId) REFERENCES accounts(adAccountId)
);

// 改进：配置作为字段或JSON
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  adAccountId TEXT,
  bid REAL,
  budget REAL,
  advancedConfig TEXT  -- JSON格式，存储扩展配置
);
```

### 问题 4：多对多关系处理不当

**症状**：
- 无法表示多对多关系
- 数据重复存储

**原因**：
- 未使用中间表

**解决方案**：
- 创建关联表（中间表）
- 存储两个实体的外键

**示例**：
```sql
-- 账户和标签是多对多关系

-- 账户表
CREATE TABLE accounts (
  adAccountId TEXT PRIMARY KEY,
  accountName TEXT
);

-- 标签表
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tagName TEXT UNIQUE
);

-- 关联表（中间表）
CREATE TABLE account_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  adAccountId TEXT,
  tagId INTEGER,
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (adAccountId) REFERENCES accounts(adAccountId) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(adAccountId, tagId)  -- 防止重复关联
);

CREATE INDEX idx_account_tags_adAccountId ON account_tags(adAccountId);
CREATE INDEX idx_account_tags_tagId ON account_tags(tagId);
```

---

## 7. 完整示例：Meta 广告指导功能

### 业务需求

管理 Meta 广告账户的指导建议，追踪客户采纳情况。

### 实体识别

**主实体**：
- 客户信息 (Customer)
- 广告账户 (AdAccount)

**关联实体**：
- 结算主体 (SettlementEntity) - 多个客户可能属于同一结算主体
- 人员信息 (Personnel) - 客户的签约销售、负责销售
- 广告指导建议 (Recommendation)
- 广告指标数据 (Metric)

### 实体关系图

```
SettlementEntity (结算主体)
    └──> Customer (客户信息)
            ├──> Personnel (人员信息) [签约销售、负责销售]
            └──> AdAccount (广告账户)
                    ├──> Recommendation (广告指导建议)
                    └──> Metric (广告指标数据)
```

### 数据库表设计

```sql
-- 1. 结算主体表
CREATE TABLE IF NOT EXISTS settlement_entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entityId TEXT UNIQUE NOT NULL,
  entityName TEXT NOT NULL,
  entityType TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- 2. 客户信息表
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerId TEXT UNIQUE NOT NULL,
  customerName TEXT NOT NULL,
  consolidatedEntity TEXT NOT NULL,
  customerType TEXT,
  settlementEntityId INTEGER,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (settlementEntityId) REFERENCES settlement_entities(id)
);

CREATE INDEX IF NOT EXISTS idx_customers_settlementEntityId 
  ON customers(settlementEntityId);

-- 3. 人员信息表
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

-- 4. 广告账户表
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
  FOREIGN KEY (customerId) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_metaadguidance_accounts_customerId 
  ON metaadguidance_accounts(customerId);

-- 5. 广告指导建议表
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

-- 6. 广告指标数据表
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

### 查询场景

**场景 1：列表页展示账户信息**
```typescript
// 查询账户，JOIN客户、结算主体、人员信息
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
    settlement,
    contractSales,
    responsibleSales,
  };
});
```

**场景 2：查看账户的指导建议**
```typescript
// 根据 adAccountId 查询建议
const recommendations = await findData(
  'metaadguidance.recommendations',
  (item) => item.adAccountId === adAccountId
);
```

**场景 3：查看账户的指标数据**
```typescript
// 根据 adAccountId 查询指标
const metrics = await findData(
  'metaadguidance.metrics',
  (item) => item.adAccountId === adAccountId
);
```

---

## 8. 最佳实践

### DO ✅

- **明确实体边界**：每个实体代表一个独立的业务概念
- **使用外键约束**：确保数据一致性
- **创建索引**：为所有外键和常用查询字段创建索引
- **定义级联规则**：明确父记录删除时子记录的处理方式
- **文档化关系**：在 PRD 中清晰说明实体关系
- **初始化关联数据**：Mock 数据要包含完整的关联关系
- **使用 JOIN 查询**：避免 N+1 查询问题

### DON'T ❌

- **不要硬编码数据**：Mock 接口返回固定数据，无视外键
- **不要忽略外键**：表之间有关系但没有外键约束
- **不要过度拆分**：每个小属性都独立成表
- **不要重复存储**：相同的数据在多个表中重复
- **不要忽略索引**：外键字段没有索引，查询性能差
- **不要跳过文档**：数据模型没有在 PRD 中说明

---

## 9. 工具与资源

### 推荐工具

- **数据建模工具**：
  - DbDiagram.io - 在线 ER 图工具
  - draw.io - 通用图表工具
  - PlantUML - 代码生成图表

- **数据库工具**：
  - DB Browser for SQLite - SQLite 可视化工具
  - DBeaver - 通用数据库管理工具

### 参考资源

- **数据库设计规范**：阅读 `database-standards.md`
- **前端代码规范**：阅读 `frontend-standards.md`
- **PRD 文档规范**：阅读 `prd-standards.md`

---

## 10. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2025-01-15 | 初始版本，包含完整的数据建模规范和示例 |

---

**最后更新**：2025-01-15  
**维护者**：产品团队

