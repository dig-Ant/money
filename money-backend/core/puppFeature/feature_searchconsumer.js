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
  SVG_FILTER,
  FILTER_FANS_LIKE,
  FILTER_BUSINESS,
  TO_NUM,
  LESS_40,
  FILTER_AGE,
  FILTER_ACTIVE_TIME,
} = require('../../utils/constance');
const { createDownloadPath } = puppeteerUtils;
const feature_searchconsumer = async function (params = {}) {
  let {
    userURL = MY_USER_LINK,
    index = 0,
    commentLimitLen = LIMIT,
    downloadFilename = '',
    type = '',
    isLogin = false,
    myVideo = '',
    browser,
    page,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

  try {
    if (!(myVideo.href || '').includes('video'))
      return { code: -1, errorMsg: '不是video' };
    // myVideo.likeNum = STRING_TO_NUM_FUN(myVideo.like);
    const videoPage = await browser.newPage();
    await videoPage.goto(myVideo.href, TIME_OUT);
    await videoPage.waitForSelector(VIDEO_SRC_SELECTOR, TIME_OUT);
    // 3.获取myVideo评论区下的用户信息
    let { fans, like, name, time, title, commentList } =
      await videoPage.evaluate(
        async (
          USER_INFO_LIST_SELECTOR,
          COMMENT_LIST_SELECTOR,
          commentLimitLen,
        ) => {
          const user = document.querySelector(USER_INFO_LIST_SELECTOR);
          const name = user.children[1].querySelector('a').innerText;
          const time = document.querySelector('.aQoncqRg').innerText;
          const title = document.title;
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
            const userImgSrc = (el.querySelector('.PbpHcHqa') || {}).src || '';
            if (!userInfoEl) return {};
            return {
              userImgSrc,
              //https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-i-0813_e1ebac7151274d35b2d6f8d3b3dd7f33~c5_300x300.jpeg?from=2956013662
              //https://p3-pc.douyinpic.com/img/aweme-avatar/tos-cn-i-0813_e1ebac7151274d35b2d6f8d3b3dd7f33.jpeg?from=2956013662
              userImg: userImgSrc
                .replace('aweme/100x100', 'img')
                .replace('.jpeg', '~c5_300x300.jpeg'),
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
            time,
            title,
            commentList,
          };
        },
        USER_INFO_LIST_SELECTOR,
        COMMENT_LIST_SELECTOR,
        commentLimitLen,
      );
    console.log('======过滤前有', commentList.length + '个');
    commentList = NOT_MATE(commentList);
    commentList = NOT_REPEAT(commentList);
    commentList = LESS_FIVE(commentList);
    commentList = FILTER_BUSINESS(commentList).commentList;
    console.log('=======过滤男/重复/好物/点赞高于5', commentList.length);
    commentList = FILTER_ACTIVE_TIME(commentList);
    console.log('=======过滤30min外的', commentList.length);

    // 去页面获取详细的commentList
    const userPage = await browser.newPage();
    await limitExec(
      async (comment) => {
        try {
          console.log(comment);
          await userPage.goto(comment.userLink, TIME_OUT);
          await userPage.waitForSelector('.Nu66P_ba', TIME_OUT);
          // await userPage.waitForSelector('.N4QS6RJT', TIME_OUT);
          const userInfo = await userPage.evaluate(async () => {
            try {
              // 1.过滤男和粉丝点赞多的
              const svgHtml =
                (document.querySelector('.N4QS6RJT') || {}).innerHTML || '';
              const gender =
                (document.querySelector('.N4QS6RJT') || {}).innerText || '';
              let age = '';
              if (gender) {
                const match = gender.match(/(\d+)岁/);
                if (match) age = match[1];
              }
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
                  !e.innerText.includes('图文') &&
                  !e.innerText.includes('置顶'),
              );
              if (videoList.length <= 0)
                return {
                  ip,
                  gender,
                  age,
                  svgHtml,
                  follow,
                  fans,
                  like,
                  type: '关注',
                };
              videoList = videoList.slice(0, 6);
              const videoTitles = videoList.map((v) => v.innerText || '');
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
          // userPage.close();
        } catch (error) {
          // userPage.close();
          console.log('error: ---', error);
        }
      },
      commentList,
      1,
    );
    // console.log(commentList);
    // commentList = SVG_FILTER(commentList);
    // console.log('==========根据svg过滤男', commentList.length);
    // commentList = FILTER_AGE(commentList);
    // commentList = LESS_40(commentList);
    // console.log('==========根据gender过滤年龄大于40的', commentList.length);
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
    const followList = commentList.filter((v) => v.type == '关注');
    // console.log(commentList.map(e=>e.));
    commentList = commentList.filter(
      (v) => v.videoTitles && v.videoTitles.length > 0,
    );
    // 2.符合的，一部分放在db1 一部分放在db2
    Object.assign(myVideo, {
      fans,
      like,
      name,
      time,
      title,
      commentList,
      followList,
      businessList,
    });
    userPage.close();
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

module.exports = feature_searchconsumer;
