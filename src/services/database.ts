/**
 * 数据库管理服务层
 * 功能点ID: VL-TOOL-001
 */

import request from '@/utils/request';
import type { 
  TableInfo, 
  ForeignKeyInfo, 
  ExecuteSQLParams, 
  ExecuteSQLResponse,
  TablesResponse,
  RelationshipsResponse,
} from '@/types/database';

/**
 * 获取所有表的结构信息
 */
export async function getTables(): Promise<TableInfo[]> {
  const response: TablesResponse = await request('/api/database/tables');
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.error || '获取表结构失败');
}

/**
 * 获取表关系（外键）
 */
export async function getRelationships(): Promise<ForeignKeyInfo[]> {
  const response: RelationshipsResponse = await request('/api/database/relationships');
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.error || '获取表关系失败');
}

/**
 * 执行SQL查询
 */
export async function executeSQL(params: ExecuteSQLParams): Promise<ExecuteSQLResponse> {
  return request('/api/database/execute', {
    method: 'POST',
    data: params,
  });
}

