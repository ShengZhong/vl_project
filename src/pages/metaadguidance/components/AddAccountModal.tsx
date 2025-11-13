/**
 * 新增客户弹框组件
 * 功能点 ID: ZT-TOOL-001
 */

import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { AddAccountParams } from '@/types/metaadguidance';
import { addAccount } from '@/services/metaadguidance';

interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const params: AddAccountParams = {
        adAccountId: values.adAccountId,
        consolidatedEntity: values.consolidatedEntity,
        settlementEntity: values.settlementEntity,
        accountInfo: values.accountInfo,
        personnelInfo: {
          contractSales: values.contractSales,
          responsibleSales: values.responsibleSales,
        },
      };

      const response = await addAccount(params);
      if (response && response.code === 200) {
        message.success('新增成功');
        form.resetFields();
        // 先关闭弹框
        onClose();
        // 然后刷新列表
        setTimeout(() => {
          onSuccess();
        }, 100);
      } else {
        message.error(response?.message || '新增失败');
      }
    } catch (error: any) {
      console.error('新增失败:', error);
      // 检查是否是表单校验错误
      if (error?.errorFields) {
        return; // 表单校验错误，不显示错误提示
      }
      // 检查是否是API返回的错误（有code字段）
      if (error?.code !== undefined && error?.code !== 200) {
        message.error(error.message || '新增失败');
      } else if (error?.response) {
        // HTTP错误
        message.error(error.response?.statusText || '新增失败，请重试');
      } else {
        // 其他错误
        message.error(error?.message || '新增失败，请重试');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="新增客户"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={submitting} onClick={handleSubmit}>
          确定
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="adAccountId"
          label="广告账户ID"
          rules={[{ required: true, message: '请输入广告账户ID' }]}
        >
          <Input placeholder="请输入广告账户ID" />
        </Form.Item>
        <Form.Item
          name="consolidatedEntity"
          label="合并主体"
          rules={[{ required: true, message: '请输入合并主体' }]}
        >
          <Input placeholder="请输入合并主体" />
        </Form.Item>
        <Form.Item
          name="settlementEntity"
          label="结算主体"
          rules={[{ required: true, message: '请输入结算主体' }]}
        >
          <Input placeholder="请输入结算主体" />
        </Form.Item>
        <Form.Item name="accountInfo" label="账户信息">
          <Input.TextArea placeholder="请输入账户信息" rows={3} />
        </Form.Item>
        <Form.Item name="contractSales" label="签约销售">
          <Input placeholder="请输入签约销售（邮箱或内部ID）" />
        </Form.Item>
        <Form.Item name="responsibleSales" label="负责销售">
          <Input placeholder="请输入负责销售（邮箱或内部ID）" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAccountModal;

