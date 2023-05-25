const express = require('express');
const { config } = require('./app');
require('./socket');
const app = express();

app.listen(config.APP_PORT, () => {
  console.log(`express服务在端口${config.APP_PORT}启动成功!,IO端口是${config.SOCKET_PORT}`);
});
