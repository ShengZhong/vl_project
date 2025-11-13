/**
 * Meta广告指导相关类型定义
 * 功能点 ID: ZT-TOOL-001
 */

// 账户类型枚举
export enum AccountType {
  MANUAL_ONBOARDING = 'MANUAL_ONBOARDING',           // 手动开户
  FACE_TO_FACE = 'FACE_TO_FACE',                     // 面对面
  EMAIL_PHONE_VIDEO_CALL = 'EMAIL_PHONE_VIDEO_CALL', // 邮件/电话/视频通话
  IMPRESSION = 'IMPRESSION',                         // 展示
  CLICK = 'CLICK',                                   // 点击
  AD_ACCOUNT = 'AD_ACCOUNT',                         // 广告账户
  CAMPAIGN = 'CAMPAIGN',                             // 广告系列
  AD_GROUP = 'AD_GROUP',                             // 广告组
  PRODUCT_LAUNCHING = 'PRODUCT_LAUNCHING',           // 产品发布
  RESELLER = 'RESELLER',                             // 经销商
}

// 账户状态枚举
export enum AccountStatus {
  MANUAL_ONBOARDING = 'MANUAL_ONBOARDING',     // 手动开户
  MANUAL_BULK = 'MANUAL_BULK',                 // 手动批量
  AUTOMATED_ONBOARDING = 'AUTOMATED_ONBOARDING', // 自动开户
  AUTOMATED_BULK = 'AUTOMATED_BULK',           // 自动批量
}

// 账户事件类型枚举
export enum AccountEventType {
  IMPRESSION = 'IMPRESSION',       // 展示
  CLICK = 'CLICK',                 // 点击
  MANUAL_ADOPT = 'MANUAL_ADOPT',   // 手动采纳
}

// 账户推荐类型枚举
export enum RecommendationType {
  NO_FLIGHT_RECOMMENDATION = 'NO_FLIGHT_RECOMMENDATION',     // 无投放推荐
  ON_AD_GROUP_RECOMMENDATION = 'ON_AD_GROUP_RECOMMENDATION', // 广告组推荐
  MID_FLIGHT_RECOMMENDATION = 'MID_FLIGHT_RECOMMENDATION',   // 投放中推荐
}

// 账户层级枚举
export enum AccountHierarchy {
  AD_ACCOUNT = 'AD_ACCOUNT',       // 广告账户层级
  CAMPAIGN = 'CAMPAIGN',           // 广告系列层级
  AD_GROUP = 'AD_GROUP',           // 广告组层级
}

// 人员角色枚举
export enum PersonnelRole {
  CONTRACT_SALES = 'CONTRACT_SALES',       // 签约销售
  RESPONSIBLE_SALES = 'RESPONSIBLE_SALES', // 负责销售
}

// 客户类型枚举
export enum CustomerType {
  BV = 'BV',   // BlueView
  MH = 'MH',   // MadHouse
  BMP = 'BMP', // BMP
}

// 结算主体
export interface SettlementEntity {
  id?: number;                      // 自增ID
  entityId: string;                 // 结算主体唯一ID
  entityName: string;               // 结算主体名称
  entityType?: string;              // 结算主体类型
  createdAt?: string;               // 创建时间
  updatedAt?: string;               // 更新时间
}

// 客户信息
export interface Customer {
  id?: number;                      // 自增ID
  customerId: string;               // 客户唯一ID
  customerName: string;             // 客户名称
  consolidatedEntity: string;       // 合并主体
  customerType?: CustomerType | string; // 客户类型
  settlementEntityId?: number;      // 结算主体ID（外键）
  settlementEntity?: SettlementEntity; // 关联的结算主体（JOIN查询）
  personnel?: Personnel[];          // 关联的人员列表（JOIN查询）
  createdAt?: string;               // 创建时间
  updatedAt?: string;               // 更新时间
}

// 人员信息
export interface Personnel {
  id?: number;                      // 自增ID
  personnelName?: string;           // 人员姓名
  email: string;                    // 邮箱
  role: PersonnelRole | string;     // 角色（签约销售/负责销售）
  customerId: number;               // 客户ID（外键）
  customer?: Customer;              // 关联的客户（JOIN查询）
  createdAt?: string;               // 创建时间
  updatedAt?: string;               // 更新时间
}

// 广告账户指导列表项
export interface AdAccountGuidance {
  id?: number;                      // 自增ID
  adAccountId: string;              // 广告账户ID
  accountId?: string;                // 账户ID（Account ID）
  campaignId?: string;               // 广告系列ID（Campaign ID）
  adId?: string;                     // 广告ID（Ad ID）
  creativeId?: string;               // 创意ID（Creative ID）
  userId?: string;                   // 用户ID（User ID）
  eventId?: string;                  // 事件ID（Event ID）
  consolidatedEntity: string;       // 合并主体
  settlementEntity: string;         // 结算主体
  accountInfo: string;              // 账户信息
  accountType?: AccountType;         // 账户类型
  accountStatus?: AccountStatus;     // 账户状态
  accountHierarchy?: AccountHierarchy; // 账户层级
  personnelInfo: {                  // 人员信息
    contractSales: string;          // 签约销售（邮箱或内部ID）
    responsibleSales: string;       // 负责销售（邮箱或内部ID）
    tags?: string[];                // 标签（如 BV、MH、BMP）
  };
  accountAttributes: string;         // 账户属性（如：EC | 后台消耗结算）
  accountScore: number;             // 账户评分
  guidanceCount: number;            // 广告指导数量
  lastUpdateTime: string;           // 指导更新时间
  bid?: number;                      // 出价（Bid）
  budget?: number;                   // 预算（Budget）
  targeting?: string;                // 定向（Targeting）
  optimization?: string;             // 优化（Optimization）
  conversion?: string;               // 转化（Conversion）
  attribution?: string;              // 归因（Attribution）
  customerId?: number;              // 客户ID（外键）
  customer?: Customer;              // 关联的客户信息（JOIN查询）
  createdAt?: string;               // 创建时间
  updatedAt?: string;               // 更新时间
}

