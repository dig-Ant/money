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
  LESS_40,
  FILTER_AGE,
} = require('../../utils/constance');
const { createDownloadPath } = puppeteerUtils;
const feature_getPageVideo = async function (params = {}) {
  let {
    userURL = MY_USER_LINK,
    index = 0,
    commentLimitLen = LIMIT,
    downloadFilename = '',
    type = '',
    isLogin = false,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_getPageVideo',
    devtools: false,
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
    await browser.close();
    return myVideo.href;
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_getPageVideo;
