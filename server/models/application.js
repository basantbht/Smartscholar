import mongoose from "mongoose";

const submittedDocSchema = new mongoose.Schema(
  {
    docName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

const applicationSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    status: {
      type: String,
      enum: ["submitted", "needsFix", "accepted", "rejected"],
      default: "submitted",
      index: true,
    },

    submittedDocs: { type: [submittedDocSchema], default: [] },

    collegeFeedback: { type: String, default: null, trim: true, maxlength: 2000 },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

applicationSchema.index({ post: 1, student: 1 }, { unique: true });

export const Application =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);
