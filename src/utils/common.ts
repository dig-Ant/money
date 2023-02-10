import { message } from 'antd';
export {
  consumerUserPageList,
  agedUserPageList,
  businessUserPageList,
  liveUserPageList,
} from './userPageList';

export function copy(text: string) {
  // text是复制文本
  // 创建input元素
  const el = document.createElement('input');
  // 给input元素赋值需要复制的文本
  el.setAttribute('value', text);
  // 将input元素插入页面
  document.body.appendChild(el);
  // 选中input元素的文本
  el.select();
  // 复制内容到剪贴板
  document.execCommand('copy');
  // 删除input元素
  document.body.removeChild(el);
  message.info('复制成功');
}

export function transformUrl(values: any) {
  let url = values.userURL || undefined;
  if (url) {
    url = 'http' + url.split('http')[1];
  }
  return url;
}
export function stringToNum(like: any) {
  if (like.includes('万')) {
    const [num] = like.split('万');
    return Number((+num * 10000).toFixed(0));
  } else {
    return Number(like);
  }
}
