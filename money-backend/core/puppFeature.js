const puppeteer = require('puppeteer');
const path = require('path');
const puppeteerUtils = require('../utils/puppeteerUtils');
const qs = require('qs');
const { limitExec } = require('../utils/common');
const mkdirp = require('mkdirp');
const fs = require('fs');
const moment = require('moment');
const Datastore = require('nedb');
const { delay, getToday } = require('../utils/index');

// let query = qs.stringify(
//   { a: 1, b: '2', c: [1, 2], d: { d1: 1 } },
//   { arrayFormat: 'repeat', addQueryPrefix: true },
// );
// let queryObj = qs.parse(query, { arrayFormat: 'repeat' , ignoreQueryPrefix: true });

const { downFile, createDownloadPath } = puppeteerUtils;
const allLaunch = {};

const registerAllLaunch = (fn) => {
  allLaunch[fn.name] = {};
  return fn;
};

const launch = puppeteer.launch;
puppeteer.launch = async function (options, ...args) {
  const { launchKey, ...option } = options;
  if (launchKey) {
    allLaunch[launchKey].browser = await puppeteer.launch.call(
      this,
      option,
      ...args,
    );
    return allLaunch[launchKey].browser;
  }
  return launch.call(this, option, ...args);
};

// 生成browser page
const pageBrowser = async function (browserOptions) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: path.resolve(__dirname, '../tmp/myChromeSession'),
    // 解决视频等文件不支持 调用系统内的chrome浏览器
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    defaultViewport: { width: 1080, height: 900 },
    devtools: true,
    // args: ["--window-size=1920,1080", "--window-position=1921,0"]
    ...browserOptions,
  });

  const page = await browser.newPage();
  return { browser, page };
};

// 登录
const feature_login = async function () {
  const { browser, page } = await pageBrowser({ launchKey: 'feature_login' });
  page.on('request', async (request) => {
    const url = request.url();
    if (url.includes('www.douyin.com/aweme/v1/web/aweme/listcollection/')) {
      console.log('request----', request.url());
    }

    // if (request.url().includes('desiredrequest.json')){
    //     console.log('Request Intercepted')
    //     request.response().then(response => {
    //         return response.text();
    //     }).then(function(data) {
    //     console.log(data); // this will be a string
    //     alert(data)
    //     });
    // }

    // request.continue()
  });
};

const feature_logout = async function () {
  if (allLaunch['feature_login'] && allLaunch['feature_login'].browser) {
    const browser = allLaunch['feature_login'].browser;
    await browser.close();
    allLaunch['feature_login'] = null;
  }
};

// TODO 抖音收藏列表下载抖音无损视频资源
const feature_downloadVideo = async function (params) {
  const {
    url = 'https://www.douyin.com/user/MS4wLjABAAAA0zWieAn78LZo2nyh-QqNf7cWI0oJK3r3UmJq6LLtxpA',
    limitLen,
    downloadFilename = '',
    type = '',
  } = params || {};

  const { browser, page } = await pageBrowser({
    launchKey: 'feature_downloadVideo',
  });

  await page.setViewport({ width: 1080, height: 800 });

  // 打开列表页
  let query = qs.stringify({ showTab: type }, { arrayFormat: 'repeat' });
  try {
    if (url.includes('showTab')) {
      await page.goto(url);
    } else {
      const gotoUrl = url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
      await page.goto(gotoUrl);
    }
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }

  try {
    // 获取列表数据
    const resultsSelector = '[data-e2e="scroll-list"] li a';
    await page.waitForSelector(resultsSelector);

    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen) => {
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
        // 获取对应数量为止
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
          const [like, title] = el.innerText.split('\n\n');
          return {
            href,
            like,
            likeNum: stringToNum(like),
            title,
            filename: `${like}-${title.split(' ')[0]}`,
          };
        });
        return eleList;
      },
      resultsSelector,
      limitLen,
    );
    // 按照点赞排序 高->低
    dataSource.sort((a, b) => {
      return b.likeNum - a.likeNum;
    });

    //  获取无水印 src
    await limitExec(
      async (item, i) => {
        const { href } = item;
        const videoPage = await browser.newPage();
        try {
          await videoPage.goto(href);
          const videoSelect = '.xg-video-container video source';
          const userSelect = '[data-e2e="user-info"]';
          await videoPage.waitForSelector(videoSelect, {
            timeout: 5000,
          });
          // const src = await videoPage.$eval(videoSelect, (source) => {
          //   return source.src;
          // });
          const { src, user } = await videoPage.evaluate(
            (videoSelect, userSelect) => {
              const videoSrc = document.querySelector(videoSelect).src;
              const user = document.querySelector(userSelect);
              const userSrc = user.children[1].querySelector('a').innerText;
              const userName = user.children[1].querySelector('a').innerText;
              const [fans, like] = user.children[1]
                .querySelector('p')
                .innerText.slice(2)
                .split('获赞');
              return {
                src: videoSrc,
                user: {
                  fans,
                  like,
                  src: userSrc,
                  name: userName,
                },
              };
            },
            videoSelect,
            userSelect,
          );

          // if(user){
          //   item.user = user.substring(1).split('· ')[0];
          //   item.createDate = user.substring(1).split('· ')[1];
          // }
          item.src = src;
          item.user = user;
        } catch (error) {
          console.log('获取无水印视频报错----', error);
        }
        videoPage.close();
      },
      dataSource,
      5,
    );

    await downFile(dataSource, {
      pathname: downloadFilename,
    });
    await browser.close();
    return dataSource;
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

