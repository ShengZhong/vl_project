import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Modal } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  TeamOutlined,
  DatabaseOutlined,
  IdcardOutlined,
  BankOutlined,
  FileTextOutlined,
  AuditOutlined,
  DollarOutlined,
  SoundOutlined,
  AppstoreOutlined,
  FundOutlined,
  LineChartOutlined,
  FileSearchOutlined,
  ShoppingOutlined,
  PieChartOutlined,
  MessageOutlined,
  ToolOutlined,
  WalletOutlined,
  EditOutlined,
  FormOutlined,
  SafetyOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  SettingOutlined,
  ReadOutlined,
  ApiOutlined,
  HddOutlined,
  EyeOutlined,
  CloudServerOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { history, Link } from 'umi';
// import ProfileModal from '@/pages/user/profile/ProfileModal';
// import PasswordModal from '@/pages/user/profile/PasswordModal';
import './index.less';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // 面包屑路由映射
  const breadcrumbNameMap: Record<string, string[]> = {
    '/dashboard': ['首页', '业务概览'],
    '/vluser/list': ['首页', '基础数据', 'VL用户列表'],
    '/vlaccount/list': ['首页', '基础数据', 'VL账号列表'],
    '/entity/list': ['首页', '基础数据', '结算主体'],
    '/contract/list': ['首页', '基础数据', '签约信息'],
    '/agreement/list': ['首页', '基础数据', '合同条款'],
    '/payment/manage': ['首页', '基础数据', '欠款管理'],
    '/advertiser/list': ['首页', '基础数据', '广告账户'],
    '/bigadvertiser/list': ['首页', '基础数据', '大盘广告账户'],
    '/bigproject/list': ['首页', '基础数据', '大盘项目目标'],
    '/churnrate/list': ['首页', '基础数据', '媒体Churn Rate'],
    '/origindata/list': ['首页', '基础数据', '原始合同数据'],
    '/metaadguidance/list': ['首页', '工具类', 'Meta广告指导'],
    '/metaadguidance/recommendation-detail': ['首页', '工具类', 'Meta广告指导', '建议回传详情'],
    '/metaadguidance/metric-detail': ['首页', '工具类', 'Meta广告指导', '指标回传详情'],
  };

  // 获取当前路径的面包屑
  const getBreadcrumbItems = () => {
    const pathname = history.location.pathname;
    return breadcrumbNameMap[pathname] || ['首页'];
  };

  // 菜单配置
  const basicDataMenu = {
    key: 'basic-data',
    icon: <DatabaseOutlined />,
    label: '基础数据',
    children: [
      {
        key: '/vluser/list',
        icon: <TeamOutlined />,
        label: <Link to="/vluser/list">VL用户列表</Link>,
      },
      {
        key: '/vlaccount/list',
        icon: <IdcardOutlined />,
        label: <Link to="/vlaccount/list">VL账号列表</Link>,
      },
      {
        key: '/entity/list',
        icon: <BankOutlined />,
        label: <Link to="/entity/list">结算主体</Link>,
      },
      {
        key: '/contract/list',
        icon: <FileTextOutlined />,
        label: <Link to="/contract/list">签约信息</Link>,
      },
      {
        key: '/agreement/list',
        icon: <AuditOutlined />,
        label: <Link to="/agreement/list">合同条款</Link>,
      },
      {
        key: '/payment/manage',
        icon: <DollarOutlined />,
        label: <Link to="/payment/manage">欠款管理</Link>,
      },
      {
        key: '/advertiser/list',
        icon: <SoundOutlined />,
        label: <Link to="/advertiser/list">广告账户</Link>,
      },
      {
        key: '/bigadvertiser/list',
        icon: <AppstoreOutlined />,
        label: <Link to="/bigadvertiser/list">大盘广告账户</Link>,
      },
      {
        key: '/bigproject/list',
        icon: <FundOutlined />,
        label: <Link to="/bigproject/list">大盘项目目标</Link>,
      },
      {
        key: '/churnrate/list',
        icon: <LineChartOutlined />,
        label: <Link to="/churnrate/list">媒体Churn Rate</Link>,
      },
      {
        key: '/origindata/list',
        icon: <FileSearchOutlined />,
        label: <Link to="/origindata/list">原始合同数据</Link>,
      },
    ],
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">业务概览</Link>,
    },
    basicDataMenu,    // 销售管理
    {
      key: 'sales-manage',
      icon: <ShoppingOutlined />,
      label: '销售管理',
      children: [
        {
          key: '/sales/pending',
          label: <Link to="/sales/pending">待补充功能</Link>,
        },
      ],
    },
    // 对账结算
    {
      key: 'account-settlement',
      icon: <PieChartOutlined />,
      label: '对账结算',
      children: [
        {
          key: '/settlement/pending',
          label: <Link to="/settlement/pending">待补充功能</Link>,
        },
      ],
    },
    // TikTok开户
    {
      key: 'tiktok-account',
      icon: <MessageOutlined />,
      label: 'TikTok开户',
      children: [
        {
          key: '/tiktok/pending',
          label: <Link to="/tiktok/pending">待补充功能</Link>,
        },
      ],
    },
    // Microsoft开户
    {
      key: 'microsoft-account',
      icon: <ToolOutlined />,
      label: 'Microsoft开户',
      children: [
        {
          key: '/microsoft/pending',
          label: <Link to="/microsoft/pending">待补充功能</Link>,
        },
      ],
    },
    // Snapchat开户
    {
      key: 'snapchat-account',
      icon: <MessageOutlined />,
      label: 'Snapchat开户',
      children: [
        {
          key: '/snapchat/pending',
          label: <Link to="/snapchat/pending">待补充功能</Link>,
        },
      ],
    },
    // 媒体资产
    {
      key: 'media-assets',
      icon: <WalletOutlined />,
      label: '媒体资产',
      children: [
        {
          key: '/media/pending',
          label: <Link to="/media/pending">待补充功能</Link>,
        },
      ],
    },
    // 财务管理
    {
      key: 'finance-manage',
      icon: <DollarOutlined />,
      label: '财务管理',
      children: [
        {
          key: '/finance/pending',
          label: <Link to="/finance/pending">待补充功能</Link>,
        },
      ],
    },
    // 额度管理
    {
      key: 'quota-manage',
      icon: <EditOutlined />,
      label: '额度管理',
      children: [
        {
          key: '/quota/pending',
          label: <Link to="/quota/pending">待补充功能</Link>,
        },
      ],
    },
    // 业务申请
    {
      key: 'business-apply',
      icon: <FormOutlined />,
      label: '业务申请',
      children: [
        {
          key: '/apply/pending',
          label: <Link to="/apply/pending">待补充功能</Link>,
        },
      ],
    },
    // 新兴媒体批处理
    {
      key: 'emerging-media',
      icon: <SafetyOutlined />,
      label: '新兴媒体批处理',
      children: [
        {
          key: '/emerging/pending',
          label: <Link to="/emerging/pending">待补充功能</Link>,
        },
      ],
    },
    // Tiktok批处理
    {
      key: 'tiktok-batch',
      icon: <ApiOutlined />,
      label: 'Tiktok批处理',
      children: [
        {
          key: '/tiktokbatch/pending',
          label: <Link to="/tiktokbatch/pending">待补充功能</Link>,
        },
      ],
    },
    // 数据分析
    {
      key: 'data-analysis',
      icon: <BarChartOutlined />,
      label: '数据分析',
      children: [
        {
          key: '/analysis/pending',
          label: <Link to="/analysis/pending">待补充功能</Link>,
        },
      ],
    },
    // 数据看板
    {
      key: 'data-dashboard',
      icon: <LineChartOutlined />,
      label: '数据看板',
      children: [
        {
          key: '/datadashboard/pending',
          label: <Link to="/datadashboard/pending">待补充功能</Link>,
        },
      ],
    },
    // 行业看板
    {
      key: 'industry-dashboard',
      icon: <AreaChartOutlined />,
      label: '行业看板',
      children: [
        {
          key: '/industry/pending',
          label: <Link to="/industry/pending">待补充功能</Link>,
        },
      ],
    },
    // 品牌客户设置
    {
      key: 'brand-settings',
      icon: <SettingOutlined />,
      label: '品牌客户设置',
      children: [
        {
          key: '/brand/pending',
          label: <Link to="/brand/pending">待补充功能</Link>,
        },
      ],
    },
    // 品牌知识中心
    {
      key: 'brand-knowledge',
      icon: <ReadOutlined />,
      label: '品牌知识中心',
      children: [
        {
          key: '/knowledge/pending',
          label: <Link to="/knowledge/pending">待补充功能</Link>,
        },
      ],
    },
    // 工具类
    {
      key: 'tools',
      icon: <ApiOutlined />,
      label: '工具类',
      children: [
        {
          key: '/metaadguidance/list',
          label: <Link to="/metaadguidance/list">Meta广告指导</Link>,
        },
        {
          key: '/tools/pending',
          label: <Link to="/tools/pending">待补充功能</Link>,
        },
      ],
    },
    // 权限管理
    {
      key: 'permission-manage',
      icon: <HddOutlined />,
      label: '权限管理',
      children: [
        {
          key: '/permission/pending',
          label: <Link to="/permission/pending">待补充功能</Link>,
        },
      ],
    },
    // 监控预警
    {
      key: 'monitor-alert',
      icon: <EyeOutlined />,
      label: '监控预警',
      children: [
        {
          key: '/monitor/pending',
          label: <Link to="/monitor/pending">待补充功能</Link>,
        },
      ],
    },
    // BlueAff
    {
      key: 'blueaff',
      icon: <CloudServerOutlined />,
      label: 'BlueAff',
      children: [
        {
          key: '/blueaff/pending',
          label: <Link to="/blueaff/pending">待补充功能</Link>,
        },
      ],
    },
    // 黑白名单配置
    {
      key: 'blackwhite-list',
      icon: <FolderOutlined />,
      label: '黑白名单配置',
      children: [
        {
          key: '/blackwhite/pending',
          label: <Link to="/blackwhite/pending">待补充功能</Link>,
        },
      ],
    },

  ];

  // 处理用户菜单点击
  const handleUserMenuClick = (key: string) => {
    switch (key) {
      case 'profile':
        setProfileModalVisible(true);
        break;
      case 'password':
        setPasswordModalVisible(true);
        break;
      case 'logout':
        Modal.confirm({
          title: '确认退出',
          content: '您确定要退出登录吗?',
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            // 清除本地存储
            localStorage.clear();
            sessionStorage.clear();
            // 跳转到登录页
            history.push('/login');
          },
        });
        break;
      default:
        break;
    }
  };

  // 用户菜单
  const userMenu = (
    <Menu onClick={({ key }) => handleUserMenuClick(key)}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人信息
      </Menu.Item>
      <Menu.Item key="password" icon={<KeyOutlined />}>
        修改密码
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
            {getBreadcrumbItems().map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>

        {/* 主内容区 */}
        <Content className="site-layout-content">
          {children}
        </Content>
      </Layout>

      {/* 个人信息弹框 */}
      {/* {profileModalVisible && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
        />
      )} */}

      {/* 修改密码弹框 */}
      {/* {passwordModalVisible && (
        <PasswordModal
          visible={passwordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
        />
      )} */}
    </Layout>
  );
};

export default BasicLayout;

