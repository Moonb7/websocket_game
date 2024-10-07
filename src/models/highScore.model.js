import { redisClient } from '../init/redis.js';

// 최고기록 갱신할떄마다 점수를 저장할 객체
const highScores = {};

const HIGH_SCORE_KEY = 'high_scores';

// 각 유저의 최고 점수 조회
export const getScore = (uuid) => {
  return Math.floor(highScores[uuid]);
};

// 현재 유저의 최고 점수갱신 및 생성
export const setScore = (uuid, highScore) => {
  highScores[uuid] = highScore; // 게임을 플레이하지 않을 수 있으니 여기서 생성과 동시에 갱신
};

// 역대 최고 점수를 반환할 함수
export const getHighestScore = () => {
  const scoreValues = Object.values(highScores);

  scoreValues.sort((a, b) => b - a); // 내림차순 정렬
  //const scoreKeys = Object.keys(highScores);
  //const uuid = scoreKeys.find((key) => highScores[key] === scoreValues[0]); // 가장 높은점수의 key 찾기 즉 uuid찾기

  return Math.floor(scoreValues[0]) ? Math.floor(scoreValues[0]) : 0; // uuid와 함께 최고점수 반환
};
