import { CLIENT_VERSION } from './Constants.js';

let userId = '';
let highScore = 0;
let userScore = 0;

// 실제 연결할 서버의 주소
const socket = io('http://localhost:3018', {
  query: {
    clientVersion: CLIENT_VERSION,
    userId,
  },
});

socket.on('response', (data) => {
  console.log('response: ', data);
  if (data.highScore) {
    highScore = data.highScore;
  }

  if (data.userScore) {
    console.log(data.userScore);
    userScore = data.userScore;
  }
});

socket.on('connection', (data) => {
  console.log('connection: ', data);
  if (data.uuid) {
    userId = data.uuid;
  }

  if (data.highScore) {
    highScore = data.highScore;
  }

  // if (data.userScore) {
  //   userScore = data.userScore;
  // }
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

export { sendEvent, highScore, userScore };
