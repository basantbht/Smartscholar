// models/eventRegistration.js
import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Team Info
    isTeamRegistration: {
      type: Boolean,
      default: false,
    },
    
    teamName: {
      type: String,
      trim: true,
    },
    
    teamMembers: [
      {
        name: String,
        email: String,
        phone: String,
      },
    ],
    
    // Contact
    phone: {
      type: String,
      required: true,
    },
    
    // Academic
    institution: {
      type: String,
      required: true,
    },
    
    educationLevel: {
      type: String,
      required: true,
    },
    
    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    
    transactionId: {
      type: String,
    },
    
    // Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    
    collegeFeedback: {
      type: String,
      trim: true,
    },
    
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Unique registration per student per event
eventRegistrationSchema.index({ event: 1, student: 1 }, { unique: true });

export const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);