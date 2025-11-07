/**
 * 修改密码弹框组件
 * 功能点 ID: VL-USR-002
 * 
 * 功能说明:
 * 1. 用户修改登录密码
 * 2. 需要验证旧密码
 * 3. 修改成功后自动退出登录
 */

import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { history } from 'umi';
import type { ChangePasswordParams } from '@/types/profile';
import { changePassword } from '@/services/profile';

interface PasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 提交修改密码
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const params: ChangePasswordParams = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      const response = await changePassword(params);

      if (response.code === 200) {
        message.success('密码修改成功,请重新登录');
        
        // 关闭弹框
        onClose();
        form.resetFields();

        // 2秒后清除本地存储并跳转到登录页
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          history.push('/login');
        }, 2000);
      } else {
        message.error(response.message || '修改失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        // 表单校验失败
        message.warning('请检查表单输入');
      } else {
        console.error('修改密码失败:', error);
        message.error('修改失败,请稍后重试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 取消修改
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="修改密码"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="确定"
      cancelText="取消"
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="oldPassword"
          label="旧密码"
          rules={[
            { required: true, message: '请输入旧密码' },
            { min: 6, max: 20, message: '密码长度为6-20个字符' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入旧密码"
            maxLength={20}
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, max: 20, message: '密码长度为6-20个字符' },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/,
              message: '密码需包含字母和数字,长度6-20位',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const oldPassword = getFieldValue('oldPassword');
                if (!value || oldPassword !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('新密码不能与旧密码相同'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码(需包含字母和数字)"
            maxLength={20}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码"
            maxLength={20}
            autoComplete="new-password"
          />
        </Form.Item>

        <div style={{ padding: '12px 16px', background: '#f6f8fa', borderRadius: 4 }}>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            <strong>密码要求:</strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#888', fontSize: 13 }}>
            <li>长度为 6-20 个字符</li>
            <li>必须包含字母和数字</li>
            <li>新密码不能与旧密码相同</li>
          </ul>
          <div style={{ marginTop: 12, color: '#ff4d4f', fontSize: 13 }}>
            ⚠️ 修改密码后将自动退出登录,请牢记新密码
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
