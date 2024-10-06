// 현재는 클라에서 로컬로 최고점수를 저장하고 있어 서버에서 저장하고
// 처음 socket 연결할떄 클라들에게 brodcast해서 최고 점수 알려주고
// 게임 오버 시점에 최고기록이 바뀌었다면 클라이언트들에게 brodcast해서 최고 점수를 알려주어 갱신하면 될 것 같다.
// 일단 게임오버된 시점에서 실행되는 함수들인 것이네

// 최고기록 갱신할떄마다 점수를 저장할 객체
const highScores = {};

export const getScore = (uuid) => {
  return Math.floor(highScores[uuid]);
};

// 현재 유저의 최고 점수갱신 및 생성
export const setScore = (uuid, highScore) => {
  if (highScores[uuid]) {
    highScores[uuid] = highScore; // 갱신
  } else {
    createScore(uuid); // 게임을 플레이하지 않을 수 있으니 여기서 생성하자
    highScores[uuid] = highScore;
  }
};

export const createScore = (uuid) => {
  highScores[uuid] = [];
};

// 역대 최고 점수를 반환할 함수
export const getHighestScore = () => {
  const scoreValues = Object.values(highScores);

  scoreValues.sort((a, b) => b - a); // 내림차순 정렬
  //const scoreKeys = Object.keys(highScores);
  //const uuid = scoreKeys.find((key) => highScores[key] === scoreValues[0]); // 가장 높은점수의 key 찾기 즉 uuid찾기

  return Math.floor(scoreValues[0]) ? Math.floor(scoreValues[0]) : 0; // uuid와 함께 최고점수 반환
};
