import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "Notification", trim: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    type: {
      type: String,
      enum: [
        "system",
        "verification",
        "post",
        "application",
        "session",
        "general",
      ],
      default: "general",
    },
    link: { type: String, default: null },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
