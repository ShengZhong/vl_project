# 数据库管理功能故障排查指南

> **功能点ID**: VL-TOOL-001  
> **版本**: v1.0  
> **最后更新**: 2025-01-15

---

## 🐛 已知问题和解决方案

### 问题1: 工具类菜单中看不到"数据库管理"选项

**症状**：
- 左侧菜单"工具类"下拉列表中没有"数据库管理"菜单项
- 只能看到"Meta广告指导"和"待补充功能"

**原因**：
- 菜单配置文件中缺少数据库管理的菜单项配置

**解决方案** ✅ 已修复：
- 已在 `src/layouts/index.tsx` 中添加数据库管理菜单项
- Git Commit: `df6d43c`

**验证方法**：
1. 刷新页面
2. 点击左侧菜单"工具类"
3. 应该能看到"数据库管理"选项

---

### 问题2: 页面加载时提示"加载表结构失败"和"加载表关系失败"

**症状**：
- 页面右上角出现错误提示
- 提示内容：
  - "加载表结构失败: 获取表结构失败"
  - "加载表关系失败: 获取表关系失败"
- 表结构Tab页显示"数据库中暂无表"
- 表关系Tab页显示"数据库中暂无外键关系"

**原因**：
- Mock文件中的数据库函数导入路径不正确
- 数据库初始化失败
- API请求失败

**解决方案** ✅ 已修复：

#### 方案1：修复Mock导入（已实施）
- 使用动态导入解决路径问题
- 增强错误日志输出
- Git Commit: [即将提交]

#### 方案2：重启开发服务器
```bash
# 停止当前服务器（按 Ctrl+C）
# 重新启动
npm start
```

#### 方案3：清除缓存
```bash
# 清除浏览器缓存和localStorage
# 在浏览器控制台执行：
localStorage.clear();
sessionStorage.clear();
location.reload();
```

#### 方案4：重新初始化数据库
```bash
# 在浏览器控制台执行：
localStorage.removeItem('vl_project_db');
location.reload();
```

**验证方法**：
1. 重新访问 `http://localhost:8000/tools/database`
2. 不应该再看到错误提示
3. 表结构Tab页应该能看到所有数据库表
4. 表关系Tab页应该能看到外键关系

---

### 问题3: SQL查询执行失败

**症状**：
- 点击"执行"按钮后提示"SQL执行失败"
- 控制台显示错误信息

**可能原因**：
1. SQL语法错误
2. 表名或字段名不存在
3. 尝试执行被禁止的DDL操作
4. 数据库未初始化

**解决方案**：

#### 3.1 检查SQL语法
```sql
-- ✅ 正确示例
SELECT * FROM vlusers LIMIT 10;

-- ❌ 错误示例（缺少分号或关键字拼写错误）
SELECT * FORM vlusers LIMIT 10
```

#### 3.2 确认表名和字段名
1. 在"表结构"Tab页查看所有表名
2. 点击表名展开，查看字段名
3. 确保SQL中使用的表名和字段名正确

#### 3.3 检查是否使用了被禁止的操作
```sql
-- ❌ 被禁止的操作
DROP TABLE vlusers;
ALTER TABLE vlusers ADD COLUMN test TEXT;
TRUNCATE TABLE vlusers;

-- ✅ 允许的操作（需二次确认）
UPDATE vlusers SET status = 'active' WHERE vlid = 'VL001';
DELETE FROM vlusers WHERE vlid = 'TEST001';
INSERT INTO vlusers (vlid, email) VALUES ('VL999', 'test@example.com');
```

#### 3.4 重新初始化数据库
如果数据库完全没有数据，执行以下步骤：
1. 打开浏览器控制台
2. 执行以下代码：
```javascript
// 清除数据库
localStorage.removeItem('vl_project_db');

// 重新加载页面
location.reload();

// 数据库会自动重新初始化
```

---

### 问题4: 查询结果为空

**症状**：
- SQL执行成功，但提示"返回 0 行"
- 表格中没有数据显示

**原因**：
- 数据库中确实没有数据
- 查询条件过滤掉了所有数据
- WHERE条件错误

**解决方案**：

#### 4.1 检查数据是否存在
```sql
-- 查看表中是否有数据
SELECT COUNT(*) FROM vlusers;

-- 如果返回0，说明表中确实没有数据
```

#### 4.2 初始化测试数据
如果数据库是空的，需要初始化测试数据：

1. 方案1：通过Mock文件初始化
   - 访问其他功能页面（如VL用户列表）
   - Mock文件会自动初始化测试数据

2. 方案2：手动插入数据
```sql
INSERT INTO vlusers (vlid, token, email, status)
VALUES ('VL001', 'test_token', 'test@example.com', 'active');
```

#### 4.3 检查WHERE条件
```sql
-- ❌ 错误：字符串比较区分大小写
SELECT * FROM vlusers WHERE status = 'Active';

-- ✅ 正确：使用正确的大小写
SELECT * FROM vlusers WHERE status = 'active';

-- ✅ 或使用LOWER函数
SELECT * FROM vlusers WHERE LOWER(status) = 'active';
```

---

### 问题5: 无法导出CSV

**症状**：
- 点击"导出CSV"按钮没有反应
- 或提示"没有可导出的数据"

