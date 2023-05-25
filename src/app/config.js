const dotenv = require('dotenv');
dotenv.config(); // 调用dotenv的config,.env文件中的所有值就被放入到process.env中了
module.exports = { APP_PORT, APP_HOST, SOCKET_PORT } = process.env; // 在process.env中取出APP_PORT放到该对象中并将该对象导出
