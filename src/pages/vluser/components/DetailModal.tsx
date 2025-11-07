/**
 * VL 用户详情弹框组件
 * 功能点 ID: VL-USR-003
 */

import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Spin, message, Tag } from 'antd';
import moment from 'moment';
import type { VLUser } from '@/types/vluser';
import {
  ClaimStatusNameMap,
  CertStatusNameMap,
  UserStatusNameMap,
} from '@/types/vluser';
import { getVLUserDetail } from '@/services/vluser';

interface DetailModalProps {
  visible: boolean;
  record: VLUser | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, record, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<VLUser | null>(null);

  // 加载详情数据
  const loadDetail = async () => {
    if (!record) return;
    
    setLoading(true);
    try {
      const response = await getVLUserDetail(record.vlid);
      if (response.code === 200 && response.data) {
        setDetailData(response.data);
      } else {
        message.error(response.message || '加载失败');
      }
    } catch (error) {
      console.error('加载详情失败:', error);
      message.error('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && record) {
      loadDetail();
    }
  }, [visible, record]);

  return (
    <Modal
      title="用户详情"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {detailData && (
          <div>
            {/* 基本信息 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>
                基本信息
              </div>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="VLID">{detailData.vlid}</Descriptions.Item>
                <Descriptions.Item label="专属Token">
                  <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                    {detailData.token || '-'}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="注册邮箱">
                  {detailData.email}
                </Descriptions.Item>
                <Descriptions.Item label="联系人">
                  {detailData.contactPerson}
                </Descriptions.Item>
                <Descriptions.Item label="手机号">{detailData.phone}</Descriptions.Item>
                <Descriptions.Item label="客户来源">
                  {detailData.customerSource}
                </Descriptions.Item>
                <Descriptions.Item label="注册主体" span={2}>
                  {detailData.registeredEntity}
                </Descriptions.Item>
                <Descriptions.Item label="注册时间">
                  {moment(detailData.registeredTime).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="认领时间">
                  {detailData.claimTime
                    ? moment(detailData.claimTime).format('YYYY-MM-DD HH:mm:ss')
                    : '-'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* 状态信息 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>
                状态信息
              </div>
              <Descriptions column={3} bordered>
                <Descriptions.Item label="认领状态">
                  <Tag
                    color={
                      detailData.claimStatus === 'claimed' ? 'green' : 'default'
                    }
                  >
                    {ClaimStatusNameMap[detailData.claimStatus]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="认证状态">
                  <Tag
                    color={
                      detailData.certStatus === 'certified' ? 'green' : 'red'
                    }
                  >
                    {CertStatusNameMap[detailData.certStatus]}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="账号状态">
                  <Tag
                    color={
                      detailData.status === 'active'
                        ? 'green'
                        : detailData.status === 'frozen'
                        ? 'red'
                        : 'default'
                    }
                  >
                    {UserStatusNameMap[detailData.status]}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* 签约信息 */}
            {detailData.signCompany && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>
                  签约信息
                </div>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="签约主体" span={2}>
                    {detailData.signCompany}
                    {detailData.tags && detailData.tags.length > 0 && (
                      <span style={{ marginLeft: 8 }}>
                        {detailData.tags.map((tag) => (
                          <Tag key={tag} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </span>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="签约销售">
                    {detailData.signSales || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="签约邮箱">
                    {detailData.signEmail || '-'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {/* 财务信息 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>
                财务信息
              </div>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="钱包状态">
                  {detailData.walletStatus || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="余额">
                  {detailData.balance !== undefined
                    ? `¥ ${detailData.balance.toFixed(2)}`
                    : '-'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* 入驻信息 */}
            {detailData.responsibleSales && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>
                  入驻信息
                </div>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="负责销售">
                    {detailData.responsibleSales}
                  </Descriptions.Item>
                  <Descriptions.Item label="负责AE">
                    {detailData.responsibleAE || '-'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default DetailModal;



