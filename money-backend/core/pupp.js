const puppeteer = require('puppeteer');
const path = require('path');
const puppeteerUtils = require('../utils/puppeteerUtils');
const features = require('./puppFeature');

const { downFile } = puppeteerUtils;

class Pupp {
  constructor(props = {}) {
    this.allLaunch = {};
    this.init();
  }

  init() {
    // 给所有功能注册到allLaunch
    const featureNames = Object.keys(features);
    for (let i = 0; i < featureNames.length; i++) {
      this.registerAllLaunch(features[featureNames[i]]);
    }
  }

  // 启动
  async start(featureName, ...params) {
    const res = await features[featureName].call(this, ...params);
    return res;
  }

  registerAllLaunch(fn) {
    this.allLaunch[fn.name] = {};
    return fn;
  }

  // 生成browser
  async createBrowser(browserOptions) {
    try {
      const { launchKey, ...ext } = browserOptions || {};
      console.log(launchKey, ext);
      const browser = await puppeteer.launch({
        headless: false,
        userDataDir: path.resolve(__dirname, '../tmp/myChromeSession'),
        // 解决视频等文件不支持 调用系统内的chrome浏览器
        executablePath:
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        defaultViewport: { width: 1080, height: 900 },
        devtools: true,
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
        args: ["--window-size=1920,1080", "--window-position=1921,0"],
        ...ext,
      });
      console.log(111);
      const page = await browser.newPage();
      if (launchKey) {
        this.allLaunch[launchKey].browser = browser;
      }
      return { browser, page };
    } catch (error) {
      console.log(1111, error);
    }
  }
}

module.exports = Pupp;
