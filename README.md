# VisionLine 产品原型项目

VisionLine 产品原型项目是一个基于 **Umi + React + Ant Design v4** 的产品原型平台，专为产品团队设计，支持快速创建可直接部署的前端原型、PRD 文档和用户操作手册。

## 📋 项目概述

本项目旨在通过 Cursor AI 实现产品原型的快速开发和文档化管理，输出三大核心交付物：

1. **前端原型代码**：基于 Umi + React + Ant Design v4 的可运行原型
2. **PRD 文档**：标准化的产品需求文档（Markdown 格式）
3. **用户操作手册**：面向最终用户的功能使用说明

### 产品背景

- **行业**：出海广告营销
- **产品方向**：
  - 媒介服务产品（账户开通、充值、绑定、更名等）
  - 投放服务产品（素材生成、素材管理、自动投放等）

## 🏗️ 技术栈

- **前端框架**：Umi 3.5.41 + React 17.0.2
- **UI 组件库**：Ant Design v4.24.16（强制 v4 版本）
- **开发语言**：TypeScript 4.9+
- **状态管理**：Dva（基于 Redux）
- **构建工具**：Webpack 4

## 📁 项目结构

```
vl_project/
├── .cursor/                    # Cursor 配置
│   └── rules/                  # Cursor Rules 规则文件
│       ├── projectrules.mdc    # 产品团队总规则（alwaysApply）
│       ├── frontend-standards.md      # 前端代码规范
│       ├── prd-standards.md           # PRD 文档规范
│       └── user-manual-standards.md   # 用户手册规范
├── docs/                       # 文档目录
│   ├── README.md               # 文档索引
│   ├── prd/                    # PRD 产品需求文档
│   │   ├── README.md
│   │   └── PRD_{功能名称}.md
│   └── user-manual/            # 用户操作手册
│       ├── README.md
│       └── user_manual_{功能名称}.md
├── src/                        # 源码目录
│   ├── components/             # 公共组件
│   ├── layouts/                # 布局组件
│   │   └── index.tsx           # 主布局（顶部导航+左侧菜单+右侧内容）
│   ├── models/                 # Dva 数据模型
│   ├── pages/                  # 页面组件
│   │   └── dashboard/          # 仪表盘
│   ├── services/               # API 服务层
│   ├── types/                  # TypeScript 类型定义
│   ├── utils/                  # 工具函数
│   │   └── request.ts          # 请求封装
│   └── global.less             # 全局样式
├── .gitignore                  # Git 忽略文件
├── .gitattributes              # Git 属性配置
├── .umirc.ts                   # Umi 配置文件
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript 配置
├── README.md                   # 本文件
└── QUICKSTART.md               # 快速入门指南
```

## 🚀 快速开始

### 环境要求

- **Node.js**：>= 14.x
- **npm**：>= 6.x 或 yarn >= 1.22.x
- **浏览器**：Chrome 90+, Safari 14+, Edge 90+

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev
# 或
npm start

# 使用 yarn
yarn dev
```

启动成功后，访问 [http://localhost:8000](http://localhost:8000)

### 构建生产版本

```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build
```

构建产物将生成在 `dist/` 目录下。

## 🎯 核心功能

### 1. 标准化布局

- **顶部导航栏**：Logo、菜单折叠按钮、用户信息
- **左侧菜单栏**：支持两层菜单，可折叠，与路由对应
- **右侧内容区**：主要内容展示，包含面包屑导航
- **响应式设计**：自动适配不同屏幕尺寸

### 2. Modal 弹框规范

- 所有详情、新建、编辑操作强制使用 Modal 弹框
- 禁止使用独立路由页面进行表单操作
- 统一的用户交互体验

### 3. 完整的类型定义

- 所有数据模型有 TypeScript 接口定义
- API 请求和响应有明确的类型约束
- 提供良好的代码提示和类型检查

## 📖 开发规范

### Cursor Rules 规范

本项目配置了 4 个 Cursor Rules 文件，AI 将自动遵循以下规范：

#### 1. 产品团队规范 (projectrules.mdc)

- 功能点 ID 命名规范（如 AD-ACC-001）
- Git 分支和提交信息规范
- 三大交付物联动规则（PRD + 代码 + 手册）
- 质量检查清单

#### 2. 前端代码规范 (frontend-standards.md)

- 强制使用 Ant Design v4.24.16（禁用 v5）
- 组件使用规范（Form、Modal、Table 等）
- 布局设计规范
- TypeScript 类型定义要求

#### 3. PRD 文档规范 (prd-standards.md)

- 完整的 PRD 文档模板
- 包含 11 个核心章节
- 数据模型必须有 TypeScript 定义
- 验收标准可直接用于测试

#### 4. 用户手册规范 (user-manual-standards.md)

- 详细的操作步骤说明
- 截图占位符标注
- 常见问题 FAQ（至少 5-8 个）
- 多角色使用场景覆盖

### Git 工作流

#### 分支命名

- **主分支**：`main`（已评审通过的内容）
- **开发分支**：`feature/{功能点ID}_{简要描述}`
  - 示例：`feature/AD-ACC-001_account_opening`
- **修复分支**：`fix/{功能点ID}_{问题描述}`

#### 提交信息规范

格式：`<type>({功能点ID}): <简要描述>`

示例：
```
feat(AD-ACC-001): 新增账户开通页面原型
docs(AD-ACC-001): 更新账户开通 PRD 文档
fix(AD-ACC-002): 修复充值流程中的表单验证问题
```

Type 类型：
- `feat`：新增功能
- `docs`：更新文档
- `fix`：修复问题
- `style`：样式调整
- `refactor`：代码重构

## 🎨 使用 Cursor 创建新功能

### 标准 Prompt 模板

```
创建新功能：[功能名称]