**原因**：
- 查询结果为空
- 浏览器禁止了文件下载
- 浏览器兼容性问题

**解决方案**：

#### 5.1 确保有查询结果
```sql
-- 先执行查询，确保有返回数据
SELECT * FROM vlusers LIMIT 10;

-- 等待查询完成，看到表格数据
-- 然后点击"导出CSV"按钮
```

#### 5.2 检查浏览器权限
1. 确保浏览器允许下载文件
2. 检查浏览器下载设置
3. 关闭弹窗拦截器

#### 5.3 尝试其他浏览器
- Chrome（推荐）
- Firefox
- Edge
- Safari（可能有兼容性问题）

---

## 🔍 调试技巧

### 1. 查看浏览器控制台

**步骤**：
1. 按 `F12` 打开开发者工具
2. 切换到"Console"标签页
3. 查看是否有红色错误信息

**常见错误信息**：
```javascript
// 错误1：数据库未初始化
Error: 数据库未初始化

// 解决：刷新页面或清除localStorage后重新加载

// 错误2：导入失败
Failed to import database functions: ...

// 解决：检查文件路径，重启开发服务器

// 错误3：API请求失败
Request failed with status code 500

// 解决：查看Network标签，检查具体错误信息
```

### 2. 查看Network请求

**步骤**：
1. 按 `F12` 打开开发者工具
2. 切换到"Network"标签页
3. 刷新页面或执行操作
4. 点击具体的请求查看详情

**检查项**：
- 请求URL是否正确
- 响应状态码（200=成功，500=服务器错误）
- 响应内容中的error字段

### 3. 检查数据库状态

**在浏览器控制台执行**：
```javascript
// 查看localStorage中的数据库
console.log(localStorage.getItem('vl_project_db'));

// 如果返回null，说明数据库未初始化

// 查看数据库大小
const dbData = localStorage.getItem('vl_project_db');
if (dbData) {
  console.log('数据库大小:', Math.round(dbData.length / 1024), 'KB');
}
```

### 4. 手动测试数据库函数

**在浏览器控制台执行**：
```javascript
// 导入数据库函数
import('../src/db').then(db => {
  // 测试获取表名
  db.getAllTableNames().then(tables => {
    console.log('所有表:', tables);
  });

  // 测试获取表结构
  db.getTableStructure('vlusers').then(columns => {
    console.log('vlusers表结构:', columns);
  });

  // 测试SQL查询
  db.executeSQLQuery('SELECT * FROM vlusers LIMIT 5').then(result => {
    console.log('查询结果:', result);
  });
});
```

---

## 📝 常见错误代码

| 错误代码 | 错误信息 | 原因 | 解决方案 |
|---------|---------|-----|---------|
| 500 | 获取表结构失败 | Mock接口错误 | 检查Mock文件导入，重启服务器 |
| 500 | 获取表关系失败 | Mock接口错误 | 检查Mock文件导入，重启服务器 |
| 500 | SQL执行失败 | SQL语法错误或数据库问题 | 检查SQL语法，查看控制台详细错误 |
| 400 | SQL语句不能为空 | 未输入SQL | 在编辑器中输入SQL语句 |
| Error | 禁止执行 DROP 操作 | 尝试执行危险DDL | 使用允许的操作类型 |
| Error | 数据库未初始化 | 数据库初始化失败 | 清除localStorage，刷新页面 |

---

## 🛠️ 开发者工具

### 清除数据库命令

```javascript
// 完全清除数据库和所有数据
localStorage.removeItem('vl_project_db');
localStorage.clear();
location.reload();
```

### 导出数据库备份

```javascript
// 导出数据库
const dbBackup = localStorage.getItem('vl_project_db');
console.log('备份数据:', dbBackup);

// 复制到剪贴板
navigator.clipboard.writeText(dbBackup);
```

### 导入数据库备份

```javascript
// 导入备份
const backupData = '...'; // 粘贴备份数据
localStorage.setItem('vl_project_db', backupData);
location.reload();
```

---

## 📞 获取帮助

如果以上解决方案都无法解决问题，请：

1. **查看控制台错误**
   - 按F12打开控制台
   - 截图完整的错误信息

2. **记录操作步骤**
   - 记录导致错误的具体操作
   - 记录错误发生的时间

3. **联系技术支持**
   - 提供错误截图
   - 提供控制台日志
   - 说明浏览器版本

---

## 🔄 故障恢复流程

如果系统完全无法使用，按以下步骤恢复：

### 步骤1：停止服务器
```bash
# 按 Ctrl+C 停止开发服务器
```

### 步骤2：清除缓存
```bash
# 清除构建缓存
rm -rf node_modules/.cache
```

### 步骤3：重新安装依赖（如果必要）
```bash
rm -rf node_modules
npm install
```

### 步骤4：重启服务器
```bash
npm start
```

### 步骤5：清除浏览器数据
1. 打开浏览器控制台
2. 执行：
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 步骤6：验证功能
1. 访问 `/tools/database`
2. 检查表结构是否正常加载
3. 执行简单SQL测试
```sql
SELECT * FROM sqlite_master WHERE type='table';
```

---

**文档状态**: ✅ 持续更新  
**功能点ID**: VL-TOOL-001  
**最后更新**: 2025-01-15

