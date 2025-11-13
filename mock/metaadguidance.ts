/**
 * Meta广告指导 Mock 数据
 * 功能点 ID: ZT-TOOL-001
 */

import * as XLSX from 'xlsx';
import {
  getAllData,
  addData,
  removeData,
  updateData,
  findData,
  addBatchData,
  findOneData,
} from '../src/db';
import type { AdAccountGuidance } from '../src/types/metaadguidance';

// 初始化数据（仅在表为空时）
const initialData: AdAccountGuidance[] = [
  {
    adAccountId: '803992072248290',
    consolidatedEntity: '天津赤影商贸有限公司',
    settlementEntity: 'AD Pure Limited',
    accountInfo: '账户信息1',
    personnelInfo: {
      contractSales: 'chang.zhao@bluefocus.com',
      responsibleSales: 'chang.zhao@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 0,
    guidanceCount: 5,
    lastUpdateTime: '2025-11-13T13:18:03',
  },
  {
    adAccountId: '1617966532946713',
    consolidatedEntity: '湖南臻善汇能科技有限公司',
    settlementEntity: 'madhouse-结算主体',
    accountInfo: '账户信息2',
    personnelInfo: {
      contractSales: 'madhouse-销售',
      responsibleSales: 'madhouse-销售',
      tags: ['MH'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 82,
    guidanceCount: 2,
    lastUpdateTime: '2025-11-13T13:18:04',
  },
  {
    adAccountId: '123456789012345',
    consolidatedEntity: '测试公司1',
    settlementEntity: '测试结算主体1',
    accountInfo: '账户信息3',
    personnelInfo: {
      contractSales: 'test1@example.com',
      responsibleSales: 'test1@example.com',
      tags: ['BMP'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 75,
    guidanceCount: 3,
    lastUpdateTime: '2025-11-13T10:00:00',
  },
  {
    adAccountId: '987654321098765',
    consolidatedEntity: '北京科技有限公司',
    settlementEntity: 'BlueFocus-结算主体',
    accountInfo: '账户信息4',
    personnelInfo: {
      contractSales: 'zhang.san@bluefocus.com',
      responsibleSales: 'li.si@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 68,
    guidanceCount: 8,
    lastUpdateTime: '2025-11-13T14:30:15',
  },
  {
    adAccountId: '555555555555555',
    consolidatedEntity: '上海贸易有限公司',
    settlementEntity: 'madhouse-结算主体',
    accountInfo: '账户信息5',
    personnelInfo: {
      contractSales: 'wang.wu@madhouse.com',
      responsibleSales: 'zhao.liu@madhouse.com',
      tags: ['MH'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 91,
    guidanceCount: 1,
    lastUpdateTime: '2025-11-13T15:20:30',
  },
  {
    adAccountId: '111111111111111',
    consolidatedEntity: '广州电商有限公司',
    settlementEntity: 'BMP-结算主体',
    accountInfo: '账户信息6',
    personnelInfo: {
      contractSales: 'chen.qi@bmp.com',
      responsibleSales: 'sun.ba@bmp.com',
      tags: ['BMP'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 45,
    guidanceCount: 12,
    lastUpdateTime: '2025-11-13T16:10:45',
  },
  {
    adAccountId: '222222222222222',
    consolidatedEntity: '深圳科技股份有限公司',
    settlementEntity: 'AD Pure Limited',
    accountInfo: '账户信息7',
    personnelInfo: {
      contractSales: 'zhou.jiu@bluefocus.com',
      responsibleSales: 'wu.shi@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 73,
    guidanceCount: 6,
    lastUpdateTime: '2025-11-13T17:05:20',
  },
  {
    adAccountId: '333333333333333',
    consolidatedEntity: '杭州互联网有限公司',
    settlementEntity: 'madhouse-结算主体',
    accountInfo: '账户信息8',
    personnelInfo: {
      contractSales: 'zheng.shiyi@madhouse.com',
      responsibleSales: 'wang.shier@madhouse.com',
      tags: ['MH'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 56,
    guidanceCount: 9,
    lastUpdateTime: '2025-11-13T18:00:10',
  },
  {
    adAccountId: '444444444444444',
    consolidatedEntity: '成都传媒有限公司',
    settlementEntity: 'BMP-结算主体',
    accountInfo: '账户信息9',
    personnelInfo: {
      contractSales: 'li.shisan@bmp.com',
      responsibleSales: 'zhang.shisi@bmp.com',
      tags: ['BMP'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 88,
    guidanceCount: 4,
    lastUpdateTime: '2025-11-13T19:15:35',
  },
  {
    adAccountId: '666666666666666',
    consolidatedEntity: '西安商贸有限公司',
    settlementEntity: 'AD Pure Limited',
    accountInfo: '账户信息10',
    personnelInfo: {
      contractSales: 'chen.shiwu@bluefocus.com',
      responsibleSales: 'sun.shiliu@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 62,
    guidanceCount: 7,
    lastUpdateTime: '2025-11-13T20:25:50',
  },
];

// 新增10条测试数据
const additionalData: AdAccountGuidance[] = [
  {
    adAccountId: '777777777777777',
    consolidatedEntity: '苏州智能科技有限公司',
    settlementEntity: 'AD Pure Limited',
    accountInfo: '账户信息11',
    personnelInfo: {
      contractSales: 'liu.shiqi@bluefocus.com',
      responsibleSales: 'liu.shiqi@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 78,
    guidanceCount: 6,
    lastUpdateTime: '2025-11-14T09:15:20',
  },
  {
    adAccountId: '888888888888888',
    consolidatedEntity: '南京数字营销有限公司',
    settlementEntity: 'madhouse-结算主体',
    accountInfo: '账户信息12',
    personnelInfo: {
      contractSales: 'xu.shiba@madhouse.com',
      responsibleSales: 'xu.shiba@madhouse.com',
      tags: ['MH'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 85,
    guidanceCount: 4,
    lastUpdateTime: '2025-11-14T10:30:45',
  },
  {
    adAccountId: '999999999999999',
    consolidatedEntity: '武汉电商运营有限公司',
    settlementEntity: 'BMP-结算主体',
    accountInfo: '账户信息13',
    personnelInfo: {
      contractSales: 'ma.shijiu@bmp.com',
      responsibleSales: 'ma.shijiu@bmp.com',
      tags: ['BMP'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 72,
    guidanceCount: 8,
    lastUpdateTime: '2025-11-14T11:45:10',
  },
  {
    adAccountId: '101010101010101',
    consolidatedEntity: '重庆传媒广告有限公司',
    settlementEntity: 'AD Pure Limited',
    accountInfo: '账户信息14',
    personnelInfo: {
      contractSales: 'zhao.ershi@bluefocus.com',
      responsibleSales: 'zhao.ershi@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 90,
    guidanceCount: 3,
    lastUpdateTime: '2025-11-14T13:00:30',
  },
  {
    adAccountId: '202020202020202',
    consolidatedEntity: '厦门国际贸易有限公司',
    settlementEntity: 'madhouse-结算主体',
    accountInfo: '账户信息15',
    personnelInfo: {
      contractSales: 'qian.ershiyi@madhouse.com',
      responsibleSales: 'qian.ershiyi@madhouse.com',
      tags: ['MH'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 65,
    guidanceCount: 10,
    lastUpdateTime: '2025-11-14T14:15:55',
  },
  {
    adAccountId: '303030303030303',
    consolidatedEntity: '青岛品牌管理有限公司',
    settlementEntity: 'BMP-结算主体',
    accountInfo: '账户信息16',
    personnelInfo: {
      contractSales: 'sun.ershier@bmp.com',
      responsibleSales: 'sun.ershier@bmp.com',
      tags: ['BMP'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 81,
    guidanceCount: 5,
    lastUpdateTime: '2025-11-14T15:30:20',
  },
  {
    adAccountId: '404040404040404',
    consolidatedEntity: '大连跨境电商有限公司',
    settlementEntity: 'AD Pure Limited',
    accountInfo: '账户信息17',
    personnelInfo: {
      contractSales: 'zhou.ershisan@bluefocus.com',
      responsibleSales: 'zhou.ershisan@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 58,
    guidanceCount: 11,
    lastUpdateTime: '2025-11-14T16:45:40',
  },
  {
    adAccountId: '505050505050505',
    consolidatedEntity: '长沙新媒体运营有限公司',
    settlementEntity: 'madhouse-结算主体',
    accountInfo: '账户信息18',
    personnelInfo: {
      contractSales: 'wu.ershisi@madhouse.com',
      responsibleSales: 'wu.ershisi@madhouse.com',
      tags: ['MH'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 76,
    guidanceCount: 7,
    lastUpdateTime: '2025-11-14T17:00:15',
  },
  {
    adAccountId: '606060606060606',
    consolidatedEntity: '郑州电商服务有限公司',
    settlementEntity: 'BMP-结算主体',
    accountInfo: '账户信息19',
    personnelInfo: {
      contractSales: 'zheng.ershiwu@bmp.com',
      responsibleSales: 'zheng.ershiwu@bmp.com',
      tags: ['BMP'],
    },
    accountAttributes: 'EC | 后台消耗结算',
    accountScore: 69,
    guidanceCount: 9,
    lastUpdateTime: '2025-11-14T18:15:50',
  },
  {
    adAccountId: '707070707070707',
    consolidatedEntity: '福州数字广告有限公司',
    settlementEntity: 'AD Pure Limited',
    accountInfo: '账户信息20',
    personnelInfo: {
      contractSales: 'wang.ershiliu@bluefocus.com',
      responsibleSales: 'wang.ershiliu@bluefocus.com',
      tags: ['BV'],
    },
    accountAttributes: 'APP | 后台消耗结算',
    accountScore: 83,
    guidanceCount: 2,
    lastUpdateTime: '2025-11-14T19:30:25',
  },
];

// 初始化数据
const getAccounts = async (): Promise<AdAccountGuidance[]> => {
  const accounts = await getAllData<AdAccountGuidance>('metaadguidance.accounts');
  
  // 如果表为空，初始化基础数据
  if (accounts.length === 0) {
    await addBatchData('metaadguidance.accounts', initialData);
    await addBatchData('metaadguidance.accounts', additionalData);
    return [...initialData, ...additionalData];
  }
  
  // 检查是否需要添加新增的10条数据（避免重复添加）
  const existingAccountIds = new Set(accounts.map(acc => acc.adAccountId));
  const missingData = additionalData.filter(item => !existingAccountIds.has(item.adAccountId));
  
  if (missingData.length > 0) {
    await addBatchData('metaadguidance.accounts', missingData);
    return await getAllData<AdAccountGuidance>('metaadguidance.accounts');
  }
  
  return accounts;
};

export default {
  // 获取广告账户指导列表
  'GET /api/meta-ad-guidance/list': async (req: any, res: any) => {
    try {
      const { pageNum = 1, pageSize = 20, consolidatedEntity, settlementEntity, adAccountId } = req.query;
      
      // 从数据库获取数据
      let allData = await getAccounts();
      
      // 应用筛选条件
      if (consolidatedEntity) {
        allData = await findData<AdAccountGuidance>(
          'metaadguidance.accounts',
          (item) => item.consolidatedEntity && item.consolidatedEntity.includes(consolidatedEntity)
        );
      }
      if (settlementEntity) {
        allData = await findData<AdAccountGuidance>(
          'metaadguidance.accounts',
          (item) => item.settlementEntity && item.settlementEntity.includes(settlementEntity)
        );
      }
      if (adAccountId) {
        allData = await findData<AdAccountGuidance>(
          'metaadguidance.accounts',
          (item) => item.adAccountId && item.adAccountId.includes(adAccountId)
        );
      }

      // 分页
      const start = (Number(pageNum) - 1) * Number(pageSize);
      const end = start + Number(pageSize);
      const list = allData.slice(start, end);

      res.json({
        code: 200,
        message: '成功',
        data: {
          list,
          total: allData.length,
        },
      });
    } catch (error: any) {
      console.error('获取列表失败:', error);
      res.json({
        code: 500,
        message: error.message || '获取列表失败',
        data: {
          list: [],
          total: 0,
        },
      });
    }
  },

  // 获取广告账户建议回传详情
  'GET /api/meta-ad-guidance/recommendation-detail': (req: any, res: any) => {
    const mockData = [
      {
        link: 'view',
        guidanceType: 'MID_FLIGHT_RECOMMENDATION',
        guidanceContent: 'DELIVERY_ERROR',
        accountImprovementScore: 20,
        metricType: 0,
        improveableValue: '6847774845376',
        adObjectId: 'CAMPAIGN_GROUP',
        adLevel: 0,
        metricScore: 0,
        metricBenchmark: 0,
        guidanceUpdateTime: '2025-11-09T05:43:29',
        userBehavior: 'PITCH',
      },
      {
        link: 'view',
        guidanceType: 'MID_FLIGHT_RECOMMENDATION',
        guidanceContent: 'DELIVERY_ERROR',
        accountImprovementScore: 20,
        metricType: 0,
        improveableValue: '6847764827976',
        adObjectId: 'CAMPAIGN_GROUP',
        adLevel: 0,
        metricScore: 0,
        metricBenchmark: 0,
        guidanceUpdateTime: '2025-11-07T09:44:42',
        userBehavior: 'PITCH',
      },
      {
        link: 'view',
        guidanceType: 'MID_FLIGHT_RECOMMENDATION',
        guidanceContent: 'DELIVERY_ERROR',
        accountImprovementScore: 20,
        metricType: 0,
        improveableValue: '6847775493576',
        adObjectId: 'CAMPAIGN_GROUP',
        adLevel: 0,
        metricScore: 0,
        metricBenchmark: 0,
        guidanceUpdateTime: '2025-11-07T09:41:57',
        userBehavior: 'PITCH',
      },
      {
        link: 'view',
        guidanceType: 'MID_FLIGHT_RECOMMENDATION',
        guidanceContent: 'DELIVERY_ERROR',
        accountImprovementScore: 20,
        metricType: 0,
        improveableValue: '6847775493376',
        adObjectId: 'CAMPAIGN_GROUP',
        adLevel: 0,
        metricScore: 0,
        metricBenchmark: 0,
        guidanceUpdateTime: '2025-11-09T05:43:30',
        userBehavior: 'PITCH',
      },
      {
        link: 'view',
        guidanceType: 'MID_FLIGHT_RECOMMENDATION',
        guidanceContent: 'DELIVERY_ERROR',
        accountImprovementScore: 20,
        metricType: 0,
        improveableValue: '6847775494176',
        adObjectId: 'CAMPAIGN_GROUP',
        adLevel: 0,
        metricScore: 0,
        metricBenchmark: 0,
        guidanceUpdateTime: '2025-11-09T05:43:35',
        userBehavior: 'PITCH',
      },
    ];

    res.json({
      code: 200,
      message: '成功',
      data: mockData,
    });
  },

  // 获取广告指标回传数据详情
  'GET /api/meta-ad-guidance/metric-detail': (req: any, res: any) => {
    const mockData = [
      {
        guidanceType: 'Unknown',
        guidanceContent: 'FRAGMENTATION',
        hasGuidance: true,
        userReviewed: true,
        isPushed: true,
        userClicked: false,
        userAdopted: false,
        adoptedAfterReach: false,
        revenueAfterAdoption: 0,
        adoptionType: '',
        adoptionTime: '2025-02-25T00:00:00',
        lastReachTime: '2025-11-10T00:00:00',
        userLastAdoptionTime: '2025-11-09T00:00:00',
        userLastExecutionTime: '2025-11-08T00:00:00',
        callbackUpdateTime: '2025-11-06T00:00:00',
      },
      {
        guidanceType: 'Unknown',
        guidanceContent: 'REELS_PC_RECOMMENDATION',
        hasGuidance: true,
        userReviewed: true,
        isPushed: true,
        userClicked: false,
        userAdopted: false,
        adoptedAfterReach: false,
        revenueAfterAdoption: 0,
        adoptionType: '',
        adoptionTime: '',
        lastReachTime: '2025-11-10T00:00:00',
        userLastAdoptionTime: '',
        userLastExecutionTime: '',
        callbackUpdateTime: '2025-11-06T00:00:00',
      },
      {
        guidanceType: 'Unknown',
        guidanceContent: 'CREATIVE_LIMITED',
        hasGuidance: true,
        userReviewed: true,
        isPushed: true,
        userClicked: false,
        userAdopted: false,
        adoptedAfterReach: false,
        revenueAfterAdoption: 0,
        adoptionType: '',
        adoptionTime: '',
        lastReachTime: '2025-11-10T00:00:00',
        userLastAdoptionTime: '',
        userLastExecutionTime: '',
        callbackUpdateTime: '2025-11-06T00:00:00',
      },
    ];

    res.json({
      code: 200,
      message: '成功',
      data: mockData,
    });
  },

  // 下载Excel模板
  'GET /api/meta-ad-guidance/download-template': (req: any, res: any) => {
    try {
      // 创建Excel模板
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

      // 创建示例数据行（仅表头）
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

      // 生成Excel文件的二进制数组
      const excelBuffer = XLSX.write(workbook, {
        type: 'array',
        bookType: 'xlsx',
      });

      // 设置响应头
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="Meta广告指导账户导入模板.xlsx"`);
      
      // 将数组转换为Buffer并返回
      res.send(Buffer.from(excelBuffer));
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message || '下载失败',
      });
    }
  },

  // 上传Excel回传数据
  'POST /api/meta-ad-guidance/upload-excel': async (req: any, res: any) => {
    try {
      // 在Umi Mock环境中，文件数据可能在req.body中
      // 需要将文件转换为Buffer格式
      let fileBuffer: Buffer | undefined;
      
      // 尝试多种方式获取文件数据
      if (req.body && typeof req.body === 'object') {
        // 如果req.body是FormData对象，尝试获取file字段
        const fileData = req.body.file || req.body;
        if (Buffer.isBuffer(fileData)) {
          fileBuffer = fileData;
        } else if (fileData instanceof ArrayBuffer) {
          fileBuffer = Buffer.from(fileData);
        } else if (typeof fileData === 'string') {
          // Base64编码的文件
          fileBuffer = Buffer.from(fileData, 'base64');
        } else if (fileData && fileData.buffer) {
          fileBuffer = Buffer.from(fileData.buffer);
        }
      }
      
      // 如果仍然没有文件数据，尝试从原始请求中读取
      if (!fileBuffer && req.rawBody) {
        fileBuffer = Buffer.from(req.rawBody);
      }
      
      if (!fileBuffer) {
        // 在Mock环境中，如果无法获取文件，使用模拟数据
        // 实际环境中应该返回错误
        console.warn('Mock环境：无法获取上传文件，使用模拟数据');
        
        // 模拟处理结果
        const mockExcelData = [
          {
            adAccountId: `EXCEL_${Date.now()}`,
            consolidatedEntity: 'Excel导入公司',
            settlementEntity: 'Excel结算主体',
            accountInfo: 'Excel导入的账户信息',
            personnelInfo: {
              contractSales: 'excel@example.com',
              responsibleSales: 'excel@example.com',
              tags: ['BV'],
            },
            accountAttributes: 'EC | 后台消耗结算',
            accountScore: 80,
            guidanceCount: 5,
            lastUpdateTime: new Date().toISOString(),
          },
        ];

        let successCount = 0;
        let failCount = 0;
        const errors: string[] = [];

        for (const item of mockExcelData) {
          try {
            const existing = await findOneData<AdAccountGuidance>(
              'metaadguidance.accounts',
              (acc) => acc.adAccountId === item.adAccountId
            );

            if (existing) {
              await updateData(
                'metaadguidance.accounts',
                (acc) => acc.adAccountId === item.adAccountId,
                () => ({ ...existing, ...item, lastUpdateTime: new Date().toISOString() })
              );
            } else {
              await addData('metaadguidance.accounts', item);
            }
            successCount++;
          } catch (error: any) {
            failCount++;
            errors.push(`账户 ${item.adAccountId}: ${error.message || '处理失败'}`);
          }
        }

        setTimeout(() => {
          res.json({
            code: 200,
            message: '上传成功（模拟数据）',
            data: {
              successCount,
              failCount,
              errors: errors.length > 0 ? errors : undefined,
            },
          });
        }, 1000);
        return;
      }

      // 解析Excel文件
      let workbook: XLSX.WorkBook;
      try {
        workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      } catch (error: any) {
        res.json({
          code: 400,
          message: 'Excel文件格式错误',
          data: {
            successCount: 0,
            failCount: 0,
            errors: ['Excel文件格式错误，请检查文件'],
          },
        });
        return;
      }

      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // 转换为JSON数据
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      if (jsonData.length < 2) {
        res.json({
          code: 400,
          message: 'Excel文件为空或格式不正确',
          data: {
            successCount: 0,
            failCount: 0,
            errors: ['Excel文件为空或格式不正确，请至少包含表头和数据行'],
          },
        });
        return;
      }

      // 获取表头（第一行）
      const headers = jsonData[0] as string[];
      
      // 验证表头
      const expectedHeaders = [
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

      const headerMatch = expectedHeaders.every((h, i) => 
        headers[i] === h || headers[i]?.toString().trim() === h
      );

      if (!headerMatch) {
        res.json({
          code: 400,
          message: 'Excel表头格式不正确',
          data: {
            successCount: 0,
            failCount: 0,
            errors: ['Excel表头格式不正确，请下载模板查看正确格式'],
          },
        });
        return;
      }

      // 解析数据行（从第二行开始）
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue; // 跳过空行

        try {
          const adAccountId = String(row[0] || '').trim();
          if (!adAccountId) {
            failCount++;
            errors.push(`第 ${i + 1} 行: 广告账户ID不能为空`);
            continue;
          }

          const accountData: AdAccountGuidance = {
            adAccountId,
            consolidatedEntity: String(row[1] || '').trim(),
            settlementEntity: String(row[2] || '').trim(),
            accountInfo: String(row[3] || '').trim(),
            personnelInfo: {
              contractSales: String(row[4] || '').trim(),
              responsibleSales: String(row[5] || '').trim(),
              tags: [],
            },
            accountAttributes: String(row[6] || 'EC | 后台消耗结算').trim(),
            accountScore: Number(row[7]) || 0,
            guidanceCount: Number(row[8]) || 0,
            lastUpdateTime: new Date().toISOString(),
          };

          // 检查账户是否已存在
          const existing = await findOneData<AdAccountGuidance>(
            'metaadguidance.accounts',
            (acc) => acc.adAccountId === adAccountId
          );

          if (existing) {
            // 更新现有数据
            await updateData(
              'metaadguidance.accounts',
              (acc) => acc.adAccountId === adAccountId,
              () => ({ ...existing, ...accountData, lastUpdateTime: new Date().toISOString() })
            );
          } else {
            // 添加新数据
            await addData('metaadguidance.accounts', accountData);
          }
          successCount++;
        } catch (error: any) {
          failCount++;
          errors.push(`第 ${i + 1} 行: ${error.message || '处理失败'}`);
        }
      }

      setTimeout(() => {
        res.json({
          code: 200,
          message: '上传成功',
          data: {
            successCount,
            failCount,
            errors: errors.length > 0 ? errors : undefined,
          },
        });
      }, 1000);
    } catch (error: any) {
      res.json({
        code: 500,
        message: error.message || '上传失败',
        data: {
          successCount: 0,
          failCount: 0,
          errors: [error.message || '上传失败'],
        },
      });
    }
  },

  // 新增客户
  'POST /api/meta-ad-guidance/add-account': async (req: any, res: any) => {
    try {
      // 调试：打印请求体
      console.log('接收到的请求体:', req.body);
      
      const { adAccountId, consolidatedEntity, settlementEntity, accountInfo, personnelInfo } = req.body;

      // 验证必填字段
      if (!adAccountId || !consolidatedEntity || !settlementEntity) {
        console.log('验证失败:', { adAccountId, consolidatedEntity, settlementEntity });
        res.json({
          code: 400,
          message: '广告账户ID、合并主体、结算主体为必填项',
        });
        return;
      }

      // 检查账户是否已存在
      const existing = await findOneData<AdAccountGuidance>(
        'metaadguidance.accounts',
        (acc) => acc.adAccountId === adAccountId
      );

      if (existing) {
        res.json({
          code: 400,
          message: '账户已存在',
        });
        return;
      }

      // 创建新账户
      const newAccount: AdAccountGuidance = {
        adAccountId: String(adAccountId).trim(),
        consolidatedEntity: String(consolidatedEntity).trim(),
        settlementEntity: String(settlementEntity).trim(),
        accountInfo: accountInfo ? String(accountInfo).trim() : '',
        personnelInfo: {
          contractSales: personnelInfo?.contractSales ? String(personnelInfo.contractSales).trim() : '',
          responsibleSales: personnelInfo?.responsibleSales ? String(personnelInfo.responsibleSales).trim() : '',
          tags: [],
        },
        accountAttributes: 'EC | 后台消耗结算',
        accountScore: 0,
        guidanceCount: 0,
        lastUpdateTime: new Date().toISOString(),
      };

      // 添加数据到数据库
      await addData('metaadguidance.accounts', newAccount);

      // 验证数据是否成功添加
      const verify = await findOneData<AdAccountGuidance>(
        'metaadguidance.accounts',
        (acc) => acc.adAccountId === adAccountId
      );

      if (!verify) {
        console.error('数据添加失败，验证时未找到新添加的数据');
        res.json({
          code: 500,
          message: '数据保存失败，请重试',
        });
        return;
      }

      res.json({
        code: 200,
        message: '新增成功',
        data: {
          adAccountId: newAccount.adAccountId,
        },
      });
    } catch (error: any) {
      console.error('新增账户失败:', error);
      res.json({
        code: 500,
        message: error.message || '新增失败',
      });
    }
  },

  // 删除账户
  'DELETE /api/meta-ad-guidance/account/:adAccountId': async (req: any, res: any) => {
    try {
      const { adAccountId } = req.params;
      const deleted = await removeData<AdAccountGuidance>(
        'metaadguidance.accounts',
        (acc) => acc.adAccountId === adAccountId
      );

      if (deleted) {
        res.json({
          code: 200,
          message: '删除成功',
        });
      } else {
        res.json({
          code: 404,
          message: '账户不存在',
        });
      }
    } catch (error: any) {
      res.json({
        code: 500,
        message: error.message || '删除失败',
      });
    }
  },
};

