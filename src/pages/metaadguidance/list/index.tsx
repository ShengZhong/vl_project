/**
 * Meta广告指导列表页面
 * 功能点 ID: ZT-TOOL-001
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Form,
  Space,
  Tag,
  message,
  Modal,
  Upload,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import type { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import { history } from 'umi';
import type { AdAccountGuidance, AdGuidanceListParams } from '@/types/metaadguidance';
import {
  getAdGuidanceList,
  deleteAccount,
  uploadExcel,
} from '@/services/metaadguidance';
import AddAccountModal from '../components/AddAccountModal';
import UploadExcelModal from '../components/UploadExcelModal';

const MetaAdGuidanceList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<AdAccountGuidance[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Modal 状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

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

      const response = await getAdGuidanceList(requestParams);
      if (response.code === 200 && response.data) {
        setDataSource(response.data.list);
        setTotal(response.data.total);
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

  // 初始化加载
  useEffect(() => {
    loadData();
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

  // 查看广告指导详情
  const handleViewGuidance = (record: AdAccountGuidance) => {
    history.push(`/metaadguidance/recommendation-detail?adAccountId=${record.adAccountId}`);
  };

  // 查看广告指标详情
  const handleViewMetrics = (record: AdAccountGuidance) => {
    history.push(`/metaadguidance/metric-detail?adAccountId=${record.adAccountId}`);
  };

  // 删除账户
  const handleDelete = (record: AdAccountGuidance) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除广告账户 ${record.adAccountId} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteAccount(record.adAccountId);
          if (response.code === 200) {
            message.success('删除成功');
            loadData();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败，请重试');
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
          if (tag === 'MH') color = 'red';
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
      title: '广告账户ID',
      dataIndex: 'adAccountId',
      key: 'adAccountId',
      width: 180,
      fixed: 'left',
    },
    {
      title: '合并主体',
      dataIndex: 'consolidatedEntity',
      key: 'consolidatedEntity',
      width: 200,
      render: (text: string, record: AdAccountGuidance) => (
        <Space>
          <span>{text}</span>
          {renderTags(record.personnelInfo?.tags)}
        </Space>
      ),
    },
    {
      title: '结算主体',
      dataIndex: 'settlementEntity',
      key: 'settlementEntity',
      width: 200,
    },
    {
      title: '账户信息',
      dataIndex: 'accountInfo',
      key: 'accountInfo',
      width: 150,
    },
    {
      title: '人员信息',
      key: 'personnelInfo',
      width: 300,
      render: (_: any, record: AdAccountGuidance) => (
        <div>
          <div>签约销售：{record.personnelInfo.contractSales}</div>
          <div>负责销售：{record.personnelInfo.responsibleSales}</div>
        </div>
      ),
    },
    {
      title: '账户属性',
      dataIndex: 'accountAttributes',
      key: 'accountAttributes',
      width: 200,
    },
    {
      title: '账户评分',
      dataIndex: 'accountScore',
      key: 'accountScore',
      width: 100,
      align: 'right',
    },
    {
      title: '广告指导数量',
      dataIndex: 'guidanceCount',
      key: 'guidanceCount',
      width: 120,
      align: 'right',
    },
    {
      title: '指导更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 180,
      render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: AdAccountGuidance) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewGuidance(record)}
          >
            广告指导
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewMetrics(record)}
          >
            广告指标
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        {/* 搜索区域 */}
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item name="consolidatedEntity" label="合并主体">
            <Select
              placeholder="请输入进行选择"
              style={{ width: 200 }}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {/* 选项从后端获取，这里先留空 */}
            </Select>
          </Form.Item>
          <Form.Item name="settlementEntity" label="结算主体">
            <Select
              placeholder="请输入进行选择"
              style={{ width: 200 }}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {/* 选项从后端获取，这里先留空 */}
            </Select>
          </Form.Item>
          <Form.Item name="adAccountId" label="广告账户ID">
            <Select
              placeholder="请输入进行选择"
              style={{ width: 200 }}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {/* 选项从后端获取，这里先留空 */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 操作按钮区域 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>FB广告指导</div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => loadData()}>
              刷新
            </Button>
            <Button icon={<UploadOutlined />} onClick={handleUploadExcel}>
              上传Excel
            </Button>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              新增客户
            </Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
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
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, size) => {
              setPageNum(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      {/* 新增客户弹框 */}
      <AddAccountModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
        }}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* 上传Excel弹框 */}
      <UploadExcelModal
        visible={uploadModalVisible}
        onClose={() => {
          setUploadModalVisible(false);
        }}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
};

export default MetaAdGuidanceList;

