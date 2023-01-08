import React, { useState } from 'react';
import { Link, Outlet, history, useLocation, request, useRequest } from 'umi';
// import { request } from '@umijs/max';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';

import { ConfigProvider, Layout, Menu, theme, Breadcrumb } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import * as Icon from '@ant-design/icons';
import routes from 'config/routes';

import logoLarge from '@/assets/logo_large.jpg';
import logoSmall from '@/assets/logo_small.jpg';
import styles from './index.less';

const { Header, Sider, Content } = Layout;

// 更具路由生成menu
const formatRoutesToMenus = (routes: any): MenuProps['items'] => {
  const handleData = cloneDeep(routes);
  const core = (data: any): MenuProps['items'] => {
    const res: Record<string, any>[] = [];
    each(data, ({ path, meta, routes, redirect }) => {
      if (!redirect) {
        const { name, icon, breadcrumb, type } = meta || {};
        const formatItem: Record<string, any> = {
          label: name,
          key: path,
        };
        if (!isEmpty(routes)) {
          formatItem.children = core(routes);
        }
        if (!isEmpty(type)) {
          formatItem.type = type;
        }
        if (!isEmpty(icon)) {
          // @ts-ignore
          formatItem.icon = Icon[icon]
            ? // @ts-ignore
              React.createElement(Icon[icon])
            : undefined;
        }
        res.push(formatItem);
      }
    });

    return res;
  };
  return core(handleData);
};

export default function Layouts() {
  const location = useLocation();
  const { pathname } = location;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {
      //组件的容器背景色，例如：默认按钮、输入框等。务必不要将其与 `colorBgElevated` 混淆
      colorBgContainer,
    },
  } = theme.useToken();

  const onMenuClick: MenuProps['onClick'] = (e) => {
    history.push({
      pathname: e.key,
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
        },
      }}
    >
      <Layout className={styles['layout']}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={styles['logo']}>
            {collapsed ? (
              <img src={logoSmall} alt="" />
            ) : (
              <img src={logoLarge} alt="" />
            )}
          </div>
          <Menu
            onClick={onMenuClick}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/home']}
            selectedKeys={[pathname]}
            // inlineCollapsed={collapsed}
            items={formatRoutesToMenus(routes)}
          />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: styles['trigger'],
                onClick: () => setCollapsed(!collapsed),
              },
            )}
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          >
            {/* <Breadcrumb>
              <Breadcrumb.Item>
                <a href="">{pathname}</a>
              </Breadcrumb.Item>
            </Breadcrumb> */}
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
