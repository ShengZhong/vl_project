/**
 * Meta广告指导 API 服务层
 * 功能点 ID: ZT-TOOL-001
 */

import request from '@/utils/request';
import type {
  AdGuidanceListParams,
  AdGuidanceListResponse,
  RecommendationDetail,
  MetricDetail,
  AddAccountParams,
  UploadExcelResponse,
  ApiResponse,
} from '@/types/metaadguidance';

/**
 * 获取广告账户指导列表
 */
export async function getAdGuidanceList(
  params: AdGuidanceListParams
): Promise<ApiResponse<AdGuidanceListResponse>> {
  return request.get('/meta-ad-guidance/list', {
    params,
  });
}

/**
 * 获取广告账户建议回传详情
 */
export async function getRecommendationDetail(
  adAccountId: string
): Promise<ApiResponse<RecommendationDetail[]>> {
  return request.get('/meta-ad-guidance/recommendation-detail', {
    params: { adAccountId },
  });
}

/**
 * 获取广告指标回传数据详情
 */
export async function getMetricDetail(
  adAccountId: string
): Promise<ApiResponse<MetricDetail[]>> {
  return request.get('/meta-ad-guidance/metric-detail', {
    params: { adAccountId },
  });
}

/**
 * 上传Excel回传数据
 */
export async function uploadExcel(
  file: File
): Promise<ApiResponse<UploadExcelResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/meta-ad-guidance/upload-excel', {
    data: formData,
    requestType: 'form',
    headers: {
      // 不设置Content-Type，让浏览器自动设置multipart/form-data边界
    },
  });
}

/**
 * 新增客户
 */
export async function addAccount(
  params: AddAccountParams
): Promise<ApiResponse<{ adAccountId: string }>> {
  return request.post('/meta-ad-guidance/add-account', { data: params });
}

/**
 * 删除账户
 */
export async function deleteAccount(
  adAccountId: string
): Promise<ApiResponse<void>> {
  return request.delete(`/meta-ad-guidance/account/${adAccountId}`);
}

/**
 * 下载Excel模板
 */
export async function downloadExcelTemplate(): Promise<Blob> {
  const response = await request.get('/meta-ad-guidance/download-template', {
    responseType: 'blob',
    parseResponse: false,
  });
  // umi-request返回的response可能是Response对象或Blob
  if (response instanceof Blob) {
    return response;
  }
  return await (response as Response).blob();
}

