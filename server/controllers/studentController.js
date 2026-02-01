import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/application.js";
import { SessionBooking } from "../models/sessionBooking.js";
import { User } from "../models/user.js";
import { notifyUser } from "../services/notificationServices.js";


export const listMyApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ student: req.user._id })
    .populate("post", "postType title deadline requiredDocs")
    .populate("college", "name email collegeProfile")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { applications: apps } });
});

export const requestSession = asyncHandler(async (req, res, next) => {
  const { collegeId, topic, message } = req.body;
  if (!collegeId || !topic) return next(new ErrorHandler("collegeId and topic are required", 400));

  const college = await User.findById(collegeId);
  if (!college || college.role !== "College") {
    return next(new ErrorHandler("College not found", 404));
  }
  if (college.verificationStatus !== "approved") {
    return next(new ErrorHandler("College not verified", 403));
  }

  const session = await SessionBooking.create({
    student: req.user._id,
    college: collegeId,
    topic,
    message: message || null,
  });

  await notifyUser({
    userId: collegeId,
    title: "New Session Request",
    message: `A student requested a session: ${topic}`,
    type: "session",
    priority: "medium",
    link: "/college/sessions",
  });

  res.status(201).json({ success: true, message: "Session requested", data: { session } });
});

export const listMySessions = asyncHandler(async (req, res) => {
  const sessions = await SessionBooking.find({ student: req.user._id })
    .populate("college", "name email collegeProfile")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { sessions } });
});

export const getAllColleges = asyncHandler(async (req, res) => {
  const { search, verificationStatus, page = 1, limit = 12 } = req.query;

  // Build filter - only fetch colleges with role "College"
  const filter = { role: "College" };
  
  // Filter by verification status (default to approved only)
  if (verificationStatus) {
    filter.verificationStatus = verificationStatus;
  } else {
    filter.verificationStatus = "approved"; // Default to approved colleges
  }

  // Search by college name or university affiliation
  if (search) {
    filter.$or = [
      { "collegeProfile.collegeName": { $regex: search, $options: "i" } },
      { "collegeProfile.universityAffiliation": { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get total count
  const total = await User.countDocuments(filter);

  // Fetch colleges with pagination
  const colleges = await User.find(filter)
    .select("name email collegeProfile verificationStatus createdAt")
    .sort({ "collegeProfile.collegeName": 1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    data: {
      colleges,
      count: colleges.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});

export const getCollegeById = asyncHandler(async (req, res, next) => {
  const { collegeId } = req.params;

  const college = await User.findById(collegeId)
    .populate("collegeProfile.courses")
    .populate("collegeProfile.events")
    .populate("collegeProfile.scholarships");

  if (!college) {
    return next(new ErrorHandler("College not found", 404));
  }

  res.status(200).json({
    success: true,
    data: {
      college
    },
  });
});