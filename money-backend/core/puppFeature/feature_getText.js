const path = require('path');
const qs = require('qs');
const { limitExec } = require('../../utils/common');
const fs = require('fs');
const moment = require('moment');
const { delay, getToday } = require('../../utils/index');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const { MY_USER_LINK } = require('../../utils/constance');
const { downFile, createDownloadPath } = puppeteerUtils;

const feature_getText = async function (params = {}) {
  const {
    url = MY_USER_LINK,
    limitLen = 1,
    commentLimitLen = 100,
    downloadFilename = '',
    type = '',
    isLogin = true,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_getText',
    devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });

  // 打开点赞列表页
  let query = qs.stringify({ showTab: type }, { arrayFormat: 'repeat' });
  try {
    if (url.includes('showTab')) {
      await page.goto(url);
    } else {
      const gotoUrl = url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
      await page.goto(gotoUrl);
    }
  } catch (error) {
    console.log('列表页打开失败', error);
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }

  try {
    // 获取点赞列表数据
    const resultsSelector = '[data-e2e="scroll-list"] li a .__0w4MvO';
    await page.waitForSelector(resultsSelector);
    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen, userType) => {
        let eleList = [...document.querySelectorAll(resultsSelector)];
        // 获取对应数量为止
        if (typeof limitLen !== 'undefined') {
          while (eleList.length < limitLen) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
          }
          eleList = eleList.slice(0, limitLen);
        }
        eleList = eleList.map((el) => {
          const [title = ''] = el.innerText.split('\n\n');
          return {
            title,
            // filename: `${title?.split(' ')?.[0] || '无标题'}`,
          };
        });
        return eleList;
      },
      resultsSelector,
      limitLen,
      userType,
    );

    // fs.writeFileSync(
    //   path.resolve(
    //     __dirname,
    //     `../../downloadFiles${partPath}/dataSource-${moment().format(
    //       'HH:mm:ss',
    //     )}.json`,
    //   ),
    //   JSON.stringify(dataSource),
    // );

    await browser.close();
    return dataSource;
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_getText;
