const { TIME_OUT } = require('../../utils/constance');
const { delay } = require('../../utils/index');

const feature_scan = async function (params = {}) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_scan',
    devtools: false,
  });
  try {
    const list = params.list || [];
    for (i = 0; i < list.length; i++) {
      const { firstVideoSrc, videoTitles } = list[i] || {};
      if (firstVideoSrc && firstVideoSrc.includes('video')) {
        try {
          await page.goto(firstVideoSrc, TIME_OUT);
          await page.waitForSelector(
            '.xg-video-container video source',
            TIME_OUT,
          );
          console.log('i: ', i);
          console.log('videoTitles: ', videoTitles[0]);
        } catch (error) {
          console.log('失败', error);
        }
      }
    }
    await browser.close();
    return { code: 0, data: {} };
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_scan;
