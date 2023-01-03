const fs = require('fs');
const puppeteer = require('puppeteer');

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

(async () => {
  const browser = await (puppeteer.launch({     
    executablePath: '/Users/yang/Downloads/spider/chapter1/Chromium.app/Contents/MacOS/Chromium'  , 
    headless: false }));
  const page = await browser.newPage();
  await page.goto('https://music.163.com/#'); // 进入页面
  await page.type('.txt.j-flag', '鬼才会想', {delay: 0});// 点击搜索框拟人输入
  await page.keyboard.press('Enter');// 回车
  
  // 获取歌曲地址
  await delay(2000)
  let iframe = await page.frames().find(f => f.name() === 'contentFrame');
  const SONG_LS_SELECTOR = await iframe.$('.srchsongst');
  const selectedSongHref = await iframe.evaluate(e => {
    const songList = Array.from(e.childNodes);
    const idx = songList.findIndex(v => v.childNodes[1].innerText.replace(/\s/g, '') === '鬼才会想起');
    return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href;
  }, SONG_LS_SELECTOR);
  await page.goto(selectedSongHref);

  // 进入歌曲页面,获取歌曲页面嵌套的 iframe
  await delay(2000)
  iframe = await page.frames().find(f => f.name() === 'contentFrame');
  const unfoldButton = await iframe.$('#flag_ctrl');// 点击 展开按钮
  await unfoldButton.click();

  // 获取歌词
  const LYRIC_SELECTOR = await iframe.$('#lyric-content');
  const lyricCtn = await iframe.evaluate(e => {
    return e.innerText;
  }, LYRIC_SELECTOR);
  // 截图
  // await page.screenshot({path: '歌曲.png',fullPage: true});
  // 写入文件
  let writerStream = fs.createWriteStream('歌词.txt');
  writerStream.write(lyricCtn, 'UTF8');
  writerStream.end();

  // 获取评论数量
  const commentCount = await iframe.$eval('.sub.s-fc3', e => e.innerText);

  // 获取评论
  const commentList = await iframe.$$eval('.itm', elements => {
    const ctn = elements.map(v => {
      return v.innerText.replace(/\s/g, '');
    });
    return ctn;
  });
  // console.log(commentList);
})();