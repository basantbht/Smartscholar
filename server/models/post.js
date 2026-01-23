import mongoose from "mongoose";

const requiredDocSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // "Citizenship", "Marksheet", etc.
    isMandatory: { type: Boolean, default: true },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    createdByCollege: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    postType: {
      type: String,
      enum: ["course", "event", "hackathon", "scholarship"],
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },

    // common metadata
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    deadline: { type: Date, default: null },

    location: { type: String, default: null, trim: true },
    eligibility: { type: String, default: null, trim: true },

    requiredDocs: { type: [requiredDocSchema], default: [] },

    status: { type: String, enum: ["published", "draft"], default: "published" },
  },
  { timestamps: true }
);

postSchema.index({ postType: 1, status: 1, createdAt: -1 });

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
