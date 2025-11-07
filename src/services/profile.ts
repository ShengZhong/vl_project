/**
 * 用户个人信息相关 API 服务
 * 功能点 ID: VL-USR-002
 */

import request from '@/utils/request';
import type {
  UserProfile,
  UpdateProfileParams,
  ChangePasswordParams,
  ApiResponse,
} from '@/types/profile';

/**
 * 获取当前用户个人信息
 * @returns 用户个人信息
 */
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  return request('/api/user/profile', {
    method: 'GET',
  });
}

/**
 * 更新个人信息
 * @param params 更新参数
 * @returns 更新后的用户信息
 */
export async function updateUserProfile(
  params: UpdateProfileParams,
): Promise<ApiResponse<UserProfile>> {
  return request('/api/user/profile', {
    method: 'PUT',
    data: params,
  });
}

/**
 * 修改密码
 * @param params 密码修改参数
 * @returns API 响应
 */
export async function changePassword(
  params: ChangePasswordParams,
): Promise<ApiResponse<void>> {
  return request('/api/user/change-password', {
    method: 'POST',
    data: params,
  });
}



