/**
 * 权限管理 Mock 数据
 * 功能点 ID: VL-SYS-001
 */

import {
  getAllData,
  addData,
  removeData,
  findData,
  addBatchData,
  removeBatchData,
} from '../src/db';
import { UserProfile, UserRole } from '../src/types/profile';

// 定义关系类型
interface SalesAERelation {
  id: number;
  salesId: string;
  aeId: string;
  createdAt: string;
}

export default {
  // 获取 Sales-AE 关系列表
  // Query: ?salesId=xxx
  'GET /api/permission/sales-ae': async (req: any, res: any) => {
    try {
      const { salesId } = req.query;
      
      let relations = await getAllData<SalesAERelation>('sales_ae_relations');
      
      if (salesId) {
        relations = relations.filter(r => r.salesId === salesId);
      }
      
      // 补充 AE 详细信息
      const profiles = await getAllData<UserProfile>('profiles');
      const result = relations.map(r => {
        const ae = profiles.find(p => p.userId === r.aeId);
        const sales = profiles.find(p => p.userId === r.salesId);
        return {
          ...r,
          aeName: ae?.name || r.aeId,
          salesName: sales?.name || r.salesId,
        };
      });

      res.json({
        code: 200,
        data: result,
      });
    } catch (error: any) {
      console.error('获取关系列表失败:', error);
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  // 绑定 Sales 和 AE (批量，支持双向)
  'POST /api/permission/sales-ae/bind': async (req: any, res: any) => {
    try {
      const { salesId, aeIds, aeId, salesIds } = req.body;
      
      let newRelations: any[] = [];

      // 模式 A: 一个 Sales 绑定多个 AE
      if (salesId && Array.isArray(aeIds)) {
        // 检查已存在的关系，避免重复
        const existing = await findData<SalesAERelation>('sales_ae_relations', 
          r => r.salesId === salesId && aeIds.includes(r.aeId)
        );
        const existingAeIds = existing.map(r => r.aeId);
        
        newRelations = aeIds
          .filter(id => !existingAeIds.includes(id))
          .map(id => ({
            salesId,
            aeId: id,
            createdAt: new Date().toISOString(),
          }));
      } 
      // 模式 B: 一个 AE 绑定多个 Sales
      else if (aeId && Array.isArray(salesIds)) {
        // 检查已存在的关系
        const existing = await findData<SalesAERelation>('sales_ae_relations', 
          r => r.aeId === aeId && salesIds.includes(r.salesId)
        );
        const existingSalesIds = existing.map(r => r.salesId);
        
        newRelations = salesIds
          .filter(id => !existingSalesIds.includes(id))
          .map(id => ({
            salesId: id,
            aeId,
            createdAt: new Date().toISOString(),
          }));
      } else {
        return res.status(400).json({ code: 400, message: '参数错误' });
      }
        
      if (newRelations.length > 0) {
        await addBatchData('sales_ae_relations', newRelations);
      }

      res.json({
        code: 200,
        message: '绑定成功',
        data: { count: newRelations.length },
      });
    } catch (error: any) {
      console.error('绑定失败:', error);
      res.status(500).json({ code: 500, message: error.message });
    }
  },

  // 解绑 Sales 和 AE (批量，支持双向)
  'POST /api/permission/sales-ae/unbind': async (req: any, res: any) => {
    try {
      const { salesId, aeIds, aeId, salesIds } = req.body;
      
      let predicate: (r: SalesAERelation) => boolean;

      if (salesId && Array.isArray(aeIds)) {
        predicate = (r) => r.salesId === salesId && aeIds.includes(r.aeId);
      } else if (aeId && Array.isArray(salesIds)) {
        predicate = (r) => r.aeId === aeId && salesIds.includes(r.salesId);
      } else {
        return res.status(400).json({ code: 400, message: '参数错误' });
      }

      await removeBatchData('sales_ae_relations', predicate);

      res.json({
        code: 200,
        message: '解绑成功',
      });
    } catch (error: any) {
      console.error('解绑失败:', error);
      res.status(500).json({ code: 500, message: error.message });
    }
  },
  
  // 获取所有 Sales 用户 (用于下拉选择)
  'GET /api/permission/users/sales': async (req: any, res: any) => {
     try {
       const profiles = await getAllData<UserProfile>('profiles');
       const sales = profiles.filter(p => p.role === UserRole.Sales);
       res.json({
         code: 200,
         data: sales,
       });
     } catch (error: any) {
       res.status(500).json({ code: 500, message: error.message });
     }
  },

  // 获取所有 AE 用户 (用于下拉选择)
  'GET /api/permission/users/ae': async (req: any, res: any) => {
     try {
       const profiles = await getAllData<UserProfile>('profiles');
       const aes = profiles.filter(p => p.role === UserRole.AE);
       res.json({
         code: 200,
         data: aes,
       });
     } catch (error: any) {
       res.status(500).json({ code: 500, message: error.message });
     }
  },
};

