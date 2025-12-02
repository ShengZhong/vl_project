/**
 * 本地数据库工具类
 * 基于 SQLite (sql.js) 实现，使用 localStorage 作为存储适配器
 */

// 使用类型导入，避免直接导入 sql.js 模块
type Database = any;
type SqlJsStatic = any;

// 数据库结构定义（用于类型检查）
export interface DatabaseSchema {
  // VL用户列表数据
  vlusers: any[];
  // Meta广告指导数据
  metaadguidance: {
    accounts: any[];
    recommendations: any[];
    metrics: any[];
  };
  // 个人信息数据
  profiles: any[];
  // 其他功能数据
  [key: string]: any;
}

// SQLite 数据库实例
let db: Database | null = null;
let SQL: SqlJsStatic | null = null;

// 数据库初始化标志
let initialized = false;

/**
 * 初始化 SQLite 数据库
 */
const initDatabase = async (): Promise<void> => {
  if (initialized && db) {
    return;
  }

  try {
    // 初始化 sql.js（使用 CDN 加载以避免 webpack 打包问题）
    if (!SQL) {
      if (typeof window === 'undefined') {
        // Node.js/SSR 环境：暂时不支持，直接返回
        console.warn('数据库功能仅在浏览器环境中可用');
        return;
      }

      // 浏览器环境：从 CDN 加载 sql.js
      // 检查是否已经加载了 sql.js 脚本
      if (!(window as any).initSqlJs) {
        // 动态加载 sql.js 脚本
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://sql.js.org/dist/sql-wasm.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load sql.js from CDN'));
          document.head.appendChild(script);
        });
      }
      
      // 初始化 SQL.js
      const initSqlJs = (window as any).initSqlJs;
      SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });
    }

    // 从 localStorage 加载数据库（如果存在）
    let dbData: Uint8Array | null = null;
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedDb = localStorage.getItem('vl_project_db');
      if (savedDb) {
        try {
          // 将 base64 字符串转换为 Uint8Array
          const binaryString = atob(savedDb);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          dbData = bytes;
        } catch (e) {
          console.warn('加载数据库失败，将创建新数据库', e);
        }
      }
    }

    // 创建或加载数据库
    if (dbData) {
      db = new SQL.Database(dbData);
      // 运行数据迁移
      runMigrations();
    } else {
      db = new SQL.Database();
      // 创建表结构
      createTables();
    }

    initialized = true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
};

/**
 * 创建所有表结构
 */
