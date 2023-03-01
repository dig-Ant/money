const { TIME_OUT } = require('../../utils/constance');

// TODO 搜索列表功能
const feature_search = async function (params = {}) {
  const { keyword, limitLen, isLogin = true } = params;
  if (!keyword) {
    throw new Error('keyword 搜索关键字 必填');
  }
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_search',
    devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });
  // 打开列表页 //
  // `https://www.douyin.com/search/努力减肥?publish_time=0&sort_type=1&source=tab_search&type=video
  const gotoUrl = `https://www.douyin.com/search/${encodeURIComponent(
    keyword,
  )}?publish_time=0&sort_type=1&source=tab_search&type=video`;
  try {
    await page.goto(gotoUrl, TIME_OUT);
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }
  // 获取列表数据
  const resultsSelector =
    '.FtarROQM .J122YuOM div[style="display:block"]>[data-e2e="scroll-list"]>li>div';
  await page.waitForSelector(
    '.FtarROQM .J122YuOM div[style="display:block"]>[data-e2e="scroll-list"] li>div a',
    TIME_OUT,
  );
  // [...document.querySelectorAll('.FtarROQM .J122YuOM div[style="display:block"]>[data-e2e="scroll-list"]>li>div')]
  try {
    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen) => {
        let eleList = [...document.querySelectorAll(resultsSelector)];
        if (typeof limitLen !== 'undefined') {
          while (eleList.length < limitLen) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
          }
          eleList = eleList.slice(0, limitLen);
        }
        console.log(eleList);
        eleList = eleList.map((el, i) => {
          const payload = {};
          if (el.children[0]) {
            payload.userLink = el.children[0].href;
            payload.title = el.children[0].querySelector('.swoZuiEM').innerText;
            payload.like = el.children[0].querySelector('.IcU0dfgd').innerText;
            payload.user = el.children[0].querySelector('.OhTcPZd3').innerText;
            payload.createDate =
              el.children[0].querySelector('.bu9WFx2P').innerText;
          }
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
module.exports = feature_search;
