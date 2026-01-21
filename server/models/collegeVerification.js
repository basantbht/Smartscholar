import mongoose from "mongoose";

const verificationDocSchema = new mongoose.Schema(
  {
    docType: { type: String, required: true, trim: true }, // "PAN", "AffiliationLetter", etc.
    fileUrl: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

const collegeVerificationSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    docs: { type: [verificationDocSchema], default: [] },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    adminFeedback: {
      type: String,
      default: null,
      maxlength: 2000,
      trim: true,
    },

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const CollegeVerification =
  mongoose.models.CollegeVerification ||
  mongoose.model("CollegeVerification", collegeVerificationSchema);
