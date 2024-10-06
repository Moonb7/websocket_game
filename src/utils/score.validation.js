import { getGameAssets } from '../init/assets.js';

export const scoreValidation = (serverTime, userStages, targetStageId, userItems) => {
  const errorScope = 3; // 오차 범위
  const { stages, items } = getGameAssets();
  let totalScore = 0;

  // 점수검증에서 1스테이지 점수 와 2스테이지 점수 + 3스테이지 점수 등을 나누어 더해주었을때 오차 범위가 5인 약간 이러한 형태로 가야될것같다
  // 현재로는 일단 1스테이지 점수는 현재 플레이어의 총 스테이지만큼 반복문을 돌고 각 스테이지의 점수를 더해서 총 점수를 가져오고 그점수를 오차범위에 들어오는지 비교하여 확인하기
  for (let i = 0; i < userStages.length; i++) {
    // 각 스테이지 구간에서 점수를 구한다.
    const stageEndTime = i === userStages.length - 1 ? serverTime : userStages[i + 1].timestamp; // 마지막 인덱스와 일치하면 즉 현재 스테이지면 현재 시간 serverTime을 할당 그외에는 바로 다음 스테이지 시작시간 즉 해당스테이지의 EndTime

    const elapsedTime = (stageEndTime - userStages[i].timestamp) / 1000; // 각 스테이지 마다의 경과한 시간을 구합니다.
    // console.log('--------elapsedTime--------', elapsedTime);
    const stageScore = elapsedTime * stages.data[i].scorePerSecond; // 경과한 시간에 데이터 테이블의 초당 점수를 곱해줍니다.
    // console.log('-------stageScore---------', stageScore);
    totalScore += stageScore;
  }

  // 획득한 아이템 점수를 더해 주기
  for (let i = 0; i < userItems.length; i++) {
    const itemId = userItems[i].itemId;

    const userItemInfo = userItems.find((item) => item.itemId === itemId);
    const itemInfo = items.data.find((item) => item.id === itemId);

    const itemTotalScore = itemInfo.score * userItemInfo.count;

    totalScore += itemTotalScore;
  }

  // console.log('-------totalScore---------', totalScore);
  const targetStage = stages.data.find((stage) => stage.id === targetStageId);

  let itemScore = 0;

  if (userItems.length > 0) {
    itemScore = items.data.find((item) => item.id === userItems[userItems.length - 1].itemId).score; // 유저가 가진 가장 최고점의 아이템 점수 가져와서 오차범위 더해주기
  }

  const errorScopeResult = Math.abs(targetStage.score - totalScore);
  if (errorScopeResult > errorScope + itemScore) return false;
  else return true;
};

// 최종 점수구하는 함수
export const getTotalScore = (serverTime, userStages, userItems) => {
  const { stages, items } = getGameAssets();
  let totalScore = 0;

  // 점수검증에서 1스테이지 점수 와 2스테이지 점수 + 3스테이지 점수 등을 나누어 더해주었을때 오차 범위가 5인 약간 이러한 형태로 가야될것같다
  // 현재로는 일단 1스테이지 점수는 현재 플레이어의 총 스테이지만큼 반복문을 돌고 각 스테이지의 점수를 더해서 총 점수를 가져오고 그점수를 오차범위에 들어오는지 비교하여 확인하기
  for (let i = 0; i < userStages.length; i++) {
    // 각 스테이지 구간에서 점수를 구한다.
    const stageEndTime = i === userStages.length - 1 ? serverTime : userStages[i + 1].timestamp; // 마지막 인덱스와 일치하면 즉 현재 스테이지면 현재 시간 serverTime을 할당 그외에는 바로 다음 스테이지 시작시간 즉 해당스테이지의 EndTime

    const elapsedTime = (stageEndTime - userStages[i].timestamp) / 1000; // 각 스테이지 마다의 경과한 시간을 구합니다.
    // console.log('--------elapsedTime--------', elapsedTime);
    const stageScore = elapsedTime * stages.data[i].scorePerSecond; // 경과한 시간에 데이터 테이블의 초당 점수를 곱해줍니다.
    // console.log('-------stageScore---------', stageScore);
    totalScore += stageScore;
  }

  // 획득한 아이템 점수를 더해 주기
  for (let i = 0; i < userItems.length; i++) {
    const itemId = userItems[i].itemId;

    const userItemInfo = userItems.find((item) => item.itemId === itemId);
    const itemInfo = items.data.find((item) => item.id === itemId);

    const itemTotalScore = itemInfo.score * userItemInfo.count;

    totalScore += itemTotalScore;
  }

  return totalScore;
};
