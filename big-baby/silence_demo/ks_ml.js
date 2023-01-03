const { pageBrowser, writeFile } = require("../utils/utils");
const {
  getKeyboardHref,
  getSrc,
  downFile,
} = require("../utils/ks_puppeteerUtils");
/**
npm run ks_ml ks
 */
const argv = process.argv;
let fileName = argv[2];

(async () => {
  const { page, browser } = await pageBrowser();
  const videoSrcArr = [
    {
      // src:'https://v.kuaishou.com/G4dnGG'
      // https://v.kuaishou.com/EuMBNX 
      src:'https://v.m.chenzhongtech.com/fw/photo/3xe52gp57x5xmn9?fid=3188729394&cc=share_copylink&followRefer=151&shareMethod=TOKEN&docId=9&kpn=KUAISHOU&subBiz=BROWSE_SLIDE_PHOTO&photoId=3xe52gp57x5xmn9&shareId=17269364818337&shareToken=X-1ArVMkGN9lc1fz&shareResourceType=PHOTO_OTHER&userId=3x6a5xeygyq6u8i&shareType=1&et=1_i%2F2005655397093248977_scn0&shareMode=APP&originShareId=17269364818337&appType=1&shareObjectId=5218546154735228586&shareUrlOpened=0&timestamp=1671673084076'
      // src: "https://v1.kwaicdn.com/upic/2022/12/05/22/BMjAyMjEyMDUyMjUxMDlfMjA3ODEwNDA1MV85MDQzMjg5OTY4NV8yXzM=_b_Bffcedbd718fb9990a3392e942e51aec9.mp4?pkey=AAUgM34UxZlC0mOJRcVy8WpSdjVPUBvEG7g80MU9VpdgVGVq4Eg82LaeZ5JaIXYjB9mcHDkH2FO_fEYroe7EhAzhKNxH_i76oK6pThCbavLmSN2FdLX_7BE9V5KHFmyUF40&tag=1-1671331153-unknown-0-4uqymvumsv-7c6a37a51526a4b6&clientCacheKey=3xxei8qh8ujbys9_b.mp4&di=JAmKHo_EwFB9prTs3V62CQ==&bp=10004&tt=b&ss=vp",
    },
  ]; //await getSrc(page, url);
  writeFile(fileName, videoSrcArr);
  await downFile(videoSrcArr);
  browser.close();
})();
