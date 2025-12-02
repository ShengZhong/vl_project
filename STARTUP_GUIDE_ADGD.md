# VL广告指导建议 - 启动指南

## 🚀 快速启动（3步）

### 步骤1: 清除浏览器数据

在浏览器中按 **F12** 打开开发者工具，在Console中执行：

```javascript
localStorage.clear();
console.log('✅ 数据已清除');
```

### 步骤2: 重启开发服务器

在终端中：

```bash
# 如果服务器正在运行，先按 Ctrl+C 停止

# 重新启动
npm start
```

### 步骤3: 访问页面并验证

1. 打开浏览器访问：`http://localhost:8000`
2. 在左侧菜单找到 **"VL广告指导建议"**
3. 点击 **"概览"** 进入概览页
4. 等待3-5秒，数据将自动初始化
5. 在Console中查看初始化日志

**预期看到的日志：**
```
开始初始化广告指导建议测试数据...
✓ 创建了 8 个客户
✓ 创建了 12 个广告账户
✓ 创建了 20 条优化建议
✓ 创建了 84 条历史指标数据
✅ 广告指导建议测试数据初始化完成
总计: 8个客户, 12个账户, 20条建议, 84条指标
```

---

## ✅ 验证功能正常

### 概览页面验证

访问：`/adguidance/overview`

**应该看到：**
- ✅ 顶部优化案例横幅（轮播2个案例）
- ✅ 3个平台卡片：
  - Meta (6个账户)
  - Google Ads (3个账户)
  - TikTok (3个账户)
- ✅ 分数分布：
  - 优秀 (≥80分): 4个账户
  - 待改进 (40-79分): 5个账户
  - 需关注 (<40分): 3个账户

### 优化建议页面验证

访问：`/adguidance/recommendations`

**应该看到：**
- ✅ 4个分类统计卡片（预算、创意、受众、自动化）
- ✅ 建议列表（默认显示10条）
- ✅ 搜索框和筛选器正常工作
- ✅ 可以点击"查看"按钮查看详情
- ✅ 可以"采纳"或"忽略"建议

### 账户管理页面验证

访问：`/adguidance/accounts`

**应该看到：**
- ✅ 按平台分组的账户列表（可展开/收起）
- ✅ 每个平台显示账户数、优化建议数、总余额
- ✅ 账户列表显示完整信息
- ✅ "添加账户"按钮可以打开弹框

---

## 🔍 故障排查

### 问题：页面显示"加载数据失败"

**解决方法：**

```javascript
// 方法1: 清除数据重新初始化
localStorage.removeItem('vl_project_db');
location.reload();

// 方法2: 完全清除
localStorage.clear();
location.reload();
```

### 问题：数据显示为空

**检查步骤：**

```javascript
// 1. 检查数据库是否有数据
import('../src/db').then(async (db) => {
  const accounts = await db.getAllData('ad_accounts');
  console.log('账户数:', accounts.length);
  
  if (accounts.length === 0) {
    console.log('⚠️ 数据未初始化，请刷新页面');
    localStorage.removeItem('vl_project_db');
    setTimeout(() => location.reload(), 1000);
  }
});
```

### 问题：Console显示错误

**常见错误及解决方法：**

| 错误信息 | 解决方法 |
|---------|---------|
| `Table does not exist` | 清除数据库，刷新页面 |
| `Cannot read property 'id'` | 清除数据库，刷新页面 |
| `Failed to fetch` | 检查开发服务器是否运行 |
| `Database not initialized` | 等待几秒后刷新页面 |

---

## 📊 测试数据清单

### 客户：8个
- CGE Digital Marketing (电商)
- CGE Digital Studio (游戏)
- TechFlow 科技 (科技)
- 时尚之家服饰 (时尚)
- 健康生活品牌 (健康)
- 教育在线平台 (教育)
- 美食天堂餐饮 (餐饮)
- 智能家居科技 (科技)

### 账户：12个
- Meta平台：6个账户
- Google Ads：3个账户
- TikTok：3个账户

### 建议：20条
- 预算类：6条
- 创意类：10条
- 受众类：3条
- 自动化：1条

### 指标：84条
- 7天历史数据 × 12个账户

---

## 💡 一键修复命令

**复制以下代码到Console执行，一键修复所有问题：**

```javascript
(async function quickFix() {
  console.log('🔧 开始一键修复...\n');
  
  // 1. 清除数据
  console.log('1/4 清除旧数据...');
  localStorage.clear();
  sessionStorage.clear();
  
  // 2. 等待1秒
  console.log('2/4 准备就绪...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 3. 显示提示
  console.log('3/4 即将刷新页面...');
  console.log('4/4 刷新后请等待5秒让数据初始化完成\n');
  
  // 4. 刷新页面
  setTimeout(() => {
    location.reload();
  }, 2000);
  
  console.log('✅ 修复命令已执行，请等待页面刷新...');
})();
```

---

## 📱 联系支持

如果问题仍未解决，请：

1. 截图Console中的完整错误信息
2. 截图Network标签中的API请求
3. 提供浏览器版本信息
4. 联系开发团队

---

**文档版本**: v1.0  
**创建日期**: 2025-12-01  
**维护团队**: VisionLine 产品团队

