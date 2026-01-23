import mongoose from "mongoose";

const sessionBookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topic: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, default: null, trim: true, maxlength: 2000 },

    status: {
      type: String,
      enum: ["requested", "scheduled", "completed", "rejected"],
      default: "requested",
      index: true,
    },

    scheduledAt: { type: Date, default: null },
    meetingLink: { type: String, default: null, trim: true },

    collegeReply: { type: String, default: null, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

export const SessionBooking =
  mongoose.models.SessionBooking || mongoose.model("SessionBooking", sessionBookingSchema);
