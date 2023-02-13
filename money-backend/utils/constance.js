const qs = require('qs');
const {
  consumer1,
  consumer2,
  business1,
  business2,
  aged1,
  aged2,
  girls,
} = require('./comments');
let commenti1 = -1;
let commenti2 = -1;
const BUSINESS_NAME = [
  '好物',
  '分享',
  '优选',
  '严选',
  '寻宝',
  '百货',
  '推荐',
  '精选',
  '优品',
  '宝藏',
  '搭建',
  '宝贝',
  '生活',
];
module.exports = {
  // searchUser
  // https://www.douyin.com/user/MS4wLjABAAAAc1psH2X0JDFrH3sBzn7a3Z60FzNbkgyPs1VOrmTukDddwuD_Cb5u5Pl7i0zaLa1v
  MY_USER_LINK:
    'https://www.douyin.com/user/MS4wLjABAAAA0zWieAn78LZo2nyh-QqNf7cWI0oJK3r3UmJq6LLtxpA',
  VIDEO_LIST_SELECTOR: '[data-e2e="scroll-list"] li a', // .mwo84cvf>div:last-child [data-e2e="scroll-list"] li a
  VIDEO_SRC_SELECTOR: '.xg-video-container video source',
  LIMIT: 100,
  INIT_VIEWPORT: { width: 1080, height: 800 },
  TIME_OUT:{
    timeout: 10 * 60 * 000,
  },
  DEVTOOLS: false,
  STRINGNUM:
    'this.eval = function (like, type = true) {if (type) {if (like.includes("万")) {const [num] = like.split("万");return Number((+num * 10000).toFixed(0));} else {return Number(like);}}}',
  BUSINESS_NAME,
  USER_INFO_LIST_SELECTOR: '[data-e2e="user-info"',
  COMMENT_LIST_SELECTOR: '[data-e2e="comment-list"]',
  IS_CONSUMER_TYPE: (v) => v === 'consumer',
  IS_BUSINESS_TYPE: (v) => v === 'business',
  IS_BUSINESS_USER: function (username) {
    return !!BUSINESS_NAME.some((val) => {
      return username.includes(val);
    });
  },
  STRING_TO_NUM_FUN: function (like, type = true) {
    if (type) {
      if (like.includes('万')) {
        const [num] = like.split('万');
        return Number((+num * 10000).toFixed(0));
      } else {
        return Number(like);
      }
    }
  },
  GET_COMMENT1: function (userType) {
    let comments =
      userType === 'aged'
        ? aged1
        : userType === 'business'
        ? business1
        : consumer1;
    commenti1++;
    if (commenti1 >= comments.length) {
      commenti1 = commenti1 % comments.length;
    }
    console.log(commenti1 + '-111-' + comments[commenti1]);
    return comments[commenti1];
  },
  GET_COMMENT2: function (userType) {
    let comments =
      userType === 'aged'
        ? aged2
        : userType === 'business'
        ? business2
        : consumer2;
    commenti2++;
    if (commenti2 >= comments.length) {
      commenti2 = commenti2 % comments.length;
    }
    console.log(commenti2 + '-222-' + comments[commenti2]);
    return comments[commenti2];
  },
  GET_URL: function (url, type) {
    let query = qs.stringify({ showTab: type }, { arrayFormat: 'repeat' });
    if (url.includes('showTab')) {
      return url;
    } else {
      return url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
    }
  },
};
/**
let StringToNum = new Function('this.eval = function (like, type = true) {if (type) {if (like.includes("万")) {const [num] = like.split("万");return Number((+num * 10000).toFixed(0));} else {return Number(like);}}}');
let StringToNumFun = new StringToNum()
StringToNumFun.eval('1万');
 */
