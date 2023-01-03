import { defineConfig } from 'umi';
import routes from './config/routes';

export default defineConfig({
  routes,
  npmClient: 'npm',
  historyWithQuery: {},
  // antd: {},
  alias: {
    config: '/config',
    utils: '/src/utils',
    // utils: require.resolve('./src/utils'),
  },
  plugins: ['@umijs/plugins/dist/dva', '@umijs/plugins/dist/request'],
  dva: { skipModelValidate: true, immer: {} },
  request: { dataField: '' },
});
