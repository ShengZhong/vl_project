/**
 * VL 用户 Mock 数据
 * 功能点 ID: VL-USR-003
 */

import {
  getAllData,
  addData,
  removeData,
  updateData,
  findData,
  addBatchData,
  findOneData,
} from '../src/db';
import type { VLUser } from '../src/types/vluser';

// 初始化数据（仅在表为空时）
const initialData: VLUser[] = [
  {
    vlid: '12739',
    token: '1127514892391358',
    registeredEntity: 'TRẦN CÔNG DOÃN',
    registeredTime: '2025-11-05T15:25:21Z',
    claimTime: '2025-11-05T15:25:21Z',
    claimStatus: 'claimed',
    certStatus: 'uncertified',
    status: 'active',
    email: 'quanlyneon@gmail.com',
    contactPerson: 'Doãn',
    phone: '159****456',
    customerSource: '内部开通',
    walletStatus: '钱包',
    signCompany: '(28036) TRẦN CÔNG DOÃN',
    signSales: 'Trịnh Huyền Trang',
    signEmail: 'trinh.trang@bluefocus.com',
    responsibleSales: 'Trịnh Huyền Trang',
    responsibleAE: 'Nguyen Tuyen tuyen',
    tags: ['BV'],
  },
  {
    vlid: '12731',
    token: '',
    registeredEntity: 'HAJAR',
    registeredTime: '2025-11-05T06:11:25Z',
    claimTime: undefined,
    claimStatus: 'unclaimed',
    certStatus: 'uncertified',
    status: 'active',
    email: 'china34@2200freefonts.com',
    contactPerson: 'asd',
    phone: '192****263',
    customerSource: '自助注册',
    walletStatus: '未知',
  },
  {
    vlid: '12736',
    token: '1123045432138333',
    registeredEntity: 'CÔNG TY TNHH TRUYỀN THÔNG JULANG',
    registeredTime: '2025-11-05T12:31:17Z',
    claimTime: '2025-11-05T12:31:17Z',
    claimStatus: 'claimed',
    certStatus: 'uncertified',
    status: 'active',
    email: 'yangylsimba@gmail.com',
    contactPerson: 'JACK YANG',
    phone: '187****884',
    customerSource: '内部开通',
    walletStatus: '钱包',
    signCompany: '(28032) CÔNG TY TNHH TRUYỀN THÔNG JULANG',
    signSales: '付雄圣',
    signEmail: 'jingwen.fu1@bluefocus.com',
    responsibleSales: '付雄圣',
    responsibleAE: 'Linh Le le.linh@bluef',
    tags: ['BV'],
  },
  {
    vlid: '12735',
    token: '6041376688028 05',
    registeredEntity: '成都开子无暇科技有限公司',
    registeredTime: '2025-11-05T12:06:09Z',
    claimTime: '2025-11-05T12:06:09Z',
    claimStatus: 'claimed',
    certStatus: 'uncertified',
    status: 'active',
    email: 'zhangtaiyan@mail.jzion.top',
    contactPerson: '张泰然',
    phone: '176****458',
    customerSource: '内部开通',
    walletStatus: '无',
    signCompany: '(28031) 成都开子无暇科技有限公司',
    signSales: '李进',
    signEmail: 'jin.li1@bluefocus.com',
    responsibleSales: '李进',
    responsibleAE: '王丹 dan.wang6@bl',
    tags: ['BMP'],
  },
  {
    vlid: '12732',
    token: '1759384164789090',
    registeredEntity: 'HK BIZOE ELECTRONICS CO.,LIMITED',
    registeredTime: '2025-11-05T10:50:55Z',
    claimTime: '2025-11-05T10:50:55Z',
    claimStatus: 'claimed',
    certStatus: 'uncertified',
    status: 'active',
    email: 'info@jadomoto.com',
    contactPerson: 'info',
    phone: '177****993',
    customerSource: '内部开通',
    walletStatus: '钱包',
    signCompany: '(28028) HK BIZOE ELECTRONICS CO.,LIMITED',
    signSales: '陈宇晨',
    signEmail: 'yuchen.chen1@bluefocus.com',
    responsibleSales: '陈宇晨',
    responsibleAE: '胡梦璐 menglu.hu@bl',
    tags: ['Tomato-HK'],
  },
  {
    vlid: '12727',
    token: '',
    registeredEntity: '佛山博点科技有限公司',
    registeredTime: '2025-11-04T17:35:24Z',
    claimTime: undefined,
    claimStatus: 'unclaimed',
    certStatus: 'certified',
    status: 'active',
    email: '1981664512@qq.com',
    contactPerson: '房先生',
    phone: '135****035',
    customerSource: '自助注册',
    walletStatus: '未知',
  },
  {
    vlid: '12720',
    token: '',
    registeredEntity: '广州民谣传媒有限公司',
    registeredTime: '2025-11-04T11:24:12Z',
    claimTime: undefined,
    claimStatus: 'unclaimed',
    certStatus: '未知',
    status: 'active',
    email: '1656149685@qq.com',
    contactPerson: '黄女士',
    phone: '157****207',
    customerSource: '自助注册',
    walletStatus: '未知',
  },
  {
    vlid: '12726',
    token: '1238002194164697',
    registeredEntity: 'CÔNG TY TNHH CÔNG NGHỆ XDS VIỆT NAM',
    registeredTime: '2025-11-04T17:25:21Z',
    claimTime: '2025-11-04T17:25:21Z',
    claimStatus: 'claimed',
    certStatus: 'uncertified',
    status: 'active',
    email: 'rickey.0307@outlook.com',
    contactPerson: 'Rickey',
    phone: '189****243',
    customerSource: '内部开通',
    walletStatus: '钱包',
    signCompany: '(28023) CÔNG TY TNHH CÔNG NGHỆ XDS VIỆT NAM',
    signSales: '陈维维',
    signEmail: 'qiyan.chen1@bluefocus.com',
    responsibleSales: '陈维维',
    responsibleAE: 'Linh Le le.linh@bluef',
    tags: ['BV'],
  },
  {
    vlid: '12724',
    token: '3456076721366836',
    registeredEntity: 'OceanPort Trade Inc',
    registeredTime: '2025-11-04T15:35:20Z',
    claimTime: '2025-11-04T15:35:20Z',
    claimStatus: 'claimed',
    certStatus: 'uncertified',
    status: 'active',
    email: '00007mayi@gmail.com',
    contactPerson: '邓正',
    phone: '130****999',
    customerSource: '内部开通',
    walletStatus: '钱包',
    signCompany: '(28017) OceanPort Trade Inc',
    signSales: '陈舒瑜',
    signEmail: 'shuyu.chen@bluefocus.com',
    responsibleSales: '陈舒瑜',
    responsibleAE: '曹婷婷 tingting.cao@',
    tags: ['BMP'],
  },
];

