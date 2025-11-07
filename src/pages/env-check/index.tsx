import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Alert, Spin } from 'antd';

interface HealthResponse {
  status: string;
  environment: string;
  timestamp: number;
}

const EnvCheckPage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data: HealthResponse = await response.json();
        setHealth(data);
      } catch (err: any) {
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Card title="本地环境自检 (Env Check)">
        <p>本页面用于快速检测本地开发环境是否可以正常运行。</p>
        <p>若页面长期无响应，请检查终端输出或网络代理设置。</p>
      </Card>

      <Card title="节点环境信息" style={{ marginTop: 16 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Node.js 版本">{process.env.NODE_VERSION || '通过终端查看：node -v'}</Descriptions.Item>
          <Descriptions.Item label="npm 版本">{process.env.NPM_VERSION || '通过终端查看：npm -v'}</Descriptions.Item>
          <Descriptions.Item label="操作系统">{process.env.OS || 'darwin arm64'}</Descriptions.Item>
          <Descriptions.Item label="当前环境变量">
            <code>PORT={process.env.PORT || '8000'}</code>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Mock API 状态" style={{ marginTop: 16 }}>
        {loading ? (
          <Spin tip="正在检测 API..." />
        ) : error ? (
          <Alert type="error" message="Mock API 请求失败" description={error} />
        ) : health ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="状态">{health.status}</Descriptions.Item>
            <Descriptions.Item label="环境">{health.environment}</Descriptions.Item>
            <Descriptions.Item label="时间戳">{new Date(health.timestamp).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        ) : (
          <Alert type="warning" message="未获取到数据" />
        )}
      </Card>
    </div>
  );
};

export default EnvCheckPage;
