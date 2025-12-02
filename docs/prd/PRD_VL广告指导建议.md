# PRD: VL广告指导建议

## 文档信息

| 项目 | 内容 |
|------|------|
| **功能点 ID** | VL-ADGD-001 |
| **产品模块** | VisionLine对客功能 / 广告指导建议 |
| **创建日期** | 2025-12-01 |
| **创建人** | AI Assistant |
| **当前版本** | v1.0 |
| **最后更新** | 2025-12-01 |
| **文档状态** | 草稿 |

---

## 1. 背景与目标 (Background & Objectives)

### 1.1 业务背景

在出海广告营销业务中,优化师需要管理大量广告账户,每个账户的广告效果需要持续监控和优化。当前存在以下问题:

1. **缺乏统一的优化建议视图**:优化师需要在多个平台之间切换查看账户状态和优化建议
2. **无法快速识别关键问题账户**:缺少机会分数评估机制,无法快速定位需要重点关注的账户
3. **优化建议分散**:不同类型的优化建议(预算、创意、受众等)没有统一的分类和管理
4. **缺少采纳跟踪**:无法追踪客户对优化建议的采纳情况和效果反馈

为了提升优化师的工作效率,提高广告投放效果,需要提供一个统一的广告指导建议平台。

### 1.2 目标用户

| 用户类型 | 说明 |
|---------|------|
| **主要用户** | 优化师(负责广告账户优化和管理的专业人员)|
| **次要用户** | 客户(广告主,查看账户优化建议)|
| **间接用户** | 管理员(管理平台配置和权限)|

### 1.3 核心目标

1. **提升优化效率 60%**:通过集中展示优化建议,优化师查看账户优化建议的时间从平均 15 分钟降至 6 分钟
2. **提高建议采纳率 40%**:通过机会分数和优先级排序,重点建议的采纳率从 50% 提升至 70%
3. **支持多平台管理**:支持 Meta、Google Ads 等主流广告平台,集中管理 500+ 广告账户
4. **实现闭环管理**:追踪优化建议的生命周期,从生成、展示、采纳到效果验证的完整闭环

---

## 2. 用户故事 (User Stories)

### Story 1: 查看账户优化建议概览

| 项目 | 内容 |
|------|------|
| **作为** | 优化师 |
| **我想要** | 在概览页面快速查看所有平台的账户统计和重点优化案例 |
| **以便于** | 快速了解整体优化情况,识别需要重点关注的账户 |
| **优先级** | 🔴 P0 |

**验收条件**:
- [ ] 概览页展示所有平台的账户统计(账户数、优化建议数、总余额)
- [ ] 展示机会分数评估:优秀账户数、待改进账户数、需关注账户数
- [ ] 展示优化案例卡片:转化率提升、ROAS提升等关键指标
- [ ] 提供快速跳转到各平台详情的入口

### Story 2: 查看分类优化建议

| 项目 | 内容 |
|------|------|
| **作为** | 优化师 |
| **我想要** | 按预算、创意、受众、自动化等分类查看优化建议 |
| **以便于** | 针对性地处理不同类型的优化任务 |
| **优先级** | 🔴 P0 |

**验收条件**:
- [ ] 优化建议页面展示分类统计(预算、创意、受众、自动化)
- [ ] 每个分类显示建议数量、影响的账户数、分数提升、影响广告数
- [ ] 支持点击分类查看该分类下的所有建议列表
- [ ] 支持筛选和搜索功能

### Story 3: 处理具体优化建议

| 项目 | 内容 |
|------|------|
| **作为** | 优化师 |
| **我想要** | 查看具体建议详情并标记采纳状态 |
| **以便于** | 跟踪优化建议的执行情况和效果 |
| **优先级** | 🔴 P0 |

**验收条件**:
- [ ] 点击建议可查看详细内容(建议描述、影响广告数、预期效果)
- [ ] 支持标记建议状态:待采纳/已采纳/已忽略
- [ ] 已采纳的建议显示采纳时间和效果反馈
- [ ] 支持批量操作建议

### Story 4: 管理广告账户

| 项目 | 内容 |
|------|------|
| **作为** | 优化师 |
| **我想要** | 查看和管理不同平台的广告账户信息 |
| **以便于** | 集中管理所有广告账户,监控账户健康度 |
| **优先级** | 🟡 P1 |

**验收条件**:
- [ ] 账户管理页展示所有平台的账户列表
- [ ] 显示账户ID、机会分数、优化建议数、余额、到期时间等关键信息
- [ ] 支持添加新账户(手动添加/Excel批量导入)
- [ ] 支持查看账户详情和优化建议明细
- [ ] 提供充值账户、查看账单等快捷操作

---

## 3. 功能需求 (Functional Requirements)

### 3.1 功能点 1: 广告指导建议概览

| 维度 | 内容 |
|------|------|
| **功能描述** | 展示所有广告平台的账户统计、机会分数分布、优化案例展示 |
| **输入** | 无需输入,系统自动聚合所有平台数据 |
| **处理** | 1. 统计各平台账户数、优化建议数、总余额<br>2. 计算机会分数分布(优秀/待改进/需关注)<br>3. 展示典型优化案例(转化率提升、ROAS提升等)|
| **输出** | 概览仪表盘,包含统计卡片、案例卡片、平台详情卡片 |
| **异常处理** | 1. 数据加载失败:显示"暂无数据"占位符<br>2. 部分平台数据缺失:显示可用平台数据,标记不可用平台|

#### 3.1.1 页面布局

**顶部横幅区域**:
- 展示重点优化案例(轮播卡片形式)
- 案例信息:客户名称、行业、优化类型、关键指标提升

**平台统计区域**:
- 每个广告平台一个卡片
- 卡片信息:平台logo、账户数量、优化建议数、总余额
- 卡片内包含快速入口:查看账户、创建账户、查看账单等

**机会分数分布**:
- 三个统计卡片:优秀(≥80分)、待改进(40-79分)、需关注(<40分)
- 点击卡片可筛选对应分数段的账户

### 3.2 功能点 2: 优化建议列表与分类

