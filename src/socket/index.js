const { Server } = require('socket.io');
const { timeFormat } = require('../utils/dateFormat');
const { config } = require('../app');

const io = new Server(config.SOCKET_PORT, { cors: true });

const helper = {
  printSystemInfo() {
    console.log(`已连接${io.engine.clientsCount}个客户端`);
    console.log(`sockets count #${io.of('/').sockets.size} under '/' namespace`);
  }
};

const userList = [];
io.on('connection', (socket) => {
  helper.printSystemInfo();
  const userName = socket.handshake.query.userName;
  if (!userName) return;
  const userInfo = userList.find((user) => user.userName === userName);
  //若是已有用户则赋值新id,若是新用户则放入userList中
  userInfo ? ((userInfo.id = socket.id), (userInfo.status = 0)) : userList.push({ id: socket.id, userName, status: 0 });
  console.log('userList', userList);
  // io.emit:给包含自己在内的所有人发userList
  io.emit('online', { userList });
  // 监听客户端的send事件(通过targetId拿到目标Socket)
  socket.on('send', ({ fromUserName, targetId, msgText }) => {
    console.log('发送者', fromUserName, '接收者id', targetId, '消息:', msgText);
    const targetSocket = io.sockets.sockets.get(targetId);
    const toUser = userList.find((user) => user.id === targetId);
    targetSocket?.emit('receive', {
      fromUserName,
      toUserName: toUser.userName,
      msgText,
      dateTime: timeFormat(new Date().getTime())
    });
  });

  socket.on('disconnect', (reason, details) => {
    console.log('disconnect原因:', reason);
    const disUser = userList.find((user, index) => user.id === socket.id);
    if (disUser) {
      disUser.status = disUser.status === 0 ? 1 : 0;
    }
    io.emit('online', { userList });
    console.log(`${JSON.stringify(disUser)} socket disconnect`);
  });
});

module.exports = io;
