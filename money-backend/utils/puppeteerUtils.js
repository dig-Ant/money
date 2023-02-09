const fs = require('fs');
const path = require('path');
const axiosRequest = require('./request');
const { delay, getToday } = require('./index');
const mkdirp = require('mkdirp');

const hrefClassMap = {
  music: 'o2WoARuk',
  user: 'Eie04v01',
};
const getHref = async (page, url, className) => {
  await page.goto(url, { timeout: 0 }); // 进入页面
  await delay(5000);
  const hrefList = await page.$$eval(`#root .${className} a`, (e) =>
    e.map((v) => v.href),
  );
  const zanList = await page.$$eval(`#root .${className} a .PMnwIIz1`, (e) =>
    e
      .map((v) => v.innerText)
      .map((e) => (e.includes('万') ? e.slice(0, -1) * 10000 : e)),
  );
  let res = [];
  for (let i = 0; i < zanList.length; i++) {
    res.push({
      href: hrefList[i],
      zan: zanList[i],
    });
  }
  let result = res.sort((a, b) => b.zan - a.zan);
  console.log('resultHref:', result);
  return result;
};

const getKeyboardHref = async (page, text) => {
  await page.goto(
    'https://www.douyin.com/search/新?publish_time=0&sort_type=1&source=tab_search&type=video',
    { timeout: 0 },
  );
  await delay(10000);
  await page.type('.igFQqPKs', text, { delay: 0 });
  await page.keyboard.press('Enter'); // 回车
  await delay(2000);
  const href = await page.$$eval('#root li.aCTzxbOJ.pYgrEk__ a', (e) =>
    e.map((v) => v.href),
  );
  console.log(href);
  return href;
};
const getSrc = async (page, videoArr) => {
  let i = 0,
    videoSrcArr = [];
  while (i < videoArr.length) {
    await page.goto(videoArr[i].href, { timeout: 0 });
    await delay(2000);
    const src = await page.$$eval('#root video source', (e) => {
      return e[0].src;
    });
    const user = await page.$eval(
      '#root .Yja39qrE .Nu66P_ba',
      (e) => e.innerText,
    );
    const title = await page.title();
    videoSrcArr.push({
      src,
      title: title,
      href: videoArr[i].href,
      user,
      zan: videoArr[i].zan - 0,
    });
    i++;
  }
  console.log('src:', videoSrcArr);
  return videoSrcArr.sort((a, b) => b.zan - a.zan);
};

async function download(video, file, i) {
  const { downloadPath } = file || {};
  return new Promise((resolve, reject) => {
    axiosRequest
      .get(video.src, {
        responseType: 'stream',
      })
      .then((response) => {
        const totalLength = response.headers['content-length'];
        let totalChunkLength = 0; // 当前数据的总长度
        const readSteam = response.data; // 当前读取的流

        // 读取流会触发的事件
        readSteam.on('data', (chunk) => {
          totalChunkLength += chunk.length;
          // console.log(
          //   "数据传输中，当前进度==>",
          //   ((totalChunkLength / totalLength) * 100).toFixed(2) + "%"
          // );
        });
        readSteam.on('end', (chunk) => {
          console.log('获取远端数据完毕'); // 读取完成
        });
        readSteam.on('error', (err) => {
          reject(err); // 读取错误
          console.log('获取远端数据完毕，发生了错误,错误信息==>', err);
        });
        const videoFilename = video.filename.replace('/', '-');
        i = i < 10 ? '0' + i : i;
        const writeFile = readSteam.pipe(
          fs.createWriteStream(
            path.resolve(
              __dirname,
              `${downloadPath}/${i}-${videoFilename}.mp4`,
            ),
          ),
        );
        writeFile.on('finish', () => {
          writeFile.close();
          console.log('恭喜主人，本地数据写入完成');
          resolve();
        });
        // 写入错误触发的事件
        writeFile.on('error', (err) => {
          reject(err);
          console.log('报告主人，本地数据写入发生异常，错误信息==>', err);
        });
      });
  });
}

const createDownloadPath = (pathname, dp) => {
  const folder = getToday();
  const mkdirPath =
    dp || `../downloadFiles/${pathname ? `${folder}/${pathname}` : folder}`;
  try {
    const made = mkdirp.sync(path.resolve(__dirname, mkdirPath));
  } catch (error) {
    console.log('创建下载目录失败', error);
  }
  let partPath = '';
  if (!dp || dp.includes('downloadFiles')) {
    partPath = mkdirPath.split('downloadFiles')[1];
  }
  return [mkdirPath, partPath];
};
// 下载文件
const downFile = async (arr, file) => {
  const { downloadPath, pathname } = file || {};
  const [mkdirPath] = createDownloadPath(pathname, downloadPath);
  try {
    fs.writeFileSync(
      path.resolve(__dirname, `${mkdirPath}/${pathname}.json`),
      JSON.stringify(arr),
    );
    fs.writeFileSync(
      path.resolve(__dirname, `${mkdirPath}/${pathname}.json`),
      JSON.stringify(
        arr.sort((q, w) => {
          let time1 = new Date(q.time.slice(5));
          let time2 = new Date(w.time.slice(5));
          return time1.getTime() - time2.getTime();
        }),
      ),
    );
  } catch (error) {
    console.log('数据文件下载失败', error);
  }
  let i = 0;
  while (arr[i]) {
    try {
      await download(arr[i], { file, downloadPath: mkdirPath }, i + 1);
    } catch (error) {
      console.log(`第${i + 1}个出错了：${error}`);
    }
    i++;
  }
};
const downProductmsg = async (arr, file) => {
  const { downloadPath, pathname } = file || {};
  const [mkdirPath] = createDownloadPath(pathname, downloadPath);
  try {
    fs.writeFileSync(
      path.resolve(__dirname, `${mkdirPath}/${pathname}.json`),
      JSON.stringify(arr),
    );
  } catch (error) {
    console.log(pathname + '的账号作品信息下载失败', error);
  }
};

module.exports = {
  hrefClassMap,
  getHref,
  getKeyboardHref,
  getSrc,
  downFile,
  downProductmsg,
  createDownloadPath,
};
