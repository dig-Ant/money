const path = require('path');
const fs = require('fs');
var allFeature = {};
const weekilyList = fs.readdirSync(path.resolve(__dirname, '../aged'));
weekilyList.forEach((filename) => {
  if (filename.includes('.') && !['index.js', '.DS_Store'].includes(filename)) {
    allFeature[filename.split('.')[0]] = require(`../aged/${filename}`);
  }
});

module.exports = {
  ...allFeature,
};
// .sort((b,a)=>a.length-b.length)
