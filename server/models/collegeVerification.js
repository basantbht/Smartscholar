import mongoose from "mongoose";

const verificationDocSchema = new mongoose.Schema(
  {
    docType: { 
      type: String, 
      required: true, 
      trim: true,
      enum: [
        "PAN",                    // PAN card of institution
        "RegistrationCertificate", // College registration certificate
        "AffiliationLetter",       // University affiliation letter
        "TaxDocument",             // Tax clearance certificate
        "AddressProof",            // Utility bill or property document
        "AuthorityLetter",         // Letter from authorized signatory
        "TrustDeed"                // For trust-based institutions
      ]
    },
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
    reviewedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
    },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const CollegeVerification =
  mongoose.models.CollegeVerification ||
  mongoose.model("CollegeVerification", collegeVerificationSchema);
