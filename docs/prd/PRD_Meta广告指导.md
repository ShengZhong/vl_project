# PRD: Meta广告指导

## 文档信息

- **功能点 ID**: ZT-TOOL-001
- **产品模块**: 媒介中台 > 工具类 > Meta广告指导
- **创建日期**: 2025-01-15
- **创建人**: 产品团队
- **当前版本**: v1.1
- **最后更新**: 2025-01-15
- **文档状态**: 待评审

## 1. 背景与目标 (Background & Objectives)

### 1.1 业务背景

根据 Meta 媒体要求，需要拉取 Meta 生成的广告指导建议，和通过系统自动、人工推送、人工沟通等方式，Push 客户采纳广告指导建议，进而提升广告质量。

当前缺少统一的平台来管理和展示 Meta 广告指导建议，无法有效追踪客户对建议的采纳情况，影响广告质量提升效果。

此外，为了提升用户体验和操作效率，需要对界面进行美化，增加关键指标的仪表盘展示和交互特效。

### 1.2 目标用户

- **主要用户**：账户运营人员
- **次要用户**：客户服务人员、数据分析人员

### 1.3 核心目标

1. **自动化管理**：自动将近一天状态为 Active 的广告账户添加到广告池，减少人工操作 80%
2. **数据同步**：通过 Meta API 实时同步广告指导建议数据，数据同步延迟 < 5 分钟
3. **客户触达**：通过 VisionLine 平台展示指导建议，客户查看率提升至 60% 以上
4. **数据回传**：支持客户查看、点击后自动回传 Meta，回传成功率 > 95%
5. **人工记录**：支持手动上传 Excel 记录人工沟通数据，回传效率提升 50%
6. **体验升级**：提供仪表盘视图和流畅的交互动效，提升用户满意度

## 2. 用户故事 (User Stories)

### Story 1: 查看广告账户指导列表及仪表盘

- **作为** 账户运营人员
- **我想要** 在进入页面时看到关键指标概览，并查看美化后的账户列表
- **以便于** 快速了解整体情况并愉悦地进行操作
- **优先级**: 🔴 P0

**验收条件**：
- 顶部展示关键指标卡片（总账户数、平均评分、总指导数、待处理建议等）
- 指标卡片带有图标和渐变背景特效
- 列表加载时带有平滑的淡入动画
- 列表展示所有关键信息（广告账户ID、合并主体、结算主体、账户信息、人员信息、账户属性、账户评分、广告指导数量、指导更新时间）
- 支持按合并主体、结算主体、广告账户ID筛选
- 支持分页展示，每页 10/20/50/100 条可选
- 加载时间 < 2 秒

### Story 2: 查看广告优化建议（Modal弹框）

- **作为** 账户运营人员
- **我想要** 点击"指导建议"按钮时，在弹框中查看该账户的优化建议列表
- **以便于** 快速了解账户的优化建议，并进行采纳或忽略操作
- **优先级**: 🔴 P0

**验收条件**：
- 点击"指导建议"按钮后，弹出Modal展示优化建议
- Modal中展示分类统计（预算、创意、受众、自动化）
- 优化建议列表展示：建议标题、分类、影响广告数、分数提升、机会分数、状态等
- 支持筛选（按分类、状态、机会分数范围）
- 支持查看建议详情（在Drawer中展示）
- 支持采纳/忽略建议操作
- 操作成功后自动刷新列表
- 数据加载时间 < 2 秒

### Story 3: 查看广告指标回传数据详情

- **作为** 账户运营人员
- **我想要** 查看广告指标的详细回传数据
- **以便于** 分析广告效果和客户采纳情况
- **优先级**: 🟡 P1

**验收条件**：
- 展示指导类型、指导内容、是否存在指导、用户是否查阅、是否推送、用户是否点击、用户是否采纳、触达后用户是否采纳、采纳后广告对象收入、采纳类型、采纳时间、上次触达时间、用户上次采纳时间、用户上次执行时间、回传更新时间等详细信息
- 支持返回列表
- 数据加载时间 < 1 秒

### Story 4: 手动上传Excel回传数据

- **作为** 账户运营人员
- **我想要** 手动上传 Excel 文件记录人工沟通的数据
- **以便于** 将人工沟通的记录通过 API 回传给 Meta
- **优先级**: 🟡 P1

**验收条件**：
- 支持上传 Excel 文件（.xlsx, .xls）
- 文件格式校验，错误时提示具体错误信息
- 上传成功后自动解析并回传 Meta
- 上传进度显示
- 上传结果反馈（成功/失败）

### Story 5: 新增客户

- **作为** 账户运营人员
- **我想要** 手动添加新的广告账户到系统中
- **以便于** 管理不在自动添加范围内的账户
- **优先级**: 🟢 P2

**验收条件**：
- 可以填写广告账户ID、合并主体、结算主体等信息
- 表单校验完整
- 保存成功后刷新列表

