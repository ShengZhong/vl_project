/**
 * 广告账户建议回传详情页面
 * 功能点 ID: ZT-TOOL-001
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { history } from 'umi';
import type { RecommendationDetail } from '@/types/metaadguidance';
import { getRecommendationDetail } from '@/services/metaadguidance';

const RecommendationDetailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<RecommendationDetail[]>([]);
  const [adAccountId, setAdAccountId] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);
    const accountId = params.get('adAccountId') || '';
    setAdAccountId(accountId);
    if (accountId) {
      loadData(accountId);
    }
  }, []);

  const loadData = async (accountId: string) => {
    setLoading(true);
    try {
      const response = await getRecommendationDetail(accountId);
      if (response.code === 200 && response.data) {
        setDataSource(response.data);
      } else {
        message.error(response.message || '加载失败');
      }
    } catch (error) {
      console.error('加载失败:', error);
      message.error('加载失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    history.push('/metaadguidance/list');
  };

  const columns: ColumnsType<RecommendationDetail> = [
    {
      title: '链接',
      key: 'link',
      width: 80,
      render: () => (
        <Button type="link" size="small">
          查看
        </Button>
      ),
    },
    {
      title: '指导类型',
      dataIndex: 'guidanceType',
      key: 'guidanceType',
      width: 250,
    },
    {
      title: '指导内容',
      dataIndex: 'guidanceContent',
      key: 'guidanceContent',
      width: 200,
    },
    {
      title: '账户提升分数',
      dataIndex: 'accountImprovementScore',
      key: 'accountImprovementScore',
      width: 120,
      align: 'right',
    },
    {
      title: '指标类型',
      dataIndex: 'metricType',
      key: 'metricType',
      width: 100,
      align: 'right',
    },
    {
      title: '可提升数值',
      dataIndex: 'improveableValue',
      key: 'improveableValue',
      width: 180,
    },
    {
      title: '广告对象ID',
      dataIndex: 'adObjectId',
      key: 'adObjectId',
      width: 150,
    },
    {
      title: '广告级别',
      dataIndex: 'adLevel',
      key: 'adLevel',
      width: 100,
      align: 'right',
    },
    {
      title: '指标分数',
      dataIndex: 'metricScore',
      key: 'metricScore',
      width: 100,
      align: 'right',
    },
    {
      title: '指标基准值',
      dataIndex: 'metricBenchmark',
      key: 'metricBenchmark',
      width: 120,
      align: 'right',
    },
    {
      title: '指导更新时间',
      dataIndex: 'guidanceUpdateTime',
      key: 'guidanceUpdateTime',
      width: 180,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '用户行为',
      dataIndex: 'userBehavior',
      key: 'userBehavior',
      width: 120,
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ padding: 0, marginRight: 16 }}
          >
            返回列表
          </Button>
          <div style={{ fontSize: 16, fontWeight: 500 }}>广告账户建议回传详情</div>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={(record, index) => `${record.guidanceType}-${index}`}
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default RecommendationDetailPage;

