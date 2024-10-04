import { getGameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';
import { scoreValidation } from '../utils/score.validation.js';
import { getItems } from '../models/item.model.js';

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 아이템 정보 불러오기
  const currentItems = getItems(userId);
  // currentStage, targetStage
  // 유저의 현재 스테이지 정보 불러오기
  const currentStages = getStage(userId);
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

  // targetStage 대한 검증 <- 게임에셋에 존재하는가? 넘어갈 스테이지 정보가 없다면
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프
  if (!scoreValidation(serverTime, currentStages, payload.targetStage, currentItems)) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // 다음 스테이지 id 추가
  setStage(userId, payload.targetStage, serverTime); // 다음스테이지의 시작 타임 저장

  return { status: 'success! next Stage' };
};
