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
        name: { 
          type: String, 
          required: true,
          trim: true,
        },
        email: { 
          type: String, 
          required: true,
          lowercase: true,
          trim: true,
          match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        phone: { 
          type: String, 
          required: true,
          trim: true,
        },
      },
    ],
    
    // Contact
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Academic
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    
    educationLevel: {
      type: String,
      required: true,
      enum: ['high_school', 'undergraduate', 'graduate', 'postgraduate', 'other'],
    },
    
    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    
    transactionId: {
      type: String,
      trim: true,
    },
    
    paymentAmount: {
      type: Number,
      min: 0,
    },
    
    // Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    reviewedAt: {
      type: Date,
    },
    
    rejectionReason: {
      type: String,
      trim: true,
    },
    
    // Additional Info
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventRegistrationSchema.index({ event: 1, student: 1 }, { unique: true });
eventRegistrationSchema.index({ status: 1 });
eventRegistrationSchema.index({ paymentStatus: 1 });
eventRegistrationSchema.index({ createdAt: -1 });

export const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);