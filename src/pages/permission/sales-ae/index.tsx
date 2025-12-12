import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, message, Alert, Select, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout'; // Assuming we have pro-layout or standard layout
import { request } from 'umi';
import { UserProfile, UserRole } from '@/types/profile';
import RelationModal from './components/RelationModal';

const SalesAePermission: React.FC = () => {
  const [salesList, setSalesList] = useState<UserProfile[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSales, setCurrentSales] = useState<UserProfile | null>(null);

  // Debug state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [debugUsers, setDebugUsers] = useState<UserProfile[]>([]);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    fetchData();
    fetchDebugInfo();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 并行获取 Sales 列表和关系列表
      const [salesRes, relationsRes] = await Promise.all([
        request('/api/permission/users/sales'),
        request('/api/permission/sales-ae'),
      ]);

      if (salesRes.code === 200) {
        setSalesList(salesRes.data);
      }
      if (relationsRes.code === 200) {
        setRelations(relationsRes.data);
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchDebugInfo = async () => {
    try {
      const [userRes, listRes] = await Promise.all([
        request('/api/user/profile'),
        request('/api/debug/users'),
      ]);
      if (userRes.code === 200) setCurrentUser(userRes.data);
      if (listRes.code === 200) setDebugUsers(listRes.data);
    } catch (error) {
      console.error('获取调试信息失败');
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      setSwitching(true);
      const res = await request('/api/debug/switch-user', {
        method: 'POST',
        data: { userId },
      });
      if (res.code === 200) {
        message.success(`已切换为: ${userId}`);
        fetchDebugInfo();
        // 刷新 VL 用户列表页面可能会更好，但这里我们只刷新当前页面数据
        // 实际上切换用户后，应该去测试 /vlaccount/list 页面
      }
    } catch (error) {
      message.error('切换用户失败');
    } finally {
      setSwitching(false);
    }
  };

  const handleEdit = (record: UserProfile) => {
    setCurrentSales(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: '销售姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '关联 AE',
      key: 'aes',
      render: (_: any, record: UserProfile) => {
        // 找到该 Sales 关联的所有 AE
        const myRelations = relations.filter(r => r.salesId === record.userId);
        return (
          <Space wrap>
            {myRelations.map(r => (
              <Tag color="blue" key={r.id}>
                {r.aeName}
              </Tag>
            ))}
            {myRelations.length === 0 && <span style={{ color: '#999' }}>无关联 AE</span>}
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserProfile) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          关联 AE
        </Button>
      ),
    },
  ];

  return (
    <div>
       <Card style={{ marginBottom: 16 }} title="调试工具：切换用户">
        <Space>
          <span>当前用户: </span>
          <Tag color="green">
            {currentUser?.name} ({currentUser?.roleName})
          </Tag>
          <Select
            style={{ width: 200 }}
            placeholder="切换用户"
            loading={switching}
            onChange={handleSwitchUser}
            value={currentUser?.userId}
          >
            {debugUsers.map(u => (
              <Select.Option key={u.userId} value={u.userId}>
                {u.name} ({u.role})
              </Select.Option>
            ))}
          </Select>
          <span style={{ color: '#999', fontSize: 12 }}>
            * 切换后，请前往“VL用户列表”页面验证数据权限
          </span>
        </Space>
      </Card>

      <Card title="Sales-AE 关系配置">
        <Alert
          message="权限说明"
          description="在此配置 Sales 与 AE 的关联关系。关联后，AE 可以查看该 Sales 负责的所有客户数据。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Table
          columns={columns}
          dataSource={salesList}
          rowKey="userId"
          loading={loading}
          pagination={false}
        />
      </Card>

      {currentSales && (
        <RelationModal
          visible={modalVisible}
          salesId={currentSales.userId}
          salesName={currentSales.name}
          initialAeIds={relations
            .filter(r => r.salesId === currentSales.userId)
            .map(r => r.aeId)}
          onCancel={() => setModalVisible(false)}
          onOk={() => {
            setModalVisible(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default SalesAePermission;


