import { addUser } from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid'; // v1, v2,v3 .... 여러 버전의 uuid를 생성하는 방식이 있습니다.
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

// 등록하는 handler
// 이 함수는 계속 대기하는 함수로 유저가 접속을 종료할때까지 계속 실행된 상태로 메모리에 남아 있는 것입니다. 클라이언트가 접속을 시도할때 최초로 실행되는 함수
const registerHandler = (io) => {
  // 유저가 접속했을떄
  io.on('connection', (socket) => {
    // 이벤트 처리
    const userUUID = uuidv4();
    // console.log(userUUID);
    addUser({ uuid: userUUID, socket: socket.id }); // soket.id는 새로 연결(접속?)을 할떄마다 새롭게 등록 그리고 uuid도 임의로 만든 uuid를 넣어준다

    // 유저가 접속해서 등록되었으면 현재 프로젝트는 스테이지정보를 넣어 주면 되지만 실제로는 유저가 가지고 있었던 아이템이나 스킬 기타등등을 넣어 주어야 된다.
    handleConnection(socket, userUUID);

    // 발생하는 모든 이벤트 처리
    socket.on('event', (data) => {
      handlerEvent(io, socket, data);
      console.log(data);
    });

    // 접속해제시 이벤트
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