// 建议回传详情
export interface RecommendationDetail {
  id?: number;                      // 自增ID
  adAccountId: string;              // 广告账户ID（外键）
  link: string;                     // 链接
  guidanceType: RecommendationType | string; // 指导类型（如：MID_FLIGHT_RECOMMENDATION）
  guidanceContent: string;          // 指导内容（如：DELIVERY_ERROR）
  accountImprovementScore: number;  // 账户提升分数
  metricType: number;               // 指标类型
  improveableValue: string;          // 可提升数值（长数字ID）
  adObjectId: string;                // 广告对象ID（如：CAMPAIGN_GROUP）
  adLevel: number;                  // 广告级别
  metricScore: number;              // 指标分数
  metricBenchmark: number;          // 指标基准值
  guidanceUpdateTime: string;        // 指导更新时间
  userBehavior: string;             // 用户行为（如：PITCH）
  accountId?: string;                // 账户ID
  campaignId?: string;               // 广告系列ID
  adId?: string;                     // 广告ID
  creativeId?: string;               // 创意ID
  eventId?: string;                  // 事件ID
  payload?: string;                  // Payload数据
  createdAt?: string;               // 创建时间
}

// 指标回传数据详情
export interface MetricDetail {
  id?: number;                      // 自增ID
  adAccountId: string;              // 广告账户ID（外键）
  guidanceType: string;             // 指导类型（如：Unknown）
  guidanceContent: string;          // 指导内容（如：FRAGMENTATION）
  hasGuidance: boolean;              // 是否存在指导
  userReviewed: boolean;            // 用户是否查阅
  isPushed: boolean;                // 是否推送
  userClicked: boolean;             // 用户是否点击
  userAdopted: boolean;             // 用户是否采纳
  adoptedAfterReach: boolean;       // 触达后用户是否采纳
  revenueAfterAdoption: number;     // 采纳后广告对象收入
  adoptionType?: string;            // 采纳类型
  adoptionTime?: string;            // 采纳时间
  lastReachTime?: string;           // 上次触达时间
  userLastAdoptionTime?: string;    // 用户上次采纳时间
  userLastExecutionTime?: string;  // 用户上次执行时间
  callbackUpdateTime: string;       // 回传更新时间
  accountId?: string;                // 账户ID
  campaignId?: string;               // 广告系列ID
  adId?: string;                     // 广告ID
  creativeId?: string;               // 创意ID
  eventId?: string;                  // 事件ID
  userId?: string;                   // 用户ID
  payload?: string;                  // Payload数据
  eventType?: AccountEventType;      // 事件类型
  createdAt?: string;               // 创建时间
}

// 列表查询参数
export interface AdGuidanceListParams {
  pageNum: number;                   // 页码，从1开始
  pageSize: number;                  // 每页条数
  consolidatedEntity?: string;      // 合并主体
  settlementEntity?: string;         // 结算主体
  adAccountId?: string;              // 广告账户ID
  accountType?: AccountType;         // 账户类型
  accountStatus?: AccountStatus;     // 账户状态
  accountId?: string;                // 账户ID
  campaignId?: string;               // 广告系列ID
}

// 新增账户参数
export interface AddAccountParams {
  adAccountId: string;              // 广告账户ID
  consolidatedEntity: string;       // 合并主体
  settlementEntity: string;         // 结算主体
  accountInfo?: string;             // 账户信息
  accountType?: AccountType;        // 账户类型
  accountStatus?: AccountStatus;    // 账户状态
  accountHierarchy?: AccountHierarchy; // 账户层级
  personnelInfo?: {                // 人员信息
    contractSales?: string;         // 签约销售
    responsibleSales?: string;      // 负责销售
  };
  accountId?: string;               // 账户ID
  campaignId?: string;              // 广告系列ID
  adId?: string;                    // 广告ID
  creativeId?: string;               // 创意ID
  bid?: number;                     // 出价
  budget?: number;                  // 预算
  targeting?: string;               // 定向
  optimization?: string;            // 优化
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

// 列表响应
export interface AdGuidanceListResponse {
  list: AdAccountGuidance[];
  total: number;
}

// 上传Excel响应
export interface UploadExcelResponse {
  successCount: number;             // 成功回传数量
  failCount: number;                 // 失败数量
  errors?: string[];                 // 错误详情
}

