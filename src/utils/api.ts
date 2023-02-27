const apiConfig = {
  mock: '//localhost:8011',
  test: '//localhost:8011',
  prod: '//localhost:8011',
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
export const GRT_LINK = '/v1/grtLink';

// 下载抖音视频资源到本地
export const GET_DY_RESOURCE = '/v1/getDyResource';
export const EXEC_DY_DOWNLIST = '/v1/getDyDownloadList';

// 获取前n条收藏视频的视频信息和作者信息
export const GET_DY_YUNYUN = '/v1/getDyYunyun';
export const GET_DY_YUNYUN_LIST = '/v1/getDyYunyunList';

// 获取账号作品信息
export const GET_DY_PRODUCTMSG = '/v1/getProductmsg';
// 搜索目标用户
export const GET_DY_PRODUCT_MSG_LIST = '/v1/getProductmsgList';
export const GET_DY_PRODUCT_USER = '/v1/getProductUser';

// 下载目标用户
export const GET_DY_USERS = '/v1/getDyUsers';
// 搜索目标用户
export const GET_DY_USERS_NAME = '/v1/getDyUsersName';
export const GET_DY_USERS_LIST = '/v1/getDyUsersList';

// 下载直播间用户
export const GET_DY_LIVE_USERS = '/v1/getDyLiveUsers';
// 搜索直播间用户
export const GET_DY_LIVE_USERLIST = '/v1/getDyLiveUserList';

// 批量点赞
export const EXEC_DY_USERS_LIKE = '/v1/execDyUsersLike';
export const EXEC_DY_FOLLOW_list = '/v1/execDyFollowList';
// 批量获取主页视频信息
export const EXEC_DY_VIDEPMSG = '/v1/execDyVidelMsg';
export const EXEC_DY_DELETE = '/v1/execDyDelete';
export const EXEC_DY_DELETE_SINGLE = '/v1/execDyDeleteSingle';
// 给最近的点赞做评论
export const EXEC_DY_LIKE = '/v1/execDyLike';

// 抖音搜索列表
export const GET_DY_SEARCH = '/v1/getDySearch';
// 评论列表
export const GET_DY_COMMENT = '/v1/getDyComment';
// 点赞收藏文案
export const GET_DY_TEXT = '/v1/getDyText';
