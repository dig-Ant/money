function sleep(time) {
  let now = Date.now();
  while (true) {
    if (Date.now() - now >= time) {
      return;
    }
  }
}
function ajax(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        // console.dir(`返回结果:${xhr.response}`);
        resolve(response.data);
      }
    };
  });
}
async function getInfo(promotion) {
  return await ajax(
    `/pc/decision/promotion/data?promotion_id=${promotion.promotion_id}&msToken=${msToken}`
  );
}
function getNum(info) {
  const {
    total_product_sale,
    month_info,
    total_promotion_user_account,
    total_product_order_account,
    total_pv,
    detail_url,
    shop_name,
  } = info;
  const {
    promotion_user_account_x,
    promotion_user_account_y,
    product_order_account_x,
    product_order_account_y,
    pv_x,
    pv_y,
    product_sale_x,
    product_sale_y,
  } = month_info;
  let len = promotion_user_account_x.length;
  let 推广达人数 = promotion_user_account_y[len - 1]; //推广达人数
  //   let order_account = product_order_account_y[len - 1];
  let 浏览量 = pv_y[len - 1]; //浏览量
  let 销量 = product_sale_y[len - 1]; //销量
  let 人均销量 = (销量 / 推广达人数).toFixed(2);
  let 转化率 = (销量 / 浏览量).toFixed(2);
  return {
    数据: {
      详情链接: detail_url,
      店名: shop_name,
    },
    月: {
      月销量: total_product_sale - 0,
      月推广达人数: total_promotion_user_account - 0,
      月浏览量: total_pv - 0,
    },
    昨日: {
      推广达人数,
      浏览量,
      销量: 销量 - 0,
    },
    a人均销量: 人均销量,
    b转化率: 转化率,
    msg: `${info.title},${推广达人数}人推广,浏览量${浏览量},销量${销量},人均销量${人均销量},转化率${转化率}`,
  };
}
// ======================================================
let msToken =
  "YJes3H4rxsyCwG4HgVpcjzRMglglFPfjguaR4jLDdigYphHL2lyshVFcU0GEssH56HhrcbVMIWPUbP1lDGAWkZtjKoauQf9J2t56HibaC4qgKJZ-j6KKrsDh5iJ8_xQ=";
