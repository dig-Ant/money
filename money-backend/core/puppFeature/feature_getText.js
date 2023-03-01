const puppeteerUtils = require('../../utils/puppeteerUtils');
const {
  MY_USER_LINK,
  TIME_OUT,
  GET_URL,
  VIDEO_LIST_SELECTOR,
} = require('../../utils/constance');

const feature_getText = async function (params = {}) {
  let {
    url = MY_USER_LINK,
    limitLen = 1,
    type = '',
    isLogin = false,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_getText',
    devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });

  // 打开点赞列表页
  try {
    url = GET_URL(url, type);
    console.log('url: ', url);
    await page.goto(url, TIME_OUT);
  } catch (error) {
    console.log('列表页打开失败', error);
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }

  try {
    // 获取点赞列表数据
    const resultsSelector = '[data-e2e="scroll-list"] li a .__0w4MvO';
    await page.waitForSelector(resultsSelector, TIME_OUT);
    await page.waitForSelector(VIDEO_LIST_SELECTOR, TIME_OUT);

    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen, VIDEO_LIST_SELECTOR) => {
        let eleList = [...document.querySelectorAll(resultsSelector)];
        // 获取对应数量为止
        if (typeof limitLen !== 'undefined') {
          while (
            eleList.length < limitLen &&
            !document
              .querySelector('[data-e2e="user-post-list"] .kwodhZJl')
              .innerText.includes('没有') //'暂时没有更多了'
          ) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
          }
          eleList = eleList.slice(0, limitLen);
        }
        let hrefList = [...document.querySelectorAll(VIDEO_LIST_SELECTOR)].map(
          (e) => e.href,
        );
        eleList = eleList.map((el, i) => {
          const [title = ''] = el.innerText.split('\n\n');
          return {
            title,
            href: hrefList[i],
            // filename: `${title?.split(' ')?.[0] || '无标题'}`,
          };
        });
        return eleList;
      },
      resultsSelector,
      limitLen,
      VIDEO_LIST_SELECTOR,
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
