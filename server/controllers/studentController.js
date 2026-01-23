import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Post } from "../models/post.js";
import { Application } from "../models/application.js";
import { SessionBooking } from "../models/sessionBooking.js";
import { User } from "../models/user.js";
import { notifyUser } from "../services/notificationServices.js";

export const listPublicPosts = asyncHandler(async (req, res) => {
  const { postType } = req.query;

  const filter = { status: "published" };
  if (postType) filter.postType = postType;

  const posts = await Post.find(filter)
    .populate("createdByCollege", "name email verificationStatus collegeProfile")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { posts } });
});

export const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).populate(
    "createdByCollege",
    "name email verificationStatus collegeProfile"
  );

  if (!post) return next(new ErrorHandler("Post not found", 404));
  res.status(200).json({ success: true, data: { post } });
});

export const applyToPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const studentId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) return next(new ErrorHandler("Post not found", 404));

  const college = await User.findById(post.createdByCollege);
  if (!college || college.role !== "College") {
    return next(new ErrorHandler("College not found", 404));
  }
  if (college.verificationStatus !== "approved") {
    return next(new ErrorHandler("This college is not verified yet", 403));
  }

  const files = req.files || [];
  const docNamesRaw = req.body.docNames;
  const docNames = Array.isArray(docNamesRaw)
    ? docNamesRaw
    : typeof docNamesRaw === "string"
      ? docNamesRaw.split(",").map((s) => s.trim())
      : [];

  if (!files.length) return next(new ErrorHandler("No docs uploaded", 400));
  if (docNames.length && docNames.length !== files.length) {
    return next(new ErrorHandler("docNames count must match files count", 400));
  }

  const submittedDocs = files.map((f, idx) => ({
    docName: docNames[idx] || "UnknownDoc",
    fileUrl: f.path,
    originalName: f.originalname,
  }));

  // Optional strict validation: ensure mandatory docs exist
  const requiredMandatory = (post.requiredDocs || []).filter((d) => d.isMandatory);
  if (requiredMandatory.length) {
    const submittedNames = new Set(submittedDocs.map((d) => d.docName));
    const missing = requiredMandatory.filter((d) => !submittedNames.has(d.name));
    if (missing.length) {
      return next(
        new ErrorHandler(
          `Missing mandatory docs: ${missing.map((m) => m.name).join(", ")}`,
          400
        )
      );
    }
  }

  const application = await Application.create({
    post: post._id,
    student: studentId,
    college: college._id,
    submittedDocs,
  });

  await notifyUser({
    userId: college._id,
    title: "New Application",
    message: `A student applied to your ${post.postType}: ${post.title}`,
    type: "application",
    priority: "medium",
    link: "/college/applications",
  });

  res.status(201).json({ success: true, message: "Applied successfully", data: { application } });
});

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
