/**
 * 用户个人信息 Mock 数据
 * 功能点 ID: VL-USR-002
 */

export default {
  // 获取当前用户个人信息
  'GET /api/user/profile': {
    code: 200,
    message: '获取成功',
    data: {
      id: 'user_001',
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
    },
  },

  // 更新用户个人信息
  'PUT /api/user/profile': (req: any, res: any) => {
    const { name, email, phone } = req.body;
    
    // 模拟邮箱已被使用的情况
    if (email === 'test@example.com') {
      return res.status(409).json({
        code: 409,
        message: '该邮箱已被其他用户使用',
      });
    }

    // 返回更新后的数据
    res.json({
      code: 200,
      message: '保存成功',
      data: {
        id: 'user_001',
        username: 'admin',
        name: name || '管理员',
        email: email || 'admin@visionline.com',
        phone: phone || '13800138000',
        role: 'admin',
        roleName: '管理员',
        department: '产品部',
        avatar: '',
        createdAt: '2025-01-01T00:00:00Z',
        lastLoginAt: '2025-01-15T10:30:00Z',
      },
    });
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



