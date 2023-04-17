const {
  GET_COMMENT1,
  GET_COMMENT2,
  COMMENT_LIST_SELECTOR,
  TIME_OUT,
  getDB,
  NOT_SVG_MATE,
} = require('../../utils/constance');
const { delay } = require('../../utils/index');

const feature_userLike = async function (params) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_userLike',
    devtools: false,
  });
  try {
    const { list = [], userType, _id, listType } = params || {};

    const newPage = await browser.newPage();
    for (i = 0; i < list.length; i++) {
      const { firstVideoSrc, userLink, secondVideoSrc, thirdVideoSrc } =
        list[i] || {};
      if (firstVideoSrc && firstVideoSrc.includes('video')) {
        try {
          await newPage.goto(firstVideoSrc, TIME_OUT);
          await newPage.waitForSelector(
            '.xg-video-container video source',
            TIME_OUT,
          );
          let hasQin = false;
          if (!hasQin) {
            await delay(3000);
            await newPage.keyboard.down('Z');
            await newPage.keyboard.up('Z');
            await delay(1000);
            await newPage.click('.public-DraftStyleDefault-block');
            // await newPage.keyboard.down('Control');
            // await newPage.keyboard.press('V');
            // await newPage.keyboard.up('Control');
            await delay(5000); // data-text
            console.log('第', i, '条', GET_COMMENT1(userType));
            await newPage.keyboard.type(GET_COMMENT1(userType));
            await delay(2000);
            await newPage.keyboard.press('Enter'); // 回车
            await delay(3000);
          }
          const db = getDB(userType);
          db.find({ _id }).exec((err, doc) => {
            const data = doc[0];
            let updateList = data[listType].map((e) => {
              if (list[i] && e.userLink === list[i].userLink) {
                console.log('e.userName: ', e.userName);
                e.isLiked = true;
              }
              return e;
            });
            db.update(
              { _id },
              {
                ...data,
                [listType]: updateList,
              },
              {},
              (err, numReplaced) => {
                console.log('err, numReplaced: ', err, numReplaced);
              },
            );
          });
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
    }
    if (userType == 'business') {
      for (i = 0; i < list.length; i++) {
        const { firstVideoSrc, secondVideoSrc, thirdVideoSrc } = list[i] || {};
        if (secondVideoSrc && secondVideoSrc.includes('video')) {
          try {
            // await newPage.setViewport({ width: 1080, height: 800 });
            await newPage.goto(secondVideoSrc, TIME_OUT);
            // 检测到有视频为止
            await newPage.waitForSelector(
              '.xg-video-container video source',
              TIME_OUT,
            );

            // 获取评论区用户的信息
            let hasQin = await newPage.evaluate(
              async (COMMENT_LIST_SELECTOR) => {
                let commentList = [
                  ...document.querySelector(COMMENT_LIST_SELECTOR).children,
                ];
                console.log(commentList.at(-1).innerText);
                while (
                  !commentList.at(-1).innerText.includes('暂无评论') &&
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
              COMMENT_LIST_SELECTOR,
            );
            if (!hasQin) {
              //类名 点赞kr4MM4DQ 有红心的NILc2fGS
              await delay(3000);

              await newPage.keyboard.down('Z');
              await newPage.keyboard.up('Z');
              await newPage.click('.public-DraftStyleDefault-block');
              // await newPage.keyboard.down('Control');
              // await newPage.keyboard.press('V');
              // await newPage.keyboard.up('Control');
              await delay(5000); // data-text
              await delay(1000);
              await newPage.keyboard.type(GET_COMMENT2(userType));
              await delay(2000);
              await newPage.keyboard.press('Enter'); // 回车
              await delay(3000);
            }
          } catch (error) {
            console.log('点赞可能失败', error);
          }
        }
      }
    }
    await newPage.close();
    await browser.close();
    return { code: 0, data: {} };
  } catch (error) {
    console.log('error: 123', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_userLike;
