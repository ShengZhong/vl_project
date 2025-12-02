/**
 * SQL查询组件
 * 功能点ID: VL-TOOL-001
 */

import React, { useState } from 'react';
import { Input, Button, Table, Space, message, Modal, Tag, Alert } from 'antd';
import { 
  PlayCircleOutlined, 
  ClearOutlined, 
  DownloadOutlined, 
  ClockCircleOutlined, 
  DatabaseOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import type { SQLQueryResult } from '@/types/database';
import { executeSQL } from '@/services/database';

const { TextArea } = Input;

const SQLQuery: React.FC = () => {
  const [sql, setSql] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SQLQueryResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 执行SQL
  const handleExecuteSQL = async (confirmed = false) => {
    if (!sql.trim()) {
      message.warning('请输入SQL语句');
      return;
    }

    setLoading(true);
    try {
      const response = await executeSQL({ sql, confirm: confirmed });

      if (response.success && response.data) {
        setResult(response.data);
        setShowResult(true);
        
        if (response.data.isModifyOperation) {
          message.success('SQL执行成功，数据已更新');
        } else {
          message.success(`查询成功，返回 ${response.data.rowCount} 行`);
        }
      } else if (response.needConfirm) {
        // 需要二次确认
        Modal.confirm({
          title: '确认执行修改操作',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              <p>您即将执行以下SQL语句：</p>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                maxHeight: '200px',
                overflow: 'auto',
              }}>
                {sql}
              </pre>
              <Alert 
                message="此操作将修改数据库数据，请确认是否继续？" 
                type="warning" 
                showIcon 
                style={{ marginTop: 12 }}
              />
            </div>
          ),
          okText: '确认执行',
          okType: 'danger',
          cancelText: '取消',
          width: 600,
          onOk: () => handleExecuteSQL(true),
        });
      } else {
        message.error(response.error || 'SQL执行失败');
      }
    } catch (error: any) {
      message.error(`SQL执行失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 清空编辑器
  const handleClear = () => {
    setSql('');
    setResult(null);
    setShowResult(false);
  };

  // 导出CSV
  const handleExportCSV = () => {
    if (!result || result.rowCount === 0) {
      message.warning('没有可导出的数据');
      return;
    }

    try {
      // 生成CSV内容
      const csvContent = [
        result.columns.join(','), // 表头
        ...result.values.map(row => 
          row.map(cell => {
            // 处理包含逗号的值
            const cellStr = cell === null || cell === undefined ? '' : String(cell);
            return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
          }).join(',')
        )
      ].join('\n');

      // 创建下载链接
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `query_result_${Date.now()}.csv`;
      link.click();

      message.success('CSV文件已下载');
    } catch (error: any) {
      message.error(`导出失败: ${error.message}`);
    }
  };

  // 生成表格列
  const tableColumns = result?.columns.map(col => ({
    title: col,
    dataIndex: col,
    key: col,
    width: 150,
    ellipsis: true,
  })) || [];

  // 生成表格数据
  const tableData = result?.values.map((row, index) => {
    const record: any = { key: index };
    result.columns.forEach((col, colIndex) => {
      record[col] = row[colIndex];
    });
    return record;
  }) || [];

  return (
    <div className="sql-query-container">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* SQL编辑器 */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <strong>SQL查询编辑器</strong>
          </div>
          <TextArea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="请输入SQL语句，例如: SELECT * FROM vlusers LIMIT 10"
            autoSize={{ minRows: 6, maxRows: 12 }}
            style={{ fontFamily: 'monospace', fontSize: '13px' }}
          />
        </div>

        {/* 操作按钮 */}
        <Space>
          <Button 
            type="primary" 
            icon={<PlayCircleOutlined />} 
            onClick={() => handleExecuteSQL(false)}
            loading={loading}
          >
            执行
          </Button>
          <Button 
            icon={<ClearOutlined />} 
            onClick={handleClear}
          >
            清空
          </Button>
          {result && result.rowCount > 0 && (
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExportCSV}
            >
              导出CSV
            </Button>
          )}
        </Space>

        {/* 安全提示 */}
        <Alert
          message="安全提示"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>UPDATE/DELETE/INSERT 操作需要二次确认</li>
              <li>禁止执行 DROP TABLE、ALTER TABLE 等DDL语句</li>
              <li>查询结果最多返回 1000 条（防止内存溢出）</li>
            </ul>
          }
          type="info"
          showIcon
        />

        {/* 查询结果 */}
        {showResult && result && (
          <div>
            <div style={{ 
              marginBottom: 12, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Space>
                <Tag icon={<DatabaseOutlined />} color="blue">
                  返回 {result.rowCount} 行
                </Tag>
                <Tag icon={<ClockCircleOutlined />} color="green">
                  耗时 {result.executionTime} ms
                </Tag>
                {result.isModifyOperation && (
                  <Tag color="orange">数据已修改</Tag>
                )}
              </Space>
            </div>

            {result.rowCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                查询成功，但没有返回数据
              </div>
            ) : (
              <Table
                columns={tableColumns}
                dataSource={tableData}
                pagination={{
                  pageSize: 50,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条`,
                }}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered
              />
            )}
          </div>
        )}
      </Space>
    </div>
  );
};

export default SQLQuery;

