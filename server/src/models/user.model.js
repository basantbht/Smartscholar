import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["STUDENT", "COLLEGE", "ADMIN"],
        default: "STUDENT",
    },

    phone: { type: String },

    isVerified: {type: Boolean, default: false},

    isActive: { type: Boolean, default: true },

}, { timestamps: true })

export const User = mongoose.model("User", userSchema);