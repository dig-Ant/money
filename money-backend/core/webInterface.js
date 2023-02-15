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
    // 初始化服务器
    this.app = this.getServer();
    this.pupp = new Pupp();
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
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/download.json`),
        autoload: true,
        timestampData: true,
      });
      if (dataSource.code == -1) return;
      db.insert(dataSource, (err, docs) => {
        resHandle(res, err, docs);
      });
      // const db = new Datastore({
      //   filename: path.resolve(__dirname, `../db/download.json`),
      //   autoload: true,
      //   timestampData: true,
      // });
      // db.insert(
      //   [],
      //   (err, docs) => {
      //     resHandle(res, err, docs);
      //   },
      // );
    });

    // 查询下载列表
    app.post('/v1/getDyDownloadList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/download.json`),
        autoload: true,
        timestampData: true,
      });
      db.find({}).exec((err, docs) => {
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

    // 获取下载抖音收藏列表
    app.post('/v1/getDyYunyun', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/yunyunUser.json`),
        autoload: true,
        timestampData: true,
      });
      const list = await this.pupp.start('feature_yunyun', body);
      console.log('list', list);
      if (list.code == -1) return;
      db.insert(list, (err, docs) => {
        resHandle(res, err, docs);
      });
    });
    app.post('/v1/getDyYunyunList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/yunyunUser.json`),
        autoload: true,
        timestampData: true,
      });
      const { page = 1, pageSize = 10 } = body || {};
      const start = Math.floor((Number(page) - 1) * Number(pageSize));
      const end = Math.floor(start + Number(pageSize));
      db.find({})
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
    app.post('/v1/getProductmsgList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      // const db = new Datastore({
      //   filename: path.resolve(__dirname, `../db/${userType}User.json`),
      //   autoload: true,
      //   timestampData: true,
      // });
      var allJSON = {};
      const jsonList = fs.readdirSync(
        path.resolve(__dirname, '../downloadFiles/账号作品信息'),
      );
      jsonList.forEach((filename) => {
        if (
          filename.includes('.') &&
          !['index.js', '.DS_Store'].includes(filename)
        ) {
          allJSON[
            filename.split('.')[0]
          ] = require(`../downloadFiles/账号作品信息/${filename}`);
        }
      });
      // db.find({
      //   userType,
      // })
      //   .sort({ createdAt: -1 })
      //   .exec((err, docs) => {
      //     if (err) {
      //       res.end({
      //         code: -1,
      //         status: 'error',
      //         errorMsg: err.toString(),
      //       });
      //     } else {
      //       res.json({
      //         status: 'success',
      //         code: 0,
      //         data: {
      //           total: docs.length,
      //           list: docs.slice(start, end),
      //           page: Number(page),
      //           pageSize: Number(pageSize),
      //         },
      //       });
      //     }
      //   });
      res.send({
        code: 0,
        data: allJSON,
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
      console.log(body);
      const list = await this.pupp.start('feature_comment', body);
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
      const body = req.body;
      const { userType } = body;
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/${userType}User.json`),
        autoload: true,
        timestampData: true,
      });
      const list = await this.pupp.start('feature_searchUsers', body);
      console.log('list', list);
      if (list.code == -1) return;
      db.insert(list, (err, docs) => {
        resHandle(res, err, docs);
      });
    });

    // 搜索目标用户
    app.post('/v1/getDyUsersList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const { page = 1, pageSize = 10, userType = 'consumer' } = body || {};
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/${userType}User.json`),
        autoload: true,
        timestampData: true,
      });
      // const start = Math.floor((Number(page) - 1) * Number(pageSize));
      // const end = Math.floor(start + Number(pageSize));

      db.find({
        userType,
      })
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

    // 获取直播间用户
    app.post('/v1/getDyLiveUsers', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const list = await this.pupp.start('feature_liveusers', body);
      const db = new Datastore({
        filename: path.resolve(__dirname, '../db/liveUser.json'),
        autoload: true,
        timestampData: true,
      });
      console.log('list: ', list);
      // if (list.code == -1) return;
      db.insert(list, (err, docs) => {
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
      const db = new Datastore({
        filename: path.resolve(__dirname, '../db/liveUser.json'),
        autoload: true,
        timestampData: true,
      });
      const body = req.body;
      const { page = 1, pageSize = 10 } = body || {};
      const start = Math.floor((Number(page) - 1) * Number(pageSize));
      const end = Math.floor(start + Number(pageSize));
      db.find({})
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
      const body = req.body;
      const { _id, userType, mode } = body || {};
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/${userType}User.json`),
        autoload: true,
        timestampData: true,
      });
      db.find({ _id }, async (err, docs) => {
        if (err) {
          return res.json({
            code: -1,
            errorMsg: err,
          });
        }
        let code;
        if (mode == '点赞关注模式') {
          code = await this.pupp.start('feature_userFollow', {
            list: docs[0].followList,
            userType,
          }).code;
        } else {
          code = await this.pupp.start('feature_userLike', {
            list: docs[0].commentList,
            userType,
          }).code;
        }
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
      const body = req.body;
      const { _id, userType } = body || {};
      const db = new Datastore({
        filename: path.resolve(__dirname, `../db/${userType}User.json`),
        autoload: true,
        timestampData: true,
      });
      console.log(_id);
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
