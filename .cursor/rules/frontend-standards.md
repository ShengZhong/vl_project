# 前端代码开发规范 - Umi + React + Ant Design v4

## 技术栈约束

- **前端框架**：Umi 3.5+ + React 17.0+
- **UI 组件库**：强制使用 Ant Design v4.24.16
- **开发语言**：TypeScript 4.9+
- **状态管理**：Dva（基于 Redux）
- **布局要求**：顶部导航栏 + 左侧菜单栏 + 右侧内容区

## 强制使用 Ant Design v4 组件规则

### 核心约束

- **严格限制**：所有生成的页面和组件必须使用 Ant Design v4 版本的组件
- **版本锁定**：使用 antd@^4.24.16（最新的 v4 版本）
- **禁止使用**：不得使用 Ant Design v5 的任何组件或 API

### 导入规范

```typescript
// ✅ 正确的导入方式
import { Button, Input, Form, Table, Modal, DatePicker } from 'antd';
import { FormInstance } from 'antd/lib/form';
import type { ColumnsType } from 'antd/lib/table';
```

```typescript
// ❌ 错误的导入方式
import { Button } from 'antd'; // v5 的导入方式
import type { FormProps } from 'antd/es/form'; // v5 的类型路径
```

## 组件使用规范

### 表单组件 (Form)

```typescript
// ✅ Ant Design v4 表单写法
import React from 'react';
import { Form, Input, Button, message } from 'antd';

const MyForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    message.success('提交成功');
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};
```

### 模态框 (Modal)

```typescript
// ✅ v4 模态框用法
import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const MyModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Values:', values);
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开弹框
      </Button>
      <Modal
        title="标题"
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
```

```typescript
// ❌ v5 的写法（禁止使用）
<Modal
  open={visible}  // v5 使用 open，v4 使用 visible
  onOk={handleOk}
>
  ...
</Modal>
```

### 表格组件 (Table)

```typescript
// ✅ v4 表格用法
import React from 'react';
import { Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/lib/table';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const MyTable: React.FC = () => {
  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    { key: '1', name: '张三', age: 32, address: '北京' },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
    />
  );
};
```

## Umi 框架使用规范

### 项目结构

```
src/
├── components/      # 公共组件
├── layouts/         # 布局组件
│   └── index.tsx    # 主布局
├── models/          # Dva 数据模型
├── pages/           # 页面组件
│   ├── dashboard/   # 仪表盘
│   └── user/        # 用户管理
├── services/        # API 服务
├── types/           # TypeScript 类型定义
└── utils/           # 工具函数
    └── request.ts   # 请求封装
```

### 路由配置 (.umirc.ts)

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: '@/pages/dashboard/index' },
        {
          path: '/user',
          routes: [
            { path: '/user/list', component: '@/pages/user/list/index' },
          ],
        },
      ],
    },
  ],
  antd: {
    dark: false,
    compact: false,
  },
  dva: {
    hmr: true,
  },
});
```

### 页面组件规范

```typescript
// ✅ 标准页面组件结构
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // API 调用
      const response = await fetchUserList();
      setDataSource(response.data);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
  ];

  return (
    <Card
      title="用户列表"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          新建用户
        </Button>
      }
    >
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
      />

      <Modal
        title="新建用户"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserList;
