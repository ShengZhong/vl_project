/**
 * API 通用类型定义
 */

// API 统一响应格式
export interface ApiResponse<T = any> {
  code: number;         // 状态码 (200: 成功, 400: 参数错误, 401: 未授权, 500: 服务器错误)
  message: string;      // 提示信息
  data?: T;             // 响应数据
}

// 分页参数
export interface PaginationParams {
  pageNum: number;      // 页码,从 1 开始
  pageSize: number;     // 每页条数
}

// 分页响应数据
export interface PaginationResponse<T> {
  list: T[];            // 数据列表
  total: number;        // 总条数
  pageNum: number;      // 当前页码
  pageSize: number;     // 每页条数
}