| 维度 | 内容 |
|------|------|
| **功能描述** | 展示所有广告账户的优化建议,支持分类查看和筛选 |
| **输入** | 1. 筛选条件:平台、分类、机会分数范围<br>2. 搜索关键词:账户ID/账户名称|
| **处理** | 1. 按分类聚合建议(预算、创意、受众、自动化)<br>2. 计算各分类的影响统计<br>3. 支持展开查看分类下的建议列表|
| **输出** | 分类统计卡片 + 建议列表 |
| **异常处理** | 1. 无符合条件的建议:显示空状态占位符<br>2. 账户ID不存在:提示"未找到相关账户"|

#### 3.2.1 分类定义

| 分类代码 | 分类名称 | 颜色标识 | 说明 |
|---------|---------|---------|------|
| BUDGET | 预算 | 绿色 | 预算相关优化建议(日预算调整、出价优化等)|
| CREATIVE | 创意 | 紫色 | 创意相关优化建议(素材更新、文案优化等)|
| AUDIENCE | 受众 | 蓝色 | 受众相关优化建议(定向调整、受众扩展等)|
| AUTO | 自动化 | 黄色 | 自动化相关优化建议(启用自动出价、自动规则等)|

#### 3.2.2 建议列表字段

| 字段 | 说明 | 排序支持 |
|-----|------|---------|
| 建议标题 | 建议的简短描述 | ❌ |
| 账户ID | 广告账户ID(脱敏显示,部分隐藏)| ✅ |
| 分类 | 预算/创意/受众/自动化,带颜色标签 | ✅ |
| 影响广告数 | 该建议影响的广告数量 | ✅ |
| 分数提升 | 采纳建议后预期的机会分数提升 | ✅ |
| 机会分数 | 当前账户的机会分数(0-100分,带环形图)| ✅ |
| 状态 | 待采纳/已采纳/已忽略 | ✅ |
| 更新日期 | 建议最后更新时间 | ✅ |
| 操作 | 查看详情、采纳、忽略按钮 | ❌ |

### 3.3 功能点 3: 建议详情与操作

| 维度 | 内容 |
|------|------|
| **功能描述** | 展示优化建议的详细内容,支持采纳、忽略等操作 |
| **输入** | 点击建议行或"查看详情"按钮 |
| **处理** | 1. 展开详情区域(或打开Modal)<br>2. 显示建议详细描述、优化前后对比、具体操作步骤|
| **输出** | 建议详情面板,包含操作按钮 |
| **异常处理** | 1. 建议已被删除:提示"该建议已失效"<br>2. 权限不足:禁用操作按钮|

#### 3.3.1 详情内容

**建议概要**:
- 建议ID、创建时间、分类标签
- 当前状态:待采纳/已采纳/已忽略

**优化建议描述**:
- 问题诊断:当前账户存在的问题
- 优化方案:具体的优化建议内容
- 预期效果:采纳后的预期改善(CPA降低X%、转化率提升Y%)

**影响分析**:
- 影响的广告数量
- 影响的广告ID列表(可展开查看)
- 分数提升预估

**操作建议步骤**(可选):
1. 步骤1: 登录Meta广告管理平台
2. 步骤2: 进入账户XXX
3. 步骤3: 调整日预算至XXX美元

### 3.4 功能点 4: 账户管理

| 维度 | 内容 |
|------|------|
| **功能描述** | 管理不同平台的广告账户,支持查看、添加、编辑账户信息 |
| **输入** | 1. 添加账户:账户ID、账户名称、客户信息<br>2. 筛选条件:平台、机会分数范围、余额范围|
| **处理** | 1. 展示账户列表(按平台分组)<br>2. 计算账户统计(优化建议数、机会分数)<br>3. 支持添加/编辑/查看账户|
| **输出** | 账户列表(按平台分组) + 账户详情弹框 |
| **异常处理** | 1. 账户ID已存在:提示"该账户已添加"<br>2. 账户ID格式错误:提示"请输入正确的账户ID"|

#### 3.4.1 账户列表字段

| 字段 | 说明 | 排序支持 |
|-----|------|---------|
| 广告主实体 | 客户名称(主实体名称)| ✅ |
| 账户ID | 广告账户ID(脱敏显示)| ✅ |
| 机会分数 | 账户的机会分数(0-100,带环形图)| ✅ |
| 优化建议数 | 未处理的优化建议数量,带分数提升图标 | ✅ |
| 账户余额 | 账户当前余额(美元)| ✅ |
| 到期日期 | 账户到期时间,临近到期显示警告 | ✅ |
| 操作 | 查看详情、查看建议、充值、账单 | ❌ |

#### 3.4.2 添加账户流程

**手动添加**:
1. 点击"添加账户"按钮
2. 选择平台(Meta/Google Ads)
3. 填写账户ID、账户名称
4. 选择关联客户(可搜索)
5. 提交创建

**批量导入**(Excel):
1. 点击"批量导入"按钮
2. 下载Excel模板
3. 填写账户信息(账户ID、账户名称、客户名称)
4. 上传Excel文件
5. 系统校验数据格式
6. 显示导入结果(成功/失败明细)

---

## 4. 交互流程 (User Flow)

### 4.1 主流程:查看优化建议

```
[用户登录] → [进入广告指导建议首页]
    ↓
[查看概览数据]
    ├─ 查看平台统计
    ├─ 查看机会分数分布
    └─ 查看优化案例
    ↓
[点击"优化建议"菜单]
    ↓
[查看分类统计]
    ├─ 预算建议(2条)
    ├─ 创意建议(3条)
    ├─ 受众建议(1条)
    └─ 自动化建议(1条)
    ↓
[点击某个分类] → [展开该分类的建议列表]
    ↓
[点击建议行] → [展开详情]
    ├─ 查看建议描述
    ├─ 查看影响分析
    └─ 查看操作步骤
    ↓
[操作建议]
    ├─ 点击"采纳" → 标记为已采纳 → 更新状态 → 刷新列表
    ├─ 点击"忽略" → 二次确认 → 标记为已忽略 → 刷新列表
    └─ 点击"查看账户" → 跳转到账户管理页
```

### 4.2 主流程:管理广告账户

