const {
  GET_COMMENT1,
  GET_COMMENT2,
  COMMENT_LIST_SELECTOR,
} = require('../../utils/constance');
const { limitExec } = require('../../utils/common');
const { delay, getToday } = require('../../utils/index');

const feature_userLike = async function (params) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_userLike',
    devtools: false,
  });
  try {
    const { list = [], userType } = params || {};
    console.log('userType: ', userType);
    // console.log('list: ', list);

    for (i = 0; i < list.length; i++) {
      // const { userInfo } = list[i];
      const { firstVideoSrc, secondVideoSrc, thirdVideoSrc } = list[i] || {};
      console.log('firstVideoSrc: ', firstVideoSrc);
      if (firstVideoSrc && firstVideoSrc.includes('video')) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          await newPage.goto(firstVideoSrc);
          // 检测到有视频为止
          await newPage.waitForSelector('.xg-video-container video source');
          //类名 点赞kr4MM4DQ 有红心的NILc2fGS
          await newPage.click('.kr4MM4DQ:nth-child(1)>div:nth-child(1)');
          await delay(3000);
          await newPage.click('.public-DraftStyleDefault-block');

          // await newPage.keyboard.down('Z');
          // await newPage.keyboard.up('Z');
          // await newPage.keyboard.down('Control')
          // await newPage.keyboard.press('V')
          // await newPage.keyboard.up('Control')
          // await delay(7000);// data-text
          await delay(1000);
          await newPage.keyboard.type(GET_COMMENT1(userType));
          await delay(5000);
          await newPage.keyboard.press('Enter'); // 回车
          await delay(3000);
          newPage.close();
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
    }
    for (i = 0; i < list.length; i++) {
      // const { userInfo } = list[i];
      const { firstVideoSrc, secondVideoSrc, thirdVideoSrc } = list[i] || {};
      if (secondVideoSrc && secondVideoSrc.includes('video')) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          await newPage.goto(secondVideoSrc);
          // 检测到有视频为止
          await newPage.waitForSelector('.xg-video-container video source');

          // 获取评论区用户的信息
          let { hasQin } = await videoPage.evaluate(
            async (COMMENT_LIST_SELECTOR) => {
              let commentList = [
                ...document.querySelector(COMMENT_LIST_SELECTOR).children,
              ];
              while (
                commentList.length < commentLimitLen &&
                !commentList.at(-1).innerText.includes('没有')
              ) {
                window.scrollBy({ left: 0, top: 2 * window.innerHeight });
                await new Promise((res) => setTimeout(() => res(), 600));
                commentList = [
                  ...document.querySelector(COMMENT_LIST_SELECTOR).children,
                ];
              }
              commentList.splice(-1, 1);
              hasQin = commentList.find((el) => {
                const userInfoEl = el.querySelector('div:nth-child(2)');
                if (!userInfoEl) return false;
                const isQin =
                  userInfoEl.querySelector('a').innerText == '琴琴好物';
                return isQin;
              });
              return hasQin;
            },
            VIDEO_SRC_SELECTOR,
            USER_INFO_LIST_SELECTOR,
            COMMENT_LIST_SELECTOR,
            commentLimitLen,
            STRINGNUM,
          );
          //类名 点赞kr4MM4DQ 有红心的NILc2fGS
          await newPage.click('.kr4MM4DQ:nth-child(1):not(.NILc2fGS)');
          await delay(3000);
          await newPage.click('.public-DraftStyleDefault-block');

          // await newPage.keyboard.down('Z');
          // await newPage.keyboard.up('Z');
          // await newPage.keyboard.down('Control')
          // await newPage.keyboard.press('V')
          // await newPage.keyboard.up('Control')
          // await delay(7000);// data-text
          await delay(1000);
          await newPage.keyboard.type(GET_COMMENT2(userType));
          await delay(5000);
          await newPage.keyboard.press('Enter'); // 回车
          await delay(3000);
          newPage.close();
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
    }
    await browser.close();
    return { code: 0, data: {} };
  } catch (error) {
    console.log('error: 123', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_userLike;