const createTables = (): void => {
  if (!db) return;

  // VL用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS vlusers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vlid TEXT UNIQUE NOT NULL,
      token TEXT,
      registeredEntity TEXT,
      registeredTime TEXT,
      claimTime TEXT,
      claimStatus TEXT,
      certStatus TEXT,
      status TEXT,
      email TEXT,
      contactPerson TEXT,
      phone TEXT,
      customerSource TEXT,
      signCompany TEXT,
      signSales TEXT,
      signEmail TEXT,
      walletStatus TEXT,
      balance REAL,
      responsibleSales TEXT,
      responsibleAE TEXT,
      tags TEXT,
      data TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // 结算主体表
  db.run(`
    CREATE TABLE IF NOT EXISTS settlement_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entityId TEXT UNIQUE NOT NULL,
      entityName TEXT NOT NULL,
      entityType TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // 客户信息表
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId TEXT UNIQUE NOT NULL,
      customerName TEXT NOT NULL,
      consolidatedEntity TEXT NOT NULL,
      customerType TEXT,
      settlementEntityId INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (settlementEntityId) REFERENCES settlement_entities(id)
    )
  `);

  // 为 customers.settlementEntityId 创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_customers_settlementEntityId 
    ON customers(settlementEntityId)
  `);

  // 人员信息表
  db.run(`
    CREATE TABLE IF NOT EXISTS personnel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnelName TEXT,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      customerId INTEGER NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  // 为 personnel.customerId 创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_personnel_customerId 
    ON personnel(customerId)
  `);

  // Meta广告指导账户表
  db.run(`
    CREATE TABLE IF NOT EXISTS metaadguidance_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adAccountId TEXT UNIQUE NOT NULL,
      accountId TEXT,
      campaignId TEXT,
      adId TEXT,
      creativeId TEXT,
      userId TEXT,
      eventId TEXT,
      consolidatedEntity TEXT NOT NULL,
      settlementEntity TEXT NOT NULL,
      accountInfo TEXT,
      accountType TEXT,
      accountStatus TEXT,
      accountHierarchy TEXT,
      contractSales TEXT,
      responsibleSales TEXT,
      tags TEXT,
      accountAttributes TEXT,
      accountScore INTEGER DEFAULT 0,
      guidanceCount INTEGER DEFAULT 0,
      lastUpdateTime TEXT,
      bid REAL,
      budget REAL,
      targeting TEXT,
      optimization TEXT,
      conversion TEXT,
      attribution TEXT,
      customerId INTEGER,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customerId) REFERENCES customers(id)
    )
  `);

  // 为 metaadguidance_accounts.customerId 创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_metaadguidance_accounts_customerId 
    ON metaadguidance_accounts(customerId)
  `);

  // Meta广告指导推荐表
  db.run(`
    CREATE TABLE IF NOT EXISTS metaadguidance_recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adAccountId TEXT NOT NULL,
      link TEXT,
      guidanceType TEXT,
      guidanceContent TEXT,
      accountImprovementScore INTEGER DEFAULT 0,
      metricType INTEGER DEFAULT 0,
      improveableValue TEXT,
      adObjectId TEXT,
      adLevel INTEGER DEFAULT 0,
      metricScore REAL DEFAULT 0,
      metricBenchmark REAL DEFAULT 0,
      guidanceUpdateTime TEXT,
      userBehavior TEXT,
      accountId TEXT,
      campaignId TEXT,
      adId TEXT,
      creativeId TEXT,
      eventId TEXT,
      payload TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (adAccountId) REFERENCES metaadguidance_accounts(adAccountId) ON DELETE CASCADE
    )
  `);

  // 为 metaadguidance_recommendations.adAccountId 创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_metaadguidance_recommendations_adAccountId 
    ON metaadguidance_recommendations(adAccountId)
  `);

  // Meta广告指导指标表
  db.run(`
    CREATE TABLE IF NOT EXISTS metaadguidance_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adAccountId TEXT NOT NULL,
      guidanceType TEXT,
      guidanceContent TEXT,
      hasGuidance INTEGER DEFAULT 0,
      userReviewed INTEGER DEFAULT 0,
      isPushed INTEGER DEFAULT 0,
      userClicked INTEGER DEFAULT 0,
      userAdopted INTEGER DEFAULT 0,
      adoptedAfterReach INTEGER DEFAULT 0,
      revenueAfterAdoption REAL DEFAULT 0,
      adoptionType TEXT,
      adoptionTime TEXT,
      lastReachTime TEXT,
      userLastAdoptionTime TEXT,
      userLastExecutionTime TEXT,
      callbackUpdateTime TEXT NOT NULL,
      accountId TEXT,
      campaignId TEXT,
      adId TEXT,
      creativeId TEXT,
      eventId TEXT,
      userId TEXT,
      payload TEXT,
      eventType TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (adAccountId) REFERENCES metaadguidance_accounts(adAccountId) ON DELETE CASCADE
    )
  `);

  // 为 metaadguidance_metrics.adAccountId 创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_metaadguidance_metrics_adAccountId 
    ON metaadguidance_metrics(adAccountId)
  `);

  // 个人信息表
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT UNIQUE NOT NULL,
      username TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      role TEXT,
      roleName TEXT,
      department TEXT,
      avatar TEXT,
      lastLoginAt TEXT,
      data TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // ===== VL广告指导建议系统表结构 (功能点ID: VL-ADGD-001) =====

  // 广告平台表
  db.run(`
    CREATE TABLE IF NOT EXISTS ad_platforms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platformCode TEXT UNIQUE NOT NULL,
      platformName TEXT NOT NULL,
      platformIcon TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // 插入初始平台数据
  db.run(`
    INSERT OR IGNORE INTO ad_platforms (platformCode, platformName) VALUES 
      ('META', 'Meta Ads'),
      ('GOOGLE', 'Google Ads'),
      ('TIKTOK', 'TikTok Ads')
  `);

  // 更新已存在的平台名称（数据迁移）
  db.run(`
    UPDATE ad_platforms 
    SET platformName = 'Meta Ads'
    WHERE platformCode = 'META' AND platformName != 'Meta Ads'
  `);

  // 广告指导客户信息表
  db.run(`
    CREATE TABLE IF NOT EXISTS adguidance_customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      industry TEXT,
      customerLevel TEXT DEFAULT 'NORMAL',
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // 广告账户表
  db.run(`
    CREATE TABLE IF NOT EXISTS ad_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      accountId TEXT UNIQUE NOT NULL,
      accountName TEXT,
      opportunityScore INTEGER DEFAULT 0,
      accountBalance REAL DEFAULT 0,
      totalSpend REAL DEFAULT 0,
      status TEXT DEFAULT 'ACTIVE',
      platformId INTEGER NOT NULL,
      customerId INTEGER,
      expiryDate TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (platformId) REFERENCES ad_platforms(id) ON DELETE RESTRICT,
      FOREIGN KEY (customerId) REFERENCES adguidance_customers(id) ON DELETE SET NULL
    )
  `);

  // 为广告账户表创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_ad_accounts_platformId 
    ON ad_accounts(platformId)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_ad_accounts_customerId 
    ON ad_accounts(customerId)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_ad_accounts_opportunityScore 
    ON ad_accounts(opportunityScore)
  `);

  // 建议分类表
  db.run(`
    CREATE TABLE IF NOT EXISTS recommendation_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryCode TEXT UNIQUE NOT NULL,
      categoryName TEXT NOT NULL,
      categoryColor TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // 插入初始分类数据
  db.run(`
    INSERT OR IGNORE INTO recommendation_categories (categoryCode, categoryName, categoryColor) VALUES 
      ('BUDGET', '预算', 'green'),
      ('CREATIVE', '创意', 'purple'),
      ('AUDIENCE', '受众', 'blue'),
      ('AUTO', '自动化', 'orange')
  `);

  // 优化建议表
  db.run(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      impactScore INTEGER DEFAULT 0,
      affectedAdCount INTEGER DEFAULT 0,
      status TEXT DEFAULT 'PENDING',
      priority TEXT DEFAULT 'MEDIUM',
      accountId INTEGER NOT NULL,
      categoryId INTEGER NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      reviewedAt TEXT,
      FOREIGN KEY (accountId) REFERENCES ad_accounts(id) ON DELETE CASCADE,
      FOREIGN KEY (categoryId) REFERENCES recommendation_categories(id) ON DELETE RESTRICT
    )
  `);

  // 为优化建议表创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_recommendations_accountId 
    ON recommendations(accountId)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_recommendations_categoryId 
    ON recommendations(categoryId)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_recommendations_status 
    ON recommendations(status)
  `);

  // 账户指标表
  db.run(`
    CREATE TABLE IF NOT EXISTS account_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metricDate TEXT NOT NULL,
      cpa REAL,
      roas REAL,
      conversionRate REAL,
      dailySpend REAL,
      accountId INTEGER NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (accountId) REFERENCES ad_accounts(id) ON DELETE CASCADE
    )
  `);

  // 为账户指标表创建索引
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_account_metrics_accountId 
    ON account_metrics(accountId)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_account_metrics_metricDate 
    ON account_metrics(metricDate)
  `);

  saveDatabase();
};

/**
 * 运行数据库迁移
 * 用于更新已存在的数据库结构和数据
 */
const runMigrations = (): void => {
  if (!db) return;

  try {
    // 迁移1: 更新 Meta 平台名称从 "Meta (Facebook & Instagram)" 到 "Meta Ads"
    db.run(`
      UPDATE ad_platforms 
      SET platformName = 'Meta Ads', updatedAt = datetime('now')
      WHERE platformCode = 'META' AND platformName != 'Meta Ads'
    `);

    console.log('数据库迁移完成');
    saveDatabase();
  } catch (error) {
    console.error('数据库迁移失败:', error);
  }
};

/**
 * 保存数据库到 localStorage
 */
const saveDatabase = (): void => {
  if (!db) return;

  try {
    const data = db.export();
    if (typeof window !== 'undefined' && window.localStorage) {
      // 将 Uint8Array 转换为 base64 字符串
      const binaryString = String.fromCharCode.apply(null, Array.from(data));
      const base64 = btoa(binaryString);
      localStorage.setItem('vl_project_db', base64);
    }
  } catch (error) {
    console.error('保存数据库失败:', error);
  }
};

/**
 * 确保数据库已初始化
 */
const ensureInitialized = async (): Promise<void> => {
  if (!initialized || !db) {
    await initDatabase();
  }
};

/**
 * 获取数据库实例
 */
export const getDB = async (): Promise<Database> => {
  await ensureInitialized();
  if (!db) {
    throw new Error('数据库未初始化');
  }
  return db;
};

/**
 * 将对象转换为 JSON 字符串（用于存储复杂对象）
 */
const serialize = (obj: any): string => {
  return JSON.stringify(obj || {});
};

/**
 * 将 JSON 字符串转换为对象
 */
const deserialize = <T = any>(str: string | null): T | null => {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
};

/**
 * 添加数据到指定表
 * @param tableName 表名
 * @param data 要添加的数据
 * @returns 添加后的数据（包含生成的ID）
 */
export const addData = async <T = any>(tableName: string, data: T): Promise<T> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const database = db;
  let sql = '';
  let values: any[] = [];

  if (tableName === 'vlusers') {
    const item = data as any;
    sql = `
      INSERT INTO vlusers (
        vlid, token, registeredEntity, registeredTime, claimTime, claimStatus, certStatus,
        status, email, contactPerson, phone, customerSource, signCompany, signSales,
        signEmail, walletStatus, balance, responsibleSales, responsibleAE, tags, data, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.vlid || '',
      item.token || '',
      item.registeredEntity || '',
      item.registeredTime || new Date().toISOString(),
      item.claimTime || null,
      item.claimStatus || 'unclaimed',
      item.certStatus || 'uncertified',
      item.status || 'active',
      item.email || '',
      item.contactPerson || '',
      item.phone || '',
      item.customerSource || '',
      item.signCompany || null,
      item.signSales || null,
      item.signEmail || null,
      item.walletStatus || null,
      item.balance || null,
      item.responsibleSales || null,
      item.responsibleAE || null,
      serialize(item.tags || []),
      serialize(item),
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
    ];
  } else if (tableName === 'settlement_entities') {
    const item = data as any;
    sql = `
      INSERT INTO settlement_entities (
        entityId, entityName, entityType, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?)
    `;
    values = [
      item.entityId || '',
      item.entityName || '',
      item.entityType || null,
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
    ];
  } else if (tableName === 'customers') {
    const item = data as any;
    sql = `
      INSERT INTO customers (
        customerId, customerName, consolidatedEntity, customerType, settlementEntityId, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.customerId || '',
      item.customerName || '',
      item.consolidatedEntity || '',
      item.customerType || null,
      item.settlementEntityId || null,
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
    ];
  } else if (tableName === 'personnel') {
    const item = data as any;
    sql = `
      INSERT INTO personnel (
        personnelName, email, role, customerId, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.personnelName || '',
      item.email || '',
      item.role || '',
      item.customerId || 0,
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
    ];
  } else if (tableName === 'metaadguidance.accounts') {
    const item = data as any;
    sql = `
      INSERT INTO metaadguidance_accounts (
        adAccountId, accountId, campaignId, adId, creativeId, userId, eventId,
        consolidatedEntity, settlementEntity, accountInfo, accountType, accountStatus,
        accountHierarchy, contractSales, responsibleSales, tags, accountAttributes,
        accountScore, guidanceCount, lastUpdateTime, bid, budget, targeting,
        optimization, conversion, attribution, customerId, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.adAccountId || '',
      item.accountId || null,
      item.campaignId || null,
      item.adId || null,
      item.creativeId || null,
      item.userId || null,
      item.eventId || null,
      item.consolidatedEntity || '',
      item.settlementEntity || '',
      item.accountInfo || '',
      item.accountType || null,
      item.accountStatus || null,
      item.accountHierarchy || null,
      item.personnelInfo?.contractSales || '',
      item.personnelInfo?.responsibleSales || '',
      serialize(item.personnelInfo?.tags || []),
      item.accountAttributes || '',
      item.accountScore || 0,
      item.guidanceCount || 0,
      item.lastUpdateTime || new Date().toISOString(),
      item.bid || null,
      item.budget || null,
      item.targeting || null,
      item.optimization || null,
      item.conversion || null,
      item.attribution || null,
      item.customerId || null,
      new Date().toISOString(),
    ];
  } else if (tableName === 'metaadguidance.recommendations') {
    const item = data as any;
    sql = `
      INSERT INTO metaadguidance_recommendations (
        adAccountId, link, guidanceType, guidanceContent, accountImprovementScore, metricType,
        improveableValue, adObjectId, adLevel, metricScore, metricBenchmark,
        guidanceUpdateTime, userBehavior, accountId, campaignId, adId, creativeId, eventId, payload
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.adAccountId || '',
      item.link || '',
      item.guidanceType || '',
      item.guidanceContent || '',
      item.accountImprovementScore || 0,
      item.metricType || 0,
      item.improveableValue || '',
      item.adObjectId || '',
      item.adLevel || 0,
      item.metricScore || 0,
      item.metricBenchmark || 0,
      item.guidanceUpdateTime || new Date().toISOString(),
      item.userBehavior || '',
      item.accountId || null,
      item.campaignId || null,
      item.adId || null,
      item.creativeId || null,
      item.eventId || null,
      item.payload || null,
    ];
  } else if (tableName === 'metaadguidance.metrics') {
    const item = data as any;
    sql = `
      INSERT INTO metaadguidance_metrics (
        adAccountId, guidanceType, guidanceContent, hasGuidance, userReviewed, isPushed,
        userClicked, userAdopted, adoptedAfterReach, revenueAfterAdoption,
        adoptionType, adoptionTime, lastReachTime, userLastAdoptionTime,
        userLastExecutionTime, callbackUpdateTime, accountId, campaignId,
        adId, creativeId, eventId, userId, payload, eventType
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.adAccountId || '',
      item.guidanceType || '',
      item.guidanceContent || '',
      item.hasGuidance ? 1 : 0,
      item.userReviewed ? 1 : 0,
      item.isPushed ? 1 : 0,
      item.userClicked ? 1 : 0,
      item.userAdopted ? 1 : 0,
      item.adoptedAfterReach ? 1 : 0,
      item.revenueAfterAdoption || 0,
      item.adoptionType || null,
      item.adoptionTime || null,
      item.lastReachTime || null,
      item.userLastAdoptionTime || null,
      item.userLastExecutionTime || null,
      item.callbackUpdateTime || new Date().toISOString(),
      item.accountId || null,
      item.campaignId || null,
      item.adId || null,
      item.creativeId || null,
      item.eventId || null,
      item.userId || null,
      item.payload || null,
      item.eventType || null,
    ];
  } else if (tableName === 'profiles') {
    const item = data as any;
    sql = `
      INSERT INTO profiles (
        userId, username, name, email, phone, role, roleName, department, avatar, lastLoginAt, data, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.userId || item.id || '',
      item.username || '',
      item.name || '',
      item.email || '',
      item.phone || '',
      item.role || 'user',
      item.roleName || '普通用户',
      item.department || null,
      item.avatar || '',
      item.lastLoginAt || null,
      serialize(item),
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
    ];
  } else if (tableName === 'adguidance_customers') {
    const item = data as any;
    sql = `
      INSERT INTO adguidance_customers (
        customerName, industry, customerLevel, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?)
    `;
    values = [
      item.customerName || '',
      item.industry || null,
      item.customerLevel || 'NORMAL',
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
    ];
  } else if (tableName === 'ad_accounts') {
    const item = data as any;
    sql = `
      INSERT INTO ad_accounts (
        accountId, accountName, opportunityScore, accountBalance, totalSpend,
        status, platformId, customerId, expiryDate, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.accountId || '',
      item.accountName || null,
      item.opportunityScore || 0,
      item.accountBalance || 0,
      item.totalSpend || 0,
      item.status || 'ACTIVE',
      item.platformId || 0,
      item.customerId || null,
      item.expiryDate || null,
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
    ];
  } else if (tableName === 'recommendations') {
    const item = data as any;
    sql = `
      INSERT INTO recommendations (
        title, description, impactScore, affectedAdCount, status, priority,
        accountId, categoryId, createdAt, updatedAt, reviewedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.title || '',
      item.description || '',
      item.impactScore || 0,
      item.affectedAdCount || 0,
      item.status || 'PENDING',
      item.priority || 'MEDIUM',
      item.accountId || 0,
      item.categoryId || 0,
      item.createdAt || new Date().toISOString(),
      item.updatedAt || new Date().toISOString(),
      item.reviewedAt || null,
    ];
  } else if (tableName === 'account_metrics') {
    const item = data as any;
    sql = `
      INSERT INTO account_metrics (
        metricDate, cpa, roas, conversionRate, dailySpend, accountId, createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      item.metricDate || new Date().toISOString().split('T')[0],
      item.cpa || null,
      item.roas || null,
      item.conversionRate || null,
      item.dailySpend || null,
      item.accountId || 0,
      item.createdAt || new Date().toISOString(),
    ];
  } else {
    throw new Error(`不支持的表名: ${tableName}`);
  }

  database.run(sql, values);
  saveDatabase();

  // 返回添加的数据（包含生成的ID）
  const result = database.exec(`SELECT last_insert_rowid() as id`);
  const id = result[0]?.values[0]?.[0];
  return { ...data, id } as T;
};

/**
 * 批量添加数据到指定表
 * @param tableName 表名
 * @param dataList 要添加的数据列表
 * @returns 添加后的数据列表
 */
export const addBatchData = async <T = any>(tableName: string, dataList: T[]): Promise<T[]> => {
  const results: T[] = [];
  for (const data of dataList) {
    const result = await addData<T>(tableName, data);
    results.push(result);
  }
  return results;
};

/**
 * 根据条件查找数据
 * @param tableName 表名
 * @param predicate 查找条件函数
 * @returns 找到的数据列表
 */
export const findData = async <T = any>(
  tableName: string,
  predicate: (item: any) => boolean
): Promise<T[]> => {
  const allData = await getAllData<T>(tableName);
  return allData.filter(predicate);
};

/**
 * 根据条件查找单条数据
 * @param tableName 表名
 * @param predicate 查找条件函数
 * @returns 找到的数据，未找到返回 undefined
 */
export const findOneData = async <T = any>(
  tableName: string,
  predicate: (item: any) => boolean
): Promise<T | undefined> => {
  const allData = await getAllData<T>(tableName);
  return allData.find(predicate);
};

/**
 * 更新数据
 * @param tableName 表名
 * @param predicate 查找条件函数
 * @param updater 更新函数
 * @returns 更新后的数据
 */
export const updateData = async <T = any>(
  tableName: string,
  predicate: (item: any) => boolean,
  updater: (item: any) => any
): Promise<T | undefined> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const allData = await getAllData<T>(tableName);
  const item = allData.find(predicate);
  
  if (!item) {
    return undefined;
  }

  const updated = updater(item);
  
  // 根据表名执行更新操作
  if (tableName === 'metaadguidance.accounts') {
    const data = updated as any;
    db.run(`
      UPDATE metaadguidance_accounts SET
        accountId = ?, campaignId = ?, adId = ?, creativeId = ?, userId = ?, eventId = ?,
        consolidatedEntity = ?, settlementEntity = ?, accountInfo = ?, accountType = ?,
        accountStatus = ?, accountHierarchy = ?, contractSales = ?, responsibleSales = ?,
        tags = ?, accountAttributes = ?, accountScore = ?, guidanceCount = ?,
        lastUpdateTime = ?, bid = ?, budget = ?, targeting = ?, optimization = ?,
        conversion = ?, attribution = ?, updatedAt = ?
      WHERE adAccountId = ?
    `, [
      data.accountId || null,
      data.campaignId || null,
      data.adId || null,
      data.creativeId || null,
      data.userId || null,
      data.eventId || null,
      data.consolidatedEntity || '',
      data.settlementEntity || '',
      data.accountInfo || '',
      data.accountType || null,
      data.accountStatus || null,
      data.accountHierarchy || null,
      data.personnelInfo?.contractSales || '',
      data.personnelInfo?.responsibleSales || '',
      serialize(data.personnelInfo?.tags || []),
      data.accountAttributes || '',
      data.accountScore || 0,
      data.guidanceCount || 0,
      data.lastUpdateTime || new Date().toISOString(),
      data.bid || null,
      data.budget || null,
      data.targeting || null,
      data.optimization || null,
      data.conversion || null,
      data.attribution || null,
      new Date().toISOString(),
      (item as any).adAccountId,
    ]);
  } else if (tableName === 'vlusers') {
    const data = updated as any;
    db.run(`
      UPDATE vlusers SET
        token = ?, registeredEntity = ?, registeredTime = ?, claimTime = ?, claimStatus = ?,
        certStatus = ?, status = ?, email = ?, contactPerson = ?, phone = ?, customerSource = ?,
        signCompany = ?, signSales = ?, signEmail = ?, walletStatus = ?, balance = ?,
        responsibleSales = ?, responsibleAE = ?, tags = ?, data = ?, updatedAt = ?
      WHERE vlid = ?
    `, [
      data.token || '',
      data.registeredEntity || '',
      data.registeredTime || new Date().toISOString(),
      data.claimTime || null,
      data.claimStatus || 'unclaimed',
      data.certStatus || 'uncertified',
      data.status || 'active',
      data.email || '',
      data.contactPerson || '',
      data.phone || '',
      data.customerSource || '',
      data.signCompany || null,
      data.signSales || null,
      data.signEmail || null,
      data.walletStatus || null,
      data.balance || null,
      data.responsibleSales || null,
      data.responsibleAE || null,
      serialize(data.tags || []),
      serialize(data),
      new Date().toISOString(),
      (item as any).vlid,
    ]);
  } else if (tableName === 'profiles') {
    const data = updated as any;
    db.run(`
      UPDATE profiles SET
        username = ?, name = ?, email = ?, phone = ?, role = ?, roleName = ?,
        department = ?, avatar = ?, lastLoginAt = ?, data = ?, updatedAt = ?
      WHERE userId = ?
    `, [
      data.username || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.role || 'user',
      data.roleName || '普通用户',
      data.department || null,
      data.avatar || '',
      data.lastLoginAt || null,
      serialize(data),
      new Date().toISOString(),
      (item as any).userId || (item as any).id,
    ]);
  }

  saveDatabase();
  return updated as T;
};

/**
 * 删除数据
 * @param tableName 表名
 * @param predicate 查找条件函数
 * @returns 删除的数据
 */
export const removeData = async <T = any>(
  tableName: string,
  predicate: (item: any) => boolean
): Promise<T | undefined> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const allData = await getAllData<T>(tableName);
  const item = allData.find(predicate);
  
  if (!item) {
    return undefined;
  }

  // 根据表名执行删除操作
  if (tableName === 'metaadguidance.accounts') {
    db.run('DELETE FROM metaadguidance_accounts WHERE adAccountId = ?', [(item as any).adAccountId]);
  } else if (tableName === 'vlusers') {
    db.run('DELETE FROM vlusers WHERE vlid = ?', [(item as any).vlid]);
  } else if (tableName === 'profiles') {
    db.run('DELETE FROM profiles WHERE userId = ?', [(item as any).userId]);
  }

  saveDatabase();
  return item;
};

/**
 * 删除多条数据
 * @param tableName 表名
 * @param predicate 查找条件函数
 * @returns 删除的数据列表
 */
export const removeBatchData = async <T = any>(
  tableName: string,
  predicate: (item: any) => boolean
): Promise<T[]> => {
  const allData = await getAllData<T>(tableName);
  const itemsToDelete = allData.filter(predicate);
  
  for (const item of itemsToDelete) {
    await removeData<T>(tableName, (i: any) => {
      if (tableName === 'metaadguidance.accounts') {
        return (i as any).adAccountId === (item as any).adAccountId;
      } else if (tableName === 'vlusers') {
        return (i as any).vlid === (item as any).vlid;
      } else if (tableName === 'profiles') {
        return (i as any).userId === (item as any).userId;
      }
      return false;
    });
  }
  
  return itemsToDelete;
};

/**
 * 获取表中所有数据
 * @param tableName 表名
 * @returns 所有数据列表
 */
export const getAllData = async <T = any>(tableName: string): Promise<T[]> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  let sql = '';
  let transform: (row: any[]) => T;

  if (tableName === 'vlusers') {
    sql = 'SELECT * FROM vlusers';
    transform = (row: any[]) => {
      const data = deserialize(row[21]) || {};
      const tags = deserialize(row[20]) || [];
      return {
        id: row[0],
        vlid: row[1],
        token: row[2],
        registeredEntity: row[3],
        registeredTime: row[4],
        claimTime: row[5],
        claimStatus: row[6],
        certStatus: row[7],
        status: row[8],
        email: row[9],
        contactPerson: row[10],
        phone: row[11],
        customerSource: row[12],
        signCompany: row[13],
        signSales: row[14],
        signEmail: row[15],
        walletStatus: row[16],
        balance: row[17],
        responsibleSales: row[18],
        responsibleAE: row[19],
        tags: tags,
        createdAt: row[22],
        updatedAt: row[23],
        ...data,
      } as T;
    };
  } else if (tableName === 'settlement_entities') {
    sql = 'SELECT * FROM settlement_entities';
    transform = (row: any[]) => {
      return {
        id: row[0],
        entityId: row[1],
        entityName: row[2],
        entityType: row[3],
        createdAt: row[4],
        updatedAt: row[5],
      } as T;
    };
  } else if (tableName === 'customers') {
    sql = 'SELECT * FROM customers';
    transform = (row: any[]) => {
      return {
        id: row[0],
        customerId: row[1],
        customerName: row[2],
        consolidatedEntity: row[3],
        customerType: row[4],
        settlementEntityId: row[5],
        createdAt: row[6],
        updatedAt: row[7],
      } as T;
    };
  } else if (tableName === 'personnel') {
    sql = 'SELECT * FROM personnel';
    transform = (row: any[]) => {
      return {
        id: row[0],
        personnelName: row[1],
        email: row[2],
        role: row[3],
        customerId: row[4],
        createdAt: row[5],
        updatedAt: row[6],
      } as T;
    };
  } else if (tableName === 'metaadguidance.accounts') {
    sql = 'SELECT * FROM metaadguidance_accounts';
    transform = (row: any[]) => {
      return {
        id: row[0],
        adAccountId: row[1],
        accountId: row[2],
        campaignId: row[3],
        adId: row[4],
        creativeId: row[5],
        userId: row[6],
        eventId: row[7],
        consolidatedEntity: row[8],
        settlementEntity: row[9],
        accountInfo: row[10],
        accountType: row[11],
        accountStatus: row[12],
        accountHierarchy: row[13],
        personnelInfo: {
          contractSales: row[14],
          responsibleSales: row[15],
          tags: deserialize(row[16]) || [],
        },
        accountAttributes: row[17],
        accountScore: row[18],
        guidanceCount: row[19],
        lastUpdateTime: row[20],
        bid: row[21],
        budget: row[22],
        targeting: row[23],
        optimization: row[24],
        conversion: row[25],
        attribution: row[26],
        customerId: row[27],
        createdAt: row[28],
        updatedAt: row[29],
      } as T;
    };
  } else if (tableName === 'metaadguidance.recommendations') {
    sql = 'SELECT * FROM metaadguidance_recommendations';
    transform = (row: any[]) => {
      return {
        id: row[0],
        adAccountId: row[1],
        link: row[2],
        guidanceType: row[3],
        guidanceContent: row[4],
        accountImprovementScore: row[5],
        metricType: row[6],
        improveableValue: row[7],
        adObjectId: row[8],
        adLevel: row[9],
        metricScore: row[10],
        metricBenchmark: row[11],
        guidanceUpdateTime: row[12],
        userBehavior: row[13],
        accountId: row[14],
        campaignId: row[15],
        adId: row[16],
        creativeId: row[17],
        eventId: row[18],
        payload: row[19],
        createdAt: row[20],
      } as T;
    };
  } else if (tableName === 'metaadguidance.metrics') {
    sql = 'SELECT * FROM metaadguidance_metrics';
    transform = (row: any[]) => {
      return {
        id: row[0],
        adAccountId: row[1],
        guidanceType: row[2],
        guidanceContent: row[3],
        hasGuidance: row[4] === 1,
        userReviewed: row[5] === 1,
        isPushed: row[6] === 1,
        userClicked: row[7] === 1,
        userAdopted: row[8] === 1,
        adoptedAfterReach: row[9] === 1,
        revenueAfterAdoption: row[10],
        adoptionType: row[11],
        adoptionTime: row[12],
        lastReachTime: row[13],
        userLastAdoptionTime: row[14],
        userLastExecutionTime: row[15],
        callbackUpdateTime: row[16],
        accountId: row[17],
        campaignId: row[18],
        adId: row[19],
        creativeId: row[20],
        eventId: row[21],
        userId: row[22],
        payload: row[23],
        eventType: row[24],
        createdAt: row[25],
      } as T;
    };
  } else if (tableName === 'profiles') {
    sql = 'SELECT * FROM profiles';
    transform = (row: any[]) => {
      const data = deserialize(row[11]) || {};
      return {
        id: row[1] || row[0], // 优先使用userId作为id
        userId: row[1],
        username: row[2],
        name: row[3],
        email: row[4],
        phone: row[5],
        role: row[6],
        roleName: row[7],
        department: row[8],
        avatar: row[9],
        lastLoginAt: row[10],
        createdAt: row[12],
        updatedAt: row[13],
        ...data,
      } as T;
    };
  } else if (tableName === 'ad_platforms') {
    sql = 'SELECT * FROM ad_platforms';
    transform = (row: any[]) => {
      return {
        id: row[0],
        platformCode: row[1],
        platformName: row[2],
        platformIcon: row[3],
        createdAt: row[4],
        updatedAt: row[5],
      } as T;
    };
  } else if (tableName === 'adguidance_customers') {
    sql = 'SELECT * FROM adguidance_customers';
    transform = (row: any[]) => {
      return {
        id: row[0],
        customerName: row[1],
        industry: row[2],
        customerLevel: row[3],
        createdAt: row[4],
        updatedAt: row[5],
      } as T;
    };
  } else if (tableName === 'ad_accounts') {
    sql = 'SELECT * FROM ad_accounts';
    transform = (row: any[]) => {
      return {
        id: row[0],
        accountId: row[1],
        accountName: row[2],
        opportunityScore: row[3],
        accountBalance: row[4],
        totalSpend: row[5],
        status: row[6],
        platformId: row[7],
        customerId: row[8],
        expiryDate: row[9],
        createdAt: row[10],
        updatedAt: row[11],
      } as T;
    };
  } else if (tableName === 'recommendation_categories') {
    sql = 'SELECT * FROM recommendation_categories';
    transform = (row: any[]) => {
      return {
        id: row[0],
        categoryCode: row[1],
        categoryName: row[2],
        categoryColor: row[3],
        createdAt: row[4],
        updatedAt: row[5],
      } as T;
    };
  } else if (tableName === 'recommendations') {
    sql = 'SELECT * FROM recommendations';
    transform = (row: any[]) => {
      return {
        id: row[0],
        title: row[1],
        description: row[2],
        impactScore: row[3],
        affectedAdCount: row[4],
        status: row[5],
        priority: row[6],
        accountId: row[7],
        categoryId: row[8],
        createdAt: row[9],
        updatedAt: row[10],
        reviewedAt: row[11],
      } as T;
    };
  } else if (tableName === 'account_metrics') {
    sql = 'SELECT * FROM account_metrics';
    transform = (row: any[]) => {
      return {
        id: row[0],
        metricDate: row[1],
        cpa: row[2],
        roas: row[3],
        conversionRate: row[4],
        dailySpend: row[5],
        accountId: row[6],
        createdAt: row[7],
      } as T;
    };
  } else {
    throw new Error(`不支持的表名: ${tableName}`);
  }

  const result = db.exec(sql);
  if (result.length === 0) {
    return [];
  }

  const rows = result[0].values;
  return rows.map(transform);
};

/**
 * 清空表数据
 * @param tableName 表名
 */
export const clearTable = async (tableName: string): Promise<void> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  let sql = '';
  if (tableName === 'vlusers') {
    sql = 'DELETE FROM vlusers';
  } else if (tableName === 'metaadguidance.accounts') {
    sql = 'DELETE FROM metaadguidance_accounts';
  } else if (tableName === 'metaadguidance.recommendations') {
    sql = 'DELETE FROM metaadguidance_recommendations';
  } else if (tableName === 'metaadguidance.metrics') {
    sql = 'DELETE FROM metaadguidance_metrics';
  } else if (tableName === 'profiles') {
    sql = 'DELETE FROM profiles';
  } else {
    throw new Error(`不支持的表名: ${tableName}`);
  }

  db.run(sql);
  saveDatabase();
};

/**
 * 检查表是否存在
 * @param tableName 表名
 * @returns 是否存在
 */
export const hasTable = async (tableName: string): Promise<boolean> => {
  await ensureInitialized();
  if (!db) return false;

  const tableMap: Record<string, string> = {
    'vlusers': 'vlusers',
    'metaadguidance.accounts': 'metaadguidance_accounts',
    'metaadguidance.recommendations': 'metaadguidance_recommendations',
    'metaadguidance.metrics': 'metaadguidance_metrics',
    'profiles': 'profiles',
  };

  const actualTableName = tableMap[tableName];
  if (!actualTableName) return false;

  const result = db.exec(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='${actualTableName}'
  `);
  
  return result.length > 0 && result[0].values.length > 0;
};

