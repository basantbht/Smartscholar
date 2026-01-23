
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const collegeProfileSchema = new mongoose.Schema(
  {
    collegeName: { type: String, trim: true, default: null },
    universityAffiliation: { type: String, trim: true, default: null },
    address: { type: String, trim: true, default: null },
    phone: { type: String, trim: true, default: null },
    website: { type: String, trim: true, default: null },
    description: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["Student", "College", "Admin"],
      default: "Student",
    },
    isVerified: { type: Boolean, default: false },

    // Student profile (only for Students)
    studentProfile: {
      seeGpa: { type: Number, default: null },
      plusTwoGpa: { type: Number, default: null },
      interests: { type: [String], default: [] },
      schoolType: { type: String, default: null },
      category: { type: String, default: null },
    },

    // College profile (only for Colleges)
    collegeProfile: { type: collegeProfileSchema, default: () => ({}) },

    // Verification status (only for Colleges)
    verificationStatus: {
      type: String,
      enum: ["notSubmitted", "pending", "approved", "rejected"],
      default: "notSubmitted",
    },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.generateJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const User = mongoose.model("User", userSchema);