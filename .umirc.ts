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
});

