import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema(
  {
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true,
      index: true,
    },
    scholarshipName: {
      type: String,
      required: [true, 'Scholarship name is required'],
      trim: true,
    },
    openingDate: {
      type: Date,
      required: [true, 'Opening date is required'],
      index: true,
    },
    closingDate: {
      type: Date,
      default: null,
    },
    year: {
      type: Number,
      default: 2026,
      index: true,
    },
    level: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'PhD', 'All Levels', 'Other'],
      default: 'All Levels',
    },
    description: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['upcoming', 'open', 'closed'],
      default: 'upcoming',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Compound indexes
calendarSchema.index({ year: 1, status: 1, openingDate: 1 });
calendarSchema.index({ university: 1, scholarshipName: 1, openingDate: 1 }, { unique: true });

// Auto-update status based on dates
calendarSchema.pre('save', function (next) {
  const now = new Date();
  if (this.openingDate > now) {
    this.status = 'upcoming';
  } else if (!this.closingDate || this.closingDate >= now) {
    this.status = 'open';
  } else {
    this.status = 'closed';
  }
  next();
});

export default mongoose.model('ScholarshipCalendar', calendarSchema);
