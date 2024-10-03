import { sendEvent } from './Socket.js';
import { getGameAssets } from './init/assets.js';

const { stageAssetData } = getGameAssets();

class Score {
  score = 0;
  scorePerSecond = 1;
  HIGH_SCORE_KEY = 'highScore'; // 로컬로 최종 점수 저장할 키
  stageChange = true;
  currentStageId = stageAssetData.data[0].id;
  stage = 1;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * stageAssetData.data[this.stage - 1].scorePerSecond;
    this.scoreCheckStageChange();
  }

  scoreCheckStageChange() {
    if (
      stageAssetData.data[this.stage] &&
      Math.floor(this.score) >= stageAssetData.data[this.stage].score &&
      this.stageChange
    ) {
      this.stageChange = false;
      sendEvent(11, { currentStage: this.currentStageId, targetStage: this.currentStageId + 1 }); // 스테이지 이동
      // 여기서 클라이언트 현재 스테이지도 바뀌고 타켓스테이지도 변경
      // 근데 서버에서 바뀐 스테이지 정보를 넘겨주어서 저장하는건가?
      this.currentStageId += 1;
      this.stage++;
    }

    if (Math.floor(this.score) >= stageAssetData.data[this.stage - 1].score + 1 && !this.stageChange) {
      // stageChange 다시 초기화
      this.stageChange = true;
    }
  }

  getItem(itemId) {
    this.score += 0; // 음 0이 아니라 아이템의 score를 넣어 주면 되네
  }

  reset() {
    this.score = 0;
    this.stageChange = true;
    this.stage = 1;
    this.currentStageId = stageAssetData.data[0].id; // 시작시 기본이 1000 이니깐 class로 객체를 만들면 1000으로 시작
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score)); // 최종 점수 로컬 저장소에 저장
    }
  }

  getScore() {
    return this.score;
  }

  getStage() {
    return this.currentStageId;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)); // 로컬 저장소에서 최고 점수
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;
    const stageX = highScoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);
    const currentStagePadded = this.stage.toString();

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`STAGE ${currentStagePadded}`, stageX, y);
  }
}

export default Score;