/**
 * 创建新表（动态创建表，目前仅支持已知表结构）
 * @param tableName 表名
 * @param defaultValue 默认值（暂不使用）
 */
export const createTable = async <T = any>(tableName: string, defaultValue: T[] = []): Promise<void> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  // 如果表已存在，直接返回
  if (await hasTable(tableName)) {
    return;
  }

  // 重新创建所有表（会跳过已存在的表）
  createTables();
};

/**
 * 获取指定表的数据（兼容旧接口，返回 Promise）
 * @param tableName 表名，支持嵌套路径如 'metaadguidance.accounts'
 */
export const getTable = async <T = any>(tableName: string): Promise<T[]> => {
  return getAllData<T>(tableName);
};

/**
 * 获取数据库统计信息
 */
export const getDBStats = async () => {
  const stats: Record<string, number> = {};
  
  const tables = ['vlusers', 'metaadguidance.accounts', 'metaadguidance.recommendations', 'metaadguidance.metrics', 'profiles'];
  
  for (const table of tables) {
    try {
      const data = await getAllData(table);
      stats[table] = data.length;
    } catch (e) {
      stats[table] = 0;
    }
  }
  
  return stats;
};

/**
 * 导出数据库数据（用于备份）
 */
export const exportDB = async (): Promise<string> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const data: any = {};
  const tables = ['vlusers', 'metaadguidance.accounts', 'metaadguidance.recommendations', 'metaadguidance.metrics', 'profiles'];
  
  for (const table of tables) {
    try {
      data[table] = await getAllData(table);
    } catch (e) {
      data[table] = [];
    }
  }
  
  return JSON.stringify(data, null, 2);
};

