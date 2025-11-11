# VisionLine 产品文档中心

欢迎来到 VisionLine 产品文档中心。本目录包含所有产品相关的文档，包括 PRD（产品需求文档）和用户操作手册。

## 📁 文档结构

```
docs/
├── README.md          # 本文件，文档索引
├── prd/               # PRD 产品需求文档目录
├── user-manual/       # 用户操作手册目录
└── summary/           # 项目总结文档目录
```

## 📋 PRD 文档

PRD（Product Requirements Document）产品需求文档定义了产品功能的详细需求、交互流程和验收标准。

查看所有 PRD 文档：[prd/README.md](./prd/README.md)

## 📖 用户手册

用户操作手册提供了面向最终用户的功能使用说明，包括操作步骤、截图和常见问题解答。

查看所有用户手册：[user-manual/README.md](./user-manual/README.md)

## 📝 项目总结

项目总结文档记录了功能实现过程和项目整体情况，包括功能实现总结、菜单结构总结、项目运行状态等。

查看所有总结文档：[summary/README.md](./summary/README.md)

## 🎯 文档规范

所有文档的编写必须遵循项目规范，详见：

- [PRD 文档编写规范](../.cursor/rules/prd-standards.md)
- [用户手册编写规范](../.cursor/rules/user-manual-standards.md)
- [产品团队工作规范](../.cursor/rules/projectrules.mdc)

## 📝 如何使用

### 查找文档

1. **按功能模块查找**：在对应目录的 README 中查看功能列表
2. **按功能点 ID 查找**：每个功能都有唯一的功能点 ID（如 AD-ACC-001）
3. **按文档类型查找**：PRD 或用户手册

### 创建新文档

使用 Cursor AI 创建新功能时，会自动生成以下文档：

1. PRD 文档：`docs/prd/PRD_{功能名称}.md`
2. 用户手册：`docs/user-manual/user_manual_{功能名称}.md`
3. 前端代码：`src/pages/{模块名}/`

所有文档会自动关联功能点 ID，便于追踪和管理。

## 🔍 文档状态说明

| 状态 | 说明 |
|-----|------|
| 草稿 | 文档正在编写中 |
| 待评审 | 文档已完成，等待评审 |
| 已评审 | 文档已通过评审 |
| 已实现 | 功能已开发完成 |
| 已废弃 | 功能已不再使用 |

## 📞 获取帮助

如有任何文档相关问题，请联系：

- 产品团队：product@visionline.com
- 技术支持：support@visionline.com

---

最后更新：2025-01-15

