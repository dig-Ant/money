const { limitExec } = require('../../utils/common');
const { delay, getToday } = require('../../utils/index');

// TODO 给用户点赞
const feature_userLike = async function (params) {
  // limitExec(async () => {

  // },list,1)
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_userLike',
    devtools: false,
  });
  try {
    const { list = [], limitLen = 1 } = params || {};
    console.log('list: ', list);
    for (i = 0; i < list.length; i++) {
      const { userInfo } = list[i];
      const { firstVideoSrc } = userInfo || {};
      //firstVideoSrc
      if (firstVideoSrc) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          await newPage.goto(firstVideoSrc);
          // 检测到有视频为止
          await newPage.waitForSelector('.xg-video-container video source');
          //类名 点赞kr4MM4DQ 有红心的NILc2fGS
          await newPage.click('.kr4MM4DQ:nth-child(1):not(.NILc2fGS)');
          await delay(1000);
          newPage.close();
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
    }
    await browser.close();
    return { code: 0, data: {} };
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_userLike