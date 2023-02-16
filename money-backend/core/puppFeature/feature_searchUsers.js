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
  NOT_REPEAT,
  LESS_FIVE,
  NOT_MATE,
  NOT_SVG_MATE,
  FILTER_FANS_LIKE,
  FILTER_BUSINESS,
  TO_NUM,
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
      async (VIDEO_LIST_SELECTOR, index) => {
        const ele = document.querySelectorAll(VIDEO_LIST_SELECTOR)[index];
        const [like, title = ''] = ele.innerText.split('\n\n');
        return {
          href: ele.href,
          like,
          title,
          filename: `${like}-${title?.split(' ')?.[0] || '无标题'}`,
        };
      },
      VIDEO_LIST_SELECTOR,
      index,
    );
    if (!myVideo.href.includes('video'))
      return { code: -1, errorMsg: '不是video' };
    // myVideo.likeNum = STRING_TO_NUM_FUN(myVideo.like);
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
        const name = user.children[1].querySelector('a').innerText;
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
          name,
          commentList,
        };
      },
      USER_INFO_LIST_SELECTOR,
      COMMENT_LIST_SELECTOR,
      commentLimitLen,
    );
    console.log('==========过滤前的个数', commentList.length);
    commentList = NOT_MATE(commentList);
    commentList = NOT_REPEAT(commentList);
    console.log('==========过滤男和重复', commentList.length);
    if (IS_CONSUMER_TYPE(userType)) {
      commentList = LESS_FIVE(commentList);
      console.log('==========找消费粉过滤点赞高于5的', commentList.length);
    }
    // 去页面获取详细的commentList
    await limitExec(async (comment) => {
      try {
        const videoPage = await browser.newPage();
        await videoPage.goto(comment.userLink, TIME_OUT);
        await videoPage.waitForSelector('.Nu66P_ba', TIME_OUT);
        const userInfo = await videoPage.evaluate(async () => {
          try {
            // 1.过滤男和粉丝点赞多的
            const svgHtml =
              (document.querySelector('.N4QS6RJT') || {}).innerHTML || '';
            const ip =
              (document.querySelector('.a83NyFJ4') || {}).innerText || '';
            const [follow, fans, like] = [
              ...(document.querySelectorAll('.TxoC9G6_') || [{}]),
            ].map((v) => v.innerText);
            let videoList = [
              ...(
                document.querySelector(
                  '.mwo84cvf>div:last-child [data-e2e="scroll-list"]',
                ) || { children: [] }
              ).children,
            ].filter(
              (e) =>
                !e.innerText.includes('图文') && !e.innerText.includes('置顶'),
            );
            if (videoList.length <= 0)
              return {
                ip,
                svgHtml,
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
              svgHtml,
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
        });
        if (userInfo) Object.assign(comment, userInfo);
        videoPage.close();
      } catch (error) {
        videoPage.close();
        console.log('error: ---', error);
      }
    }, commentList);
    console.log(commentList);
    commentList = NOT_SVG_MATE(commentList);
    console.log('==========根据svg过滤男', commentList.length);
    let sepeRes = FILTER_BUSINESS(commentList);
    commentList = sepeRes.commentList;
    let businessList = sepeRes.businessList;
    console.log('==========过滤同行', commentList.length);
    console.log('==========同行', businessList.length);
    commentList = TO_NUM(commentList);
    if (IS_CONSUMER_TYPE(userType)) {
      commentList = FILTER_FANS_LIKE(commentList);
      console.log('==========消费粉过滤粉丝和获赞数高的', commentList.length);
    }
    // 2.符合的，一部分放在db1 一部分放在db2
    Object.assign(myVideo, {
      fans,
      like,
      name,
      commentList: commentList.filter(
        (v) => v.videoTitles && v.videoTitles.length > 0 && !v.type == '关注',
      ),
      followList: commentList.filter((v) => v.type == '关注'),
      businessList,
    });

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
