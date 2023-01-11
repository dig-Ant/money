const { limitExec } = require('../../utils/common');
const { delay, getToday } = require('../../utils/index');

// TODO 给用户点赞
const feature_userLike = async function (params) {
  // limitExec(async () => {

  // },list,1)
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_userLike',
    devtools: false,
  });
  try {
    const { list = [], limitLen = 1 } = params || {};
    console.log('list: ', list);
    let commentList = [
      '好划算，爱了爱了[比心][比心]',
      '真划算👍',
      '好喜欢 好稀罕[比心][比心]',
      '物流很快！！👍',
      '好划算！👍👍',
      '哇，这个真不错！！价位又这么合适👍！👍👍',
      '这价位好划算～👍',
      '太划算了这价格👍👍',
      '性价比很高👍',
      '哇哦，性价比很高👍',
      '已入手[比心]',
      '太喜欢了 爱了爱了[比心]',
      '你推荐的产品从来都没让我失望过，家里必备',
      '我太需要这个了！！！',
      '我要给我闺蜜也安排上。她最喜欢这种东西了。',
      '这个我买了 好用',
      '非常方便，随时随地都可以用',
      '太好用了，会回购',
      '哇塞 这个超级好用 ',
      '就需要这个',
      '被妈妈反向安利的，太好用了！',
      '回购好多次了',
      '家里的刚好用完了 回购！[比心]',

      '好划算，爱了爱了[比心][比心]',
      '真划算👍',
      '好喜欢 好稀罕[比心][比心]',
      '物流很快！！👍',
      '好划算！👍👍',
      '哇，这个真不错！！价位又这么合适👍！👍👍',
      '这价位好划算～👍',
      '太划算了这价格👍👍',
      '性价比很高👍',
      '哇哦，性价比很高👍',
      '已入手[比心]',
      '太喜欢了 爱了爱了[比心]',
      '你推荐的产品从来都没让我失望过，家里必备',
      '好划算，爱了爱了[比心][比心]',
      '真划算👍',
      '好喜欢 好稀罕[比心][比心]',
      '物流很快！！👍',
      '好划算！👍👍',
      '哇，这个真不错！！价位又这么合适👍！👍👍',
      '这价位好划算～👍',
      '太划算了这价格👍👍',
      '性价比很高👍',
      '哇哦，性价比很高👍',
      '已入手[比心]',
      '太喜欢了 爱了爱了[比心]',
      '你推荐的产品从来都没让我失望过，家里必备',
    ];
    for (i = 0; i < list.length; i++) {
      const { userInfo } = list[i];
      const { firstVideoSrc } = userInfo || {};
      //firstVideoSrc
      if (firstVideoSrc) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          await newPage.goto(firstVideoSrc);
          // 检测到有视频为止
          await newPage.waitForSelector('.xg-video-container video source');
          //类名 点赞kr4MM4DQ 有红心的NILc2fGS
          await newPage.click('.kr4MM4DQ:nth-child(1):not(.NILc2fGS)');
          await newPage.click('.public-DraftStyleDefault-block');
          // await newPage.keyboard.down('Control')
          // await newPage.keyboard.press('V')
          // await newPage.keyboard.up('Control')
          // await delay(7000);// data-text
          await newPage.keyboard.type(commentList[i]);
          await delay(12000);
          await newPage.keyboard.press('Enter'); // 回车

          newPage.close();
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
    }
    await browser.close();
    return { code: 0, data: {} };
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_userLike;
