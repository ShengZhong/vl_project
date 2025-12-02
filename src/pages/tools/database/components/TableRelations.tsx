/**
 * 表关系展示组件
 * 功能点ID: VL-TOOL-001
 */

import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space } from 'antd';
import { SearchOutlined, ReloadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import type { ForeignKeyInfo } from '@/types/database';

const { Search } = Input;

interface TableRelationsProps {
  relationships: ForeignKeyInfo[];
  onRefresh: () => void;
}

const TableRelations: React.FC<TableRelationsProps> = ({ relationships, onRefresh }) => {
  const [searchText, setSearchText] = useState('');

  // 过滤表关系
  const filteredRelationships = relationships.filter(rel => 
    rel.childTable.toLowerCase().includes(searchText.toLowerCase()) ||
    rel.parentTable.toLowerCase().includes(searchText.toLowerCase())
  );

  // 表关系列定义
  const columns = [
    {
      title: '子表',
      dataIndex: 'childTable',
      key: 'childTable',
      width: '20%',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '子表字段',
      dataIndex: 'childColumn',
      key: 'childColumn',
      width: '15%',
      render: (text: string) => <code style={{ fontSize: '12px' }}>{text}</code>,
    },
    {
      title: '',
      key: 'arrow',
      width: '5%',
      align: 'center' as const,
      render: () => <ArrowRightOutlined style={{ color: '#1890ff' }} />,
    },
    {
      title: '父表',
      dataIndex: 'parentTable',
      key: 'parentTable',
      width: '20%',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '父表字段',
      dataIndex: 'parentColumn',
      key: 'parentColumn',
      width: '15%',
      render: (text: string) => <code style={{ fontSize: '12px' }}>{text}</code>,
    },
    {
      title: '删除规则',
      dataIndex: 'onDelete',
      key: 'onDelete',
      width: '12%',
      render: (text: string) => {
        const color = text === 'CASCADE' ? 'red' : 
                     text === 'SET NULL' ? 'orange' : 
                     text === 'RESTRICT' ? 'purple' : 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '更新规则',
      dataIndex: 'onUpdate',
      key: 'onUpdate',
      width: '13%',
      render: (text: string) => {
        const color = text === 'CASCADE' ? 'red' : 
                     text === 'SET NULL' ? 'orange' : 
                     text === 'RESTRICT' ? 'purple' : 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="table-relations-container">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="搜索表名"
          allowClear
          style={{ width: 300 }}
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onRefresh}
        >
          刷新
        </Button>
      </div>

      {filteredRelationships.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          {searchText ? '未找到匹配的表关系' : '数据库中暂无外键关系'}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <span>共 {filteredRelationships.length} 条外键关系</span>
              <Tag color="red">CASCADE - 级联删除/更新</Tag>
              <Tag color="orange">SET NULL - 设置为NULL</Tag>
              <Tag color="purple">RESTRICT - 限制删除</Tag>
              <Tag>NO ACTION - 无操作</Tag>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={filteredRelationships}
            rowKey={(record) => `${record.childTable}.${record.childColumn}`}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            size="middle"
            bordered
          />
        </>
      )}
    </div>
  );
};

export default TableRelations;

