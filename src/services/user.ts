/**
 * 用户相关 API 服务
 * 功能点 ID: VL-USR-002
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/types/api';
import type { UserProfile, UpdateProfileParams, ChangePasswordParams } from '@/types/user';

/**
 * 获取当前用户个人信息
 */
export async function getUserProfile(): Promise<UserProfile> {
  const response: ApiResponse<UserProfile> = await request('/api/user/profile', {
    method: 'GET',
  });
  return response.data!;
}

/**
 * 更新用户个人信息
 * @param data 更新的字段数据
 */
export async function updateUserProfile(data: UpdateProfileParams): Promise<UserProfile> {
  const response: ApiResponse<UserProfile> = await request('/api/user/profile', {
    method: 'PUT',
    data,
  });
  return response.data!;
}

/**
 * 修改密码
 * @param data 包含原密码和新密码
 */
export async function changePassword(data: ChangePasswordParams): Promise<void> {
  await request('/api/user/change-password', {
    method: 'POST',
    data,
  });
}

