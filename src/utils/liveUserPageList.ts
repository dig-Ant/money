interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
export const liveUserPageList: Option[] = [
  {
    value: '母婴/幼儿',
    label: 'baby',
    children: [
      {
        label: '贝亲蒂拉品牌母婴',
        value: 'https://live.douy1in.com/292133672322',
      },
      {
        label: '交个朋友母婴生活',
        value: 'https://live.douyin.com/206031013417/',
      },
      {
        label: '兰姐孕婴',
        value: 'https://live.douyin.com/937804427532/',
      },
    ],
  },
  {
    value: '小学',
    label: 'junior',
    children: [
      {
        label: '睿文同学加油',
        value: 'https://live.douyin.com/455397898090',
      },
      {
        label: '老孙学长',
        value: 'https://live.douyin.com/17289264420',
      },
      {
        label: '北大满哥-早6：50直播',
        value: 'https://live.douyin.com/896737105098',
      },
    ],
  },
  {
    value: 'makeup',
    label: '美妆',
    children: [
      {
        label: '佛山市南海区幻月蓝化妆品店',
        value: 'https://live.douyin.com/877401283807',
      },
      {
        label: '老爸评测',
        value: 'https://live.douyin.com/833509330429/',
      },
      {
        label: '依蝶美甲',
        value: 'https://live.douyin.com/706461293346',
      },
      {
        label: '壹心美甲工作室',
        value: 'https://live.douyin.com/297233999915',
      },
      {
        label: '兔哥设计穿戴甲',
        value: 'https://live.douyin.com/558822492122',
      },
      {
        label: '倪先生之昭昭美甲DIY配饰',
        value: 'https://live.douyin.com/115093247972',
      },
      {
        label: '珍好物',
        value: 'https://live.douyin.com/634068884032',
      },
      {
        label: '歌霓丝服饰',
        value: 'https://v.douyin.com/B5VvVDD/',
      },
    ],
  },
  {
    value: '情侣',
    label: 'lovers',
    children: [],
  },
  {
    value: '男粉',
    label: 'lovers',
    children: [
      {
        label: '任白',
        value: 'https://live.douyin.com/463889443552/',
      },
    ],
  },
  {
    value: '居家',
    label: 'home',
    children: [
      {
        label: '爱上做饭的小娘子',
        value: 'https://live.douyin.com/699789496585',
      },
      {
        label: '乔乔好物',
        value: 'https://live.douyin.com/147613255084',
      },
    ],
  },
];
