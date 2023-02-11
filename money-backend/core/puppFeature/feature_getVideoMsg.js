const {
  GET_COMMENT1,
  GET_COMMENT2,
  INIT_VIEWPORT,
  STRINGNUM,
} = require('../../utils/constance');
const { limitExec } = require('../../utils/common');
const { delay, getToday } = require('../../utils/index');
const feature_productmsg = require('./feature_productmsg');
const { downProductmsg } = require('../../utils/puppeteerUtils');

const feature_getVideoMsg = async function (params) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_getVideoMsg',
  });
  await page.setViewport(INIT_VIEWPORT);
  const { list = [], userType } = params || {};
  console.log('list: ', list);
  await limitExec(
    async (item) => {
      const { userLink } = item || {};
      console.log(userLink);
      try {
        await page.goto(userLink);
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
        const [user, eleList] = await page.evaluate(
          async (resultsSelector, STRINGNUM) => {
            let StringToNum = new Function(STRINGNUM);
            let StringToNumFun = new StringToNum();
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
                  likeNum: StringToNumFun.eval(like),
                  title,
                  // filename: `${like}-${title.split(' ')[0]}`,
                };
              })
              .sort((a, b) => b.likeNum - a.likeNum);
            return [user, eleList];
          },
          resultsSelector,
          STRINGNUM,
        );
        console.log(eleList);
        await downProductmsg(eleList, {
          pathname: user,
          downloadPath: '../downloadFiles/账号作品信息',
        });
        return { code: 0, eleList };
        await browser.close();
      } catch (error) {
        console.log('error:--- ', error);
        await browser.close();
        return { code: -1, errorMsg: error };
      }
    },
    list,
    1,
    // [list[3]],
  );
};

module.exports = feature_getVideoMsg;
