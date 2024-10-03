import { createStage, getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import { createItem } from '../models/item.model.js';

export const gameStart = (uuid, payload) => {
  // 스테이지에 따라서 더 높은 점수 획득
  // 1스테이지, 0점 -> 1점씩
  // 2스테이지, 1000점 -> 2점씩

  // 현재 프로젝트에선 접속하자 마자 스테이지의 점보 점수에 대한 정보를 넣어주기로 했다.
  const { stages } = getGameAssets();

  createStage(uuid);
  createItem(uuid);

  // 현재 프로젝트는 편의를 위해 클라이언트에서 현재 시작한 시간을 서버에 저장하는 형식입니다.
  // 하지만 원래는 클라이언트에서 받은 데이터는 서버에 저장을 하지 않습니다.
  // 클라이언트에서 변질된 데이터가 있다는 위험때문에 저장을 거의 저장을 하지않습니다. 서버 기준으로 검증된 데이터는 저장하지 않습니다.
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트는 게임 종료시 서버에게 게임 졸료시점 타임스탬프와 총 점수를 줄 것 입니다.
  const { timestamp: gameEndTime, score } = payload; // timestamp:gameEndTime 이런 형태로 쓰면 객체 구조 분해 할당으로 받고 나서 그 변수의 이름을 바꿀수 있습니다.
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    console.log(stageEndTime - stage.timestamp);
    totalScore += stageDuration; // 초당 1점
  });

  // 점수와 타임 스탬프 검증
  // 오차범위 5
  // 클라이언트에게 받은 score와 서버에서 계산한 totalScore와 비교했을때 오차범위가 5보다 크면 이건 서버 또는 클라이언트에서 이상이 생겨 점수가 너무차이가나면 오류로 처리하는 걸로 했습니다.
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }
  // DB 저장한다고 가정을 하면
  // 저장
  // setResult(userId, score, timestamp) 이런식으로 db에 저장을 할 수 도 있을 것 같다

  return { status: 'success', message: 'Game ended', score }; // totalScore가 아닌 클라이언트에서 받은 score를 저장해 주면서 유저가 납득할만한 점수를 저장하였다
};
