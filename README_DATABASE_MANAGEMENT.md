# 数据库管理功能 - 完整指南

> **功能点ID**: VL-TOOL-001  
> **版本**: v1.1  
> **状态**: ✅ 已修复，可正常使用  
> **最后更新**: 2025-01-15

---

## 📌 重要提示

**已修复的问题**:
1. ✅ 工具类菜单中已添加"数据库管理"菜单项
2. ✅ 点击"刷新"按钮不再报错
3. ✅ 能正常加载本地数据库的表结构和表关系
4. ✅ 能正常执行SQL查询

**关键修改**:
- 前端页面现在**直接调用**本地数据库函数（`src/db/index.ts`）
- 不再通过Mock API间接调用（避免Node.js环境无法访问浏览器localStorage的问题）

---

## 🚀 快速开始

### 1. 重启开发服务器（必须！）

```bash
# 停止当前服务器（按 Ctrl+C）
# 重新启动
npm start
```

### 2. 访问数据库管理页面

**方式1**: 通过菜单
- 打开 `http://localhost:8000`
- 点击左侧菜单"工具类"
- 点击"数据库管理"

**方式2**: 直接访问
- URL: `http://localhost:8000/tools/database`

### 3. 验证功能

#### 测试1: 表结构（30秒）
1. 点击"刷新"按钮
2. 应该看到："成功加载 X 个表的结构"
3. 展开任意表查看字段详情

#### 测试2: SQL查询（1分钟）
1. 切换到"SQL查询"Tab
2. 输入并执行:
```sql
SELECT * FROM sqlite_master WHERE type='table';
```
3. 应该返回所有表的列表

---

## 📚 完整文档

本功能提供以下完整文档：

### 1. 快速上手指南

**文件**: `QUICKSTART_DATABASE.md`

**内容**:
- 功能概述
- 详细使用说明
- 示例SQL查询
- 常见问题解答

**适合**: 新用户快速了解功能

---

### 2. 修复总结文档

**文件**: `DATABASE_FIX_SUMMARY.md`

**内容**:
- 修复的问题描述
- 技术架构变更说明
- 修改的文件列表
- Git提交记录

**适合**: 了解修复过程和技术细节

---

### 3. 故障排查指南

**文件**: `TROUBLESHOOTING_DATABASE.md`

**内容**:
- 常见问题和解决方案
- 调试技巧
- 错误代码说明
- 故障恢复流程

**适合**: 遇到问题时查阅

---

### 4. 测试指南

**文件**: `TEST_DATABASE.md`

**内容**:
- 5分钟快速测试流程
- 详细测试用例
- 浏览器控制台调试方法
- 性能测试标准

**适合**: 测试功能是否正常

---

### 5. PRD产品文档

**文件**: `docs/prd/PRD_数据库管理.md`

**内容**:
- 完整的产品需求文档
- 功能设计说明
- 验收标准
- 技术实现

**适合**: 了解产品设计和需求

---

## 🎯 核心功能

### 1. 表结构查看

**功能**:
- 查看数据库中所有表的列表
- 展开查看每个表的字段详情
- 显示字段类型、约束、默认值
- 识别主键和外键

**操作**:
1. 进入"表结构"Tab
2. 点击"刷新"加载最新数据
3. 点击表名展开查看详情
4. 使用搜索框快速定位表

---

### 2. 表关系查看

**功能**:
- 查看所有外键关系
- 显示子表和父表的关联
- 显示级联删除/更新规则
- 支持按表名筛选

**级联规则说明**:
- **CASCADE** (红色): 删除父表记录时，自动删除子表关联记录
- **SET NULL** (橙色): 删除父表记录时，子表外键设置为NULL
- **RESTRICT** (紫色): 如果存在子表记录，禁止删除父表记录
- **NO ACTION** (灰色): 不执行任何操作

---

### 3. SQL查询

**功能**:
- 执行自定义SQL查询
- 查询结果表格展示
- 显示执行时间和返回行数
- 支持导出CSV

