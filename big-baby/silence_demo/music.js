const { pageBrowser, writeFile } = require("../utils/utils");
const {
  getHref,
  hrefClassMap,
  getSrc,
  downFile,
} = require("../utils/puppeteerUtils");
/**
npm run music 丸子头
 */
const argv = process.argv;
let fileName = argv[2];

const url = "https://www.douyin.com/music/7128724321131924231";
// const url = "https://www.douyin.com/music/7165712527098186533";
(async () => {
  const { page, browser } = await pageBrowser();

  const videoArr = await getHref(page, url, hrefClassMap["music"]);
  const videoSrcArr = await getSrc(page, videoArr);
  writeFile(fileName, videoSrcArr);
  await downFile(videoSrcArr);
  browser.close();
})();
