const puppeteer = require("puppeteer");
const moment = require("moment");
const fs = require("fs");

const executablePath =
  "/Users/yang/Downloads/spider/chapter1/Chromium.app/Contents/MacOS/Chromium";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function getToday() {
  return `${moment().month() + 1}${moment().date()}`;
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
  writerStream.write(JSON.stringify(data), "UTF8");
  writerStream.end();
}
module.exports = {
  delay,
  getToday,
  pageBrowser,
  writeFile,
  executablePath,
};
