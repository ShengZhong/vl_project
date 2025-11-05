import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { history, Link } from 'umi';
import './index.less';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // 菜单配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">业务概览</Link>,
    },
  ];

  // 用户菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人信息
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧菜单 */}
      <Sider trigger={null} collapsible collapsed={collapsed} width={200}>
        <div className="logo">
          <h1>{collapsed ? 'VL' : 'VisionLine'}</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[history.location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout className="site-layout">
        {/* 顶部导航 */}
        <Header className="site-layout-header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <div className="header-right">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="user-name">管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 面包屑 */}
        <div className="breadcrumb-wrapper">
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>业务概览</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* 主内容区 */}
        <Content className="site-layout-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;

