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
import type {
  AdAccountGuidance,
  SettlementEntity,
  Customer,
  Personnel,
} from '../src/types/metaadguidance';
// 枚举需要单独导入（不能使用 import type）
import {
  PersonnelRole,
  CustomerType,
} from '../src/types/metaadguidance';

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

// 初始化结算主体数据
const initSettlementEntities = async (): Promise<void> => {
  const entities = await getAllData<SettlementEntity>('settlement_entities');
  if (entities.length > 0) return;

  const settlementEntities: SettlementEntity[] = [
    { entityId: '17016', entityName: 'AD Pure Limited' },
    { entityId: '2741', entityName: 'madhouse-结算主体' },
    { entityId: '14904', entityName: 'MOBIPOTATO HK LIMITED' },
    { entityId: 'BMP001', entityName: 'BMP-结算主体' },
  ];

  await addBatchData('settlement_entities', settlementEntities);
};

// 初始化客户数据
const initCustomers = async (): Promise<void> => {
  const customers = await getAllData<Customer>('customers');
  if (customers.length > 0) return;

  const settlements = await getAllData<SettlementEntity>('settlement_entities');
  const settlementMap = new Map(settlements.map(s => [s.entityName, s.id!]));

  const customerData: Customer[] = [
    {
      customerId: '17016',
      customerName: 'AD Pure Limited',
      consolidatedEntity: '天津赤影商贸有限公司',
      customerType: CustomerType.BV,
      settlementEntityId: settlementMap.get('AD Pure Limited'),
    },
    {
      customerId: '2741',
      customerName: 'madhouse-结算主体',
      consolidatedEntity: '湖南臻善汇能科技有限公司',
      customerType: CustomerType.MH,
      settlementEntityId: settlementMap.get('madhouse-结算主体'),
    },
    {
      customerId: '14904',
      customerName: 'MOBIPOTATO HK LIMITED',
      consolidatedEntity: '苏州惟锐网络科技有限公司',
      customerType: CustomerType.BV,
      settlementEntityId: settlementMap.get('MOBIPOTATO HK LIMITED'),
    },
    {
      customerId: 'BMP001',
      customerName: 'BMP客户',
      consolidatedEntity: '广州电商有限公司',
      customerType: CustomerType.BMP,
      settlementEntityId: settlementMap.get('BMP-结算主体'),
    },
  ];

  await addBatchData('customers', customerData);
};

// 初始化人员数据
const initPersonnel = async (): Promise<void> => {
  const personnel = await getAllData<Personnel>('personnel');
  if (personnel.length > 0) return;

  const customers = await getAllData<Customer>('customers');
  const customerMap = new Map(customers.map(c => [c.customerId, c.id!]));

  const personnelData: Personnel[] = [
    {
      email: 'chang.zhao@bluefocus.com',
      role: PersonnelRole.CONTRACT_SALES,
      customerId: customerMap.get('17016')!,
    },
    {
      email: 'chang.zhao@bluefocus.com',
      role: PersonnelRole.RESPONSIBLE_SALES,
      customerId: customerMap.get('17016')!,
    },
    {
      email: 'madhouse-销售',
      role: PersonnelRole.CONTRACT_SALES,
      customerId: customerMap.get('2741')!,
    },
    {
      email: 'madhouse-销售',
      role: PersonnelRole.RESPONSIBLE_SALES,
      customerId: customerMap.get('2741')!,
    },
    {
      email: 'shujuan.jiang@bluefocus.com',
      role: PersonnelRole.CONTRACT_SALES,
      customerId: customerMap.get('14904')!,
    },
    {
      email: 'shujuan.jiang@bluefocus.com',
      role: PersonnelRole.RESPONSIBLE_SALES,
      customerId: customerMap.get('14904')!,
    },
  ];

  await addBatchData('personnel', personnelData);
};

// 更新账户数据，关联 customerId
const updateAccountsWithCustomers = async (): Promise<void> => {
  const accounts = await getAllData<AdAccountGuidance>('metaadguidance.accounts');
  const customers = await getAllData<Customer>('customers');
  
  // 创建结算主体到客户的映射（简化版）
  const settlementToCustomer = new Map<string, number>();
  customers.forEach(c => {
    if (c.consolidatedEntity && c.id) {
      settlementToCustomer.set(c.consolidatedEntity, c.id);
    }
  });

  for (const account of accounts) {
    if (!account.customerId && account.consolidatedEntity) {
      const customerId = settlementToCustomer.get(account.consolidatedEntity);
      if (customerId) {
        await updateData(
          'metaadguidance.accounts',
          (item: any) => item.adAccountId === account.adAccountId,
          (item: any) => ({ ...item, customerId })
        );
      }
    }
  }
};

