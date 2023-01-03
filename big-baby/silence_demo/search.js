const { pageBrowser, writeFile } = require("../utils/utils");
const {
  getKeyboardHref,
  getSrc,
  downFile,
} = require("../utils/puppeteerUtils");
/**
npm run search "清洁刷"
 */
const argv = process.argv;
let searchText = argv[2];

(async () => {
  const { page, browser } = await pageBrowser();
  const videoArr = await getKeyboardHref(page, searchText);
  const videoSrcArr = await getSrc(page, videoArr);
  writeFile(searchText, videoSrcArr);
  await downFile(videoSrcArr);
  browser.close();
})();
