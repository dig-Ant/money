const qs = require('qs');
const { limitExec } = require('../../utils/common');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const { downProductmsg, createDownloadPath } = puppeteerUtils;

const feature_productmsg = async function (params) {
  const { url } = params || {};
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_productmsg',
  });
  await page.setViewport({ width: 1080, height: 800 });
  // 1.打开url用户主页
  try {
    await page.goto(url);
    console.log('用户主页打开成功');
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '用户主页打开失败' };
  }

  try {
    // 2.获取用户主页视频数据
    const resultsSelector =
      '.mwo84cvf>div:last-child [data-e2e="scroll-list"] li a';
    await page.waitForSelector(resultsSelector);
    const [user, eleList] = await page.evaluate(async (resultsSelector) => {
      const stringToNum = (data, type = true) => {
        let res = data;
        if (type) {
          if (res.includes('万')) {
            const [num] = res.split('万');
            return Number((+num * 10000).toFixed(0));
          } else {
            return Number(res);
          }
        }
      };
      let user = document.querySelector('.Nu66P_ba').innerText;
      let totalNum = document.querySelector('.J6IbfgzH').innerText - 0;
      totalNum = Math.min(1000, totalNum);
      let eleList = [...document.querySelectorAll(resultsSelector)];
      // (获取全部视频为止)
      while (eleList.length < totalNum) {
        window.scrollBy({ left: 0, top: 2 * window.innerHeight });
        await new Promise((res) => setTimeout(() => res(), 1000));
        eleList = [...document.querySelectorAll(resultsSelector)];
        if (
          document.querySelector(
            '.mwo84cvf>div:last-child [data-e2e="user-post-list"]>div:last-child',
          ).innerText == '暂时没有更多了'
        ) {
          break;
        }
      }
      console.log(eleList);
      // (获取结束)
      eleList = eleList
        .map((el) => {
          const href = el.href;
          const [like, title = ''] = el.innerText.split('\n\n');
          return {
            href,
            like,
            likeNum: stringToNum(like),
            title,
            // filename: `${like}-${title.split(' ')[0]}`,
          };
        })
        .sort((a, b) => {
          return b.likeNum - a.likeNum;
        });
      return [user, eleList];
    }, resultsSelector);
    console.log(eleList);
    await downProductmsg(eleList, {
      pathname: user,
      downloadPath: '../downloadFiles/账号作品信息'
    });
    await browser.close();
    return eleList;
  } catch (error) {
    console.log('error:--- ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_productmsg;