/**
 * 导入数据库数据（用于恢复）
 * @param data JSON 字符串
 */
export const importDB = async (data: string): Promise<void> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  try {
    const parsed = JSON.parse(data);
    
    // 清空所有表
    await clearTable('vlusers');
    await clearTable('metaadguidance.accounts');
    await clearTable('metaadguidance.recommendations');
    await clearTable('metaadguidance.metrics');
    await clearTable('profiles');
    
    // 导入数据
    if (parsed.vlusers && Array.isArray(parsed.vlusers)) {
      await addBatchData('vlusers', parsed.vlusers);
    }
    if (parsed['metaadguidance.accounts'] && Array.isArray(parsed['metaadguidance.accounts'])) {
      await addBatchData('metaadguidance.accounts', parsed['metaadguidance.accounts']);
    }
    if (parsed['metaadguidance.recommendations'] && Array.isArray(parsed['metaadguidance.recommendations'])) {
      await addBatchData('metaadguidance.recommendations', parsed['metaadguidance.recommendations']);
    }
    if (parsed['metaadguidance.metrics'] && Array.isArray(parsed['metaadguidance.metrics'])) {
      await addBatchData('metaadguidance.metrics', parsed['metaadguidance.metrics']);
    }
    if (parsed.profiles && Array.isArray(parsed.profiles)) {
      await addBatchData('profiles', parsed.profiles);
    }
  } catch (error) {
    throw new Error('导入数据格式错误');
  }
};

