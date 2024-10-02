import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
  const io = new SocketIO(); // SocketIO 서버를 생성
  io.attach(server); // attach를 통해 실제 서버를 연결해줍니다.

  registerHandler(io);
};

export default initSocket;
