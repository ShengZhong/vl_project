# 数据库管理功能快速上手指南

> **功能点ID**: VL-TOOL-001  
> **版本**: v1.0  
> **最后更新**: 2025-01-15

---

## 📋 功能概述

数据库管理工具为管理员和研发人员提供可视化的数据库管理界面，支持：
- ✅ 查看数据库表结构（字段、类型、约束）
- ✅ 查看表关系（外键、级联规则）
- ✅ 执行自定义SQL查询
- ✅ 导出查询结果为CSV
- ✅ 危险操作保护（二次确认）

---

## 🚀 快速开始

### 1. 访问页面

**方式一**：通过菜单导航
1. 启动应用：`npm start`
2. 打开浏览器访问：`http://localhost:8000`
3. 在左侧菜单中找到：**工具类 → 数据库管理**

**方式二**：直接访问
- URL：`http://localhost:8000/tools/database`

---

## 📖 功能使用指南

### 功能一：查看表结构

**适用场景**：了解数据库表的字段定义、数据类型、约束条件

#### 操作步骤

1. 进入数据库管理页面
2. 默认显示 **"表结构"** Tab页
3. 查看所有表的列表（折叠状态）
4. 点击表名展开，查看详细字段信息

#### 展示内容

| 列名 | 说明 |
|-----|------|
| **字段名** | 字段名称，主键会加粗显示 |
| **类型** | TEXT（文本）/ INTEGER（整数）/ REAL（浮点数）|
| **是否必填** | 红色Tag表示必填，灰色Tag表示可选 |
| **默认值** | 字段的默认值 |
| **备注** | 主键、外键标识 |

#### 高级功能

- **搜索表名**：在搜索框中输入表名快速定位
- **复制DDL**：点击"复制DDL"按钮，复制表的创建语句

---

### 功能二：查看表关系

**适用场景**：了解表之间的外键关系、级联删除规则

#### 操作步骤

1. 点击 **"表关系"** Tab页
2. 查看所有外键关系列表

#### 展示内容

| 列名 | 说明 |
|-----|------|
| **子表** | 包含外键的表 |
| **子表字段** | 外键字段名 |
| **父表** | 被引用的表 |
| **父表字段** | 被引用的字段 |
| **删除规则** | CASCADE（级联删除）/ SET NULL（设置为NULL）/ RESTRICT（限制）|
| **更新规则** | 同删除规则 |

#### 级联规则说明

| 规则 | 说明 | 颜色标识 |
|-----|------|---------|
| **CASCADE** | 删除父表记录时，自动删除子表关联记录 | 红色 |
| **SET NULL** | 删除父表记录时，子表外键设置为NULL | 橙色 |
| **RESTRICT** | 如果存在子表记录，禁止删除父表记录 | 紫色 |
| **NO ACTION** | 不执行任何操作 | 灰色 |

#### 高级功能

- **搜索表名**：在搜索框中输入表名快速筛选
- **分页查看**：支持分页和每页显示数量调整

---

### 功能三：执行SQL查询

**适用场景**：查询数据、验证数据、数据分析

#### 操作步骤

1. 点击 **"SQL查询"** Tab页
2. 在编辑器中输入SQL语句
3. 点击 **"执行"** 按钮
4. 查看查询结果

#### 支持的SQL类型

| SQL类型 | 是否支持 | 说明 |
|--------|---------|------|
| **SELECT** | ✅ 支持 | 查询数据，直接执行 |
| **UPDATE** | ⚠️ 支持 | 更新数据，需二次确认 |
| **DELETE** | ⚠️ 支持 | 删除数据，需二次确认 |
| **INSERT** | ⚠️ 支持 | 插入数据，需二次确认 |
| **DROP** | ❌ 禁止 | 删除表结构，禁止执行 |
| **ALTER** | ❌ 禁止 | 修改表结构，禁止执行 |

#### 示例SQL

**示例1：查询VL用户列表**
```sql
SELECT * FROM vlusers LIMIT 10;
```

**示例2：查询特定状态的用户**
```sql
SELECT vlid, email, status 
FROM vlusers 
WHERE status = 'active'
ORDER BY registeredTime DESC
LIMIT 20;
```

**示例3：联表查询（客户和广告账户）**
```sql
SELECT 
  c.customerName,
  a.adAccountId,
  a.accountScore
FROM customers c
LEFT JOIN metaadguidance_accounts a ON a.customerId = c.id
LIMIT 10;
```

**示例4：统计查询**
```sql
SELECT 
  status, 
  COUNT(*) as count 
FROM vlusers 
GROUP BY status;
```

#### 查询结果