## 3. 功能需求 (Functional Requirements)

### 3.1 功能点 1: 广告账户指导列表展示

- **功能描述**: 展示所有广告账户的指导建议列表，包含账户基本信息、人员信息、账户属性、评分、指导数量等
- **输入**: 
  - 合并主体（选填，支持搜索选择）
  - 结算主体（选填，支持搜索选择）
  - 广告账户ID（选填，支持搜索选择）
  - 分页参数（页码、每页条数）
- **处理**:
  - 调用后端接口获取列表数据
  - 根据筛选条件过滤数据
  - 格式化显示时间、标签等
- **输出**:
  - 表格展示账户列表
  - 分页控件
  - 操作按钮（广告指导、广告指标、删除）
- **异常处理**:
  - 网络错误：提示"网络异常，请稍后重试"
  - 数据为空：显示"暂无数据"
  - 加载超时：提示"加载超时，请刷新重试"

### 3.2 功能点 2: 广告优化建议Modal

- **功能描述**: 在Modal弹框中展示某个广告账户的优化建议列表，融合VL广告指导建议功能
- **输入**: 
  - 广告账户ID（必填，来自列表行记录）
  - 筛选条件（选填）：分类、状态、机会分数范围
  - 分页参数（页码、每页条数）
- **处理**:
  - 根据账户ID查询优化建议列表（调用VL广告指导建议API）
  - 加载分类统计数据
  - 支持分类筛选、状态筛选、分数筛选
  - 支持查看建议详情（在Drawer中展示）
  - 支持采纳/忽略建议操作
  - 操作成功后自动刷新列表
- **输出**:
  - Modal弹框（1200px宽）
  - 分类统计卡片（预算、创意、受众、自动化）
  - 优化建议表格
  - 详情抽屉（Drawer）
- **异常处理**:
  - 账户ID不存在：显示"暂无数据"
  - 数据加载失败：提示"加载失败，请重试"
  - 操作失败：显示具体错误信息

### 3.3 功能点 3: 广告指标回传数据详情

- **功能描述**: 展示广告指标的详细回传数据
- **输入**: 
  - 广告账户ID（必填）
- **处理**:
  - 调用后端接口获取指标数据
  - 格式化显示时间、布尔值等
- **输出**:
  - 指标详情表格展示
  - 返回列表按钮
- **异常处理**:
  - 账户ID不存在：提示"账户不存在"
  - 数据加载失败：提示"加载失败，请重试"

### 3.4 功能点 4: 手动上传Excel回传数据

- **功能描述**: 支持手动上传 Excel 文件，记录人工沟通的数据并回传给 Meta
- **输入**: 
  - Excel 文件（必填，.xlsx 或 .xls 格式）
  - 文件大小限制：10MB
- **处理**:
  - 文件格式校验
  - 文件内容解析
  - 数据格式校验
  - 调用 Meta API#3 回传数据
- **输出**:
  - 上传进度显示
  - 上传成功/失败提示
  - 错误详情（如有）
- **异常处理**:
  - 文件格式错误：提示"请上传 Excel 文件（.xlsx 或 .xls）"
  - 文件过大：提示"文件大小不能超过 10MB"
  - 数据格式错误：提示具体错误行和错误信息
  - 回传失败：提示"回传失败，请检查数据格式后重试"

### 3.5 功能点 5: 新增客户

- **功能描述**: 手动添加新的广告账户到系统中
- **输入**: 
  - 广告账户ID（必填）
  - 合并主体（必填）
  - 结算主体（必填）
  - 账户信息（选填）
  - 人员信息（选填）
- **处理**:
  - 表单数据校验
  - 调用后端接口保存
- **输出**:
  - 保存成功提示
  - 刷新列表
- **异常处理**:
  - 账户ID已存在：提示"该账户ID已存在"
  - 保存失败：提示"保存失败，请重试"

## 4. 数据模型

### 4.1 实体关系图（ERD）

```
SettlementEntity (结算主体)
    └──(1对多)──> Customer (客户信息)
            ├──(1对多)──> Personnel (人员信息) [签约销售、负责销售]
            └──(1对多)──> AdAccount (广告账户)
                    ├──(1对多)──> Recommendation (广告指导建议)
                    └──(1对多)──> Metric (广告指标数据)
```

**实体关系说明**：

1. **SettlementEntity → Customer (1对多)**
   - 一个结算主体可以有多个客户
   - 外键：`Customer.settlementEntityId` 引用 `SettlementEntity.id`
   - 级联规则：删除结算主体时，关联客户的 `settlementEntityId` 设置为 NULL

2. **Customer → Personnel (1对多)**
   - 一个客户可以有多个人员（签约销售、负责销售）
   - 外键：`Personnel.customerId` 引用 `Customer.id`
   - 级联规则：删除客户时，级联删除所有相关人员

