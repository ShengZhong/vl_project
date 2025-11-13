import { extend } from 'umi-request';
import { message } from 'antd';

/**
 * 请求拦截器配置
 */
const request = extend({
  prefix: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error: any) => {
    const { response } = error;
    
    // 如果错误已经被处理过（有code字段），直接抛出
    if (error.code !== undefined) {
      throw error;
    }
    
    if (response && response.status) {
      const errorText = response.statusText;
      const { status } = response;
      
      message.error(`请求错误 ${status}: ${errorText}`);
    } else if (!response) {
      message.error('网络异常，请检查您的网络连接');
    }
    
    throw error;
  },
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
  // 可以在这里添加 token 等认证信息
  const token = localStorage.getItem('token');
  
  // 如果是FormData，不设置Content-Type，让浏览器自动设置
  const isFormData = options.data instanceof FormData;
  
  const headers: any = {
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  // 如果是FormData，删除Content-Type，让浏览器自动设置multipart/form-data边界
  if (isFormData) {
    delete headers['Content-Type'];
  }
  
  return {
    url,
    options: { ...options, headers },
  };
});

// 响应拦截器
request.interceptors.response.use(
  async (response) => {
    // 如果是blob响应（文件下载），直接返回
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
        contentType.includes('application/octet-stream') ||
        contentType.includes('application/zip')) {
      return response;
    }
    
    try {
      const data = await response.clone().json();
      
      // 统一处理响应
      if (data.code !== 200 && data.code !== undefined) {
        // 不在这里显示错误消息，让调用方处理
        const error = new Error(data.message || '请求失败');
        (error as any).code = data.code;
        (error as any).data = data.data;
        return Promise.reject(error);
      }
      
      // 返回解析后的数据，而不是response对象
      return data;
    } catch (error) {
      // 如果不是JSON响应，尝试返回原始响应
      try {
        const text = await response.clone().text();
        return text;
      } catch {
        return response;
      }
    }
  },
  (error) => {
    // 错误处理
    return Promise.reject(error);
  }
);

export default request;

