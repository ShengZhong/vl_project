/**
 * VL广告指导建议 - Mock API
 * 功能点ID: VL-ADGD-001
 */

import { Request, Response } from 'express';
import {
  getAllData,
  addData,
  updateData,
} from '../src/db';

/**
 * 初始化广告指导建议测试数据
 */
async function initAdGuidanceData() {
  try {
    // 检查是否已有数据
    const existingCustomers = await getAllData('adguidance_customers');
    if (existingCustomers && existingCustomers.length > 0) {
      console.log('广告指导建议数据已存在，跳过初始化');
      return; // 已有数据,不重复初始化
    }

    console.log('开始初始化广告指导建议测试数据...');

    // 1. 添加客户数据
    const customers = [
      { customerName: 'CGE Digital Marketing', industry: '电商', customerLevel: 'VIP' },
      { customerName: 'CGE Digital Studio', industry: '游戏', customerLevel: 'NORMAL' },
      { customerName: 'TechFlow 科技', industry: '科技', customerLevel: 'VIP' },
      { customerName: '时尚之家服饰', industry: '时尚', customerLevel: 'VIP' },
      { customerName: '健康生活品牌', industry: '健康', customerLevel: 'NORMAL' },
      { customerName: '教育在线平台', industry: '教育', customerLevel: 'VIP' },
      { customerName: '美食天堂餐饮', industry: '餐饮', customerLevel: 'NORMAL' },
      { customerName: '智能家居科技', industry: '科技', customerLevel: 'VIP' },
    ];

    const createdCustomers = [];
    for (const customer of customers) {
      const created = await addData('adguidance_customers', customer);
      createdCustomers.push(created);
    }
    console.log(`✓ 创建了 ${createdCustomers.length} 个客户`);

    // 2. 获取平台数据
    const platforms = await getAllData('ad_platforms');
    const metaPlatform = platforms.find((p: any) => p.platformCode === 'META');
    const googlePlatform = platforms.find((p: any) => p.platformCode === 'GOOGLE');
    const tiktokPlatform = platforms.find((p: any) => p.platformCode === 'TIKTOK');

    // 3. 添加广告账户数据（包含与Meta广告指导匹配的账户ID）
    const accounts = [
      // Meta 平台账户（与Meta广告指导匹配的账户ID）
      { accountId: '803992072248290', accountName: '赤影商贸推广账户', opportunityScore: 35, accountBalance: 2812.7, totalSpend: 15234.5, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[0].id, expiryDate: '2025-10-15' },
      { accountId: '1617966532946713', accountName: '臻善汇能推广账户', opportunityScore: 82, accountBalance: 4268.49, totalSpend: 18956.3, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[1].id, expiryDate: '2025-11-15' },
      { accountId: '123456789012345', accountName: '测试公司1推广账户', opportunityScore: 75, accountBalance: 3523.8, totalSpend: 16450.0, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[2].id, expiryDate: '2025-11-20' },
      { accountId: '987654321098765', accountName: '北京科技推广账户', opportunityScore: 68, accountBalance: 5234.6, totalSpend: 23456.8, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[3].id, expiryDate: '2025-12-25' },
      { accountId: '555555555555555', accountName: '上海贸易推广账户', opportunityScore: 62, accountBalance: 2856.3, totalSpend: 12876.5, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[4].id, expiryDate: '2025-10-30' },
      // 原有的测试账户
      { accountId: 'act_1234567890', accountName: 'CGE主推广账户', opportunityScore: 28, accountBalance: 2812.7, totalSpend: 15234.5, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[0].id, expiryDate: '2025-10-15' },
      { accountId: 'act_9876543210', accountName: 'CGE游戏推广', opportunityScore: 85, accountBalance: 2268.49, totalSpend: 8956.3, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[1].id, expiryDate: '2025-10-15' },
      { accountId: 'act_5678901234', accountName: 'TechFlow主账户', opportunityScore: 65, accountBalance: 1523.8, totalSpend: 12450.0, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[2].id, expiryDate: '2025-11-20' },
      { accountId: 'act_1111222233', accountName: '时尚推广账户', opportunityScore: 92, accountBalance: 5234.6, totalSpend: 23456.8, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[3].id, expiryDate: '2025-12-25' },
      { accountId: 'act_4444555566', accountName: '健康品牌账户', opportunityScore: 35, accountBalance: 856.3, totalSpend: 9876.5, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[4].id, expiryDate: '2025-09-30' },
      { accountId: 'act_7777888899', accountName: '教育平台账户', opportunityScore: 58, accountBalance: 3456.9, totalSpend: 18765.4, status: 'ACTIVE', platformId: metaPlatform.id, customerId: createdCustomers[5].id, expiryDate: '2026-01-15' },
      // Google Ads 平台账户
      { accountId: '1234567890', accountName: 'CGE搜索广告', opportunityScore: 72, accountBalance: 4567.8, totalSpend: 21234.5, status: 'ACTIVE', platformId: googlePlatform.id, customerId: createdCustomers[0].id, expiryDate: '2025-11-30' },
      { accountId: '9876543210', accountName: '美食餐饮推广', opportunityScore: 45, accountBalance: 1234.5, totalSpend: 8765.3, status: 'ACTIVE', platformId: googlePlatform.id, customerId: createdCustomers[6].id, expiryDate: '2025-10-20' },
      { accountId: '5555666677', accountName: '智能家居Google推广', opportunityScore: 88, accountBalance: 6789.2, totalSpend: 34567.8, status: 'ACTIVE', platformId: googlePlatform.id, customerId: createdCustomers[7].id, expiryDate: '2026-02-28' },
      // TikTok 平台账户
      { accountId: '1122334455667', accountName: '时尚TikTok推广', opportunityScore: 78, accountBalance: 2345.6, totalSpend: 12345.7, status: 'ACTIVE', platformId: tiktokPlatform.id, customerId: createdCustomers[3].id, expiryDate: '2025-12-10' },
      { accountId: '9988776655443', accountName: '游戏TikTok账户', opportunityScore: 38, accountBalance: 567.8, totalSpend: 6789.4, status: 'ACTIVE', platformId: tiktokPlatform.id, customerId: createdCustomers[1].id, expiryDate: '2025-09-15' },
      { accountId: '3344556677889', accountName: '教育TikTok推广', opportunityScore: 82, accountBalance: 4321.9, totalSpend: 19876.5, status: 'ACTIVE', platformId: tiktokPlatform.id, customerId: createdCustomers[5].id, expiryDate: '2026-01-20' },
    ];

    const createdAccounts = [];
    for (const account of accounts) {
      const created = await addData('ad_accounts', account);
      createdAccounts.push(created);
    }
    console.log(`✓ 创建了 ${createdAccounts.length} 个广告账户`);

    // 4. 获取分类数据
    const categories = await getAllData('recommendation_categories');
    const budgetCategory = categories.find((c: any) => c.categoryCode === 'BUDGET');
    const creativeCategory = categories.find((c: any) => c.categoryCode === 'CREATIVE');
    const audienceCategory = categories.find((c: any) => c.categoryCode === 'AUDIENCE');
    const autoCategory = categories.find((c: any) => c.categoryCode === 'AUTO');

    // 5. 添加优化建议（包含与Meta广告指导账户匹配的建议）
    const recommendations = [
      // 账户1的建议（803992072248290 - 低分账户，5条建议）
      { title: '提高日预算限制以获取更多转化', description: '当前日预算设置过低,限制了广告曝光机会。建议将日预算从$50提升至$100。', impactScore: 12, affectedAdCount: 15, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[0].id, categoryId: budgetCategory.id },
      { title: '更新广告创意素材', description: '当前创意素材已使用超过30天,用户疲劳度增加。建议更新广告图片和视频。', impactScore: 8, affectedAdCount: 8, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[0].id, categoryId: creativeCategory.id },
      { title: '扩展受众定向', description: '当前受众定向过于窄小,建议启用"类似受众"功能。', impactScore: 10, affectedAdCount: 12, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[0].id, categoryId: audienceCategory.id },
      { title: '启用自动出价优化', description: '手动出价效率较低,建议启用"最低成本"自动出价策略。', impactScore: 15, affectedAdCount: 20, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[0].id, categoryId: autoCategory.id },
      { title: '修复广告投放问题', description: '检测到部分广告投放受限,建议检查广告内容是否符合平台政策。', impactScore: 18, affectedAdCount: 10, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[0].id, categoryId: autoCategory.id },
      
      // 账户2的建议（1617966532946713 - 高分账户，2条建议）
      { title: '优化广告投放时段', description: '数据显示凌晨2-6点转化率较低,建议调整投放时段。', impactScore: 5, affectedAdCount: 3, status: 'ADOPTED', priority: 'LOW', accountId: createdAccounts[1].id, categoryId: budgetCategory.id },
      { title: 'A/B测试创意文案', description: '建议针对不同受众群体测试多组创意文案。', impactScore: 6, affectedAdCount: 5, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[1].id, categoryId: creativeCategory.id },
      
      // 账户3的建议（123456789012345 - 中等分数，3条）
      { title: '高性能广告系列-调整预算分配', description: '广告组有潜力扩大规模,请考虑提升日预算限制至少20%。', impactScore: 18, affectedAdCount: 15, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[2].id, categoryId: budgetCategory.id },
      { title: '推广商品系列-启用自动化规则', description: '巧用自动规则让你的广告效果改善。', impactScore: 12, affectedAdCount: 8, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[2].id, categoryId: autoCategory.id },
      { title: '优化受众定向精准度', description: '建议细化受众年龄、兴趣标签,提升广告精准度。', impactScore: 14, affectedAdCount: 12, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[2].id, categoryId: audienceCategory.id },
      
      // 账户4的建议（987654321098765 - 中等分数，3条）
      { title: '继续扩大高ROAS广告系列预算', description: '当前ROAS达5.8的广告系列建议继续扩大预算。', impactScore: 8, affectedAdCount: 6, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[3].id, categoryId: budgetCategory.id },
      { title: '优化广告标题文案', description: '使用疑问句式标题,提升用户好奇心和点击率。', impactScore: 7, affectedAdCount: 6, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[3].id, categoryId: creativeCategory.id },
      { title: '测试多种广告格式', description: '建议测试轮播广告、合集广告等多种格式,找到最优方案。', impactScore: 10, affectedAdCount: 8, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[3].id, categoryId: creativeCategory.id },
      
      // 账户5的建议（555555555555555 - 中等分数，2条）
      { title: '提升广告质量得分', description: '当前质量得分平均为6/10,建议优化广告文案与目标受众的相关性。', impactScore: 13, affectedAdCount: 10, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[4].id, categoryId: creativeCategory.id },
      { title: '优化落地页体验', description: '落地页加载速度偏慢,建议优化图片大小和代码性能。', impactScore: 11, affectedAdCount: 8, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[4].id, categoryId: autoCategory.id },
      
      // 原有账户的建议
      { title: '紧急:修复转化追踪问题', description: '检测到过去7天转化数据异常,请检查像素代码。', impactScore: 20, affectedAdCount: 25, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[5].id, categoryId: autoCategory.id },
      { title: '重新设计落地页', description: '当前落地页跳出率高达78%,建议优化页面加载速度。', impactScore: 16, affectedAdCount: 18, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[5].id, categoryId: creativeCategory.id },
      { title: '调整受众定向策略', description: '当前定向过于宽泛,建议缩小年龄范围至25-45岁核心人群。', impactScore: 13, affectedAdCount: 22, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[5].id, categoryId: audienceCategory.id },
      { title: '测试视频创意格式', description: '建议测试短视频格式。教育行业视频广告平均CTR比图片高60%。', impactScore: 15, affectedAdCount: 10, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[10].id, categoryId: creativeCategory.id },
      { title: '优化地理位置定向', description: '数据显示一线城市转化率比二三线城市高45%。', impactScore: 12, affectedAdCount: 10, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[11].id, categoryId: audienceCategory.id },
      { title: '扩展至展示广告网络', description: '搜索广告表现优秀,建议尝试展示广告网络再营销。', impactScore: 11, affectedAdCount: 0, status: 'PENDING', priority: 'MEDIUM', accountId: createdAccounts[12].id, categoryId: audienceCategory.id },
      { title: '优化视频前3秒内容', description: 'TikTok用户注意力集中在前3秒。建议在视频开头立即展示产品卖点。', impactScore: 13, affectedAdCount: 12, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[14].id, categoryId: creativeCategory.id },
      { title: '改善视频质量和时长', description: '当前视频质量不达标,建议使用高清拍摄设备,时长控制在15-30秒。', impactScore: 18, affectedAdCount: 20, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[15].id, categoryId: creativeCategory.id },
      { title: '创建学习效果展示视频', description: '建议制作学员学习成果展示视频,真实案例更容易建立信任。', impactScore: 12, affectedAdCount: 10, status: 'PENDING', priority: 'HIGH', accountId: createdAccounts[16].id, categoryId: creativeCategory.id },
    ];

    let createdRecommendationsCount = 0;
    for (const recommendation of recommendations) {
      await addData('recommendations', recommendation);
      createdRecommendationsCount++;
    }
    console.log(`✓ 创建了 ${createdRecommendationsCount} 条优化建议`);

    // 6. 添加账户指标数据（简化版，只添加最近7天）
    const today = new Date();
    const allAccounts = [
      { account: createdAccounts[0], cpa: 8.5, roas: 1.2, conversionRate: 0.8, dailySpend: 45 },
      { account: createdAccounts[1], cpa: 3.2, roas: 4.5, conversionRate: 3.5, dailySpend: 120 },
      { account: createdAccounts[2], cpa: 5.8, roas: 2.8, conversionRate: 2.1, dailySpend: 75 },
      { account: createdAccounts[3], cpa: 2.8, roas: 5.8, conversionRate: 4.2, dailySpend: 150 },
      { account: createdAccounts[4], cpa: 9.8, roas: 1.0, conversionRate: 0.6, dailySpend: 35 },
      { account: createdAccounts[5], cpa: 6.2, roas: 2.5, conversionRate: 1.8, dailySpend: 85 },
      { account: createdAccounts[6], cpa: 4.8, roas: 3.2, conversionRate: 2.5, dailySpend: 110 },
      { account: createdAccounts[7], cpa: 7.5, roas: 1.8, conversionRate: 1.2, dailySpend: 55 },
      { account: createdAccounts[8], cpa: 3.5, roas: 4.8, conversionRate: 3.8, dailySpend: 140 },
      { account: createdAccounts[9], cpa: 5.2, roas: 3.0, conversionRate: 2.2, dailySpend: 90 },
      { account: createdAccounts[10], cpa: 10.2, roas: 0.9, conversionRate: 0.5, dailySpend: 30 },
      { account: createdAccounts[11], cpa: 4.2, roas: 4.2, conversionRate: 3.2, dailySpend: 125 },
    ];

    let metricsCount = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      for (const accountData of allAccounts) {
        const randomFactor = 1 + (Math.random() - 0.5) * 0.2;
        await addData('account_metrics', {
          metricDate: dateStr,
          cpa: accountData.cpa * randomFactor,
          roas: accountData.roas * (2 - randomFactor),
          conversionRate: accountData.conversionRate * randomFactor,
          dailySpend: accountData.dailySpend * (1 + (Math.random() - 0.5) * 0.3),
          accountId: accountData.account.id,
        });
        metricsCount++;
      }
    }
    console.log(`✓ 创建了 ${metricsCount} 条历史指标数据`);

    console.log('✅ 广告指导建议测试数据初始化完成');
    console.log(`总计: ${createdCustomers.length}个客户, ${createdAccounts.length}个账户, ${createdRecommendationsCount}条建议, ${metricsCount}条指标`);
  } catch (error) {
    console.error('❌ 初始化广告指导建议数据失败:', error);
    throw error;
  }
}

