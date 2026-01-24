// models/event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    createdByCollege: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    
    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Event Type & Category
    eventType: {
      type: String,
      enum: ["hackathon", "workshop", "seminar", "conference", "competition", "webinar", "other"],
      required: true,
    },
    
    category: {
      type: [String],
      default: [],
    },
    
    // Event Dates
    startDate: {
      type: Date,
      required: true,
    },
    
    endDate: {
      type: Date,
      required: true,
    },
    
    registrationDeadline: {
      type: Date,
      required: true,
    },
    
    // Location
    venue: {
      type: String,
      required: true,
    },
    
    address: {
      type: String,
      trim: true,
    },
    
    isOnline: {
      type: Boolean,
      default: false,
    },
    
    onlineLink: {
      type: String,
      trim: true,
    },
    
    // Organizer
    organizer: {
      type: String,
      required: true,
    },
    
    organizerEmail: {
      type: String,
      trim: true,
    },
    
    organizerPhone: {
      type: String,
      trim: true,
    },
    
    // Registration
    registrationFee: {
      type: Number,
      default: 0,
    },
    
    maxParticipants: {
      type: Number,
      default: null,
    },
    
    currentParticipants: {
      type: Number,
      default: 0,
    },
    
   
      min: { type: Number, default: 1 },
      max: { type: Number, default: 1 },
  
    
    // Eligibility
    eligibility: {
      type: String,
      trim: true,
    },
    
    // Images
    banner: {
      type: String,
      default: null,
    },
    
    thumbnail: {
      type: String,
      default: null,
    },
    
    // Additional Info
    prizes: {
      type: String,
      trim: true,
    },
    
    tags: {
      type: [String],
      default: [],
    },
    
    // Status
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },
    
    // Links
    website: {
      type: String,
      trim: true,
    },
    
    registrationLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ createdByCollege: 1, status: 1 });
eventSchema.index({ startDate: 1 });

export const Event = mongoose.model("Event", eventSchema);