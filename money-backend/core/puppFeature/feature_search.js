const { limitExec } = require('../../utils/common');
const { delay, getToday } = require('../../utils/index');

// TODO 搜索列表功能
const feature_search = async function (params = {}) {
  const { keyword, limitLen, isLogin = false } = params;
  if (!keyword) {
    throw new Error('keyword 搜索关键字 必填');
  }
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_search',
    devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });
  // 打开列表页 //publish_time=0&sort_type=1&source=tab_search&type=general
  const gotoUrl = `https://www.douyin.com/search/${encodeURIComponent(
    keyword,
  )}`;
  try {
    await page.goto(gotoUrl);
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }
  // 获取列表数据
  const resultsSelector =
    '[style="display:block"]>[data-e2e="scroll-list"]>li>div>div';
  await page.waitForSelector('[data-e2e="scroll-list"] li>div>div>div a');

  try {
    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen) => {
        let eleList = [...document.querySelectorAll(resultsSelector)];
        eleList = eleList.filter((el) => {
          return el.children && el.children.length >= 3;
        });
        // 获取对应数量为止
        if (typeof limitLen !== 'undefined') {
          while (eleList.length < limitLen) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
            eleList = eleList.filter((el) => {
              return el.children && el.children.length >= 3;
            });
          }
          eleList = eleList.slice(0, limitLen);
        }
        eleList = eleList.map((el, i) => {
          if (el.children && el.children.length < 3) {
            return {};
          }
          const payload = {};
          // 如果长度是2 没有标题
          if (el.children[0]) {
            const [user, createDate] = el.children[0].innerText.split('\n\n·');
            payload.user = user;
            payload.createDate = createDate;
          }
          if (el.children[0] && el.children[0].querySelector('a')) {
            payload.userLink = el.children[0].querySelector('a').href;
          }
          if (el.children[1]) {
            payload.title = el.children[1].innerText;
          }
          // TODO 未播放的搜索不到视频 只有图片
          // if (el.querySelector('video source')) {
          //   payload.videoSrc = el.querySelector('video source').src;
          //   console.log('payload:---- ', payload);
          // }
          if (el.querySelector('[data-rank] .positionBox>div')) {
            const [like, comment, share] = el
              .querySelector('[data-rank] .positionBox>div')
              .innerText.split('\n');
            payload.like = like;
            payload.comment = comment;
            payload.share = share;
          }
          payload.id = String(i);
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
