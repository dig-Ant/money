const puppeteer = require('puppeteer');
const path = require('path');
const puppeteerUtils = require('../utils/puppeteerUtils');
const features = require('./puppFeature');

const { downFile } = puppeteerUtils;


class Pupp {
  constructor(props = {}) {}
  async start(featureName, ...params) {
    const res = await features[featureName].call(this, ...params);
    return res;
  }
}

module.exports = Pupp;
