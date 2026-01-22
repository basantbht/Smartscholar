import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { CollegeVerification } from "../models/collegeVerification.js";
import { Post } from "../models/post.js";
import { Application } from "../models/application.js";
import { SessionBooking } from "../models/sessionBooking.js";
import { notifyUser } from "../services/notificationServices.js";

// Helper middleware
const ensureApprovedCollege = (req, next) => {
  if (req.user.verificationStatus !== "approved") {
    return next(new ErrorHandler("College not approved yet", 403));
  }
};

// Update college profile
export const updateCollegeProfile = asyncHandler(async (req, res, next) => {
  const { 
    collegeName, 
    universityAffiliation, 
    address, 
    phone, 
    website, 
    description 
  } = req.body;

  const college = await User.findById(req.user._id);
  if (!college || college.role !== "College") {
    return next(new ErrorHandler("College not found", 404));
  }

  // Update only provided fields
  if (collegeName !== undefined) college.collegeProfile.collegeName = collegeName;
  if (universityAffiliation !== undefined) 
    college.collegeProfile.universityAffiliation = universityAffiliation;
  if (address !== undefined) college.collegeProfile.address = address;
  if (phone !== undefined) college.collegeProfile.phone = phone;
  if (website !== undefined) college.collegeProfile.website = website;
  if (description !== undefined) college.collegeProfile.description = description;

  await college.save();

  res.status(200).json({ 
    success: true, 
    message: "Profile updated", 
    data: { college } 
  });
});

// Submit verification documents
export const submitVerificationDocs = asyncHandler(async (req, res, next) => {
  const files = req.files || [];
  if (!files.length) {
    return next(new ErrorHandler("No documents uploaded", 400));
  }

  const docTypesRaw = req.body.docTypes;
  const docTypes = Array.isArray(docTypesRaw)
    ? docTypesRaw
    : typeof docTypesRaw === "string"
      ? docTypesRaw.split(",").map((s) => s.trim())
      : [];

  if (docTypes.length && docTypes.length !== files.length) {
    return next(new ErrorHandler("docTypes count must match files count", 400));
  }

  const docs = files.map((f, idx) => ({
    docType: docTypes[idx] || "UnknownDoc",
    fileUrl: f.path,
    originalName: f.originalname,
  }));

  const college = await User.findById(req.user._id);
  if (!college) return next(new ErrorHandler("User not found", 404));

  let item = await CollegeVerification.findOne({ college: req.user._id });

  if (!item) {
    item = await CollegeVerification.create({
      college: req.user._id,
      docs,
      status: "pending",
    });
  } else {
    item.docs = docs;
    item.status = "pending";
    item.adminFeedback = null;
    item.reviewedBy = null;
    item.reviewedAt = null;
    await item.save();
  }

  college.verificationStatus = "pending";
  await college.save();

  // Notify admins
  const admins = await User.find({ role: "Admin" }).select("_id").lean();
  await Promise.all(
    admins.map((a) =>
      notifyUser({
        userId: a._id,
        title: "College Verification Pending",
        message: `${college.name} submitted verification documents.`,
        type: "verification",
        priority: "medium",
        link: `/admin/colleges/${college._id}`,
      })
    )
  );

  res.status(201).json({
    success: true,
    message: "Verification submitted",
    data: { item, verificationStatus: college.verificationStatus },
  });
});

// Get verification status
export const getMyVerificationStatus = asyncHandler(async (req, res) => {
  const item = await CollegeVerification.findOne({ 
    college: req.user._id 
  }).lean();
  
  res.status(200).json({
    success: true,
    data: {
      verificationStatus: req.user.verificationStatus,
      item: item || null,
    },
  });
});

// Create post
export const createPost = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const {
    postType,
    title,
    description,
    startDate,
    endDate,
    deadline,
    location,
    eligibility,
    requiredDocs,
    status,
  } = req.body;

  if (!postType || !title || !description) {
    return next(
      new ErrorHandler("postType, title, description are required", 400)
    );
  }

  const post = await Post.create({
    createdByCollege: req.user._id,
    postType,
    title,
    description,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    deadline: deadline ? new Date(deadline) : null,
    location: location || null,
    eligibility: eligibility || null,
    requiredDocs: Array.isArray(requiredDocs) ? requiredDocs : [],
    status: status || "published",
  });

  res.status(201).json({ 
    success: true, 
    message: "Post created", 
    data: { post } 
  });
});

// Get college's posts
export const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ createdByCollege: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: { posts } });
});

// Get applications
export const getMyApplications = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const apps = await Application.find({ college: req.user._id })
    .populate("student", "name email")
    .populate("post", "postType title deadline requiredDocs")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { applications: apps } });
});

// Review application
export const reviewApplication = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { applicationId } = req.params;
  const { action, collegeFeedback } = req.body;

  if (!["accept", "reject", "needsFix"].includes(action)) {
    return next(new ErrorHandler("Invalid action", 400));
  }

  const app = await Application.findById(applicationId)
    .populate("student", "_id name")
    .populate("post", "title postType");

  if (!app) return next(new ErrorHandler("Application not found", 404));
  
  if (app.college.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  app.status = action === "accept" ? "accepted" 
    : action === "reject" ? "rejected" 
    : "needsFix";
  app.collegeFeedback = collegeFeedback || null;
  app.reviewedAt = new Date();
  
  await app.save();

  await notifyUser({
    userId: app.student._id,
    title: "Application Update",
    message:
      action === "needsFix"
        ? `Your application needs fixes: ${app.collegeFeedback || "Please update docs."}`
        : `Your application was ${app.status} for ${app.post.title}.`,
    type: "application",
    priority: action === "needsFix" ? "high" : "medium",
    link: "/student/applications",
  });

  res.status(200).json({ 
    success: true, 
    message: "Application reviewed", 
    data: { app } 
  });
});

// Get session requests
export const getSessionRequests = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const sessions = await SessionBooking.find({ college: req.user._id })
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { sessions } });
});

// Update session request
export const updateSessionRequest = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { sessionId } = req.params;
  const { status, scheduledAt, meetingLink, collegeReply } = req.body;

  if (!["scheduled", "rejected", "completed"].includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  const session = await SessionBooking.findById(sessionId);
  if (!session) return next(new ErrorHandler("Session not found", 404));
  
  if (session.college.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  session.status = status;
  if (scheduledAt) session.scheduledAt = new Date(scheduledAt);
  if (meetingLink !== undefined) session.meetingLink = meetingLink;
  if (collegeReply !== undefined) session.collegeReply = collegeReply;
  
  await session.save();

  await notifyUser({
    userId: session.student,
    title: "Session Request Update",
    message:
      status === "scheduled"
        ? `Your session is scheduled. ${meetingLink ? "Meeting link provided." : ""}`
        : `Your session request was updated to: ${status}`,
    type: "session",
    priority: status === "rejected" ? "high" : "medium",
    link: "/student/sessions",
  });

  res.status(200).json({ 
    success: true, 
    message: "Session updated", 
    data: { session } 
  });
});