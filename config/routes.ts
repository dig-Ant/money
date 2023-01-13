export default [
  {
    path: '/',
    redirect: '/consumer',
  },
  {
    path: '/consumer',
    component: './consumer/index',
    meta: {
      icon: 'RedditOutlined',
      name: '消费粉'
    }
  },
  {
    path: '/business',
  component: './business/index',
    meta: {
      icon: 'DropboxOutlined',
      name: '同行'
    }
  },
  {
    path: '/aged',
    component: './aged/index',
    meta: {
      icon: 'AlibabaOutlined',
      name: '大龄粉'
    }
  },
  {
    path: '/search',
    component: './search/index',
    meta: {
      icon: 'SearchOutlined',
      name: '搜索'
    }
  },
  {
    path: '/comment',
    component: './comment/index',
    meta: {
      icon: 'SearchOutlined',
      name: '评论'
    }
  },
  {
    path: '/download',
    component: './download/index',
    meta: {
      icon: 'UserOutlined',
      name: '下载视频'
    }
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
