const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');

const executablePath =
  '/Users/yang/Downloads/spider/chapter1/Chromium.app/Contents/MacOS/Chromium';

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function getToday() {
  return moment().format('MM-DD');
  // return `${moment().month() + 1}-${moment().date()}`;
}

function stringToNum(data, type = true) {
  let res = data;
  if (type) {
    if (res.includes('万')) {
      const [num] = res.split('万');
      return Number((+num * 10000).toFixed(0));
    } else {
      return Number(res);
    }
  }
}

async function pageBrowser() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
  });
  const page = await browser.newPage();
  return { browser, page };
}
function writeFile(fileName, data) {
  const folder = getToday();
  console.log(folder);
  let writerStream = fs.createWriteStream(`gitlog/${folder}/${fileName}.js`);
  writerStream.write(JSON.stringify(data), 'UTF8');
  writerStream.end();
}
module.exports = {
  delay,
  getToday,
  stringToNum,
  pageBrowser,
  writeFile,
  executablePath,
};