```
[点击"账户管理"菜单]
    ↓
[查看账户列表(按平台分组)]
    ├─ Meta平台: 2个账户
    └─ Google Ads平台: 0个账户
    ↓
[操作账户]
    ├─ [添加新账户]
    │   ├─ 点击"添加账户"
    │   ├─ 填写账户信息
    │   ├─ 提交
    │   └─ 刷新列表
    │
    ├─ [批量导入账户]
    │   ├─ 点击"批量导入"
    │   ├─ 下载模板
    │   ├─ 填写Excel
    │   ├─ 上传文件
    │   ├─ 查看导入结果
    │   └─ 刷新列表
    │
    └─ [查看账户详情]
        ├─ 点击账户行
        ├─ 展开详情(或打开Modal)
        ├─ 查看基本信息
        ├─ 查看优化建议列表
        └─ 执行操作(充值/查看账单)
```

### 4.3 异常流程

#### 场景1:数据加载失败

| 项目 | 内容 |
|------|------|
| **触发条件** | API 调用失败或超时 |
| **系统行为** | 显示空状态占位符:"加载失败,请刷新重试"<br>提供"刷新"按钮 |
| **用户操作** | 点击"刷新"按钮重新加载数据 |

#### 场景2:采纳建议失败

| 项目 | 内容 |
|------|------|
| **触发条件** | 标记采纳状态时API调用失败 |
| **系统行为** | 显示错误提示:"操作失败,请稍后重试"<br>保持建议状态不变 |
| **用户操作** | 点击"重试"或稍后再试 |

#### 场景3:添加账户失败

| 项目 | 内容 |
|------|------|
| **触发条件** | 账户ID已存在或格式错误 |
| **系统行为** | 在表单字段下显示具体错误提示<br>保持弹框打开,保留已填写数据 |
| **用户操作** | 修改错误字段后重新提交 |

### 4.4 流程图

```
[概览页] ⇄ [优化建议页] ⇄ [账户管理页]
   ↓           ↓              ↓
[平台详情] [建议详情]    [账户详情]
```

---

## 5. UI 原型 (UI Wireframes)

### 5.1 概览页面

| 项目 | 内容 |
|------|------|
| **页面类型** | 仪表盘页面 |
| **布局方式** | 卡片布局 |
| **核心组件** | Card、Statistic、Progress、Button |

**页面结构**:

```
┌──────────────────────────────────────────────────────┐
│ 顶部横幅:优化案例轮播                                │
│ [电商行业领导者] TopReseller 9月同比增速             │
│ "优化迭代广告后效改善果提升了超过订单的预期..."      │
│ 转化分数: 42→87  3倍化增长: +156%  ROAS: 4.2x        │
└──────────────────────────────────────────────────────┘

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Meta平台        │ │ Google Ads      │ │ TikTok          │
│ 账户数: 2       │ │ 账户数: 0       │ │ 账户数: 0       │
│ 优化建议: 20    │ │ 优化建议: 0     │ │ 优化建议: 0     │
│ 总余额: $5,081  │ │ 总余额: $0      │ │ 总余额: $0      │
│ [查看账户详情]  │ │ [添加账户]      │ │ [添加账户]      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 5.2 优化建议页面

| 项目 | 内容 |
|------|------|
| **页面类型** | 列表页 |
| **布局方式** | 分类卡片 + 表格列表 |
| **核心组件** | Card、Table、Tag、Modal、Select |

**页面结构**:

```
┌──────────────────────────────────────────────────────┐
│ 顶部搜索栏                                            │
│ [搜索账户ID或建议...] [全部分类▼] [特采阶▼] [机会分数0~100▼] │
└──────────────────────────────────────────────────────┘

┌─────┬─────────┬────┬────┬────┐
│Meta │建议:1条 │账户│...  │    │
└─────┴─────────┴────┴────┴────┘

