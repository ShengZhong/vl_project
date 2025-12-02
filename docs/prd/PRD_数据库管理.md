# PRD - 数据库管理

> **功能点ID**: VL-TOOL-001  
> **文档版本**: v1.0  
> **创建日期**: 2025-01-15  
> **最后更新**: 2025-01-15  
> **功能状态**: 开发中

---

## 📋 目录

1. [功能概述](#1-功能概述)
2. [背景与目标](#2-背景与目标)
3. [用户故事](#3-用户故事)
4. [功能需求](#4-功能需求)
5. [数据模型](#5-数据模型)
6. [交互流程](#6-交互流程)
7. [UI设计](#7-ui设计)
8. [技术实现](#8-技术实现)
9. [验收标准](#9-验收标准)
10. [变更记录](#10-变更记录)

---

## 1. 功能概述

**功能名称**: 数据库管理（Database Management）

**功能描述**: 为管理员和研发人员提供可视化的数据库管理工具，支持查看数据库表结构、表关系、执行自定义SQL查询，便于数据库维护和调试。

**所属模块**: 工具类（Tools）

**用户角色**: 管理员、研发人员

---

## 2. 背景与目标

### 2.1 背景（Why）

当前系统使用本地SQLite数据库（通过sql.js实现），随着功能增多，数据库表结构越来越复杂。研发人员和管理员需要：
- 快速了解数据库表结构
- 查看表之间的关联关系
- 执行自定义SQL进行数据查询和分析
- 验证数据完整性

但目前缺少可视化的数据库管理工具，只能通过代码或浏览器控制台操作，效率低且容易出错。

### 2.2 目标（Goal）

| 目标类型 | 目标描述 |
|---------|---------|
| **业务目标** | 提供可视化数据库管理工具，提升研发效率 |
| **用户目标** | 方便地查看数据库结构、执行SQL查询 |
| **技术目标** | 封装数据库元数据查询接口，支持SQL执行 |

### 2.3 成功指标

- 管理员能在2分钟内查看所有表结构
- 研发人员能快速执行SQL查询，验证数据
- 降低数据库调试时间50%以上

---

## 3. 用户故事

### 用户故事 1：查看表结构

**作为** 研发人员  
**我想要** 查看数据库中所有表的结构（字段、类型、约束）  
**以便于** 了解数据模型，编写正确的SQL查询

**验收标准**：
- 能看到所有表的列表
- 点击表名可查看详细的字段信息（字段名、类型、是否必填、默认值等）
- 能看到主键和外键约束

### 用户故事 2：查看表关系

**作为** 管理员  
**我想要** 查看表之间的关联关系（外键）  
**以便于** 理解数据的关联结构，避免误操作导致数据不一致

**验收标准**：
- 能看到所有表的外键关系列表
- 能看到级联删除规则
- 能通过可视化方式展示表关系

### 用户故事 3：执行SQL查询

**作为** 管理员/研发人员  
**我想要** 通过页面输入自定义SQL查询数据  
**以便于** 快速验证数据、分析问题、生成报表

**验收标准**：
- 能输入自定义SQL语句
- 能执行SELECT查询并显示结果
- 能显示查询执行时间和返回行数
- 能导出查询结果（CSV格式）
- 对于危险操作（DELETE/UPDATE）需要二次确认

---

## 4. 功能需求

### 4.1 核心功能

| 功能模块 | 功能说明 | 优先级 |
|---------|---------|--------|
| **表结构查看** | 查看所有表的字段、类型、约束 | P0 |
| **表关系查看** | 查看外键关系和级联规则 | P0 |
| **SQL查询** | 执行自定义SQL查询 | P0 |
| **查询结果导出** | 导出查询结果为CSV | P1 |
| **查询历史** | 保存查询历史记录 | P2（后续版本）|

### 4.2 功能详细说明

#### 4.2.1 表结构查看

**功能描述**：显示数据库中所有表的列表和详细结构

**展示内容**：
- 表名称
- 表中文说明（如果有）
- 字段列表：
  - 字段名（Field Name）
  - 字段类型（Type）：TEXT/INTEGER/REAL
  - 是否必填（Not Null）
  - 是否主键（Primary Key）
  - 默认值（Default）
  - 外键关系（Foreign Key）

**交互方式**：
- 默认显示所有表的折叠列表
- 点击表名展开/折叠表结构
- 支持搜索表名
- 支持复制表结构（SQL DDL）

#### 4.2.2 表关系查看

**功能描述**：可视化展示表之间的外键关系

**展示内容**：
- 关系列表（表格形式）：
  - 子表（Child Table）
  - 子表字段（Child Column）
  - 父表（Parent Table）
  - 父表字段（Parent Column）
  - 级联规则（On Delete/On Update）

**交互方式**：
- 表格形式展示所有外键关系
- 支持按表名筛选
- 支持复制关系信息

#### 4.2.3 SQL查询

**功能描述**：提供SQL查询编辑器，执行自定义SQL

**功能特性**：
- SQL编辑器（支持语法高亮）
- 执行按钮
- 查询结果展示（表格形式）
- 查询统计：执行时间、返回行数
- 错误提示

**支持的SQL类型**：
- ✅ SELECT查询（默认支持）
- ⚠️ UPDATE/DELETE/INSERT（需二次确认）
- ❌ DROP/ALTER（禁止执行，需通过代码）

**安全限制**：
- UPDATE/DELETE/INSERT操作需弹框二次确认
- 禁止执行DROP TABLE、ALTER TABLE等DDL语句
- 查询结果最多返回1000条（防止内存溢出）

#### 4.2.4 查询结果导出

**功能描述**：将查询结果导出为CSV文件

**导出格式**：
- CSV（逗号分隔值）
- 包含列标题
- UTF-8编码

---

## 5. 数据模型

### 5.1 特殊说明

本功能**不创建新的业务数据表**，而是查询和操作现有数据库的元数据。

### 5.2 数据库工具函数扩展

需要在 `src/db/index.ts` 中添加以下工具函数：

#### 5.2.1 获取所有表名

```typescript
/**
 * 获取数据库中所有表名
 * @returns 表名列表
 */
export const getAllTables = async (): Promise<string[]> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const result = db.exec(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `);

  if (result.length === 0) return [];
  return result[0].values.map(row => row[0] as string);
};
```

#### 5.2.2 获取表结构

```typescript
/**
 * 获取指定表的结构信息
 * @param tableName 表名
 * @returns 表结构信息
 */
export const getTableSchema = async (tableName: string): Promise<TableColumn[]> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const result = db.exec(`PRAGMA table_info(${tableName})`);
  
  if (result.length === 0) return [];
  
  return result[0].values.map(row => ({
    cid: row[0] as number,
    name: row[1] as string,
    type: row[2] as string,
    notNull: row[3] === 1,
    defaultValue: row[4],
    primaryKey: row[5] === 1,
  }));
};
```

#### 5.2.3 获取表关系（外键）

```typescript
/**
 * 获取数据库中所有外键关系
 * @returns 外键关系列表
 */
export const getTableRelationships = async (): Promise<ForeignKeyInfo[]> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const tables = await getAllTables();
  const relationships: ForeignKeyInfo[] = [];

  for (const table of tables) {
    const result = db.exec(`PRAGMA foreign_key_list(${table})`);
    
    if (result.length > 0) {
      result[0].values.forEach(row => {
        relationships.push({
          childTable: table,
          childColumn: row[3] as string,
          parentTable: row[2] as string,
          parentColumn: row[4] as string,
          onDelete: row[6] as string,
          onUpdate: row[5] as string,
        });
      });
    }
  }

  return relationships;
};
```

#### 5.2.4 执行自定义SQL

```typescript
/**
 * 执行自定义SQL查询
 * @param sql SQL语句
 * @returns 查询结果
 */
export const executeSQL = async (sql: string): Promise<SQLQueryResult> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const startTime = Date.now();
  
  try {
    // 检查危险操作
    const dangerousKeywords = ['DROP', 'ALTER', 'TRUNCATE'];
    const sqlUpper = sql.trim().toUpperCase();
    
    for (const keyword of dangerousKeywords) {
      if (sqlUpper.startsWith(keyword)) {
        throw new Error(`禁止执行 ${keyword} 操作，请通过代码修改数据库结构`);
      }
    }

    // 检查修改操作（需要特别提示）
    const modifyKeywords = ['UPDATE', 'DELETE', 'INSERT'];
    let isModifyOperation = false;
    for (const keyword of modifyKeywords) {
      if (sqlUpper.startsWith(keyword)) {
        isModifyOperation = true;
        break;
      }
    }

    const result = db.exec(sql);
    const executionTime = Date.now() - startTime;

    // 如果是修改操作，保存数据库
    if (isModifyOperation) {
      saveDatabase();
    }

    if (result.length === 0) {
      return {
        columns: [],
        values: [],
        rowCount: 0,
        executionTime,
        isModifyOperation,
      };
    }

    return {
      columns: result[0].columns,
      values: result[0].values,
      rowCount: result[0].values.length,
      executionTime,
      isModifyOperation,
    };
  } catch (error: any) {
    throw new Error(`SQL执行失败: ${error.message}`);
  }
};
```

### 5.3 TypeScript 类型定义

**文件路径**: `src/types/database.ts`

```typescript
/**
 * 表字段信息
 */
export interface TableColumn {
  cid: number;           // 列ID
  name: string;          // 字段名
  type: string;          // 字段类型
  notNull: boolean;      // 是否必填
  defaultValue: any;     // 默认值
  primaryKey: boolean;   // 是否主键
}

/**
 * 表结构信息
 */
export interface TableInfo {
  tableName: string;     // 表名
  columns: TableColumn[]; // 字段列表
}

/**
 * 外键关系信息
 */
export interface ForeignKeyInfo {
  childTable: string;    // 子表
  childColumn: string;   // 子表字段
  parentTable: string;   // 父表
  parentColumn: string;  // 父表字段
  onDelete: string;      // 删除规则
  onUpdate: string;      // 更新规则
}

/**
 * SQL查询结果
 */
export interface SQLQueryResult {
  columns: string[];     // 列名列表
  values: any[][];       // 数据行
  rowCount: number;      // 返回行数
  executionTime: number; // 执行时间（毫秒）
  isModifyOperation: boolean; // 是否为修改操作
}

/**
 * 数据库管理API请求参数
 */
export interface ExecuteSQLParams {
  sql: string;           // SQL语句
  confirm?: boolean;     // 是否已确认（用于危险操作）
}

/**
 * 数据库管理API响应
 */
export interface ExecuteSQLResponse {
  success: boolean;
  data?: SQLQueryResult;
  error?: string;
}
```

---

## 6. 交互流程

### 6.1 查看表结构流程

```
用户进入数据库管理页面
    ↓
默认显示"表结构"Tab页
    ↓
系统加载所有表的列表
    ↓
用户点击某个表名
    ↓
展开显示该表的字段信息（字段名、类型、约束等）
    ↓
用户可复制表结构SQL（可选）
```

### 6.2 查看表关系流程

```
用户点击"表关系"Tab页
    ↓
系统加载所有外键关系
    ↓
以表格形式展示：
  - 子表 → 父表
  - 字段关联
  - 级联规则
    ↓
用户可按表名筛选（可选）
```

### 6.3 执行SQL查询流程

```
用户点击"SQL查询"Tab页
    ↓
在编辑器中输入SQL语句
    ↓
点击"执行"按钮
    ↓
系统检查SQL类型
    ├─ SELECT查询 → 直接执行 → 显示结果
    ├─ UPDATE/DELETE/INSERT → 弹框二次确认
    │   ├─ 用户确认 → 执行 → 显示结果
    │   └─ 用户取消 → 不执行
    └─ DROP/ALTER → 提示禁止 → 不执行
    ↓
显示查询结果（表格）
显示统计信息（执行时间、行数）
    ↓
用户可导出结果为CSV（可选）
```

---

## 7. UI设计

### 7.1 页面布局

```
┌─────────────────────────────────────────┐
│  数据库管理                              │
├─────────────────────────────────────────┤
│  [表结构] [表关系] [SQL查询]            │
├─────────────────────────────────────────┤
│                                         │
│  Tab1: 表结构                            │
│  ┌─────────────────────────────────┐   │
│  │ 搜索表名: [_________] [搜索]    │   │
│  ├─────────────────────────────────┤   │
│  │ > vlusers (VL用户表)            │   │
│  │ > customers (客户信息表)        │   │
│  │ v metaadguidance_accounts       │   │
│  │   ├─ id (INTEGER, PK)           │   │
│  │   ├─ adAccountId (TEXT, UNIQUE) │   │
│  │   ├─ customerId (INTEGER, FK)   │   │
│  │   └─ ...                        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 7.2 表关系Tab页

```
┌─────────────────────────────────────────┐
│  外键关系列表                            │
├────────┬──────┬────────┬──────┬────────┤
│ 子表   │ 字段 │ 父表   │ 字段 │ 删除规则│
├────────┼──────┼────────┼──────┼────────┤
│ customers │ settlementEntityId │ settlement_entities │ id │ SET NULL │
│ personnel │ customerId │ customers │ id │ CASCADE │
│ metaadguidance_accounts │ customerId │ customers │ id │ SET NULL │
│ ...     │ ...  │ ...    │ ...  │ ...    │
└────────┴──────┴────────┴──────┴────────┘
```

### 7.3 SQL查询Tab页

```
┌─────────────────────────────────────────┐
│  SQL查询编辑器                           │
├─────────────────────────────────────────┤
│  1  SELECT * FROM vlusers               │
│  2  WHERE status = 'active'             │
│  3  LIMIT 10;                           │
│  ...                                    │
├─────────────────────────────────────────┤
│  [执行] [清空] [导出CSV]                 │
├─────────────────────────────────────────┤
│  查询结果 (返回 10 行, 耗时 15ms)        │
│  ┌───┬──────┬────────┬────────┐        │
│  │id │ vlid │ email  │ status │        │
│  ├───┼──────┼────────┼────────┤        │
│  │ 1 │ VL001│ a@b.com│ active │        │
│  │ 2 │ VL002│ c@d.com│ active │        │
│  │...│ ...  │ ...    │ ...    │        │
│  └───┴──────┴────────┴────────┘        │
└─────────────────────────────────────────┘
```

### 7.4 危险操作确认弹框

```
┌──────────────────────────────┐
│  ⚠️  确认执行修改操作         │
├──────────────────────────────┤
│  您即将执行以下SQL语句：      │
│                               │
│  UPDATE vlusers               │
│  SET status = 'inactive'      │
│  WHERE vlid = 'VL001'         │
│                               │
│  此操作将修改数据库数据，      │
│  请确认是否继续？              │
│                               │
│  [取消]  [确认执行]            │
└──────────────────────────────┘
```

---

## 8. 技术实现

### 8.1 技术栈

| 技术项 | 技术选型 |
|-------|---------|
| **前端框架** | React + Umi |
| **UI组件库** | Ant Design v4 |
| **状态管理** | React Hooks (useState, useEffect) |
| **数据库** | SQLite (sql.js) |
| **代码编辑器** | Ant Design TextArea (暂不引入第三方编辑器)|

### 8.2 核心组件

| 组件名称 | 文件路径 | 说明 |
|---------|---------|------|
| **数据库管理主页** | `src/pages/tools/database/index.tsx` | 主页面容器 |
| **表结构组件** | `src/pages/tools/database/TableSchema.tsx` | 表结构展示 |
| **表关系组件** | `src/pages/tools/database/TableRelations.tsx` | 外键关系展示 |
| **SQL查询组件** | `src/pages/tools/database/SQLQuery.tsx` | SQL编辑器和查询 |
| **数据库服务** | `src/services/database.ts` | API服务层 |
| **类型定义** | `src/types/database.ts` | TypeScript类型 |
| **Mock文件** | `mock/database.ts` | Mock数据（直接调用db函数）|

### 8.3 关键实现

#### 8.3.1 数据库工具函数

在 `src/db/index.ts` 中添加：
- `getAllTables()` - 获取所有表名
- `getTableSchema(tableName)` - 获取表结构
- `getTableRelationships()` - 获取外键关系
- `executeSQL(sql)` - 执行SQL查询

#### 8.3.2 API接口

**文件**: `src/services/database.ts`

```typescript
import request from '@/utils/request';
import type { TableInfo, ForeignKeyInfo, ExecuteSQLParams, SQLQueryResult } from '@/types/database';

/**
 * 获取所有表的结构信息
 */
export async function getTables(): Promise<TableInfo[]> {
  return request('/api/database/tables');
}

/**
 * 获取表关系（外键）
 */
export async function getRelationships(): Promise<ForeignKeyInfo[]> {
  return request('/api/database/relationships');
}

/**
 * 执行SQL查询
 */
export async function executeSQL(params: ExecuteSQLParams): Promise<SQLQueryResult> {
  return request('/api/database/execute', {
    method: 'POST',
    data: params,
  });
}
```

#### 8.3.3 Mock实现

**文件**: `mock/database.ts`

```typescript
import { Request, Response } from 'express';
import { 
  getAllTables, 
  getTableSchema, 
  getTableRelationships, 
  executeSQL 
} from '../src/db';

export default {
  'GET /api/database/tables': async (req: Request, res: Response) => {
    try {
      const tables = await getAllTables();
      const result = [];

      for (const tableName of tables) {
        const columns = await getTableSchema(tableName);
        result.push({
          tableName,
          columns,
        });
      }

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  'GET /api/database/relationships': async (req: Request, res: Response) => {
    try {
      const relationships = await getTableRelationships();
      res.json({ success: true, data: relationships });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  'POST /api/database/execute': async (req: Request, res: Response) => {
    try {
      const { sql, confirm } = req.body;

      if (!sql) {
        return res.status(400).json({ success: false, error: 'SQL语句不能为空' });
      }

      // 检查是否为修改操作
      const modifyKeywords = ['UPDATE', 'DELETE', 'INSERT'];
      const sqlUpper = sql.trim().toUpperCase();
      let isModifyOperation = false;
      
      for (const keyword of modifyKeywords) {
        if (sqlUpper.startsWith(keyword)) {
          isModifyOperation = true;
          break;
        }
      }

      // 如果是修改操作且未确认，返回需要确认的提示
      if (isModifyOperation && !confirm) {
        return res.json({ 
          success: false, 
          needConfirm: true,
          message: '此操作将修改数据库数据，请确认是否继续？' 
        });
      }

      const result = await executeSQL(sql);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
```

### 8.4 前端实现要点

#### 8.4.1 表结构展示

- 使用 Ant Design 的 `Collapse` 组件展示表列表
- 每个表的字段使用 `Table` 组件展示
- 支持搜索表名（使用 `Input.Search`）
- 外键字段高亮显示

#### 8.4.2 表关系展示

- 使用 Ant Design 的 `Table` 组件展示外键关系
- 支持按表名筛选
- 级联规则用 `Tag` 组件标识不同颜色

#### 8.4.3 SQL查询

- 使用 `Input.TextArea` 作为SQL编辑器
- 执行按钮带 Loading 状态
- 查询结果使用 `Table` 组件展示
- 显示执行时间和行数统计
- 修改操作（UPDATE/DELETE/INSERT）需二次确认（使用 `Modal.confirm`）

#### 8.4.4 导出CSV

```typescript
const exportToCSV = (columns: string[], values: any[][]) => {
  const csvContent = [
    columns.join(','), // 表头
    ...values.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') 
        ? `"${cell}"` 
        : cell
    ).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `query_result_${Date.now()}.csv`;
  link.click();
};
```

---

## 9. 验收标准

### 9.1 功能验收

| 验收项 | 验收标准 | 优先级 |
|-------|---------|--------|
| **表结构查看** | ✅ 能看到所有表的列表<br>✅ 能展开查看每个表的字段、类型、约束<br>✅ 外键字段有明确标识 | P0 |
| **表关系查看** | ✅ 能看到所有外键关系<br>✅ 能看到级联删除规则<br>✅ 支持按表名筛选 | P0 |
| **SQL查询** | ✅ 能输入并执行SELECT查询<br>✅ 查询结果正确显示<br>✅ 显示执行时间和行数<br>✅ UPDATE/DELETE操作有二次确认<br>✅ DROP/ALTER操作被禁止 | P0 |
| **查询结果导出** | ✅ 能导出查询结果为CSV文件<br>✅ CSV格式正确（UTF-8，包含表头）| P1 |

### 9.2 性能验收

| 性能指标 | 目标值 |
|---------|-------|
| **表结构加载** | < 2秒 |
| **表关系加载** | < 1秒 |
| **SQL查询执行** | < 3秒（查询1000条以内）|

### 9.3 安全验收

| 安全项 | 验收标准 |
|-------|---------|
| **SQL注入防护** | ✅ 禁止执行DROP/ALTER等危险操作 |
| **数据保护** | ✅ UPDATE/DELETE需二次确认 |
| **权限控制** | ✅ 仅管理员可访问（通过路由权限控制）|

### 9.4 UI/UX验收

| UI/UX项 | 验收标准 |
|---------|---------|
| **页面响应** | ✅ 所有操作有Loading状态<br>✅ 错误提示清晰友好 |
| **数据展示** | ✅ 表格布局合理，信息易读<br>✅ 支持表格排序和分页 |
| **交互反馈** | ✅ 操作成功/失败有明确提示<br>✅ 危险操作有二次确认 |

---

## 10. 变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|-----|------|---------|--------|
| v1.0 | 2025-01-15 | 初始版本，定义核心功能 | AI Assistant |

---

## 附录

### A. 相关文件路径

| 类型 | 文件路径 |
|-----|---------|
| **PRD文档** | `docs/prd/PRD_数据库管理.md` |
| **前端页面** | `src/pages/tools/database/index.tsx` |
| **服务层** | `src/services/database.ts` |
| **类型定义** | `src/types/database.ts` |
| **Mock文件** | `mock/database.ts` |
| **数据库工具** | `src/db/index.ts` |

### B. 参考资料

- SQLite PRAGMA命令文档：https://www.sqlite.org/pragma.html
- sql.js使用文档：https://sql.js.org/documentation/
- Ant Design Table组件：https://ant.design/components/table/

---

**文档状态**: ✅ 已完成  
**功能点ID**: VL-TOOL-001  
**最后更新**: 2025-01-15

