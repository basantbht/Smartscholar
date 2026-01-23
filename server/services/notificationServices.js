import { Notification } from "../models/notification.js";

export const notifyUser = async ({
  userId,
  title = "Notification",
  message,
  type = "general",
  link = null,
  priority = "low",
}) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type,
    link,
    priority,
  });
};
