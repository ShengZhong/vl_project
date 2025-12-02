/**
 * 数据库管理相关类型定义
 * 功能点ID: VL-TOOL-001
 */

/**
 * 表字段信息
 */
export interface TableColumn {
  cid: number;           // 列ID
  name: string;          // 字段名
  type: string;          // 字段类型（TEXT/INTEGER/REAL）
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
  onDelete: string;      // 删除规则（CASCADE/SET NULL/RESTRICT）
  onUpdate: string;      // 更新规则（CASCADE/SET NULL/RESTRICT）
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
  needConfirm?: boolean; // 是否需要二次确认
  message?: string;      // 提示信息
}

/**
 * 表结构API响应
 */
export interface TablesResponse {
  success: boolean;
  data?: TableInfo[];
  error?: string;
}

/**
 * 表关系API响应
 */
export interface RelationshipsResponse {
  success: boolean;
  data?: ForeignKeyInfo[];
  error?: string;
}