3. **Customer → AdAccount (1对多)**
   - 一个客户可以拥有多个广告账户
   - 外键：`AdAccount.customerId` 引用 `Customer.id`
   - 级联规则：删除客户时，关联账户的 `customerId` 设置为 NULL

4. **AdAccount → Recommendation (1对多)**
   - 一个广告账户可以有多条指导建议
   - 外键：`Recommendation.adAccountId` 引用 `AdAccount.adAccountId`
   - 级联规则：删除账户时，级联删除所有相关建议

5. **AdAccount → Metric (1对多)**
   - 一个广告账户可以有多条指标数据
   - 外键：`Metric.adAccountId` 引用 `AdAccount.adAccountId`
   - 级联规则：删除账户时，级联删除所有相关指标数据

### 4.2 实体定义

#### 4.2.1 SettlementEntity (结算主体)

**描述**：记录结算主体的基本信息，一个结算主体可以服务多个客户。

**属性**：
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - 自增主键
- `entityId`: TEXT UNIQUE NOT NULL - 结算主体唯一标识
- `entityName`: TEXT NOT NULL - 结算主体名称
- `entityType`: TEXT - 结算主体类型
- `createdAt`: TEXT - 创建时间
- `updatedAt`: TEXT - 更新时间

**示例数据**：
```json
{
  "id": 1,
  "entityId": "17016",
  "entityName": "AD Pure Limited"
}
```

#### 4.2.2 Customer (客户信息)

**描述**：记录客户的基本信息，关联到结算主体和人员信息。

**属性**：
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - 自增主键
- `customerId`: TEXT UNIQUE NOT NULL - 客户唯一标识
- `customerName`: TEXT NOT NULL - 客户名称
- `consolidatedEntity`: TEXT NOT NULL - 合并主体
- `customerType`: TEXT - 客户类型 (BV/MH/BMP)
- `settlementEntityId`: INTEGER - 结算主体ID (外键)
- `createdAt`: TEXT - 创建时间
- `updatedAt`: TEXT - 更新时间

**外键关系**：
- `FOREIGN KEY (settlementEntityId) REFERENCES settlement_entities(id)`

**索引**：
- `CREATE INDEX idx_customers_settlementEntityId ON customers(settlementEntityId)`

**示例数据**：
```json
{
  "id": 1,
  "customerId": "17016",
  "customerName": "AD Pure Limited",
  "consolidatedEntity": "天津赤影商贸有限公司",
  "customerType": "BV",
  "settlementEntityId": 1
}
```

#### 4.2.3 Personnel (人员信息)

**描述**：记录与客户相关的人员信息（签约销售、负责销售）。

**属性**：
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - 自增主键
- `personnelName`: TEXT - 人员姓名
- `email`: TEXT NOT NULL - 邮箱
- `role`: TEXT NOT NULL - 角色 (CONTRACT_SALES/RESPONSIBLE_SALES)
- `customerId`: INTEGER NOT NULL - 客户ID (外键)
- `createdAt`: TEXT - 创建时间
- `updatedAt`: TEXT - 更新时间

**外键关系**：
- `FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE`

**索引**：
- `CREATE INDEX idx_personnel_customerId ON personnel(customerId)`

**示例数据**：
```json
{
  "id": 1,
  "email": "chang.zhao@bluefocus.com",
  "role": "CONTRACT_SALES",
  "customerId": 1
}
```

#### 4.2.4 AdAccount (广告账户)

**描述**：Meta 广告账户信息，关联到客户，包含账户的基本信息和评分。

**属性**：
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - 自增主键
- `adAccountId`: TEXT UNIQUE NOT NULL - 广告账户ID
- `accountInfo`: TEXT - 账户信息
- `accountAttributes`: TEXT - 账户属性
- `accountScore`: INTEGER - 账户评分
- `guidanceCount`: INTEGER - 广告指导数量
- `lastUpdateTime`: TEXT - 指导更新时间
- `customerId`: INTEGER - 客户ID (外键)
- `consolidatedEntity`: TEXT - 合并主体
- `settlementEntity`: TEXT - 结算主体
- `createdAt`: TEXT - 创建时间
- `updatedAt`: TEXT - 更新时间
- ...（其他字段）

**外键关系**：
- `FOREIGN KEY (customerId) REFERENCES customers(id)`

**索引**：
- `CREATE INDEX idx_metaadguidance_accounts_customerId ON metaadguidance_accounts(customerId)`

**示例数据**：
```json
{
  "id": 1,
  "adAccountId": "803992072248290",
  "accountInfo": "账户基本信息",
  "accountScore": 85,
  "guidanceCount": 12,
  "customerId": 1
}
```

#### 4.2.5 Recommendation (广告指导建议)

**描述**：Meta 提供的广告指导建议，关联到广告账户。

**属性**：
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - 自增主键
- `adAccountId`: TEXT NOT NULL - 广告账户ID (外键)
- `guidanceType`: TEXT - 指导类型
- `guidanceContent`: TEXT - 指导内容
- `accountImprovementScore`: INTEGER - 账户提升分数
- `guidanceUpdateTime`: TEXT - 指导更新时间
- `createdAt`: TEXT - 创建时间
- ...（其他字段）

