const { pageBrowser, writeFile } = require("../utils/utils");
const { getMsg } = require("../utils/buyinUtils.js");

const argv = process.argv;
let fileName = argv[2];
let url = [
  "3588850576722643237",
  "3558998195382178132",
  "3588663513767383992",
  "3588842983337887842",
  "3554864499813152771",
  "3523699373018088560",
  "3582118498735923017",
  "3589205867213522729",
  "3589162571795674425",
  "3587326518323478156",
  "3585547725313338273",
  "3588865718680199739",
  "3589053748053448164",
  "3588643389765252054",
  "3588856211770101888",
  "3581272435183509718",
  "3587335151232917258",
  "3588688422103027710",
  "3580237947322162596",
  "3588062716528614099",
];
(async () => {
  const { page, browser } = await pageBrowser();
  const videoSrcArr = await getMsg(page, url);
  //   writeFile(fileName, videoSrcArr);
  //   await downFile(videoSrcArr);
  browser.close();
})();
