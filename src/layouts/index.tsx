import React, { useState } from 'react';
import {
  Link,
  Outlet,
  history,
  useLocation,
  request,
  useRequest,
  useDispatch,
} from 'umi';

// import { request } from '@umijs/max';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';

import {
  ConfigProvider,
  Layout,
  Menu,
  theme,
  Space,
  Button,
  Breadcrumb,
} from 'antd';
import type { MenuProps } from 'antd';

import { LinkOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
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
import { copy } from '@/utils/common';

const { Header, Sider, Content } = Layout;
let 爱捣鼓的小仙儿 = require('../../money-backend/utils/comments/text/爱捣鼓的小仙儿');
let 春天 = require('../../money-backend/utils/comments/text/春天');
let text = require('../../money-backend/utils/comments/text/text');
let miss = require('../../money-backend/utils/comments/weekily/miss');
let 可可爱爱文案 = require('../../money-backend/utils/comments/weekily/可可爱爱文案');
let 宝宝 = require('../../money-backend/utils/comments/宝宝');
let 风景 = require('../../money-backend/utils/comments/景色');
let 美食 = require('../../money-backend/utils/comments/食物');
let business2 = require('../../money-backend/utils/comments/business2');
let 美女 = require('../../money-backend/utils/comments/girls');
let aged = require('../../money-backend/utils/comments/aged1');
let urlList = require('../../money-backend/utils/urlText');

const getCMText = function (list: [string]) {
  const len = list.length;
  let i = Math.random() * len;
  i = Math.floor(i);
  console.log(list[i]);
  return list[i] + '[比心][比心]';
};
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
  const dispatch = useDispatch();
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
            defaultSelectedKeys={['/download']}
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
            <Space style={{ marginLeft: 100, marginBottom: 10 }}>
              <LoginOutlined
                title="首次需要登录chromium"
                onClick={() => {
                  dispatch({
                    type: 'global/loginPup',
                  });
                }}
              />
              <LogoutOutlined
                title="关闭登录chromium"
                onClick={() => {
                  dispatch({
                    type: 'global/logoutPup',
                  });
                }}
              />
              <LinkOutlined
                title="link"
                onClick={() => {
                  dispatch({
                    type: 'global/grtLink',
                  });
                }}
              />
              <LinkOutlined
                title="link"
                onClick={() => {
                  dispatch({
                    type: 'global/grtText',
                    payload: {
                      urlList,
                    },
                  });
                }}
              />
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(business2);
                  copy(cmtText);
                }}
              >
                同
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(aged);
                  copy(cmtText);
                }}
              >
                aged
              </span>
              &nbsp;&nbsp;&nbsp;
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(爱捣鼓的小仙儿);
                  copy(cmtText);
                }}
              >
                消
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(美女);
                  copy(cmtText);
                }}
              >
                美女
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(miss);
                  copy(cmtText);
                }}
              >
                miss
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(风景);
                  copy(cmtText);
                }}
              >
                风景
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(宝宝);
                  copy(cmtText);
                }}
              >
                宝
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(春天);
                  copy(cmtText);
                }}
              >
                春天
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(text);
                  copy(cmtText);
                }}
              >
                text
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(可可爱爱文案);
                  copy(cmtText);
                }}
              >
                可爱
              </span>
              <span
                style={{ cursor: 'pointer' }}
                title="copy"
                onClick={() => {
                  const cmtText = getCMText(美食);
                  copy(cmtText);
                }}
              >
                美食
              </span>
            </Space>
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