**外键关系**：
- `FOREIGN KEY (adAccountId) REFERENCES metaadguidance_accounts(adAccountId) ON DELETE CASCADE`

**索引**：
- `CREATE INDEX idx_metaadguidance_recommendations_adAccountId ON metaadguidance_recommendations(adAccountId)`

**示例数据**：
```json
{
  "id": 1,
  "adAccountId": "803992072248290",
  "guidanceType": "MID_FLIGHT_RECOMMENDATION",
  "guidanceContent": "DELIVERY_ERROR",
  "accountImprovementScore": 20
}
```

#### 4.2.6 Metric (广告指标数据)

**描述**：广告指标回传数据，记录指导的采纳和执行情况，关联到广告账户。

**属性**：
- `id`: INTEGER PRIMARY KEY AUTOINCREMENT - 自增主键
- `adAccountId`: TEXT NOT NULL - 广告账户ID (外键)
- `guidanceType`: TEXT - 指导类型
- `guidanceContent`: TEXT - 指导内容
- `hasGuidance`: INTEGER - 是否存在指导 (0/1)
- `userReviewed`: INTEGER - 用户是否查阅 (0/1)
- `userAdopted`: INTEGER - 用户是否采纳 (0/1)
- `callbackUpdateTime`: TEXT - 回传更新时间
- `createdAt`: TEXT - 创建时间
- ...（其他字段）

**外键关系**：
- `FOREIGN KEY (adAccountId) REFERENCES metaadguidance_accounts(adAccountId) ON DELETE CASCADE`

**索引**：
- `CREATE INDEX idx_metaadguidance_metrics_adAccountId ON metaadguidance_metrics(adAccountId)`

**示例数据**：
```json
{
  "id": 1,
  "adAccountId": "803992072248290",
  "guidanceType": "Unknown",
  "guidanceContent": "FRAGMENTATION",
  "hasGuidance": true,
  "userAdopted": false
}
```

### 4.3 数据查询场景

#### 场景 1：查询账户列表及关联信息

**需求**：获取所有账户，并显示客户信息、结算主体、人员信息。

**查询逻辑**：
```typescript
// 1. 获取所有账户
const accounts = await getAllData('metaadguidance.accounts');

// 2. 获取关联数据
const customers = await getAllData('customers');
const personnel = await getAllData('personnel');
const settlements = await getAllData('settlement_entities');

// 3. 组装数据（模拟JOIN）
const result = accounts.map(account => {
  const customer = customers.find(c => c.id === account.customerId);
  const settlement = customer 
    ? settlements.find(s => s.id === customer.settlementEntityId) 
    : undefined;
  const contractSales = customer 
    ? personnel.find(p => p.customerId === customer.id && p.role === 'CONTRACT_SALES') 
    : undefined;
  const responsibleSales = customer 
    ? personnel.find(p => p.customerId === customer.id && p.role === 'RESPONSIBLE_SALES') 
    : undefined;

  return {
    ...account,
    customer: {
      ...customer,
      settlementEntity: settlement,
      contractSales: contractSales?.email,
      responsibleSales: responsibleSales?.email,
    },
  };
});
```

#### 场景 2：查询账户的指导建议

**需求**：查看某个广告账户的所有指导建议。

**查询逻辑**：
```typescript
const recommendations = await findData(
  'metaadguidance.recommendations',
  (item) => item.adAccountId === '803992072248290'
);
```

#### 场景 3：查询账户的指标数据

**需求**：查看某个广告账户的所有指标回传数据。

**查询逻辑**：
```typescript
const metrics = await findData(
  'metaadguidance.metrics',
  (item) => item.adAccountId === '803992072248290'
);
```

### 4.4 数据一致性保证

1. **外键约束**：确保数据完整性，防止孤儿数据
2. **级联删除**：删除父记录时，自动删除或更新子记录
3. **唯一索引**：防止重复数据（如 `adAccountId`, `customerId`, `entityId`）
4. **默认值**：关键字段设置默认值（如 `createdAt`, `updatedAt`）
5. **字段索引**：为所有外键创建索引，提升查询性能

### 4.5 数据模型版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-01-10 | 初始版本，包含基本账户结构 |
| v2.0 | 2025-01-15 | 新增实体关系，添加 SettlementEntity、Customer、Personnel 表，建立外键关联 |

---

## 5. 交互流程 (Interaction Flow)

### 4.1 主流程：查看广告账户指导列表

```
1. 用户进入"FB广告指导"页面
   ↓
2. 系统自动加载广告账户列表（默认显示第一页）
   ↓
3. 用户可选择筛选条件（合并主体、结算主体、广告账户ID）
   ↓
4. 点击"查询"按钮
   ↓
5. 系统根据筛选条件加载数据
   ↓
6. 表格展示筛选后的结果
   ↓
7. 用户可点击"广告指导"查看建议回传详情
   ↓
8. 用户可点击"广告指标"查看指标回传数据详情
```

