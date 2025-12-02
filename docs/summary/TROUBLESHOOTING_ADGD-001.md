# VL广告指导建议 - 故障排查指南

## 🔍 常见问题诊断

### 问题1: 数据加载失败

#### 症状
- 打开页面后提示"加载数据失败"
- 页面显示空状态或加载错误

#### 可能原因
1. **数据库未初始化**
2. **Mock API未正确配置**
3. **浏览器LocalStorage限制**
4. **异步数据加载超时**

#### 解决方案

##### 方案1: 清除并重新初始化数据库

**步骤:**
1. 打开浏览器开发者工具 (F12 或 Cmd+Option+I)
2. 进入 **Console** 标签
3. 执行以下命令:

```javascript
// 清除数据库
localStorage.removeItem('vl_project_db');

// 刷新页面
location.reload();
```

**预期结果:** 页面刷新后，数据库将自动重新初始化并创建测试数据。

---

##### 方案2: 检查浏览器控制台错误信息

**步骤:**
1. 打开浏览器开发者工具 (F12)
2. 进入 **Console** 标签
3. 查看是否有红色错误信息

**常见错误类型:**

| 错误信息 | 原因 | 解决方法 |
|---------|------|---------|
| `Failed to fetch` | 网络请求失败 | 检查开发服务器是否正常运行 |
| `Cannot read property of undefined` | 数据结构错误 | 清除LocalStorage重新初始化 |
| `Database not initialized` | 数据库未初始化 | 等待数据库初始化完成或刷新页面 |
| `Table does not exist` | 数据库表未创建 | 清除数据库重新初始化 |

---

##### 方案3: 检查Network请求

**步骤:**
1. 打开开发者工具 (F12)
2. 进入 **Network** 标签
3. 刷新页面，查看API请求状态

**检查点:**

| API路径 | 状态码 | 说明 |
|--------|--------|------|
| `/api/adguidance/overview` | 200 | 概览数据正常 |
| `/api/adguidance/recommendations` | 200 | 建议数据正常 |
| `/api/adguidance/accounts` | 200 | 账户数据正常 |

**如果状态码为500:** 查看Response内容中的error信息，按照错误提示排查。

---

##### 方案4: 验证数据库表是否创建

**步骤:**
1. 打开开发者工具 Console
2. 执行以下命令:

```javascript
// 检查数据库中的表
import('../src/db').then(async (db) => {
  const database = await db.getDB();
  const tables = database.exec("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('数据库表列表:', tables);
});
```

**预期输出:**
```
ad_platforms
adguidance_customers
ad_accounts
recommendation_categories
recommendations
account_metrics
...
```

**如果表不存在:** 清除LocalStorage并刷新页面。

---

### 问题2: 数据显示不完整

#### 症状
- 页面加载成功，但部分数据缺失
- 账户列表为空或建议数量为0

#### 解决方案

**步骤:**
1. 打开Console查看初始化日志
2. 应该看到以下输出:

```
✅ 广告指导建议数据初始化成功
广告指导建议测试数据初始化完成
- 8个客户
- 12个广告账户 (Meta: 6个, Google Ads: 3个, TikTok: 3个)
- 40+条优化建议 (预算/创意/受众/自动化)
- 360条历史指标数据 (30天 × 12账户)
```

**如果没有看到初始化日志:**
- 数据可能已经存在（不会重复初始化）
- 或者初始化失败（查看错误信息）

**手动触发重新初始化:**
```javascript
// 清除现有数据
localStorage.removeItem('vl_project_db');

// 刷新页面触发初始化
location.reload();
```

---

### 问题3: 页面加载缓慢

#### 症状
- 页面加载时间超过5秒
- Loading状态持续很久

#### 可能原因
1. 数据库数据量过大
2. 首次初始化耗时
3. 浏览器性能限制

#### 解决方案

**优化方案:**

1. **使用Chrome/Edge浏览器** (推荐)
   - 这些浏览器对SQLite支持更好
   - 性能更优

2. **等待首次初始化完成**
   - 首次初始化需要创建360条历史记录
   - 大约需要3-5秒
   - 后续加载会快很多

3. **检查数据库大小**
```javascript
// 检查LocalStorage大小
const dbData = localStorage.getItem('vl_project_db');
console.log('数据库大小:', (dbData?.length || 0) / 1024, 'KB');
```

**如果超过5MB:** 考虑清除数据库重新初始化。

---

### 问题4: 功能操作失败

#### 症状
- 点击"采纳"或"忽略"按钮无反应
- 添加账户失败
- 筛选和搜索不生效

#### 解决方案

##### 采纳/忽略操作失败

**检查步骤:**
1. 打开Console查看错误
2. 检查API请求是否成功
3. 确认数据库更新是否成功

**常见问题:**
- 建议ID不存在
- 数据库锁定
- 权限问题

**解决方法:**
```javascript
// 刷新页面重新加载数据
location.reload();
```

##### 添加账户失败

