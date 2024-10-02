import { gameEnd, gameStart } from './game.handler.js';
import { moveStageHandler } from './stage.handler.js';

// 클라이언트가 핸들러 Id를 받았을때
// 이런 핸들러 id관리하는 방식도 있지만 현재프로젝트에선 하드코딩으로 작성하였다

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler, // 11은 임이의 사용할 키이고 실제 클라이언트가 서버에서 핸들러 Id를 받아 '11'메세지를 받으면 그 id에 맞는 이벤트를 실행합니다. 여기선 '11'id이면 moveStageHandler 이벤트를 동작하라는 의미입니다.
};

export default handlerMappings;
