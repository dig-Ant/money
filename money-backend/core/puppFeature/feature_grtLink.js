const { limitExec } = require('../../utils/common');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const { TIME_OUT } = require('../../utils/constance');
let linkList = require('../../downloadFiles/link');

const feature_grtLink = async function (params = {}) {
  try {
    console.log(linkList);
    const { browser, page } = await this.createBrowser({
      launchKey: 'feature_grtLink',
      devtools: true,
      userDataDir: undefined,
    });

    await page.setViewport({ width: 1080, height: 800 });
    let resLinkList = [];
    await limitExec(
      async (link) => {
        try {
          const videoPage = await browser.newPage();
          await videoPage.goto(link, TIME_OUT);
          await videoPage.waitForSelector('.Nu66P_ba', TIME_OUT);

          const url = await videoPage.url();
          // const title = await videoPage.title();
          console.log('link,url: ', link, url);
          // await videoPage.waitForSelector('.N4QS6RJT', TIME_OUT);
          const { username, desc } = await videoPage.evaluate(async () => {
            try {
              const [username, desc] = [
                ...document.querySelectorAll('.Nu66P_ba'),
              ].map((e) => (e || {}).innerText || '');
              //   const desc = document.querySelector('meta[name=description]');
              return { username, desc };
            } catch (error) {
              console.log(error);
              debugger;
            }
          });
          console.log(username);
          resLinkList.push({ value: url, label: username, desc });
          videoPage.close();
        } catch (error) {
          videoPage.close();
          console.log('error: ---', error);
          return { code: -1, errorMsg: error };
        }
      },
      linkList.map((e) => 'http' + e.split('http')[1]),
    );
    console.log(resLinkList);
    return { list: resLinkList };
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_grtLink;
