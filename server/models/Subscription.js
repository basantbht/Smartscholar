import mongoose from 'mongoose';

// ─── Subscription ─────────────────────────────────────────────────────────────
const subscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    universities: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// ─── UserReminder ─────────────────────────────────────────────────────────────
const userReminderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    scholarship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScholarshipCalendar',
      required: true,
    },
    reminderDaysBefore: {
      type: Number,
      default: 7,
      min: 1,
      max: 30,
    },
    reminded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userReminderSchema.index({ userEmail: 1, scholarship: 1 }, { unique: true });

const UserReminder = mongoose.model('UserReminder', userReminderSchema);

export { Subscription, UserReminder };
