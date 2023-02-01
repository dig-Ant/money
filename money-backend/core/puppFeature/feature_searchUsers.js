const path = require('path');
const qs = require('qs');
const { limitExec } = require('../../utils/common');
const fs = require('fs');
const moment = require('moment');
const { delay, getToday } = require('../../utils/index');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const { downFile, createDownloadPath } = puppeteerUtils;

const feature_searchUsers = async function (params = {}) {
  const {
    url = 'https://www.douyin.com/user/MS4wLjABAAAA0zWieAn78LZo2nyh-QqNf7cWI0oJK3r3UmJq6LLtxpA',
    limitLen = 1,
    commentLimitLen = 100,
    downloadFilename = '',
    type = '',
    isLogin = false,
    userType = 'consumer', // business同行 consumer用户 aged大龄粉
  } = params;

  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_searchUsers',
    devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });

  // 1.打开我的主页里，喜欢/收藏的列表页
  let query = qs.stringify({ showTab: type }, { arrayFormat: 'repeat' });
  try {
    if (url.includes('showTab')) {
      await page.goto(url);
    } else {
      const gotoUrl = url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
      await page.goto(gotoUrl);
    }
    console.log('主页打开成功');
  } catch (error) {
    console.log('主页打开失败', error);
    await browser.close();
    return { code: -1, errorMsg: '主页打开失败' };
  }

  // 2.获取我的主页里，喜欢/收藏的列表页的数据
  try {
    const resultsSelector = '[data-e2e="scroll-list"] li a';
    await page.waitForSelector(resultsSelector);
    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen, userType) => {
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

        let eleList = [...document.querySelectorAll(resultsSelector)];
        // 获取到对应数量的视频为止
        if (typeof limitLen !== 'undefined') {
          while (eleList.length < limitLen) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
          }
          eleList = eleList.slice(0, limitLen);
        }
        eleList = eleList.map((el) => {
          const href = el.href;
          const [like, title = ''] = el.innerText.split('\n\n');
          return {
            userType,
            href,
            like,
            likeNum: stringToNum(like),
            title,
            filename: `${like}-${title?.split(' ')?.[0] || '无标题'}`,
          };
        });
        return eleList;
      },
      resultsSelector,
      limitLen,
      userType,
    );
    // 按照点赞排序 高->低
    dataSource.sort((a, b) => {
      return b.likeNum - a.likeNum;
    });
    console.log('dataSource: ', dataSource);

    //  获取评论 src
    await limitExec(
      async (item, i) => {
        const { href } = item;
        const videoPage = await browser.newPage();
        await videoPage.goto(href);
        try {
          if (href.includes('video')) {
            const videoSelect = '.xg-video-container video source';
            const userSelect = '[data-e2e="user-info"]';
            const commentSelect = '[data-e2e="comment-list"]';
            await videoPage.waitForSelector(videoSelect, {
              timeout: 5000,
            });
            const { src, user, commentList } = await videoPage.evaluate(
              async (
                videoSelect,
                userSelect,
                commentSelect,
                commentLimitLen,
                userType,
              ) => {
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
                videoSrc = document.querySelector(videoSelect).src;
                const user = document.querySelector(userSelect);
                const userSrc = user.children[1].querySelector('a').innerText;
                const userName = user.children[1].querySelector('a').innerText;
                const [fans, like] = user.children[1]
                  .querySelector('p')
                  .innerText.slice(2)
                  .split('获赞');
                // 获取评论
                let commentList = [
                  ...document.querySelector(commentSelect).children,
                ];
                // 获取对应数量为止
                if (typeof commentLimitLen !== 'undefined') {
                  while (
                    commentList.length < commentLimitLen &&
                    !commentList.at(-1).innerText.includes('没有')
                  ) {
                    window.scrollBy({ left: 0, top: 2 * window.innerHeight });
                    await new Promise((res) => setTimeout(() => res(), 600));
                    commentList = [
                      ...document.querySelector(commentSelect).children,
                    ];
                  }
                  commentList = commentList.slice(0, commentLimitLen);
                }

                let commentRes = [];
                commentList.splice(-1, 1);
                console.log('commentList: ', commentList);
                commentList.forEach((el) => {
                  console.log(el);
                  const userInfoEl = el.querySelector('div:nth-child(2)');
                  // console.log('userInfoEl: ', userInfoEl);
                  if (userInfoEl) {
                    const userName = userInfoEl.querySelector('a').innerText;
                    // 用户名不带关键字
                    const filterName = [
                      '好物',
                      '分享',
                      '优选',
                      '严选',
                      '寻宝',
                      '百货',
                      '推荐',
                      '精选',
                      '优品',
                      '宝藏',
                      '搭建',
                      '宝贝',
                      '生活',
                    ].some((val) => {
                      return userName.includes(val);
                      // return userType === 'consumer'
                      //   ? userName.includes(val)
                      //   : !userName.includes(val);
                    });
                    if (filterName && userType === 'consumer') {
                      return null;
                    }
                    if (!filterName && userType === 'business') {
                      return null;
                    }
                    // 点赞小于5
                    const userLike =
                      userInfoEl.querySelector('.jtyFqENC').innerText;
                    // 活跃评论时间1h内
                    const activeTime =
                      userInfoEl.querySelector('.L4ozKLf7').innerText;

                    if (stringToNum(userLike) > 5 && userType === 'consumer') {
                      return null;
                    }
                    console.log(activeTime);
                    // if (
                    //   !activeTime.includes('分钟') &&
                    //   userType === 'consumer'
                    // ) {
                    //   return null;
                    // }

                    const userCm = userInfoEl.querySelector('p').innerText;
                    const createDate =
                      userInfoEl.querySelector('.L4ozKLf7').innerText;
                    const userLink = userInfoEl.querySelector('a').href;
                    commentRes.push({
                      comment: userCm,
                      userName,
                      userLike,
                      activeTime,
                      userLink,
                      createDate,
                    });
                  }
                });
                // await new Promise((res) => setTimeout(() => res(), 50000));

                return {
                  src: videoSrc,
                  user: {
                    fans,
                    like,
                    src: userSrc,
                    name: userName,
                  },
                  commentList: commentRes,
                };
              },
              videoSelect,
              userSelect,
              commentSelect,
              commentLimitLen,
              userType,
            );
            await limitExec(
              async (comment) => {
                const videoPage = await browser.newPage();
                try {
                  const { userLink } = comment;
                  await videoPage.goto(userLink);
                  // 获取用户
                  await videoPage.waitForSelector('.Nu66P_ba');
                  const userInfo = await videoPage.evaluate(
                    async (userType) => {
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
                      // 获取前6条标题

                      let videoList = [
                        ...(
                          document.querySelector(
                            '.mwo84cvf>div:last-child [data-e2e="scroll-list"]',
                          ) || { children: [] }
                        ).children,
                      ];

                      if (videoList.length <= 0) {
                        return null;
                      }
                      videoList = videoList.slice(0, 6);
                      const videoTitles = videoList.map((v) => v.innerText);
                      const firstVideoSrc = videoList
                        .filter((e) => !e.innerText.includes('置顶'))[0]
                        .querySelector('a').href;
                      const secondVideoSrc = videoList
                        .filter((e) => !e.innerText.includes('置顶'))[1]
                        .querySelector('a').href;
                      const thirdVideoSrc = videoList
                        .filter((e) => !e.innerText.includes('置顶'))[2]
                        .querySelector('a').href;
                      const age = (document.querySelector('.N4QS6RJT') || {})
                        .innerText;
                      const gender = document.querySelector('.N4QS6RJT');
                      if (!gender && userType !== 'business') {
                        return null;
                      }
                      const [follow, fans, like] = [
                        ...(document.querySelectorAll('.TxoC9G6_') || [{}]),
                      ].map((v) => stringToNum(v.innerText));
                      console.log(fans, userType, gender);
                      if (fans > 550 && userType === 'consumer') {
                        return null;
                      }
                      if (like > 1050 && userType === 'consumer') {
                        return null;
                      }
                      return {
                        gender: gender ? '女' : '未知',
                        age,
                        follow,
                        fans,
                        like,
                        videoTitles,
                        firstVideoSrc,
                        secondVideoSrc,
                        thirdVideoSrc,
                      };
                    },
                    userType,
                  );
                  if (userInfo) {
                    comment.userInfo = userInfo;
                  }
                  videoPage.close();
                } catch (error) {
                  videoPage.close();
                  console.log('error: ---', error);
                }
              },
              commentList,
              5,
            );
            if (commentList) {
              item.commentList = commentList.filter((v) => {
                return v.userInfo;
              });
            }
            item.src = src;
            item.user = user;
          } else {
            await videoPage.waitForSelector('.o7y5Jors', {
              timeout: 5000,
            });
            const videoSelect = '.xg-video-container video source';
            const userSelect = '[data-e2e="user-info"]';
            const commentSelect = '[data-e2e="comment-list"]';
            await videoPage.waitForSelector(videoSelect, {
              timeout: 5000,
            });
            const { src, user, commentList } = await videoPage.evaluate(
              async (
                videoSelect,
                userSelect,
                commentSelect,
                commentLimitLen,
                userType,
              ) => {
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
                const user = document.querySelector(userSelect);
                const userSrc = user.children[1].querySelector('a').innerText;
                const userName = user.children[1].querySelector('a').innerText;
                const [fans, like] = user.children[1]
                  .querySelector('p')
                  .innerText.slice(2)
                  .split('获赞');
                // 获取评论
                let commentList = [
                  ...document.querySelector(commentSelect).children,
                ];
                // 获取对应数量为止
                if (typeof commentLimitLen !== 'undefined') {
                  while (
                    commentList.length < commentLimitLen &&
                    !commentList.at(-1).innerText.includes('没有')
                  ) {
                    window.scrollBy({ left: 0, top: 2 * window.innerHeight });
                    await new Promise((res) => setTimeout(() => res(), 600));
                    commentList = [
                      ...document.querySelector(commentSelect).children,
                    ];
                  }
                  commentList = commentList.slice(0, commentLimitLen);
                }

                let commentRes = [];
                commentList.splice(-1, 1);
                console.log('commentList: ', commentList);
                commentList.forEach((el) => {
                  console.log(el);
                  const userInfoEl = el.querySelector('div:nth-child(2)');
                  // console.log('userInfoEl: ', userInfoEl);
                  if (userInfoEl) {
                    const userName = userInfoEl.querySelector('a').innerText;
                    // 用户名不带关键字
                    const filterName = [
                      '好物',
                      '分享',
                      '优选',
                      '严选',
                      '寻宝',
                      '百货',
                      '推荐',
                      '精选',
                      '优品',
                      '宝藏',
                      '搭建',
                      '宝贝',
                      '生活',
                    ].some((val) => {
                      return userName.includes(val);
                      // return userType === 'consumer'
                      //   ? userName.includes(val)
                      //   : !userName.includes(val);
                    });
                    if (filterName && userType === 'consumer') {
                      return null;
                    }
                    if (!filterName && userType === 'business') {
                      return null;
                    }
                    // 点赞小于5
                    const userLike =
                      userInfoEl.querySelector('.jtyFqENC').innerText;
                    // 活跃评论时间1h内
                    const activeTime =
                      userInfoEl.querySelector('.L4ozKLf7').innerText;

                    if (stringToNum(userLike) > 5 && userType === 'consumer') {
                      return null;
                    }
                    console.log(activeTime);
                    if (
                      !activeTime.includes('分钟') &&
                      userType === 'consumer'
                    ) {
                      return null;
                    }

                    const userCm = userInfoEl.querySelector('p').innerText;
                    const createDate =
                      userInfoEl.querySelector('.L4ozKLf7').innerText;
                    const userLink = userInfoEl.querySelector('a').href;
                    commentRes.push({
                      comment: userCm,
                      userName,
                      userLike,
                      activeTime,
                      userLink,
                      createDate,
                    });
                  }
                });
                // await new Promise((res) => setTimeout(() => res(), 50000));

                return {
                  user: {
                    fans,
                    like,
                    src: userSrc,
                    name: userName,
                  },
                  commentList: commentRes,
                };
              },
              videoSelect,
              userSelect,
              commentSelect,
              commentLimitLen,
              userType,
            );
            await limitExec(
              async (comment) => {
                const videoPage = await browser.newPage();
                try {
                  const { userLink } = comment;
                  await videoPage.goto(userLink);
                  // 获取用户
                  await videoPage.waitForSelector('.Nu66P_ba');
                  const userInfo = await videoPage.evaluate(
                    async (userType) => {
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
                      // 获取前6条标题
                      let videoList = [
                        ...(
                          document.querySelector(
                            '.mwo84cvf>div:last-child [data-e2e="scroll-list"]',
                          ) || { children: [] }
                        ).children,
                      ];

                      if (videoList.length <= 0) {
                        return null;
                      }
                      videoList = videoList.slice(0, 6);
                      const videoTitles = videoList.map((v) => v.innerText);
                      const firstVideoSrc = videoList
                        .filter((e) => !e.innerText.includes('置顶'))[0]
                        .querySelector('a').href;
                      const secondVideoSrc = videoList
                        .filter((e) => !e.innerText.includes('置顶'))[1]
                        .querySelector('a').href;
                      const thirdVideoSrc = videoList
                        .filter((e) => !e.innerText.includes('置顶'))[2]
                        .querySelector('a').href;
                      const age = (document.querySelector('.N4QS6RJT') || {})
                        .innerText;
                      const gender = document.querySelector('.N4QS6RJT');
                      if (!gender && userType !== 'business') {
                        return null;
                      }
                      const [follow, fans, like] = [
                        ...(document.querySelectorAll('.TxoC9G6_') || [{}]),
                      ].map((v) => stringToNum(v.innerText));
                      console.log(fans, userType, gender);
                      if (fans > 550 && userType === 'consumer') {
                        return null;
                      }
                      if (like > 1050 && userType === 'consumer') {
                        return null;
                      }
                      return {
                        gender: gender ? '女' : '未知',
                        age,
                        follow,
                        fans,
                        like,
                        videoTitles,
                        firstVideoSrc,
                        secondVideoSrc,
                        thirdVideoSrc,
                      };
                    },
                    userType,
                  );
                  if (userInfo) {
                    comment.userInfo = userInfo;
                  }
                  videoPage.close();
                } catch (error) {
                  videoPage.close();
                  console.log('error: ---', error);
                }
              },
              commentList,
              5,
            );
            if (commentList) {
              item.commentList = commentList.filter((v) => {
                return v.userInfo;
              });
            }
            item.src = src;
            item.user = user;
          }
          // const src = await videoPage.$eval(videoSelect, (source) => {
          //   return source.src;
          // });
        } catch (error) {
          console.log('获取评论报错----', error);
        }
        videoPage.close();
      },
      dataSource,
      5,
    );
    const [_, partPath] = createDownloadPath(downloadFilename);

    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../../downloadFiles${partPath}/dataSource-${moment().format(
          'HH:mm:ss',
        )}.json`,
      ),
      JSON.stringify(dataSource),
    );

    await browser.close();
    return dataSource;
  } catch (error) {
    console.log('error: ', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_searchUsers;
