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
    item.adminFeedback = adminFeedback || "Please update documents and resubmit.";
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