**支持的SQL类型**:
- ✅ SELECT查询（直接执行）
- ⚠️ UPDATE/DELETE/INSERT（需二次确认）
- ❌ DROP/ALTER（禁止执行）

**示例SQL**:

```sql
-- 查询所有表
SELECT * FROM sqlite_master WHERE type='table';

-- 查询用户数据
SELECT * FROM vlusers LIMIT 10;

-- 统计分析
SELECT status, COUNT(*) as count 
FROM vlusers 
GROUP BY status;

-- 联表查询
SELECT 
  c.customerName,
  a.adAccountId,
  a.accountScore
FROM customers c
LEFT JOIN metaadguidance_accounts a ON a.customerId = c.id
LIMIT 10;
```

---

## 🔧 技术架构

### 为什么要直接调用数据库函数？

**原架构问题** ❌:
```
前端页面(浏览器) → API请求 → Mock服务器(Node.js) → 数据库函数(浏览器localStorage)
                                        ↑
                                        └─ 无法访问浏览器的localStorage
```

**新架构优势** ✅:
```
前端页面(浏览器) → 直接调用 → 数据库函数(浏览器localStorage)
                                    ↓
                              访问localStorage成功
```

### 技术优势

| 优势 | 说明 |
|-----|------|
| **环境一致** | 前端和数据库都在浏览器环境，无障碍访问 |
| **性能更好** | 无网络请求，直接调用，速度快 |
| **更可靠** | 减少中间层，减少故障点 |
| **实时数据** | 直接访问本地数据库，无缓存问题 |

### 数据存储

- **存储位置**: 浏览器 `localStorage`
- **键名**: `vl_project_db`
- **格式**: Base64编码的SQLite数据库文件
- **引擎**: sql.js (SQLite的JavaScript实现)

---

## 💡 使用技巧

### 技巧1: 初始化测试数据

如果数据库是空的，先访问其他功能页面初始化数据：

1. **VL用户数据**: 访问 `/vluser/list`
2. **Meta广告数据**: 访问 `/metaadguidance/list`
3. **其他数据**: 访问对应的列表页面

然后再回到数据库管理页面查询数据。

---

### 技巧2: 使用LIMIT限制结果

```sql
-- ❌ 不推荐：可能返回大量数据
SELECT * FROM vlusers;

-- ✅ 推荐：限制返回数量
SELECT * FROM vlusers LIMIT 100;
```

---

### 技巧3: 使用WHERE过滤数据

```sql
-- 查询特定状态的用户
SELECT * FROM vlusers WHERE status = 'active';

-- 查询特定时间范围
SELECT * FROM vlusers 
WHERE createdAt >= '2025-01-01' 
LIMIT 50;
```

---

### 技巧4: 联表查询获取关联数据

```sql
-- 查询客户及其广告账户
SELECT 
  c.customerName,
  c.customerId,
  a.adAccountId,
  a.accountScore
FROM customers c
LEFT JOIN metaadguidance_accounts a ON a.customerId = c.id
WHERE c.customerName LIKE '%测试%'
LIMIT 20;
```

---

## 🛡️ 安全特性

### 1. 修改操作二次确认

UPDATE/DELETE/INSERT操作会弹出确认对话框：
- 显示即将执行的SQL语句
- 警告提示操作风险
- 用户必须确认才能执行

### 2. 禁止危险DDL操作

以下操作被完全禁止：
- `DROP TABLE` - 删除表
- `ALTER TABLE` - 修改表结构
- `TRUNCATE TABLE` - 清空表

如需修改表结构，请在 `src/db/index.ts` 中的 `createTables()` 函数中修改。

### 3. 查询结果限制

- 单次查询最多返回1000条数据（防止内存溢出）
- 建议使用LIMIT限制结果集大小

---

## ❓ 常见问题

### Q1: 点击刷新还是提示"获取表结构失败"？

**解决方案**:

1. **重启开发服务器**（最重要！）
```bash
# 停止服务器: Ctrl+C
# 重新启动: npm start
```

2. **清除浏览器缓存**
```javascript
// 在浏览器控制台（F12）执行
localStorage.clear();
sessionStorage.clear();
location.reload();
```

