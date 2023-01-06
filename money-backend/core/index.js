const WebInterface = require('./webInterface');

const core = async () => {
  // 启动db
  // 启动服务器
  const webServer = new WebInterface({ port: 8008 });
  webServer
    .start()
    .then(({ ip, port }) => {
      console.log(`[MONEY] backend started on port:  http://localhost:${port}`);
      console.log(`[MONEY] backend started on port:  http://127.0.0.1:${port}`);
      console.log(`[MONEY] backend started on port:  http://${ip}:${port}`);
    })
    .catch((e) => {
      console.log('error', e);
    });
};

module.exports = core;
