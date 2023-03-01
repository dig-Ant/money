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
let i = 0;
let commit = [
  '三月的第一天 立个约定 祝我们越来越好 越来越幸福',
  '希望你在烟熏火燎的日子里， 也能活成你想要的样子！',
  '寻了半年的春天，春天真的来了',
  '“花会沿路盛开，你以后的路也是。” ',

  '三月的第一天 立个约定 祝我们越来越好 越来越幸福',
  // 1、短暂又冗长的一生，我不赞美人世一词，积攒着深情倾心的言语，赞美你。2、在这世间我爱三样东西。太阳，月亮和你。太阳为早上，月亮为夜里，而你为永恒。——出自武汉大学三行情书第一名
  // 我以为你是我的海，我是你的诗，我以为我可以填满你的世界的空隙。我以为你还在我心里
  '很高兴遇见你，在这不可思议的十四亿分之一[玫瑰]',
  '“花会沿路盛开，你以后的路也是。” ',
  '一切都会变好的，就像我从胖变成了好胖～[一起加油]',
  '“都是和芝麻一样的小事 可满地的芝麻足矣让人捡到崩溃” ',
  '三月的第一天 立个约定 祝我们越来越好 越来越幸福',
  '“花会沿路盛开，你以后的路也是。” ',
  '“有些歌只听前奏就很心动 有些人光是遇见就很喜欢.”',
  '“螃蟹在剥我的壳 笔记本在写我 漫天的我落在枫叶雪花上 而你在想我。——出自武汉大学三行情书第一名”',
  '“想做什么就去做吧 别畏手畏脚的 这无法重来的一生 还有什么比快乐更重要“[玫瑰]',
  '“其实当你快坚持不住的时候 困难也快坚持不住了“',
  '三月的第一天 立个约定 祝我们越来越好 越来越幸福',
  '“没有人过着如愿以偿的人生 所以我们总觉得别人比自己幸福“',
  '“花会沿路盛开，你以后的路也是。” ',
  '“把时间分给正确的人和事，即使生活平淡也会感觉到幸福”、',
  '我有预感 你期待的那件事马上就会有好结果[玫瑰]✨',
  // '你知道吗？无关紧要的人除了会影响你的心情，什么都给不了你…',
  '等我有钱了，我买两袋薯片，一袋你看着我吃，另外一袋，我吃给你看[胜利]',
  '三月的第一天 立个约定 祝我们越来越好 越来越幸福',
  '“只要不生病，慢慢赚💰就好啦，家人平安健康，其余都是锦上添花～“[一起加油]',
  '“螃蟹在剥我的壳 笔记本在写我 漫天的我落在枫叶雪花上 而你在想我。——武汉大学三行情书第一名”',
  // '西班牙有句谚语：如果常常流泪，就不能看见星光。我很喜欢这句话，所以即使要哭，也只在下午小哭一下，夜间要去看星星，是没有时间哭的。再说，我还要去采果子呢。——三毛《写给正在怨天尤人的你》 ',
  '“以前没有手机 没有电视 没有空调 但比现在快乐多了”',
  '“我知道草莓 蓝莓 蔓越莓 但是就是不知道你想我了莓“[胜利]',
  '你发现了吗？和舒服的人在一起，连沉默都是快乐的…[玫瑰]',
  '“把时间分给正确的人和事，即使生活平淡也会感觉到幸福”、',
  '要和那些能让你开心的人一起玩哦 越开心就会越漂亮[玫瑰]',
  '“我是不会离开你的，就像数学题，说不会就不会！[调皮]“',
  '风里已经有了春天的味道 希望你 小小烦恼都不见 小小愿望都实现[一起加油][害羞][调皮]',
  '别沮丧，生活就像心电图，一帆风顺你就芭比Q了，加油！',
  '“不要去焦虑太远的明天，因为焦虑并不能解决问题，只会令现状变得更糟糕”',
  '“把时间分给正确的人和事，即使生活平淡也会感觉到幸福”、',
  '“想多了都是问题 想开了全是答案”',
  '没有人规定一朵花一定要长成向日葵或玫瑰，你怎样都得被万般宠爱',
  '日子再辛苦，也总会有人把最甜的部分留给你',
  '最近有什么好听的歌吗 可以安利给我吗~',
  '人生就是一条坎坷曲折的路，即使不断的跌倒，也一定要爬起来，坚持自己的封存梦想。这一秒不放弃，下一秒就会有希望。',
  '“如果生活不宠你，要自己善待自己，这一生风雨兼程，就是为了遇见更好的自己，余生很贵，努力活成自己想要的样子”',
  '“日子过着过着就会有答案，努力走着走着就会有温柔的着落，好的人生不慌不忙”、',
  '“想开，看开，放开，不为难自己不盲目较劲，很多时候你尽力了就已经够了不要自我折磨”、',
  '“反正怎么选都有遗憾，反正最终我们都不能活着离开世界，还不如大胆一点” ',
  '“有个每天都能听你讲废话的人真的超级幸运，ta就像礼物一样，出现在你的生命里“[玫瑰]',
  '“我有什么缺点你尽管说 我放大给你看[暗中观察]”',
  '“把时间分给正确的人和事，即使生活平淡也会感觉到幸福”、',
  '“你喜欢吃草莓，你会毫不犹豫的买下它，如果你不喜欢吃香蕉，但考虑到香蕉助消化，你还是会买它。所以，喜欢是单纯的，不喜欢，才会权衡利弊。在你犹豫的一瞬间，其实已经做出了选择。”',
  '“终其一生寻找的，应该是自己喜欢的生活方式，和想要成为的人。所以多走点弯路也没关系的，花很多时间在路上也不要紧的，和世俗或是别人所期待的不一样也可以的。只要你是在成为你的路上，就够了。”',
  '“做过一次手术，就知道喝药根本算不上苦。狠狠摔倒过，就知道擦破皮不值得哭。被背叛过，就知道吵两句嘴不伤真感情。希望你慢慢学会长大，希望你开始不在意受伤，希望你哪怕伤痕累累，但依然闪闪发光。”',
  '“我们都太喜欢等，固执的相信等待就会有结果，没有在最喜欢的时候穿上心爱的衣服，没有在最纯粹的时候把爱表达出来，没有在最热血的时候去做最想做的事，却以为以后这些事都会被实现，生命中任何事物都有保质期。如果美好的事物只能奉献在理想的高台上，那么它也会在无情的在岁月里挤满灰尘。”',

  // '长大后才发现童年时光最无瑕',
  // '童话森林的小公主',
  // '女孩子就是美好的代名词！',
  // '可爱的人正在看这条可爱的视频',
  // '小孩子的世界真好，无忧无虑没有烦恼',
  // '小朋友为啥这么开心呢',
  // '藏在可爱日子里翘首以盼的温柔与惊喜',
  // '可爱无价',
  // '童年真美好呀',

  // '春天快来！',
  // '春天嘛 不就应该出去玩吗',
  // '春天到了 一起去看花吗？',
  // '准备去踏青啦～～',
  // '记得把生活调成自己喜欢的频道',
  // '心有猛虎，嗷呜嗷呜！',

  // '时间一直在走 我也留不住什么.',
  // '原来2018已经不是两年前 而是五年前了',

  // '“如果我能成为你害怕失去的人就好了”',
  // '人都会犯错，所以铅笔的另一头 是橡皮[思考]',
  // '我知道你最近很累，那种看不见的，身体上的，精神上的，面对未来的无力感，但不管生活怎样，请保持热爱',
  // '“你为什么这么久都不给我发消息，难道我看起来像不识字吗？不识字你可以给我发语音啊“',
  // '“我可以做你的小宝贝吗？那种～犯了错，你不都舍得凶我，还心软～抱抱我的那种🍭“',
  // '“对不起 您拨打的用户正在生气中 请稍后再拨 如不想等待 请发🧧激活 再见！“',
  // '“翻篇吧，勇敢去奔赴新的事物，好好努力生活的小朋友，一定会被奖励新的开始呦～',
  // '虽然我个子小小的 但只要你不开心了 我的小肩膀也可以给你靠 知道了吗🤗',
  // '努力赚💰吧，毕竟秋天的衣服比夏天贵呦～',

  // '今年夏天 想去看海 ',
  // '平安最重要，其他都是锦上添花
];
let commit1 = [
  '质量很过关，品质有保障，相当不错的选择，好多朋友看我用都想买，我都推荐了',
  // '东挑西选，头都晕了，还是你家吧，评价也不错，安排上了',
  // '你推荐的东西真的好实用哦,有空来我家坐坐',
  // '你家推荐的东西都特别好用，会一直关注。',

  '你发的视频都很用心了❤️忍不住就想停下来用心地看完，真心地点赞评论❤️我是非常活跃的宝宝，记得常来常往哦❤️❤️',
  '好喜欢你推荐的东西，每次刷到你，我都忍不住要买，感觉你都是走心的分享好东西给大家，太喜欢到你家来买东西了，一如既往地好！',
  '一直在关注你的动态🌈，发现你推荐的都是良心好物😋，已购买多次特来回评🌷。优质铁粉[比心]，欢迎来家里做客👏🏻👏🏻👏🏻[呲牙][一起加油]',
  '我来学习了，这个太实用了，不错的选择[呲牙][一起加油]',
  '就喜欢你推荐的东西，一如既往的好。而且每次刷到都会有惊喜👏🏻👏🏻👏🏻[赞] [呲牙][一起加油]',
  '姐妹真会挑选东西，宝贝样样都是精品，物超所值，值得推荐[比心]  来我家喝茶噢～🥰 ',
  '到底是个什么样的博主啊！为什么没有早点发现[流泪][流泪]太宝藏了！！！！[看][看]  ',
  '🈶品质才会被深爱，你家的东西真不错👍一如既往的喜欢！刷到了就马上进来看看💕💕👏🏻👏🏻👏🏻 ',
  '一直在关注你的动态，发现你推荐的都是良心好物，视频也高清，向你学习！我也做好物一个多星期了，终于上热门了，每天都能稳稳的出单，所有的努力都没有白费，加油好物的兄弟姐妹们！[比心][比心][比心]',
  '一直在关注你的动态，发现你推荐的都是良心好物，视频也高清，向你学习！[比心][比心][比心]',
  '这个东西第二次买了，一如既往的好记得要来串门哦[比心][比心][比心]',
  '抖音真是个好东西，你喜欢什么，就给你推荐什么，你什么样的心情，就给你推荐什么样的视频，比你老公都了解你的心情',
  // '真正喜欢、好用的东西，是会一直回购的!',
  '你推荐，我支持！💪真的是买到就是赚到， 质量什么的都歪瑞OK👌🏻千言万语，道不尽的中意😍还是那句话，支持你长长久久，爱你~😘😘😘',
  '耶~喜欢的东西都会反复推荐~🎀 ',
  '🎀 一如既然的喜欢，一如既往的推荐 我最爱的东西，分享给最爱的你们💞',
  '每次刷到你，我都忍不住要买，感觉你都是走心的分享，太喜欢到你家来买东西了，一如既往地好。记得要来串门哦[比心][比心][比心]',
  '好喜欢你推荐的东西，感觉你都是走心的分享好东西给大家，一如既往地好！',
  '[赞][赞][赞]好喜欢你分享的东西，每次在你家拍回来的宝贝都很不错，关键价格还很便宜，质量又好，会一如既往的支持你哦[比心]',
];
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
                title="copy"
                onClick={() => {
                  copy(commit[i]);
                  i++;
                }}
              />
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
