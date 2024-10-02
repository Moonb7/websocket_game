import express from 'express';
import { createServer } from 'http'; // 기본적으로 node.js 모듈에 포함되어 있는 기능이라고 합니다.
import dotenv from 'dotenv';
import initSocket from './init/socket.js';
import { loadGameAssets, getGameAssets } from './init/assets.js';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // payload를 자동으로 parsing 해준다
app.use(express.static('public'));
initSocket(server); // socketio 연결

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // 서버가 실행될때 이 곳에서 파일 읽음
  try {
    const assets = await loadGameAssets();
    //console.log(assets);
    //console.log(assets.stages.data[0]);
    //console.log(getGameAssets());
    console.log('Assets loaded successfully');
  } catch (err) {
    console.error('Failed to load game assets: ', err);
  }
});
