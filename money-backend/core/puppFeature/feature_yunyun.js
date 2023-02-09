const qs = require('qs');
const { limitExec } = require('../../utils/common');
const {
  INIT_VIEWPORT,
  STRINGNUM,
  MY_USER_LINK,
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
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }

  try {
    // 获取列表数据
    const resultsSelector =
      '.mwo84cvf>div:last-child [data-e2e="scroll-list"] li a';
    // const resultsSelector = '[data-e2e="scroll-list"] li a';
    await page.waitForSelector(resultsSelector);

    const dataSource = await page.evaluate(
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
            like,
            likeNum: StringToNumFun.eval(like),
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

    //  获取无水印 src
    await limitExec(async (item) => {
      const { href } = item;
      const videoPage = await browser.newPage();
      try {
        await videoPage.goto(href);
        const videoSelect = '.xg-video-container video source';
        const userSelect = '[data-e2e="user-info"]';
        await videoPage.waitForSelector(videoSelect, {
          timeout: 5000,
        });
        const { src, user, time } = await videoPage.evaluate(
          (videoSelect, userSelect, STRINGNUM) => {
            let StringToNum = new Function(STRINGNUM);
            let StringToNumFun = new StringToNum();
            const videoSrc = document.querySelector(videoSelect).src;
            const time = document.querySelector('.aQoncqRg').innerText;
            const user = document.querySelector(userSelect);
            const userSrc = user.children[1].querySelector('a').innerText;
            const userName = user.children[1].querySelector('a').innerText;
            const [fans, like] = user.children[1]
              .querySelector('p')
              .innerText.slice(2)
              .split('获赞');
            return {
              src: videoSrc,
              time,
              user: {
                fans,
                like,
                likeNum: StringToNumFun.eval(like),
                src: userSrc,
                name: userName,
              },
            };
          },
          videoSelect,
          userSelect,
          STRINGNUM,
        );

        // if(user){
        //   item.user = user.substring(1).split('· ')[0];
        //   item.createDate = user.substring(1).split('· ')[1];
        // }
        item.src = src;
        item.user = user;
        item.time = time;
        item.filename = `${user.name}-${item.like}-${item.title.split(' ')[0]}`;
      } catch (error) {
        console.log('获取无水印视频报错----', error);
      }
      videoPage.close();
    }, dataSource);

    await downFile(dataSource, {
      pathname: downloadFilename,
    });
    await browser.close();
    return dataSource;
  } catch (error) {
    console.log('error:--- ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_yunyun;
