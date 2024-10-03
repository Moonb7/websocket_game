import stageAssetData from '../assets/stage.json' with { type: 'json' };
import itemAssetData from '../assets/item.json' with { type: 'json' };
import itemUnlockAssetData from '../assets/item_unlock.json' with { type: 'json' };
import hurdlesAssetData from '../assets/hurdles.json' with { type: 'json' };

const gaemAssets = { stageAssetData, itemAssetData, itemUnlockAssetData, hurdlesAssetData };

export const getGameAssets = () => {
  return gaemAssets;
};
