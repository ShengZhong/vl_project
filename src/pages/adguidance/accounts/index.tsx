/**
 * VL广告指导建议 - 账户管理页面
 * 功能点ID: VL-ADGD-001
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Progress,
  Row,
  Col,
  Statistic,
  Space,
  Tag,
  Collapse,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  FacebookOutlined,
  GoogleOutlined,
  SafetyCertificateOutlined,
  BulbOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { history } from 'umi';
import {
  getAdAccountList,
  addAdAccount,
  getCustomerList,
  getPlatformList,
  importAdAccounts,
} from '@/services/adguidance';
import type {
  AdAccount,
  AdAccountListParams,
  AddAccountFormData,
  ImportResult,
} from '@/types/adguidance';
import './index.less';

const { Option } = Select;
const { Panel } = Collapse;

const AdAccountManagementPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importing, setImporting] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // 查询参数
  const [params, setParams] = useState<AdAccountListParams>({
    pageNum: 1,
    pageSize: 10,
    platform: undefined,
    scoreRange: undefined,
    keyword: undefined,
  });

  // 加载账户列表
  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAdAccountList(params);
      if (response.code === 200) {
        setAccounts(response.data.list);
        setTotal(response.data.total);
      } else {
        message.error(response.message || '加载数据失败');
        console.error('加载账户列表失败:', response);
      }
    } catch (error) {
      console.error('加载账户列表异常:', error);
      message.error('加载数据失败: ' + (error instanceof Error ? error.message : '请稍后重试'));
    } finally {
      setLoading(false);
    }
  };

  // 加载平台和客户列表
  const loadOptions = async () => {
    try {
      const [platformRes, customerRes] = await Promise.all([
        getPlatformList(),
        getCustomerList(),
      ]);
      if (platformRes.code === 200) {
        setPlatforms(platformRes.data);
      }
      if (customerRes.code === 200) {
        setCustomers(customerRes.data);
      }
    } catch (error) {
      console.error('加载选项失败', error);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [params]);

  useEffect(() => {
    loadOptions();
  }, []);

  // 获取平台图标（彩色）
  const getPlatformIcon = (platformCode: string) => {
    switch (platformCode) {
      case 'META':
        return <FacebookOutlined style={{ fontSize: 24, color: '#1877F2' }} />;
      case 'GOOGLE':
        return <GoogleOutlined style={{ fontSize: 24, color: '#4285F4' }} />;
      case 'TIKTOK':
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
          >
            <path
              d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
              fill="#000000"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // 脱敏显示账户ID
  const maskAccountId = (accountId: string): string => {
    if (accountId.length <= 8) return accountId;
    const start = accountId.slice(0, 4);
    const end = accountId.slice(-4);
    return `${start}****${end}`;
  };

  // 渲染机会分数
  const renderOpportunityScore = (score: number) => {
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
        format={(percent) => percent}
      />
    );
  };

  // 打开添加账户弹框
  const handleAddAccount = () => {
    form.resetFields();
    setAddModalVisible(true);
  };

  // 提交添加账户
  const handleSubmitAdd = async () => {
    try {
      const values = await form.validateFields();
      const response = await addAdAccount(values as AddAccountFormData);
      if (response.code === 200) {
        message.success('添加成功');
        setAddModalVisible(false);
        loadAccounts();
      } else {
        message.error(response.message || '添加失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error('请检查表单填写');
      } else {
        message.error('添加失败');
      }
    }
  };

  // 打开批量导入弹框
  const handleImport = () => {
    setFileList([]);
    setImportResult(null);
    setImportModalVisible(true);
  };

  // 提交批量导入
  const handleSubmitImport = async () => {
    if (fileList.length === 0) {
      message.error('请先上传文件');
      return;
    }

    setImporting(true);
    try {
      const file = fileList[0].originFileObj as File;
      const response = await importAdAccounts(file);
      if (response.code === 200) {
        message.success(`导入成功 ${response.data.success} 条`);
        setImportResult(response.data);
        loadAccounts();
      } else {
        message.error(response.message || '导入失败');
      }
    } catch (error) {
      message.error('导入失败');
    } finally {
      setImporting(false);
    }
  };

  // 查看账户优化建议
  const handleViewRecommendations = (accountId: string) => {
    history.push(`/adguidance/recommendations?accountId=${accountId}`);
  };

  // 按平台分组账户
  const groupedAccounts = accounts.reduce((acc, account) => {
    const platformCode = account.platform?.platformCode || 'UNKNOWN';
    if (!acc[platformCode]) {
      acc[platformCode] = [];
    }
    acc[platformCode].push(account);
    return acc;
  }, {} as Record<string, AdAccount[]>);

  // 表格列定义
  const columns: ColumnsType<AdAccount> = [
    {
      title: '广告主实体',
      dataIndex: ['customer', 'customerName'],
      key: 'customerName',
      width: 200,
    },
    {
      title: '账户ID',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 150,
      render: (accountId: string) => (
        <span style={{ fontFamily: 'monospace' }}>{maskAccountId(accountId)}</span>
      ),
    },
    {
      title: '机会分数',
      dataIndex: 'opportunityScore',
      key: 'opportunityScore',
      width: 100,
      align: 'center',
      render: (score: number) => renderOpportunityScore(score),
      sorter: true,
    },
    {
      title: '优化建议数',
      dataIndex: 'recommendationCount',
      key: 'recommendationCount',
      width: 120,
      align: 'center',
      render: (count: number, record: AdAccount) => (
        <span>
          {count || 0}{' '}
          {record.improvementScore && record.improvementScore > 0 && (
            <Tag color="green">→去优化</Tag>
          )}
        </span>
      ),
    },
    {
      title: '账户余额',
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      width: 120,
      render: (balance: number) => (
        <span>${(balance || 0).toLocaleString()}</span>
      ),
    },
    {
      title: '应付账期',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      render: (date: string) => {
        if (!date) return '-';
        const expiryDate = new Date(date);
        const now = new Date();
        const daysLeft = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) {
          return <Tag color="error">已过期</Tag>;
        } else if (daysLeft < 7) {
          return <Tag color="warning">到期日 {expiryDate.toLocaleDateString()}</Tag>;
        } else {
          return <span>到期日 {expiryDate.toLocaleDateString()}</span>;
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record: AdAccount) => (
        <Button type="primary" size="small">
          管理
        </Button>
      ),
    },
  ];

  // 渲染平台卡片
  const renderPlatformCard = (platformCode: string, platformAccounts: AdAccount[]) => {
    const platform = platforms.find(p => p.platformCode === platformCode);
    const platformName = platform?.platformName || platformCode;
    const totalRecommendations = platformAccounts.reduce(
      (sum, acc) => sum + (acc.recommendationCount || 0),
      0
    );
    const totalBalance = platformAccounts.reduce(
      (sum, acc) => sum + (acc.accountBalance || 0),
      0
    );

    return (
      <Panel
        key={platformCode}
        header={
          <div className="platform-panel-header">
            <div className="platform-info">
              {getPlatformIcon(platformCode)}
              <span className="platform-name">{platformName}</span>
            </div>
            <div className="platform-stats">
              <Tag color="blue">{platformAccounts.length} 账户</Tag>
              <Tag color="orange">{totalRecommendations} 优化建议</Tag>
              <Tag color="green">总余额 ${totalBalance.toLocaleString()}</Tag>
            </div>
          </div>
        }
      >
        <div className="platform-actions" style={{ marginBottom: 16 }}>
          <Button type="link" icon={<FileTextOutlined />}>
            现有账户
          </Button>
          <Button type="link" icon={<PlusOutlined />} onClick={handleAddAccount}>
            开设新账户
          </Button>
          <Button type="link" icon={<SafetyCertificateOutlined />}>
            合规问题
          </Button>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={platformAccounts}
          pagination={false}
          scroll={{ x: 1100 }}
        />

        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Card hoverable style={{ height: '100%', minHeight: 160 }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Statistic
                  title="优化建议"
                  value={totalRecommendations}
                  suffix="个建议待处理"
                  prefix={<BulbOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div style={{ flex: 1 }} />
                <Button type="primary" block icon={<BulbOutlined />}>
                  查看全部建议
                </Button>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable style={{ height: '100%', minHeight: 160 }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Statistic
                  title="余额管理"
                  value={totalBalance.toFixed(2)}
                  prefix="$"
                  suffix="总余额"
                  valueStyle={{ color: '#52c41a' }}
                />
                <div style={{ flex: 1 }} />
                <Button type="primary" block icon={<DollarOutlined />}>
                  充值账户
                </Button>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable style={{ height: '100%', minHeight: 160 }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Statistic
                  title="应付账款"
                  value="11月15日"
                  suffix="到期"
                  valueStyle={{ color: '#faad14' }}
                />
                <div style={{ flex: 1 }} />
                <Button type="primary" block icon={<FileTextOutlined />}>
                  立即支付
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Panel>
    );
  };

  return (
    <div className="ad-account-management-page">
      {/* 页面标题和操作栏 */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>账户管理</h2>
          <p style={{ margin: '4px 0 0', color: '#8c8c8c', fontSize: 14 }}>管理媒体平台账户 积分分配和合规审讲</p>
        </div>
        <Space>
          <Button type="primary" icon={<SafetyCertificateOutlined />}>
            企业认证
          </Button>
          <Button icon={<PlusOutlined />} onClick={handleAddAccount}>
            添加账户
          </Button>
          <Button icon={<UploadOutlined />} onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      </div>

      {/* 平台账户折叠面板 */}
      <Collapse
        defaultActiveKey={Object.keys(groupedAccounts)}
        expandIconPosition="end"
      >
        {Object.entries(groupedAccounts).map(([platformCode, platformAccounts]) =>
          renderPlatformCard(platformCode, platformAccounts)
        )}
      </Collapse>

      {/* 如果没有任何账户,显示空状态 */}
      {accounts.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ color: '#8c8c8c' }}>暂无账户数据</p>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAccount}>
            添加第一个账户
          </Button>
        </div>
      )}

      {/* 添加账户弹框 */}
      <Modal
        title="添加广告账户"
        open={addModalVisible}
        onOk={handleSubmitAdd}
        onCancel={() => setAddModalVisible(false)}
        okText="确认添加"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="platformId"
            label="广告平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="请选择平台">
              {platforms.map(p => (
                <Option key={p.id} value={p.id}>
                  {p.platformName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="accountId"
            label="账户ID"
            rules={[
              { required: true, message: '请输入账户ID' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '账户ID格式不正确' },
            ]}
          >
            <Input placeholder="请输入账户ID" />
          </Form.Item>
          <Form.Item name="accountName" label="账户名称">
            <Input placeholder="请输入账户名称(选填)" />
          </Form.Item>
          <Form.Item
            name="customerId"
            label="关联客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户" showSearch optionFilterProp="children">
              {customers.map(c => (
                <Option key={c.id} value={c.id}>
                  {c.customerName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量导入弹框 */}
      <Modal
        title="批量导入账户"
        open={importModalVisible}
        onOk={handleSubmitImport}
        onCancel={() => setImportModalVisible(false)}
        okText="开始导入"
        cancelText="取消"
        confirmLoading={importing}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Button
            icon={<UploadOutlined />}
            onClick={() => window.open('/api/adguidance/accounts/import/template', '_blank')}
          >
            下载导入模板
          </Button>
        </div>
        <Upload
          accept=".xlsx,.xls"
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            return false;
          }}
          onRemove={() => setFileList([])}
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        {importResult && (
          <div style={{ marginTop: 16 }}>
            <p>
              <strong>导入结果:</strong>
            </p>
            <p>成功: {importResult.success} 条</p>
            <p>失败: {importResult.failed} 条</p>
            {importResult.errors.length > 0 && (
              <div>
                <p>
                  <strong>错误明细:</strong>
                </p>
                {importResult.errors.slice(0, 5).map((err, idx) => (
                  <p key={idx} style={{ color: '#f5222d', fontSize: 12 }}>
                    第 {err.row} 行,字段 "{err.field}": {err.message}
                  </p>
                ))}
                {importResult.errors.length > 5 && <p>...还有更多错误</p>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdAccountManagementPage;

