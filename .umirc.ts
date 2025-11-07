import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/dashboard', component: '@/pages/dashboard/index' },
        { path: '/env-check', component: '@/pages/env-check/index' },
        
        // 待补充功能路由
        { path: '/sales/pending', component: '@/pages/sales/pending/index' },
        { path: '/settlement/pending', component: '@/pages/settlement/pending/index' },
        { path: '/tiktok/pending', component: '@/pages/tiktok/pending/index' },
        { path: '/microsoft/pending', component: '@/pages/microsoft/pending/index' },
        { path: '/snapchat/pending', component: '@/pages/snapchat/pending/index' },
        { path: '/media/pending', component: '@/pages/media/pending/index' },
        { path: '/finance/pending', component: '@/pages/finance/pending/index' },
        { path: '/quota/pending', component: '@/pages/quota/pending/index' },
        { path: '/apply/pending', component: '@/pages/apply/pending/index' },
        { path: '/emerging/pending', component: '@/pages/emerging/pending/index' },
        { path: '/tiktokbatch/pending', component: '@/pages/tiktokbatch/pending/index' },
        { path: '/analysis/pending', component: '@/pages/analysis/pending/index' },
        { path: '/datadashboard/pending', component: '@/pages/datadashboard/pending/index' },
        { path: '/industry/pending', component: '@/pages/industry/pending/index' },
        { path: '/brand/pending', component: '@/pages/brand/pending/index' },
        { path: '/knowledge/pending', component: '@/pages/knowledge/pending/index' },
        { path: '/tools/pending', component: '@/pages/tools/pending/index' },
        { path: '/permission/pending', component: '@/pages/permission/pending/index' },
        { path: '/monitor/pending', component: '@/pages/monitor/pending/index' },
        { path: '/blueaff/pending', component: '@/pages/blueaff/pending/index' },
        { path: '/blackwhite/pending', component: '@/pages/blackwhite/pending/index' },
        
        // 基础数据路由
        { path: '/vluser/list', component: '@/pages/vluser/list/index' },
        { path: '/vlaccount/list', component: '@/pages/vlaccount/list/index' },
        { path: '/entity/list', component: '@/pages/entity/list/index' },
        { path: '/contract/list', component: '@/pages/contract/list/index' },
        { path: '/agreement/list', component: '@/pages/agreement/list/index' },
        { path: '/payment/manage', component: '@/pages/payment/manage/index' },
        { path: '/advertiser/list', component: '@/pages/advertiser/list/index' },
        { path: '/bigadvertiser/list', component: '@/pages/bigadvertiser/list/index' },
        { path: '/bigproject/list', component: '@/pages/bigproject/list/index' },
        { path: '/churnrate/list', component: '@/pages/churnrate/list/index' },
        { path: '/origindata/list', component: '@/pages/origindata/list/index' },
      ],
    },
  ],
  fastRefresh: {},
  antd: {
    dark: false,
    compact: false,
  },
  dva: {
    hmr: true,
  },
  title: 'VisionLine 产品原型平台',
  devServer: {
    port: 8000,
    host: '0.0.0.0',
  },
});

