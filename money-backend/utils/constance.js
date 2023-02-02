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
  MY_USER_LINK:
    'https://www.douyin.com/user/MS4wLjABAAAA0zWieAn78LZo2nyh-QqNf7cWI0oJK3r3UmJq6LLtxpA',
  VIDEO_LIST_SELECTOR: '[data-e2e="scroll-list"] li a',
  VIDEO_SRC_SELECTOR: '.xg-video-container video source',
  LIMIT: 100,
  INIT_VIEWPORT: { width: 980, height: 800 },
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
};
/**
 
let StringToNum = new Function('this.eval = function (like, type = true) {if (type) {if (like.includes("万")) {const [num] = like.split("万");return Number((+num * 10000).toFixed(0));} else {return Number(like);}}}');
let StringToNumFun = new StringToNum()
StringToNumFun.eval('1万');
 */
