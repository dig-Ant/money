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
