/**
 * VL 用户管理弹框组件
 * 功能点 ID: VL-USR-003
 */

import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import type { VLUser, UpdateVLUserParams } from '@/types/vluser';
import { updateVLUser } from '@/services/vluser';

interface ManageModalProps {
  visible: boolean;
  record: VLUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ManageModal: React.FC<ManageModalProps> = ({
  visible,
  record,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 提交更新
  const handleSubmit = async () => {
    if (!record) return;

    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const params: UpdateVLUserParams = {
        contactPerson: values.contactPerson,
        phone: values.phone,
        customerSource: values.customerSource,
      };

      const response = await updateVLUser(record.vlid, params);

      if (response.code === 200) {
        message.success('更新成功');
        onClose();
        onSuccess();
      } else {
        message.error(response.message || '更新失败');
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.warning('请检查表单输入');
      } else {
        console.error('更新失败:', error);
        message.error('更新失败，请稍后重试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 弹框打开时初始化表单
  const handleAfterOpen = () => {
    if (record) {
      form.setFieldsValue({
        contactPerson: record.contactPerson,
        phone: record.phone,
        customerSource: record.customerSource,
      });
    }
  };

  return (
    <Modal
      title="管理用户"
      visible={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="保存"
      cancelText="取消"
      width={600}
      destroyOnClose
      afterClose={() => form.resetFields()}
      afterOpen={handleAfterOpen}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="VLID">
          <Input value={record?.vlid} disabled />
        </Form.Item>

        <Form.Item label="注册主体">
          <Input value={record?.registeredEntity} disabled />
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
            background: '#f6f8fa',
            borderRadius: 4,
            marginTop: 16,
          }}
        >
          <div style={{ color: '#666', fontSize: 13 }}>
            <strong>提示：</strong>
          </div>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#888', fontSize: 12 }}>
            <li>VLID 和注册主体不可修改</li>
            <li>手机号支持国内11位或国际号码</li>
            <li>修改后立即生效</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default ManageModal;



