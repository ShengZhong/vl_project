/**
 * VL 用户相关类型定义
 * 功能点 ID: VL-USR-003
 */

// 认领状态枚举
export enum ClaimStatus {
  Claimed = 'claimed',       // 已认领
  Unclaimed = 'unclaimed',   // 未认领
}

// 认证状态枚举
export enum CertStatus {
  Certified = 'certified',     // 已认证
  Uncertified = 'uncertified', // 未认证
}

// 用户状态枚举
export enum UserStatus {
  Active = 'active',      // 使用中
  Frozen = 'frozen',      // 已冻结
  Disabled = 'disabled',  // 已禁用
}

// 状态名称映射
export const ClaimStatusNameMap: Record<ClaimStatus, string> = {
  [ClaimStatus.Claimed]: '已认领',
  [ClaimStatus.Unclaimed]: '未认领',
};

export const CertStatusNameMap: Record<CertStatus, string> = {
  [CertStatus.Certified]: '已认证',
  [CertStatus.Uncertified]: '未认证',
};

export const UserStatusNameMap: Record<UserStatus, string> = {
  [UserStatus.Active]: '使用中',
  [UserStatus.Frozen]: '已冻结',
  [UserStatus.Disabled]: '已禁用',
};

// VL 用户数据模型
export interface VLUser {
  vlid: string;                    // VLID
  token: string;                   // 专属 Token
  registeredEntity: string;        // 注册主体
  registeredTime: string;          // 注册时间
  claimTime?: string;              // 认领时间
  claimStatus: ClaimStatus;        // 认领状态
  certStatus: CertStatus;          // 认证状态
  status: UserStatus;              // 账号状态
  
  // 基本信息
  email: string;                   // 注册邮箱
  contactPerson: string;           // 联系人
  phone: string;                   // 手机号
  customerSource: string;          // 客户来源
  
  // 签约信息
  signCompany?: string;            // 签约主体
  signSales?: string;              // 签约销售
  signEmail?: string;              // 签约邮箱
  
  // 财务信息
  walletStatus?: string;           // 钱包状态
  balance?: number;                // 余额
  
  // 入驻信息
  responsibleSales?: string;       // 负责销售
  responsibleAE?: string;          // 负责 AE
  
  // 标签
  tags?: string[];                 // 标签(如 BV, BMP 等)
}

// 列表查询参数
export interface VLUserListParams {
  pageNum: number;       // 页码
  pageSize: number;      // 每页条数
  vlid?: string;         // VLID 搜索
  signInfo?: string;     // 签约信息搜索
  authStatus?: string;   // 授权状态筛选
}

// 列表响应
export interface VLUserListResponse {
  code: number;
  message: string;
  data: {
    list: VLUser[];
    total: number;
    pageNum: number;
    pageSize: number;
  };
}

// 创建用户参数
export interface CreateVLUserParams {
  email: string;              // 注册邮箱
  contactPerson: string;      // 联系人
  phone: string;              // 手机号
  registeredEntity: string;   // 注册主体
  customerSource?: string;    // 客户来源
}

// 更新用户参数
export interface UpdateVLUserParams {
  contactPerson?: string;     // 联系人
  phone?: string;             // 手机号
  customerSource?: string;    // 客户来源
  signCompany?: string;       // 签约主体
  signSales?: string;         // 签约销售
  signEmail?: string;         // 签约邮箱
}

// API 通用响应
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}