**检查步骤:**
1. 确认所有必填字段已填写
2. 检查账户ID格式是否正确
3. 确认账户ID未重复

**账户ID格式要求:**
- Meta: `act_` + 数字 (如 `act_123456789`)
- Google: 10位数字 (如 `1234567890`)
- TikTok: 13位数字 (如 `1234567890123`)

---

## 🛠️ 开发调试技巧

### 1. 查看完整数据

```javascript
// 查看所有账户
import('../src/db').then(async (db) => {
  const accounts = await db.getAllData('ad_accounts');
  console.table(accounts);
});

// 查看所有建议
import('../src/db').then(async (db) => {
  const recommendations = await db.getAllData('recommendations');
  console.table(recommendations);
});

// 查看所有客户
import('../src/db').then(async (db) => {
  const customers = await db.getAllData('adguidance_customers');
  console.table(customers);
});
```

### 2. 手动执行SQL查询

```javascript
import('../src/db').then(async (db) => {
  const database = await db.getDB();
  
  // 查询账户数量
  const result = database.exec('SELECT COUNT(*) as count FROM ad_accounts');
  console.log('账户总数:', result[0]?.values[0]?.[0]);
  
  // 查询建议数量
  const result2 = database.exec('SELECT COUNT(*) as count FROM recommendations');
  console.log('建议总数:', result2[0]?.values[0]?.[0]);
});
```

### 3. 重置特定表的数据

```javascript
import('../src/db').then(async (db) => {
  const database = await db.getDB();
  
  // 清空建议表
  database.exec('DELETE FROM recommendations');
  
  // 重新保存数据库
  await db.saveDatabase();
  
  console.log('建议数据已清空，刷新页面重新初始化');
});
```

---

## 📞 获取帮助

### 快速诊断命令

复制以下代码到Console执行，获取系统诊断信息:

```javascript
(async function diagnose() {
  console.log('=== VL广告指导建议 系统诊断 ===\n');
  
  // 1. 检查LocalStorage
  const dbData = localStorage.getItem('vl_project_db');
  console.log('1. 数据库状态:');
  console.log('   - 是否存在:', dbData ? '✅ 是' : '❌ 否');
  console.log('   - 数据大小:', dbData ? `${(dbData.length / 1024).toFixed(2)} KB` : 'N/A');
  
  // 2. 检查数据库表
  try {
    const { getDB } = await import('../src/db');
    const db = await getDB();
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('\n2. 数据库表:');
    if (tables[0]) {
      tables[0].values.forEach(row => console.log('   ✅', row[0]));
    }
    
    // 3. 检查数据量
    const platforms = db.exec('SELECT COUNT(*) FROM ad_platforms')[0]?.values[0]?.[0];
    const accounts = db.exec('SELECT COUNT(*) FROM ad_accounts')[0]?.values[0]?.[0];
    const recommendations = db.exec('SELECT COUNT(*) FROM recommendations')[0]?.values[0]?.[0];
    const customers = db.exec('SELECT COUNT(*) FROM adguidance_customers')[0]?.values[0]?.[0];
    
    console.log('\n3. 数据统计:');
    console.log('   - 平台数:', platforms);
    console.log('   - 账户数:', accounts);
    console.log('   - 建议数:', recommendations);
    console.log('   - 客户数:', customers);
    
    if (accounts === 0) {
      console.log('\n⚠️  警告: 账户数为0，数据未初始化');
      console.log('   建议: 清除LocalStorage并刷新页面');
    } else {
      console.log('\n✅ 数据正常');
    }
  } catch (error) {
    console.error('\n❌ 诊断失败:', error);
  }
  
  console.log('\n=== 诊断完成 ===');
})();
```

### 完全重置系统

如果所有方法都无效，执行完全重置:

```javascript
// ⚠️ 警告: 这将清除所有数据
console.log('开始完全重置...');

// 清除LocalStorage
localStorage.clear();

// 清除SessionStorage
sessionStorage.clear();

// 刷新页面
setTimeout(() => {
  console.log('即将刷新页面...');
  location.reload();
}, 1000);
```

---

## 📋 检查清单

在报告问题前，请确认已完成以下检查:

- [ ] 开发服务器正常运行 (`npm start`)
- [ ] 浏览器Console无明显错误
- [ ] LocalStorage未满(检查存储空间)
- [ ] 已尝试清除数据库重新初始化
- [ ] 已尝试换用Chrome/Edge浏览器
- [ ] 已运行系统诊断命令
- [ ] 已查看Network请求状态
- [ ] 已记录具体的错误信息

---

## 🎯 最常见的解决方法

**90%的问题可以通过以下步骤解决:**

```javascript
// 1. 清除数据库
localStorage.removeItem('vl_project_db');

// 2. 刷新页面
location.reload();

// 3. 等待3-5秒让数据初始化完成

// 4. 检查Console确认初始化成功
// 应该看到: "✅ 广告指导建议数据初始化成功"
```

---

**文档版本**: v1.0  
**最后更新**: 2025-12-01  
**维护团队**: VisionLine 产品团队

