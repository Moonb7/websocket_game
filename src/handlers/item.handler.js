import { getGameAssets } from '../init/assets.js';
import { getStage } from '../models/stage.model.js';
import { addItem, getItems } from '../models/item.model.js';

export const addItemHandler = (userId, payload) => {
  // 현재 클라이언트에서 보내준 payload 값 : item, itemScore, currentStage (획득한 아이템Id와 아이템 점수 현재 스테이지Id를 받습니다.)

  const userItems = getItems(userId);
  if (!userItems) {
    return { status: 'fail', message: 'No items found for user' };
  }

  // 해당 스테이지에 획득할수 있는 아이템인지 검증하기 위해 현재 스테이지를 찾는다
  const currentStages = getStage(userId);
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트 vs 서버 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  // 게임에셋에 존재하는가? 게임 데이터와 비교
  const { items, itemUnlocks } = getGameAssets();
  if (!items.data.some((item) => item.id === payload.item)) {
    return { status: 'fail', message: 'ItemInfo not found' };
  }
  // 현재 스테이지에서 획득할수 있는 아이템정보 찾기
  const currentStageItemUnlockInfo = itemUnlocks.data.find(
    (itemUnlock) => itemUnlock.stage_id === payload.currentStage,
  );
  // console.log('--------currentStageItemUnlockInfo--------', currentStageItemUnlockInfo);

  // 해당 스테이지에서 얻을 수 있는 아이템인지 체크
  if (!currentStageItemUnlockInfo.item_id.some((itemId) => itemId === payload.item)) {
    return { status: 'fail', message: 'This item cannot be obtained at the current stage.' };
  }

  // 에셋에 있는 데이터 아이템 점수와 동일한지 체크 클라이언트에서 받은 점수 정보와 에셋 데이터와 비교하여 맞으면 통과
  const itemInfo = items.data.find((item) => item.id === payload.item);
  if (itemInfo.score !== payload.itemScore) {
    return { status: 'fail', message: 'This item score mismatch' };
  }

  // 만약 게임데이터에서 아이템 생성시간이 정해지게 되어있다면 해당 생성시간이후에 획득을 했는지 검증
  // 그러면 생성된 아이템을 저장하는 모델링도 있어야 될 거 같은데 그래야 생성시간을 저장하여 비교후 그래야 현재 시간과 비교후 검증을 할 수 있을 것 같다.
  // 따로 핸들러를 만들고 거기서 클라이언트에서 페이로드 데이터는 생성한 아이템 id, 생성된 시간 등의 저장할 사항의 패킷구조를 가진다. 이거는 나중에 도전까지하고 하자 일단 보류

  const serverTime = Date.now(); // 현재 타임스탬프
  // 다음 스테이지 id 추가
  addItem(userId, payload.item, serverTime); // 다음스테이지의 시작 타임 저장
  // console.log('Items :', getItems(userId));

  return { status: 'get item!' };
};
