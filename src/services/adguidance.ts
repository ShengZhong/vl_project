/**
 * VL广告指导建议 - API 服务层
 * 功能点ID: VL-ADGD-001
 */

import request from '@/utils/request';
import type {
  ApiResponse,
  PageResponse,
  OverviewData,
  Recommendation,
  RecommendationListParams,
  AdAccount,
  AdAccountListParams,
  CategoryStat,
  AddAccountFormData,
  ImportResult,
} from '@/types/adguidance';

/**
 * 获取概览统计数据
 */
export async function getOverviewData(): Promise<ApiResponse<OverviewData>> {
  return request('/adguidance/overview', {
    method: 'GET',
  });
}

/**
 * 获取优化建议列表
 */
export async function getRecommendationList(
  params: RecommendationListParams,
): Promise<ApiResponse<PageResponse<Recommendation>>> {
  return request('/adguidance/recommendations', {
    method: 'GET',
    params,
  });
}

/**
 * 获取建议分类统计
 */
export async function getCategoryStats(
  platform?: string,
): Promise<ApiResponse<CategoryStat[]>> {
  return request('/adguidance/recommendations/category-stats', {
    method: 'GET',
    params: { platform },
  });
}

/**
 * 获取建议详情
 */
export async function getRecommendationDetail(
  id: number,
): Promise<ApiResponse<Recommendation>> {
  return request(`/adguidance/recommendations/${id}`, {
    method: 'GET',
  });
}

/**
 * 更新建议状态
 */
export async function updateRecommendationStatus(
  id: number,
  status: 'PENDING' | 'ADOPTED' | 'IGNORED',
): Promise<ApiResponse<Recommendation>> {
  return request(`/adguidance/recommendations/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

/**
 * 批量更新建议状态
 */
export async function batchUpdateRecommendationStatus(
  ids: number[],
  status: 'PENDING' | 'ADOPTED' | 'IGNORED',
): Promise<ApiResponse<{ success: number }>> {
  return request('/adguidance/recommendations/batch-update', {
    method: 'PUT',
    data: { ids, status },
  });
}

/**
 * 获取广告账户列表
 */
export async function getAdAccountList(
  params: AdAccountListParams,
): Promise<ApiResponse<PageResponse<AdAccount>>> {
  return request('/adguidance/accounts', {
    method: 'GET',
    params,
  });
}

/**
 * 获取账户详情
 */
export async function getAdAccountDetail(
  id: number,
): Promise<ApiResponse<AdAccount>> {
  return request(`/adguidance/accounts/${id}`, {
    method: 'GET',
  });
}

/**
 * 添加广告账户
 */
export async function addAdAccount(
  data: AddAccountFormData,
): Promise<ApiResponse<AdAccount>> {
  return request('/adguidance/accounts', {
    method: 'POST',
    data,
  });
}

/**
 * 更新广告账户
 */
export async function updateAdAccount(
  id: number,
  data: Partial<AddAccountFormData>,
): Promise<ApiResponse<AdAccount>> {
  return request(`/adguidance/accounts/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除广告账户
 */
export async function deleteAdAccount(id: number): Promise<ApiResponse<void>> {
  return request(`/adguidance/accounts/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量导入广告账户
 */
export async function importAdAccounts(
  file: File,
): Promise<ApiResponse<ImportResult>> {
  const formData = new FormData();
  formData.append('file', file);
  
  return request('/adguidance/accounts/import', {
    method: 'POST',
    data: formData,
  });
}

/**
 * 下载批量导入模板
 */
export function downloadImportTemplate(): void {
  window.open('/api/adguidance/accounts/import/template', '_blank');
}

/**
 * 获取客户列表(用于下拉选择)
 */
export async function getCustomerList(): Promise<ApiResponse<{ id: number; customerName: string }[]>> {
  return request('/adguidance/customers', {
    method: 'GET',
  });
}

/**
 * 获取平台列表(用于下拉选择)
 */
export async function getPlatformList(): Promise<ApiResponse<{ id: number; platformCode: string; platformName: string }[]>> {
  return request('/adguidance/platforms', {
    method: 'GET',
  });
}

