const { pageBrowser, writeFile } = require("../utils/utils");
const {
  getHref,
  hrefClassMap,
  getSrc,
  downFile,
} = require("../utils/puppeteerUtils");
/**
npm run user "https://www.douyin.com/user/MS4wLjABAAAAWHKVcRzaBT0cB6Imk39ABPqsZTIHamZkcFDmrhRFt6s"  "乐林好物"
 */
const argv = process.argv;
let url = argv[2];
let userName = argv[3];

(async () => {
  const { page, browser } = await pageBrowser();
  const videoArr = await getHref(page, url, hrefClassMap["user"]);
  const videoSrcArr = await getSrc(page, videoArr.slice(3, 10));
  writeFile(userName, videoSrcArr);
  await downFile(videoSrcArr);
  browser.close();
})();