// 初始化推荐数据
const initRecommendations = async (): Promise<void> => {
  const recommendations = await getAllData('metaadguidance.recommendations');
  if (recommendations.length > 0) return;

  const accounts = await getAllData<AdAccountGuidance>('metaadguidance.accounts');
  
  // 为前5个账户生成推荐数据
  for (const account of accounts.slice(0, 5)) {
    const count = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < count; i++) {
      await addData('metaadguidance.recommendations', {
        adAccountId: account.adAccountId,
        link: 'view',
        guidanceType: 'MID_FLIGHT_RECOMMENDATION',
        guidanceContent: ['DELIVERY_ERROR', 'BUDGET_OPTIMIZATION', 'TARGETING_EXPANSION'][i % 3],
        accountImprovementScore: Math.floor(Math.random() * 50) + 10,
        metricType: 0,
        improveableValue: String(Math.floor(Math.random() * 9000000000000) + 1000000000000),
        adObjectId: 'CAMPAIGN_GROUP',
        adLevel: 0,
        metricScore: 0,
        metricBenchmark: 0,
        guidanceUpdateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        userBehavior: 'PITCH',
        accountId: account.accountId,
        campaignId: account.campaignId,
      });
    }
  }
};

// 初始化指标数据
const initMetrics = async (): Promise<void> => {
  const metrics = await getAllData('metaadguidance.metrics');
  if (metrics.length > 0) return;

  const accounts = await getAllData<AdAccountGuidance>('metaadguidance.accounts');
  
  // 为前5个账户生成指标数据
  for (const account of accounts.slice(0, 5)) {
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
      await addData('metaadguidance.metrics', {
        adAccountId: account.adAccountId,
        guidanceType: 'Unknown',
        guidanceContent: ['FRAGMENTATION', 'REELS_PC_RECOMMENDATION', 'CREATIVE_LIMITED'][i % 3],
        hasGuidance: true,
        userReviewed: Math.random() > 0.5,
        isPushed: true,
        userClicked: Math.random() > 0.5,
        userAdopted: Math.random() > 0.7,
        adoptedAfterReach: Math.random() > 0.8,
        revenueAfterAdoption: Math.floor(Math.random() * 10000),
        adoptionType: Math.random() > 0.5 ? 'MANUAL' : '',
        adoptionTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastReachTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        callbackUpdateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        accountId: account.accountId,
        campaignId: account.campaignId,
      });
    }
  }
};

// 初始化所有关联数据
const initializeAllData = async (): Promise<void> => {
  await initSettlementEntities();
  await initCustomers();
  await initPersonnel();
  await updateAccountsWithCustomers();
  await initRecommendations();
  await initMetrics();
};

// 初始化标志，防止重复初始化
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

// 初始化数据
const getAccounts = async (): Promise<AdAccountGuidance[]> => {
  try {
    const accounts = await getAllData<AdAccountGuidance>('metaadguidance.accounts');
    
    // 如果表为空，初始化基础数据
    if (accounts.length === 0) {
      console.log('[Meta广告指导] 初始化基础账户数据...');
      await addBatchData('metaadguidance.accounts', initialData);
      await addBatchData('metaadguidance.accounts', additionalData);
      console.log('[Meta广告指导] 基础账户数据初始化完成');
      return [...initialData, ...additionalData];
    }
    
    // 检查是否需要添加新增的10条数据（避免重复添加）
    const existingAccountIds = new Set(accounts.map(acc => acc.adAccountId));
    const missingData = additionalData.filter(item => !existingAccountIds.has(item.adAccountId));
    
    if (missingData.length > 0) {
      console.log(`[Meta广告指导] 添加缺失的 ${missingData.length} 条账户数据...`);
      await addBatchData('metaadguidance.accounts', missingData);
      return await getAllData<AdAccountGuidance>('metaadguidance.accounts');
    }
    
    return accounts;
  } catch (error) {
    console.error('[Meta广告指导] 获取账户数据失败:', error);
    throw error;
  }
};

// 确保初始化只执行一次
const ensureInitialized = async (): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise;
  }
  
  if (isInitializing) {
    // 等待初始化完成
    await new Promise(resolve => setTimeout(resolve, 100));
    return ensureInitialized();
  }
  
  isInitializing = true;
  
  initializationPromise = (async () => {
    try {
      console.log('[Meta广告指导] 开始初始化数据...');
      await getAccounts();
      await initializeAllData();
      console.log('[Meta广告指导] 数据初始化完成');
    } catch (error) {
      console.error('[Meta广告指导] 数据初始化失败:', error);
      throw error;
    } finally {
      isInitializing = false;
    }
  })();
  
  return initializationPromise;
};