- **统计信息**：返回行数、执行时间
- **表格展示**：自动根据查询结果生成表格
- **分页**：支持分页查看，默认每页50条
- **导出CSV**：点击"导出CSV"按钮下载查询结果

#### 危险操作保护

**UPDATE/DELETE/INSERT操作**
- 系统会弹出确认对话框
- 显示即将执行的SQL语句
- 用户确认后才会执行
- 执行后自动保存数据库

**DROP/ALTER操作**
- 系统会拒绝执行
- 提示"禁止执行 XXX 操作，请通过代码修改数据库结构"
- 如需修改表结构，请在 `src/db/index.ts` 中修改

---

## 🛡️ 安全注意事项

### 1. 权限控制

- 数据库管理功能仅限 **管理员** 使用
- 请勿将访问权限开放给普通用户

### 2. 操作风险

| 操作类型 | 风险等级 | 防护措施 |
|---------|---------|---------|
| SELECT查询 | 🟢 低风险 | 只读操作，无风险 |
| UPDATE更新 | 🟡 中风险 | 二次确认，可回滚 |
| DELETE删除 | 🔴 高风险 | 二次确认，难以恢复 |
| INSERT插入 | 🟡 中风险 | 二次确认，可删除 |
| DROP/ALTER | 🔴 极高风险 | 禁止执行 |

### 3. 最佳实践

✅ **推荐做法**
- 执行修改操作前，先用SELECT查询确认数据
- 使用LIMIT限制查询结果数量
- 定期导出数据库备份

❌ **禁止做法**
- 不要执行无WHERE条件的UPDATE/DELETE
- 不要执行大批量修改操作
- 不要在生产环境直接执行SQL

---

## 📊 常见使用场景

### 场景1：查看用户数据

```sql
-- 查看最近注册的10个用户
SELECT vlid, email, registeredTime, status
FROM vlusers
ORDER BY registeredTime DESC
LIMIT 10;
```

### 场景2：查询广告账户信息

```sql
-- 查询某个客户的所有广告账户
SELECT 
  a.adAccountId,
  a.accountInfo,
  a.accountScore,
  c.customerName
FROM metaadguidance_accounts a
LEFT JOIN customers c ON a.customerId = c.id
WHERE c.customerName LIKE '%某公司%';
```

### 场景3：统计分析

```sql
-- 统计每个状态的用户数量
SELECT status, COUNT(*) as count
FROM vlusers
GROUP BY status
ORDER BY count DESC;
```

### 场景4：数据修复

```sql
-- 修改某个用户的状态
UPDATE vlusers
SET status = 'active'
WHERE vlid = 'VL001';
```

### 场景5：数据清理

```sql
-- 删除测试数据
DELETE FROM vlusers
WHERE vlid LIKE 'TEST%';
```

---

## ❓ 常见问题

### Q1: 为什么我的SQL执行失败？

**可能原因**：
- SQL语法错误
- 表名或字段名错误
- 尝试执行被禁止的DDL操作

**解决方案**：
1. 检查SQL语法是否正确
2. 在"表结构"Tab页确认表名和字段名
3. 如果是DDL操作，请在 `src/db/index.ts` 中修改

---

### Q2: 查询结果太多，如何限制？

**解决方案**：
使用 `LIMIT` 关键字限制返回行数

```sql
SELECT * FROM vlusers LIMIT 50;
```

---

### Q3: 如何导出查询结果？

**操作步骤**：
1. 执行SQL查询
2. 等待查询完成
3. 点击"导出CSV"按钮
4. 选择保存位置

**CSV格式**：
- UTF-8编码
- 包含列标题
- 逗号分隔

---

### Q4: 误删除数据如何恢复？

**恢复方法**：
1. 如果浏览器未关闭，可以刷新页面（localStorage会恢复）
2. 如果已关闭，需要从备份恢复
3. **建议**：执行删除前先备份数据

**备份方法**：
```typescript
// 在浏览器控制台执行
import { exportDB } from '@/db';
const backup = await exportDB();
console.log(backup); // 复制保存
```

---

### Q5: 为什么不能执行DROP TABLE？

**原因**：
DROP TABLE 是危险的DDL操作，会直接删除表结构和所有数据，无法通过页面恢复。

**解决方案**：
如需修改数据库结构，请在 `src/db/index.ts` 的 `createTables()` 函数中修改。

---

## 📞 技术支持

如有问题，请联系：
- 产品团队
- 研发团队

---

## 📚 相关文档

- [PRD文档](./docs/prd/PRD_数据库管理.md)
- [项目总结](./docs/summary/数据库管理_VL-TOOL-001_summary.md)
- [数据库使用规范](./.cursor/rules/database-standards.md)

---

**功能点ID**: VL-TOOL-001  
**最后更新**: 2025-01-15

