/**
 * 个人信息弹框组件
 * 功能点 ID: VL-USR-002
 * 
 * 功能说明:
 * 1. 查看个人信息(只读模式)
 * 2. 编辑个人信息(编辑模式)
 * 3. 支持只读模式与编辑模式切换
 */

import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import type { UserProfile, UpdateProfileParams } from '@/types/profile';
import { getUserProfile, updateUserProfile } from '@/services/profile';
import moment from 'moment';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  // 加载用户信息
  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile();
      if (response.code === 200 && response.data) {
        setProfileData(response.data);
        // 回填表单数据
        form.setFieldsValue({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        });
      } else {
        message.error(response.message || '加载失败');
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
      message.error('加载失败,请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 弹框打开时加载数据
  useEffect(() => {
    if (visible) {
      loadUserProfile();
      setIsEditMode(false);
    }
  }, [visible]);

  // 切换到编辑模式
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // 取消编辑,切换回只读模式
  const handleCancelEdit = () => {
    setIsEditMode(false);
    // 恢复表单数据
    if (profileData) {
      form.setFieldsValue({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      });
    }
  };

  // 保存个人信息
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const params: UpdateProfileParams = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const response = await updateUserProfile(params);

      if (response.code === 200) {
        message.success('保存成功');
        setIsEditMode(false);
        // 重新加载数据
        await loadUserProfile();
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        // 表单校验失败
        message.warning('请检查表单输入');
      } else {
        console.error('保存失败:', error);
        message.error('保存失败,请稍后重试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 关闭弹框
  const handleClose = () => {
    if (isEditMode) {
      Modal.confirm({
        title: '确认关闭',
        content: '您有未保存的修改,确定要关闭吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          setIsEditMode(false);
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  // 渲染只读模式
  const renderReadOnlyMode = () => {
    if (!profileData) return null;

    return (
      <Descriptions column={2} bordered>
        <Descriptions.Item label="姓名" span={2}>
          <UserOutlined style={{ marginRight: 8 }} />
          {profileData.name}
        </Descriptions.Item>
        <Descriptions.Item label="用户名" span={2}>
          {profileData.username}
        </Descriptions.Item>
        <Descriptions.Item label="邮箱" span={2}>
          <MailOutlined style={{ marginRight: 8 }} />
          {profileData.email}
        </Descriptions.Item>
        <Descriptions.Item label="手机号" span={2}>
          <PhoneOutlined style={{ marginRight: 8 }} />
          {profileData.phone}
        </Descriptions.Item>
        <Descriptions.Item label="角色">
          {profileData.roleName}
        </Descriptions.Item>
        <Descriptions.Item label="部门">
          {profileData.department || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>
          {moment(profileData.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="最后登录时间" span={2}>
          {profileData.lastLoginAt
            ? moment(profileData.lastLoginAt).format('YYYY-MM-DD HH:mm:ss')
            : '-'}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // 渲染编辑模式
  const renderEditMode = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: profileData?.name,
          email: profileData?.email,
          phone: profileData?.phone,
        }}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: '请输入姓名' },
            { min: 2, max: 20, message: '姓名长度为2-20个字符' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
              message: '姓名只能包含中文、英文和空格',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入姓名"
            maxLength={20}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱地址' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="请输入邮箱"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的11位手机号',
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入手机号"
            maxLength={11}
          />
        </Form.Item>

        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="用户名" span={2}>
            {profileData?.username}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            {profileData?.roleName}
          </Descriptions.Item>
          <Descriptions.Item label="部门">
            {profileData?.department || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Form>
    );
  };

  return (
    <Modal
      title="个人信息"
      visible={visible}
      onCancel={handleClose}
      width={700}
      footer={
        isEditMode
          ? [
              <Button key="cancel" onClick={handleCancelEdit}>
                取消
              </Button>,
              <Button
                key="save"
                type="primary"
                loading={submitting}
                onClick={handleSave}
              >
                保存
              </Button>,
            ]
          : [
              <Button key="edit" onClick={handleEdit}>
                编辑
              </Button>,
              <Button key="close" type="primary" onClick={handleClose}>
                关闭
              </Button>,
            ]
      }
    >
      <Spin spinning={loading}>
        <div style={{ minHeight: 300 }}>
          {isEditMode ? renderEditMode() : renderReadOnlyMode()}
        </div>
      </Spin>
    </Modal>
  );
};

export default ProfileModal;
