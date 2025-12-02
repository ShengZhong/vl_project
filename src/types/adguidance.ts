/**
 * VL广告指导建议 - TypeScript 类型定义
 * 功能点ID: VL-ADGD-001
 */

// ==================== 核心实体类型定义 ====================

/**
 * 广告平台
 */
export interface AdPlatform {
  id: number;                          // 主键
  platformCode: string;                // 平台代码(META/GOOGLE/TIKTOK)
  platformName: string;                // 平台显示名称
  platformIcon?: string;               // 平台图标URL
  createdAt: string;                   // 创建时间(ISO 8601)
  updatedAt: string;                   // 更新时间(ISO 8601)
}

/**
 * 客户信息
 */
export interface Customer {
  id: number;                          // 主键
  customerName: string;                // 客户名称
  industry?: string;                   // 所属行业
  customerLevel?: 'VIP' | 'NORMAL';    // 客户等级
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
}

/**
 * 广告账户
 */
export interface AdAccount {
  id: number;                          // 主键
  accountId: string;                   // 广告账户ID(平台账户ID)
  accountName?: string;                // 账户名称
  opportunityScore: number;            // 机会分数(0-100)
  accountBalance?: number;             // 账户余额(美元)
  totalSpend?: number;                 // 总花费(美元)
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'; // 账户状态
  platformId: number;                  // 外键:关联平台
  customerId: number;                  // 外键:关联客户
  expiryDate?: string;                 // 账户到期日期
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
  
  // 关联实体(查询时返回)
  platform?: AdPlatform;               // 所属平台信息
  customer?: Customer;                 // 所属客户信息
  recommendationCount?: number;        // 优化建议数量(聚合字段)
  improvementScore?: number;           // 分数提升潜力(聚合字段)
}

/**
 * 建议分类
 */
export interface RecommendationCategory {
  id: number;                          // 主键
  categoryCode: 'BUDGET' | 'CREATIVE' | 'AUDIENCE' | 'AUTO'; // 分类代码
  categoryName: string;                // 分类名称
  categoryColor?: string;              // 分类颜色(用于UI展示)
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
}

/**
 * 优化建议
 */
export interface Recommendation {
  id: number;                          // 主键
  title: string;                       // 建议标题
  description: string;                 // 建议描述
  impactScore: number;                 // 影响分数提升(可为负)
  affectedAdCount: number;             // 影响的广告数量
  status: 'PENDING' | 'ADOPTED' | 'IGNORED'; // 建议状态
  priority: 'HIGH' | 'MEDIUM' | 'LOW'; // 优先级
  accountId: number;                   // 外键:关联账户
  categoryId: number;                  // 外键:关联分类
  createdAt: string;                   // 创建时间
  updatedAt: string;                   // 更新时间
  reviewedAt?: string;                 // 采纳/忽略时间
  
  // 关联实体(查询时返回)
  account?: AdAccount;                 // 所属账户信息
  category?: RecommendationCategory;   // 建议分类信息
}

/**
 * 账户指标(历史数据)
 */
export interface AccountMetric {
  id: number;                          // 主键
  metricDate: string;                  // 指标日期(YYYY-MM-DD)
  cpa?: number;                        // CPA成本
  roas?: number;                       // ROAS
  conversionRate?: number;             // 转化率
  dailySpend?: number;                 // 日花费
  accountId: number;                   // 外键:关联账户
  createdAt: string;                   // 创建时间
}

// ==================== 查询参数类型定义 ====================

/**
 * 优化建议列表查询参数
 */
export interface RecommendationListParams {
  pageNum?: number;                    // 页码(从1开始)
  pageSize?: number;                   // 每页条数
  platform?: string;                   // 平台筛选(META/GOOGLE)
  category?: string;                   // 分类筛选(BUDGET/CREATIVE/AUDIENCE/AUTO)
  scoreRange?: string;                 // 分数范围筛选(0-40/40-80/80-100)
  keyword?: string;                    // 搜索关键词(账户ID/建议标题)
  status?: string;                     // 状态筛选(PENDING/ADOPTED/IGNORED)
  sortBy?: string;                     // 排序字段
  sortOrder?: 'asc' | 'desc';          // 排序方向
}

/**
 * 账户列表查询参数
 */
export interface AdAccountListParams {
  pageNum?: number;                    // 页码
  pageSize?: number;                   // 每页条数
  platform?: string;                   // 平台筛选
  scoreRange?: string;                 // 分数范围
  keyword?: string;                    // 搜索关键词
}

/**
 * 概览统计数据
 */
export interface OverviewData {
  platforms: PlatformStat[];           // 各平台统计
  scoreDistribution: {                 // 分数分布统计
    excellent: number;                 // 优秀账户数(≥80分)
    good: number;                      // 待改进账户数(40-79分)
    poor: number;                      // 需关注账户数(<40分)
  };
  featuredCases: OptimizationCase[];   // 优化案例
}

/**
 * 平台统计
 */
export interface PlatformStat {
  platform: AdPlatform;                // 平台信息
  accountCount: number;                // 账户数量
  recommendationCount: number;         // 优化建议数
  totalBalance: number;                // 总余额
}

/**
 * 优化案例
 */
export interface OptimizationCase {
  customerName: string;                // 客户名称
  industry: string;                    // 行业
  optimizationType: string;            // 优化类型
  scoreBefore: number;                 // 优化前分数
  scoreAfter: number;                  // 优化后分数
  conversionImprovement: string;       // 转化率提升
  roasValue: string;                   // ROAS值
  description: string;                 // 案例描述
}

/**
 * 分类统计数据
 */
export interface CategoryStat {
  category: RecommendationCategory;    // 分类信息
  accountCount: number;                // 影响账户数
  improvementScore: number;            // 分数提升
  affectedAdCount: number;             // 影响广告数
  recommendationCount: number;         // 建议数量
}

/**
 * 批量导入结果
 */
export interface ImportResult {
  success: number;                     // 成功数量
  failed: number;                      // 失败数量
  errors: ImportError[];               // 错误明细
}

/**
 * 批量导入错误信息
 */
export interface ImportError {
  row: number;                         // 错误行号
  field: string;                       // 错误字段
  message: string;                     // 错误信息
}

/**
 * 添加账户表单数据
 */
export interface AddAccountFormData {
  platformId: number;                  // 平台ID
  accountId: string;                   // 账户ID
  accountName?: string;                // 账户名称
  customerId: number;                  // 客户ID
}

// ==================== API 响应类型定义 ====================

/**
 * 统一API响应结构
 */
export interface ApiResponse<T = any> {
  code: number;                        // 响应码
  message: string;                     // 响应消息
  data: T;                             // 响应数据
}

/**
 * 分页列表响应结构
 */
export interface PageResponse<T = any> {
  list: T[];                           // 数据列表
  total: number;                       // 总条数
  pageNum: number;                     // 当前页码
  pageSize: number;                    // 每页条数
}

