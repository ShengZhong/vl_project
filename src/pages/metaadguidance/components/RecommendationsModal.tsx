/**
 * Meta广告指导 - 优化建议弹框
 * 功能点ID: ZT-TOOL-001
 * 融合VL广告指导建议功能
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Tag,
  Button,
  Select,
  Row,
  Col,
  message,
  Progress,
  Statistic,
  Space,
  Drawer,
  Card,
  Spin,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getRecommendationList,
  getCategoryStats,
  updateRecommendationStatus,
  getRecommendationDetail,
} from '@/services/adguidance';
import type {
  Recommendation,
  RecommendationListParams,
  CategoryStat,
} from '@/types/adguidance';

const { Option } = Select;

interface RecommendationsModalProps {
  visible: boolean;
  adAccountId: string; // Meta广告账户ID
  onClose: () => void;
}

const RecommendationsModal: React.FC<RecommendationsModalProps> = ({
  visible,
  adAccountId,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState<boolean>(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);

  // 查询参数
  const [params, setParams] = useState<RecommendationListParams>({
    pageNum: 1,
    pageSize: 10,
    platform: 'META', // 固定为META平台
    category: undefined,
    scoreRange: undefined,
    status: undefined,
    keyword: adAccountId, // 使用账户ID搜索
  });

  // 加载分类统计
  const loadCategoryStats = async () => {
    try {
      const response = await getCategoryStats('META');
      if (response.code === 200) {
        setCategoryStats(response.data);
      }
    } catch (error) {
      console.error('加载分类统计失败', error);
    }
  };

  // 加载建议列表
  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const response = await getRecommendationList({
        ...params,
        keyword: adAccountId, // 始终根据账户ID筛选
      });
      if (response.code === 200) {
        setRecommendations(response.data.list);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '加载数据失败');
      }
    } catch (error) {
      console.error('加载建议列表异常:', error);
      message.error('加载数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && adAccountId) {
      loadCategoryStats();
      loadRecommendations();
    }
  }, [visible, adAccountId, params.pageNum, params.pageSize, params.category, params.status]);

  // 获取分类标签颜色
  const getCategoryColor = (categoryCode: string): string => {
    const colorMap: Record<string, string> = {
      BUDGET: 'green',
      CREATIVE: 'purple',
      AUDIENCE: 'blue',
      AUTO: 'orange',
    };
    return colorMap[categoryCode] || 'default';
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      PENDING: 'default',
      ADOPTED: 'success',
      IGNORED: 'error',
    };
    return colorMap[status] || 'default';
  };

  // 获取状态文本
  const getStatusText = (status: string): string => {
    const textMap: Record<string, string> = {
      PENDING: '待采纳',
      ADOPTED: '已采纳',
      IGNORED: '已忽略',
    };
    return textMap[status] || status;
  };

  // 查看建议详情
  const handleViewDetail = async (record: Recommendation) => {
    try {
      const response = await getRecommendationDetail(record.id);
      if (response.code === 200) {
        setCurrentRecommendation(response.data);
        setDetailDrawerVisible(true);
      } else {
        message.error(response.message || '加载详情失败');
      }
    } catch (error) {
      message.error('加载详情失败');
    }
  };

  // 更新建议状态
  const handleUpdateStatus = async (id: number, status: 'ADOPTED' | 'IGNORED') => {
    try {
      const response = await updateRecommendationStatus(id, status);
      if (response.code === 200) {
        message.success(status === 'ADOPTED' ? '已采纳' : '已忽略');
        loadRecommendations();
        loadCategoryStats();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 采纳建议
  const handleAdopt = (record: Recommendation) => {
    Modal.confirm({
      title: '采纳建议',
      content: '确认采纳该优化建议吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleUpdateStatus(record.id, 'ADOPTED'),
    });
  };

  // 忽略建议
  const handleIgnore = (record: Recommendation) => {
    Modal.confirm({
      title: '忽略建议',
      content: '确认忽略该优化建议吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleUpdateStatus(record.id, 'IGNORED'),
    });
  };

  // 渲染机会分数
  const renderOpportunityScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return <span style={{ color: '#999' }}>-</span>;
    }

    let color = '#52c41a'; // 绿色 (≥80)
    if (score < 40) {
      color = '#f5222d'; // 红色 (<40)
    } else if (score < 80) {
      color = '#faad14'; // 橙色 (40-79)
    }

    return (
      <Progress
        type="circle"
        percent={score}
        width={50}
        strokeColor={color}
        format={(percent) => percent || 0}
      />
    );
  };

  // 表格列定义
  const columns: ColumnsType<Recommendation> = [
    {
      title: '建议',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: ['category', 'categoryName'],
      key: 'category',
      width: 100,
      render: (categoryName: string, record: Recommendation) => (
        <Tag color={getCategoryColor(record.category?.categoryCode || '')}>
          {categoryName}
        </Tag>
      ),
    },
    {
      title: '影响广告数',
      dataIndex: 'affectedAdCount',
      key: 'affectedAdCount',
      width: 120,
      align: 'center',
      render: (count: number) => <span>{count}</span>,
    },
    {
      title: '分数提升',
      dataIndex: 'impactScore',
      key: 'impactScore',
      width: 120,
      align: 'center',
      render: (score: number) => (
        <span style={{ color: score >= 0 ? '#52c41a' : '#f5222d' }}>
          {score >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(score)}
        </span>
      ),
    },
    {
      title: '机会分数',
      dataIndex: ['account', 'opportunityScore'],
      key: 'opportunityScore',
      width: 100,
      align: 'center',
      render: (score: number) => renderOpportunityScore(score),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record: Recommendation) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleAdopt(record)}
              >
                采纳
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleIgnore(record)}
              >
                忽略
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 渲染分类统计卡片
  const renderCategoryStats = () => {
    if (!categoryStats || categoryStats.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          marginBottom: 24,
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          paddingBottom: 8,
        }}
      >
        <div style={{ display: 'inline-flex', gap: 16, minWidth: '100%' }}>
          {categoryStats.map((stat) => (
            <div
              key={stat.category.categoryCode}
              style={{
                display: 'inline-block',
                minWidth: 200,
                maxWidth: 200,
                verticalAlign: 'top',
              }}
            >
              <Card
                hoverable
                onClick={() =>
                  setParams({ ...params, category: stat.category.categoryCode, pageNum: 1 })
                }
                style={{
                  height: '100%',
                  cursor: 'pointer',
                  border:
                    params.category === stat.category.categoryCode
                      ? `2px solid ${getCategoryColor(stat.category.categoryCode)}`
                      : '1px solid #d9d9d9',
                }}
              >
                <Tag color={getCategoryColor(stat.category.categoryCode)} style={{ marginBottom: 8 }}>
                  {stat.category.categoryName}
                </Tag>
                <Row gutter={8}>
                  <Col span={12}>
                    <Statistic
                      title="影响账户"
                      value={stat.accountCount}
                      suffix="个"
                      valueStyle={{ fontSize: 16 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="分数提升"
                      value={stat.improvementScore}
                      prefix={<ArrowUpOutlined />}
                      valueStyle={{ fontSize: 16, color: '#52c41a' }}
                    />
                  </Col>
                </Row>
                <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                  影响广告: {stat.affectedAdCount}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        title={`优化建议 - ${adAccountId}`}
        open={visible}
        onCancel={onClose}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <Spin spinning={loading}>
          {/* 筛选条件 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Select
                placeholder="全部分类"
                allowClear
                value={params.category}
                onChange={(value) => setParams({ ...params, category: value, pageNum: 1 })}
                style={{ width: '100%' }}
              >
                <Option value="BUDGET">预算</Option>
                <Option value="CREATIVE">创意</Option>
                <Option value="AUDIENCE">受众</Option>
                <Option value="AUTO">自动化</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                placeholder="状态筛选"
                allowClear
                value={params.status}
                onChange={(value) => setParams({ ...params, status: value, pageNum: 1 })}
                style={{ width: '100%' }}
              >
                <Option value="PENDING">待采纳</Option>
                <Option value="ADOPTED">已采纳</Option>
                <Option value="IGNORED">已忽略</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                placeholder="机会分数"
                allowClear
                value={params.scoreRange}
                onChange={(value) => setParams({ ...params, scoreRange: value, pageNum: 1 })}
                style={{ width: '100%' }}
              >
                <Option value="0-40">0~40分</Option>
                <Option value="40-80">40~80分</Option>
                <Option value="80-100">80~100分</Option>
              </Select>
            </Col>
          </Row>

          {/* 分类统计 */}
          {renderCategoryStats()}

          {/* 建议列表 */}
          <Table
            rowKey="id"
            columns={columns}
            dataSource={recommendations}
            loading={loading}
            pagination={{
              current: params.pageNum,
              pageSize: params.pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (pageNum, pageSize) => {
                setParams({ ...params, pageNum, pageSize });
              },
            }}
            scroll={{ x: 1000, y: 400 }}
          />
        </Spin>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="建议详情"
        width={640}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        footer={
          currentRecommendation?.status === 'PENDING' && (
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => {
                  if (currentRecommendation) {
                    handleAdopt(currentRecommendation);
                    setDetailDrawerVisible(false);
                  }
                }}
              >
                采纳
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => {
                  if (currentRecommendation) {
                    handleIgnore(currentRecommendation);
                    setDetailDrawerVisible(false);
                  }
                }}
              >
                忽略
              </Button>
            </Space>
          )
        }
      >
        {currentRecommendation && (
          <div className="recommendation-detail">
            <div className="detail-section">
              <h3>建议概要</h3>
              <p>
                <strong>建议标题:</strong> {currentRecommendation.title}
              </p>
              <p>
                <strong>分类:</strong>{' '}
                <Tag color={getCategoryColor(currentRecommendation.category?.categoryCode || '')}>
                  {currentRecommendation.category?.categoryName}
                </Tag>
              </p>
              <p>
                <strong>状态:</strong>{' '}
                <Tag color={getStatusColor(currentRecommendation.status)}>
                  {getStatusText(currentRecommendation.status)}
                </Tag>
              </p>
            </div>

            <div className="detail-section">
              <h3>优化建议描述</h3>
              <p>{currentRecommendation.description}</p>
            </div>

            <div className="detail-section">
              <h3>影响分析</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="影响广告数量"
                    value={currentRecommendation.affectedAdCount}
                    suffix="个"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="分数提升预估"
                    value={Math.abs(currentRecommendation.impactScore)}
                    prefix={
                      currentRecommendation.impactScore >= 0 ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                    valueStyle={{
                      color: currentRecommendation.impactScore >= 0 ? '#52c41a' : '#f5222d',
                    }}
                  />
                </Col>
              </Row>
            </div>

            {currentRecommendation.account && (
              <div className="detail-section">
                <h3>账户信息</h3>
                <p>
                  <strong>账户ID:</strong> {currentRecommendation.account.accountId}
                </p>
                <p>
                  <strong>账户名称:</strong> {currentRecommendation.account.accountName || '-'}
                </p>
                <p>
                  <strong>机会分数:</strong>{' '}
                  {renderOpportunityScore(currentRecommendation.account.opportunityScore)}
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default RecommendationsModal;

