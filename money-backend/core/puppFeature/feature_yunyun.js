const qs = require('qs');
const { limitExec } = require('../../utils/common');
const {
  INIT_VIEWPORT,
  STRINGNUM,
  MY_USER_LINK,
  TIME_OUT,
} = require('../../utils/constance');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const { downFile, createDownloadPath } = puppeteerUtils;

const feature_yunyun = async function (params) {
  const {
    url = MY_USER_LINK,
    limitStart,
    limitEnd,
    downloadFilename = '',
    type = '',
  } = params || {};

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_yunyun',
  });

  await page.setViewport(INIT_VIEWPORT);

  try {
    url = GET_URL(url, type);
    await page.goto(url, TIME_OUT);
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }

  try {
    // 获取列表数据
    const resultsSelector =
      '.mwo84cvf>div:last-child [data-e2e="scroll-list"] li a';
    // const resultsSelector = '[data-e2e="scroll-list"] li a';
    await page.waitForSelector(resultsSelector, TIME_OUT);

    const myFavorateVideos = await page.evaluate(
      async (resultsSelector, limitStart, limitEnd, STRINGNUM) => {
        let StringToNum = new Function(STRINGNUM);
        let StringToNumFun = new StringToNum();

        let eleList = [...document.querySelectorAll(resultsSelector)];
        // 获取对应数量为止
        if (
          typeof limitStart !== 'undefined' &&
          typeof limitEnd !== 'undefined'
        ) {
          while (eleList.length < limitEnd) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
          }
          eleList = eleList.slice(limitStart, limitEnd);
        }
        eleList = eleList.map((el) => {
          const href = el.href;
          const [like, title = ''] = el.innerText.split('\n\n');
          return {
            href,
            userlike: like,
            userlikeNum: StringToNumFun.eval(like),
            title,
            // filename: `${like}-${title.split(' ')[0]}`,
          };
        });
        return eleList;
      },
      resultsSelector,
      limitStart,
      limitEnd,
      STRINGNUM,
    );
    console.log('myFavorateVideos: ');
    console.log(myFavorateVideos);
    // 获取用户主页信息
    await limitExec(async (item) => {
      const { href } = item;
      const videoPage = await browser.newPage();
      try {
        await videoPage.goto(href, TIME_OUT);
        const userSelect = '[data-e2e="user-info"]';
        let userInfo = {};
        if (href.includes('video')) {
          const videoSelect = '.xg-video-container video source';
          await videoPage.waitForSelector(videoSelect, TIME_OUT);
          userInfo = await videoPage.evaluate(
            (videoSelect, userSelect, STRINGNUM) => {
              let StringToNum = new Function(STRINGNUM);
              let StringToNumFun = new StringToNum();
              const videoSrc = document.querySelector(videoSelect).src;
              const time = document.querySelector('.aQoncqRg').innerText;
              const user = document.querySelector(userSelect);
              const userSrc = user.children[1].querySelector('a').href;
              const userName = user.children[1].querySelector('a').innerText;
              const [fans, like] = user.children[1]
                .querySelector('p')
                .innerText.slice(2)
                .split('获赞');
              return {
                videoSrc,
                time,
                fans,
                like,
                likeNum: StringToNumFun.eval(like),
                userSrc,
                userName,
              };
            },
            videoSelect,
            userSelect,
            STRINGNUM,
          );
        } else if (href.includes('note')) {
          userInfo = await videoPage.evaluate(
            (userSelect, STRINGNUM) => {
              let StringToNum = new Function(STRINGNUM);
              let StringToNumFun = new StringToNum();
              const time = document.querySelector('.giPD3AqJ').innerText;
              const user = document.querySelector(userSelect);
              const userSrc = user.children[1].querySelector('a').href;
              const userName = user.children[1].querySelector('a').innerText;
              let [fans, like] = user.children[1]
                .querySelector('p')
                .innerText.slice(2)
                .split('获赞');
              like = like.replace('图文\n', '');
              return {
                // videoSrc,
                time,
                fans,
                like,
                likeNum: StringToNumFun.eval(like),
                userSrc,
                userName,
              };
            },
            userSelect,
            STRINGNUM,
          );
        }
        Object.assign(item, userInfo);
      } catch (error) {
        console.log('获取无水印视频报错----', error);
      }
      videoPage.close();
    }, myFavorateVideos);

    // await downFile(myFavorateVideos, {
    //   pathname: downloadFilename,
    // });
    await browser.close();
    // console.log(myFavorateVideos);
    return myFavorateVideos;
  } catch (error) {
    console.log('error:--- ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_yunyun;