/**
 * 重置数据库为默认值
 */
export const resetDB = async (): Promise<void> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  await clearTable('vlusers');
  await clearTable('metaadguidance.accounts');
  await clearTable('metaadguidance.recommendations');
  await clearTable('metaadguidance.metrics');
  await clearTable('profiles');
  
  saveDatabase();
};

// 初始化数据库（同步调用，但内部是异步的）
if (typeof window !== 'undefined') {
  // 浏览器环境：立即初始化
  initDatabase().catch(console.error);
} else {
  // Node.js 环境：延迟初始化
  // Mock 文件会在需要时调用 ensureInitialized
}

/**
 * ===== 数据库管理工具函数 (功能点ID: VL-TOOL-001) =====
 */

/**
 * 获取数据库中所有表名
 * @returns 表名列表
 */
export const getAllTableNames = async (): Promise<string[]> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const result = db.exec(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `);

  if (result.length === 0) return [];
  return result[0].values.map(row => row[0] as string);
};

/**
 * 获取指定表的结构信息
 * @param tableName 表名
 * @returns 表结构信息
 */
export const getTableStructure = async (tableName: string): Promise<any[]> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  try {
    const result = db.exec(`PRAGMA table_info(${tableName})`);
    
    if (result.length === 0) return [];
    
    return result[0].values.map(row => ({
      cid: row[0] as number,
      name: row[1] as string,
      type: row[2] as string,
      notNull: row[3] === 1,
      defaultValue: row[4],
      primaryKey: row[5] === 1,
    }));
  } catch (error) {
    console.error(`获取表结构失败: ${tableName}`, error);
    return [];
  }
};

/**
 * 获取数据库中所有外键关系
 * @returns 外键关系列表
 */
export const getAllTableRelationships = async (): Promise<any[]> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const tables = await getAllTableNames();
  const relationships: any[] = [];

  for (const table of tables) {
    try {
      const result = db.exec(`PRAGMA foreign_key_list(${table})`);
      
      if (result.length > 0) {
        result[0].values.forEach(row => {
          relationships.push({
            childTable: table,
            childColumn: row[3] as string,
            parentTable: row[2] as string,
            parentColumn: row[4] as string,
            onDelete: row[6] as string || 'NO ACTION',
            onUpdate: row[5] as string || 'NO ACTION',
          });
        });
      }
    } catch (error) {
      console.error(`获取表外键失败: ${table}`, error);
    }
  }

  return relationships;
};

/**
 * 执行自定义SQL查询
 * @param sql SQL语句
 * @returns 查询结果
 */
export const executeSQLQuery = async (sql: string): Promise<any> => {
  await ensureInitialized();
  if (!db) throw new Error('数据库未初始化');

  const startTime = Date.now();
  
  try {
    // 检查危险操作
    const dangerousKeywords = ['DROP', 'ALTER', 'TRUNCATE'];
    const sqlUpper = sql.trim().toUpperCase();
    
    for (const keyword of dangerousKeywords) {
      if (sqlUpper.startsWith(keyword)) {
        throw new Error(`禁止执行 ${keyword} 操作，请通过代码修改数据库结构`);
      }
    }

    // 检查修改操作（需要特别提示）
    const modifyKeywords = ['UPDATE', 'DELETE', 'INSERT'];
    let isModifyOperation = false;
    for (const keyword of modifyKeywords) {
      if (sqlUpper.startsWith(keyword)) {
        isModifyOperation = true;
        break;
      }
    }

    const result = db.exec(sql);
    const executionTime = Date.now() - startTime;

    // 如果是修改操作，保存数据库
    if (isModifyOperation) {
      saveDatabase();
    }

    if (result.length === 0) {
      return {
        columns: [],
        values: [],
        rowCount: 0,
        executionTime,
        isModifyOperation,
      };
    }

    return {
      columns: result[0].columns,
      values: result[0].values,
      rowCount: result[0].values.length,
      executionTime,
      isModifyOperation,
    };
  } catch (error: any) {
    throw new Error(`SQL执行失败: ${error.message}`);
  }
};

export default {
  getDB,
  getTable,
  addData,
  addBatchData,
  removeData,
  removeBatchData,
  findData,
  findOneData,
  updateData,
  getAllData,
  clearTable,
  createTable,
  hasTable,
  exportDB,
  importDB,
  resetDB,
  getDBStats,
  // 数据库管理工具函数
  getAllTableNames,
  getTableStructure,
  getAllTableRelationships,
  executeSQLQuery,
};
