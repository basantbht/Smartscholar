import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Notification } from "../models/notification.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(200);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  res.status(200).json({ success: true, data: { notifications, unreadCount } });
});

export const markNotificationRead = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const updated = await Notification.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!updated) return next(new ErrorHandler("Notification not found", 404));
  res.status(200).json({ success: true, message: "Marked as read", data: { notification: updated } });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ success: true, message: "All marked as read" });
});

export const deleteNotification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deleted = await Notification.findOneAndDelete({ _id: id, user: req.user._id });
  if (!deleted) return next(new ErrorHandler("Notification not found", 404));

  res.status(200).json({ success: true, message: "Deleted successfully" });
});