┌──────────────────────────────────────────────────────┐
│ 分类统计卡片                                          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│ │预算  │ │创意  │ │受众  │ │自动化│                 │
│ │2账户 │ │2账户 │ │1账户 │ │1账户 │                 │
│ │+33提升│ │+32   │ │+14   │ │+12   │                 │
│ │39广告│ │13广告│ │11广告│ │8广告 │                 │
│ └──────┘ └──────┘ └──────┘ └──────┘                 │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ 建议列表                                              │
│ ┌───────┬──────┬────┬──────┬────┬────┬────┬────┐    │
│ │建议   │账户ID│分类│影响  │分数│机会│状态│操作│    │
│ │       │      │    │广告数│提升│分数│    │    │    │
│ ├───────┼──────┼────┼──────┼────┼────┼────┼────┤    │
│ │高性能 │9876**│预算│15    │+18 │65  │待  │查看│    │
│ │广告系列│****  │    │      │    │ ○  │采纳│采纳│    │
│ ├───────┼──────┼────┼──────┼────┼────┼────┼────┤    │
│ │推广商品│1234**│自动│8     │+12 │28  │待  │查看│    │
│ │品系列 │****  │化  │      │    │ ○  │采纳│采纳│    │
│ └───────┴──────┴────┴──────┴────┴────┴────┴────┘    │
└──────────────────────────────────────────────────────┘
```

### 5.3 账户管理页面

| 项目 | 内容 |
|------|------|
| **页面类型** | 列表页 |
| **布局方式** | 按平台分组的表格列表 |
| **核心组件** | Card、Table、Modal、Upload |

**页面结构**:

```
┌──────────────────────────────────────────────────────┐
│ 标题: 账户管理                         [企业认证]     │
│ 管理媒体平台账户 积分分配和合规审讲                  │
└──────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Meta Ads                                     2账户   │
│                                        20优化建议     │
│                                        总余额$5,081   │
│ [现有账户] [开设新账户] [合规问题]                   │
│                                                       │
│ ┌──────┬──────┬────┬──────┬────┬────┬────┐          │
│ │广告主│账户ID│机会│优化  │账户│应付│操作│          │
│ │实体  │      │分数│建议数│余额│账期│    │          │
│ ├──────┼──────┼────┼──────┼────┼────┼────┤          │
│ │CGE   │1234**│28  │12→去 │$2.8K│$427│管理│          │
│ │Digital│*5678│ ○  │优化  │余额│到期│    │          │
│ │Marketing│   │    │      │    │日期│    │          │
│ ├──────┼──────┼────┼──────┼────┼────┼────┤          │
│ │CGE   │9876**│85  │8→去  │$2.2K│$288│管理│          │
│ │Digital│*4321│ ○  │优化  │余额│到期│    │          │
│ │Studio│     │    │      │    │日期│    │          │
│ └──────┴──────┴────┴──────┴────┴────┴────┘          │
│                                                       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │
│ │优化建议 │ │余额管理 │ │应付账款 │                 │
│ │20个建议 │ │$5,081   │ │11月15日 │                 │
│ │待处理   │ │总余额   │ │到期     │                 │
│ └─────────┘ └─────────┘ └─────────┘                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Google Ads - Search & Display             0账户      │
│                                         87/100优化分 │
│                                         总余额$0      │
└─────────────────────────────────────────────────────┘
```

### 5.4 字段定义

#### 优化建议列表字段

| 字段名称 | 字段类型 | 是否必填 | 校验规则 | 默认值 | 说明 |
|---------|---------|---------|---------|--------|------|
| 建议标题 | Text   | -    | -       | -      | 只读展示 |
| 账户ID | Text   | -    | -       | -      | 脱敏显示(如1234****5678)|
| 分类 | Tag   | -    | 枚举值:预算/创意/受众/自动化 | -      | 带颜色标签 |
| 影响广告数 | Number   | -    | ≥0      | 0      | 只读展示 |
| 分数提升 | Number   | -    | -50~+50 | 0      | 带图标(↑/↓)|
| 机会分数 | Number   | -    | 0-100   | 0      | 环形进度条 |
| 状态 | Select   | ✅ 是    | 枚举值:待采纳/已采纳/已忽略 | 待采纳 | 可修改 |
| 更新日期 | Date   | -    | -       | -      | 只读展示(相对时间)|

#### 账户列表字段

| 字段名称 | 字段类型 | 是否必填 | 校验规则 | 默认值 | 说明 |
|---------|---------|---------|---------|--------|------|
| 广告主实体 | Input   | ✅ 是    | 长度2-100 | -      | 客户名称 |
| 账户ID | Input   | ✅ 是    | 平台特定格式 | -      | Meta: act_[0-9]+<br>Google: [0-9]{10} |
| 账户名称 | Input   | ❌ 否    | 长度0-50 | -      | 选填 |
| 关联客户 | Select   | ✅ 是    | 从客户列表选择 | -      | 可搜索 |
| 机会分数 | Number   | -    | 0-100   | 0      | 系统计算 |

### 5.5 按钮与操作

#### 概览页

| 按钮名称 | 位置 | 样式 | 权限要求 | 操作说明 |
|---------|------|------|---------|---------|
| 查看账户详情 | 平台卡片内 | Link | 查看权限 | 跳转到账户管理页,并筛选该平台 |
| 添加账户 | 平台卡片内 | Link | 创建权限 | 打开添加账户Modal |

#### 优化建议页

| 按钮名称 | 位置 | 样式 | 权限要求 | 操作说明 |
|---------|------|------|---------|---------|
| 查看详情 | 操作列 | Link | 查看权限 | 展开详情区域或打开Modal |
| 采纳 | 操作列 | Link Primary | 编辑权限 | 标记建议为"已采纳",刷新列表 |
| 忽略 | 操作列 | Link | 编辑权限 | 二次确认后标记为"已忽略"|
| 批量采纳 | 表格顶部 | Button | 编辑权限 | 批量标记选中建议为"已采纳"|

#### 账户管理页

| 按钮名称 | 位置 | 样式 | 权限要求 | 操作说明 |
|---------|------|------|---------|---------|
| 企业认证 | 页面右上角 | Button Primary | 管理员 | 打开企业认证流程 |
| 现有账户 | 平台卡片内 | Link | 查看权限 | 已默认展示,无操作 |
| 开设新账户 | 平台卡片内 | Link | 创建权限 | 打开添加账户Modal |
| 批量导入 | 隐藏菜单 | Link | 创建权限 | 打开批量导入Modal |
| 管理 | 操作列 | Button | 编辑权限 | 打开账户详情Modal |
| 查看优化建议 | 账户详情内 | Link | 查看权限 | 跳转到优化建议页,并筛选该账户 |
| 充值账户 | 快捷操作卡片 | Button | 财务权限 | 打开充值流程 |

### 5.6 原型链接

- **本地代码路径(概览页)**:`src/pages/adguidance/overview/index.tsx`
- **本地代码路径(优化建议页)**:`src/pages/adguidance/recommendations/index.tsx`
- **本地代码路径(账户管理页)**:`src/pages/adguidance/accounts/index.tsx`

---

## 6. 数据定义 (Data Schema)

### 6.1 API 接口

#### 6.1.1 获取概览统计

| 项目 | 内容 |
|-----|------|
| **接口路径** | GET /api/adguidance/overview |
| **请求参数** | 无 |
| **响应数据** | `{ code: number, message: string, data: OverviewData }` |
| **错误码** | 200: 成功<br>401: 未授权<br>500: 服务器错误 |

#### 6.1.2 获取优化建议列表

| 项目 | 内容 |
|-----|------|
| **接口路径** | GET /api/adguidance/recommendations |
| **请求参数** | `{ pageNum?: number, pageSize?: number, platform?: string, category?: string, scoreRange?: string, keyword?: string }` |
| **响应数据** | `{ code: number, message: string, data: { list: Recommendation[], total: number } }` |
| **错误码** | 200: 成功<br>400: 参数错误<br>401: 未授权 |

#### 6.1.3 获取建议详情

| 项目 | 内容 |
|-----|------|
| **接口路径** | GET /api/adguidance/recommendations/:id |
| **请求参数** | `id: string` (路径参数)|
| **响应数据** | `{ code: number, message: string, data: Recommendation }` |
| **错误码** | 200: 成功<br>404: 建议不存在<br>401: 未授权 |

#### 6.1.4 更新建议状态

| 项目 | 内容 |
|-----|------|
| **接口路径** | PUT /api/adguidance/recommendations/:id/status |
| **请求参数** | `{ status: 'PENDING' | 'ADOPTED' | 'IGNORED' }` |
| **响应数据** | `{ code: number, message: string, data: Recommendation }` |
| **错误码** | 200: 成功<br>400: 参数错误<br>404: 建议不存在 |

#### 6.1.5 获取账户列表

| 项目 | 内容 |
|-----|------|
| **接口路径** | GET /api/adguidance/accounts |
| **请求参数** | `{ pageNum?: number, pageSize?: number, platform?: string, scoreRange?: string }` |
| **响应数据** | `{ code: number, message: string, data: { list: AdAccount[], total: number } }` |
| **错误码** | 200: 成功<br>400: 参数错误<br>401: 未授权 |

#### 6.1.6 添加账户

| 项目 | 内容 |
|-----|------|
| **接口路径** | POST /api/adguidance/accounts |
| **请求参数** | `{ accountId: string, accountName?: string, platformId: number, customerId: number }` |
| **响应数据** | `{ code: number, message: string, data: AdAccount }` |
| **错误码** | 200: 成功<br>400: 参数错误<br>409: 账户ID已存在 |

#### 6.1.7 批量导入账户

| 项目 | 内容 |
|-----|------|
| **接口路径** | POST /api/adguidance/accounts/import |
| **请求参数** | FormData (file: Excel文件)|
| **响应数据** | `{ code: number, message: string, data: { success: number, failed: number, errors: ImportError[] } }` |
| **错误码** | 200: 成功<br>400: 文件格式错误<br>413: 文件过大 |

### 6.2 数据模型

```typescript
// ==================== 核心实体类型定义 ====================

