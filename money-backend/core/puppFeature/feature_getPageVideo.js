const puppeteerUtils = require('../../utils/puppeteerUtils');
const {
  MY_USER_LINK,
  VIDEO_LIST_SELECTOR,
  LIMIT,
  INIT_VIEWPORT,
  GET_URL,
  TIME_OUT,
} = require('../../utils/constance');
const feature_getPageVideo = async function (params = {}) {
  let {
    browser,
    page,
    userURL = MY_USER_LINK,
    index = 0,
    type = '',
    isLogin = false,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

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
    if (!myVideo.href.includes('video')) {
      await browser.close();
      return { code: -1, errorMsg: '不是video' };
    }
    return myVideo.href;
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_getPageVideo;
