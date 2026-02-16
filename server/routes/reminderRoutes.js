import express from 'express';
import { UserReminder, Subscription } from '../models/Subscription.js';
import ScholarshipCalendar from '../models/ScholarshipCalendar.js';

const router = express.Router();

// POST /api/v1/reminders/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, scholarship_id, days_before = 7 } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Ensure general subscription exists
    await Subscription.findOneAndUpdate(
      { email },
      { email, active: true },
      { upsert: true, new: true }
    );

    // Create specific scholarship reminder if ID provided
    if (scholarship_id) {
      const scholarship = await ScholarshipCalendar.findById(scholarship_id);
      if (!scholarship) {
        return res.status(404).json({ success: false, message: 'Scholarship not found' });
      }

      await UserReminder.findOneAndUpdate(
        { userEmail: email, scholarship: scholarship_id },
        { userEmail: email, scholarship: scholarship_id, reminderDaysBefore: days_before },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: 'Successfully subscribed to scholarship reminders!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/reminders/user/:email – get a user's reminders
router.get('/user/:email', async (req, res) => {
  try {
    const reminders = await UserReminder.find({ userEmail: req.params.email })
      .populate('scholarship')
      .lean();

    res.json({ success: true, count: reminders.length, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/reminders/:id
router.delete('/:id', async (req, res) => {
  try {
    await UserReminder.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Reminder removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
