const { pageBrowser, writeFile } = require("../utils/utils");
const {
  getKeyboardHref,
  getSrc,
  downFile,
} = require("../utils/puppeteerUtils");
/**
npm run link "https://v.douyin.com/hAdsWhd/"
 */
const argv = process.argv;
let url = argv[2];
let fileName = argv[3];

(async () => {
  const { page, browser } = await pageBrowser();
  const videoArr = [url];
  const videoSrcArr = await getSrc(page, videoArr);
  writeFile(fileName, videoSrcArr);
  await downFile(videoSrcArr);
  browser.close();
})();
