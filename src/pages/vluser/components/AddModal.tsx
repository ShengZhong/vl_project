/**
 * VL 添加账号弹框组件
 * 功能点 ID: VL-USR-003
 */

import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import type { CreateVLUserParams } from '@/types/vluser';
import { createVLUser } from '@/services/vluser';

interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 提交创建
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const params: CreateVLUserParams = {
        email: values.email,
        contactPerson: values.contactPerson,
        phone: values.phone,
        registeredEntity: values.registeredEntity,
        customerSource: values.customerSource,
      };

      const response = await createVLUser(params);

      if (response.code === 200) {
        message.success('创建成功');
        form.resetFields();
        onClose();
        onSuccess();
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.warning('请检查表单输入');
      } else {
        console.error('创建失败:', error);
        message.error('创建失败，请稍后重试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="添加账号"
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="确定"
      cancelText="取消"
      width={600}
      destroyOnClose
      afterClose={() => form.resetFields()}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="注册邮箱"
          rules={[
            { required: true, message: '请输入注册邮箱' },
            { type: 'email', message: '请输入正确的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入注册邮箱" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="registeredEntity"
          label="注册主体"
          rules={[
            { required: true, message: '请输入注册主体' },
            { min: 2, max: 100, message: '注册主体长度为2-100个字符' },
          ]}
        >
          <Input placeholder="请输入公司名称或个人姓名" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="contactPerson"
          label="联系人"
          rules={[
            { required: true, message: '请输入联系人' },
            { min: 2, max: 50, message: '联系人长度为2-50个字符' },
          ]}
        >
          <Input placeholder="请输入联系人" maxLength={50} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[3-9]\d{9}$|^\d{8,15}$/,
              message: '请输入正确的手机号',
            },
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={15} />
        </Form.Item>

        <Form.Item name="customerSource" label="客户来源">
          <Select placeholder="请选择客户来源">
            <Select.Option value="自助注册">自助注册</Select.Option>
            <Select.Option value="内部开通">内部开通</Select.Option>
            <Select.Option value="渠道推荐">渠道推荐</Select.Option>
            <Select.Option value="其他">其他</Select.Option>
          </Select>
        </Form.Item>

        <div
          style={{
            padding: '12px 16px',
            background: '#f0f7ff',
            borderRadius: 4,
            borderLeft: '3px solid #1890ff',
          }}
        >
          <div style={{ color: '#1890ff', fontSize: 13, fontWeight: 500 }}>
            说明：
          </div>
          <ul
            style={{
              margin: '8px 0 0 0',
              paddingLeft: 20,
              color: '#666',
              fontSize: 12,
            }}
          >
            <li>VLID 将由系统自动生成</li>
            <li>邮箱作为登录账号,不可重复</li>
            <li>创建成功后,用户将收到激活邮件</li>
            <li>初始状态为"未认领"</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default AddModal;



