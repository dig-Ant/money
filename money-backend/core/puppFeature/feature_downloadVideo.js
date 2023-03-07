const { limitExec } = require('../../utils/common');
const {
  INIT_VIEWPORT,
  STRINGNUM,
  MY_USER_LINK,
  VIDEO_LIST_SELECTOR,
  GET_URL,
  TIME_OUT,
} = require('../../utils/constance');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const { downFile, createDownloadPath } = puppeteerUtils;

// TODO 抖音收藏列表下载抖音无损视频资源
const feature_downloadVideo = async function (params) {
  let {
    userURL = MY_USER_LINK,
    limitStart,
    limitEnd,
    downloadFilename = '',
    type = '',
  } = params || {};

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_downloadVideo',
    devtools: false,
  });
  await page.setViewport(INIT_VIEWPORT);
  // 打开列表页
  try {
    userURL = GET_URL(userURL, type);
    console.log('userURL: ', userURL);
    await page.goto(userURL, TIME_OUT);
    console.log('userURL: ', userURL);
  } catch (error) {
    console.log(error);
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }

  try {
    // 获取列表数据
    console.log('VIDEO_LIST_SELECTOR: ', VIDEO_LIST_SELECTOR);
    await page.waitForSelector(VIDEO_LIST_SELECTOR, TIME_OUT);
    console.log('VIDEO_LIST_SELECTOR: ', VIDEO_LIST_SELECTOR);
    let dataSource = await page.evaluate(
      async (VIDEO_LIST_SELECTOR, limitStart, limitEnd, STRINGNUM) => {
        let StringToNum = new Function(STRINGNUM);
        let StringToNumFun = new StringToNum();

        let eleList = [
          ...document.querySelectorAll('[data-e2e="scroll-list"] li a.chmb2GX8'),
        ];
        // 获取对应数量为止
        if (
          typeof limitStart !== 'undefined' &&
          typeof limitEnd !== 'undefined'
        ) {
          while (eleList.length < limitEnd) {
            // debugger
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [
              ...document.querySelectorAll('[data-e2e="scroll-list"] li a.chmb2GX8'),
            ];
          }
          eleList = eleList.slice(limitStart, limitEnd);
        }
        console.log(eleList);
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
      VIDEO_LIST_SELECTOR,
      limitStart,
      limitEnd,
      STRINGNUM,
    );
    console.log('dataSource');
    console.log(dataSource);
    // 按照点赞排序 高->低
    dataSource.sort((a, b) => {
      return b.like - a.like;
    });
    dataSource = dataSource.map((e, index) => {
      e.index = index + 1;
      return e;
    });

    //  获取无水印 src
    await limitExec(
      async (item, i) => {
        const { href } = item;
        if (href && href.includes('note')) return;
        const videoPage = await browser.newPage();
        try {
          console.log('href: ', href);
          await videoPage.goto(href, TIME_OUT);
          console.log('href: ', href);
          const videoSelect = '.xg-video-container video source';
          const userSelect = '[data-e2e="user-info"]';
          await videoPage.waitForSelector(videoSelect, TIME_OUT);
          // const src = await videoPage.$eval(videoSelect, (source) => {
          //   return source.src;
          // });

          const { src, likeNum, name, time } = await videoPage.evaluate(
            (videoSelect, userSelect, STRINGNUM) => {
              let StringToNum = new Function(STRINGNUM);
              let StringToNumFun = new StringToNum();
              const videoSrc = document.querySelector(videoSelect).src;
              const time = document.querySelector('.aQoncqRg').innerText;
              const user = document.querySelector(userSelect);
              const userName = user.children[1].querySelector('a').innerText;
              const [fans, like] = user.children[1]
                .querySelector('p')
                .innerText.slice(2)
                .split('获赞');
              return {
                src: videoSrc,
                time,
                likeNum: StringToNumFun.eval(like),
                name: `${userName}-${fans}粉-${like}赞`,
              };
            },
            videoSelect,
            userSelect,
            STRINGNUM,
          );
          console.log('src, likeNum, name, time: ', src, likeNum, name, time);
          // if(user){
          //   item.user = user.substring(1).split('· ')[0];
          //   item.createDate = user.substring(1).split('· ')[1];
          // }
          item.src = src;
          item.likeNum = likeNum;
          item.name = name;
          item.time = time;
          item.filename = `${name}-${item.like}-${item.title.split(' ')[0]}`;
        } catch (error) {
          console.log('获取无水印视频报错----', error);
        }
        videoPage.close();
      },
      dataSource,
      2,
    );
    console.log('dataSource: ', dataSource);
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

module.exports = feature_downloadVideo;