// TODO 搜索列表功能
const feature_search = async function (params = {}) {
  const { keyword, limitLen } = params;
  if (!keyword) {
    throw new Error('keyword 搜索关键字 必填');
  }
  const { browser, page } = await pageBrowser({ launchKey: 'feature_search' });

  await page.setViewport({ width: 1080, height: 800 });
  // 打开列表页 //publish_time=0&sort_type=1&source=tab_search&type=general
  const gotoUrl = `https://www.douyin.com/search/${encodeURIComponent(
    keyword,
  )}`;
  try {
    await page.goto(gotoUrl);
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }
  // 获取列表数据
  const resultsSelector =
    '[style="display:block"]>[data-e2e="scroll-list"]>li>div>div';
  await page.waitForSelector('[data-e2e="scroll-list"] li>div>div>div a');

  try {
    const dataSource = await page.evaluate(
      async (resultsSelector, limitLen) => {
        let eleList = [...document.querySelectorAll(resultsSelector)];
        eleList = eleList.filter((el) => {
          return el.children && el.children.length >= 3;
        });
        // 获取对应数量为止
        if (typeof limitLen !== 'undefined') {
          while (eleList.length < limitLen) {
            window.scrollBy({ left: 0, top: 2 * window.innerHeight });
            await new Promise((res) => setTimeout(() => res(), 1000));
            eleList = [...document.querySelectorAll(resultsSelector)];
            eleList = eleList.filter((el) => {
              return el.children && el.children.length >= 3;
            });
          }
          eleList = eleList.slice(0, limitLen);
        }
        eleList = eleList.map((el, i) => {
          if (el.children && el.children.length < 3) {
            return {};
          }
          const payload = {};
          // 如果长度是2 没有标题
          if (el.children[0]) {
            const [user, createDate] = el.children[0].innerText.split('\n\n·');
            payload.user = user;
            payload.createDate = createDate;
          }
          if (el.children[0] && el.children[0].querySelector('a')) {
            payload.userLink = el.children[0].querySelector('a').href;
          }
          if (el.children[1]) {
            payload.title = el.children[1].innerText;
          }
          // TODO 未播放的搜索不到视频 只有图片
          // if (el.querySelector('video source')) {
          //   payload.videoSrc = el.querySelector('video source').src;
          //   console.log('payload:---- ', payload);
          // }
          if (el.querySelector('[data-rank] .positionBox>div')) {
            const [like, comment, share] = el
              .querySelector('[data-rank] .positionBox>div')
              .innerText.split('\n');
            payload.like = like;
            payload.comment = comment;
            payload.share = share;
          }
          payload.id = String(i);
          return payload;
        });
        return eleList;
      },
      resultsSelector,
      limitLen,
    );

    // await downFile(dataSource);
    await browser.close();
    return dataSource;
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

// TODO 抖音用户信息下载
const feature_searchUsers = async function (params) {
  /* 1.自己找一些热门视频链接

2.软件去视频里，滚动 找500条评论，得到用户名+链接+赞数+评论内容+评论时间
过滤出非好物的+且赞数5条以下的用户

3.根据用户链接，得到用户的关注数+粉丝数+最新作品的文案
过滤粉丝数小于150，获赞数小于350的，作品数量>0
每次开5个chrome标签，发现不符合，就关闭chrome，符合，就拿到数据 push
关闭
>10条
从主页里拿到最新3条作品的文案

4.生成产出的文件，每拿到10个用户，生成一个文件 
*/
  const {
    url = 'https://www.douyin.com/user/MS4wLjABAAAA0zWieAn78LZo2nyh-QqNf7cWI0oJK3r3UmJq6LLtxpA',
    limitLen = 1,
    commentLimitLen = 100,
    downloadFilename = '',
    type = '',
    isLogin = false,
    userType = 'user', // business同行 user用户
  } = params || {};

  const { browser, page } = await pageBrowser({
    launchKey: 'feature_searchUsers',
    // devtools: false,
    ...(isLogin ? {} : { userDataDir: undefined }),
  });

  await page.setViewport({ width: 1080, height: 800 });

  // 打开列表页
  let query = qs.stringify({ showTab: type }, { arrayFormat: 'repeat' });
  try {
    if (url.includes('showTab')) {
      await page.goto(url);
    } else {
      const gotoUrl = url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
      await page.goto(gotoUrl);
    }
  } catch (error) {
    await browser.close();
    return { code: -1, errorMsg: '列表页打开失败' };
  }

  try {
    // 获取列表数据
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
        // 获取对应数量为止
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
          const [like, title] = el.innerText.split('\n\n');
          return {
            userType,
            href,
            like,
            likeNum: stringToNum(like),
            title,
            filename: `${like}-${title.split(' ')[0]}`,
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

    //  获取评论 src
    await limitExec(
      async (item, i) => {
        const { href } = item;
        const videoPage = await browser.newPage();
        try {
          await videoPage.goto(href);
          const videoSelect = '.xg-video-container video source';
          const userSelect = '[data-e2e="user-info"]';
          const commentSelect = '[data-e2e="comment-list"]';
          await videoPage.waitForSelector(videoSelect, {
            timeout: 5000,
          });
          // const src = await videoPage.$eval(videoSelect, (source) => {
          //   return source.src;
          // });
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
              const videoSrc = document.querySelector(videoSelect).src;
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
                  ].some((val) => {
                    return userName.includes(val);
                    // return userType === 'user'
                    //   ? userName.includes(val)
                    //   : !userName.includes(val);
                  });
                  if (filterName && userType === 'user') {
                    return null;
                  }
                  if (!filterName && userType !== 'user') {
                    return null;
                  }
                  // 点赞小于5
                  const userLike =
                    userInfoEl.querySelector('.jtyFqENC').innerText;
                  if (stringToNum(userLike) > 5 && userType === 'user') {
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
                const userInfo = await videoPage.evaluate(async (userType) => {
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
                  const firstVideoSrc = videoList[0].querySelector('a').href;
                  const age = document.querySelector('.N4QS6RJT').innerText;
                  const gender = document.querySelector('.woman_svg__a');
                  // if (!gender) {
                  //   return null;
                  // }
                  const [follow, fans, like] = [
                    ...document.querySelectorAll('.TxoC9G6_'),
                  ].map((v) => stringToNum(v.innerText));
                  if (fans > 150 && userType === 'user') {
                    return null;
                  }
                  if (like > 350 && userType === 'user') {
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
                  };
                }, userType);
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
        `../downloadFiles${partPath}/dataSource-${userType}-${moment().format(
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

// TODO 给用户点赞
const feature_userLike = async function (params) {
  // limitExec(async () => {

  // },list,1)
  const { browser, page } = await pageBrowser({
    launchKey: 'feature_userLike',
    devtools: false,
  });
  try {
    const { list = [], limitLen = 1 } = params || {};
    console.log('list: ', list);
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
          await delay(1000);
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

const features = {
  feature_downloadVideo,
  feature_login,
  feature_logout,
  feature_search,
  feature_searchUsers,
  feature_userLike,
};
// TODO
// 作品
// 喜欢
// 音乐
// 列表  喜欢 title 用户名(谁发的) 作品评论

const featureNames = Object.keys(features);
for (let i = 0; i < featureNames.length; i++) {
  registerAllLaunch(features[featureNames[i]]);
}

module.exports = { allLaunch, ...features };