// 在第一次请求时初始化数据
let dataInitialized = false;
async function ensureDataInitialized() {
  if (!dataInitialized) {
    try {
      await initAdGuidanceData();
      dataInitialized = true;
    } catch (error) {
      console.error('数据初始化失败:', error);
      // 即使失败也标记为已初始化，避免重复尝试
      dataInitialized = true;
      throw error;
    }
  }
}

export default {
  // 获取概览统计数据
  'GET /api/adguidance/overview': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const accounts = await getAllData('ad_accounts');
      const platforms = await getAllData('ad_platforms');
      const recommendations = await getAllData('recommendations');

      // 计算各平台统计
      const platformStats = platforms.map((platform: any) => {
        const platformAccounts = accounts.filter(
          (acc: any) => acc.platformId === platform.id
        );
        const accountIds = platformAccounts.map((acc: any) => acc.id);
        const platformRecommendations = recommendations.filter((rec: any) =>
          accountIds.includes(rec.accountId)
        );
        
        return {
          platform,
          accountCount: platformAccounts.length,
          recommendationCount: platformRecommendations.length,
          totalBalance: platformAccounts.reduce(
            (sum: number, acc: any) => sum + (acc.accountBalance || 0),
            0
          ),
        };
      });

      // 计算分数分布
      const excellent = accounts.filter((acc: any) => acc.opportunityScore >= 80).length;
      const good = accounts.filter(
        (acc: any) => acc.opportunityScore >= 40 && acc.opportunityScore < 80
      ).length;
      const poor = accounts.filter((acc: any) => acc.opportunityScore < 40).length;

      // 优化案例
      const featuredCases = [
        {
          customerName: 'TechFlow 科技',
          industry: '电商行业领导者',
          optimizationType: '优化迭代广告',
          scoreBefore: 42,
          scoreAfter: 87,
          conversionImprovement: '+156%',
          roasValue: '4.2x',
          description: '通过优化广告创意、受众定向和出价策略，账户表现显著提升。转化率提升156%，ROAS从1.8提升至4.2，广告效果超出预期。',
        },
        {
          customerName: '时尚之家服饰',
          industry: '时尚零售',
          optimizationType: '自动化规则优化',
          scoreBefore: 52,
          scoreAfter: 92,
          conversionImprovement: '+185%',
          roasValue: '5.8x',
          description: '启用智能自动出价和预算优化规则后，广告效率大幅提升。CPA降低45%，同时销售额增长185%，实现了量与质的双重突破。',
        },
      ];

      res.json({
        code: 200,
        message: 'success',
        data: {
          platforms: platformStats,
          scoreDistribution: { excellent, good, poor },
          featuredCases,
        },
      });
    } catch (error) {
      console.error('获取概览数据失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 获取优化建议列表
  'GET /api/adguidance/recommendations': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const { pageNum = 1, pageSize = 10, platform, category, scoreRange, keyword, status } = req.query;

      let recommendations = await getAllData('recommendations');
      const accounts = await getAllData('ad_accounts');
      const categories = await getAllData('recommendation_categories');
      const platforms = await getAllData('ad_platforms');
      const customers = await getAllData('adguidance_customers');

      // 关联账户和分类信息
      recommendations = recommendations.map((rec: any) => {
        const account = accounts.find((acc: any) => acc.id === rec.accountId);
        const category = categories.find((cat: any) => cat.id === rec.categoryId);
        const plat = platforms.find((p: any) => p.id === account?.platformId);
        const customer = customers.find((c: any) => c.id === account?.customerId);
        
        return {
          ...rec,
          account: account ? { ...account, platform: plat, customer } : null,
          category,
        };
      });

      // 筛选
      if (platform) {
        recommendations = recommendations.filter(
          (rec: any) => rec.account?.platform?.platformCode === platform
        );
      }
      if (category) {
        recommendations = recommendations.filter(
          (rec: any) => rec.category?.categoryCode === category
        );
      }
      if (scoreRange) {
        const [min, max] = (scoreRange as string).split('-').map(Number);
        recommendations = recommendations.filter(
          (rec: any) =>
            rec.account?.opportunityScore >= min && rec.account?.opportunityScore <= max
        );
      }
      if (keyword) {
        recommendations = recommendations.filter(
          (rec: any) =>
            rec.title.includes(keyword) ||
            rec.account?.accountId.includes(keyword)
        );
      }
      if (status) {
        recommendations = recommendations.filter((rec: any) => rec.status === status);
      }

      // 分页
      const total = recommendations.length;
      const start = (Number(pageNum) - 1) * Number(pageSize);
      const end = start + Number(pageSize);
      const list = recommendations.slice(start, end);

      res.json({
        code: 200,
        message: 'success',
        data: {
          list,
          total,
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
        },
      });
    } catch (error) {
      console.error('获取建议列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 获取分类统计
  'GET /api/adguidance/recommendations/category-stats': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const { platform } = req.query;

      let recommendations = await getAllData('recommendations');
      const accounts = await getAllData('ad_accounts');
      const categories = await getAllData('recommendation_categories');
      const platforms = await getAllData('ad_platforms');

      // 如果指定平台,先筛选账户
      let filteredAccounts = accounts;
      if (platform) {
        const platformObj = platforms.find((p: any) => p.platformCode === platform);
        filteredAccounts = accounts.filter((acc: any) => acc.platformId === platformObj?.id);
      }

      const accountIds = filteredAccounts.map((acc: any) => acc.id);
      recommendations = recommendations.filter((rec: any) =>
        accountIds.includes(rec.accountId)
      );

      // 按分类统计
      const stats = categories.map((category: any) => {
        const categoryRecs = recommendations.filter(
          (rec: any) => rec.categoryId === category.id && rec.status === 'PENDING'
        );
        const uniqueAccountIds = [...new Set(categoryRecs.map((rec: any) => rec.accountId))];
        
        return {
          category,
          accountCount: uniqueAccountIds.length,
          improvementScore: categoryRecs.reduce(
            (sum: number, rec: any) => sum + (rec.impactScore || 0),
            0
          ),
          affectedAdCount: categoryRecs.reduce(
            (sum: number, rec: any) => sum + (rec.affectedAdCount || 0),
            0
          ),
          recommendationCount: categoryRecs.length,
        };
      });

      res.json({
        code: 200,
        message: 'success',
        data: stats,
      });
    } catch (error) {
      console.error('获取分类统计失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 获取建议详情
  'GET /api/adguidance/recommendations/:id': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const { id } = req.params;
      const recommendations = await getAllData('recommendations');
      const accounts = await getAllData('ad_accounts');
      const categories = await getAllData('recommendation_categories');
      const platforms = await getAllData('ad_platforms');
      const customers = await getAllData('adguidance_customers');

      const rec = recommendations.find((r: any) => r.id === Number(id));
      if (!rec) {
        return res.status(404).json({
          code: 404,
          message: '建议不存在',
        });
      }

      const account = accounts.find((acc: any) => acc.id === rec.accountId);
      const category = categories.find((cat: any) => cat.id === rec.categoryId);
      const platform = platforms.find((p: any) => p.id === account?.platformId);
      const customer = customers.find((c: any) => c.id === account?.customerId);

      res.json({
        code: 200,
        message: 'success',
        data: {
          ...rec,
          account: account ? { ...account, platform, customer } : null,
          category,
        },
      });
    } catch (error) {
      console.error('获取建议详情失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 更新建议状态
  'PUT /api/adguidance/recommendations/:id/status': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const { id } = req.params;
      const { status } = req.body;

      const recommendations = await getAllData('recommendations');
      const recommendation = recommendations.find((rec: any) => rec.id === Number(id));
      
      if (!recommendation) {
        return res.status(404).json({
          code: 404,
          message: '建议不存在',
        });
      }

      // 使用SQL直接更新
      const { getDB } = await import('../src/db');
      const db = await getDB();
      db.run(`
        UPDATE recommendations 
        SET status = ?, reviewedAt = ?, updatedAt = ? 
        WHERE id = ?
      `, [
        status,
        status !== 'PENDING' ? new Date().toISOString() : null,
        new Date().toISOString(),
        Number(id)
      ]);

      // 保存到localStorage
      const data = db.export();
      if (typeof window !== 'undefined' && window.localStorage) {
        const binaryString = String.fromCharCode.apply(null, Array.from(data));
        const base64 = btoa(binaryString);
        localStorage.setItem('vl_project_db', base64);
      }

      // 返回更新后的数据
      const updatedRecs = await getAllData('recommendations');
      const updated = updatedRecs.find((rec: any) => rec.id === Number(id));

      res.json({
        code: 200,
        message: 'success',
        data: updated,
      });
    } catch (error) {
      console.error('更新建议状态失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 获取广告账户列表
  'GET /api/adguidance/accounts': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const { pageNum = 1, pageSize = 10, platform, scoreRange, keyword } = req.query;

      let accounts = await getAllData('ad_accounts');
      const platforms = await getAllData('ad_platforms');
      const customers = await getAllData('adguidance_customers');
      const recommendations = await getAllData('recommendations');

      // 关联信息并计算统计
      accounts = accounts.map((acc: any) => {
        const plat = platforms.find((p: any) => p.id === acc.platformId);
        const customer = customers.find((c: any) => c.id === acc.customerId);
        const accountRecs = recommendations.filter(
          (rec: any) => rec.accountId === acc.id && rec.status === 'PENDING'
        );
        const improvementScore = accountRecs.reduce(
          (sum: number, rec: any) => sum + (rec.impactScore || 0),
          0
        );
        
        return {
          ...acc,
          platform: plat,
          customer,
          recommendationCount: accountRecs.length,
          improvementScore,
        };
      });

      // 筛选
      if (platform) {
        accounts = accounts.filter((acc: any) => acc.platform?.platformCode === platform);
      }
      if (scoreRange) {
        const [min, max] = (scoreRange as string).split('-').map(Number);
        accounts = accounts.filter(
          (acc: any) => acc.opportunityScore >= min && acc.opportunityScore <= max
        );
      }
      if (keyword) {
        accounts = accounts.filter(
          (acc: any) =>
            acc.accountId.includes(keyword) ||
            acc.accountName?.includes(keyword) ||
            acc.customer?.customerName.includes(keyword)
        );
      }

      // 分页
      const total = accounts.length;
      const start = (Number(pageNum) - 1) * Number(pageSize);
      const end = start + Number(pageSize);
      const list = accounts.slice(start, end);

      res.json({
        code: 200,
        message: 'success',
        data: {
          list,
          total,
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
        },
      });
    } catch (error) {
      console.error('获取账户列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 添加广告账户
  'POST /api/adguidance/accounts': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const { accountId, accountName, platformId, customerId } = req.body;

      // 检查账户ID是否已存在
      const accounts = await getAllData('ad_accounts');
      if (accounts.some((acc: any) => acc.accountId === accountId)) {
        return res.status(409).json({
          code: 409,
          message: '该账户ID已存在',
        });
      }

      const newAccount = await addData('ad_accounts', {
        accountId,
        accountName,
        platformId,
        customerId,
        opportunityScore: 50,
        accountBalance: 0,
        totalSpend: 0,
        status: 'ACTIVE',
      });

      res.json({
        code: 200,
        message: 'success',
        data: newAccount,
      });
    } catch (error) {
      console.error('添加账户失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 获取客户列表
  'GET /api/adguidance/customers': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const customers = await getAllData('adguidance_customers');
      res.json({
        code: 200,
        message: 'success',
        data: customers.map((c: any) => ({
          id: c.id,
          customerName: c.customerName,
        })),
      });
    } catch (error) {
      console.error('获取客户列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },

  // 获取平台列表
  'GET /api/adguidance/platforms': async (req: Request, res: Response) => {
    try {
      await ensureDataInitialized();

      const platforms = await getAllData('ad_platforms');
      res.json({
        code: 200,
        message: 'success',
        data: platforms.map((p: any) => ({
          id: p.id,
          platformCode: p.platformCode,
          platformName: p.platformName,
        })),
      });
    } catch (error) {
      console.error('获取平台列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器错误: ' + (error instanceof Error ? error.message : String(error)),
      });
    }
  },
};
