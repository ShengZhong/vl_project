/**
 * 用户个人信息 Mock 数据
 * 功能点 ID: VL-USR-002
 */

import {
  getAllData,
  addData,
  updateData,
  findOneData,
} from '../src/db';
import type { UserProfile } from '../src/types/profile';

// 默认用户信息
const defaultProfile: UserProfile = {
  id: 'user_001',
  userId: 'user_001',
  username: 'admin',
  name: '管理员',
  email: 'admin@visionline.com',
  phone: '13800138000',
  role: 'admin',
  roleName: '管理员',
  department: '产品部',
  avatar: '',
  createdAt: '2025-01-01T00:00:00Z',
  lastLoginAt: '2025-01-15T10:30:00Z',
};

// 初始化用户信息
const getUserProfileData = async (): Promise<UserProfile> => {
  const profiles = await getAllData<UserProfile>('profiles');
  if (profiles.length === 0) {
    await addData('profiles', defaultProfile);
    return defaultProfile;
  }
  return profiles[0];
};

export default {
  // 获取当前用户个人信息
  'GET /api/user/profile': async (req: any, res: any) => {
    try {
      const profile = await getUserProfileData();
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
        data: defaultProfile,
      });
    }
  },

  // 更新用户个人信息
  'PUT /api/user/profile': async (req: any, res: any) => {
    try {
      const { name, email, phone } = req.body;
      
      // 检查邮箱是否已被使用
      const allProfiles = await getAllData<UserProfile>('profiles');
      const emailExists = allProfiles.find(
        (p) => p.email === email && p.userId !== defaultProfile.userId
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
        (item) => item.userId === defaultProfile.userId,
        (item) => ({
          ...item,
          name: name || item.name,
          email: email || item.email,
          phone: phone || item.phone,
        })
      );
      
      if (updated) {
        res.json({
          code: 200,
          message: '保存成功',
          data: updated,
        });
      } else {
        // 如果不存在，创建新记录
        const newProfile: UserProfile = {
          ...defaultProfile,
          name: name || defaultProfile.name,
          email: email || defaultProfile.email,
          phone: phone || defaultProfile.phone,
        };
        await addData('profiles', newProfile);
        res.json({
          code: 200,
          message: '保存成功',
          data: newProfile,
        });
      }
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
};
