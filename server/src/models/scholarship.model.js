import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // e.g. "TU Merit-Based Scholarship"
    },
    college: {
      type: String,
      required: true, // e.g. "Tribhuvan University"
    },
    level: {
      type: String,
      enum: ["Bachelor", "Master", "MPhil", "PhD"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Merit", "Need-Based", "Government", "Private"],
      required: true,
    },
    eligibility: {
      type: String,
      required: true, // GPA, income, caste quota, etc.
    },
    amount: {
      type: Number, // NPR
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Scholarship", scholarshipSchema);
