const path = require('path');
const qs = require('qs');
const { limitExec } = require('../../utils/common');
const fs = require('fs');
const moment = require('moment');
const { delay, getToday } = require('../../utils/index');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const {
  GET_COMMENT1,
  GET_COMMENT2,
  INIT_VIEWPORT,
  STRINGNUM,
} = require('../../utils/constance');
const { downFile, createDownloadPath } = puppeteerUtils;

const feature_liveusers = async function (params = {}) {
  const {
    // 9- #在抖音，记录美好生活#【歌霓丝服饰】正在直播，来和我一起支持Ta吧。复制下方链接，打开【抖音】，直接观看直播！ https://v.douyin.com/BkSBbc1/
    // 生活#【长沙甜甜园长呀🥰】正在直播，来和我一起支持Ta吧。复制下方链接，打开【抖音】，直接观看直播！ https://v.douyin.com/Bk94pCH/ https://live.douyin.com/216666217971?room_id=7196290829210618624
    url = 'https://live.douyin.com/216666217971?room_id=7196290829210618624',
    limitLen = 1,
    commentLimitLen = 100,
    type = '',
    isLogin = true,
  } = params;
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_liveusers',
    devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 780, height: 1000 });
  //   await page.setViewport(INIT_VIEWPORT);
  try {
    await page.goto(url);
  } catch (error) {
    console.log('直播页打开失败', error);
    await browser.close();
    return { code: -1, errorMsg: '直播页打开失败' };
  }

  try {
    // 获取列表数据
    const resultsSelector =
      '#audiencePanelScrollId .lazyload-wrapper:nth-child(1) .xVcgegQm.jDfuWYRH';
    await page.waitForSelector('[data-e2e="basicPlayer"]');
    await page.waitForSelector(resultsSelector);
    // await page.mouse.move(27, 77);
    // await page.mouse.wheel({ deltaY: -500 });
    await page.evaluate(async () => {
      document
        .querySelector('.hWQYk3Pc')
        .scrollBy({ left: 0, top: 1 * window.innerHeight });
    });
    await delay(2000);
    let { x, y, userListLen } = await page.evaluate(async () => {
      const rect = document.querySelector('.k3ybpzRL').getBoundingClientRect();
      let userListLen =
        document.querySelector('[data-e2e="live-room-audience"]').innerText - 0;
      console.log('rect: ', rect);
      console.log('userListLen: ', userListLen);

      document.querySelector('.webcast-chatroom').style.height = 0;
      return { x: rect.x, y: rect.y, userListLen };
    });
    console.log(' x, y : ', x, y);
    let index = 4;
    let commentList = [];
    while (index <= 100) {
      try {
        await page.evaluate(async () => {
          document.querySelector('.webcast-chatroom').style.height = 0;
        });
        await page.mouse.move(x + 27, y + 43 + 48 * 3);
        await page.mouse.wheel({ deltaY: 48 });
        await delay(200);

        await page.click(
          '#audiencePanelScrollId >.lazyload-wrapper:nth-child(' + index + ')',
        );
        await delay(1000);
        // await page.waitForSelector('#portal .Omt7Tqr_');
        const { name, guanzhu, fans, other2, other1 } = await page.evaluate(
          async () => {
            let [name, other] = document
              .querySelector('#portal #user_popup')
              .innerText.split('关注');
            let [guanzhu, other1] = other.split('粉丝');
            let [fans, other2] = other1.split(/\n/);
            return {
              name: name.replace(/\s/g, ''),
              guanzhu: guanzhu.replace(/\s/g, ''),
              fans: fans.replace(/\s/g, ''),
              other2,
              other1,
            };
          },
        );
        console.log(
          'name, guanzhu, fans, other2, other1: ',
          name,
          guanzhu,
          fans,
          other2,
          other1,
        );
        if (guanzhu < 1000 && fans < 500 && name !== '琴琴好物') {
          await page.waitForSelector('#portal .SllfYJTY button:nth-child(2)');
          await page.click('#portal .SllfYJTY button:nth-child(2)');
          await delay(1000);
          await page.click(
            '#audiencePanelScrollId >.lazyload-wrapper:nth-child(' +
              index +
              ')',
          );
          await delay(1000);
          userListLen = await page.evaluate(async () => {
            var list = document.querySelector('.k3ybpzRL').children;
            return list.length;
          });
          console.log('userListLen: ', userListLen);
          // console.log(await browser.pages());
          let pages = await browser.pages();
          let url = await pages[2].url();
          const videoPage = pages[2];
          await videoPage.waitForSelector('.Nu66P_ba');
          const userInfo = await videoPage.evaluate(async (STRINGNUM) => {
            let videoList = [
              ...(
                document.querySelector(
                  '.mwo84cvf>div:last-child [data-e2e="scroll-list"]',
                ) || { children: [] }
              ).children,
            ];
            // console.log(videoList);
            // debugger;
            if (videoList.length <= 0) return {};
            videoList = videoList.slice(0, 6);
            let firstVideoSrc, secondVideoSrc, thirdVideoSrc;
            const videoTitles = videoList.map((v) => v.innerText);
            try {
              firstVideoSrc = videoList
                .filter((e) => !e.innerText.includes('置顶'))[0]
                .querySelector('a').href;
              secondVideoSrc = videoList
                .filter((e) => !e.innerText.includes('置顶'))[1]
                .querySelector('a').href;
              thirdVideoSrc = videoList
                .filter((e) => !e.innerText.includes('置顶'))[2]
                .querySelector('a').href;
            } catch (error) {}
            const age = (document.querySelector('.N4QS6RJT') || {}).innerText;
            return {
              age,
              videoTitles,
              firstVideoSrc,
              secondVideoSrc,
              thirdVideoSrc,
            };
          });
          await pages[2].close();
          const urlItem = {
            url,
            name,
            guanzhu,
            fans,
            desc: other2,
            other1,
            ...userInfo,
          };
          commentList.push(urlItem);
          console.log(urlItem);
          console.log(index);
        }

        index++;
      } catch (error) {
        index++;
        console.log('error: ', error);
      }
    }
    console.log('commentList', commentList);
    // page.click('#portal .SllfYJTY button:nth-child(2)');
    // page.click('#portal .erb1HJvb');
    // console.log(browser.pages());
    // const newPage = await newPagePromise;//声明一个newPage对象
    // let value = newPage.url(); //获取新页面的链接

    await browser.close();
    return { commentList, live: '', url };
  } catch (error) {
    console.log('error: ', error);
    // await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_liveusers;
