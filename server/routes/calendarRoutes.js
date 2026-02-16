import express from 'express';
import ScholarshipCalendar from '../models/ScholarshipCalendar.js';

const router = express.Router();

// GET /api/v1/calendar – get all calendar events, optionally filter by year/university
router.get('/', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || 2026;
    const university = req.query.university;

    const filter = { year };
    if (university) filter.university = new RegExp(university, 'i');

    const events = await ScholarshipCalendar.find(filter).sort({ openingDate: 1 }).lean();

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/calendar/upcoming – scholarships with status "upcoming"
router.get('/upcoming', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;

    const events = await ScholarshipCalendar.find({ status: 'upcoming' })
      .sort({ openingDate: 1 })
      .limit(limit)
      .lean();

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/calendar/month/:month – events in a specific month
router.get('/month/:month', async (req, res) => {
  try {
    const month = parseInt(req.params.month);
    const year = parseInt(req.query.year) || 2026;

    if (month < 1 || month > 12) {
      return res.status(400).json({ success: false, message: 'Month must be 1-12' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const events = await ScholarshipCalendar.find({
      openingDate: { $gte: start, $lte: end },
    })
      .sort({ openingDate: 1 })
      .lean();

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/calendar/next-30-days – scholarships opening in next 30 days
router.get('/next-30-days', async (req, res) => {
  try {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 30);

    const events = await ScholarshipCalendar.find({
      openingDate: { $gte: now, $lte: future },
    })
      .sort({ openingDate: 1 })
      .lean();

    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/calendar/:id – single calendar event
router.get('/:id', async (req, res) => {
  try {
    const event = await ScholarshipCalendar.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/calendar – create a new calendar event
router.post('/', async (req, res) => {
  try {
    const event = await ScholarshipCalendar.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Duplicate calendar entry' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/v1/calendar/:id – update a calendar event
router.put('/:id', async (req, res) => {
  try {
    const event = await ScholarshipCalendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/calendar/:id
router.delete('/:id', async (req, res) => {
  try {
    const event = await ScholarshipCalendar.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Calendar event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
