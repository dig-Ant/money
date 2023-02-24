const qs = require('qs');
const moment = require('moment');
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
const MATE_NAME = [
  '哥',
  '斌',
  '涛',
  '军',
  '勇',
  '亮',
  '康',
  '峰 ',
  '锋 ',
  '龙',
  '虎',
  '男',
];
const IS_MATE = function (username) {
  return !!MATE_NAME.some((val) => {
    return username.includes(val);
  });
};
const STRING_TO_NUM_FUN = function (like, type = true) {
  if (type) {
    if (like.includes('万')) {
      const [num] = like.split('万');
      return Number((+num * 10000).toFixed(0));
    } else {
      return Number(like);
    }
  }
};
const GET_TIME_TEXT = function () {
  let time = moment().format('YYYY-MM-DD HH:mm:ss'); //2022-09-06 11:10:09
  time = time.slice(10, 12);
  if (time < 10) {
    return '早上';
  } else if (time < 12) {
    return '上午';
  } else if (time < 13) {
    return '中午';
  } else if (time < 18) {
    return '下午';
  } else if (time < 23) {
    return '晚上';
  }
};
const IS_BUSINESS_USER = function (username) {
  return !!BUSINESS_NAME.some((val) => {
    return username.includes(val);
  });
};
const MY_USER_LINK =
  'https://www.douyin.com/user/MS4wLjABAAAA0zWieAn78LZo2nyh-QqNf7cWI0oJK3r3UmJq6LLtxpA';
module.exports = {
  // searchUser
  // https://www.douyin.com/user/MS4wLjABAAAAc1psH2X0JDFrH3sBzn7a3Z60FzNbkgyPs1VOrmTukDddwuD_Cb5u5Pl7i0zaLa1v
  MY_USER_LINK,
  VIDEO_LIST_SELECTOR: '[data-e2e="scroll-list"] li a.chmb2GX8', // .mwo84cvf>div:last-child [data-e2e="scroll-list"] li a
  VIDEO_SRC_SELECTOR: '.xg-video-container video source',
  LIMIT: 100,
  INIT_VIEWPORT: { width: 1080, height: 800 },
  TIME_OUT: {
    timeout: 4 * 000,
  },
  DEVTOOLS: false,
  STRINGNUM:
    'this.eval = function (like, type = true) {if (type) {if (like.includes("万")) {const [num] = like.split("万");return Number((+num * 10000).toFixed(0));} else {return Number(like);}}}',
  BUSINESS_NAME,
  USER_INFO_LIST_SELECTOR: '[data-e2e="user-info"]',
  COMMENT_LIST_SELECTOR: '[data-e2e="comment-list"]',
  IS_CONSUMER_TYPE: (v) => v === 'consumer',
  IS_BUSINESS_TYPE: (v) => v === 'business',
  IS_BUSINESS_USER,
  IS_MATE,
  STRING_TO_NUM_FUN,
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
    if (url !== MY_USER_LINK) return url;
    let query = qs.stringify({ showTab: type }, { arrayFormat: 'repeat' });
    if (url.includes('showTab')) {
      return url;
    } else {
      return url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
    }
  },
  NOT_MATE(commentList) {
    return commentList.filter((e) => !IS_MATE(e.userName));
  },
  GET_TIME_TEXT,
  // NOT_SVG_MATE(commentList) {
  //   return commentList.filter((e) => {
  //     console.log(e.svgHtml);
  //     return (
  //       e.svgHtml && (e.svgHtml.includes('woman') || !e.svgHtml.includes('>'))
  //     );
  //   });
  // },
  FILTER_AGE(commentList) {
    return commentList.map((e) => {
      if (e.gender) {
        const match = e.gender.match(/(\d+)岁/);
        if (match) {
          e.age = match[1];
        }
      }
      return e;
    });
  },
  LESS_40(commentList) {
    return commentList.filter((e) => {
      return (
        e.svgHtml && (e.svgHtml.includes('woman') || !e.svgHtml.includes('>'))
      );
    });
  },
  LESS_FIVE(commentList) {
    return commentList.filter((e) => STRING_TO_NUM_FUN(e.userLike) < 5);
  },
  // commentList去重
  NOT_REPEAT: function (commentList) {
    let commitListRes = [];
    for (let i = 0; i < commentList.length; i++) {
      const commentItem = commentList[i];
      const has = commitListRes.find(
        (e) =>
          e.userLink === commentItem.userLink &&
          e.userName === commentItem.userName,
      );
      if (!has && commentItem.userName !== '琴琴好物') {
        commitListRes.push(commentItem);
      }
    }
    return commitListRes;
  },
  TO_NUM: function (commentList) {
    return commentList.map((e) => {
      e.follow = STRING_TO_NUM_FUN(e.follow);
      e.fans = STRING_TO_NUM_FUN(e.fans);
      e.like = STRING_TO_NUM_FUN(e.like);
      return e;
    });
  },
  FILTER_FANS_LIKE: function (commentList) {
    return commentList.filter((e) => {
      return e.fans < 850 && e.like < 1250;
    });
  },
  FILTER_BUSINESS: function (commentList) {
    let commRes = [],
      businRes = [];
    for (let i = 0; i < commentList.length; i++) {
      const element = commentList[i];
      if (IS_BUSINESS_USER(element.userName)) {
        businRes.push(element);
      } else {
        commRes.push(element);
      }
    }
    return {
      commentList: commRes,
      businessList: businRes,
    };
  },
};
/**
// let query = qs.stringify(
//   { a: 1, b: '2', c: [1, 2], d: { d1: 1 } },
//   { arrayFormat: 'repeat', addQueryPrefix: true },
// );
// let queryObj = qs.parse(query, { arrayFormat: 'repeat' , ignoreQueryPrefix: true });

let StringToNum = new Function('this.eval = function (like, type = true) {if (type) {if (like.includes("万")) {const [num] = like.split("万");return Number((+num * 10000).toFixed(0));} else {return Number(like);}}}');
let StringToNumFun = new StringToNum()
StringToNumFun.eval('1万');
 */