### 4.2 主流程：手动上传Excel回传数据

```
1. 用户在列表页面点击"上传Excel"按钮
   ↓
2. 系统弹出文件选择对话框
   ↓
3. 用户选择 Excel 文件
   ↓
4. 系统校验文件格式和大小
   ↓
5. 文件校验通过，显示上传进度
   ↓
6. 系统解析 Excel 文件内容
   ↓
7. 系统校验数据格式
   ↓
8. 数据格式校验通过，调用 Meta API#3 回传数据
   ↓
9. 回传成功，显示成功提示
   ↓
10. 刷新列表数据
```

### 4.3 异常流程：文件上传失败

```
1. 用户选择文件
   ↓
2. 系统校验文件格式
   ↓
3. 文件格式错误
   ↓
4. 显示错误提示："请上传 Excel 文件（.xlsx 或 .xls）"
   ↓
5. 用户重新选择文件
```

### 4.4 异常流程：数据回传失败

```
1. 文件上传成功
   ↓
2. 系统解析数据
   ↓
3. 调用 Meta API#3 回传
   ↓
4. API 返回错误
   ↓
5. 显示错误提示："回传失败：{错误信息}"
   ↓
6. 用户检查数据格式后重试
```

## 5. UI 原型 (UI Prototype)

### 5.1 列表页面结构

**页面标题**: FB广告指导

**顶部仪表盘区域**（新增）:
- 总账户数卡片
- 平均账户评分卡片
- 总指导建议数卡片
- 近期活跃账户数卡片

**顶部筛选区域**:
- 合并主体（下拉选择，支持搜索）
- 结算主体（下拉选择，支持搜索）
- 广告账户ID（下拉选择，支持搜索）
- 重置按钮
- 查询按钮
- 样式要求：使用卡片容器，增加阴影和圆角

**操作按钮区域**:
- 新增客户按钮（蓝色主按钮，带图标和悬停效果）
- 上传Excel按钮（白色次按钮，带图标和悬停效果）
- 刷新按钮（带旋转动画）

**表格列定义**:
- 样式要求：表头加粗，行高适中，鼠标悬停高亮，支持条纹样式
- 广告账户ID
- 合并主体（带标签显示，如 BV、MH、BMP）
- 账户信息
- 人员信息（签约销售、负责销售，显示邮箱或内部ID）
- 账户属性（如：EC | 后台消耗结算、APP | 后台消耗结算）
- 账户评分（数字）
- 广告指导数量（数字）
- 指导更新时间（日期时间）
- 操作（广告指导、广告指标、删除）

**分页控件**:
- 每页条数：10/20/50/100
- 页码跳转
- 总数显示

### 5.2 广告账户建议回传详情页面结构

**页面标题**: 广告账户建议回传详情

**返回按钮**: < 返回列表

**表格列定义**:
- 链接（查看）
- 指导类型（如：MID_FLIGHT_RECOMMENDATION）
- 指导内容（如：DELIVERY_ERROR）
- 账户提升分数（数字）
- 指标类型（数字）
- 可提升数值（长数字ID）
- 广告对象ID（如：CAMPAIGN_GROUP）
- 广告级别（数字）
- 指标分数（数字）
- 指标基准值（数字）
- 指导更新时间（日期时间）
- 用户行为（如：PITCH）

### 5.3 广告指标回传数据详情页面结构

**页面标题**: 广告指标回传数据详情

**返回按钮**: < 返回列表

**表格列定义**:
- 指导类型（如：Unknown）
- 指导内容（如：FRAGMENTATION、REELS_PC_RECOMMENDATION、CREATIVE_LIMITED）
- 是否存在指导（是/否）
- 用户是否查阅（是/否）
- 是否推送（是/否）
- 用户是否点击（是/否）
- 用户是否采纳（是/否）
- 触达后用户是否采纳（是/否）
- 采纳后广告对象收入（数字）
- 采纳类型（文本）
- 采纳时间（日期时间）
- 上次触达时间（日期时间）
- 用户上次采纳时间（日期时间）
- 用户上次执行时间（日期时间）
- 回传更新时间（日期时间）

### 5.4 上传Excel弹框

**弹框标题**: 上传Excel回传数据

**内容**:
- 文件选择器（支持 .xlsx, .xls）
- 文件大小提示（最大 10MB）
- 上传进度条
- 上传结果提示

**按钮**:
- 取消
- 确定（上传中禁用）

## 6. 数据定义 (Data Definition)

### 6.1 API 接口定义

#### 6.1.1 获取广告账户指导列表

**接口路径**: `GET /api/meta-ad-guidance/list`

