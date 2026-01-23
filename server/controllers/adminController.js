import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { CollegeVerification } from "../models/collegeVerification.js";
import { notifyUser } from "../services/notificationServices.js";

export const getPendingCollegeVerifications = asyncHandler(async (req, res) => {
  const items = await CollegeVerification.find({ status: "pending" })
    .populate("college", "name email role verificationStatus collegeProfile")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { items } });
});

export const getCollegeVerification = asyncHandler(async (req, res, next) => {
  const { collegeId } = req.params;

  const item = await CollegeVerification.findOne({ college: collegeId })
    .populate("college", "name email role verificationStatus collegeProfile");

  if (!item) return next(new ErrorHandler("Verification not found", 404));

  res.status(200).json({ success: true, data: { item } });
});

export const reviewCollegeVerification = asyncHandler(async (req, res, next) => {
  const { collegeId } = req.params;
  const { action, adminFeedback } = req.body; // action: "approve" | "reject"

  if (!["approve", "reject"].includes(action)) {
    return next(new ErrorHandler("Invalid action", 400));
  }

  // Require feedback when rejecting
  if (action === "reject" && (!adminFeedback || !adminFeedback.trim())) {
    return next(new ErrorHandler("Feedback is required when rejecting verification", 400));
  }

  const item = await CollegeVerification.findOne({ college: collegeId });
  if (!item) return next(new ErrorHandler("Verification not found", 404));

  const college = await User.findById(collegeId);
  if (!college || college.role !== "College") {
    return next(new ErrorHandler("College not found", 404));
  }

  if (action === "approve") {
    item.status = "approved";
    item.adminFeedback = null;
    college.verificationStatus = "approved";

    await notifyUser({
      userId: collegeId,
      title: "College Verified",
      message: "Your college has been approved by admin. You can now publish posts.",
      type: "verification",
      priority: "medium",
      link: "/college/dashboard",
    });
  } else {
    item.status = "rejected";
    item.adminFeedback = adminFeedback.trim();
    college.verificationStatus = "rejected";

    await notifyUser({
      userId: collegeId,
      title: "Verification Needs Changes",
      message: item.adminFeedback,
      type: "verification",
      priority: "high",
      link: "/college/verification",
    });
  }

  item.reviewedBy = req.user._id;
  item.reviewedAt = new Date();

  await Promise.all([item.save(), college.save()]);

  res.status(200).json({
    success: true,
    message: `College ${action}d successfully`,
    data: { item },
  });
});

// Get all colleges
export const getAllColleges = asyncHandler(async (req, res, next) => {
  const { verificationStatus, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { role: "College" };

  // Filter by verification status if provided
  if (verificationStatus) {
    query.verificationStatus = verificationStatus;
  }

  // Search by college name or university affiliation
  if (search) {
    query.$or = [
      { "collegeProfile.collegeName": { $regex: search, $options: "i" } },
      { "collegeProfile.universityAffiliation": { $regex: search, $options: "i" } },
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch colleges
  const colleges = await User.find(query)
    .select("-password -resetPasswordToken -resetPasswordExpire")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Colleges fetched successfully",
    data: {
      colleges,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// Get single college details
export const getCollegeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const college = await User.findOne({ _id: id, role: "College" })
    .select("-password -resetPasswordToken -resetPasswordExpire");

  if (!college) {
    return next(new ErrorHandler("College not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "College details fetched successfully",
    data: { college },
  });
});

// Update college verification status
export const updateCollegeVerification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { verificationStatus } = req.body;

  if (!["pending", "approved", "rejected"].includes(verificationStatus)) {
    return next(new ErrorHandler("Invalid verification status", 400));
  }

  const college = await User.findOne({ _id: id, role: "College" });

  if (!college) {
    return next(new ErrorHandler("College not found", 404));
  }

  college.verificationStatus = verificationStatus;
  college.isVerified = verificationStatus === "approved";
  await college.save();

  res.status(200).json({
    success: true,
    message: "College verification status updated successfully",
    data: { college },
  });
});