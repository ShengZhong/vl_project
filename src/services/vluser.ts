/**
 * VL 用户相关 API 服务
 * 功能点 ID: VL-USR-003
 */

import request from '@/utils/request';
import type {
  VLUser,
  VLUserListParams,
  VLUserListResponse,
  CreateVLUserParams,
  UpdateVLUserParams,
  ApiResponse,
} from '@/types/vluser';

/**
 * 获取 VL 用户列表
 * @param params 查询参数
 * @returns 用户列表
 */
export async function getVLUserList(
  params: VLUserListParams,
): Promise<VLUserListResponse> {
  return request('/api/vlusers', {
    method: 'GET',
    params,
  });
}

/**
 * 获取 VL 用户详情
 * @param vlid 用户 VLID
 * @returns 用户详情
 */
export async function getVLUserDetail(vlid: string): Promise<ApiResponse<VLUser>> {
  return request(`/api/vlusers/${vlid}`, {
    method: 'GET',
  });
}

/**
 * 创建 VL 用户
 * @param params 创建参数
 * @returns 创建的用户信息
 */
export async function createVLUser(
  params: CreateVLUserParams,
): Promise<ApiResponse<VLUser>> {
  return request('/api/vlusers', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新 VL 用户
 * @param vlid 用户 VLID
 * @param params 更新参数
 * @returns 更新后的用户信息
 */
export async function updateVLUser(
  vlid: string,
  params: UpdateVLUserParams,
): Promise<ApiResponse<VLUser>> {
  return request(`/api/vlusers/${vlid}`, {
    method: 'PUT',
    data: params,
  });
}

/**
 * 冻结/解冻 VL 用户
 * @param vlid 用户 VLID
 * @param freeze 是否冻结
 * @returns API 响应
 */
export async function freezeVLUser(
  vlid: string,
  freeze: boolean,
): Promise<ApiResponse<void>> {
  return request(`/api/vlusers/${vlid}/freeze`, {
    method: 'POST',
    data: { freeze },
  });
}

/**
 * 导出 VL 用户数据
 * @param params 查询参数
 * @returns 文件流
 */
export async function exportVLUsers(params: VLUserListParams): Promise<Blob> {
  return request('/api/vlusers/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}



