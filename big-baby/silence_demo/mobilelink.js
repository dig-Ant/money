const { pageBrowser, writeFile } = require("../utils/utils");
const {
  getKeyboardHref,
  getSrc,
  downFile,
} = require("../utils/puppeteerUtils");
/**
npm run mobilelink 毛球修剪器
 */
const argv = process.argv;
let fileName = argv[2];

let url = [
  {
      "href": "https://www.douyin.com/video/7178864126213573888",
      "zan": 48000
  },
  {
      "href": "https://www.douyin.com/video/7173522283846176031",
      "zan": 24000
  },
  {
      "href": "https://www.douyin.com/video/7173916761106959623",
      "zan": "9129"
  },
  {
      "href": "https://www.douyin.com/video/7180192279666167096",
      "zan": "8202"
  },
  {
      "href": "https://www.douyin.com/video/7173423684063857951",
      "zan": "5822"
  },
  {
      "href": "https://www.douyin.com/video/7172433172485917987",
      "zan": "5515"
  },
  {
      "href": "https://www.douyin.com/video/7179434033674341690",
      "zan": "5077"
  },
  {
      "href": "https://www.douyin.com/video/7177689134188760320",
      "zan": "3954"
  },
  {
      "href": "https://www.douyin.com/video/7175302820361440547",
      "zan": "3749"
  },
  {
      "href": "https://www.douyin.com/video/7182487557106617604",
      "zan": "3489"
  },
  {
      "href": "https://www.douyin.com/video/7181968417774226725",
      "zan": "3072"
  },
  {
      "href": "https://www.douyin.com/video/7182113142070103299",
      "zan": "2963"
  },
  {
      "href": "https://www.douyin.com/video/7179787342750747908",
      "zan": "1776"
  },
  {
      "href": "https://www.douyin.com/video/7180963060394282272",
      "zan": "1567"
  },
  {
      "href": "https://www.douyin.com/video/7176770911402593596",
      "zan": "1321"
  },
  {
      "href": "https://www.douyin.com/video/7180336702286744871",
      "zan": "1281"
  },
  {
      "href": "https://www.douyin.com/video/7182110209274416421",
      "zan": "1014"
  },
  {
      "href": "https://www.douyin.com/video/7183669318201265460",
      "zan": "37"
  }
];
(async () => {
  const { page, browser } = await pageBrowser();
  const videoSrcArr = await getSrc(page, url);
  writeFile(fileName, videoSrcArr);
  await downFile(videoSrcArr);
  browser.close();
})();
