import dotenv from "dotenv";
import logger from "./logger.config.js";

type ServerConfig = {
  PORT: number;
  REDIS_SERVER_URL: string;
  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
};

export function loadEnv() {
  dotenv.config();
  logger.info("Environment variables loaded");
}

loadEnv();

export const serverConfig: ServerConfig = {
  PORT: Number(process.env.PORT) || 3001,
  REDIS_SERVER_URL: process.env.REDIS_SERVER_URL || "redis://localhost:6379",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "password",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
};
