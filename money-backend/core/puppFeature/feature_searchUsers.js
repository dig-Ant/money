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
  IS_MATE,
} = require('../../utils/constance');
const { createDownloadPath } = puppeteerUtils;
const feature_searchUsers = async function (params = {}) {
  let {
    userURL = MY_USER_LINK,
    index = 0,
    commentLimitLen = LIMIT,
    downloadFilename = '',
    type = '',
    isLogin = true,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_searchUsers',
    devtools: true,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport(INIT_VIEWPORT);

  // 1.打开主页userURL
  try {
    userURL = GET_URL(userURL, type);
    await page.goto(userURL, TIME_OUT);
  } catch (error) {
    console.log('主页打开失败', error);
    await browser.close();
    return { code: -1, errorMsg: '主页打开失败' };
  }

  // 2.获取目标视频myVideo
  try {
    await page.waitForSelector(VIDEO_LIST_SELECTOR, TIME_OUT);
    const myVideo = await page.evaluate(
      async (VIDEO_LIST_SELECTOR, index, userType, STRINGNUM) => {
        let StringToNum = new Function(STRINGNUM);
        let StringToNumFun = new StringToNum();
        // 获取到对应数量的视频为止
        let ele = document.querySelectorAll(VIDEO_LIST_SELECTOR)[index];
        const [like, title = ''] = ele.innerText.split('\n\n');
        return {
          userType,
          href: ele.href,
          like,
          likeNum: StringToNumFun.eval(like),
          title,
          filename: `${like}-${title?.split(' ')?.[0] || '无标题'}`,
        };
      },
      VIDEO_LIST_SELECTOR,
      index,
      userType,
      STRINGNUM,
    );
    if (!myVideo.href.includes('video'))
      return { code: -1, errorMsg: '不是video' };
    const videoPage = await browser.newPage();
    await videoPage.goto(myVideo.href, TIME_OUT);
    await videoPage.waitForSelector(VIDEO_SRC_SELECTOR, TIME_OUT);
    // 3.获取myVideo评论区下的用户信息
    let { fans, like, name, commentList } = await videoPage.evaluate(
      async (
        USER_INFO_LIST_SELECTOR,
        COMMENT_LIST_SELECTOR,
        commentLimitLen,
      ) => {
        const user = document.querySelector(USER_INFO_LIST_SELECTOR);
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
        }
        commentList.splice(-1, 1);
        console.log(commentList);
        commentList = commentList.map((el) => {
          const userInfoEl = el.querySelector('div:nth-child(2)');
          if (!userInfoEl) return {};
          return {
            userName: userInfoEl.querySelector('a').innerText,
            userLink: userInfoEl.querySelector('a').href,
            userLike: userInfoEl.querySelector('.jtyFqENC').innerText,
            activeTime: userInfoEl.querySelector('.L4ozKLf7').innerText,
            comment: userInfoEl.querySelector('p').innerText,
          };
        });
        return {
          fans,
          like,
          name: userName,
          commentList,
        };
      },
      USER_INFO_LIST_SELECTOR,
      COMMENT_LIST_SELECTOR,
      commentLimitLen,
      STRINGNUM,
    );
    console.log('111过滤前的个数', commentList.length);
    // 根据用户名是否含有好物关键字过滤，评论过滤
    commentList = commentList.filter(({ userName, userLike }) => {
      const isMateUser = IS_MATE(userName);
      if (isMateUser) return false;
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
    // 去重
    let commitListRes = [];
    for (let i = 0; i < commentList.length; i++) {
      const commentItem = commentList[i];
      const has = commitListRes.find(
        (e) =>
          e.userLink === commentItem.userLink &&
          e.userName === commentItem.userName,
      );
      console.log(has);
      if (!has && commentItem.userName !== '琴琴好物') {
        commitListRes.push(commentItem);
        console.log(commitListRes);
      }
    }
    Object.assign(myVideo, { fans, like, name });
    console.log(
      '根据用户名是否含有好物关键字过滤，评论过滤，去重，还剩',
      commitListRes.length,
    );
    console.log(commitListRes);
    await limitExec(async (comment) => {
      try {
        const videoPage = await browser.newPage();
        await videoPage.goto(comment.userLink, TIME_OUT);
        await videoPage.waitForSelector('.Nu66P_ba', TIME_OUT);
        const userInfo = await videoPage.evaluate(
          async (userType, STRINGNUM) => {
            let StringToNum = new Function(STRINGNUM);
            let StringToNumFun = new StringToNum();
            try {
              // 1.过滤男和粉丝点赞多的
              const gender =
                (document.querySelector('.N4QS6RJT') || {}).innerText || '';
              const ip =
                (document.querySelector('.a83NyFJ4') || {}).innerText || '';
              const [follow, fans, like] = [
                ...(document.querySelectorAll('.TxoC9G6_') || [{}]),
              ].map((v) => StringToNumFun.eval(v.innerText));
              if (gender.includes('男')) return { errMsg: '男，不考虑' };
              if (fans > 550 && userType === 'consumer')
                return { errMsg: '消费粉粉丝数大于550，不考虑' };
              if (like > 1050 && userType === 'consumer')
                return { errMsg: '消费粉点赞数大于1050，不考虑' };
              // 2.符合的，一部分放在db1 一部分放在db2
              let videoList = [
                ...(
                  document.querySelector(
                    '.mwo84cvf>div:last-child [data-e2e="scroll-list"]',
                  ) || { children: [] }
                ).children,
              ].filter(
                (e) =>
                  !e.innerText.includes('图文') &&
                  !e.innerText.includes('置顶'),
              );
              if (videoList.length <= 0)
                return {
                  ip,
                  gender,
                  follow,
                  fans,
                  like,
                  type: '关注',
                };
              const videoTitles = videoList.map((v) => v.innerText || '');
              videoList = videoList.slice(0, 6);
              const firstVideoSrc = videoList[0].querySelector('a').href;
              const secondVideoSrc = videoList[1]
                ? videoList[1].querySelector('a').href
                : '';
              const thirdVideoSrc = videoList[2]
                ? videoList[2].querySelector('a').href
                : '';
              return {
                ip,
                gender,
                follow,
                fans,
                like,
                videoTitles,
                firstVideoSrc,
                secondVideoSrc,
                thirdVideoSrc,
              };
            } catch (error) {
              console.log(error);
              debugger;
            }
          },
          userType,
          STRINGNUM,
        );
        console.log(userInfo);
        if (userInfo) Object.assign(comment, userInfo);
        videoPage.close();
      } catch (error) {
        videoPage.close();
        console.log('error: ---', error);
      }
    }, commitListRes);
    if (commitListRes) {
      myVideo.commentList = commitListRes.filter(
        (v) => v.videoTitles && v.videoTitles.length > 0 && !v.errMsg,
      );
      myVideo.followList = commitListRes.filter((v) => v.type == '关注');
    }
    videoPage.close();
    const [_, partPath] = createDownloadPath(downloadFilename);

    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../../downloadFiles${partPath}/dataSource-${moment().format(
          'HH:mm:ss',
        )}.json`,
      ),
      JSON.stringify(myVideo),
    );

    await browser.close();
    return myVideo;
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_searchUsers;
