const {
  GET_COMMENT1,
  GET_COMMENT2,
  COMMENT_LIST_SELECTOR,
  TIME_OUT,
  getDB,
  NOT_SVG_MATE,
} = require('../../utils/constance');
const { delay } = require('../../utils/index');

const feature_userLike = async function (params) {
  const { browser, page } = await this.createBrowser({
    launchKey: 'feature_userLike',
    devtools: false,
  });
  try {
    const { list = [], userType, _id, listType } = params || {};

// （一）这件事我考虑再三，还是决定说出来，因为是猜测的事情，不太敢往深里想。

// 我的老家在北方一处依水的小村，历史渊源可以追溯到明末抗清的起义军，那里路径幽深，景色特别的好。

// 我的父亲被家族委以重任，从小接受教育后来学习会计，走了出来。后来有了自己的事业、家庭，孩子、朋友；为家族开枝散叶。

// 父亲兄弟四个，他行二，姑姑们都喊他二哥，大伯学的制药，那种年代非常的稀缺，落在了其他的城市。也凭借自己的力量组织家庭，买房娶妻生子，生活过得十分富足。三伯学没有读下来，就一直在当地务农，种种地做点零活，照顾两位老；四伯在父亲帮扶下做生意，生意越做越大，去了哈尔滨定居，生活非常富足。

// 生活本该如此平静安逸，但不该发生的事件从三伯伯的妻子自杀开始。

// 三伯的妻子是同村人做媒介绍的，我记忆里的三娘个儿不高，皮肤很白，后脑勺一条乌黑的长长的辫子。性格很内向，不爱说话。我们小时候回去过年，她会背了表妹锁门躲出去，照现在的话，大概就是社恐吧。手很巧，表妹曾经给我看她藏起来的，她妈妈给她做过的手缝荷包，针脚细腻，不太大，很香。荷包用柔软的布缝制，上面还绣着鸳鸯，有的是一只小水鸟，非常精致。我那时候羡慕的不得了。

// 追问起原因，大概是吃晚饭的时候，她没有喊我的爷爷奶奶吃饭。爷爷出门去了，家里只有奶奶，她因为风寒咳嗽，在屋里躺着，三娘家饭熟了，以为她在休息，就行让我表妹把吃的给她端过去。

// 正收拾吃饭桌子，奶奶起来，看到了就生气了，说了她几句。
// 她一贯是不解释的人，只能委屈的掉眼泪。我表妹那时候年纪小，也不懂奶奶这是怎么了，自己正吃着饭，奶奶突然跑过来把妈妈骂哭了。
// 三伯出去种田浇水，到晚上九十点钟才回来，进门屋里黑洞洞的，开灯看到妻子歪在地上，旁边有倒了的农药瓶。
// 知道是喝了药，赶紧叫人。
// 一堆人七手八脚找了车，拉去医院。人没到就不行了。据说喝了农药会特别渴，她迷迷糊糊的要水喝，同行的人也不懂，给她喂了水。到了医院，医生说不喝水到医院洗胃催吐就能有生还机会。喝了水农药就被稀释吸收了，人救不回来了。

// 好像平静的生活突然被人卡住了脖子。三伯没有办法，带回去安葬。三娘 娘家人上门来闹，爷爷也生气奶奶的做法，气的晕了过去，脑血栓栓住了半边身体，从起卧床不起。

// 我印象里爷爷的个子很高，有188的样子，又高又壮，因为能干身体又好，那时候在农村，能养活一大家子人。只是这一瘫痪，整个家都瘫了，失去了收入。
// 三伯问了奶奶原因，不再和她说话，她怎么闹也不再理她。留下的两个表妹大的8岁小的2岁，都是离不开人的时候，三娘婆家人说想把孩子带过去养，三叔没同意。

// 爷爷瘫痪在床上，吃喝拉撒，一躺三四年，奶奶受了累，人瘦的看不出人形，除了照顾一家人，还要照顾两个小孩。村里很多人说她活该，嘴巴太臭，逼死了儿媳。也没人敢再和三叔做媒。他就那么一个人过日子。夏天的时候一个人去地里干农活，种西瓜，浇水，有时候都不回家。

// 他原本是个爱说爱笑的人，性格非常开朗，我那时候很喜欢和他在一起。这件事后他基本就不会笑了。

// 再没多久，爷爷奶奶相继去世。老家的院子空了，屋子被空了出来，被姑姑放杂物。

// 接连出事的是二姑姑家的二儿子，比我年长一岁，又高又黑，额头很高，一脸的小雀斑，异常的调皮。学业不成就去学着我四伯做生意，混大了，挣了很多很多的钱。
// 由于没有到娶妻的年龄，才刚20岁，就喊了三弟去一起经商。因为被骗几批货物，亏了下来，后来回了老家。
// 人都见过穷人暴富，人人羡慕，可见了由富变穷，都会多嘴几句，说他有钱了就不正经做生意，出去找娘们，一身脏病。
// 谣言越传越邪门，二姑姑不得不给他做了一门亲事，隔壁村的姑娘，人年轻朴实，很会缝纫衣服，二姑姑看她乖巧，出面娶了回来。
// 一开始夫妻相处还是很和谐的，很快的怀孕有了儿子，二哥也开始做小生意，只是非常的辛苦，而且挣不到什么钱，他是哥们义气好交往的人，周围交往了一群哥们朋友，不忙了就会聚到一起吃吃喝喝，有时候去打牌，也无非原来认识的那几个坏小子。二姑姑也不太管他们。

// 事情在他在哥们的怂恿下买了一辆摩托车开始。摩托车是日本货，个儿很大，典型的那种赛车摩托车，光放在那里就野性十足，令人生畏；可男人们喜欢，他也喜欢，就无论如何借了钱也要买了下来。每天小心爱惜，不许孩子摸。
// 那是个小雨天，他的一个朋友结婚要办酒，在典礼的前一天要叫发小和好朋友喝一顿酒，意思向大家表明自己即将有小家庭和新生活，明天场面上也可能要朋友哥们的帮忙，他六点多就去了。

// 直到第二天第三天都没有回来，二姑姑一开始以为给朋友结婚帮忙，后来才觉得不对，这时候警察的电话打过来。在一处公路的转弯处有一具尸体，尸体有个小记事本，上面有家里电话。

// 二哥哥出事了。原来当夜他喝了点酒回家，骑摩托车在转弯的时候分了神，直接撞到了拐弯处的电线杆，碰到头，人当场就没了。

// 又是深夜，酒后的车速一定很快。
    for (i = 6; i < list.length; i++) {
      const { firstVideoSrc, userLink, secondVideoSrc, thirdVideoSrc } =
        list[i] || {};
      if (firstVideoSrc && firstVideoSrc.includes('video')) {
        try {
          const newPage = await browser.newPage();
          // await newPage.setViewport({ width: 1080, height: 800 });
          console.log('userLink: ', userLink);
          // await newPage.goto(userLink, TIME_OUT);
          // const svgInfo = await newPage.evaluate(async () => {
          //   console.log(
          //     (document.querySelector('.N4QS6RJT') || {}).innerHTML || '',
          //   );
          //   return (document.querySelector('.N4QS6RJT') || {}).innerHTML || '';
          // });
          // // console.log('svgInfo: ', svgInfo);
          // NOT_SVG_MATE(svgInfo);
          // if (!NOT_SVG_MATE) {
          //   console.log(userLink, '----男');
          //   return;
          // }
          // await delay(50000);
          await newPage.goto(firstVideoSrc, TIME_OUT);
          // 检测到有视频为止
          await newPage.waitForSelector(
            '.xg-video-container video source',
            TIME_OUT,
          );
          //类名 点赞kr4MM4DQ 有红心的NILc2fGS
          // 获取评论区用户的信息
          let hasQin = false;
          // if (userType !== 'aged') {
          //   hasQin = await newPage.evaluate(async (COMMENT_LIST_SELECTOR) => {
          //     let commentList = [
          //       ...document.querySelector(COMMENT_LIST_SELECTOR).children,
          //     ];
          //     console.log(commentList.at(-1).innerText);
          //     while (
          //       !commentList.at(-1).innerText.includes('暂无评论') &&
          //       !commentList.at(-1).innerText.includes('没有')
          //     ) {
          //       window.scrollBy({ left: 0, top: 2 * window.innerHeight });
          //       await new Promise((res) => setTimeout(() => res(), 600));
          //       commentList = [
          //         ...document.querySelector(COMMENT_LIST_SELECTOR).children,
          //       ];
          //     }
          //     commentList.splice(-1, 1);
          //     hasQin = commentList.find((el) => {
          //       const userInfoEl = el.querySelector('div:nth-child(2)');
          //       if (!userInfoEl) return false;
          //       const isQin =
          //         userInfoEl.querySelector('a').innerText == '琴琴好物';
          //       console.log(userInfoEl.querySelector('a'));
          //       return isQin;
          //     });

          //     debugger;
          //     return hasQin;
          //   }, COMMENT_LIST_SELECTOR);
          // }
          // console.log('hasQin: ', hasQin);
          if (!hasQin) {
            await delay(3000);
            await newPage.keyboard.down('Z');
            await newPage.keyboard.up('Z');
            await delay(1000);
            await newPage.click('.public-DraftStyleDefault-block');
            // await newPage.keyboard.down('Control');
            // await newPage.keyboard.press('V');
            // await newPage.keyboard.up('Control');
            await delay(5000); // data-text
            await newPage.keyboard.type(GET_COMMENT1(userType));
            await delay(2000);
            await newPage.keyboard.press('Enter'); // 回车
            await delay(3000);
          }
          const db = getDB(userType);
          db.find({ _id }).exec((err, doc) => {
            const data = doc[0];
            let updateList = data[listType].map((e) => {
              if (list[i] && e.userLink === list[i].userLink) {
                console.log('e.userName: ', e.userName);
                e.isLiked = true;
              }
              return e;
            });
            db.update(
              { _id },
              {
                ...data,
                [listType]: updateList,
              },
              {},
              (err, numReplaced) => {
                console.log('err, numReplaced: ', err, numReplaced);
              },
            );
          });
          newPage.close();
        } catch (error) {
          console.log('点赞可能失败', error);
        }
      }
    }
/**
 到了现在，我觉得我才真正了解我妈。

我小时候挺黏我妈的，我觉得我妈很好看身材也好，但是有时候凶巴巴，有时候又很急躁。

长大之后我才发现，我妈身上的三个大标签。

1大大咧咧甚至有点天然呆

我妈是个超级冒失的人，她倒水一定会倒在外面，经常打翻一些东西，吃饭会把米饭粒吃到下巴上。

我发现这件事，是我和我妈出门的时候，她朋友吐槽她：看起来文文静静像个老师，谁知道做事这么武（我们这武的意思代表这个人做事风风火火，还有点冒失的意思）。😳

我记得我小时候，小时候还是长头发的时候，我妈还会给我扎辫子，但是她扎辫子扯的我头发超疼，我也会狂哭，于是她觉得我太娇气了，一气之下给我剪成了短发。现在看来，可能那不是我的错。😱

她每次去上海看我，都会闯祸，要么是碗，要么是酱油瓶，或者是煮东西忘了看着火流一地，给我倒汤会呼啦一下倒我身上。

2风花雪月心中住着小公主

我妈超级矫情，其矫情程度每次我和她打电话，我都感觉对面是席慕容。

她会哼哼唧唧扭扭捏捏拐弯抹角说我最近有没有想她，怎么最近没打电话给她。
如果我哪周没有打给她，她还会发小脾气。

可实际上是，她根本很少主动打电话给我，我说你想我可以打给我啊，她要么是说怕我工作忙，要么就说哎呀都是女儿打给妈妈，催你打就好像完成任务一样。

每次电话我也是报个平安几句话，但是我妈就和我聊天。我是个不喜欢聊天的人，经常不知道说啥，于是她又不乐意了，怎么和妈妈都没有话说了？

也就是说她希望我是心甘情愿的，主动的，心中有爱的，想到她并且打电话给她，然后每次电话都能激情四射的煲一个多小时电话粥，这才会令她满意。

似乎是谈恋爱才会有的场景啊。

她也会和我抱怨我爸，说他不能陪着一起出去吃喝玩乐，审美也不一致，三观不合，说我爸老古董。她总是羡慕我老公对我体贴，而且三观相同，兴趣相同，有共同语言。

而实际上我爸没有任何不良嗜好，收入稳定，性格豪爽，单纯就是众多中国直脾气小老头中的一位。他不喜欢出门吃外面的东西，而且腿脚不好也不喜欢旅游，也不喜欢花里胡哨的东西。

这么看来我妈脑海中的罗曼蒂克确实有点难以实现。😳

3真的很积极，真的很爱我

以上真的不是黑我妈，因为这些事让她真实而鲜活。 我妈是个面对生活非常积极的人。她的大大咧咧冒冒失失其实是因为她在努力的做每一件事，虽然过于用力了。 她的风花雪月是因为她一直对美好生活有些积极的向往，她心中总是在描绘一副华丽的场面。 她热爱出去玩，吃各种好吃的，买各种好玩的，去各种各样的地方和朋友们玩。 她每天保持健康积极的心态，早上会去打太极舞剑，我看过，和那些小老太太的气势完全不一样，无论是精神还是身形都非常帅气。 她喜欢尝试各种美食，虽然经常由于粗心而失败，作出稀奇古怪的味道。 她是我见过这个年纪操作各种手机app最溜的，网购毫无难度，表情包得心应手。 最重要的是，这个年纪，我终于明白，她真的很爱我，怀孕的几个月里，我看着她每天不停的给我准备各种吃的保证我的营养。 在我情绪低落的时候想各种办法陪我出去散心陪我聊天。 她虽然冒冒失失，给我的一日三餐四个菜却从来没有失败过。 她虽然心中有个小公主，却一直把我当公主宠，给我喂水果甜品零食，还有我头脑一热想吃的薯条。 有些事，不到这个岁数，你永远看不到，听不到，感觉不到。
 */
    if (userType == 'bu1siness') {
      for (i = 0; i < list.length; i++) {
        const { firstVideoSrc, secondVideoSrc, thirdVideoSrc } = list[i] || {};
        if (secondVideoSrc && secondVideoSrc.includes('video')) {
          try {
            const newPage = await browser.newPage();
            // await newPage.setViewport({ width: 1080, height: 800 });
            await newPage.goto(secondVideoSrc, TIME_OUT);
            // 检测到有视频为止
            await newPage.waitForSelector(
              '.xg-video-container video source',
              TIME_OUT,
            );

            // 获取评论区用户的信息
            let hasQin = await newPage.evaluate(
              async (COMMENT_LIST_SELECTOR) => {
                let commentList = [
                  ...document.querySelector(COMMENT_LIST_SELECTOR).children,
                ];
                console.log(commentList.at(-1).innerText);
                while (
                  !commentList.at(-1).innerText.includes('暂无评论') &&
                  !commentList.at(-1).innerText.includes('没有')
                ) {
                  window.scrollBy({ left: 0, top: 2 * window.innerHeight });
                  await new Promise((res) => setTimeout(() => res(), 600));
                  commentList = [
                    ...document.querySelector(COMMENT_LIST_SELECTOR).children,
                  ];
                }
                commentList.splice(-1, 1);
                hasQin = commentList.find((el) => {
                  const userInfoEl = el.querySelector('div:nth-child(2)');
                  if (!userInfoEl) return false;
                  const isQin =
                    userInfoEl.querySelector('a').innerText == '琴琴好物';
                  return isQin;
                });
                return hasQin;
              },
              COMMENT_LIST_SELECTOR,
            );
            if (!hasQin) {
              //类名 点赞kr4MM4DQ 有红心的NILc2fGS
              await delay(3000);

              await newPage.keyboard.down('Z');
              await newPage.keyboard.up('Z');
              await newPage.click('.public-DraftStyleDefault-block');
              // await newPage.keyboard.down('Control');
              // await newPage.keyboard.press('V');
              // await newPage.keyboard.up('Control');
              await delay(5000); // data-text
              await delay(1000);
              await newPage.keyboard.type(GET_COMMENT2(userType));
              await delay(2000);
              await newPage.keyboard.press('Enter'); // 回车
              await delay(3000);
            }
            newPage.close();
          } catch (error) {
            console.log('点赞可能失败', error);
          }
        }
      }
    }
    await browser.close();
    return { code: 0, data: {} };
  } catch (error) {
    console.log('error: 123', error);
    await browser.close();
    return { code: -1, errorMsg: error };
  }
};

module.exports = feature_userLike;
