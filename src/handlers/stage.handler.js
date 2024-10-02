// 유저는 스테이지를 하나씩 올라갈 수 있다. (1스테이지 -> 2, 2 -> 3)
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다. 100점일때는 2스테이지로 넘어가고 200이면 3스테이지 이런식으로...

import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  // currentStage, targetStage
  // 유저의 현재 스테이지 정보 불러오기
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  // 오름차순 -> 가장 큰 스테이지 ID를 확인 <- 유저의 현재 스테이지
  // 1번줄에서 작성한 것 처럼 유저가 계속해서 스테이지가 추가되면 가장 큰 스테이지 ID가 쌓이고 현재 유저의 스테이지일 테니깐 이런식으로 작성합니다.
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000; // 경과 시간

  // 예시: 만약에 1스테이지 -> 2스테이지로 넘어가는 중
  // 5 는 임의로 정한 오차범위 만약 클라이언트에서 받은 데이터가 105점수 보다 많으면 지연시간이 너무나 길어지면서 데이터 교환에 문제가 생겼을 것이다라 생각해 서버에선 이건 '에러처리하자'란 식으로 에러처리로 해주는걸로 정해집니다. 이렇듯 서버에서 에러로 처리할지 말지를 정해야 할때가 있습니다.
  if (elapsedTime < 10 || elapsedTime > 10.5) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }
  // 이제는 실제로 유저의 현재 점수를 가져와 게임에셋에 저장되어있는 점수와 해당 점수가 조건이 맞으면 stage로 넘어가는 로직 구현하기 즉 기획에 맞게 점수를 획득하면 스테이지 이동
  // 다음 스테이지의 조건에 대한 현재 점수와 비교하여
  console.log(currentStage);

  // targetStage 대한 검증 <- 게임에셋에 존재하는가? 넘어갈 스테이지 정보가 없다면
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // 다음 스테이지 id 추가
  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success! next Stage' };
};
