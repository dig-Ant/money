const {
  aged,
  business,
  consumer,
  girls,
  miss,
} = require('../../utils/comments');
const { limitExec } = require('../../utils/common');
const { delay, getToday } = require('../../utils/index');
let comments = consumer;

//  给用户点赞
const feature_userLike = async function (params) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_userLike',
    devtools: false,
  });
  try {
    const { list = [], userType } = params || {};
    // console.log('list: ', list);

    comments =
      userType === 'aged'
        ? aged
        : userType === 'consumer'
        ? consumer
        : business;
    console.log(comments);
    comments = miss;
    let commenti = -1;
    function getComment() {
      commenti++;
      if (commenti >= comments.length) {
        commenti = commenti % comments.length;
      }
      return comments[commenti];
    }
    for (i = 0; i < list.length; i++) {
      const { userInfo } = list[i];
      const { firstVideoSrc, secondVideoSrc, thirdVideoSrc } = userInfo || {};
      if (firstVideoSrc && firstVideoSrc.includes('video')) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          await newPage.goto(firstVideoSrc);
          // 检测到有视频为止
          await newPage.waitForSelector('.xg-video-container video source');
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
          await newPage.keyboard.type(getComment(i));
          await delay(5000);
          await newPage.keyboard.press('Enter'); // 回车
          await delay(3000);
          newPage.close();
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
      if (secondVideoSrc && secondVideoSrc.includes('video')) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          await newPage.goto(secondVideoSrc);
          // 检测到有视频为止
          await newPage.waitForSelector('.xg-video-container video source');
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
          await newPage.keyboard.type(getComment(i));
          await delay(5000);
          await newPage.keyboard.press('Enter'); // 回车
          await delay(3000);
          newPage.close();
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
      if (thirdVideoSrc && thirdVideoSrc.includes('video')) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          await newPage.goto(thirdVideoSrc);
          // 检测到有视频为止
          await newPage.waitForSelector('.xg-video-container video source');
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
          await newPage.keyboard.type(getComment(i));
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
