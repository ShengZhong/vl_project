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
  if (token) {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    return {
      url,
      options: { ...options, headers },
    };
  }
  return {
    url,
    options,
  };
});

// 响应拦截器
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  
  // 统一处理响应
  if (data.code !== 200 && data.code !== undefined) {
    message.error(data.message || '请求失败');
    return Promise.reject(data);
  }
  
  return response;
});

export default request;

