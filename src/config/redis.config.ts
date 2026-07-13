import { Redis } from "ioredis";
import Redlock from "redlock";
import { serverConfig } from "./index.js";

// export const redisClient = new Redis({
//   host: serverConfig.REDIS_HOST,
//   port: Number(serverConfig.REDIS_PORT),
//   password: serverConfig.REDIS_PASSWORD,
// });

export const redisConfig = {
  host: serverConfig.REDIS_HOST,
  port: Number(serverConfig.REDIS_PORT),
  password: serverConfig.REDIS_PASSWORD,
};

function connectToRedis() {
  try {
    let connection: Redis;
    return () => {
      if (!connection) {
        connection = new Redis(redisConfig);
      }
      return connection;
    };
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw error;
  }
}

export const getRedisConnObject = connectToRedis();

export const redlock = new Redlock([getRedisConnObject()], {
  retryCount: 3,
  retryDelay: 200,
  retryJitter: 100,
  driftFactor: 0.01,
});
