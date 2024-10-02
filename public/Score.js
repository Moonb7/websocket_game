import { sendEvent } from './Socket.js';
import stageAssetData from './assets/stage.json' with { type: 'json' };

class Score {
  score = 0;
  scorePerSecond = 1;
  HIGH_SCORE_KEY = 'highScore'; // 로컬로 최종 점수 저장할 키
  stageChange = true;
  currentStageId = 1000; // 시작시 기본이 1000 이니깐 class로 객체를 만들면 1000으로 시작
  targetStageId = this.currentStageId + 1;
  stage = 1;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * stageAssetData.data[this.stage - 1].scorePerSecond; // 여기서 i값이 아니라 음 스테이지 정보의 그 현재 스테이지와 다음 스테이지(현재 스테이지Id +1)
    // 점수가 10이 되면 stageChange 스테이지 이동이 가능한 조건이다.
    if (Math.floor(this.score) === stageAssetData.data[this.stage].score && this.stageChange) {
      // 조건이 문제네 음
      this.stageChange = false; // 다시 초기화
      sendEvent(11, { currentStage: this.currentStageId, targetStage: this.targetStageId }); // 스테이지 이동
      // 여기서 클라이언트 현재 스테이지도 바뀌고 타켓스테이지도 변경
      this.currentStageId += 1;
      console.log(this.currentStageId);
      this.targetStageId += 1;
      console.log(this.targetStageId);
      this.stage++;
      console.log(this.stage);
      console.log(stageAssetData.data[this.stage].score + 1);
    }

    if (
      Math.floor(this.score) === stageAssetData.data[this.stage - 1].score + 1 &&
      !this.stageChange
    ) {
      this.stageChange = true;
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
    this.stageChange = true;
    this.stage = 1;
    currentStageId = 1000; // 시작시 기본이 1000 이니깐 class로 객체를 만들면 1000으로 시작
    targetStageId = this.currentStageId + 1;
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