3. **查看控制台错误信息**
- 按F12打开控制台
- 查看Console标签的错误信息
- 根据错误信息排查

---

### Q2: 数据库中没有数据？

**原因**: 数据库尚未初始化

**解决方案**:
1. 访问其他功能页面（如 `/vluser/list`）初始化测试数据
2. 或手动执行INSERT语句插入数据

---

### Q3: SQL执行失败？

**常见原因**:
1. SQL语法错误
2. 表名或字段名不存在
3. 尝试执行被禁止的DDL操作

**解决方法**:
1. 在"表结构"Tab页确认表名和字段名
2. 检查SQL语法
3. 查看控制台的详细错误信息

---

### Q4: 如何备份数据库？

```javascript
// 在浏览器控制台执行
const dbData = localStorage.getItem('vl_project_db');
console.log('数据库大小:', Math.round(dbData.length / 1024), 'KB');

// 复制到剪贴板
navigator.clipboard.writeText(dbData);
console.log('数据库已复制到剪贴板');
```

---

### Q5: 如何恢复数据库？

```javascript
// 粘贴备份数据
const backupData = '...'; // 这里粘贴之前复制的数据

// 恢复数据库
localStorage.setItem('vl_project_db', backupData);
location.reload();
```

---

## 📊 性能基准

| 操作 | 预期时间 |
|-----|---------|
| 表结构加载 | < 2秒 |
| 表关系加载 | < 1秒 |
| 简单SELECT查询 | < 100ms |
| 复杂联表查询 | < 1秒 |
| CSV导出 | < 2秒 |

---

## 🔗 相关链接

### 内部文档

- [快速上手指南](./QUICKSTART_DATABASE.md)
- [修复总结文档](./DATABASE_FIX_SUMMARY.md)
- [故障排查指南](./TROUBLESHOOTING_DATABASE.md)
- [测试指南](./TEST_DATABASE.md)
- [PRD产品文档](./docs/prd/PRD_数据库管理.md)
- [项目总结](./docs/summary/数据库管理_VL-TOOL-001_summary.md)

### 外部资源

- [SQLite官方文档](https://www.sqlite.org/docs.html)
- [sql.js项目](https://sql.js.org/)
- [SQL教程](https://www.runoob.com/sql/sql-tutorial.html)

---

## 📝 Git提交记录

| Commit | 说明 | 时间 |
|--------|------|------|
| `7a4a396` | 初始创建数据库管理功能 | 2025-01-15 |
| `df6d43c` | 添加数据库管理菜单项 | 2025-01-15 |
| `b7c6416` | 尝试修复Mock接口导入问题 | 2025-01-15 |
| `11d8f1a` | 添加故障排查指南 | 2025-01-15 |
| `b8687b3` | **修改为直接调用数据库函数（最终修复）** | 2025-01-15 |
| `98c15bd` | 添加修复总结文档 | 2025-01-15 |
| `02637a4` | 添加测试指南 | 2025-01-15 |

---

## 🎉 总结

### 当前状态

✅ **已修复，可正常使用**

### 核心改进

1. ✅ 前端直接调用本地数据库函数
2. ✅ 无需通过Mock API间接调用
3. ✅ 性能更好，速度更快
4. ✅ 更可靠，无环境问题

### 使用建议

1. **重启服务器**：修复后必须重启开发服务器
2. **初始化数据**：先访问其他页面初始化测试数据
3. **谨慎操作**：修改操作会真实更新数据库
4. **定期备份**：重要操作前备份数据库

---

## 🆘 获取帮助

如果遇到问题：

1. **查看故障排查指南**: `TROUBLESHOOTING_DATABASE.md`
2. **查看测试指南**: `TEST_DATABASE.md`
3. **查看浏览器控制台**: 按F12查看错误信息
4. **联系技术支持**: 提供错误截图和控制台日志

---

**功能状态**: ✅ 已修复，正常使用  
**功能点ID**: VL-TOOL-001  
**最后更新**: 2025-01-15

**祝使用愉快！🎉**