**请求参数**:
```typescript
interface AdGuidanceListParams {
  pageNum: number;           // 页码，从1开始
  pageSize: number;          // 每页条数
  consolidatedEntity?: string; // 合并主体
  settlementEntity?: string;  // 结算主体
  adAccountId?: string;      // 广告账户ID
  accountType?: AccountType; // 账户类型
  accountStatus?: AccountStatus; // 账户状态
  accountId?: string;        // 账户ID
  campaignId?: string;       // 广告系列ID
}
```

**响应数据**:
```typescript
interface AdGuidanceListResponse {
  code: number;
  message: string;
  data: {
    list: AdAccountGuidance[];
    total: number;
  };
}
```

#### 6.1.2 获取广告账户建议回传详情

**接口路径**: `GET /api/meta-ad-guidance/recommendation-detail`

**请求参数**:
```typescript
interface RecommendationDetailParams {
  adAccountId: string; // 广告账户ID
}
```

**响应数据**:
```typescript
interface RecommendationDetailResponse {
  code: number;
  message: string;
  data: RecommendationDetail[];
}
```

#### 6.1.3 获取广告指标回传数据详情

**接口路径**: `GET /api/meta-ad-guidance/metric-detail`

**请求参数**:
```typescript
interface MetricDetailParams {
  adAccountId: string; // 广告账户ID
}
```

**响应数据**:
```typescript
interface MetricDetailResponse {
  code: number;
  message: string;
  data: MetricDetail[];
}
```

#### 6.1.4 上传Excel回传数据

**接口路径**: `POST /api/meta-ad-guidance/upload-excel`

**请求参数**:
- FormData，包含 file 字段（Excel文件）

**响应数据**:
```typescript
interface UploadExcelResponse {
  code: number;
  message: string;
  data?: {
    successCount: number;  // 成功回传数量
    failCount: number;     // 失败数量
    errors?: string[];     // 错误详情
  };
}
```

#### 6.1.5 新增客户

**接口路径**: `POST /api/meta-ad-guidance/add-account`

**请求参数**:
```typescript
interface AddAccountParams {
  adAccountId: string;        // 广告账户ID
  consolidatedEntity: string; // 合并主体
  settlementEntity: string;   // 结算主体
  accountInfo?: string;       // 账户信息
  accountType?: AccountType;  // 账户类型
  accountStatus?: AccountStatus; // 账户状态
  accountHierarchy?: AccountHierarchy; // 账户层级
  personnelInfo?: {           // 人员信息
    contractSales?: string;   // 签约销售
    responsibleSales?: string; // 负责销售
  };
  accountId?: string;         // 账户ID
  campaignId?: string;        // 广告系列ID
  adId?: string;              // 广告ID
  creativeId?: string;        // 创意ID
  bid?: number;               // 出价
  budget?: number;            // 预算
  targeting?: string;         // 定向
  optimization?: string;      // 优化
}
```

**响应数据**:
```typescript
interface AddAccountResponse {
  code: number;
  message: string;
  data?: {
    adAccountId: string;
  };
}
```

### 6.2 数据模型 TypeScript 定义

