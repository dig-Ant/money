('use strict');

const express = require('express'),
  fs = require('fs'),
  Datastore = require('nedb'),
  ip = require('ip'),
  juicer = require('juicer'),
  compress = require('compression'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  path = require('path'),
  Pupp = require('./pupp');
const mkdirp = require('mkdirp');

const allJSON = {};
try {
  mkdirp.sync(path.resolve(__dirname, '../downloadFiles/账号作品信息'));
} catch (error) {
  console.log('创建下载目录失败', error);
}
const jsonList = fs.readdirSync(
  path.resolve(__dirname, '../downloadFiles/账号作品信息'),
);
jsonList.forEach((filename) => {
  if (filename.includes('.') && !['index.js', '.DS_Store'].includes(filename)) {
    allJSON[
      filename.split('.')[0]
    ] = require(`../downloadFiles/账号作品信息/${filename}`);
  }
});
class WebInterface {
  constructor(props) {
    const { port } = props || {};
    this.port = port;
    this.ipAddress = ip.address();

    this.init();
  }

  init() {
    this.db = new Datastore({
      filename: './db/dataSource.json',
      autoload: true,
      timestampData: true,
    });
    this.consumerDB = new Datastore({
      filename: path.resolve(__dirname, `../db/consumerUser.json`),
      autoload: true,
      timestampData: true,
    });
    this.businessDB = new Datastore({
      filename: path.resolve(__dirname, `../db/businessUser.json`),
      autoload: true,
      timestampData: true,
    });
    this.agedDB = new Datastore({
      filename: path.resolve(__dirname, `../db/agedUser.json`),
      autoload: true,
      timestampData: true,
    });
    this.downloadDB = new Datastore({
      filename: path.resolve(__dirname, `../db/download.json`),
      autoload: true,
      timestampData: true,
    });
    this.yunyunDB = new Datastore({
      filename: path.resolve(__dirname, `../db/yunyunUser.json`),
      autoload: true,
      timestampData: true,
    });
    this.liveDB = new Datastore({
      filename: path.resolve(__dirname, `../db/liveUser.json`),
      autoload: true,
      timestampData: true,
    });
    this.followUsersDB = new Datastore({
      filename: path.resolve(__dirname, `../db/followUsers.json`),
      autoload: true,
      timestampData: true,
    });
    // 初始化服务器
    this.app = this.getServer();
    this.pupp = new Pupp();
  }
  getUserDB(userType) {
    return this[userType + 'DB'];
  }
  // 获取
  getServer() {
    const app = express();
    // 开启gzip压缩
    app.use(compress());
    // 做一下标记(没啥子用)
    app.use((req, res, next) => {
      res.setHeader('note', 'THIS IS A REQUEST FROM MONEY WEB INTERFACE');
      return next();
    });
    // 解析添加req中的body
    app.use(bodyParser.json());
    app.use(cors());

    this.interface(app);

    return app;
  }

  // 启用服务
  start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port);
      resolve({
        port: this.port,
        ip: this.ipAddress,
      });
    });
  }

  // 关闭服务
  close() {
    return new Promise((resolve, reject) => {
      this.server && this.server.close();
      this.server = null;
      resolve();
    });
  }

  interface(app) {
    app.get('/test', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      console.log('req: ', req);
      res.send({
        code: 0,
        data: { list: 1 },
      });
    });

    // 下载
    app.post('/v1/getDyResource', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const dataSource = await this.pupp.start('feature_downloadVideo', body);

      if (dataSource.code == -1) return;
      this.downloadDB.insert(dataSource, (err, docs) => {
        resHandle(res, err, docs);
      });
    });
    app.post('/v1/execDyFollowList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      this.followUsersDB
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          console.log('docs: ', docs);
          if (err) {
            res.end({
              code: -1,
              status: 'error',
              errorMsg: err.toString(),
            });
          } else {
            res.json({
              status: 'success',
              code: 0,
              data: docs,
              // data: {
              //   total: docs.length,
              //   list: docs.slice(start, end),
              //   page: Number(page),
              //   pageSize: Number(pageSize),
              // },
            });
          }
        });
    });

    // 查询下载列表
    app.post('/v1/getDyDownloadList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      /* this.downloadDB.insert([]); */
      this.downloadDB.find({}).exec((err, docs) => {
        console.log('docs: ', docs);
        if (err) {
          res.end({
            code: -1,
            status: 'error',
            errorMsg: err.toString(),
          });
        } else {
          res.json({
            status: 'success',
            code: 0,
            data: docs,
            // data: {
            //   total: docs.length,
            //   list: docs.slice(start, end),
            //   page: Number(page),
            //   pageSize: Number(pageSize),
            // },
          });
        }
      });
    });

    // 删除
    app.post('/v1/execDyDelete', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const { userType, _id } = req.body;
      const db = this.getUserDB(userType);
      db.remove({ _id }, {}, (err, numRemoved) => {
        resHandle(res, err, numRemoved);
      });
    });
    // 删除单条用户
    app.post('/v1/execDyDeleteSingle', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const { userType, _id, listType, userName } = req.body;
      const db = this.getUserDB(userType);
      db.find({ _id }).exec((err, doc) => {
        let updateList = doc[0][listType].filter(
          (e) => e.userName !== userName,
        );
        db.update(
          { _id },
          {
            [listType]: updateList,
          },
          {},
          (err, numReplaced) => {
            resHandle(res, err, numReplaced);
          },
        );
      });
    });
    // 获取下载抖音收藏列表
    app.post('/v1/getDyYunyun', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const list = await this.pupp.start('feature_yunyun', body);
      console.log('list', list);
      if (list.code == -1) return;
      this.yunyunDB.insert(list, (err, docs) => {
        resHandle(res, err, docs);
      });
    });
    app.post('/v1/getDyYunyunList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const { page = 1, pageSize = 10 } = body || {};
      const start = Math.floor((Number(page) - 1) * Number(pageSize));
      const end = Math.floor(start + Number(pageSize));
      this.yunyunDB
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          if (err) {
            res.end({
              code: -1,
              status: 'error',
              errorMsg: err.toString(),
            });
          } else {
            res.json({
              status: 'success',
              code: 0,
              data: {
                total: docs.length,
                list: docs.slice(start, end),
                page: Number(page),
                pageSize: Number(pageSize),
              },
            });
          }
        });
    });

    // 获取账号作品信息
    app.post('/v1/getProductmsg', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const dataSource = await this.pupp.start('feature_productmsg', body);
      res.send({
        code: 0,
        data: { list: dataSource },
      });
    });
    // 获取账号作品信息列表
    app.post('/v1/getProductUser', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      console.log(allJSON);
      res.send({
        code: 0,
        data: Object.keys(allJSON),
      });
    });
    app.post('/v1/getProductmsgList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const { user } = body;
      res.send({
        code: 0,
        data: allJSON[user],
      });
    });

    // 打开chromium浏览器
    app.post('/v1/loginPup', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      await this.pupp.start('feature_login');
      res.send({
        code: 0,
        data: {},
      });
    });

    // 关闭
    app.post('/v1/logoutPup', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      await this.pupp.start('feature_logout');
      res.send({
        code: 0,
        data: {},
      });
    });
    // link
    app.post('/v1/grtLink', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const list = await this.pupp.start('feature_grtLink');
      res.send({
        code: 0,
        data: list,
      });
    });

    // 搜索抖音列表
    app.post('/v1/getDySearch', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const list = await this.pupp.start('feature_search', body);
      res.send({
        code: 0,
        data: { list },
      });
    });
    // 搜索抖音评论列表
    app.post('/v1/getDyComment', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      let { index, limitLen, userURL, keyword } = body;
      if (userURL) {
        keyword = await this.pupp.start('feature_getPageVideo', body);
        console.log(keyword);
      }
      const list = await this.pupp.start('feature_comment', {
        keyword,
        limitLen,
      });
      res.send({
        code: 0,
        data: { list },
      });
    });

    const resHandle = (res, err, list) => {
      if (err) {
        res.json({
          status: 'error',
          code: -1,
          errorMsg: err,
        });
      } else {
        res.json({
          status: 'success',
          data: { list },
          code: 0,
        });
      }
    };

    // 下载目标用户
    app.post('/v1/getDyUsers', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const { userType } = req.body;
      const db = this.getUserDB(userType);
      const list = await this.pupp.start('feature_searchUsers', req.body);
      if (list.code == -1) return;
      db.insert(list, (err, docs) => {
        resHandle(res, err, docs);
      });
    });

    // 搜索目标用户
    app.post('/v1/getDyUsersList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const { user = '', userType = 'consumer' } = req.body;
      const db = this.getUserDB(userType);
      const query = user ? { name: user } : {};
      db.find(query)
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          if (err) {
            res.end({
              code: -1,
              status: 'error',
              errorMsg: err.toString(),
            });
          } else {
            res.json({
              status: 'success',
              code: 0,
              data: {
                total: docs.length,
                list: docs, //.slice(start, end),
                // page: Number(page),
                // pageSize: Number(pageSize),
              },
            });
          }
        });
    });
    // 搜索目标用户名
    app.post('/v1/getDyUsersName', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const { userType = 'consumer' } = req.body;
      const db = this.getUserDB(userType);
      db.find()
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          let nameList = docs.map((e) => e.name).filter((e) => !!e);
          nameList = [...new Set(nameList)].map((e) => ({
            value: e,
            label: e,
          }));
          if (err) {
            res.end({
              code: -1,
              status: 'error',
              errorMsg: err.toString(),
            });
          } else {
            res.json({
              status: 'success',
              code: 0,
              data: nameList,
            });
          }
        });
    });

    // 获取直播间用户
    app.post('/v1/getDyLiveUsers', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const list = await this.pupp.start('feature_liveusers', body);
      console.log('list: ', list);
      // if (list.code == -1) return;
      this.liveDB.insert(list, (err, docs) => {
        resHandle(res, err, docs);
      });
      // res.send({
      //   code: 0,
      //   data: { list },
      // });
    });
    // 搜索直播间用户
    app.post('/v1/getDyLiveUserList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const { page = 1, pageSize = 10 } = body || {};
      const start = Math.floor((Number(page) - 1) * Number(pageSize));
      const end = Math.floor(start + Number(pageSize));
      this.liveDB
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          if (err) {
            res.end({
              code: -1,
              status: 'error',
              errorMsg: err.toString(),
            });
          } else {
            res.json({
              status: 'success',
              code: 0,
              data: {
                total: docs.length,
                list: docs.slice(start, end),
                page: Number(page),
                pageSize: Number(pageSize),
              },
            });
          }
        });
    });

    app.post('/v1/getDyText', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const dataSource = await this.pupp.start('feature_getText', body);
      res.send({
        code: 0,
        data: { list: dataSource },
      });
    });

    // 给用户点赞
    app.post('/v1/execDyUsersLike', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const { _id, userType, listType = 'commentList' } = req.body;
      const db = this.getUserDB(userType);
      db.find({ _id }, async (err, docs) => {
        if (err) {
          return res.json({
            code: -1,
            errorMsg: err,
          });
        }
        const feature =
          listType === 'followList' ? 'feature_userFollow' : 'feature_userLike';
        let code = await this.pupp.start(feature, {
          list: docs[0][listType],
          listType,
          userType,
          _id,
        }).code;
        if (code !== 0) {
          return res.json({
            code: -1,
            errorMsg: '点赞报错',
          });
        }
        return res.json({
          code: 1,
          data: '成功',
        });
      });
    });

    // execDyVidelMsg
    app.post('/v1/execDyVidelMsg', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const { _id, userType } = (req.body = {});
      const db = this.getUserDB(userType);
      db.find({ _id }, async (err, docs) => {
        if (err) {
          return res.json({
            code: -1,
            errorMsg: err,
          });
        }
        console.log(docs);
        const dataSource = await this.pupp.start('feature_getVideoMsg', {
          list: docs[0].commentList,
        });
        res.send({
          code: 0,
          data: dataSource,
        });
      });
    });

    // 给最近的点赞做评论
    app.post('/v1/execDyLike', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const dataSource = await this.pupp.start('feature_like', body);
      res.send({
        code: 0,
        data: { list: dataSource },
      });
    });

    // TODO 以下是不用接口 map 规则相关接口
    // 获取规则列表
    app.get('/api/getRuleList', (req, res) => {
      const { page = 1, pageSize = 10 } = req.query || {};
      const start = Math.floor((Number(page) - 1) * Number(pageSize));
      const end = Math.floor(start + Number(pageSize));
      res.setHeader('Access-Control-Allow-Origin', '*');
      this.db
        .find({})
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          if (err) {
            res.end(err.toString());
          } else {
            res.json({
              status: 'success',
              code: 0,
              data: {
                count: docs.length,
                list: docs.slice(start, end),
                page: Number(page),
                pageSize: Number(pageSize),
              },
            });
          }
        });
    });

    /* 删除 */
    app.post('/api/deleteRule', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      this.db.remove({ _id: body._id }, {}, (err, numRemoved) => {
        if (err) {
          res.json({
            status: 'error',
            code: -1,
            errorData: err,
          });
        } else {
          this.init();
          res.json({
            status: 'success',
            code: 0,
          });
        }
      });
    });
  }
}

module.exports = WebInterface;
