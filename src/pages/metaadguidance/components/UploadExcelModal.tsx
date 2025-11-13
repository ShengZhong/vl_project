/**
 * 上传Excel弹框组件
 * 功能点 ID: ZT-TOOL-001
 */

import React, { useState } from 'react';
import { Modal, Upload, Button, message, Progress, Table } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/lib/upload/interface';
import type { ColumnsType } from 'antd/lib/table';
import { uploadExcel } from '@/services/metaadguidance';
import * as XLSX from 'xlsx';

interface UploadExcelModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PreviewDataRow {
  [key: string]: any;
}

const UploadExcelModal: React.FC<UploadExcelModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewDataRow[]>([]);
  const [previewColumns, setPreviewColumns] = useState<ColumnsType<PreviewDataRow>>([]);

  // 解析Excel文件并生成预览数据
  const parseExcelFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const binaryData = e.target?.result;
          const workbook = XLSX.read(binaryData, { type: 'binary' });
          
          // 读取第一个工作表
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // 将工作表转换为JSON数据
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length === 0) {
            message.warning('Excel文件为空');
            reject(new Error('Excel文件为空'));
            return;
          }
          
          // 第一行作为表头
          const headers = jsonData[0] as string[];
          const dataRows = jsonData.slice(1);
          
          // 生成表格列配置
          const columns: ColumnsType<PreviewDataRow> = headers.map((header, index) => ({
            title: header || `列${index + 1}`,
            dataIndex: `col_${index}`,
            key: `col_${index}`,
            width: 150,
            ellipsis: true,
          }));
          
          // 生成表格数据
          const tableData: PreviewDataRow[] = dataRows
            .filter(row => row && row.length > 0) // 过滤空行
            .map((row, rowIndex) => {
              const rowData: PreviewDataRow = { key: rowIndex };
              row.forEach((cell, colIndex) => {
                rowData[`col_${colIndex}`] = cell !== undefined && cell !== null ? String(cell) : '';
              });
              return rowData;
            });
          
          setPreviewColumns(columns);
          setPreviewData(tableData);
          message.success(`已解析 ${tableData.length} 条数据`);
          resolve();
        } catch (error) {
          console.error('解析失败:', error);
          message.error('Excel解析失败，请检查文件格式');
          reject(error);
        }
      };
      
      reader.onerror = () => {
        message.error('文件读取失败');
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsBinaryString(file);
    });
  };

  // 下载Excel模板
  const handleDownloadTemplate = () => {
    try {
      setDownloading(true);
      
      // 创建Excel模板数据
      const headers = [
        '广告账户ID',
        '合并主体',
        '结算主体',
        '账户信息',
        '签约销售',
        '负责销售',
        '账户属性',
        '账户评分',
        '指导数量',
      ];
      
      // 创建工作表（仅表头）
      const worksheet = XLSX.utils.aoa_to_sheet([headers]);
      
      // 设置列宽
      const colWidths = [
        { wch: 20 }, // 广告账户ID
        { wch: 30 }, // 合并主体
        { wch: 30 }, // 结算主体
        { wch: 30 }, // 账户信息
        { wch: 30 }, // 签约销售
        { wch: 30 }, // 负责销售
        { wch: 25 }, // 账户属性
        { wch: 12 }, // 账户评分
        { wch: 12 }, // 指导数量
      ];
      worksheet['!cols'] = colWidths;
      
      // 创建工作簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '账户数据');
      
      // 生成Excel文件并下载
      XLSX.writeFile(workbook, `Meta广告指导账户导入模板_${new Date().getTime()}.xlsx`);
      
      message.success('模板下载成功');
    } catch (error) {
      console.error('下载失败:', error);
      message.error('模板下载失败，请重试');
    } finally {
      setDownloading(false);
    }
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请选择要上传的文件');
      return;
    }

    const file = fileList[0].originFileObj;
    if (!file) {
      message.warning('文件不存在');
      return;
    }

    // 校验文件格式
    const fileName = file.name;
    const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    if (fileExt !== 'xlsx' && fileExt !== 'xls') {
      message.error('请上传 Excel 文件（.xlsx 或 .xls）');
      return;
    }

    // 校验文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      message.error('文件大小不能超过 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await uploadExcel(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.code === 200 && response.data) {
        const { successCount, failCount, errors } = response.data;
        if (failCount === 0) {
          message.success(`上传成功，共回传 ${successCount} 条数据`);
        } else {
          message.warning(
            `部分成功：成功 ${successCount} 条，失败 ${failCount} 条${
              errors && errors.length > 0 ? `。错误详情：${errors.join('; ')}` : ''
            }`
          );
        }
        setFileList([]);
        setUploadProgress(0);
        onSuccess();
        onClose();
      } else {
        message.error(response.message || '上传失败');
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败，请重试');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFileList([]);
    setUploadProgress(0);
    setPreviewData([]);
    setPreviewColumns([]);
    onClose();
  };

  const uploadProps: UploadProps = {
    fileList,
    beforeUpload: async (file) => {
      const fileName = file.name;
      const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
      if (fileExt !== 'xlsx' && fileExt !== 'xls') {
        message.error('请上传 Excel 文件（.xlsx 或 .xls）');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        message.error('文件大小不能超过 10MB');
        return false;
      }
      setFileList([file]);
      
      // 解析Excel文件并生成预览
      try {
        await parseExcelFile(file);
      } catch (error) {
        console.error('解析Excel失败:', error);
        setFileList([]);
      }
      
      return false; // 阻止自动上传
    },
    onRemove: () => {
      setFileList([]);
      setPreviewData([]);
      setPreviewColumns([]);
      return true;
    },
    maxCount: 1,
  };

  return (
    <Modal
      title="上传Excel回传数据"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="upload"
          type="primary"
          loading={uploading}
          onClick={handleUpload}
          disabled={fileList.length === 0}
        >
          确定
        </Button>,
      ]}
      width={previewData.length > 0 ? 1200 : 600}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownloadTemplate}
            loading={downloading}
          >
            下载Excel模板
          </Button>
        </div>
        <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
          支持格式：.xlsx, .xls，文件大小不超过 10MB
        </div>
      </div>
      
      {/* Excel预览区域 */}
      {previewData.length > 0 && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 14 }}>
            文件预览 (共 {previewData.length} 条数据)
          </div>
          <Table
            columns={previewColumns}
            dataSource={previewData}
            scroll={{ x: 'max-content', y: 300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              size: 'small',
            }}
            size="small"
            bordered
          />
        </div>
      )}
      
      {uploading && (
        <div>
          <Progress percent={uploadProgress} status="active" />
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            正在上传并回传数据...
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UploadExcelModal;

