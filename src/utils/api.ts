const apiConfig = {
  mock: '//localhost:8009',
  test: '//localhost:8009',
  prod: '//localhost:8009',
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

// 下载目标用户
export const GET_DY_USERS = '/v1/getDyUsers';
// 搜索目标用户
export const GET_DY_USERS_LIST = '/v1/getDyUsersList';
// 批量点赞
export const EXEC_DY_USERS_LIKE = '/v1/execDyUsersLike';

// 抖音搜索列表
export const GET_DY_SEARCH = '/v1/getDySearch';
// 评论列表
export const GET_DY_COMMENT = '/v1/getDyComment';