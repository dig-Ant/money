const apiConfig = {
  mock: '//localhost:8008',
  test: '//localhost:8008',
  prod: '//localhost:8008',
};

//当前环境
let env: 'mock' | 'test' | 'prod' = 'test';
const host = window.location.host;
// TODO 未配置
if (host === 'fancy3.fancydsp.com') {
  env = 'prod';
}

export const BASE_URL = apiConfig[env];

// 登录pup
export const LOGIN_PUP = '/v1/loginPup';
export const LOGOUT_PUP = '/v1/logoutPup';

// 下载抖音视频资源到本地
export const GET_DY_RESOURCE = '/v1/getDyResource';

// 抖音搜索列表
export const GET_DY_SEARCH = '/v1/getDySearch';