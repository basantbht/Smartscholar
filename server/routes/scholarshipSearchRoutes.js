import express from 'express';
import Scholarship from '../models/Scholarship.js';
import ScholarshipCalendar from '../models/ScholarshipCalendar.js';

const router = express.Router();

// GET /api/v1/scholarship-search?q=... – full-text search across scholarships & calendar
router.get('/', async (req, res) => {
  try {
    const { q, limit = 20, type = 'all' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Query must be at least 2 characters' });
    }

    const regex = new RegExp(q, 'i');
    const results = {};

    if (type === 'all' || type === 'scholarships') {
      results.scholarships = await Scholarship.find({
        status: 'active',
        $or: [
          { title: regex },
          { university: regex },
          { country: regex },
          { level: regex },
          { description: regex },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();
    }

    if (type === 'all' || type === 'calendar') {
      results.calendar = await ScholarshipCalendar.find({
        $or: [
          { scholarshipName: regex },
          { university: regex },
          { description: regex },
        ],
      })
        .sort({ openingDate: 1 })
        .limit(parseInt(limit))
        .lean();
    }

    const totalCount =
      (results.scholarships?.length || 0) + (results.calendar?.length || 0);

    res.json({ success: true, query: q, count: totalCount, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