```

## 布局设计规范

### 主布局结构

- **顶部导航栏**：固定在顶部，包含 Logo、菜单折叠按钮、用户信息
- **左侧菜单栏**：支持最多两层菜单结构，可折叠，与路由对应
- **右侧内容区**：主要内容展示区域，包含面包屑导航
- **响应式设计**：小屏幕自动折叠菜单

### 标准布局代码模板

参见 `src/layouts/index.tsx`

## Modal 弹框开发规范

### 强制使用 Modal 弹框的场景

- **详情页面**：所有详情查看功能必须使用 Modal 弹框形式
- **新建页面**：所有新增功能必须使用 Modal 弹框形式
- **编辑页面**：所有编辑功能必须使用 Modal 弹框形式
- **确认操作**：删除、批量操作等确认对话框

### 禁止的页面跳转模式

- ❌ 不使用独立的路由页面进行详情查看
- ❌ 不使用独立的路由页面进行新增操作
- ❌ 不使用独立的路由页面进行编辑操作
- ❌ 不使用 Drawer 组件替代 Modal（除非特殊需求）

### Modal 弹框最佳实践

```typescript
// ✅ 推荐的 Modal 使用方式
import React, { useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';

interface DetailModalProps {
  record: any;
  visible: boolean;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ record, visible, onClose }) => {
  return (
    <Modal
      title="查看详情"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
      width={800}
    >
      <Descriptions column={2}>
        <Descriptions.Item label="姓名">{record?.name}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{record?.email}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

// 在列表页中使用
const ListPage: React.FC = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const showDetail = (record: any) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  return (
    <>
      <Table
        columns={[
          {
            title: '操作',
            render: (_, record) => (
              <Button type="link" onClick={() => showDetail(record)}>
                查看详情
              </Button>
            ),
          },
        ]}
      />
      <DetailModal
        record={currentRecord}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
      />
    </>
  );
};
```

## TypeScript 类型定义规范

### 类型文件组织

```
src/types/
├── common.ts        # 通用类型
├── user.ts          # 用户相关类型
└── api.ts           # API 响应类型
```

### 类型定义示例

```typescript
// src/types/user.ts

// 用户基础信息
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// 用户角色枚举
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// 用户状态枚举
export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Banned = 'banned',
}

// 用户列表查询参数
export interface UserListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
}

// 用户列表响应
export interface UserListResponse {
  list: User[];
  total: number;
  pageNum: number;
  pageSize: number;
}
```

## API 服务层规范

```typescript
// src/services/user.ts
import request from '@/utils/request';
import type { User, UserListParams, UserListResponse } from '@/types/user';

// 获取用户列表
export async function getUserList(params: UserListParams): Promise<UserListResponse> {
  return request('/api/users', {
    method: 'GET',
    params,
  });
}

// 获取用户详情
export async function getUserDetail(id: string): Promise<User> {
  return request(`/api/users/${id}`, {
    method: 'GET',
  });
}

// 创建用户
export async function createUser(data: Partial<User>): Promise<User> {
  return request('/api/users', {
    method: 'POST',
    data,
  });
}

// 更新用户
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除用户
export async function deleteUser(id: string): Promise<void> {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
```

## 检查清单

在生成任何页面或组件时，请确认：

- [ ] 使用 Umi + React 技术栈
- [ ] 遵循指定的项目结构
- [ ] 实现顶部导航 + 左侧菜单 + 右侧内容的布局
- [ ] 使用 Ant Design v4 组件（不使用 v5）
- [ ] 支持响应式设计
- [ ] 详情、新建、编辑功能使用 Modal 弹框形式
- [ ] 代码具有完整的 TypeScript 类型定义
- [ ] 所有异步操作有 loading 状态
- [ ] 所有操作有成功/失败的用户反馈
- [ ] 表单有完整的校验规则

## 常见错误与修正

### 错误1：使用 v5 的 API

```typescript
// ❌ 错误
<Modal open={visible} />

// ✅ 正确
<Modal visible={visible} />
```

### 错误2：缺少类型定义

```typescript
// ❌ 错误
const handleSubmit = (values) => {
  console.log(values);
};

// ✅ 正确
interface FormValues {
  name: string;
  email: string;
}

const handleSubmit = (values: FormValues) => {
  console.log(values);
};
```

### 错误3：未处理异步错误

```typescript
// ❌ 错误
const loadData = async () => {
  const data = await fetchData();
  setData(data);
};

// ✅ 正确
const loadData = async () => {
  try {
    setLoading(true);
    const data = await fetchData();
    setData(data);
  } catch (error) {
    message.error('加载失败');
  } finally {
    setLoading(false);
  }
};
```

---

**最后更新**：2025-01-15  
**版本**：v1.0

