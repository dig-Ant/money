export const modeOptions = [
  {
    label: '点赞关注模式',
    value: '点赞关注模式',
  },
  {
    label: '点赞评论模式',
    value: '点赞关注模式',
  },
];
interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
export const consumerUserPageList: Option[] = [
  // 按母婴/美妆/小学用品/居家/情侣/分类
  {
    value: '母婴/幼儿--男宝',
    label: 'baby',
    children: [
      {
        label: '是个甜仔',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAAX6oWNDz8kvU5d97d1ODLNDPlPCPmiMKQiZQqjsl-3c',
      },
    ],
  },
  {
    value: '母婴/幼儿--女宝',
    label: 'baby',
    children: [
      {
        label: '沐言开心酱',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA5HhsD-onh_O8HDqpra58UYvLz6tNKsFtlm1u5NyvFjpjkWyqeq36gbkyghG3OuVc',
      },
      {
        label: '小盛夏👧🏼',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAr_FGd1QaMJdIM-BsZYb4xOPkGtYmUkW5av4ldq6bKK8',
      },
    ],
  },
  {
    value: '小学',
    label: 'junior',
    children: [
      {
        label: '饭饭麻麻菜菜',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAtjfh3enYvD4fxtuznB_zDEMdNEG332fD-qloHjlox3c',
      },
      {
        label: '于 兜兜',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAkSvQGYOPPnmnfvcW9Tlp400XL9MUYNAmIgIbUOVsF-uh4-QE36Q0qnon0Gn5UFHT',
      },
      {
        label: '米迪爸爸',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA0zUwsmd-N7te6DdBijJYzRplT-opRbeHYKEOB_HMDiQ',
      },
    ],
  },
  {
    value: 'makeup',
    label: '美妆',
    children: [
      {
        label: '程十安',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAbxmiV504fzKsys2Fw9qzn2iJWJyzxVbk1mDzAnurQV8',
      },
      {
        label: '爱做美甲的小鹿',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAoarhuIcVxPFcG7BeBtBss0Pe7QFsU1yVVxIFNGv8xUq70FOxWPGdaOA4PPvlub4Q',
      },
    ],
  },
  {
    value: '情侣',
    label: 'lovers',
    children: [
      {
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAWdpRZah396r0_sq_amCI2GxAYtMSvDUJz4KJZJ-68_s',
        label: '白十七是志强',
      },
    ],
  },
  {
    value: 'self',
    label: 'self',
    children: [
      {
        label: '爱在黎明前',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAyG9KBIIFAdd4gGpM1A7oYcItQtp8cuORhnz1ahPJK89VdlS15GQgaD2YcUjb4t-6',
      },
    ],
  },
];
export const videoNote = [
  {
    label: '视频',
    value: 'video',
  },
  {
    label: '图文',
    value: 'note',
  },
];
export const businessUserPageList = [
  {
    value: '母婴/幼儿--男宝',
    label: 'baby',
    children: [
      {
        label: '雨淼淼好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAD9YaF2w63nxhkoXGoEKhMX7ofVmZNS3O1735go_gnaM',
      },
    ],
  },
  {
    value: 'makeup',
    label: '美妆',
    children: [
      {
        label: '袁妹妹',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAxph_xYxXF1qd3tdm4BctBUzu-1w5bTtdwzPLayvyoCY',
      },
    ],
  },
  {
    value: 'makeup',
    label: '美妆',
    children: [
      {
        label: '思娇好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAOw8CezlYWY9b5x_NAvzYgv1CRWgF01CzjXieZ18yifRaWuBhPHPZN6xDC5k7gM8Z',
      },
      {
        label: '乔乔好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAAc1psH2X0JDFrH3sBzn7a3Z60FzNbkgyPs1VOrmTukDddwuD_Cb5u5Pl7i0zaLa1v',
      },
      {
        label: '云云好物',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA2i1AhWAcPVZX3j5uwmcCuNmCYx6XOkvC5FXJYZxHDr8',
      },
    ],
  },
];
export const agedUserPageList = [
  {
    label: 'all',
    value: 'all',
    children: [
      {
        label: '周姐',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA6tn5qhmpIB2PaHhGUQxZN8at2dkw30cM_vwPAt61AAcrx6kMpfBmYHOHsxgaGop_',
      },
      {
        label: '兰兰音乐',
        value:
          'https://www.douyin.com/user/MS4wLjABAAAA6mIvOmAFmzw7-3KxelgzEsBcAnvixrvMDg6wrXUg4fGIvUTpKEdRmDR_jrteAj3e',
      },
    ],
  },
];
export const liveUserPageList = [
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
        label: '乔乔好物',
        value: 'https://live.douyin.com/147613255084',
      },
    ],
  },
];
