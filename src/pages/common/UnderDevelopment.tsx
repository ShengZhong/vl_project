/**
 * 功能开发中页面
 */

import React from 'react';
import { Card, Button, Space } from 'antd';
import { RocketOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import './UnderDevelopment.less';

interface UnderDevelopmentProps {
  title?: string;
  description?: string;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({
  title = '功能开发中',
  description = '该功能正在紧急开发中，敬请期待...',
}) => {
  return (
    <Card>
      <div className="under-development-container">
        {/* 动态背景 */}
        <div className="background-animation">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>

        {/* 内容区域 */}
        <div className="content-wrapper">
          {/* 动态图标 */}
          <div className="icon-wrapper">
            <RocketOutlined className="rocket-icon" />
          </div>

          {/* 标题 */}
          <h1 className="title">{title}</h1>

          {/* 描述文字 */}
          <div className="description">
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            {description}
          </div>

          {/* 敬请期待文案 */}
          <div className="coming-soon">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="text">敬请期待</span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>

          {/* 按钮组 */}
          <Space size="middle" style={{ marginTop: 32 }}>
            <Button type="primary" size="large" onClick={() => history.goBack()}>
              返回上一页
            </Button>
            <Button size="large" onClick={() => history.push('/dashboard')}>
              返回首页
            </Button>
          </Space>

          {/* 提示信息 */}
          <div className="tips">
            我们的团队正在全力开发此功能，将尽快与您见面 🎉
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UnderDevelopment;

