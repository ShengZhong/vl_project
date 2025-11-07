/**
 * 用户相关类型定义
 * 功能点 ID: VL-USR-002
 */

// 用户角色枚举
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// 用户状态枚举
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

// 用户个人信息数据模型
export interface UserProfile {
  id: string;                          // 用户 ID
  name: string;                        // 用户姓名
  email: string;                       // 邮箱(唯一,不可修改)
  phone?: string;                      // 手机号(可选)
  role: UserRole;                      // 用户角色
  status: UserStatus;                  // 账户状态
  avatar?: string;                     // 头像 URL
  bio?: string;                        // 个人简介(最多200字符)
  createdAt: string;                   // 注册时间(ISO 8601)
  updatedAt: string;                   // 最后更新时间(ISO 8601)
  lastLoginAt?: string;                // 最后登录时间(ISO 8601)
}

// 更新用户信息请求参数
export interface UpdateProfileParams {
  name?: string;       // 姓名
  phone?: string;      // 手机号
  bio?: string;        // 个人简介
  avatar?: string;     // 头像 URL
}

// 修改密码请求参数
export interface ChangePasswordParams {
  oldPassword: string;  // 原密码
  newPassword: string;  // 新密码
}

