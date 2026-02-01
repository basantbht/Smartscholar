// controllers/collegeEventController.js
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Event } from "../models/event.js";
import { EventRegistration } from "../models/eventRegistration.js";
import { User } from "../models/user.js";
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary.js";

// Helper middleware
const ensureApprovedCollege = (req, next) => {
  if (req.user.verificationStatus !== "approved") {
    return next(new ErrorHandler("College not approved yet", 403));
  }
};

export const createEvent = asyncHandler(async (req,   res, next) => {
  ensureApprovedCollege(req, next);

  // DEBUG: Log what we're receiving
  console.log("=== CREATE EVENT DEBUG ===");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);
  console.log("req.files.banner:", req.files?.banner);
  console.log("req.files.thumbnail:", req.files?.thumbnail);

  // Parse JSON fields if they were stringified
  let parsedBody = { ...req.body };
  
  // Parse teamSize if it's a string
  if (typeof req.body.teamSize === 'string') {
    try {
      parsedBody.teamSize = JSON.parse(req.body.teamSize);
    } catch (e) {
      console.error('Failed to parse teamSize:', e);
    }
  }

  // Parse category if it's a string
  if (typeof req.body.category === 'string') {
    try {
      parsedBody.category = JSON.parse(req.body.category);
    } catch (e) {
      console.error('Failed to parse category:', e);
    }
  }

  // Parse tags if it's a string
  if (typeof req.body.tags === 'string') {
    try {
      parsedBody.tags = JSON.parse(req.body.tags);
    } catch (e) {
      console.error('Failed to parse tags:', e);
    }
  }

  const eventData = {
    ...parsedBody,
    createdByCollege: req.user._id,
  };

  // Handle banner image upload
  if (req.files?.banner?.[0]) {
    console.log("Uploading banner:", req.files.banner[0].path);
    const bannerResult = await uploadToCloudinary(
      req.files.banner[0].path,
      "event_banners"
    );
    eventData.banner = bannerResult.url;
    console.log("Banner uploaded:", bannerResult.url);
  } else {
    console.log("No banner file received");
  }

  // Handle thumbnail upload
  if (req.files?.thumbnail?.[0]) {
    console.log("Uploading thumbnail:", req.files.thumbnail[0].path);
    const thumbnailResult = await uploadToCloudinary(
      req.files.thumbnail[0].path,
      "event_thumbnails"
    );
    eventData.thumbnail = thumbnailResult.url;
    console.log("Thumbnail uploaded:", thumbnailResult.url);
  } else {
    console.log("No thumbnail file received");
  }

  const event = await Event.create(eventData);

   // ✅ LINK EVENT TO COLLEGE USER (so populate works)
  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { "collegeProfile.events": event._id } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: { event },
  });
});

// Updated updateEvent controller with debugging
export const updateEvent = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  console.log("=== UPDATE EVENT DEBUG ===");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  if (event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this event", 403));
  }

  // Parse JSON fields if they were stringified
  let parsedBody = { ...req.body };
  
  if (typeof req.body.teamSize === 'string') {
    try {
      parsedBody.teamSize = JSON.parse(req.body.teamSize);
    } catch (e) {
      console.error('Failed to parse teamSize:', e);
    }
  }

  if (typeof req.body.category === 'string') {
    try {
      parsedBody.category = JSON.parse(req.body.category);
    } catch (e) {
      console.error('Failed to parse category:', e);
    }
  }

  if (typeof req.body.tags === 'string') {
    try {
      parsedBody.tags = JSON.parse(req.body.tags);
    } catch (e) {
      console.error('Failed to parse tags:', e);
    }
  }

  // Handle banner upload
  if (req.files?.banner?.[0]) {
    console.log("New banner file detected");
    if (event.banner) {
      const publicId = getPublicIdFromUrl(event.banner);
      if (publicId) await deleteFromCloudinary(publicId);
    }
    const bannerResult = await uploadToCloudinary(
      req.files.banner[0].path,
      "event_banners"
    );
    parsedBody.banner = bannerResult.url;
    console.log("Banner updated:", bannerResult.url);
  }

  // Handle thumbnail upload
  if (req.files?.thumbnail?.[0]) {
    console.log("New thumbnail file detected");
    if (event.thumbnail) {
      const publicId = getPublicIdFromUrl(event.thumbnail);
      if (publicId) await deleteFromCloudinary(publicId);
    }
    const thumbnailResult = await uploadToCloudinary(
      req.files.thumbnail[0].path,
      "event_thumbnails"
    );
    parsedBody.thumbnail = thumbnailResult.url;
    console.log("Thumbnail updated:", thumbnailResult.url);
  }

  Object.assign(event, parsedBody);
  await event.save();

  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { "collegeProfile.events": event._id } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: { event },
  });
});

// Get College's Events
export const getMyEvents = asyncHandler(async (req, res) => {
  const { status, eventType, page = 1, limit = 10 } = req.query;

  const query = { createdByCollege: req.user._id };

  if (status) query.status = status;
  if (eventType) query.eventType = eventType;

  const skip = (page - 1) * limit;

  const events = await Event.find(query)
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await Event.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// Get Single Event
export const getEventById = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId)
    .populate("createdByCollege", "name email collegeProfile")
    .lean();

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  // Check if user has permission to view
  if (
    event.createdByCollege._id.toString() !== req.user._id.toString() &&
    req.user.role !== "Admin"
  ) {
    return next(new ErrorHandler("Not authorized to view this event", 403));
  }

  res.status(200).json({
    success: true,
    data: { event },
  });
});

// Delete Event
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  if (event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to delete this event", 403));
  }

  // Delete images from cloudinary
  if (event.banner) {
    const publicId = getPublicIdFromUrl(event.banner);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  if (event.thumbnail) {
    const publicId = getPublicIdFromUrl(event.thumbnail);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});

// Get Event Registrations
export const getEventRegistrations = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { eventId } = req.params;
  const { status, page = 1, limit = 20 } = req.query;

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  if (event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  const query = { event: eventId };
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const registrations = await EventRegistration.find(query)
    .populate("student", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await EventRegistration.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      registrations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

// Review Event Registration
export const reviewEventRegistration = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { registrationId } = req.params;
  const { status, collegeFeedback } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  const registration = await EventRegistration.findById(registrationId)
    .populate("event")
    .populate("student", "name email");

  if (!registration) {
    return next(new ErrorHandler("Registration not found", 404));
  }

  if (
    registration.event.createdByCollege.toString() !== req.user._id.toString()
  ) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  registration.status = status;
  registration.collegeFeedback = collegeFeedback || null;
  registration.reviewedAt = new Date();

  await registration.save();

  // Update event participant count if approved
  if (status === "approved") {
    await Event.findByIdAndUpdate(registration.event._id, {
      $inc: { currentParticipants: 1 },
    });
  }

  res.status(200).json({
    success: true,
    message: "Registration reviewed successfully",
    data: { registration },
  });
});

// Publish/Unpublish Event
export const toggleEventStatus = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { status } = req.body;

  if (!["draft", "published", "cancelled"].includes(status)) {
    return next(new ErrorHandler("Invalid status", 400));
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  if (event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  event.status = status;
  await event.save();

  res.status(200).json({
    success: true,
    message: `Event ${status} successfully`,
    data: { event },
  });
});