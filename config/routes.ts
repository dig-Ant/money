export default [
  {
    path: '/',
    redirect: '/fans/consumer',
  },
  {
    path: '/fans',
    // component: './consumer/index',
    meta: {
      icon: 'RedditOutlined',
      name: '找粉',
    },
    routes: [
      {
        path: '/fans/consumer',
        component: './consumer/index',
        meta: {
          icon: 'RedditOutlined',
          name: '消费粉',
        },
      },
      {
        path: '/fans/business',
        component: './business/index',
        meta: {
          icon: 'DropboxOutlined',
          name: '同行',
        },
      },
      {
        path: '/fans/aged',
        component: './aged/index',
        meta: {
          icon: 'AlibabaOutlined',
          name: '大龄粉',
        },
      },
    ],
  },
  {
    path: '/text',
    meta: {
      icon: 'SearchOutlined',
      name: '找文案',
    },
    routes: [
      {
        path: '/text/keyword',
        component: './search/index',
        meta: {
          icon: 'SearchOutlined',
          name: '关键字搜索',
        },
      },
      {
        path: '/text/comment',
        component: './comment/index',
        meta: {
          icon: 'SearchOutlined',
          name: '获取评论文案',
        },
      },
      {
        path: '/text/mycollectionTitle',
        component: './text/index',
        meta: {
          icon: 'SearchOutlined',
          name: '收藏作品文案',
        },
      },
    ],
  },
  {
    path: '/like',
    component: './like/index',
    meta: {
      icon: 'SearchOutlined',
      name: '给点赞评论',
    },
  },
  {
    path: '/select',
    meta: {
      icon: 'UserOutlined',
      name: '选品',
    },
    routes: [
      {
        path: '/select/download',
        component: './download/index',
        meta: {
          icon: 'UserOutlined',
          name: '下载视频',
        },
      },
      {
        path: '/select/productmsg',
        component: './productmsg/index',
        meta: {
          icon: 'UserOutlined',
          name: '获取账号作品信息',
        },
      },
    ],
  },
  // {
  //   path: '/test',
  //   // component: '@/layouts/index',
  //   meta: {
  //     name: '测试',
  //     icon: 'UserOutlined'
  //   },
  //   routes: [
  //     {
  //       path: '/test/ad',
  //       component: './home',
  //       meta: {
  //         icon: 'UserOutlined',
  //         name: '哈哈哈'
  //       }
  //     },
  //     {
  //       path: '/test/ad2',
  //       component: './home',
  //       meta: {
  //         icon: 'UserOutlined',
  //         name: '对对对'
  //       }
  //     }
  //   ]
  // },
];
