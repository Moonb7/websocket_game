import { redisClient } from '../init/redis.js';

const USERS_KEY_PREFIX = 'users';

// 유저를 등록하는 함수
export const addUser = async (user) => {
  // ${USERS_KEY}:${user.uuid} ":" 콜론을 이용해 작성하면 콜론 왼쪽기준으로 해당 파일안에 데이터가 저장된다
  await redisClient.set(`${USERS_KEY_PREFIX}:${user.uuid}`, JSON.stringify(user));
};

// 유저가 게임종료 접속 해제할시에 접속한 유저를 지우는 함수
export const removeUser = async (uuid) => {
  const userKey = `${USERS_KEY_PREFIX}:${uuid}`;
  const user = await redisClient.get(userKey);
  if (user) {
    await redisClient.del(userKey);
    return JSON.parse(user);
  }
  return { message: 'User has been deleted.' };
};

// 모든 유저를 읽을떄 사용하는 함수
export const getUsers = async () => {
  // 해당 key다 가져오기
  const keys = await redisClient.keys(`${USERS_KEY_PREFIX}:*`);
  const users = Promise.all(
    keys.map(async (key) => {
      const userJson = await redisClient.get(key);
      return JSON.parse(userJson);
    }),
  );
  return users;
};

//한명의 유저 정보를 조회하는 함수
export const getUserById = async (uuid) => {
  const user = await redisClient.get(`${USERS_KEY_PREFIX}:${uuid}`);
  return user ? JSON.parse(user) : null;
};

// const test = await getUsers();

// console.log('-------test-----', test);
