const path = require('path');
const fs = require('fs');
// 自动批量导入weekily文件夹下的文件
var allFeature = {};
const weekilyList = fs.readdirSync(path.resolve(__dirname, '../text'));
weekilyList.forEach((filename) => {
  if (filename.includes('.') && !['index.js', '.DS_Store'].includes(filename)) {
    allFeature[filename.split('.')[0]] = require(`../text/${filename}`);
  }
});

module.exports = {
  ...allFeature,
};
// .sort((b,a)=>a.length-b.length)