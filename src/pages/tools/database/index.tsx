/**
 * 数据库管理页面
 * 功能点ID: VL-TOOL-001
 */

import React, { useState, useEffect } from 'react';
import { Card, Tabs, message, Spin } from 'antd';
import { DatabaseOutlined, LinkOutlined, CodeOutlined } from '@ant-design/icons';
import TableSchema from './components/TableSchema';
import TableRelations from './components/TableRelations';
import SQLQuery from './components/SQLQuery';
import type { TableInfo, ForeignKeyInfo } from '@/types/database';
import { getTables, getRelationships } from '@/services/database';
import './index.less';

const { TabPane } = Tabs;

const DatabaseManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [relationships, setRelationships] = useState<ForeignKeyInfo[]>([]);
  const [activeTab, setActiveTab] = useState('schema');

  // 加载表结构
  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await getTables();
      setTables(data);
    } catch (error: any) {
      message.error(`加载表结构失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 加载表关系
  const loadRelationships = async () => {
    setLoading(true);
    try {
      const data = await getRelationships();
      setRelationships(data);
    } catch (error: any) {
      message.error(`加载表关系失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    loadTables();
    loadRelationships();
  }, []);

  // Tab切换时刷新数据
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'schema') {
      loadTables();
    } else if (key === 'relations') {
      loadRelationships();
    }
  };

  return (
    <div className="database-management-page">
      <Card 
        title={
          <div className="page-header">
            <DatabaseOutlined style={{ marginRight: 8 }} />
            数据库管理
          </div>
        }
        bordered={false}
      >
        <Spin spinning={loading}>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane 
              tab={
                <span>
                  <DatabaseOutlined />
                  表结构
                </span>
              } 
              key="schema"
            >
              <TableSchema tables={tables} onRefresh={loadTables} />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <LinkOutlined />
                  表关系
                </span>
              } 
              key="relations"
            >
              <TableRelations relationships={relationships} onRefresh={loadRelationships} />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <CodeOutlined />
                  SQL查询
                </span>
              } 
              key="query"
            >
              <SQLQuery />
            </TabPane>
          </Tabs>
        </Spin>
      </Card>
    </div>
  );
};

export default DatabaseManagement;