```typescript
// 账户类型枚举
enum AccountType {
  MANUAL_ONBOARDING = 'MANUAL_ONBOARDING',           // 手动开户
  FACE_TO_FACE = 'FACE_TO_FACE',                     // 面对面
  EMAIL_PHONE_VIDEO_CALL = 'EMAIL_PHONE_VIDEO_CALL', // 邮件/电话/视频通话
  IMPRESSION = 'IMPRESSION',                         // 展示
  CLICK = 'CLICK',                                   // 点击
  AD_ACCOUNT = 'AD_ACCOUNT',                         // 广告账户
  CAMPAIGN = 'CAMPAIGN',                             // 广告系列
  AD_GROUP = 'AD_GROUP',                             // 广告组
  PRODUCT_LAUNCHING = 'PRODUCT_LAUNCHING',           // 产品发布
  RESELLER = 'RESELLER',                             // 经销商
}

// 账户状态枚举
enum AccountStatus {
  MANUAL_ONBOARDING = 'MANUAL_ONBOARDING',     // 手动开户
  MANUAL_BULK = 'MANUAL_BULK',                 // 手动批量
  AUTOMATED_ONBOARDING = 'AUTOMATED_ONBOARDING', // 自动开户
  AUTOMATED_BULK = 'AUTOMATED_BULK',           // 自动批量
}

// 账户事件类型枚举
enum AccountEventType {
  IMPRESSION = 'IMPRESSION',       // 展示
  CLICK = 'CLICK',                 // 点击
  MANUAL_ADOPT = 'MANUAL_ADOPT',   // 手动采纳
}

// 账户推荐类型枚举
enum RecommendationType {
  NO_FLIGHT_RECOMMENDATION = 'NO_FLIGHT_RECOMMENDATION',     // 无投放推荐
  ON_AD_GROUP_RECOMMENDATION = 'ON_AD_GROUP_RECOMMENDATION', // 广告组推荐
  MID_FLIGHT_RECOMMENDATION = 'MID_FLIGHT_RECOMMENDATION',   // 投放中推荐
}

// 账户层级枚举
enum AccountHierarchy {
  AD_ACCOUNT = 'AD_ACCOUNT',       // 广告账户层级
  CAMPAIGN = 'CAMPAIGN',           // 广告系列层级
  AD_GROUP = 'AD_GROUP',           // 广告组层级
}

// 广告账户指导
interface AdAccountGuidance {
  adAccountId: string;              // 广告账户ID
  accountId?: string;                // 账户ID（Account ID）
  campaignId?: string;               // 广告系列ID（Campaign ID）
  adId?: string;                     // 广告ID（Ad ID）
  creativeId?: string;               // 创意ID（Creative ID）
  userId?: string;                   // 用户ID（User ID）
  eventId?: string;                  // 事件ID（Event ID）
  consolidatedEntity: string;       // 合并主体
  settlementEntity: string;         // 结算主体
  accountInfo: string;              // 账户信息
  accountType?: AccountType;         // 账户类型
  accountStatus?: AccountStatus;     // 账户状态
  accountHierarchy?: AccountHierarchy; // 账户层级
  personnelInfo: {                  // 人员信息
    contractSales: string;          // 签约销售（邮箱或内部ID）
    responsibleSales: string;       // 负责销售（邮箱或内部ID）
    tags?: string[];                // 标签（如 BV、MH、BMP）
  };
  accountAttributes: string;       // 账户属性（如：EC | 后台消耗结算）
  accountScore: number;             // 账户评分
  guidanceCount: number;             // 广告指导数量
  lastUpdateTime: string;           // 指导更新时间
  bid?: number;                      // 出价（Bid）
  budget?: number;                   // 预算（Budget）
  targeting?: string;                // 定向（Targeting）
  optimization?: string;             // 优化（Optimization）
  conversion?: string;               // 转化（Conversion）
  attribution?: string;              // 归因（Attribution）
}

// 建议回传详情
interface RecommendationDetail {
  link: string;                     // 链接
  guidanceType: string;             // 指导类型（如：MID_FLIGHT_RECOMMENDATION）
  guidanceContent: string;           // 指导内容（如：DELIVERY_ERROR）
  accountImprovementScore: number;  // 账户提升分数
  metricType: number;               // 指标类型
  improveableValue: string;          // 可提升数值（长数字ID）
  adObjectId: string;                // 广告对象ID（如：CAMPAIGN_GROUP）
  adLevel: number;                  // 广告级别
  metricScore: number;               // 指标分数
  metricBenchmark: number;           // 指标基准值
  guidanceUpdateTime: string;        // 指导更新时间
  userBehavior: string;              // 用户行为（如：PITCH）
  accountId?: string;                // 账户ID
  campaignId?: string;               // 广告系列ID
  adId?: string;                     // 广告ID
  creativeId?: string;               // 创意ID
  eventId?: string;                  // 事件ID
  payload?: string;                  // Payload数据
}

// 指标回传数据详情
interface MetricDetail {
  guidanceType: string;             // 指导类型（如：Unknown）
  guidanceContent: string;          // 指导内容（如：FRAGMENTATION）
  hasGuidance: boolean;              // 是否存在指导
  userReviewed: boolean;            // 用户是否查阅
  isPushed: boolean;                 // 是否推送
  userClicked: boolean;              // 用户是否点击
  userAdopted: boolean;               // 用户是否采纳
  adoptedAfterReach: boolean;         // 触达后用户是否采纳
  revenueAfterAdoption: number;      // 采纳后广告对象收入
  adoptionType?: string;             // 采纳类型
  adoptionTime?: string;             // 采纳时间
  lastReachTime?: string;            // 上次触达时间
  userLastAdoptionTime?: string;     // 用户上次采纳时间
  userLastExecutionTime?: string;    // 用户上次执行时间
  callbackUpdateTime: string;        // 回传更新时间
  accountId?: string;                // 账户ID
  campaignId?: string;               // 广告系列ID
  adId?: string;                     // 广告ID
  creativeId?: string;               // 创意ID
  eventId?: string;                  // 事件ID
  userId?: string;                   // 用户ID
  payload?: string;                  // Payload数据
  eventType?: AccountEventType;      // 事件类型
}
```

## 7. 业务规则 (Business Rules)

### 7.1 数据同步规则

1. **自动添加账户**：系统每天自动将近一天状态为 Active 的广告账户添加到广告池
2. **数据同步频率**：每 5 分钟同步一次 Meta API 数据
3. **数据回传时机**：客户查看、点击指导建议后，立即回传 Meta

### 7.2 文件上传规则

1. **文件格式**：仅支持 .xlsx 和 .xls 格式
2. **文件大小**：最大 10MB
3. **数据校验**：上传前校验文件格式，解析后校验数据格式
4. **回传规则**：数据校验通过后，自动调用 Meta API#3 回传

