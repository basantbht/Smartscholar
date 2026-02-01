import mongoose from "mongoose";

/* ---------------- Scholarship Schema ---------------- */
const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Need Based", "Merit Based", "Performance Based", "Other"],
      required: true
    },
    eligibility: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    benefits: {
      type: String,
      trim: true,
      default: null
    },
    amount: {
      type: Number,
      default: null
    },
    deadline: {
      type: Date,
      default: null
    },
    quotaPercentage: {
      type: Number,
      default: null
    },
    additionalAwards: [
      {
        type: String,
        trim: true
      }
    ],
    requiredDocs: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active"
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }, // reference to college who created it
    collegeName: {
      type: String,
      trim: true,
      default: null
    } // denormalized for easier querying
  },
  { timestamps: true }
);

// Index for faster queries
scholarshipSchema.index({ college: 1, status: 1 });
scholarshipSchema.index({ type: 1, status: 1 });
scholarshipSchema.index({ deadline: 1 });

export const Scholarship = mongoose.model("Scholarship", scholarshipSchema);