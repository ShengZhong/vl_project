/**
 * 表结构展示组件
 * 功能点ID: VL-TOOL-001
 */

import React, { useState } from 'react';
import { Collapse, Table, Input, Button, Tag, Space, message, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, KeyOutlined, LinkOutlined } from '@ant-design/icons';
import type { TableInfo, TableColumn } from '@/types/database';

const { Panel } = Collapse;
const { Search } = Input;

interface TableSchemaProps {
  tables: TableInfo[];
  onRefresh: () => void;
}

const TableSchema: React.FC<TableSchemaProps> = ({ tables, onRefresh }) => {
  const [searchText, setSearchText] = useState('');

  // 过滤表
  const filteredTables = tables.filter(table => 
    table.tableName.toLowerCase().includes(searchText.toLowerCase())
  );

  // 表字段列定义
  const columns = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text: string, record: TableColumn) => (
        <Space>
          <span style={{ fontWeight: record.primaryKey ? 'bold' : 'normal' }}>
            {text}
          </span>
          {record.primaryKey && (
            <Tooltip title="主键">
              <KeyOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
      render: (text: string) => (
        <Tag color={
          text === 'TEXT' ? 'blue' : 
          text === 'INTEGER' ? 'green' : 
          text === 'REAL' ? 'orange' : 'default'
        }>
          {text}
        </Tag>
      ),
    },
    {
      title: '是否必填',
      dataIndex: 'notNull',
      key: 'notNull',
      width: '15%',
      render: (notNull: boolean) => (
        notNull ? <Tag color="red">必填</Tag> : <Tag>可选</Tag>
      ),
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: '25%',
      render: (value: any) => (
        value !== null && value !== undefined ? (
          <code style={{ fontSize: '12px' }}>{String(value)}</code>
        ) : (
          <span style={{ color: '#999' }}>-</span>
        )
      ),
    },
    {
      title: '备注',
      key: 'remark',
      width: '15%',
      render: (record: TableColumn) => {
        const remarks = [];
        if (record.primaryKey) {
          remarks.push(<Tag key="pk" color="blue" icon={<KeyOutlined />}>主键</Tag>);
        }
        // 根据字段名判断是否可能是外键（以Id结尾且不是主键）
        if (record.name.endsWith('Id') && !record.primaryKey) {
          remarks.push(<Tag key="fk" color="purple" icon={<LinkOutlined />}>外键</Tag>);
        }
        return remarks.length > 0 ? <Space>{remarks}</Space> : <span style={{ color: '#999' }}>-</span>;
      },
    },
  ];

  // 复制表结构DDL
  const copyTableDDL = (tableName: string) => {
    // 简单的DDL生成（实际可以更完善）
    const table = tables.find(t => t.tableName === tableName);
    if (!table) return;

    const ddl = `CREATE TABLE ${tableName} (\n${table.columns.map(col => {
      let line = `  ${col.name} ${col.type}`;
      if (col.primaryKey) line += ' PRIMARY KEY';
      if (col.notNull && !col.primaryKey) line += ' NOT NULL';
      if (col.defaultValue !== null && col.defaultValue !== undefined) {
        line += ` DEFAULT ${col.defaultValue}`;
      }
      return line;
    }).join(',\n')}\n);`;

    navigator.clipboard.writeText(ddl);
    message.success('表结构已复制到剪贴板');
  };

  return (
    <div className="table-schema-container">
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

      {filteredTables.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          {searchText ? '未找到匹配的表' : '数据库中暂无表'}
        </div>
      ) : (
        <Collapse 
          bordered={false}
          style={{ background: '#fff' }}
        >
          {filteredTables.map(table => (
            <Panel
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <strong>{table.tableName}</strong>
                    <Tag color="default">{table.columns.length} 字段</Tag>
                  </Space>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTableDDL(table.tableName);
                    }}
                  >
                    复制DDL
                  </Button>
                </div>
              }
              key={table.tableName}
            >
              <Table
                columns={columns}
                dataSource={table.columns}
                rowKey="name"
                pagination={false}
                size="small"
                bordered
              />
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default TableSchema;