### 7.3 权限规则

1. **查看权限**：所有账户运营人员可查看列表和详情
2. **操作权限**：账户运营人员可新增客户、上传Excel、删除账户

## 8. 非功能需求 (Non-Functional Requirements)

### 8.1 性能要求

- 列表加载时间 < 2 秒
- 详情加载时间 < 1 秒
- 文件上传进度实时更新
- 支持分页，每页最多 100 条

### 8.2 兼容性要求

- 支持 Chrome 90+、Safari 14+、Firefox 88+
- 响应式设计，支持 1920x1080 及以上分辨率

### 8.3 可用性要求

- 所有操作有明确的 Loading 状态
- 所有操作有成功/失败反馈
- 错误提示清晰具体

## 9. 验收标准 (Acceptance Criteria)

### 9.1 功能验收

- [ ] 列表页面正确展示所有广告账户信息
- [ ] 筛选功能正常工作（合并主体、结算主体、广告账户ID）
- [ ] 分页功能正常工作
- [ ] 点击"广告指导"可查看建议回传详情
- [ ] 点击"广告指标"可查看指标回传数据详情
- [ ] 上传Excel功能正常工作，支持格式校验和进度显示
- [ ] 新增客户功能正常工作
- [ ] 删除功能正常工作（需二次确认）

### 9.2 UI 验收

- [ ] 页面布局与设计稿一致
- [ ] 表格列宽度自适应
- [ ] 标签颜色正确显示（BV-蓝色、MH-红色、BMP-蓝色等）
- [ ] 时间格式正确显示（YYYY-MM-DD HH:mm:ss）
- [ ] 按钮样式符合 Ant Design v4 规范

### 9.3 性能验收

- [ ] 列表加载时间 < 2 秒
- [ ] 详情加载时间 < 1 秒
- [ ] 文件上传进度实时更新
- [ ] 分页切换流畅

### 9.4 异常验收

- [ ] 网络错误时显示友好提示
- [ ] 文件格式错误时显示具体错误信息
- [ ] 数据为空时显示"暂无数据"
- [ ] 删除操作需二次确认

### 9.5 安全验收

- [ ] 文件上传前校验文件格式和大小
- [ ] 文件上传后校验数据格式
- [ ] 敏感操作（删除）需二次确认

## 10. 变更记录 (Change Log)

| 版本 | 日期 | 类型 | 变更内容 | 变更人 | 状态 |
|-----|------|------|---------|--------|------|
| v1.0 | 2025-01-15 | 新增 | 初始版本 | 产品团队 | 待评审 |
| v1.1 | 2025-01-15 | 优化 | 完善数据模型，增加账户类型、状态、事件、推荐类型等枚举；增加账户ID、广告系列ID、广告ID、创意ID、事件ID、用户ID等字段；增加出价、预算、定向、优化、转化、归因等字段 | 产品团队 | 待评审 |
| v1.2 | 2025-11-20 | 优化 | UI/UX 升级，增加仪表盘、动画特效及界面美化 | 产品团队 | 待评审 |
| v1.4 | 2025-01-15 | 修复 | 修复数据加载问题，改为直连本地数据库(移除Mock依赖) | AI Assistant | 已发布 |
| v1.3 | 2025-12-01 | 优化 | 融合VL广告指导建议功能，将"指导建议"功能从跳转页面改为Modal弹框展示，支持查看优化建议列表、分类统计、采纳/忽略操作 | AI Assistant | 已实现 |

## 11. 附录 (Appendix)

### 11.1 相关文档

<!-- - **用户手册**：`docs/user-manual/user_manual_{功能名称}.md` - 暂时禁用 -->
- **前端代码**：
  - 列表页：`src/pages/metaadguidance/list/index.tsx`
  - 优化建议Modal：`src/pages/metaadguidance/components/RecommendationsModal.tsx`
- **API 服务**：
  - `src/services/metaadguidance.ts`（Meta广告指导API，直连本地DB）
  - `src/services/adguidance.ts`（VL广告指导建议API，直连本地DB）
- **类型定义**：`src/types/adguidance.ts`, `src/types/metaadguidance.ts`
- **数据库**：`src/db/index.ts` (本地 SQLite)
- **API 文档**：Meta API 文档（内部）
- **测试用例**：{链接}

### 11.2 术语表

| 术语 | 英文 | 说明 |
|-----|------|------|
| 广告账户 | Ad Account | Meta 广告平台的账户实体 |
| 合并主体 | Consolidated Entity | 合并后的账户主体 |
| 结算主体 | Settlement Entity | 用于结算的账户主体 |
| 广告指导 | Ad Guidance | Meta 提供的广告优化建议 |
| 回传 | Callback | 将用户行为数据回传给 Meta |

### 11.3 参考资料

- Meta API 文档：{链接}
- 竞品分析：{链接}
- 用户调研报告：{链接}

---

**最后更新**：2025-01-15  
**版本**：v1.0

