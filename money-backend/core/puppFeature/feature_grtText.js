const { limitExec } = require('../../utils/common');
const { TIME_OUT, VIDEO_LIST_SELECTOR } = require('../../utils/constance');
const { downProductmsg } = require('../../utils/puppeteerUtils');

const feature_grtText = async function (params = {}) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_grtText',
    devtools: true,
    userDataDir: undefined,
  });
  try {
    let { urlList = [] } = params;
    console.log(urlList);
    await page.setViewport({ width: 1080, height: 800 });
    for (let i = 0; i < urlList.length; i++) {
      await page.goto(urlList[i].value, TIME_OUT);
      await page.waitForSelector('.Nu66P_ba', TIME_OUT);
      const postList = await page.evaluate(async (VIDEO_LIST_SELECTOR) => {
        let eleList = [
          ...document.querySelectorAll(
            '[data-e2e="scroll-list"] li a .__0w4MvO',
          ),
        ];
        let hrefList = [...document.querySelectorAll(VIDEO_LIST_SELECTOR)].map(
          (e) => e.href,
        );
        let likeList = [
          ...document.querySelectorAll(
            '[data-e2e="scroll-list"] li a.chmb2GX8 .jjKJTf4P',
          ),
        ].map((e) => e.innerText);
        console.log(hrefList);
        eleList = eleList.map((el, i) => {
          // const like = el.querySelector('.jjKJTf4P').innerText;
          const [title = ''] = el.innerText.split('\n\n');
          return {
            title,
            like: likeList[i],
            href: hrefList[i],
          };
        });
        return eleList;
      }, VIDEO_LIST_SELECTOR);
      await downProductmsg(postList, {
        pathname: urlList[i].label,
        downloadPath: '../utils/userPostText',
      });
      urlList[i].postList = postList;
    }
    await browser.close();
    return { list: urlList };
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_grtText;
