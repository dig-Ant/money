const puppeteer = require('puppeteer');
const path = require('path');
const puppeteerUtils = require('../utils/puppeteerUtils');

const { downFile } = puppeteerUtils;

// 抖音收藏列表下载抖音无损视频资源
const feature_downloadVideo = async function () {
  const urls = this.urls;
  const limitLen = this.limitLen;
  if (urls.length <= 0 || !Array.isArray(urls)) {
    return null;
  }
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: path.resolve(__dirname, '../tmp/myChromeSession'),
    // 解决视频等文件不支持 调用系统内的chrome浏览器
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    defaultViewport: { width: 1080, height: 900 },
    devtools: true,
    // args: ["--window-size=1920,1080", "--window-position=1921,0"]
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 800,
    // , deviceScaleFactor: 1
  });
  const httpResponse = await page.goto(urls[0]);
  const resultsSelector = '[data-e2e="scroll-list"] li a';
  await page.waitForSelector(resultsSelector);
  // await page.click(resultsSelector);
  // const href = await page.$$eval(resultsSelector, (res) => {
  //   return res.map((e) => e.href).slice(0, 3);
  // });
  const dataSource = await page.evaluate(
    (resultsSelector, limitLen) => {
      let eleList = [...document.querySelectorAll(resultsSelector)];
      if (typeof limitLen !== 'undefined') {
        eleList = eleList.slice(0, limitLen);
      }
      eleList = eleList.map((el) => {
        const href = el.href;
        const [like, title] = el.innerText.split('\n\n');
        return {
          href,
          like,
          title,
          filename: `${like}-${title.split(' ')[0]}`,
        };
      });
      return eleList;
    },
    resultsSelector,
    limitLen,
  );
  //  获取无水印 src
  for (let i = 0; i < dataSource.length; i++) {
    const { href } = dataSource[i];
    const videoPage = await browser.newPage();
    await videoPage.goto(href);
    const videoSelect = '.xg-video-container video source';
    await videoPage.waitForSelector(videoSelect);
    const src = await videoPage.$eval(videoSelect, (source) => {
      return source.src;
    });
    dataSource[i].src = src;
    videoPage.close();
  }
  console.log('datasource', dataSource);
  await downFile(dataSource);
  await browser.close();
};

class Pupp {
  constructor(props = {}) {
    this.urls = props.urls || [];
  }
  async start() {
    await feature_downloadVideo.call(this);
  }
}

module.exports = Pupp;
