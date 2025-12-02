import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Select,
  Form,
  Space,
  Tag,
  message,
  Modal,
  Tooltip,
  Statistic,
  Row,
  Col,
  Input,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  TeamOutlined,
  StarOutlined,
  BulbOutlined,
  RocketOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { history, useIntl } from 'umi';
import type { AdAccountGuidance, AdGuidanceListParams } from '@/types/metaadguidance';
import {
  getAdGuidanceList,
  deleteAccount,
} from '@/services/metaadguidance';
import AddAccountModal from '../components/AddAccountModal';
import UploadExcelModal from '../components/UploadExcelModal';
import RecommendationsModal from '../components/RecommendationsModal';
import './index.less';

const MetaAdGuidanceList: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<AdAccountGuidance[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const [expand, setExpand] = useState(false);
  
  // Modal 状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [recommendationsModalVisible, setRecommendationsModalVisible] = useState(false);
  const [currentAdAccountId, setCurrentAdAccountId] = useState<string>('');

  // 统计数据 (Mock)
  const [stats, setStats] = useState({
    totalAccounts: 0,
    avgScore: 0,
    totalGuidance: 0,
    activeAccounts: 0,
  });

  // 加载数据
  const loadData = async (params?: Partial<AdGuidanceListParams>) => {
    setLoading(true);
    try {
      const searchValues = form.getFieldsValue();
      const requestParams: AdGuidanceListParams = {
        pageNum,
        pageSize,
        ...searchValues,
        ...params,
      };

      console.log('[Meta广告指导] 正在加载数据...', requestParams);
      const response = await getAdGuidanceList(requestParams);
      
      if (response.code === 200) {
        if (response.data && response.data.list) {
          setDataSource(response.data.list);
          setTotal(response.data.total || 0);
          
          // 更新Mock统计数据 (实际应从后端获取)
          setStats({
            totalAccounts: response.data.total || 0,
            avgScore: 85, // 示例固定值
            totalGuidance: response.data.list.reduce((acc, curr) => acc + (curr.guidanceCount || 0), 0),
            activeAccounts: Math.floor((response.data.total || 0) * 0.8),
          });
        } else {
          setDataSource([]);
          setTotal(0);
        }
      } else {
        message.error(response.message || '加载失败');
        setDataSource([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error('[Meta广告指导] 加载异常:', error);
      message.error(`加载失败: ${error.message || '请刷新重试'}`);
      setDataSource([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the existing logic)

  // 初始化加载
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 100);
    return () => clearTimeout(timer);
  }, [pageNum, pageSize]);

  // 搜索
  const handleSearch = () => {
    setPageNum(1);
    loadData({ pageNum: 1 });
  };

  // 重置
  const handleReset = () => {
    form.resetFields();
    setPageNum(1);
    loadData({
      pageNum: 1,
      consolidatedEntity: undefined,
      settlementEntity: undefined,
      adAccountId: undefined,
    });
  };

  // 新增客户
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  // 上传Excel
  const handleUploadExcel = () => {
    setUploadModalVisible(true);
  };

  // 查看广告指导建议（打开Modal）
  const handleViewGuidance = (record: AdAccountGuidance) => {
    setCurrentAdAccountId(record.adAccountId);
    setRecommendationsModalVisible(true);
  };

  // 查看广告指标详情
  const handleViewMetrics = (record: AdAccountGuidance) => {
    history.push(`/metaadguidance/metric-detail?adAccountId=${record.adAccountId}`);
  };

  // 删除账户
  const handleDelete = (record: AdAccountGuidance) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'metaadguidance.message.delete.confirm.title' }),
      content: intl.formatMessage({ id: 'metaadguidance.message.delete.confirm.content' }, { adAccountId: record.adAccountId }),
      okText: intl.formatMessage({ id: 'metaadguidance.message.delete.confirm.title' }), // Reusing title as button text for simplicity or add new key
      cancelText: 'Cancel', // Consider adding locale key for Cancel if not standard
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await deleteAccount(record.adAccountId);
          if (response.code === 200) {
            message.success(intl.formatMessage({ id: 'metaadguidance.message.delete.success' }));
            loadData();
          } else {
            message.error(response.message || intl.formatMessage({ id: 'metaadguidance.message.delete.failed' }));
          }
        } catch (error) {
          console.error('删除失败:', error);
          message.error(intl.formatMessage({ id: 'metaadguidance.message.delete.failed' }));
        }
      },
    });
  };

  // 渲染标签
  const renderTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;
    return (
      <Space>
        {tags.map((tag) => {
          let color = 'blue';
          if (tag === 'MH') color = 'magenta';
          if (tag === 'BV') color = 'cyan';
          return (
            <Tag key={tag} color={color}>
              {tag}
            </Tag>
          );
        })}
      </Space>
    );
  };

  // 表格列定义
  const columns: ColumnsType<AdAccountGuidance> = [
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.adAccountId' }),
      dataIndex: 'adAccountId',
      key: 'adAccountId',
      width: 180,
      fixed: 'left',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.consolidatedEntity' }),
      dataIndex: 'consolidatedEntity',
      key: 'consolidatedEntity',
      width: 220,
      render: (text: string, record: AdAccountGuidance) => (
        <Space direction="vertical" size={2}>
          <span style={{ fontWeight: 500 }}>{text}</span>
          {renderTags(record.personnelInfo?.tags)}
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.settlementEntity' }),
      dataIndex: 'settlementEntity',
      key: 'settlementEntity',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.accountInfo' }),
      dataIndex: 'accountInfo',
      key: 'accountInfo',
      width: 150,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.personnelInfo' }),
      key: 'personnelInfo',
      width: 300,
      render: (_: any, record: AdAccountGuidance) => (
        <Space direction="vertical" size={0} style={{ fontSize: 12 }}>
          <div><span style={{ color: '#8c8c8c' }}>{intl.formatMessage({ id: 'metaadguidance.table.personnelInfo.contract' })}:</span> {record.personnelInfo.contractSales}</div>
          <div><span style={{ color: '#8c8c8c' }}>{intl.formatMessage({ id: 'metaadguidance.table.personnelInfo.responsible' })}:</span> {record.personnelInfo.responsibleSales}</div>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.accountAttributes' }),
      dataIndex: 'accountAttributes',
      key: 'accountAttributes',
      width: 180,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.accountScore' }),
      dataIndex: 'accountScore',
      key: 'accountScore',
      width: 100,
      align: 'center',
      render: (score) => (
        <span style={{ 
          color: score >= 80 ? '#52c41a' : score >= 60 ? '#faad14' : '#f5222d',
          fontWeight: 'bold' 
        }}>
          {score}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.guidanceCount' }),
      dataIndex: 'guidanceCount',
      key: 'guidanceCount',
      width: 100,
      align: 'center',
      render: (count) => (
        <Tag color={count > 0 ? 'volcano' : 'default'}>{count}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.guidanceUpdateTime' }),
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 180,
      render: (text) => <span style={{ color: '#8c8c8c' }}>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: intl.formatMessage({ id: 'metaadguidance.table.action' }),
      key: 'action',
      width: 240,
      fixed: 'right',
      render: (_: any, record: AdAccountGuidance) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewGuidance(record)}
          >
            {intl.formatMessage({ id: 'metaadguidance.table.action.guidance' })}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewMetrics(record)}
          >
            {intl.formatMessage({ id: 'metaadguidance.table.action.metrics' })}
          </Button>
          <Tooltip title={intl.formatMessage({ id: 'metaadguidance.table.action.delete' })}>
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="pageContainer">
      {/* 仪表盘卡片区域 */}
      <div className="metricsRow">
        <div className="metricCard blueCard">
          <div className="metricIcon">
            <TeamOutlined />
          </div>
          <div className="metricContent">
            <div className="metricTitle">{intl.formatMessage({ id: 'metaadguidance.metric.totalAccounts' })}</div>
            <div className="metricValue">{stats.totalAccounts}</div>
          </div>
        </div>
        
        <div className="metricCard purpleCard">
          <div className="metricIcon">
            <StarOutlined />
          </div>
          <div className="metricContent">
            <div className="metricTitle">{intl.formatMessage({ id: 'metaadguidance.metric.avgScore' })}</div>
            <div className="metricValue">{stats.avgScore}</div>
          </div>
        </div>

        <div className="metricCard orangeCard">
          <div className="metricIcon">
            <BulbOutlined />
          </div>
          <div className="metricContent">
            <div className="metricTitle">{intl.formatMessage({ id: 'metaadguidance.metric.totalGuidance' })}</div>
            <div className="metricValue">{stats.totalGuidance}</div>
          </div>
        </div>

        <div className="metricCard greenCard">
          <div className="metricIcon">
            <RocketOutlined />
          </div>
          <div className="metricContent">
            <div className="metricTitle">{intl.formatMessage({ id: 'metaadguidance.metric.activeAccounts' })}</div>
            <div className="metricValue">{stats.activeAccounts}</div>
          </div>
        </div>
      </div>

      {/* 搜索筛选卡片 */}
      <Card className="searchCard" bordered={false}>
        <Form form={form} layout="horizontal">
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item name="consolidatedEntity" label={intl.formatMessage({ id: 'metaadguidance.search.consolidatedEntity' })} style={{ marginBottom: expand ? 16 : 0 }}>
                <Select
                  placeholder={intl.formatMessage({ id: 'metaadguidance.search.placeholder.consolidatedEntity' })}
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="settlementEntity" label={intl.formatMessage({ id: 'metaadguidance.search.settlementEntity' })} style={{ marginBottom: expand ? 16 : 0 }}>
                <Select
                  placeholder={intl.formatMessage({ id: 'metaadguidance.search.placeholder.settlementEntity' })}
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="adAccountId" label={intl.formatMessage({ id: 'metaadguidance.search.adAccountId' })} style={{ marginBottom: expand ? 16 : 0 }}>
                <Select
                  placeholder={intl.formatMessage({ id: 'metaadguidance.search.placeholder.adAccountId' })}
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            {expand && (
              <>
                <Col span={6}>
                  <Form.Item label={intl.formatMessage({ id: 'metaadguidance.search.accountScore' })} style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Form.Item name="scoreMin" noStyle>
                        <Input style={{ width: '45%', textAlign: 'center' }} placeholder={intl.formatMessage({ id: 'metaadguidance.search.min' })} />
                      </Form.Item>
                      <div style={{ width: '10%', textAlign: 'center', color: '#d9d9d9', borderTop: '1px solid #d9d9d9', borderBottom: '1px solid #d9d9d9', height: 32, lineHeight: '30px', borderLeft: 0, borderRight: 0 }}>~</div>
                      <Form.Item name="scoreMax" noStyle>
                        <Input style={{ width: '45%', textAlign: 'center' }} placeholder={intl.formatMessage({ id: 'metaadguidance.search.max' })} />
                      </Form.Item>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label={intl.formatMessage({ id: 'metaadguidance.search.guidanceCount' })} style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Form.Item name="guidanceCountMin" noStyle>
                        <Input style={{ width: '45%', textAlign: 'center' }} placeholder={intl.formatMessage({ id: 'metaadguidance.search.min' })} />
                      </Form.Item>
                      <div style={{ width: '10%', textAlign: 'center', color: '#d9d9d9', borderTop: '1px solid #d9d9d9', borderBottom: '1px solid #d9d9d9', height: 32, lineHeight: '30px', borderLeft: 0, borderRight: 0 }}>~</div>
                      <Form.Item name="guidanceCountMax" noStyle>
                        <Input style={{ width: '45%', textAlign: 'center' }} placeholder={intl.formatMessage({ id: 'metaadguidance.search.max' })} />
                      </Form.Item>
                    </div>
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={expand ? 24 : 6} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  {intl.formatMessage({ id: 'metaadguidance.search.button' })}
                </Button>
                <Button onClick={handleReset}>{intl.formatMessage({ id: 'metaadguidance.search.reset' })}</Button>
                <a
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? <><UpOutlined /> {intl.formatMessage({ id: 'metaadguidance.search.collapse' })}</> : <><DownOutlined /> {intl.formatMessage({ id: 'metaadguidance.search.expand' })}</>}
                </a>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 列表卡片 */}
      <Card className="tableCard" bordered={false}>
        <div className="tableHeader">
          <div className="pageTitle">{intl.formatMessage({ id: 'metaadguidance.page.title' })}</div>
          <Space size="middle">
            <Button icon={<ReloadOutlined spin={loading} />} onClick={() => loadData()}>
              {intl.formatMessage({ id: 'metaadguidance.action.refresh' })}
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleUploadExcel}>
              {intl.formatMessage({ id: 'metaadguidance.action.uploadExcel' })}
            </Button>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              {intl.formatMessage({ id: 'metaadguidance.action.addClient' })}
            </Button>
          </Space>
        </div>

        <Table
          className="customTable"
          columns={columns}
          dataSource={dataSource}
          rowKey="adAccountId"
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={{
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => intl.formatMessage({ id: 'metaadguidance.table.total' }, { total }),
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => {
              setPageNum(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      {/* 弹框组件 */}
      <AddAccountModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={() => {
          loadData();
        }}
      />
      <UploadExcelModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onSuccess={() => {
          loadData();
        }}
      />
      <RecommendationsModal
        visible={recommendationsModalVisible}
        adAccountId={currentAdAccountId}
        onClose={() => {
          setRecommendationsModalVisible(false);
          setCurrentAdAccountId('');
        }}
      />
    </div>
  );
};

export default MetaAdGuidanceList;

