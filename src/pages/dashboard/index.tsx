import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>业务概览</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日访问量"
              value={1128}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活跃用户"
              value={93}
              suffix="/ 100"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="系统状态"
              value="正常"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 16 }}>
        <h3>欢迎使用 VisionLine 产品原型平台</h3>
        <p>这是一个基于 Umi + React + Ant Design v4 的产品原型项目。</p>
        <p>请参考项目文档开始创建您的第一个功能模块。</p>
      </Card>
    </div>
  );
};

export default Dashboard;

