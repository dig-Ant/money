import { message } from 'antd';

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
export function transformUrl(values: Object) {
  let url = values.url || '';
  if (url) {
    url = 'http' + url.split('http')[1];
  }
  return url;
}
const liveUrlList = [
  {
    title: '佛山市南海区幻月蓝化妆品店',
    url: 'https://live.douyin.com/877401283807',
  },
  {
    title: '北大满哥-早6：50直播',
    url: 'https://live.douyin.com/896737105098',
  },
  {
    title: '睿文同学加油',
    url: 'https://live.douyin.com/455397898090',
  },
  {
    title: '【依蝶美甲】https://v.douyin.com/BBUGF5B/',
    url: 'https://live.douyin.com/706461293346',
  },
  {
    title: '倪先生之昭昭美甲DIY配饰 ',
    url: 'https://live.douyin.com/115093247972',
  },
  {
    title: '兔哥设计穿戴甲',
    url: 'https://live.douyin.com/558822492122',
  },
];

// 9- #在抖音，记录美好生活#【歌霓丝服饰】正在直播，来和我一起支持Ta吧。复制下方链接，打开【抖音】，直接观看直播！ https://v.douyin.com/BkSBbc1/
// 生活#【长沙甜甜园长呀🥰】正在直播，来和我一起支持Ta吧。复制下方链接，打开【抖音】，直接观看直播！ https://v.douyin.com/Bk94pCH/ https://live.douyin.com/216666217971?room_id=7196290829210618624
// url = 'https://live.douyin.com/216666217971?room_id=7196290829210618624',
export function liveUrl(i: number) {
  return liveUrlList[i];
}
// export default {
//   copy,
// };
