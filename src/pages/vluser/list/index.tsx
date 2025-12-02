/**
 * VL 用户列表页面
 * 功能点 ID: VL-USR-003
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
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
  ReloadOutlined,
  CopyOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import type { VLUser, VLUserListParams } from '@/types/vluser';
import {
  ClaimStatus,
  CertStatus,
  UserStatus,
  ClaimStatusNameMap,
  CertStatusNameMap,
  UserStatusNameMap,
} from '@/types/vluser';
import { getVLUserList, freezeVLUser } from '@/services/vluser';
import DetailModal from '../components/DetailModal';
import ManageModal from '../components/ManageModal';
import AddModal from '../components/AddModal';

const VLUserList: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<VLUser[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Modal 状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [manageModalVisible, setManageModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<VLUser | null>(null);

  // 加载数据
  const loadData = async (params?: Partial<VLUserListParams>) => {
    setLoading(true);
    try {
      const searchValues = form.getFieldsValue();
      const requestParams: VLUserListParams = {
        pageNum,
        pageSize,
        ...searchValues,
        ...params,
      };

      console.log('[VL用户列表] 正在加载数据...', requestParams);
      const response = await getVLUserList(requestParams);
      console.log('[VL用户列表] 服务器响应:', response);
      
      if (response.code === 200) {
        if (response.data && response.data.list) {
          setDataSource(response.data.list);
          setTotal(response.data.total || 0);
          console.log(`[VL用户列表] 加载成功，共 ${response.data.total || 0} 条数据`);
        } else {
          setDataSource([]);
          setTotal(0);
          console.warn('[VL用户列表] 响应数据为空');
        }
      } else {
        const errorMsg = response.message || '加载失败';
        console.error('[VL用户列表] 加载失败:', errorMsg);
        message.error(errorMsg);
        setDataSource([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error('[VL用户列表] 加载异常:', error);
      console.error('[VL用户列表] 错误堆栈:', error.stack);
      message.error(`加载失败: ${error.message || '请刷新重试'}`);
      setDataSource([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    // 延迟一点执行，确保数据库初始化完成
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
    loadData({ pageNum: 1, vlid: undefined, signInfo: undefined, authStatus: undefined });
  };

  // 复制 Token
  const handleCopyToken = (token: string) => {
    if (!token) {
      message.warning('该用户暂无 Token');
      return;
    }
    navigator.clipboard.writeText(token);
    message.success('Token 已复制到剪贴板');
  };

  // 查看详情
  const handleDetail = (record: VLUser) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  // 管理
  const handleManage = (record: VLUser) => {
    setCurrentRecord(record);
    setManageModalVisible(true);
  };

  // 冻结/解冻
  const handleFreeze = (record: VLUser) => {
    const isFrozen = record.status === UserStatus.Frozen;
    Modal.confirm({
      title: isFrozen ? '确认解冻' : '确认冻结',
      content: `您确定要${isFrozen ? '解冻' : '冻结'}用户 ${record.vlid} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await freezeVLUser(record.vlid, !isFrozen);
          if (response.code === 200) {
            message.success(isFrozen ? '解冻成功' : '冻结成功');
            loadData();
          } else {
            message.error(response.message || '操作失败');
          }
        } catch (error) {
          console.error('操作失败:', error);
          message.error('操作失败，请稍后重试');
        }
      },
    });
  };

  // 添加账号
  const handleAdd = () => {
    setAddModalVisible(true);
  };

  // 数据导出
  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  // 表格列定义
  const columns: ColumnsType<VLUser> = [
    {
      title: 'VLID',
      dataIndex: 'vlid',
      key: 'vlid',
      width: 80,
      fixed: 'left',
    },
    {
      title: '专属Token',
      dataIndex: 'token',
      key: 'token',
      width: 180,
      render: (token: string) => (
        <Space>
          {token ? (
            <>
              <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                {token.slice(0, 8)}...
              </span>
              <Tooltip title="复制 Token">
                <Button
                  type="link"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyToken(token)}
                />
              </Tooltip>
              <Tag color="green">当前生效</Tag>
            </>
          ) : (
            <span style={{ color: '#999' }}>-</span>
          )}
        </Space>
      ),
    },
    {
      title: '注册主体',
      dataIndex: 'registeredEntity',
      key: 'registeredEntity',
      width: 220,
      ellipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'registeredTime',
      key: 'registeredTime',
      width: 160,
      render: (time: string) => moment(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '认领时间',
      dataIndex: 'claimTime',
      key: 'claimTime',
      width: 160,
      render: (time?: string) =>
        time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '--',
    },
    {
      title: '认领状态',
      dataIndex: 'claimStatus',
      key: 'claimStatus',
      width: 100,
      render: (status: ClaimStatus) => (
        <Tag color={status === ClaimStatus.Claimed ? 'green' : 'default'}>
          {ClaimStatusNameMap[status]}
        </Tag>
      ),
    },
    {
      title: '认证状态',
      dataIndex: 'certStatus',
      key: 'certStatus',
      width: 100,
      render: (status: CertStatus) => (
        <Tag color={status === CertStatus.Certified ? 'green' : 'red'}>
          {CertStatusNameMap[status]}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: UserStatus) => {
        const colorMap = {
          [UserStatus.Active]: 'green',
          [UserStatus.Frozen]: 'red',
          [UserStatus.Disabled]: 'default',
        };
        return <Tag color={colorMap[status]}>{UserStatusNameMap[status]}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_: any, record: VLUser) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleDetail(record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => handleManage(record)}>
            管理
          </Button>
          <Button
            type="link"
            size="small"
            danger={record.status === UserStatus.Active}
            onClick={() => handleFreeze(record)}
          >
            {record.status === UserStatus.Frozen ? '解冻' : '冻结'}
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
          <Form.Item name="vlid" label="VLID">
            <Input
              placeholder="支持精确搜索，由4-5位数字"
              style={{ width: 250 }}
              allowClear
            />
          </Form.Item>
          <Form.Item name="signInfo" label="签约信息">
            <Input placeholder="搜索名称" style={{ width: 200 }} allowClear />
          </Form.Item>
          {searchExpanded && (
            <Form.Item name="authStatus" label="授权状态">
              <Select placeholder="请选择" style={{ width: 150 }} allowClear>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="authorized">已授权</Select.Option>
                <Select.Option value="unauthorized">未授权</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Space>
              <Button
                type="link"
                icon={searchExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setSearchExpanded(!searchExpanded)}
              >
                {searchExpanded ? '收起' : '展开'}
              </Button>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 操作按钮区域 */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>VL用户列表</div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => loadData()}>
              刷新
            </Button>
            <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
              添加账号
            </Button>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              数据导出
            </Button>
          </Space>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="vlid"
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

      {/* 详情弹框 */}
      <DetailModal
        visible={detailModalVisible}
        record={currentRecord}
        onClose={() => {
          setDetailModalVisible(false);
          setCurrentRecord(null);
        }}
      />

      {/* 管理弹框 */}
      <ManageModal
        visible={manageModalVisible}
        record={currentRecord}
        onClose={() => {
          setManageModalVisible(false);
          setCurrentRecord(null);
        }}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* 添加账号弹框 */}
      <AddModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
        }}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
};

export default VLUserList;