/**
 * 广告平台
 */
interface AdPlatform {
  id: number;                          // 主键
  platformCode: string;                // 平台代码(META/GOOGLE/TIKTOK)
  platformName: string;                // 平台显示名称
  platformIcon?: string;               // 平台图标URL
  createdAt: string;                   // 创建时间(ISO 8601)
  updatedAt: string;                   // 更新时间(ISO 8601)
}

/**
 * 客户信息
 */
interface Customer {
  id: number;                          // 主键
  customerName: string;                // 客户名称
  industry?: string;                   // 所属行业
  customerLevel?: string;              // 客户等级(VIP/NORMAL)
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
}

/**
 * 广告账户
 */
interface AdAccount {
  id: number;                          // 主键
  accountId: string;                   // 广告账户ID(平台账户ID)
  accountName?: string;                // 账户名称
  opportunityScore: number;            // 机会分数(0-100)
  accountBalance?: number;             // 账户余额(美元)
  totalSpend?: number;                 // 总花费(美元)
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'; // 账户状态
  platformId: number;                  // 外键:关联平台
  customerId: number;                  // 外键:关联客户
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
  
  // 关联实体(查询时返回)
  platform?: AdPlatform;               // 所属平台信息
  customer?: Customer;                 // 所属客户信息
  recommendationCount?: number;        // 优化建议数量(聚合字段)
}

/**
 * 建议分类
 */
interface RecommendationCategory {
  id: number;                          // 主键
  categoryCode: 'BUDGET' | 'CREATIVE' | 'AUDIENCE' | 'AUTO'; // 分类代码
  categoryName: string;                // 分类名称
  categoryColor?: string;              // 分类颜色(用于UI展示)
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
}

/**
 * 优化建议
 */
interface Recommendation {
  id: number;                          // 主键
  title: string;                       // 建议标题
  description: string;                 // 建议描述
  impactScore: number;                 // 影响分数提升(可为负)
  affectedAdCount: number;             // 影响的广告数量
  status: 'PENDING' | 'ADOPTED' | 'IGNORED'; // 建议状态
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // 优先级
  accountId: number;                   // 外键:关联账户
  categoryId: number;                  // 外键:关联分类
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
  reviewedAt?: string;                 // 采纳/忽略时间
  
  // 关联实体(查询时返回)
  account?: AdAccount;                 // 所属账户信息
  category?: RecommendationCategory;   // 建议分类信息
}

/**
 * 账户指标(历史数据)
 */
interface AccountMetric {
  id: number;                          // 主键
  metricDate: string;                  // 指标日期(YYYY-MM-DD)
  cpa?: number;                        // CPA成本
  roas?: number;                       // ROAS
  conversionRate?: number;             // 转化率
  dailySpend?: number;                 // 日花费
  accountId: number;                   // 外键:关联账户
  createdAt: string;                   // 创建时间
}

// ==================== 查询参数类型定义 ====================

/**
 * 优化建议列表查询参数
 */
interface RecommendationListParams {
  pageNum?: number;                    // 页码(从1开始)
  pageSize?: number;                   // 每页条数
  platform?: string;                   // 平台筛选(META/GOOGLE)
  category?: string;                   // 分类筛选(BUDGET/CREATIVE/AUDIENCE/AUTO)
  scoreRange?: string;                 // 分数范围筛选(0-40/40-80/80-100)
  keyword?: string;                    // 搜索关键词(账户ID/建议标题)
  status?: string;                     // 状态筛选(PENDING/ADOPTED/IGNORED)
  sortBy?: string;                     // 排序字段
  sortOrder?: 'asc' | 'desc';          // 排序方向
}

/**
 * 账户列表查询参数
 */
interface AdAccountListParams {
  pageNum?: number;                    // 页码
  pageSize?: number;                   // 每页条数
  platform?: string;                   // 平台筛选
  scoreRange?: string;                 // 分数范围
  keyword?: string;                    // 搜索关键词
}

/**
 * 概览统计数据
 */
interface OverviewData {
  platforms: PlatformStat[];           // 各平台统计
  scoreDistribution: {                 // 分数分布统计
    excellent: number;                 // 优秀账户数(≥80分)
    good: number;                      // 待改进账户数(40-79分)
    poor: number;                      // 需关注账户数(<40分)
  };
  featuredCases: OptimizationCase[];   // 优化案例
}

/**
 * 平台统计
 */
interface PlatformStat {
  platform: AdPlatform;                // 平台信息
  accountCount: number;                // 账户数量
  recommendationCount: number;         // 优化建议数
  totalBalance: number;                // 总余额
}

/**
 * 优化案例
 */
