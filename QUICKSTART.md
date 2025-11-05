# 快速入门指南

欢迎使用 VisionLine 产品原型项目！本指南将帮助您快速搭建开发环境并开始使用。

## 📋 目录

- [环境准备](#环境准备)
- [项目初始化](#项目初始化)
- [启动开发服务器](#启动开发服务器)
- [创建第一个功能](#创建第一个功能)
- [常见问题排查](#常见问题排查)

---

## 环境准备

### 必需软件

1. **Node.js**（版本 >= 14.x）
   
   检查是否已安装：
   ```bash
   node --version
   ```
   
   如未安装，请访问 [Node.js 官网](https://nodejs.org/) 下载安装。

2. **包管理器**（npm 或 yarn）
   
   检查 npm 版本：
   ```bash
   npm --version
   ```
   
   或安装 yarn：
   ```bash
   npm install -g yarn
   ```

3. **Git**（用于版本控制）
   
   检查是否已安装：
   ```bash
   git --version
   ```

4. **现代浏览器**
   - Chrome 90+
   - Safari 14+
   - Edge 90+
   - Firefox 88+

### 推荐工具

- **VS Code** 或 **Cursor**：推荐使用 Cursor（内置 AI 辅助）
- **Git 客户端**：Sourcetree、GitHub Desktop 或命令行

---

## 项目初始化

### 1. 进入项目目录

```bash
cd /Users/zhongsheng/Documents/work/vl_project
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn（推荐，速度更快）
yarn install
```

安装过程可能需要 3-5 分钟，请耐心等待。

### 3. 验证安装

安装完成后，检查 `node_modules/` 目录是否存在：

```bash
ls node_modules
```

应该能看到 `umi`、`react`、`antd` 等依赖包。

---

## 启动开发服务器

### 启动命令

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 start 命令
npm start
```

### 启动成功

当看到以下信息时，表示启动成功：

```
✔ Webpack
  Compiled successfully in 5.20s

 DONE  Compiled successfully in 5201ms

  App running at:
  - Local:   http://localhost:8000
  - Network: http://192.168.1.100:8000
```

### 访问应用

在浏览器中打开：[http://localhost:8000](http://localhost:8000)

您将看到：
- 顶部导航栏（VisionLine Logo 和用户信息）
- 左侧菜单（包含"业务概览"等菜单项）
- 右侧内容区（显示仪表盘）

### 热更新

开发服务器支持热更新（Hot Module Replacement），修改代码后：
- 保存文件
- 浏览器自动刷新
- 无需手动重启服务器

### 停止服务器

在终端中按 `Ctrl + C` 停止开发服务器。

---

## 创建第一个功能

### 使用 Cursor AI 创建功能

1. **打开 Cursor**（或 VS Code）

2. **使用 Cursor Chat**（快捷键：Cmd+L 或 Ctrl+L）

3. **输入以下 Prompt**：

```
创建新功能：用户列表管理

功能点 ID: VL-USR-001
所属模块: 用户管理
功能背景: 需要管理系统用户，包括查看、新建、编辑、删除用户
用户角色: 管理员
核心场景: 管理员需要管理系统用户信息

请生成：
1. PRD 文档（包含需求描述、交互流程、验收标准）
2. 前端原型代码（Umi + React + Ant Design v4）
3. 用户操作手册（包含步骤说明、注意事项、FAQ）
```

4. **AI 将自动生成**：
   - `docs/prd/PRD_用户列表管理.md`
   - `src/pages/user/list/index.tsx`
   - `src/services/user.ts`
   - `src/types/user.ts`
   - `docs/user-manual/user_manual_用户列表管理.md`

5. **查看生成的文件**，确认内容符合预期

6. **在浏览器中访问**：[http://localhost:8000/user/list](http://localhost:8000/user/list)

### 手动创建功能（不使用 AI）

如果您想手动创建，可以参考以下步骤：

#### 1. 创建页面组件

```bash
mkdir -p src/pages/example
touch src/pages/example/index.tsx
```

在 `src/pages/example/index.tsx` 中：

```typescript
import React from 'react';
import { Card } from 'antd';

const ExamplePage: React.FC = () => {
  return (
    <Card title="示例页面">
      <p>这是一个示例页面</p>
    </Card>
  );
};

export default ExamplePage;
```

#### 2. 添加路由配置

在 `.umirc.ts` 中添加路由：

```typescript
export default defineConfig({
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        // ... 其他路由
        { path: '/example', component: '@/pages/example/index' },
      ],
    },
  ],
  // ... 其他配置
});
```

#### 3. 添加菜单项

在 `src/layouts/index.tsx` 中添加菜单：

```typescript
const menuItems = [
  // ... 其他菜单
  {
    key: '/example',
    icon: <AppstoreOutlined />,
    label: <Link to="/example">示例页面</Link>,
  },
];
```

#### 4. 重启开发服务器

```bash
# 按 Ctrl+C 停止，然后重新启动
npm run dev
```

#### 5. 访问新页面

浏览器访问：[http://localhost:8000/example](http://localhost:8000/example)

---

## 项目结构说明

### 目录功能

```
vl_project/
├── .cursor/rules/          # Cursor AI 规则配置
├── docs/                   # 文档目录
│   ├── prd/               # PRD 产品需求文档
│   └── user-manual/       # 用户操作手册
├── src/
│   ├── components/        # 公共组件
│   ├── layouts/           # 布局组件
│   ├── models/            # Dva 数据模型
│   ├── pages/             # 页面组件（主要开发目录）
│   ├── services/          # API 服务层
│   ├── types/             # TypeScript 类型定义
│   └── utils/             # 工具函数
├── .umirc.ts              # Umi 配置文件（路由、插件等）
├── package.json           # 项目依赖
└── tsconfig.json          # TypeScript 配置
```

### 开发流程

```
1. 创建功能点 ID → 2. 编写 PRD → 3. 生成代码
                                        ↓
6. 合并到主分支 ← 5. 测试验收 ← 4. 编写用户手册
```

---

## 常见问题排查

### Q1: 启动时报错 "Cannot find module 'umi'"

**原因**：依赖未正确安装

**解决方法**：

```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install
```

### Q2: 端口 8000 被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::8000
```

**解决方法**：

**方法1**：停止占用端口的进程

```bash
# Mac/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID号> /F
```

**方法2**：使用其他端口

在 `.umirc.ts` 中添加：

```typescript
export default defineConfig({
  devServer: {
    port: 8001,
  },
  // ... 其他配置
});
```

### Q3: 浏览器显示空白页面

**可能原因**：

1. **JavaScript 错误**：
   - 打开浏览器控制台（F12）
   - 查看 Console 面板是否有错误信息

2. **路由配置错误**：
   - 检查 `.umirc.ts` 中的路由配置
   - 确保路径和组件路径正确

3. **编译错误**：
   - 查看终端中的编译输出
   - 修复报错的代码

**解决方法**：

```bash
# 清除缓存
rm -rf .umi .umi-production

# 重新启动
npm run dev
```

### Q4: TypeScript 类型错误

**错误示例**：
```
Property 'xxx' does not exist on type 'yyy'
```

**解决方法**：

1. 检查类型定义是否正确
2. 在 `src/types/` 中添加或更新类型定义
3. 确保导入了正确的类型

示例：

```typescript
// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// 在组件中使用
import type { User } from '@/types/user';
```

### Q5: Ant Design 组件样式不生效

**原因**：可能未正确导入样式

**检查清单**：

1. 确认 `package.json` 中有 `antd@^4.24.16`
2. 确认 `.umirc.ts` 中配置了 `antd: {}`
3. 重启开发服务器

### Q6: Mock 数据如何配置？

Umi 支持 Mock 功能，创建 `mock/` 目录：

```bash
mkdir mock
touch mock/user.ts
```

在 `mock/user.ts` 中：

```typescript
export default {
  'GET /api/users': [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
  ],
};
```

重启服务器后，访问 `/api/users` 将返回 Mock 数据。

### Q7: 如何调试代码？

**方法1：使用浏览器调试**

1. 在浏览器中打开开发者工具（F12）
2. 切换到 Sources 面板
3. 找到对应的源文件（在 webpack:// 目录下）
4. 设置断点
5. 刷新页面，触发断点

**方法2：使用 console.log**

```typescript
const MyComponent = () => {
  console.log('组件已渲染');
  
  const handleClick = () => {
    console.log('按钮被点击');
  };
  
  return <Button onClick={handleClick}>点击</Button>;
};
```

**方法3：使用 React DevTools**

安装 Chrome 扩展：React Developer Tools

---

## 下一步

恭喜！您已经完成了快速入门。接下来您可以：

1. **阅读开发规范**
   - [产品团队规范](./.cursor/rules/projectrules.mdc)
   - [前端开发规范](./.cursor/rules/frontend-standards.md)

2. **学习示例代码**
   - 查看 `src/layouts/index.tsx` 了解布局组件
   - 查看 `src/pages/dashboard/index.tsx` 了解页面组件

3. **创建实际功能**
   - 使用 Cursor AI 快速生成完整功能
   - 参考 PRD 和用户手册规范

4. **加入开发流程**
   - 创建 Git 分支
   - 按照 Git 提交规范提交代码
   - 提交 Pull Request 进行评审

---

## 获取帮助

- **项目文档**：[README.md](./README.md)
- **PRD 规范**：[prd-standards.md](./.cursor/rules/prd-standards.md)
- **用户手册规范**：[user-manual-standards.md](./.cursor/rules/user-manual-standards.md)
- **技术支持**：support@visionline.com
- **Umi 官方文档**：https://v3.umijs.org/

---

**祝您开发顺利！** 🚀

如有任何问题，欢迎随时联系产品团队。

