import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { Scholarship } from "../models/scholarship.js";
import { notifyUser } from "../services/notificationServices.js";

// Helper middleware to ensure college is approved
const ensureApprovedCollege = (req, next) => {
  if (req.user.verificationStatus !== "approved") {
    return next(new ErrorHandler("College not approved yet", 403));
  }
};

// Create a new scholarship
export const createScholarship = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const {
    title,
    type,
    eligibility,
    description,
    benefits,
    amount,
    deadline,
    quotaPercentage,
    additionalAwards,
    requiredDocs,
    status,
  } = req.body;

  // Validate required fields
  if (!title || !type || !eligibility || !description) {
    return next(
      new ErrorHandler("Title, type, eligibility, and description are required", 400)
    );
  }

  // Validate scholarship type
  const validTypes = ["Need Based", "Merit Based", "Performance Based", "Other"];
  if (!validTypes.includes(type)) {
    return next(new ErrorHandler("Invalid scholarship type", 400));
  }

  // Get college details
  const college = await User.findById(req.user._id);
  if (!college || college.role !== "College") {
    return next(new ErrorHandler("College not found", 404));
  }

  // Create scholarship
  const scholarship = await Scholarship.create({
    college: req.user._id,
    collegeName: college.collegeProfile.collegeName || college.name,
    title,
    type,
    eligibility,
    description,
    benefits: benefits || null,
    amount: amount || null,
    deadline: deadline ? new Date(deadline) : null,
    quotaPercentage: quotaPercentage || null,
    additionalAwards: Array.isArray(additionalAwards) ? additionalAwards : [],
    requiredDocs: Array.isArray(requiredDocs) ? requiredDocs : [],
    status: status || "active",
  });

  // Add scholarship reference to college profile
  college.collegeProfile.scholarships.push(scholarship._id);
  await college.save();

  res.status(201).json({
    success: true,
    message: "Scholarship created successfully",
    data: { scholarship },
  });
});

// Get all scholarships for the logged-in college
export const getMyScholarships = asyncHandler(async (req, res, next) => {
  const scholarships = await Scholarship.find({ college: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: {
      scholarships,
      count: scholarships.length,
    },
  });
});

// Get a single scholarship by ID
export const getScholarshipById = asyncHandler(async (req, res, next) => {
  const { scholarshipId } = req.params;

  const scholarship = await Scholarship.findById(scholarshipId).populate(
    "college",
    "name email collegeProfile.collegeName"
  );

  if (!scholarship) {
    return next(new ErrorHandler("Scholarship not found", 404));
  }

  // Check if the scholarship belongs to the logged-in college
  if (scholarship.college._id.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to view this scholarship", 403));
  }

  res.status(200).json({
    success: true,
    data: { scholarship },
  });
});

// Update a scholarship
export const updateScholarship = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { scholarshipId } = req.params;
  const {
    title,
    type,
    eligibility,
    description,
    benefits,
    amount,
    deadline,
    quotaPercentage,
    additionalAwards,
    requiredDocs,
    status,
  } = req.body;

  const scholarship = await Scholarship.findById(scholarshipId);

  if (!scholarship) {
    return next(new ErrorHandler("Scholarship not found", 404));
  }

  // Check if the scholarship belongs to the logged-in college
  if (scholarship.college.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this scholarship", 403));
  }

  // Validate scholarship type if provided
  if (type !== undefined) {
    const validTypes = ["Need Based", "Merit Based", "Performance Based", "Other"];
    if (!validTypes.includes(type)) {
      return next(new ErrorHandler("Invalid scholarship type", 400));
    }
  }

  // Update fields only if provided
  if (title !== undefined) scholarship.title = title;
  if (type !== undefined) scholarship.type = type;
  if (eligibility !== undefined) scholarship.eligibility = eligibility;
  if (description !== undefined) scholarship.description = description;
  if (benefits !== undefined) scholarship.benefits = benefits;
  if (amount !== undefined) scholarship.amount = amount;
  if (deadline !== undefined) scholarship.deadline = deadline ? new Date(deadline) : null;
  if (quotaPercentage !== undefined) scholarship.quotaPercentage = quotaPercentage;
  if (additionalAwards !== undefined) {
    scholarship.additionalAwards = Array.isArray(additionalAwards) ? additionalAwards : [];
  }
  if (requiredDocs !== undefined) {
    scholarship.requiredDocs = Array.isArray(requiredDocs) ? requiredDocs : [];
  }
  if (status !== undefined) scholarship.status = status;

  await scholarship.save();

  res.status(200).json({
    success: true,
    message: "Scholarship updated successfully",
    data: { scholarship },
  });
});

