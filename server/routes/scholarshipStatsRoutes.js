import express from 'express';
import Scholarship from '../models/Scholarship.js';
import ScholarshipCalendar from '../models/ScholarshipCalendar.js';
import { Subscription } from '../models/Subscription.js';

const router = express.Router();

// GET /api/v1/scholarship-stats
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [
      totalScholarships,
      withDeadlines,
      recentScholarships,
      upcomingOpenings,
      totalSubscribers,
      universityBreakdown,
      levelBreakdown,
    ] = await Promise.all([
      Scholarship.countDocuments({ status: 'active' }),
      Scholarship.countDocuments({ status: 'active', deadline: { $ne: null } }),
      Scholarship.countDocuments({ status: 'active', createdAt: { $gte: weekAgo } }),
      ScholarshipCalendar.countDocuments({ status: 'upcoming' }),
      Subscription.countDocuments({ active: true }),

      // Top 5 universities by scholarship count
      Scholarship.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$university', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { university: '$_id', count: 1, _id: 0 } },
      ]),

      // Breakdown by level
      Scholarship.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $project: { level: '$_id', count: 1, _id: 0 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        total_scholarships: totalScholarships,
        with_deadlines: withDeadlines,
        recent_scholarships: recentScholarships,
        upcoming_openings: upcomingOpenings,
        total_subscribers: totalSubscribers,
        university_breakdown: universityBreakdown,
        level_breakdown: levelBreakdown,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
