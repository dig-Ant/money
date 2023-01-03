// 3588850576722643237

const axiosRequest = require("./request");
const { delay, getToday } = require("./utils");
const fs = require("fs");

const getMsg = async (page, videoArr) => {
  let i = 0,
    videoSrcArr = [];
  while (i < videoArr.length) {
    await page.goto(
      "https://buyin.jinritemai.com/dashboard/merch-picking-hall/merch_promoting?id=" +
        videoArr[i] +
        "&enter_from=%7B%7D&rank_log_params=%7B%22product_label%22%3A%22%7B%5C%22in_toplist%5C%22%3A%5C%221%5C%22%2C%5C%22top_list_id%5C%22%3A%5C%220%5C%22%2C%5C%22top_list_type%5C%22%3A%5C%22center_top_list%5C%22%2C%5C%22top_list_name%5C%22%3A%5C%22%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F%E5%AE%9E%E6%97%B6%E7%88%86%E6%AC%BE%E6%A6%9C%5C%22%7D%22%2C%22top_list_type%22%3A%22center_top_list%22%2C%22source%22%3A%22%E5%95%86%E5%93%81%E5%8D%A1%E6%A6%9C%E5%8D%95%E5%85%A5%E5%8F%A3%22%2C%22product_tab_name%22%3A%22%E7%B2%BE%E9%80%89%E8%81%94%E7%9B%9F%E5%AE%9E%E6%97%B6%E7%88%86%E6%AC%BE%E6%A6%9C%22%2C%22pick_source_id%22%3A%22top_list_0%22%2C%22pick_third_source%22%3A%22center_top_list%22%2C%22page_name%22%3A%22top_list%22%7D",
      { timeout: 0 }
    );
    if (i == 0) {
      await delay(70000);
    }
    await delay(4000);
    const src = await page.$$eval(
      ".index-module__value___3WKGc.index-module__earnValue___3jty0",
      (e) => {
        return e.innerText;
      }
    );
    console.log(src);
    // const user = await page.$eval(
    //   "#root .Yja39qrE .Nu66P_ba",
    //   (e) => e.innerText
    // );
    videoSrcArr.push({
      src,
      href: videoArr[i],
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
        fs.createWriteStream(
          `gitlog/${folder}/${i}-${video.user}$-${
            video.title.split(" ")[0]
          }.mp4`
        )
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
  getMsg,
};
