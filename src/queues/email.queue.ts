import { Queue } from "bullmq";
import { redisConfig } from "../config/redis.config.js";

export const MAILER_QUEUE = "queue-mailer";

export const mailQueue = new Queue(MAILER_QUEUE, {
  connection: redisConfig,
});
