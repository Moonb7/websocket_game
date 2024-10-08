import Item from './Item.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 12000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed, itemUnlock) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.itemUnlock = itemUnlock;

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 여기서 아이템생성
  // 현재 스테이지에 맞게 생성해야된다. 현재 스테이지 정보 필요
  createItem(currentStage) {
    const unlockInfo = this.itemUnlock.find((unlockInfo) => unlockInfo.stage_id === currentStage);
    const index = this.getRandomNumber(
      unlockInfo.item_id[0] - 1,
      unlockInfo.item_id[unlockInfo.item_id.length - 1] - 1,
    );
    const itemInfo = this.itemImages[index];
    // console.log(currentStage);
    // console.log(itemInfo);
    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    // 본격 아이템 생성
    const item = new Item(this.ctx, itemInfo.id, x, y, itemInfo.width, itemInfo.height, itemInfo.image);

    this.items.push(item);
  }

  update(gameSpeed, deltaTime, currentStage) {
    if (this.nextInterval <= 0) {
      this.createItem(currentStage);
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
