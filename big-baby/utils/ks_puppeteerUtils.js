const axiosRequest = require("./request");
const { delay, getToday } = require("./utils");
const fs = require("fs");

const hrefClassMap = {
  music: "o2WoARuk",
  user: "Eie04v01",
};
const getHref = async (page, url, className) => {
  await page.goto(url, { timeout: 0 }); // 进入页面
  await delay(10000);
  const href = await page.$$eval(`#root .${className} a`, (e) =>
    e.map((v) => v.href)
  );
  console.log("href:", href);
  return href;
};

const getKeyboardHref = async (page, text) => {
  await page.goto(
    "https://www.douyin.com/search/圣诞老人礼物袋?publish_time=0&sort_type=1&source=tab_search&type=video",
    { timeout: 0 }
  );
  await delay(10000);
  await page.type(".igFQqPKs", text, { delay: 0 });
  await page.keyboard.press("Enter"); // 回车
  await delay(40000);
  const href = await page.$$eval("#root li.aCTzxbOJ.pYgrEk__ a", (e) =>
    e.map((v) => v.href)
  );
  console.log(href);
  return href;
};

const getSrc = async (page, videoArr) => {
  let i = 0,
    videoSrcArr = [];
  while (i < videoArr.length) {
    await page.goto(videoArr[i], { timeout: 0 });
    await delay(2000);
    const src = await page.$$eval("#app video", (e) => {
      return e.src;
    });
    console.log(src);
    const user = await page.$$eval(
      ".profile-user-name-title",
      (e) => e.innerText
    );
    const title = await page.title();
    videoSrcArr.push({
      src,
      title: title,
      href: videoArr[i],
      user,
    });
    i++;
  }
  console.log("src:", videoSrcArr);
  return videoSrcArr;
};

function download(video, file, i) {
  return new Promise((resolve, reject) => {
    axiosRequest.get(video.src, { responseType: "stream" }).then((response) => {
      const totalLength = response.headers["content-length"];
      let totalChunkLength = 0; // 当前数据的总长度
      const readSteam = response.data; // 当前读取的流

      // 读取流会触发的事件
      readSteam.on("data", (chunk) => {
        totalChunkLength += chunk.length;
        // console.log(
        //   "数据传输中，当前进度==>",
        //   ((totalChunkLength / totalLength) * 100).toFixed(2) + "%"
        // );
      });
      readSteam.on("end", (chunk) => {
        console.log("获取远端数据完毕"); // 读取完成
      });
      readSteam.on("error", (err) => {
        reject(err); // 读取错误
        console.log("获取远端数据完毕，发生了错误,错误信息==>", err);
      });

      const folder = getToday();
      const writeFile = readSteam.pipe(
        fs.createWriteStream(`gitlog/${folder}/11.mp4`)
      );
      writeFile.on("finish", () => {
        writeFile.close();
        console.log("恭喜主人，本地数据写入完成");
        resolve();
      });
      // 写入错误触发的事件
      writeFile.on("error", (err) => {
        reject(err);
        console.log("报告主人，本地数据写入发生异常，错误信息==>", err);
      });
    });
  });
}

const downFile = async (arr, file) => {
  let i = 0;
  while (arr[i]) {
    try {
      await download(arr[i], file, i + 1);
    } catch (error) {
      console.log(`第${i + 1}个出错了：${error}`);
    }
    i++;
  }
};
module.exports = {
  hrefClassMap,
  getHref,
  getKeyboardHref,
  getSrc,
  downFile,
};
