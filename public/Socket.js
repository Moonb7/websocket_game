import { CLIENT_VERSION } from './Constants.js';

// 실제 연결할 서버의 주소
const socket = io('http://localhost:3000', {
  query: {
    clientVersion: CLIENT_VERSION,
  },
});

let userId = null;
let highScore = 0;
socket.on('response', (data) => {
  console.log('response: ', data);
  if (data.highScore) {
    highScore = data.highScore;
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;
});

// 연결한 서버에 메세지 전송 데이터 전송
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,
    clientVersion: CLIENT_VERSION,
    handlerId,
    payload,
  });
};

export { highScore };
export { sendEvent };
