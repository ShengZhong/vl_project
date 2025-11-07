/**
 * 用户个人信息相关类型定义
 * 功能点 ID: VL-USR-002
 */

// 用户角色枚举
export enum UserRole {
  Admin = 'admin',          // 管理员
  Operator = 'operator',    // 运营人员
  User = 'user',            // 普通用户
}

// 用户角色名称映射
export const UserRoleNameMap: Record<UserRole, string> = {
  [UserRole.Admin]: '管理员',
  [UserRole.Operator]: '运营人员',
  [UserRole.User]: '普通用户',
};

// 用户个人信息模型
export interface UserProfile {
  id: string;                    // 用户 ID
  username: string;              // 用户名(登录账号)
  name: string;                  // 姓名
  email: string;                 // 邮箱
  phone: string;                 // 手机号
  role: UserRole;                // 角色
  roleName: string;              // 角色名称(中文)
  department?: string;           // 部门
  avatar?: string;               // 头像 URL
  createdAt: string;             // 创建时间(ISO 8601)
  lastLoginAt?: string;          // 最后登录时间(ISO 8601)
}

// 更新个人信息参数
export interface UpdateProfileParams {
  name: string;      // 姓名
  email: string;     // 邮箱
  phone: string;     // 手机号
}

// 修改密码参数
export interface ChangePasswordParams {
  oldPassword: string;    // 旧密码
  newPassword: string;    // 新密码
}

// API 通用响应
export interface ApiResponse<T = any> {
  code: number;           // 响应码 (200: 成功, 400: 参数错误, 401: 未授权, 500: 服务器错误)
  message: string;        // 响应消息
  data?: T;               // 响应数据
}



