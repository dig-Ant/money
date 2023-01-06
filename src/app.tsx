import { message, notification } from 'antd';
import type { RequestConfig } from 'umi';

// 与后端约定的响应数据格式
interface ResponseStructure {
  code: number;
  data: any;
  errorTitle?: string;
  errorMessage?: string;
}

// 在这里配置的规则将应用于所有的 request 和 useRequest 方法。
export const request: RequestConfig = {
  timeout: 0,
  // withCredentials:true,
  // other axios options you want
  errorConfig: {
    errorThrower: (res: ResponseStructure) => {
      console.log('errorThrower--res: ', res);
      const { code, data, errorTitle, errorMessage } = res;
      if (code !== 0) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = res;
        throw error; // 抛出自制的错误
      }
    },
    errorHandler: (error: any, opts: any) => {
      console.log('errorHandler: ', error, opts);
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        const res = error.res || { errorTitle: '', errorMessage: '请求报错' };
        // message.error(`Response status:${error.response.status}`);
        notification.error({
          message: res.errorTitle,
          description: res.errorMessage,
        });
      } else if (error.response) {
        // 我们的 errorThrower 抛出的错误。
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`请求出错了哦:${error.name}--${error.message}`);
      } else {
        // 发送请求时出了点问题
        message.error('请求出错了哦');
      }
    },
  },
  requestInterceptors: [
    // 直接写一个 function，作为拦截器
    (url, options) => {
      // console.log('requestInterceptors url: ', url, options);
      // let token = auth.getToken();
      // if (
      //   token &&
      //   filter(
      //     map(EASY_REPORT_BASE, (value) => value),
      //     (v) => url.includes(v),
      //   ).length === 0
      // ) {
      //   // @ts-ignore
      //   options.headers.Authorization = token;
      // }
      // do something
      return { url, options };
    },
  ],
  responseInterceptors: [
    (response) => {
      // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
      const { data = {} as any, config } = response;
      // response 拦截
      if (response.status === 403) {
        window.location.href =
          '/login?fromUrl=' + decodeURIComponent(location.pathname);
      }
      // do something
      return response;
    },
  ],
};
