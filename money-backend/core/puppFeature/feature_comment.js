const { limitExec } = require('../../utils/common');
const { TIME_OUT } = require('../../utils/constance');
const { delay, getToday } = require('../../utils/index');

// TODO 搜索列表功能
const feature_comment = async function (params = {}) {
  const { keyword, limitLen, isLogin = false } = params;
  console.log(keyword);
  if (!keyword) {
    throw new Error('link 必填');
  }
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_comment',
    devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });
  try {
    await page.goto(keyword, TIME_OUT);
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }
  // 获取列表数据
  const resultsSelector =
    '.tMWlo89q .BOJBWh64 .comment-mainContent[data-e2e="comment-list"] div[data-e2e="comment-item"]';
  await page.waitForSelector(`${resultsSelector} a`, TIME_OUT);
  // [...document.querySelectorAll('[data-e2e="comment-list"]>li>div')]
  try {
    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen) => {
        let eleList = [...document.querySelectorAll(resultsSelector)];
        if (typeof limitLen !== 'undefined') {
          while (
            eleList.length < limitLen &&
            ![...document.querySelector('[data-e2e="comment-list"]').children]
              .at(-1)
              .innerText.includes('没有')
          ) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
          }
          eleList = eleList.slice(0, limitLen);
        }
        eleList = eleList.map((el, i) => {
          const payload = {};
          payload.user = el.querySelector(
            '.comment-item-info-wrap .Nu66P_ba',
          ).innerText;
          payload.userLink = el.querySelector('.B3AsdZT9').href;
          payload.content = el.querySelector(
            '.RHiEl2d8 .a9uirtCT .Nu66P_ba',
          ).innerText;
          payload.time = el.querySelector('.L4ozKLf7').innerText;
          payload.like = el.querySelector('.eJuDTubq').innerText;
          return payload;
        });
        return eleList;
      },
      resultsSelector,
      limitLen,
    );
    // await downFile(dataSource);
    await browser.close();
    return dataSource;
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};
module.exports = feature_comment;
