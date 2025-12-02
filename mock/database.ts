/**
 * 数据库管理 Mock 数据
 * 功能点ID: VL-TOOL-001
 */

import { Request, Response } from 'express';
import { 
  getAllTableNames, 
  getTableStructure, 
  getAllTableRelationships, 
  executeSQLQuery 
} from '../src/db';

export default {
  /**
   * 获取所有表结构
   */
  'GET /api/database/tables': async (req: Request, res: Response) => {
    try {
      const tables = await getAllTableNames();
      const result = [];

      for (const tableName of tables) {
        const columns = await getTableStructure(tableName);
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

  /**
   * 获取表关系（外键）
   */
  'GET /api/database/relationships': async (req: Request, res: Response) => {
    try {
      const relationships = await getAllTableRelationships();
      res.json({ success: true, data: relationships });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  /**
   * 执行SQL查询
   */
  'POST /api/database/execute': async (req: Request, res: Response) => {
    try {
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

      const result = await executeSQLQuery(trimmedSQL);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