interface OptimizationCase {
  customerName: string;                // 客户名称
  industry: string;                    // 行业
  optimizationType: string;            // 优化类型
  scoreBefore: number;                 // 优化前分数
  scoreAfter: number;                  // 优化后分数
  conversionImprovement: string;       // 转化率提升
  roasValue: string;                   // ROAS值
  description: string;                 // 案例描述
}

/**
 * 批量导入错误信息
 */
interface ImportError {
  row: number;                         // 错误行号
  field: string;                       // 错误字段
  message: string;                     // 错误信息
}
```

### 6.3 完整数据模型与实体关系

#### 6.3.1 实体关系图

```
AdPlatform (广告平台)
    ├─ id: INTEGER (主键)
    ├─ platformCode: TEXT (平台代码)
    ├─ platformName: TEXT (平台名称)
    └─ platformIcon: TEXT (平台图标)
        │
        └──(1:N)──> AdAccount (广告账户)
                        ├─ id: INTEGER (主键)
                        ├─ accountId: TEXT (账户ID)
                        ├─ opportunityScore: INTEGER (机会分数)
                        ├─ accountBalance: REAL (账户余额)
                        ├─ platformId: INTEGER (外键→AdPlatform.id)
                        ├─ customerId: INTEGER (外键→Customer.id)
                        │
                        ├──(1:N)──> Recommendation (优化建议)
                        │              ├─ id: INTEGER (主键)
                        │              ├─ title: TEXT (建议标题)
                        │              ├─ description: TEXT (建议描述)
                        │              ├─ impactScore: INTEGER (影响分数)
                        │              ├─ affectedAdCount: INTEGER (影响广告数)
                        │              ├─ status: TEXT (状态)
                        │              ├─ accountId: INTEGER (外键→AdAccount.id)
                        │              └─ categoryId: INTEGER (外键→RecommendationCategory.id)
                        │
                        └──(1:N)──> AccountMetric (账户指标)
                                       ├─ id: INTEGER (主键)
                                       ├─ metricDate: TEXT (指标日期)
                                       ├─ cpa: REAL (CPA)
                                       ├─ roas: REAL (ROAS)
                                       └─ accountId: INTEGER (外键→AdAccount.id)

Customer (客户信息)
    ├─ id: INTEGER (主键)
    ├─ customerName: TEXT (客户名称)
    ├─ industry: TEXT (行业)
    └─ customerLevel: TEXT (客户等级)
        │
        └──(1:N)──> AdAccount (广告账户)

RecommendationCategory (建议分类)
    ├─ id: INTEGER (主键)
    ├─ categoryCode: TEXT (分类代码)
    ├─ categoryName: TEXT (分类名称)
    └─ categoryColor: TEXT (分类颜色)
        │
        └──(1:N)──> Recommendation (优化建议)
```

#### 6.3.2 关系说明

| 父实体 | 子实体 | 关系类型 | 级联规则 | 说明 |
|-------|-------|---------|---------|------|
| AdPlatform | AdAccount | 1:N | RESTRICT | 一个平台有多个账户,有账户时不可删除平台 |
| Customer | AdAccount | 1:N | SET NULL | 一个客户有多个账户,删除客户时账户保留 |
| AdAccount | Recommendation | 1:N | CASCADE | 一个账户有多条建议,删除账户时级联删除建议 |
| AdAccount | AccountMetric | 1:N | CASCADE | 一个账户有多条指标数据,删除账户时级联删除指标 |
| RecommendationCategory | Recommendation | 1:N | RESTRICT | 一个分类有多条建议,有建议时不可删除分类 |

#### 6.3.3 数据库表设计(SQL DDL)

详见《第7章 数据库表结构设计》。

---

## 7. 数据库表结构设计

### 7.1 广告平台表(ad_platforms)

```sql
CREATE TABLE IF NOT EXISTS ad_platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platformCode TEXT UNIQUE NOT NULL,            -- 平台代码(META/GOOGLE/TIKTOK)
  platformName TEXT NOT NULL,                   -- 平台显示名称
  platformIcon TEXT,                            -- 平台图标URL
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- 插入初始数据
INSERT OR IGNORE INTO ad_platforms (platformCode, platformName) VALUES 
  ('META', 'Meta Ads'),
  ('GOOGLE', 'Google Ads'),
  ('TIKTOK', 'TikTok Ads');
```

### 7.2 客户信息表(customers)

```sql
CREATE TABLE IF NOT EXISTS adguidance_customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerName TEXT NOT NULL,                   -- 客户名称
  industry TEXT,                                -- 所属行业
  customerLevel TEXT DEFAULT 'NORMAL',          -- 客户等级(VIP/NORMAL)
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);
```

### 7.3 广告账户表(ad_accounts)

```sql
CREATE TABLE IF NOT EXISTS ad_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  accountId TEXT UNIQUE NOT NULL,               -- 广告账户ID
  accountName TEXT,                             -- 账户名称
  opportunityScore INTEGER DEFAULT 0,           -- 机会分数(0-100)
  accountBalance REAL DEFAULT 0,                -- 账户余额(美元)
  totalSpend REAL DEFAULT 0,                    -- 总花费(美元)
  status TEXT DEFAULT 'ACTIVE',                 -- 账户状态(ACTIVE/INACTIVE/SUSPENDED)
  platformId INTEGER NOT NULL,                  -- 外键:平台ID
  customerId INTEGER,                           -- 外键:客户ID
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (platformId) REFERENCES ad_platforms(id) ON DELETE RESTRICT,
  FOREIGN KEY (customerId) REFERENCES adguidance_customers(id) ON DELETE SET NULL
);

-- 为外键创建索引
CREATE INDEX IF NOT EXISTS idx_ad_accounts_platformId ON ad_accounts(platformId);
CREATE INDEX IF NOT EXISTS idx_ad_accounts_customerId ON ad_accounts(customerId);
CREATE INDEX IF NOT EXISTS idx_ad_accounts_opportunityScore ON ad_accounts(opportunityScore);
```

### 7.4 建议分类表(recommendation_categories)

```sql
CREATE TABLE IF NOT EXISTS recommendation_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categoryCode TEXT UNIQUE NOT NULL,            -- 分类代码(BUDGET/CREATIVE/AUDIENCE/AUTO)
  categoryName TEXT NOT NULL,                   -- 分类名称
  categoryColor TEXT,                           -- 分类颜色(用于UI展示)
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- 插入初始数据
INSERT OR IGNORE INTO recommendation_categories (categoryCode, categoryName, categoryColor) VALUES 
  ('BUDGET', '预算', 'green'),
  ('CREATIVE', '创意', 'purple'),
  ('AUDIENCE', '受众', 'blue'),
  ('AUTO', '自动化', 'orange');
