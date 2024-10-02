import { CLIENT_VERSION } from '../constants.js';
import { getGameAssets } from '../init/assets.js';
import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getUsers, removeUser } from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
  console.log(socket.id);
  removeUser(socket.id);

  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users: ', getUsers());
};

export const handleConnection = (socket, uuid) => {
  console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
  console.log(`Current users: `, getUsers());

  createStage(uuid);

  // 게임 시작하는 이벤트 핸들러 함수를 만들어 거기에 작성하였다
  // const { stages } = getGameAssets();
  // // stages 배열에서 0번째 = 첫번째 스테이지
  // setStage(uuid, stages.data[0].id);
  // console.log('Stage:', getStage(uuid));

  // 본인에게 보내는 메세지? connection이라는 이벤트를 통해서 연결된 유저에게 uuid의 데이터를 보내주는 것
  socket.emit('connection', { uuid });
};

// 클라에서 요청받은 이벤트를 실행하기 위한 함수 data에는 여러, 유저id, payload등이 있을 것이다.
export const handlerEvent = (io, socket, data) => {
  // 항상 특정 Event를 실행하기전 클라이언트와의 버전이 일치하는지 체크해야 된다. 그래야 클라이언트에서 작성한 로직들이 제대로 작성할 것이다
  // 클라이언트 버전 정보를 항상 주고 일치하게 하기 위해 clientVersion는 기획단계에서 명세를 작성할때 정한다
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId]; // handlerId 무조건 서버에서 핸들러 id를 넘겨 주기로 기획단계에서 결정하였습니다 패킷구조설계단계에서
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = handler(data.userId, data.payload); // data.userId, data.payload 기획에 따라 값을 이렇게 넣어준다

  // 모든 유저에게 보내야한다면 이런식으로 작성할 수 있습니다.
  if (response.broadcast) {
    io.emit('response', 'broadcast'); // io.emit을 하면 전체에게 메세지를 보낼 수 있다.
    return;
  }

  // socket.emit 해당 유저 한명에게 메세지를 보낸다.
  socket.emit('response', response); // 해당 객체를 바로 반환하는 걸로 결정한것이지 이것 또한 맘대로 메세지를 원하는 값을 보내주어도 된다.
};
