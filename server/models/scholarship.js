import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true,
      index: true,
    },
    country: {
      type: String,
      default: 'Nepal',
      trim: true,
    },
    level: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'PhD', 'All Levels', 'Other'],
      default: 'All Levels',
    },
    deadline: {
      type: Date,
      default: null,
    },
    link: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
      index: true,
    },
    // Crawler metadata
    sourceUrl: { type: String },
    scrapedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for common queries
scholarshipSchema.index({ university: 1, status: 1 });
scholarshipSchema.index({ title: 'text', description: 'text', university: 'text' });

// Virtual: alias for API compatibility
scholarshipSchema.virtual('application_deadline').get(function () {
  return this.deadline;
});
scholarshipSchema.virtual('scraped_date').get(function () {
  return this.scrapedDate;
});
scholarshipSchema.virtual('url').get(function () {
  return this.link;
});

export default mongoose.model('Scholarship', scholarshipSchema);
