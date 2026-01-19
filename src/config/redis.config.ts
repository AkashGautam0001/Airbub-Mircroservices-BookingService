import Redis from "ioredis";
import Redlock from "redlock";
import { serverConfig } from "./index.js";

export const redisClient = new Redis({
  host: serverConfig.REDIS_HOST,
  port: Number(serverConfig.REDIS_PORT),
  password: serverConfig.REDIS_PASSWORD,
});

export const redlock = new Redlock([redisClient], {
  retryCount: 3,
  retryDelay: 200,
  retryJitter: 100,
  driftFactor: 0.01,
});