// &msToken=${msToken}&_signature=_02B4Z6wo00001rA13bgAAIDBJOOGtOlp.FKwNdkAAM-5yjv5CX5C.SnJX73lGAD9UqTZhCVcGd0dPrJD7G0JfsWRMlwf6HzAXNqoQ8daQyqzQDTf6NQCBkX9zsvHw0iCsAwNXWPtWDfCdj-Qae
let urlList = [
  // 0爆款榜-实时
  "/pc/leaderboard/get_leaderboard_pmt?tab_id=4&type=0&cursor=0&count=20&msToken=BwaKGmM7vfhY6g3FTBXAS4Ptr12J10dakUPiLC3yixGpxw7aG43nLoJCamhX5CdPqUdQ7pQcVcAMqnOAXsZN2LoZsHpnPnw7bzaDDn-e75uo7JYavswWxQ==&X-Bogus=DFSzswVLWl2ANnrASk27937TlqCa&_signature=_02B4Z6wo00001FNhZ1AAAIDDx7c8XPPDmoBTYWPAAHeCq0pobgzyh-24PteDdWOdRIzjEXtOms0kl1b80aFExzH4zBazFUfq5zWprrwIv.ZG4MVJFTgJ7zBYkWUReWNP4syPuyRNMX5vYSh9b2",
  // 1爆款榜-昨日
  "/pc/leaderboard/get_leaderboard_pmt?tab_id=1&type=0&cursor=0&count=50&msToken=FO5fptbC_0BQYarxwPJPWNMQbLBpoVlp3GN1-mweUd3Pat4jTxgOxmu4NGtNYkS1Ds5Oy-4CHvO-MOlFyzgH1raMsFWViE4EVydUaAV2cPPs8kq_z1J4-g==&X-Bogus=DFSzswVLMeUANnrASk2app7TlqSV&_signature=_02B4Z6wo00001f6vkOAAAIDCannL7vR1HDX-r5RAABwL2zhDMyMl.fsp9NOnvxKauWTELamCil0subaJ8VmlS0xhWrLV5TGp.uI.SYu4q6uM-bUCJridxCFImoRPmGtdQxq4C-4VGkxVK9Mm3c",
  // 2首页-为你精选
  `/pc/selection/feed/pmt?page=1&page_size=60&msToken=${msToken}`,
  // 3热卖推荐-成交巨头
  `/pc/picking/pool/promotions?picking_pool_id=3471903237135850815&filter_type=10&sort_type=0&gid=373&cursor=0&count=60&msToken=${msToken}`,
  // 2热卖推荐-销量霸主
  `/pc/picking/pool/promotions?picking_pool_id=3471903237135850815&filter_type=10&sort_type=0&gid=374&cursor=0&count=60&session_id=7179481301773238587&msToken=oiTTpJByv-G8256fEV3iskAXTXJf60R2xcRdxKHYUHRYKSpmSsg-TmjW_5gZ3l91VvT60_uz6Ps_xmA4WBr6pF10vjOb6BWasGFs-yEp8XmtAL1ngwO1kpq7NM8-dxI=&X-Bogus=DFSzswVu5TtANCohSk2Es37TlqCi&_signature=_02B4Z6wo000017koKqwAAIDALf5xoCXOMNu5KC4AAI3xsamR5zpHuNsvjA0f1d-7jCPUwRhGaZKn9KFYIt21rbLq2H2D94XrT9tkRwmk2VyUkyWpX.0Ydu.e7CW66xkbXBnAhNBm3aJrbvy894`,

  // 热卖推荐-人气爆棚
  `/pc/picking/pool/promotions?picking_pool_id=3471903237135850815&filter_type=10&sort_type=0&gid=375&cursor=0&count=60`,
  // 热卖推荐-可观收入
  `/pc/picking/pool/promotions?picking_pool_id=3471903237135850815&filter_type=10&sort_type=0&gid=376&cursor=0&count=60&session_id=7179199182517829926`,
  `/pc/decision/promotion/data?promotion_id=3477667244534822045`,
  //   猜你想搜
  "/pc/selection/search/query/recommend?msToken=G6Kih8vxwvriICM27fUCftKNnzImFBg5GTQVME4SBVjb_VeeHYhWe9rJbcGaebPRnBImjtXEGQlPndjHoNqsYffL_UMTGYBcQAHfYnRhi4IGLg1VlJZ6hhxeHNCbVa8=&X-Bogus=DFSzswVYucGANt1kSk5Ji37Tlqtg&_signature=_02B4Z6wo000014EkxKQAAIDAFfKfq.ibOFuBJMAAAIPz64Lg1qqJd2oZ47wHxusGIwxRorJ2nqNYQ9Pl6bXnORV1gRulbEh-pKipAzROeeZkEc09B.OSBJTTZ.pnIou3tIIh7kbgnp8jAcDC01",
  `/pc/leaderboard/get_leaderboard_pmt?tab_id=4&type=0&cursor=0&count=20`,
];
ajax(urlList[0]).then(async ({ promotions }) => {
  let data = promotions;
  let i = 0,
    res = [];
  console.log(promotions);
  while (i < data.length) {
    console.log("请求" + i);
    try {
      let info = await getInfo(promotions[i]);
      if (info) {
        res.push({ ...info, ...promotions[i] });
        i++;
      }else {
        sleep(1000)
      }
      console.log(info);
    } catch (error) {
      console.log(error);
    }
  }

  let Logdata = res.map((e) => {
    return {
      title: e.title,
      价格: e.price / 100,
      类目: e.leaderboard_info.category_name,
      ...getNum(e),
    };
  });
  //   let 销量多的数据 = [],
  //     浏览量多的数据 = [],
  //     普通的数据 = [];
  //   for (let i = 0; i < Logdata.length; i++) {
  //     const e = Logdata[i];

  //     if (e.销量 / e.推广达人数 > 5 || e.销量 / e.浏览量 > 0.2) {
  //       销量多的数据.push(e);
  //     } else if (e.销量 / e.推广达人数 < 3) {
  //       浏览量多的数据.push(e);
  //     } else {
  //       普通的数据.push(e);
  //     }
  //   }
  let 排序后的数据 = Logdata.filter(
    (e) => e.昨日.推广达人数 > 0 && e.月.月销量 > 20000
  ).sort((c, v) => c.昨日.人均销量 - v.昨日.人均销量);
  console.log(res);
  console.log(排序后的数据);
  //   console.log(销量多的数据);
  //   console.log(浏览量多的数据);
  //   console.log(普通的数据);
  //   for (let i = 0; i < 销量多的数据.length; i++) {
  //     console.log(`%c${Logdata[i].msg}`, "color:red;");
  //   }
  //   for (let i = 0; i < 浏览量多的数据.length; i++) {
  //     console.log(`%c${Logdata[i].msg}`, "color:grey;");
  //   }
  //   for (let i = 0; i < 普通的数据.length; i++) {
  //     console.log(`%c${Logdata[i].msg}`);
  //   }
});
