import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    // Address Information
    address: {
      street: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "Nepal",
      },
      postalCode: {
        type: String,
        required: true,
      },
    },

    // Academic Details
    affiliation: {
      type: String,
      required: true, // TU, PU, KU, Purbanchal
    },

    universityType: {
      type: String,
      enum: ["Public", "Private"],
      required: true,
    },

    programsOffered: [
      {
        programName: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ["+2", "Bachelor", "Master"],
          default: "Bachelor",
        },
        durationYears: {
          type: Number,
        },
        eligibility: {
          type: String,
        },
        intakeCapacity: {
          type: Number,
        },
      },
    ],

    // Verification & Admin Control
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    // Account Status
    status: {
      type: String,
      enum: ["Active", "Suspended"],
      default: "Active",
    },

    // Ownership
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const College = mongoose.model("College", collegeSchema);
