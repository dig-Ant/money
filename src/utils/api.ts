const apiConfig = {
  mock: '//localhost:8888',
  test: '//localhost:8888',
  prod: '//localhost:8888',
};

//当前环境
let env: 'mock' | 'test' | 'prod' = 'test';
const host = window.location.host;
// TODO 未配置
if (host === 'fancy3.fancydsp.com') {
  env = 'prod';
}

export const BASE_URL = apiConfig[env];

// 下载抖音视频资源到本地
export const GET_DY_RESOURCE = '/v1/getDyResource';
