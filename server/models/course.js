import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    degree: { type: String, required: true }, // e.g., BBA, BCA, etc.
    seats: { type: Number, required: true },
    school: { type: String, required: true }, // e.g., School of IT, School of Business
    duration: { type: Number, required: true }, // e.g., 4 years
    college: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference to college
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