```

### 7.5 优化建议表(recommendations)

```sql
CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,                          -- 建议标题
  description TEXT NOT NULL,                    -- 建议描述
  impactScore INTEGER DEFAULT 0,                -- 影响分数提升(可为负)
  affectedAdCount INTEGER DEFAULT 0,            -- 影响的广告数量
  status TEXT DEFAULT 'PENDING',                -- 建议状态(PENDING/ADOPTED/IGNORED)
  priority TEXT DEFAULT 'MEDIUM',               -- 优先级(HIGH/MEDIUM/LOW)
  accountId INTEGER NOT NULL,                   -- 外键:账户ID
  categoryId INTEGER NOT NULL,                  -- 外键:分类ID
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  reviewedAt TEXT,                              -- 采纳/忽略时间
  
  FOREIGN KEY (accountId) REFERENCES ad_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES recommendation_categories(id) ON DELETE RESTRICT
);

-- 为外键创建索引
CREATE INDEX IF NOT EXISTS idx_recommendations_accountId ON recommendations(accountId);
CREATE INDEX IF NOT EXISTS idx_recommendations_categoryId ON recommendations(categoryId);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON recommendations(status);
```

### 7.6 账户指标表(account_metrics)

```sql
CREATE TABLE IF NOT EXISTS account_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metricDate TEXT NOT NULL,                     -- 指标日期(YYYY-MM-DD)
  cpa REAL,                                     -- CPA成本
  roas REAL,                                    -- ROAS
  conversionRate REAL,                          -- 转化率
  dailySpend REAL,                              -- 日花费
  accountId INTEGER NOT NULL,                   -- 外键:账户ID
  createdAt TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (accountId) REFERENCES ad_accounts(id) ON DELETE CASCADE
);

-- 为外键创建索引
CREATE INDEX IF NOT EXISTS idx_account_metrics_accountId ON account_metrics(accountId);
CREATE INDEX IF NOT EXISTS idx_account_metrics_metricDate ON account_metrics(metricDate);
```

---

## 8. 业务规则 (Business Rules)

### 8.1 校验规则

#### 账户ID格式校验

| 平台 | 格式规则 | 示例 |
|-----|---------|------|
| **Meta** | act_[0-9]+ | act_123456789 |
| **Google Ads** | [0-9]{10} | 1234567890 |
| **TikTok** | [0-9]{10,} | 1234567890123 |

#### 机会分数计算规则

| 分数范围 | 等级 | 说明 |
|---------|------|------|
| **80-100** | 优秀 | 账户健康,继续保持 |
| **40-79** | 待改进 | 存在优化空间,建议关注 |
| **0-39** | 需关注 | 存在较多问题,需要紧急优化 |

计算公式(示例):
```
opportunityScore = 基础分(60) 
                  + 转化率得分(0-15)
                  + CPA得分(0-15)
                  + ROAS得分(0-10)
                  - 未采纳建议数 × 2
```

#### 建议状态流转

```
[新建] → [待采纳(PENDING)]
           ↓
        [用户操作]
           ├─ [采纳] → [已采纳(ADOPTED)] → 记录reviewedAt时间
           └─ [忽略] → [已忽略(IGNORED)] → 记录reviewedAt时间
