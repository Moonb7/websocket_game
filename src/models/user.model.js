import { redisClient } from '../init/redis.js';

const USERS_KEY = 'users';

// 유저를 등록하는 함수
export const addUser = async (user) => {
  await redisClient.set(`${USERS_KEY}:${user.uuid}`, JSON.stringify(user));
};

// 유저가 게임종료 접속 해제할시에 접속한 유저를 지우는 함수
export const removeUser = async (uuid) => {
  await redisClient.del(`${USERS_KEY}:${uuid}`);
};

// 모든 유저를 읽을떄 사용하는 함수
export const getUsers = async () => {
  // 해당 key다 가져오기
  const keys = await redisClient.keys(`${USERS_KEY}:*`);

  // console.log('---------', keys);
  const users = Promise.all(
    keys.map(async (key) => {
      const userJson = await redisClient.get(key);
      return JSON.parse(userJson);
    }),
  );
  return users;
};
const crud = await getUsers();
