# 本地数据库使用规范

> **文档版本**：v1.1  
> **最后更新**：2025-01-15  
> **适用范围**：VisionLine 项目本地数据库操作

---

## 📋 目录

1. [数据库技术栈](#1-数据库技术栈)
2. [数据库结构定义](#2-数据库结构定义)
3. [表命名规范](#3-表命名规范)
4. [表结构定义](#4-表结构定义)
5. [数据库操作规范](#5-数据库操作规范)
6. [Mock 数据集成规范](#6-mock-数据集成规范)
7. [数据初始化规范](#7-数据初始化规范)
8. [数据库工具函数](#8-数据库工具函数)
9. [数据备份与恢复](#9-数据备份与恢复)
10. [注意事项](#10-注意事项)
11. [新增功能时的数据库操作](#11-新增功能时的数据库操作)
12. [禁止事项](#12-禁止事项)
13. [最佳实践](#13-最佳实践)

---

## 1. 数据库技术栈

项目使用 **SQLite (sql.js)** 作为本地数据库解决方案，基于 **localStorage** 作为存储适配器，实现数据的持久化存储。

| 项目 | 内容 |
|------|------|
| **数据库文件位置** | `src/db/index.ts` |
| **存储方式** | 浏览器 localStorage |
| **存储键名** | `vl_project_db` |
| **数据格式** | base64 编码的二进制数据（SQLite 格式）|
| **数据库引擎** | SQLite（通过 sql.js WebAssembly 实现）|

---

## 2. 数据库结构定义

所有功能的数据表结构必须在 SQLite 数据库中定义。数据库使用 SQL 表结构，支持完整的 SQL 查询和操作。

---

## 3. 表命名规范

### 3.1 命名格式

- **表名格式**：使用小写字母，多个单词用下划线分隔
- **命名原则**：
  - 与功能模块名称保持一致
  - 使用复数形式（如 `vlusers`、`metaadguidance_accounts`）
  - 嵌套结构使用下划线分隔（如 `metaadguidance_accounts`）

### 3.2 命名示例

| 表名 | 说明 |
|------|------|
| `vlusers` | VL 用户列表 |
| `metaadguidance_accounts` | Meta 广告指导账户表 |
| `metaadguidance_recommendations` | Meta 广告指导推荐表 |
| `metaadguidance_metrics` | Meta 广告指导指标表 |
| `profiles` | 个人信息表 |

---

## 4. 表结构定义

所有表结构在 `src/db/index.ts` 的 `createTables()` 函数中定义。新增功能时，需要：

1. 在 `createTables()` 函数中添加 `CREATE TABLE` 语句
2. 在 `addData()`、`getAllData()`、`updateData()` 等函数中添加对应的表操作逻辑

---

## 5. 数据库操作规范

### 5.1 添加数据

#### 添加单条数据

```typescript
import { addData } from '@/db';

// 添加数据（注意：所有数据库操作都是异步的）
const newUser = await addData('vlusers', {
  vlid: '12740',
  email: 'test@example.com',
  // ... 其他字段
});
```

#### 批量添加数据

```typescript
import { addBatchData } from '@/db';

// 批量添加
await addBatchData('vlusers', [user1, user2, user3]);
```

### 5.2 删除数据

#### 删除单条数据

```typescript
import { removeData } from '@/db';

// 根据条件删除
await removeData('vlusers', (item) => item.vlid === '12740');
```

#### 批量删除

```typescript
import { removeBatchData } from '@/db';

// 批量删除
await removeBatchData('vlusers', (item) => item.status === 'inactive');
```

### 5.3 查询数据

#### 获取所有数据

```typescript
import { getAllData } from '@/db';

const allUsers = await getAllData<VLUser>('vlusers');
```

#### 条件查询

```typescript
import { findData } from '@/db';

const activeUsers = await findData<VLUser>('vlusers', (item) => item.status === 'active');
```

#### 查询单条数据

```typescript
import { findOneData } from '@/db';

const user = await findOneData<VLUser>('vlusers', (item) => item.vlid === '12740');
```

### 5.4 更新数据

```typescript
import { updateData } from '@/db';

await updateData('vlusers', 
  (item) => item.vlid === '12740',
  (item) => ({ ...item, status: 'active' })
);
```

---

## 6. Mock 数据集成规范

### 6.1 在 Mock 文件中使用数据库

所有 Mock 文件（`mock/*.ts`）应该使用本地数据库存储和操作数据，而不是硬编码的数组。

#### ✅ 推荐做法

```typescript
import { 
  getAllData, 
  addData, 
  removeData, 
  updateData,
  findData 
} from '@/db';

export default {
  'GET /api/vlusers': async (req: any, res: any) => {
    // 从数据库读取数据（注意：所有数据库操作都是异步的）
    let allData = await getAllData('vlusers');
    
    // 应用筛选条件
    if (req.query.vlid) {
      allData = await findData('vlusers', item => 
        item.vlid.includes(req.query.vlid)
      );
    }
    
    // 返回分页结果
    const { pageNum = 1, pageSize = 10 } = req.query;
    const start = (pageNum - 1) * pageSize;
    const list = allData.slice(start, start + pageSize);
    
    res.json({
      code: 200,
      data: { list, total: allData.length }
    });
  },
  
  'POST /api/vlusers': async (req: any, res: any) => {
    // 添加数据到数据库
    const newUser = await addData('vlusers', {
      ...req.body,
      vlid: String(Math.floor(10000 + Math.random() * 90000)),
      createdAt: new Date().toISOString(),
    });
    
    res.json({ code: 200, data: newUser });
  },
  
  'DELETE /api/vlusers/:vlid': async (req: any, res: any) => {
    // 从数据库删除数据
    const deleted = await removeData('vlusers', item => item.vlid === req.params.vlid);
    
    if (deleted) {
      res.json({ code: 200, message: '删除成功' });
    } else {
      res.json({ code: 404, message: '数据不存在' });
    }
  },
};
```

#### ❌ 禁止做法

```typescript
// ❌ 禁止硬编码数据数组
const mockData = [
  { vlid: '12739', ... },
  { vlid: '12731', ... },
];
```

---

## 7. 数据初始化规范

### 7.1 表结构初始化

在 `src/db/index.ts` 的 `defaultData` 中定义所有表的默认结构：

```typescript
const defaultData: DatabaseSchema = {
  vlusers: [],
  metaadguidance: {
    accounts: [],
    recommendations: [],
    metrics: [],
  },
  profiles: [],
  // 新增功能时，在此添加对应的表结构
};
```

### 7.2 初始数据填充

如需预填充初始数据，可在 Mock 文件中使用 `addBatchData` 进行初始化：

```typescript
import { getAllData, addBatchData } from '@/db';

// 检查表是否为空，为空则初始化（注意：所有数据库操作都是异步的）
const initializeData = async () => {
  const existingData = await getAllData('vlusers');
  if (existingData.length === 0) {
    await addBatchData('vlusers', initialData);
  }
};
```

---

## 8. 数据库工具函数

项目提供了以下数据库操作函数（位于 `src/db/index.ts`）：

| 函数名 | 功能 | 使用场景 |
|--------|------|----------|
| `getDB()` | 获取数据库实例 | 需要直接操作数据库时 |
| `getTable()` | 获取指定表 | 需要链式操作时 |
| `addData()` | 添加单条数据 | 创建新记录 |
| `addBatchData()` | 批量添加数据 | 批量导入或初始化 |
| `removeData()` | 删除单条数据 | 删除记录 |
| `removeBatchData()` | 批量删除数据 | 批量删除 |
| `findData()` | 条件查询多条 | 筛选数据 |
| `findOneData()` | 条件查询单条 | 查找详情 |
| `updateData()` | 更新数据 | 修改记录 |
| `getAllData()` | 获取所有数据 | 列表查询 |
| `clearTable()` | 清空表数据 | 重置功能 |
| `createTable()` | 创建新表 | 动态创建表 |
| `hasTable()` | 检查表是否存在 | 表存在性检查 |
| `exportDB()` | 导出数据库 | 数据备份 |
| `importDB()` | 导入数据库 | 数据恢复 |
| `resetDB()` | 重置数据库 | 重置所有数据 |

---

## 9. 数据备份与恢复

### 9.1 导出数据

```typescript
import { exportDB } from '@/db';

const backup = exportDB(); // 返回 JSON 字符串
```

### 9.2 导入数据

```typescript
import { importDB } from '@/db';

try {
  importDB(backupJsonString);
} catch (error) {
  console.error('导入失败', error);
}
```

---

## 10. 注意事项

### 10.1 重要约束

| 项目 | 说明 |
|------|------|
| **数据持久化** | 数据存储在浏览器 localStorage 中（以 base64 编码的二进制格式），清除浏览器数据会导致数据丢失 |
| **数据大小限制** | localStorage 通常有 5-10MB 的限制，注意控制数据量 |
| **异步操作** | ⚠️ **所有数据库操作函数都是异步的**，必须使用 `await` 或 `.then()` 处理 |
| **类型安全** | 使用 TypeScript 泛型确保类型安全 |
| **错误处理** | 所有数据库操作都应该有适当的错误处理（使用 try-catch）|

### 10.2 特性说明

| 特性 | 说明 |
|------|------|
| **数据一致性** | 确保 Mock 文件中的数据操作与数据库操作保持一致 |
| **SQLite 特性** | 支持完整的 SQL 查询，包括 JOIN、GROUP BY、ORDER BY 等复杂操作（可在 `getDB()` 返回的数据库实例上直接执行 SQL）|
| **浏览器兼容性** | sql.js 使用 WebAssembly，需要现代浏览器支持 |

---

## 11. 新增功能时的数据库操作

当创建新功能时，必须：

| 步骤 | 操作内容 |
|------|---------|
| **Step 1** | 创建 SQL 表结构：在 `src/db/index.ts` 的 `createTables()` 函数中添加 `CREATE TABLE` 语句 |
| **Step 2** | 实现表操作函数：在 `addData()`、`getAllData()`、`updateData()`、`removeData()` 等函数中添加新表的操作逻辑 |
| **Step 3** | 在 Mock 文件中使用数据库：使用数据库函数而非硬编码数据（注意使用 `await`）|
| **Step 4** | 初始化数据：如需要，在 Mock 文件中初始化初始数据（使用异步函数）|

---

## 12. 禁止事项

| 禁止项 | 说明 |
|--------|------|
| ❌ **硬编码数据数组** | 禁止在 Mock 文件中使用硬编码数据数组（必须使用数据库）|
| ❌ **直接操作 localStorage** | 禁止直接操作 localStorage（必须通过 `src/db/index.ts` 提供的函数）|
| ❌ **同步调用** | 禁止同步调用数据库函数（所有数据库操作都是异步的，必须使用 `await`）|

---

## 13. 最佳实践

### 13.1 推荐做法（DO ✅）

- ✅ 在 Mock 文件中使用数据库存储和操作数据
- ✅ 新增功能时同步更新数据库表结构
- ✅ 所有数据库操作使用 `await` 进行异步处理
- ✅ 使用 TypeScript 泛型确保类型安全
- ✅ 添加适当的错误处理（try-catch）

### 13.2 禁止做法（DON'T ❌）

- ❌ 不要在 Mock 文件中硬编码数据数组
- ❌ 不要直接操作 localStorage，必须使用数据库工具函数
- ❌ 不要忘记使用 `await` 处理异步操作
- ❌ 不要跳过错误处理

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
