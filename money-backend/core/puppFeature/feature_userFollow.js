const Datastore = require('nedb');
const path = require('path');
const { TIME_OUT, INIT_VIEWPORT } = require('../../utils/constance');
const { limitExec } = require('../../utils/common');
const { delay, getToday } = require('../../utils/index');

const feature_userFollow = async function (params) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_userFollow',
    devtools: true,
  });
  await page.setViewport(INIT_VIEWPORT);
  const { list = [], userType } = params || {};
  let i = 0;
  while (i < list.length) {
    const item = list[i];
    const newPage = await browser.newPage();
    try {
      await newPage.goto(item.userLink, TIME_OUT);
      console.log(`主页打开成功！}`);
    } catch (error) {
      console.log(`${item.userName}--主页打开失败${error}`);
    }
    try {
      const followSelect = '[data-e2e="user-info-follow-btn"]';
      await newPage.waitForSelector(followSelect, TIME_OUT);
      const status = await newPage.evaluate(async (followSelect) => {
        let followBtn = document.querySelector(followSelect);
        followBtn.click();
        return followBtn.innerText;
      }, followSelect);
      // await newPage.click(followSelect);
      await delay(1000);
      const db = new Datastore({
        filename: path.resolve(__dirname, `../../db/followUsers.json`),
        autoload: true,
        timestampData: true,
      });
      Object.assign(item, { status });
      db.insert(item, (err, docs) => {
        if (err) {
          console.log(`用户${item.userName}db存入失败` + err);
        } else {
          console.log(`用户${item.userName}db存入成功` + err);
        }
      });
    } catch (error) {
      console.log(`${item.userName}--关注可能失败${error}`);
    }
    i++;
    await delay(3000);
    newPage.close();
  }
  try {
    await browser.close();
    return { code: 0, data: {} };
  } catch (error) {
    console.log('error: 123', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_userFollow;
