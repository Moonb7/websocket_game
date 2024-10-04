// 유저마다 획득한 아이템을 담을 객체
const items = {};

// 시작시 해당유저 아이템 박스 초기화
export const createItem = (uuid) => {
  items[uuid] = [];
};

// 현재 플레이가 획득한 아이템을 불러오는 함수
export const getItems = (uuid) => {
  return items[uuid];
};

// 아이템 획득시 등록하는 함수
// timestamp는 획득한 시간을 저장한다
export const addItem = (uuid, itemId, timestamp) => {
  const isItem = items[uuid].find((item) => item.itemId === itemId);
  if (isItem) {
    isItem.timestamp = timestamp; // 이게 바로되네 배열이라 주소를 참조해서 되는건가보네
    isItem.count += 1;
  } else {
    items[uuid].push({ itemId, timestamp, count: 1 });
  }
};

// 스테이지 변환시음 일단 보류 아마 안쓸거 같기도하다
// export const clearItems = (uuid) => {
//   items[uuid] = [];
// };
