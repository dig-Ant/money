const path = require('path');
const qs = require('qs');
const { limitExec } = require('../../utils/common');
const fs = require('fs');
const moment = require('moment');
const { delay, getToday } = require('../../utils/index');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const { downFile, createDownloadPath } = puppeteerUtils;
const { commentList } = require('../../utils/commentList');
const feature_like = async function (params = {}) {
  const {
    url = 'https://www.douyin.com/user/MS4wLjABAAAA0zWieAn78LZo2nyh-QqNf7cWI0oJK3r3UmJq6LLtxpA',
    limitLen = 1,
    commentLimitLen = 100,
    type = '',
    isLogin = true,
  } = params;

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_like',
    devtools: true,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });

  // 打开列表页
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
    // 获取列表数据
    const resultsSelector = '[data-e2e="scroll-list"] li a';
    await page.waitForSelector(resultsSelector);
    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen) => {
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
          const href = el.href;
          const [like, title = ''] = el.innerText.split('\n\n');
          return {
            href,
            title,
            filename: `${like}-${title?.split(' ')?.[0] || '无标题'}`,
          };
        });
        console.log(eleList);
        debugger;
        return eleList;
      },
      resultsSelector,
      limitLen,
    );
    console.log('dataSource' + dataSource);
    for (i = 0; i < dataSource.length; i++) {
      try {
        const newPage = await browser.newPage();
        // await newPage.setViewport({ width: 1080, height: 800 });
        await newPage.goto(dataSource[i].href);
        // 检测到有视频为止
        await newPage.waitForSelector('.xg-video-container video source');
        //类名 点赞kr4MM4DQ 有红心的NILc2fGS
        // await newPage.click('.kr4MM4DQ:nth-child(1):not(.NILc2fGS)');
        await delay(3000);
        await newPage.click('.public-DraftStyleDefault-block');

        await delay(1000);
        await newPage.keyboard.type(commentList[i]);
        await delay(5000);
        await newPage.keyboard.press('Enter'); // 回车
        await delay(3000);
        newPage.close();
      } catch (error) {
        console.log('点赞可能失败', error);
      }
    }

    await browser.close();
    return dataSource;
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_like;
