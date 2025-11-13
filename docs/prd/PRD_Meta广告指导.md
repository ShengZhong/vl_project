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

根据 Meta 媒体要求，需要拉取 Meta 生成的广告指导建议，并通过系统自动、人工推送、人工沟通等方式，Push 客户采纳广告指导建议，进而提升广告质量。

当前缺少统一的平台来管理和展示 Meta 广告指导建议，无法有效追踪客户对建议的采纳情况，影响广告质量提升效果。

### 1.2 目标用户

- **主要用户**：账户运营人员
- **次要用户**：客户服务人员、数据分析人员

### 1.3 核心目标

1. **自动化管理**：自动将近一天状态为 Active 的广告账户添加到广告池，减少人工操作 80%
2. **数据同步**：通过 Meta API 实时同步广告指导建议数据，数据同步延迟 < 5 分钟
3. **客户触达**：通过 VisionLine 平台展示指导建议，客户查看率提升至 60% 以上
4. **数据回传**：支持客户查看、点击后自动回传 Meta，回传成功率 > 95%
5. **人工记录**：支持手动上传 Excel 记录人工沟通数据，回传效率提升 50%

## 2. 用户故事 (User Stories)

### Story 1: 查看广告账户指导列表

- **作为** 账户运营人员
- **我想要** 查看所有广告账户的指导建议列表
- **以便于** 了解账户状态和指导建议情况
- **优先级**: 🔴 P0

**验收条件**：
- 列表展示所有关键信息（广告账户ID、合并主体、结算主体、账户信息、人员信息、账户属性、账户评分、广告指导数量、指导更新时间）
- 支持按合并主体、结算主体、广告账户ID筛选
- 支持分页展示，每页 10/20/50/100 条可选
- 加载时间 < 2 秒

### Story 2: 查看广告账户建议回传详情

- **作为** 账户运营人员
- **我想要** 查看某个广告账户的详细建议回传信息
- **以便于** 了解具体的指导建议内容和客户采纳情况
- **优先级**: 🔴 P0

**验收条件**：
- 展示指导类型、指导内容、账户提升分数、指标类型、可提升数值、广告对象ID、广告级别、指标分数、指标基准值、指导更新时间、用户行为等详细信息
- 支持返回列表
- 数据加载时间 < 1 秒

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

### 3.2 功能点 2: 广告账户建议回传详情

- **功能描述**: 展示某个广告账户的详细建议回传信息
- **输入**: 
  - 广告账户ID（必填）
- **处理**:
  - 调用后端接口获取详情数据
  - 格式化显示时间、数值等
- **输出**:
  - 详情表格展示
  - 返回列表按钮
- **异常处理**:
  - 账户ID不存在：提示"账户不存在"
  - 数据加载失败：提示"加载失败，请重试"

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

## 4. 交互流程 (Interaction Flow)

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

**顶部筛选区域**:
- 合并主体（下拉选择，支持搜索）
- 结算主体（下拉选择，支持搜索）
- 广告账户ID（下拉选择，支持搜索）
- 重置按钮
- 查询按钮

**操作按钮区域**:
- 新增客户按钮（蓝色主按钮）
- 上传Excel按钮（新增功能）

**表格列定义**:
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

## 11. 附录 (Appendix)

### 11.1 相关文档

<!-- - **用户手册**：`docs/user-manual/user_manual_{功能名称}.md` - 暂时禁用 -->
- **前端代码**：`src/pages/metaadguidance/list/index.tsx`
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

