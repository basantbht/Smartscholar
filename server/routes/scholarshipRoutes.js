import express from 'express';
import Scholarship from '../models/Scholarship.js';

const router = express.Router();

// GET /api/v1/scholarships – list active scholarships
router.get('/', async (req, res) => {
  try {
    const { university, has_deadline, limit = 50, page = 1 } = req.query;

    const filter = { status: 'active' };
    if (university) filter.university = new RegExp(university, 'i');
    if (has_deadline === 'true') filter.deadline = { $ne: null };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [scholarships, total] = await Promise.all([
      Scholarship.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Scholarship.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: scholarships.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: scholarships,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/scholarships/universities – list all universities with scholarship count
router.get('/universities', async (req, res) => {
  try {
    const universities = await Scholarship.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$university', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { university: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({ success: true, data: universities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/v1/scholarships/:id
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).lean();
    if (!scholarship) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: scholarship });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/scholarships – create scholarship
router.post('/', async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json({ success: true, data: scholarship });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/v1/scholarships/:id
router.put('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!scholarship) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: scholarship });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/v1/scholarships/:id
router.delete('/:id', async (req, res) => {
  try {
    await Scholarship.findByIdAndUpdate(req.params.id, { status: 'inactive' });
    res.json({ success: true, message: 'Scholarship deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
