import { request as requestCore, useRequest } from 'umi';
import type { RequestConfig } from 'umi';
import { notification } from 'antd';
import { BASE_URL } from './api';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';

// import auth from '@/utils/auth';

const codeMessage: { [code: string]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
// @ts-ignore
const errorHandler = (error) => {
  const { response } = error;

  if (get(response, 'status') !== 403) {
    notification.error({
      description: '您的网络链接存在异常，请确认网络通畅后继续使用。',
      message: '网络异常',
    });
  }

  return response;
};

/**
 * 配置request请求时的默认参数
 */

// export

const request = (url: string, props?: any) => {
  const { method = 'get', data, ...ext } = props || {};
  const requestConfig: RequestConfig = {
    method,
    // timeout: 2000,
    baseURL: BASE_URL,
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Headers':
      //   'x-test-header, Origin, X-Requested-With, Content-Type, Accept',
      // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      // Authorization: 'XMLHttpRequest',
      // 'Content-Type': 'application/json',
    },
    ...ext,
  };

  if (method === 'get') {
    requestConfig.params = data;
  } else {
    requestConfig.data = data;
  }
  console.log('requestConfig: ', requestConfig);

  return requestCore(url, requestConfig);
};

export default request;
