'use strict';

const express = require('express'),
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

    // 获取下载抖音收藏列表
    app.post('/v1/getDyResource', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const body = req.body;
      const dataSource = await this.pupp.start('feature_downloadVideo', body);
      res.send({
        code: 0,
        data: { list: dataSource },
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
      const db = new Datastore({
        filename: path.resolve(__dirname, '../db/userComment.json'),
        autoload: true,
        timestampData: true,
      });
      const list = await this.pupp.start('feature_searchUsers', body);
      console.log('list',list)
      db.insert(list, (err, docs) => {
        resHandle(res, err, docs);
      });
    });

    // 搜索目标用户
    app.post('/v1/getDyUsersList', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const db = new Datastore({
        filename: path.resolve(__dirname, '../db/userComment.json'),
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

    // 给用户点赞
    app.post('/v1/execDyUsersLike', async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      const db = new Datastore({
        filename: path.resolve(__dirname, '../db/userComment.json'),
        autoload: true,
        timestampData: true,
      });
      const body = req.body;
      const { _id } = body || {};
      console.log(_id);
      db.find({ _id }, async (err, docs) => {
        if (err) {
          return res.json({
            code: -1,
            errorMsg: err,
          });
        }
        console.log(err);
        const { code } = await this.pupp.start('feature_userLike', {
          list: docs[0].commentList,
        });
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
