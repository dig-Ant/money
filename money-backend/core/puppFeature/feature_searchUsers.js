const path = require('path');
const qs = require('qs');
const { limitExec } = require('../../utils/common');
const fs = require('fs');
const moment = require('moment');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const {
  MY_USER_LINK,
  VIDEO_LIST_SELECTOR,
  VIDEO_SRC_SELECTOR,
  COMMENT_LIST_SELECTOR,
  BUSINESS_NAME,
  LIMIT,
  INIT_VIEWPORT,
  STRINGNUM,
  DEVTOOLS,
  IS_CONSUMER_TYPE,
  IS_BUSINESS_TYPE,
  USER_INFO_LIST_SELECTOR,
  IS_BUSINESS_USER,
  STRING_TO_NUM_FUN,
  GET_URL,
  TIME_OUT,
} = require('../../utils/constance');
const { createDownloadPath } = puppeteerUtils;
const feature_searchUsers = async function (params = {}) {
  let {
    userURL = MY_USER_LINK,
    limitLen = 1,
    commentLimitLen = LIMIT,
    downloadFilename = '',
    type = '',
    isLogin = false,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_searchUsers',
    devtools: true,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport(INIT_VIEWPORT);

  // 1.打开我的主页里，喜欢/收藏的列表页
  try {
    userURL = GET_URL(userURL, type);
    await page.goto(userURL, TIME_OUT);
  } catch (error) {
    console.log('主页打开失败', error);
    await browser.close();
    return { code: -1, errorMsg: '主页打开失败' };
  }

  // 2.获取我的主页里，喜欢/收藏的列表页的数据
  try {
    await page.waitForSelector(VIDEO_LIST_SELECTOR, TIME_OUT);
    const myFavorateVideos = await page.evaluate(
      async (VIDEO_LIST_SELECTOR, limitLen, userType, STRINGNUM) => {
        let StringToNum = new Function(STRINGNUM);
        let StringToNumFun = new StringToNum();
        // 获取到对应数量的视频为止
        let eleList = [...document.querySelectorAll(VIDEO_LIST_SELECTOR)];
        if (typeof limitLen !== 'undefined') {
          while (eleList.length < limitLen) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(VIDEO_LIST_SELECTOR)];
          }
          eleList = eleList.slice(0, limitLen);
        }
        eleList = eleList
          .map((el) => {
            const href = el.href;
            const [like, title = ''] = el.innerText.split('\n\n');
            return {
              userType,
              href,
              like,
              likeNum: StringToNumFun.eval(like),
              title,
              filename: `${like}-${title?.split(' ')?.[0] || '无标题'}`,
            };
          })
          .filter((e) => !e.like.includes('置顶'));
        return eleList;
      },
      VIDEO_LIST_SELECTOR,
      limitLen,
      userType,
      STRINGNUM,
    );
    console.log('myFavorateVideos: ');
    console.log(myFavorateVideos);
    await limitExec(
      async (item) => {
        const { href } = item;
        const videoPage = await browser.newPage();
        console.log('href111: ', href);
        await videoPage.goto(href, TIME_OUT);
        console.log('href222: ', href);
        try {
          if (href.includes('video')) {
            await videoPage.waitForSelector(VIDEO_SRC_SELECTOR, TIME_OUT);
            console.log('href333: ', href);
            // 3.获取评论区用户的信息
            let { src, user, commentList } = await videoPage.evaluate(
              async (
                VIDEO_SRC_SELECTOR,
                USER_INFO_LIST_SELECTOR,
                COMMENT_LIST_SELECTOR,
                commentLimitLen,
                STRINGNUM,
              ) => {
                let StringToNum = new Function(STRINGNUM);
                let StringToNumFun = new StringToNum();
                videoSrc = document.querySelector(VIDEO_SRC_SELECTOR).src;
                const user = document.querySelector(USER_INFO_LIST_SELECTOR);
                const userSrc = user.children[1].querySelector('a').innerText;
                const userName = user.children[1].querySelector('a').innerText;
                const [fans, like] = user.children[1]
                  .querySelector('p')
                  .innerText.slice(2)
                  .split('获赞');
                // 获取评论
                let commentList = [
                  ...document.querySelector(COMMENT_LIST_SELECTOR).children,
                ];
                // 获取对应数量为止
                if (typeof commentLimitLen !== 'undefined') {
                  while (
                    commentList.length < commentLimitLen &&
                    !commentList.at(-1).innerText.includes('没有')
                  ) {
                    window.scrollBy({ left: 0, top: 2 * window.innerHeight });
                    await new Promise((res) => setTimeout(() => res(), 600));
                    commentList = [
                      ...document.querySelector(COMMENT_LIST_SELECTOR).children,
                    ];
                  }
                  commentList = commentList.slice(0, commentLimitLen);
                }

                commentList.splice(-1, 1);
                console.log(commentList);
                commentList = commentList.map((el) => {
                  const userInfoEl = el.querySelector('div:nth-child(2)');
                  if (!userInfoEl) return {};
                  const userName = userInfoEl.querySelector('a').innerText;
                  const userLike =
                    userInfoEl.querySelector('.jtyFqENC').innerText;
                  const activeTime =
                    userInfoEl.querySelector('.L4ozKLf7').innerText;
                  const comment = userInfoEl.querySelector('p').innerText;
                  const createDate =
                    userInfoEl.querySelector('.L4ozKLf7').innerText;
                  const userLink = userInfoEl.querySelector('a').href;
                  return {
                    userName,
                    userLike,
                    activeTime,
                    comment,
                    createDate,
                    userLink,
                  };
                });
                console.log('fasdf1');
                console.log(commentList);

                // await new Promise((res) => setTimeout(() => res(), 50000));

                return {
                  src: videoSrc,
                  user: {
                    fans,
                    like,
                    src: userSrc,
                    name: userName,
                  },
                  commentList,
                };
              },
              VIDEO_SRC_SELECTOR,
              USER_INFO_LIST_SELECTOR,
              COMMENT_LIST_SELECTOR,
              commentLimitLen,
              STRINGNUM,
            );
            // console.log('src, user: ', src, user);
            console.log('111过滤前的个数', commentList.length);
            // console.log(commentList);
            // 根据用户名是否含有好物关键字过滤，评论过滤
            commentList = commentList.filter(({ userName, userLike }) => {
              const isBusinessUser = IS_BUSINESS_USER(userName);
              if (isBusinessUser && IS_CONSUMER_TYPE(userType)) return false;
              if (!isBusinessUser && IS_BUSINESS_TYPE(userType)) return false;
              // 找消费粉，当前评论的点赞小于5
              if (STRING_TO_NUM_FUN(userLike) > 5 && IS_CONSUMER_TYPE(userType))
                return false;
              return true;
              // 活跃评论时间1h内
              // if (
              //   !activeTime.includes('分钟') &&
              //   userType === 'consumer'
              // ) {
              //   return null;
              // }
            });
            item.src = src;
            Object.assign(item, user);
            console.log(
              '222根据用户名是否含有好物关键字过滤，评论过滤，还剩个数',
              commentList.length,
            );
            // console.log(commentList);
            await limitExec(async (comment) => {
              const videoPage = await browser.newPage();
              try {
                const { userLink } = comment;
                await videoPage.goto(userLink, TIME_OUT);
                // 获取用户
                await videoPage.waitForSelector('.Nu66P_ba', TIME_OUT);
                const userInfo = await videoPage.evaluate(
                  async (userType, STRINGNUM) => {
                    let StringToNum = new Function(STRINGNUM);
                    let StringToNumFun = new StringToNum();
                    // 获取前6条标题
                    let videoList = [
                      ...(
                        document.querySelector(
                          '.mwo84cvf>div:last-child [data-e2e="scroll-list"]',
                        ) || { children: [] }
                      ).children,
                    ];

                    if (videoList.length <= 0) return null;
                    videoList = videoList.slice(0, 6);
                    const videoTitles = videoList.map((v) => v.innerText || '');
                    const firstVideoSrc = videoList
                      .filter((e) => !e.innerText.includes('置顶'))[0]
                      .querySelector('a').href;
                    const secondVideoSrc = videoList
                      .filter((e) => !e.innerText.includes('置顶'))[1]
                      .querySelector('a').href;
                    const thirdVideoSrc = videoList
                      .filter((e) => !e.innerText.includes('置顶'))[2]
                      .querySelector('a').href;
                    const gender = (age =
                      (document.querySelector('.N4QS6RJT') || {}).innerText ||
                      '');
                    if (gender.includes('男')) return { errMsg: '男，不考虑' };
                    const [follow, fans, like] = [
                      ...(document.querySelectorAll('.TxoC9G6_') || [{}]),
                    ].map((v) => StringToNumFun.eval(v.innerText));
                    if (fans > 550 && userType === 'consumer')
                      return { errMsg: '消费粉粉丝数大于550，不考虑' };
                    if (like > 1050 && userType === 'consumer')
                      return { errMsg: '消费粉点赞数大于1050，不考虑' };
                    return {
                      gender,
                      age,
                      follow,
                      fans,
                      like,
                      videoTitles,
                      firstVideoSrc,
                      secondVideoSrc,
                      thirdVideoSrc,
                    };
                  },
                  userType,
                  STRINGNUM,
                );
                if (userInfo) {
                  Object.assign(comment, userInfo);
                }
                videoPage.close();
              } catch (error) {
                videoPage.close();
                console.log('error: ---', error);
              }
            }, commentList);
            if (commentList) {
              item.commentList = commentList.filter(
                (v) => v.videoTitles && v.videoTitles.length > 0 && !v.errMsg,
              );
            }
            item.src = src;
            item.user = user;
          }
          // const src = await videoPage.$eval(videoSelect, (source) => {
          //   return source.src;
          // });
        } catch (error) {
          console.log('获取评论报错----', error);
        }
        videoPage.close();
      },
      myFavorateVideos.slice(0, 1),
      1,
    );
    const [_, partPath] = createDownloadPath(downloadFilename);

    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../../downloadFiles${partPath}/dataSource-${moment().format(
          'HH:mm:ss',
        )}.json`,
      ),
      JSON.stringify(myFavorateVideos),
    );

    await browser.close();
    return myFavorateVideos;
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_searchUsers;
