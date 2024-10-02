// key: uuid, value: array -> stage 정보는 배열
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
  stages[uuid] = [];
};

// 현재 플레이어의 스테이지를 조회하는 함수
export const getStage = (uuid) => {
  return stages[uuid];
};

// 다음에 스테이지 id를 넣어줄 함수
export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp });
};

export const clearStage = (uuid) => {
  stages[uuid] = [];
};
