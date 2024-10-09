# 웹소켓 게임 만들기

### 내일배움캠프 6기

크롬 다이노 게임을 웹소켓을 이해하고 사용하여 구현하는 내일배움캠프 개인과제입니다.

### 게임 방법

스페이스바(점프키)로 진행이 됩니다.

### 게임 정보

목표 점수에 도달하면 다음 스테이지를 이동합니다.
각 스테이지마다 얻을 수 있는 점수와 아이템이 달라집니다!

### 개발기간

2024.09.27 ~

### 구현내용

1. 필수 기능
   - [x] 시간에 따른 점수 획득
   - [x] 스테이지 구분 및 스테이지에 따른 점수 획득 구분
   - [x] 아이템 획득
   - [x] 아이템 획득 시 점수 획득
   - [x] 스테이지 별 아이템 생성 구분
   - [x] 아이템 별 획득 점수 구분
2. 도전 기능
   - [x] socket을 이용한 Broadcast기능 추가
   - [x] 최고 점수 저장 관리
   - [x] 유저 정보 연결 (각 유저의 최고 점수 저장)
   - [ ] redis연동 정보 저장 - 진행중

### 패킷 구조

클라이언트 에서 보낼 패킷 구조

- 공통 패킷 구조

| 필드명        | 타입 | 설명                    |
| ------------- | ---- | ----------------------- |
| userId        | int  | 요청을 보내는 유저의 ID |
| clientVersion | int  | 현재 클라이언트 버전    |
| handlerId     | int  | 해당 이벤트 Id          |
| payload       | int  | 요청내용                |

- 각 이벤트의 payload 내용

게임 시작시
필드명| 타입 | 설명
------|-----|-----
timestamp | int | 현재 시간 (게임 시작 시간)

게임 오버시
필드명| 타입 | 설명
------|-----|-----
gameEndTime | int | 현재 시간 (게임 오버 시간)
score | int | 현재 스코어 (서버에서 계산한 점수와 비교하고 저장하기위해)

스테이지 이동시
필드명| 타입 | 설명
------|-----|-----
currentStage | int | 현재 스테이지 ID
targetStage | int | 이동할 스테이지 ID
score | int | 현재 스코어 (서버에서 계산한 점수와 비교하기 위해)

아이템 획득시

| 필드명       | 타입 | 설명                                                               |
| ------------ | ---- | ------------------------------------------------------------------ |
| item         | int  | 획득한 itemID                                                      |
| itemScore    | int  | 획득한 아이템의 점수 (서버에서 검증을 위해)                        |
| currentStage | int  | 현재 스테이지ID (현재 스테이지에 획득하는 아이템인지 검증하기위해) |
