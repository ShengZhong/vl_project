import React, { useEffect, useState } from 'react';
import { Modal, Select, message } from 'antd';
import { request } from 'umi';
import { UserProfile } from '@/types/profile';

interface ConfigModalProps {
  visible: boolean;
  targetId: string;
  targetName: string;
  targetRole: 'sales' | 'ae'; // 当前操作的目标角色
  initialIds: string[]; // 已关联的 ID 列表
  onCancel: () => void;
  onOk: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  visible,
  targetId,
  targetName,
  targetRole,
  initialIds,
  onCancel,
  onOk,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [options, setOptions] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 初始化选中项
  useEffect(() => {
    if (visible) {
      setSelectedIds(initialIds);
      fetchOptions();
    }
  }, [visible, initialIds]);

  // 获取可选项列表
  const fetchOptions = async () => {
    try {
      setLoading(true);
      // 如果目标是 Sales，则需要选择 AE；反之亦然
      const url = targetRole === 'sales' 
        ? '/api/permission/users/ae' 
        : '/api/permission/users/sales';
        
      const res = await request(url);
      if (res.code === 200) {
        setOptions(res.data);
      }
    } catch (error) {
      message.error('获取列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // 计算新增和删除
      const toAdd = selectedIds.filter(id => !initialIds.includes(id));
      const toRemove = initialIds.filter(id => !selectedIds.includes(id));

      // 构建请求参数
      const buildParams = (ids: string[]) => {
        if (targetRole === 'sales') {
          return { salesId: targetId, aeIds: ids };
        } else {
          return { aeId: targetId, salesIds: ids };
        }
      };

      if (toAdd.length > 0) {
        await request('/api/permission/sales-ae/bind', {
          method: 'POST',
          data: buildParams(toAdd),
        });
      }

      if (toRemove.length > 0) {
        await request('/api/permission/sales-ae/unbind', {
          method: 'POST',
          data: buildParams(toRemove),
        });
      }

      message.success('保存成功');
      onOk();
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const title = targetRole === 'sales' 
    ? `关联 AE - ${targetName}` 
    : `配置销售 - ${targetName}`;
    
  const placeholder = targetRole === 'sales' 
    ? '请选择 AE' 
    : '请选择销售人员';

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={submitting}
      width={600}
    >
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder={placeholder}
        value={selectedIds}
        onChange={setSelectedIds}
        loading={loading}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
        }
      >
        {options.map(u => (
          <Select.Option key={u.userId} value={u.userId}>
            {u.name} ({u.email})
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default ConfigModal;