// 初始化数据
const getVLUsers = async (): Promise<VLUser[]> => {
  const users = await getAllData<VLUser>('vlusers');
  if (users.length === 0) {
    await addBatchData('vlusers', initialData);
    return initialData;
  }
  return users;
};

export default {
  // 获取 VL 用户列表
  'GET /api/vlusers': async (req: any, res: any) => {
    try {
      const { pageNum = 1, pageSize = 10, vlid, signInfo } = req.query;
      
      // 从数据库获取数据
      let allData = await getVLUsers();
      
      // 应用筛选条件
      if (vlid) {
        allData = await findData<VLUser>(
          'vlusers',
          (item) => item.vlid.includes(vlid)
        );
      }
      if (signInfo) {
        allData = await findData<VLUser>(
          'vlusers',
          (item) =>
            (item.signCompany && item.signCompany.includes(signInfo)) ||
            (item.registeredEntity && item.registeredEntity.includes(signInfo))
        );
      }

      // 分页
      const start = (Number(pageNum) - 1) * Number(pageSize);
      const end = start + Number(pageSize);
      const list = allData.slice(start, end);

      res.json({
        code: 200,
        message: '获取成功',
        data: {
          list,
          total: allData.length,
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
        },
      });
    } catch (error: any) {
      console.error('获取列表失败:', error);
      res.json({
        code: 500,
        message: error.message || '获取列表失败',
        data: {
          list: [],
          total: 0,
        },
      });
    }
  },

  // 获取用户详情
  'GET /api/vlusers/:vlid': async (req: any, res: any) => {
    try {
      const { vlid } = req.params;
      const user = await findOneData<VLUser>(
        'vlusers',
        (item) => item.vlid === vlid
      );
      
      if (user) {
        res.json({
          code: 200,
          message: '获取成功',
          data: user,
        });
      } else {
        res.json({
          code: 404,
          message: '用户不存在',
        });
      }
    } catch (error: any) {
      console.error('获取详情失败:', error);
      res.json({
        code: 500,
        message: error.message || '获取详情失败',
      });
    }
  },

  // 创建用户
  'POST /api/vlusers': async (req: any, res: any) => {
    try {
      const data = req.body;
      
      // 生成VLID
      const vlid = String(Math.floor(10000 + Math.random() * 90000));
      
      // 检查VLID是否已存在
      const existing = await findOneData<VLUser>(
        'vlusers',
        (item) => item.vlid === vlid
      );
      
      if (existing) {
        res.json({
          code: 400,
          message: 'VLID已存在，请重试',
        });
        return;
      }
      
      const newUser: VLUser = {
        vlid,
        token: '',
        registeredEntity: data.registeredEntity || '',
        registeredTime: new Date().toISOString(),
        claimTime: undefined,
        claimStatus: 'unclaimed',
        certStatus: 'uncertified',
        status: 'active',
        email: data.email || '',
        contactPerson: data.contactPerson || '',
        phone: data.phone || '',
        customerSource: data.customerSource || '自助注册',
        ...data,
      };
      
      // 添加数据到数据库
      await addData('vlusers', newUser);
      
      res.json({
        code: 200,
        message: '创建成功',
        data: newUser,
      });
    } catch (error: any) {
      console.error('创建失败:', error);
      res.json({
        code: 500,
        message: error.message || '创建失败',
      });
    }
  },

  // 更新用户
  'PUT /api/vlusers/:vlid': async (req: any, res: any) => {
    try {
      const { vlid } = req.params;
      const data = req.body;
      
      const updated = await updateData<VLUser>(
        'vlusers',
        (item) => item.vlid === vlid,
        (item) => ({ ...item, ...data })
      );
      
      if (updated) {
        res.json({
          code: 200,
          message: '更新成功',
          data: updated,
        });
      } else {
        res.json({
          code: 404,
          message: '用户不存在',
        });
      }
    } catch (error: any) {
      console.error('更新失败:', error);
      res.json({
        code: 500,
        message: error.message || '更新失败',
      });
    }
  },

  // 冻结/解冻用户
  'POST /api/vlusers/:vlid/freeze': async (req: any, res: any) => {
    try {
      const { vlid } = req.params;
      const { freeze } = req.body;
      
      const updated = await updateData<VLUser>(
        'vlusers',
        (item) => item.vlid === vlid,
        (item) => ({ ...item, status: freeze ? 'frozen' : 'active' })
      );
      
      if (updated) {
        res.json({
          code: 200,
          message: freeze ? '冻结成功' : '解冻成功',
        });
      } else {
        res.json({
          code: 404,
          message: '用户不存在',
        });
      }
    } catch (error: any) {
      console.error('操作失败:', error);
      res.json({
        code: 500,
        message: error.message || '操作失败',
      });
    }
  },
};
