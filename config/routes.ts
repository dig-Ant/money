export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: './home/index',
    meta: {
      icon: 'UserOutlined',
      name: '抖音数据下载'
    }
  },
  {
    path: '/test',
    // component: '@/layouts/index',
    meta: {
      name: '测试',
      icon: 'UserOutlined'
    },
    routes: [
      {
        path: '/test/ad',
        component: './home',
        meta: {
          icon: 'UserOutlined',
          name: '哈哈哈'
        }
      },
      {
        path: '/test/ad2',
        component: './home',
        meta: {
          icon: 'UserOutlined',
          name: '对对对'
        }
      }
    ]
  },
];
