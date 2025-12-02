/**
 * 数据库管理 Mock 数据
 * 功能点ID: VL-TOOL-001
 * 
 * 注意：此Mock文件直接调用前端的数据库函数
 * 在浏览器环境中，数据库是基于localStorage的SQLite实现
 */

import { Request, Response } from 'express';

/**
 * Mock接口实现
 * 
 * 重要说明：
 * 由于Umi的Mock机制在Node.js环境运行，而我们的数据库是基于浏览器的localStorage，
 * 所以这些Mock接口实际上返回的是模拟数据。
 * 
 * 真正的数据库操作需要在前端页面中直接调用 src/db/index.ts 中的函数。
 */

// 模拟的表结构数据（基于真实数据库结构）
const mockTablesData = [
  {
    tableName: 'vlusers',
    columns: [
      { cid: 0, name: 'id', type: 'INTEGER', notNull: false, defaultValue: null, primaryKey: true },
      { cid: 1, name: 'vlid', type: 'TEXT', notNull: true, defaultValue: null, primaryKey: false },
      { cid: 2, name: 'token', type: 'TEXT', notNull: false, defaultValue: null, primaryKey: false },
      { cid: 3, name: 'email', type: 'TEXT', notNull: false, defaultValue: null, primaryKey: false },
      { cid: 4, name: 'status', type: 'TEXT', notNull: false, defaultValue: null, primaryKey: false },
      { cid: 5, name: 'createdAt', type: 'TEXT', notNull: false, defaultValue: "datetime('now')", primaryKey: false },
      { cid: 6, name: 'updatedAt', type: 'TEXT', notNull: false, defaultValue: "datetime('now')", primaryKey: false },
    ],
  },
  {
    tableName: 'customers',
    columns: [
      { cid: 0, name: 'id', type: 'INTEGER', notNull: false, defaultValue: null, primaryKey: true },
      { cid: 1, name: 'customerId', type: 'TEXT', notNull: true, defaultValue: null, primaryKey: false },
      { cid: 2, name: 'customerName', type: 'TEXT', notNull: true, defaultValue: null, primaryKey: false },
      { cid: 3, name: 'settlementEntityId', type: 'INTEGER', notNull: false, defaultValue: null, primaryKey: false },
      { cid: 4, name: 'createdAt', type: 'TEXT', notNull: false, defaultValue: "datetime('now')", primaryKey: false },
    ],
  },
  {
    tableName: 'metaadguidance_accounts',
    columns: [
      { cid: 0, name: 'id', type: 'INTEGER', notNull: false, defaultValue: null, primaryKey: true },
      { cid: 1, name: 'adAccountId', type: 'TEXT', notNull: true, defaultValue: null, primaryKey: false },
      { cid: 2, name: 'customerId', type: 'INTEGER', notNull: false, defaultValue: null, primaryKey: false },
      { cid: 3, name: 'accountScore', type: 'INTEGER', notNull: false, defaultValue: 0, primaryKey: false },
      { cid: 4, name: 'createdAt', type: 'TEXT', notNull: false, defaultValue: "datetime('now')", primaryKey: false },
    ],
  },
];

// 模拟的表关系数据
const mockRelationshipsData = [
  {
    childTable: 'customers',
    childColumn: 'settlementEntityId',
    parentTable: 'settlement_entities',
    parentColumn: 'id',
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    childTable: 'metaadguidance_accounts',
    childColumn: 'customerId',
    parentTable: 'customers',
    parentColumn: 'id',
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  },
  {
    childTable: 'metaadguidance_recommendations',
    childColumn: 'adAccountId',
    parentTable: 'metaadguidance_accounts',
    parentColumn: 'adAccountId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  },
];

export default {
  /**
   * 获取所有表结构
   * 
   * 注意：此接口返回模拟数据
   * 前端页面应该直接调用 src/db/index.ts 中的函数获取真实数据
   */
  'GET /api/database/tables': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({ 
        success: true, 
        data: mockTablesData,
        message: '这是Mock数据，建议前端直接调用数据库函数获取真实数据'
      });
    }, 300); // 模拟网络延迟
  },

  /**
   * 获取表关系（外键）
   * 
   * 注意：此接口返回模拟数据
   * 前端页面应该直接调用 src/db/index.ts 中的函数获取真实数据
   */
  'GET /api/database/relationships': (req: Request, res: Response) => {
    setTimeout(() => {
      res.json({ 
        success: true, 
        data: mockRelationshipsData,
        message: '这是Mock数据，建议前端直接调用数据库函数获取真实数据'
      });
    }, 300);
  },

  /**
   * 执行SQL查询
   * 
   * 注意：此接口不支持真实的SQL执行
   * 前端页面应该直接调用 src/db/index.ts 中的 executeSQLQuery 函数
   */
  'POST /api/database/execute': (req: Request, res: Response) => {
    const { sql, confirm } = req.body;

    if (!sql || typeof sql !== 'string') {
      return res.status(400).json({ success: false, error: 'SQL语句不能为空' });
    }

    const trimmedSQL = sql.trim();
    if (!trimmedSQL) {
      return res.status(400).json({ success: false, error: 'SQL语句不能为空' });
    }

    // 检查是否为修改操作
    const modifyKeywords = ['UPDATE', 'DELETE', 'INSERT'];
    const sqlUpper = trimmedSQL.toUpperCase();
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
        message: '此操作将修改数据库数据，请确认是否继续？',
        data: null,
      });
    }

    // 返回模拟的查询结果
    setTimeout(() => {
      res.json({ 
        success: true, 
        data: {
          columns: ['id', 'name'],
          values: [[1, 'test']],
          rowCount: 1,
          executionTime: 10,
          isModifyOperation,
        },
        message: '这是Mock数据，建议前端直接调用 executeSQLQuery 函数执行真实SQL'
      });
    }, 500);
  },
};

