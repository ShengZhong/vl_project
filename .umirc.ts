import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  // Webpack 配置：处理 WebAssembly 文件
  chainWebpack(config) {
    // 配置 WebAssembly 文件加载规则
    config.module
      .rule('wasm')
      .test(/\.wasm$/)
      .type('javascript/auto')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: '[name].[contenthash].[ext]',
        outputPath: 'static/wasm/',
      });

    // 排除 wasm 文件被其他 loader 处理
    config.module.rule('asset').exclude.add(/\.wasm$/);
    
    return config;
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
        { path: '/tools/pending', component: '@/pages/tools/pending/index' },
        { path: '/tools/database', component: '@/pages/tools/database/index' },
        { path: '/metaadguidance/list', component: '@/pages/metaadguidance/list/index' },
        { path: '/metaadguidance/recommendation-detail', component: '@/pages/metaadguidance/recommendation-detail/index' },
        { path: '/metaadguidance/metric-detail', component: '@/pages/metaadguidance/metric-detail/index' },
        
        // VL广告指导建议路由 (功能点ID: VL-ADGD-001)
        { path: '/adguidance/overview', component: '@/pages/adguidance/overview/index' },
        { path: '/adguidance/recommendations', component: '@/pages/adguidance/recommendations/index' },
        { path: '/adguidance/accounts', component: '@/pages/adguidance/accounts/index' },
        { path: '/permission/pending', component: '@/pages/permission/pending/index' },
        { path: '/permission/sales-ae', component: '@/pages/permission/sales-ae/index' },
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
  mock: {
    exclude: [],
  },
  title: 'VisionLine 产品原型平台',
  devServer: {
    port: 8000,
    host: '0.0.0.0',
  },
});
