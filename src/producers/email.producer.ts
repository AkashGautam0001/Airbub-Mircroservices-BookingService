import { NotificationDto } from "../dto/notification.dto.js";
import { mailQueue } from "../queues/email.queue.js";

export const MAILER_PAYLOAD = "payload:mail";

export const addEmailToQueue = async (payload: NotificationDto) => {
  await mailQueue.add(MAILER_PAYLOAD, payload);
  console.log("Email added to queue");
};
