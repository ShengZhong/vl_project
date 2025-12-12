/**
 * 用户个人信息 Mock 数据
 * 功能点 ID: VL-USR-002 & VL-SYS-001
 */

import {
  getAllData,
  addData,
  updateData,
  findOneData,
  addBatchData,
} from '../src/db';
import { UserProfile, UserRole } from '../src/types/profile';

// 当前模拟登录的用户 ID (默认管理员)
// 注意：每次 Mock 服务重启会重置
let currentUserId = 'user_001';

// 初始用户数据
const initialProfiles: UserProfile[] = [
  {
    id: 'user_001',
    userId: 'user_001',
    username: 'admin',
    name: '管理员',
    email: 'admin@visionline.com',
    phone: '13800138000',
    role: UserRole.Admin,
    roleName: '管理员',
    department: '产品部',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'user_sales_001',
    userId: 'user_sales_001',
    username: 'sales_a',
    name: 'Trịnh Huyền Trang', // 对应 Mock 数据中的 signSales
    email: 'sales_a@visionline.com',
    phone: '13800138001',
    role: UserRole.Sales,
    roleName: '销售人员',
    department: '销售部',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user_sales_002',
    userId: 'user_sales_002',
    username: 'sales_b',
    name: '陈维维', // 对应 Mock 数据中的 signSales
    email: 'sales_b@visionline.com',
    phone: '13800138002',
    role: UserRole.Sales,
    roleName: '销售人员',
    department: '销售部',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user_ae_001',
    userId: 'user_ae_001',
    username: 'ae_a',
    name: 'Nguyen Tuyen tuyen', // 对应 Mock 数据中的 responsibleAE
    email: 'ae_a@visionline.com',
    phone: '13800138003',
    role: UserRole.AE,
    roleName: '优化师',
    department: '运营部',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user_ae_002',
    userId: 'user_ae_002',
    username: 'ae_b',
    name: 'Linh Le', // 对应 Mock 数据中的 responsibleAE
    email: 'ae_b@visionline.com',
    phone: '13800138004',
    role: UserRole.AE,
    roleName: '优化师',
    department: '运营部',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

// 初始化用户信息
const ensureProfilesInitialized = async (): Promise<void> => {
  const profiles = await getAllData<UserProfile>('profiles');
  if (profiles.length === 0) {
    console.log('初始化用户数据...');
    await addBatchData('profiles', initialProfiles);
  } else if (profiles.length < initialProfiles.length) {
    // 简单的增量更新检查 (如果数量少于初始数据，尝试补全)
    // 实际生产中不应这样做，这里为了方便调试 Sales/AE 功能
    for (const p of initialProfiles) {
      const exists = profiles.find(exist => exist.userId === p.userId);
      if (!exists) {
        await addData('profiles', p);
      }
    }
  }
};

// 获取当前登录用户信息
export const getCurrentUser = async (): Promise<UserProfile> => {
  await ensureProfilesInitialized();
  const profiles = await getAllData<UserProfile>('profiles');
  const user = profiles.find(p => p.userId === currentUserId);
  return user || initialProfiles[0];
};

export default {
  // 获取当前用户个人信息
  'GET /api/user/profile': async (req: any, res: any) => {
    try {
      const profile = await getCurrentUser();
      res.json({
        code: 200,
        message: '获取成功',
        data: profile,
      });
    } catch (error: any) {
      console.error('获取个人信息失败:', error);
      res.json({
        code: 500,
        message: error.message || '获取失败',
        data: initialProfiles[0],
      });
    }
  },

  // 更新用户个人信息
  'PUT /api/user/profile': async (req: any, res: any) => {
    try {
      const { name, email, phone } = req.body;
      const currentUser = await getCurrentUser();
      
      // 检查邮箱是否已被使用
      const allProfiles = await getAllData<UserProfile>('profiles');
      const emailExists = allProfiles.find(
        (p) => p.email === email && p.userId !== currentUser.userId
      );
      
      if (emailExists) {
        return res.status(409).json({
          code: 409,
          message: '该邮箱已被其他用户使用',
        });
      }
      
      // 更新用户信息
      const updated = await updateData<UserProfile>(
        'profiles',
        (item) => item.userId === currentUser.userId,
        (item) => ({
          ...item,
          name: name || item.name,
          email: email || item.email,
          phone: phone || item.phone,
        })
      );
      
      res.json({
        code: 200,
        message: '保存成功',
        data: updated,
      });
    } catch (error: any) {
      console.error('更新个人信息失败:', error);
      res.json({
        code: 500,
        message: error.message || '保存失败',
      });
    }
  },

  // 修改密码
  'POST /api/user/change-password': (req: any, res: any) => {
    const { oldPassword, newPassword } = req.body;

    // 模拟旧密码错误(正确密码为 admin123)
    if (oldPassword !== 'admin123') {
      return res.status(400).json({
        code: 400,
        message: '旧密码输入错误',
      });
    }

    // 模拟新密码与旧密码相同
    if (newPassword === oldPassword) {
      return res.status(400).json({
        code: 400,
        message: '新密码不能与旧密码相同',
      });
    }

    // 返回成功
    res.json({
      code: 200,
      message: '密码修改成功,请重新登录',
    });
  },

  // ===== 以下为调试用接口 =====

  // 获取所有用户列表 (用于切换用户)
  'GET /api/debug/users': async (req: any, res: any) => {
    await ensureProfilesInitialized();
    const profiles = await getAllData<UserProfile>('profiles');
    res.json({
      code: 200,
      data: profiles,
    });
  },

  // 切换当前登录用户
  'POST /api/debug/switch-user': (req: any, res: any) => {
    const { userId } = req.body;
    if (userId) {
      currentUserId = userId;
      res.json({
        code: 200,
        message: `已切换为用户: ${userId}`,
        data: { currentUserId },
      });
    } else {
      res.status(400).json({
        code: 400,
        message: '缺少 userId 参数',
      });
    }
  },
};
