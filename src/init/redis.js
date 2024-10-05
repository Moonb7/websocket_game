import dotenv from 'dotenv';
import redis from 'redis';

dotenv.config();

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// redis 서버 연결
try {
  await redisClient.connect();
} catch (err) {
  throw new Error(`레디스 연결 실패 ${err}`);
}

export { redisClient };
