import { redisClient } from '../init/redis.js';

// DB대신 저장소
// 접속한 유저를 등록할 배열변수
const users = [];

// 유저를 등록하는 함수
export const addUser = async (user) => {
  users.push(user);
  await redisClient.set('user_key', JSON.stringify(users));
};

// 유저가 게임종료 접속 해제할시에 접속한 유저를 지우는 함수
export const removeUser = (socketId) => {
  const index = users.findIndex((user) => user.socket === socketId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// 유저를 읽을떄 사용하는 함수
export const getUsers = async () => {
  const userJson = await redisClient.get('user_key');
  const usersRedis = JSON.parse(userJson);
  return usersRedis;
};