```

### 8.2 权限规则

| 角色 | 查看 | 创建账户 | 编辑账户 | 删除账户 | 处理建议 | 说明 |
|-----|-----|---------|---------|---------|---------|-----|
| **管理员** | ✅ | ✅ | ✅ | ✅ | ✅ | 全部权限 |
| **优化师** | ✅ | ✅ | ✅ | ❌ | ✅ | 不可删除账户 |
| **客户** | ✅ | ❌ | ❌ | ❌ | ✅ | 仅可查看和处理自己的账户建议 |
| **访客** | ✅ | ❌ | ❌ | ❌ | ❌ | 仅可查看 |

### 8.3 数据脱敏规则

为保护账户隐私,需对账户ID进行脱敏展示:

| 原始账户ID | 脱敏后显示 | 规则 |
|-----------|-----------|------|
| act_123456789 | act_1234****789 | 保留前缀和首尾4位,中间替换为**** |
| 1234567890 | 1234****7890 | 保留首尾4位,中间替换为**** |

### 8.4 批量导入规则

#### Excel模板格式

| 列名 | 是否必填 | 格式 | 说明 |
|-----|---------|------|------|
| 平台 | ✅ | TEXT | META/GOOGLE/TIKTOK |
| 账户ID | ✅ | TEXT | 按平台格式校验 |
| 账户名称 | ❌ | TEXT | 选填,长度0-50 |
| 客户名称 | ✅ | TEXT | 必须是已存在的客户 |

#### 导入校验规则

1. **文件格式校验**:
   - 仅支持.xlsx和.xls格式
   - 文件大小不超过5MB
   - 最多支持1000行数据

2. **数据校验**:
   - 账户ID格式必须符合平台规则
   - 账户ID不可重复(包括已存在的账户)
   - 客户名称必须在系统中存在

3. **错误处理**:
   - 逐行校验,记录所有错误
   - 显示错误行号、字段、错误原因
   - 提供下载错误报告功能

---

## 9. 非功能需求 (Non-Functional Requirements)

### 9.1 性能要求

| 指标 | 要求 |
|------|------|
| **概览页加载时间** | < 2 秒 |
| **建议列表加载时间** | < 2 秒(100条数据以内)|
| **账户列表加载时间** | < 2 秒(100条数据以内)|
| **建议详情展开** | < 0.5 秒 |
| **状态更新响应** | < 1 秒 |
| **批量导入处理** | < 5 秒(500条数据以内)|
| **并发支持** | 支持50+用户同时在线操作 |

### 9.2 兼容性

| 项目 | 要求 |
|------|------|
| **浏览器** | Chrome 90+, Safari 14+, Edge 90+, Firefox 88+ |
| **屏幕分辨率** | ≥ 1366x768 |
| **移动端** | 暂不支持(后续版本考虑)|

### 9.3 可用性

- **操作步骤**:关键操作步骤 ≤ 3 步
- **错误提示**:必须清晰明确,并提供解决方案
- **加载反馈**:所有异步操作必须有 loading 状态
- **成功反馈**:操作成功后必须有明确提示(Toast/Message)
- **数据刷新**:操作成功后自动刷新列表

### 9.4 安全性

- **数据加密**:账户ID在传输时加密
- **操作日志**:记录所有增删改操作,包含操作人、时间、内容
- **权限校验**:前后端双重校验权限
- **敏感信息脱敏**:账户ID、客户名称脱敏展示

---

## 10. 验收标准 (Acceptance Criteria)

### 10.1 功能验收

#### 概览页

- [ ] 正确展示所有平台的账户统计(账户数、优化建议数、总余额)
- [ ] 正确展示机会分数分布(优秀/待改进/需关注)
- [ ] 展示至少1个优化案例卡片
- [ ] 点击平台卡片可跳转到账户管理页并筛选该平台

#### 优化建议页

- [ ] 正确展示分类统计(预算、创意、受众、自动化)
- [ ] 点击分类可展开该分类的建议列表
- [ ] 建议列表正确显示所有字段(建议标题、账户ID、分类、影响广告数等)
- [ ] 支持按平台、分类、分数范围筛选
- [ ] 支持搜索账户ID或建议标题
- [ ] 点击"查看详情"可展开详情区域
- [ ] 点击"采纳"可更新建议状态为"已采纳"
- [ ] 点击"忽略"可弹出二次确认并标记为"已忽略"
- [ ] 状态更新后自动刷新列表

#### 账户管理页

- [ ] 按平台分组展示账户列表(Meta、Google Ads等)
- [ ] 每个平台显示账户数、优化建议数、总余额
- [ ] 账户列表正确显示所有字段(广告主实体、账户ID、机会分数等)
- [ ] 点击"添加账户"打开添加弹框
- [ ] 手动添加账户成功后刷新列表
- [ ] 点击"批量导入"打开上传弹框
- [ ] 批量导入成功后显示导入结果统计
- [ ] 批量导入失败时显示错误明细
- [ ] 点击"管理"按钮打开账户详情Modal
- [ ] 账户详情展示账户基本信息和优化建议列表

### 10.2 UI 验收

- [ ] 页面布局符合设计规范
- [ ] 按钮状态正确(正常/禁用/加载中)
- [ ] 表单校验提示位置和样式准确
- [ ] Modal 弹框宽度、高度合适
- [ ] 机会分数显示环形进度条,颜色根据分数变化(红色<40,橙色40-79,绿色≥80)
- [ ] 分类标签显示正确的颜色(预算-绿色,创意-紫色,受众-蓝色,自动化-黄色)
- [ ] 账户ID正确脱敏显示
- [ ] 所有文案无错别字
- [ ] Loading状态显示正确

### 10.3 性能验收

- [ ] 概览页加载时间 < 2 秒
- [ ] 建议列表加载时间 < 2 秒
- [ ] 账户列表加载时间 < 2 秒
- [ ] 状态更新响应时间 < 1 秒
- [ ] 批量导入处理时间 < 5 秒(500条数据)
- [ ] 无明显的页面卡顿
- [ ] 无内存泄漏(长时间使用后内存不持续增长)

### 10.4 异常验收

- [ ] 数据加载失败时显示友好提示和"刷新"按钮
- [ ] 网络异常时显示友好提示
- [ ] 权限不足时禁用相关操作并提示
- [ ] 账户ID格式错误时显示具体错误提示
- [ ] 账户ID重复时提示"该账户已添加"
- [ ] Excel文件格式错误时提示具体错误原因
- [ ] 批量导入数据错误时显示错误行号和原因

---

## 11. 变更记录 (Change Log)

| 版本号 | 日期 | 变更类型 | 变更内容 | 变更人 | 评审状态 |
|-------|------|---------|---------|--------|---------|
| v1.0  | 2025-12-01 | 新增 | 初始版本,定义核心功能(概览、优化建议、账户管理)| AI Assistant | 草稿 |

---

## 12. 附录 (Appendix)

### 12.1 相关文档

- **前端代码**:
  - 概览页:`src/pages/adguidance/overview/index.tsx`
  - 优化建议页:`src/pages/adguidance/recommendations/index.tsx`
  - 账户管理页:`src/pages/adguidance/accounts/index.tsx`
- **Mock数据**:`mock/adguidance.ts`
- **数据库配置**:`src/db/index.ts`
- **TypeScript类型定义**:`src/types/adguidance.ts`
- **API服务**:`src/services/adguidance.ts`

### 12.2 术语表

| 术语 | 英文 | 说明 |
|-----|------|------|
| 机会分数 | Opportunity Score | 账户健康度评分(0-100分),分数越高表示账户越健康 |
| 优化建议 | Recommendation | 系统根据账户数据生成的优化建议 |
| 分数提升 | Impact Score | 采纳建议后预期的机会分数提升值 |
| CPA | Cost Per Action | 单次行动成本 |
| ROAS | Return On Ad Spend | 广告支出回报率 |
| 受众 | Audience | 广告投放的目标人群 |
| 创意 | Creative | 广告素材(图片、视频、文案等)|

### 12.3 参考资料

- Meta广告管理API文档:https://developers.facebook.com/docs/marketing-apis
- Google Ads API文档:https://developers.google.com/google-ads/api/docs
- Ant Design v4 组件库:https://4x.ant.design/

---

**审核记录**

| 审核人 | 审核日期 | 审核意见 | 审核结果 |
|-------|---------|---------|---------|
| 产品经理 | - | 待评审 | - |
| 技术负责人 | - | 待评审 | - |
| UI 设计师 | - | 待评审 | - |

---

**文档结束**