export default {
  // 获取广告账户指导列表
  'GET /api/meta-ad-guidance/list': async (req: any, res: any) => {
    try {
      const { pageNum = 1, pageSize = 20, consolidatedEntity, settlementEntity, adAccountId } = req.query;
      
      // 确保数据已初始化
      await ensureInitialized();
      
      // 从数据库获取数据
      let allData = await getAllData<AdAccountGuidance>('metaadguidance.accounts');
      console.log(`[Meta广告指导] 从数据库获取到 ${allData.length} 条账户数据`);
      
      // 如果没有数据，返回空列表
      if (!allData || allData.length === 0) {
        console.warn('[Meta广告指导] 数据库中没有账户数据');
        res.json({
          code: 200,
          message: '暂无数据',
          data: {
            list: [],
            total: 0,
          },
        });
        return;
      }
      
      // 应用筛选条件
      if (consolidatedEntity) {
        allData = allData.filter(item => 
          item.consolidatedEntity && item.consolidatedEntity.includes(consolidatedEntity)
        );
      }
      if (settlementEntity) {
        allData = allData.filter(item => 
          item.settlementEntity && item.settlementEntity.includes(settlementEntity)
        );
      }
      if (adAccountId) {
        allData = allData.filter(item => 
          item.adAccountId && item.adAccountId.includes(adAccountId)
        );
      }

      // 获取关联数据（JOIN 模拟）
      const customers = await getAllData<Customer>('customers');
      const personnel = await getAllData<Personnel>('personnel');
      const settlements = await getAllData<SettlementEntity>('settlement_entities');

      // 组装数据
      const enrichedData = allData.map(account => {
        const customer = customers.find(c => c.id === account.customerId);
        const settlement = customer ? settlements.find(s => s.id === customer.settlementEntityId) : undefined;
        const contractSales = customer ? personnel.find(p => 
          p.customerId === customer.id && p.role === PersonnelRole.CONTRACT_SALES
        ) : undefined;
        const responsibleSales = customer ? personnel.find(p => 
          p.customerId === customer.id && p.role === PersonnelRole.RESPONSIBLE_SALES
        ) : undefined;

        return {
          ...account,
          customer: customer ? {
            ...customer,
            settlementEntity: settlement,
            contractSales: contractSales?.email,
            responsibleSales: responsibleSales?.email,
          } : undefined,
        };
      });

      // 分页
      const start = (Number(pageNum) - 1) * Number(pageSize);
      const end = start + Number(pageSize);
      const list = enrichedData.slice(start, end);

      console.log(`[Meta广告指导] 返回 ${list.length} 条数据，总计 ${enrichedData.length} 条`);

      res.json({
        code: 200,
        message: '成功',
        data: {
          list,
          total: enrichedData.length,
        },
      });
    } catch (error: any) {
      console.error('[Meta广告指导] 获取列表失败:', error);
      console.error('[Meta广告指导] 错误堆栈:', error.stack);
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
  'GET /api/meta-ad-guidance/recommendation-detail': async (req: any, res: any) => {
    try {
      const { adAccountId } = req.query;

      if (!adAccountId) {
        res.json({
          code: 400,
          message: '缺少广告账户ID参数',
          data: [],
        });
        return;
      }

      // 从数据库查询该账户的建议回传数据
      const recommendations = await findData(
        'metaadguidance.recommendations',
        (item: any) => item.adAccountId === adAccountId
      );

      res.json({
        code: 200,
        message: '成功',
        data: recommendations,
      });
    } catch (error: any) {
      console.error('获取建议回传详情失败:', error);
      res.json({
        code: 500,
        message: error.message || '获取详情失败',
        data: [],
      });
    }
  },

  // 获取广告指标回传数据详情
  'GET /api/meta-ad-guidance/metric-detail': async (req: any, res: any) => {
    try {
      const { adAccountId } = req.query;

      if (!adAccountId) {
        res.json({
          code: 400,
          message: '缺少广告账户ID参数',
          data: [],
        });
        return;
      }

      // 从数据库查询该账户的指标回传数据
      const metrics = await findData(
        'metaadguidance.metrics',
        (item: any) => item.adAccountId === adAccountId
      );

      res.json({
        code: 200,
        message: '成功',
        data: metrics,
      });
    } catch (error: any) {
      console.error('获取指标回传详情失败:', error);
      res.json({
        code: 500,
        message: error.message || '获取详情失败',
        data: [],
      });
    }
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

