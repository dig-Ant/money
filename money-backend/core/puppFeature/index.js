const puppeteer = require('puppeteer');
const path = require('path');
const puppeteerUtils = require('../../utils/puppeteerUtils');
const qs = require('qs');
const { limitExec } = require('../../utils/common');
const mkdirp = require('mkdirp');
const fs = require('fs');
const moment = require('moment');
const Datastore = require('nedb');
const { delay, getToday } = require('../../utils/index');
const { downFile, createDownloadPath } = puppeteerUtils;

// 自动批量导入puppFeature文件夹下的文件
var allFeature = {};
const puppFeatureList = fs.readdirSync(
  path.resolve(__dirname, '../puppFeature'),
);
puppFeatureList.forEach((filename) => {
  if (filename.includes('.') && !['index.js', '.DS_Store'].includes(filename)) {
    allFeature[filename.split('.')[0]] = require(`../puppFeature/${filename}`);
  }
});

// let query = qs.stringify(
//   { a: 1, b: '2', c: [1, 2], d: { d1: 1 } },
//   { arrayFormat: 'repeat', addQueryPrefix: true },
// );
// let queryObj = qs.parse(query, { arrayFormat: 'repeat' , ignoreQueryPrefix: true });

// 登录
const feature_login = async function () {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_login',
  });
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
  const allLaunch = this.allLaunch;
  console.log('allLaunch: ', allLaunch);
  if (allLaunch['feature_login'] && allLaunch['feature_login'].browser) {
    const browser = allLaunch['feature_login'].browser;
    await browser.close();
    allLaunch['feature_login'] = null;
  }
};

const features = {
  feature_login,
  feature_logout,
  ...allFeature,
};
// TODO
// 作品
// 喜欢
// 音乐
// 列表  喜欢 title 用户名(谁发的) 作品评论

module.exports = features;