功能点 ID: [如 AD-ACC-001]
所属模块: [媒介服务/投放服务]
功能背景: [为什么需要这个功能]
用户角色: [运营人员/广告主/管理员]
核心场景: [用户在什么情况下使用]

请生成：
1. PRD 文档（包含需求描述、交互流程、验收标准）
2. 前端原型代码（Umi + React + Ant Design v4）
3. 用户操作手册（包含步骤说明、注意事项、FAQ）
```

Cursor AI 将自动：

1. 生成功能点 ID（如果未指定）
2. 创建 PRD 文档到 `docs/prd/`
3. 生成前端页面组件到 `src/pages/`
4. 创建用户手册到 `docs/user-manual/`
5. 更新文档索引文件
6. 更新路由配置（如需要）

### 自动化流程

```
用户输入 Prompt
    ↓
Cursor 分析需求
    ↓
生成 PRD 文档 → 创建前端代码 → 编写用户手册
    ↓
更新索引文件 → 更新路由配置
    ↓
完成！三大交付物已就绪
```

## 📚 文档管理

### PRD 文档

- **位置**：`docs/prd/`
- **命名**：`PRD_{功能名称}.md`
- **索引**：`docs/prd/README.md`

每个 PRD 包含：
- 文档信息（功能点 ID、版本、日期）
- 背景与目标
- 用户故事
- 功能需求
- 交互流程
- 数据定义
- 验收标准
- 变更记录

### 用户手册

- **位置**：`docs/user-manual/`
- **命名**：`user_manual_{功能名称}.md`
- **索引**：`docs/user-manual/README.md`

每个手册包含：
- 功能简介
- 快速开始
- 详细操作步骤（含截图占位符）
- 常见操作
- FAQ（至少 5-8 个）
- 获取帮助

## 🔍 常见问题

### Q: 为什么强制使用 Ant Design v4？

**A**: 
- v4 版本稳定成熟，生态完善
- 本项目已有大量 v4 组件代码
- v5 API 变化较大，迁移成本高
- v4 完全满足当前项目需求

### Q: 为什么所有详情/编辑都用 Modal？

**A**:
- 统一的用户体验
- 避免频繁的页面跳转
- 保持上下文，用户可快速返回列表
- 提升操作效率

### Q: 如何处理 API 接口？

**A**:
- 所有 API 调用统一使用 `src/utils/request.ts`
- 在 `src/services/` 中定义接口方法
- 使用 TypeScript 定义请求和响应类型
- 参考 `frontend-standards.md` 中的示例

### Q: 如何添加新的菜单项？

**A**:
1. 在 `.umirc.ts` 中添加路由配置
2. 在 `src/layouts/index.tsx` 中添加菜单项
3. 创建对应的页面组件
4. 确保路由路径与菜单 key 一致

## 📞 获取帮助

### 文档资源

- [快速入门指南](./QUICKSTART.md)
- [产品团队规范](./.cursor/rules/projectrules.mdc)
- [前端开发规范](./.cursor/rules/frontend-standards.md)
- [PRD 编写规范](./.cursor/rules/prd-standards.md)
- [用户手册规范](./.cursor/rules/user-manual-standards.md)

### 技术支持

- **产品团队**：product@visionline.com
- **技术支持**：support@visionline.com
- **文档反馈**：docs-feedback@visionline.com

## 📅 更新记录

| 版本 | 日期 | 更新内容 | 更新人 |
|------|------|---------|--------|
| v1.0 | 2025-01-15 | 初始化项目，配置 Cursor Rules | 系统 |

## 📄 许可证

本项目仅供内部使用，未经授权不得外传。

---

**开发团队**：VisionLine 产品团队  
**最后更新**：2025-01-15  
**项目状态**：🟢 活跃开发中

