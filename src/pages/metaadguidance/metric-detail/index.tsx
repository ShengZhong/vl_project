/**
 * 广告指标回传数据详情页面
 * 功能点 ID: ZT-TOOL-001
 */

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { history } from 'umi';
import type { MetricDetail } from '@/types/metaadguidance';
import { getMetricDetail } from '@/services/metaadguidance';

const MetricDetailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<MetricDetail[]>([]);
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
      const response = await getMetricDetail(accountId);
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

  const renderBoolean = (value: boolean) => {
    return value ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>;
  };

  const renderTime = (time?: string) => {
    if (!time) return '-';
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  };

  const columns: ColumnsType<MetricDetail> = [
    {
      title: '指导类型',
      dataIndex: 'guidanceType',
      key: 'guidanceType',
      width: 150,
    },
    {
      title: '指导内容',
      dataIndex: 'guidanceContent',
      key: 'guidanceContent',
      width: 200,
    },
    {
      title: '是否存在指导',
      dataIndex: 'hasGuidance',
      key: 'hasGuidance',
      width: 120,
      render: renderBoolean,
    },
    {
      title: '用户是否查阅',
      dataIndex: 'userReviewed',
      key: 'userReviewed',
      width: 120,
      render: renderBoolean,
    },
    {
      title: '是否推送',
      dataIndex: 'isPushed',
      key: 'isPushed',
      width: 100,
      render: renderBoolean,
    },
    {
      title: '用户是否点击',
      dataIndex: 'userClicked',
      key: 'userClicked',
      width: 120,
      render: renderBoolean,
    },
    {
      title: '用户是否采纳',
      dataIndex: 'userAdopted',
      key: 'userAdopted',
      width: 120,
      render: renderBoolean,
    },
    {
      title: '触达后用户是否采纳',
      dataIndex: 'adoptedAfterReach',
      key: 'adoptedAfterReach',
      width: 150,
      render: renderBoolean,
    },
    {
      title: '采纳后广告对象收入',
      dataIndex: 'revenueAfterAdoption',
      key: 'revenueAfterAdoption',
      width: 150,
      align: 'right',
    },
    {
      title: '采纳类型',
      dataIndex: 'adoptionType',
      key: 'adoptionType',
      width: 120,
      render: (text?: string) => text || '-',
    },
    {
      title: '采纳时间',
      dataIndex: 'adoptionTime',
      key: 'adoptionTime',
      width: 180,
      render: renderTime,
    },
    {
      title: '上次触达时间',
      dataIndex: 'lastReachTime',
      key: 'lastReachTime',
      width: 180,
      render: renderTime,
    },
    {
      title: '用户上次采纳时间',
      dataIndex: 'userLastAdoptionTime',
      key: 'userLastAdoptionTime',
      width: 180,
      render: renderTime,
    },
    {
      title: '用户上次执行时间',
      dataIndex: 'userLastExecutionTime',
      key: 'userLastExecutionTime',
      width: 180,
      render: renderTime,
    },
    {
      title: '回传更新时间',
      dataIndex: 'callbackUpdateTime',
      key: 'callbackUpdateTime',
      width: 180,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
          <div style={{ fontSize: 16, fontWeight: 500 }}>广告指标回传数据详情</div>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={(record, index) => `${record.guidanceType}-${record.guidanceContent}-${index}`}
          loading={loading}
          scroll={{ x: 2000 }}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default MetricDetailPage;

