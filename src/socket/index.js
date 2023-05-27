const { Server } = require('socket.io');
const { timeFormat } = require('../utils/dateFormat');
const { config } = require('../app');

const io = new Server(config.SOCKET_PORT, { cors: true });
const userList = [];

const helper = {
  printSystemInfo() {
    const sockets = Array.from(io.of('/').sockets.values());
    const clientsCount = io.engine.clientsCount;
    console.log(`${clientsCount}个客户端建立连接`);
    if (sockets.length) {
      sockets.forEach((socket) => {
        const name = socket.handshake.query.userName;
        const userId = socket.handshake.query.userId;
        console.log(`客户端用户名----${name} socket.id---- ${userId}`);
      });
    } else {
      console.log('当前无客户端建立连接');
    }
  },
  handleCurrentUsers(userName) {
    const sockets = Array.from(io.of('/').sockets.values());
    return userName ? sockets.some((socket) => socket.handshake.query.userName === userName) : false;
  }
};

io.on('connection', (socket) => {
  helper.printSystemInfo();
  const userName = socket.handshake.query.userName;
  const clientsHasDisUser = helper.handleCurrentUsers(userName);
  !clientsHasDisUser && io.emit('online', { userList });
  // userList.length && io.emit('online', { userList });
  if (!userName) return;
  const userInfo = userList.find((user) => user.userName === userName);
  //若是已有用户则赋值新id,若是新用户则放入userList中
  if (userInfo) {
    userInfo.id = socket.id;
    userInfo.status = 0;
  } else {
    userList.push({ id: socket.id, userName, status: 0 });
  }

  console.log('当前userList', userList);
  io.emit('online', { userList }); // io.emit:给所有人发userList(包含自己)

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
    const userName = socket.handshake.query.userName;
    const clientsHasDisUser = helper.handleCurrentUsers(userName);
    console.log(`${userName}已离开一个客户端,剩余客户端${clientsHasDisUser ? '还有' : '没有'}该用户`);
    if (!clientsHasDisUser) {
      userList.find((user) => user.userName === userName).status = 1;
    }
    io.emit('online', { userList });
    console.log('disconnect后userList', userList);
  });
});

module.exports = io;