// Delete a scholarship
export const deleteScholarship = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { scholarshipId } = req.params;

  const scholarship = await Scholarship.findById(scholarshipId);

  if (!scholarship) {
    return next(new ErrorHandler("Scholarship not found", 404));
  }

  // Check if the scholarship belongs to the logged-in college
  if (scholarship.college.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to delete this scholarship", 403));
  }

  // Remove scholarship reference from college profile
  const college = await User.findById(req.user._id);
  if (college) {
    college.collegeProfile.scholarships = college.collegeProfile.scholarships.filter(
      (id) => id.toString() !== scholarshipId
    );
    await college.save();
  }

  // Delete the scholarship
  await Scholarship.findByIdAndDelete(scholarshipId);

  res.status(200).json({
    success: true,
    message: "Scholarship deleted successfully",
  });
});

// Get all scholarships by college ID (public - for students)
export const getScholarshipsByCollegeId = asyncHandler(async (req, res, next) => {
  const { collegeId } = req.params;

  const college = await User.findById(collegeId);
  if (!college || college.role !== "College") {
    return next(new ErrorHandler("College not found", 404));
  }

  const scholarships = await Scholarship.find({
    college: collegeId,
    status: "active", // Only show active scholarships to public
  })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: {
      scholarships,
      count: scholarships.length,
      collegeName: college.collegeProfile.collegeName || college.name,
    },
  });
});

// Get all active scholarships (public - for students to browse)
export const getAllActiveScholarships = asyncHandler(async (req, res, next) => {
  const { type, minAmount, maxAmount, search } = req.query;

  // Build filter query
  const filter = { status: "active" };

  if (type) {
    filter.type = type;
  }

  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) filter.amount.$gte = Number(minAmount);
    if (maxAmount) filter.amount.$lte = Number(maxAmount);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { collegeName: { $regex: search, $options: "i" } },
    ];
  }

  const scholarships = await Scholarship.find(filter)
    .populate("college", "name collegeProfile.collegeName collegeProfile.image")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: {
      scholarships,
      count: scholarships.length,
    },
  });
});

// Get scholarship statistics for college dashboard
export const getScholarshipStats = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const scholarships = await Scholarship.find({ college: req.user._id }).lean();

  const stats = {
    total: scholarships.length,
    active: scholarships.filter((s) => s.status === "active").length,
    inactive: scholarships.filter((s) => s.status === "inactive").length,
    byType: {
      needBased: scholarships.filter((s) => s.type === "Need Based").length,
      meritBased: scholarships.filter((s) => s.type === "Merit Based").length,
      performanceBased: scholarships.filter((s) => s.type === "Performance Based").length,
      other: scholarships.filter((s) => s.type === "Other").length,
    },
  };

  res.status(200).json({
    success: true,
    data: { stats },
  });
});

// Toggle scholarship status (active/inactive)
export const toggleScholarshipStatus = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { scholarshipId } = req.params;

  const scholarship = await Scholarship.findById(scholarshipId);

  if (!scholarship) {
    return next(new ErrorHandler("Scholarship not found", 404));
  }

  // Check if the scholarship belongs to the logged-in college
  if (scholarship.college.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to modify this scholarship", 403));
  }

  // Toggle status
  scholarship.status = scholarship.status === "active" ? "inactive" : "active";
  await scholarship.save();

  res.status(200).json({
    success: true,
    message: `Scholarship ${scholarship.status === "active" ? "activated" : "deactivated"} successfully`,
    data: { scholarship },
  });
});