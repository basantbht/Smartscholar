import express from 'express';
import { Subscription } from '../models/Subscription.js';

const router = express.Router();

// POST /api/v1/subscriptions – subscribe to general notifications
router.post('/', async (req, res) => {
  try {
    const { email, universities } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    const subscription = await Subscription.create({
      email,
      universities: universities || [],
      active: true,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to scholarship notifications!',
      data: subscription,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/subscriptions – list active subscribers (admin)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscription.find({ active: true }).lean();
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/subscriptions/:email – unsubscribe
router.delete('/:email', async (req, res) => {
  try {
    await Subscription.findOneAndUpdate({ email: req.params.email }, { active: false });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
