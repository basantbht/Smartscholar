// controllers/collegeEventController.js
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Event } from "../models/event.js";
import { EventRegistration } from "../models/eventRegistration.js";
import { User } from "../models/user.js";
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from "../utils/cloudinary.js";
import { sendApplicationApprovedEmail, sendApplicationRejectedEmail } from '../Mail/mail.send.js';


import mongoose from "mongoose";

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





// ------------for student routes------------
export const getAllCollegesEvents = asyncHandler(async (req, res, next) => {
  // Fetch all published events and populate full college details
  const events = await Event.find({ status: "published" })
    .populate({
      path: "createdByCollege",
      select: "name email collegeProfile verificationStatus",
      match: { verificationStatus: "approved" } // Only get approved colleges
    })
    .sort({ startDate: 1 }) // Sort by upcoming events first
    .lean();

  // Filter out events where college is null (not approved)
  const filteredEvents = events.filter(event => event.createdByCollege !== null);

  // Add calculated fields for each event
  const eventsWithDetails = filteredEvents.map(event => ({
    ...event,
    availableSeats: event.maxParticipants 
      ? event.maxParticipants - event.currentParticipants 
      : null,
    isFull: event.maxParticipants 
      ? event.currentParticipants >= event.maxParticipants 
      : false,
    isRegistrationOpen: new Date() <= new Date(event.registrationDeadline),
  }));

  res.status(200).json({
    success: true,
    data: {
      events: eventsWithDetails,
      count: eventsWithDetails.length
    },
  });
});

// apply for event
export const applyForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const {
    phone,
    institution,
    educationLevel,
    isTeamRegistration,
    teamName,
    teamMembers,
    additionalNotes,
  } = req.body;

  // Validate required fields
  if (!phone || !institution || !educationLevel) {
    return next(
      new ErrorHandler(
        "Phone, institution, and education level are required",
        400
      )
    );
  }

  // Find the event
  const event = await Event.findById(eventId)
    .populate("createdByCollege", "verificationStatus");

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  // Check if event is published
  if (event.status !== "published") {
    return next(new ErrorHandler("This event is not available for registration", 400));
  }

  // Check if college is approved
  if (event.createdByCollege.verificationStatus !== "approved") {
    return next(new ErrorHandler("Event organizer is not verified", 400));
  }

  // Check if registration deadline has passed
  if (new Date() > new Date(event.registrationDeadline)) {
    return next(new ErrorHandler("Registration deadline has passed", 400));
  }

  // Check if event is full
  if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
    return next(new ErrorHandler("Event is full", 400));
  }

  // Check if user already registered
  const existingRegistration = await EventRegistration.findOne({
    event: eventId,
    student: req.user._id,
  });

  if (existingRegistration) {
    return next(new ErrorHandler("You have already registered for this event", 400));
  }

  // Validate team registration
  if (isTeamRegistration) {
    if (!teamName) {
      return next(new ErrorHandler("Team name is required for team registration", 400));
    }

    if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
      return next(new ErrorHandler("Team members are required for team registration", 400));
    }

    // Validate team size if event has team size limits
    const totalMembers = teamMembers.length + 1; // +1 for the team leader (current user)
    
    if (event.teamSize) {
      if (totalMembers < event.teamSize.min) {
        return next(
          new ErrorHandler(
            `Team must have at least ${event.teamSize.min} members (including you)`,
            400
          )
        );
      }
      
      if (totalMembers > event.teamSize.max) {
        return next(
          new ErrorHandler(
            `Team cannot exceed ${event.teamSize.max} members (including you)`,
            400
          )
        );
      }
    }

    // Validate team member details
    for (const member of teamMembers) {
      if (!member.name || !member.email) {
        return next(
          new ErrorHandler("All team members must have name and email", 400)
        );
      }
      
      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(member.email)) {
        return next(
          new ErrorHandler(`Invalid email format for team member: ${member.name}`, 400)
        );
      }
    }
  }

  // Create registration data
  const registrationData = {
    event: eventId,
    student: req.user._id,
    phone,
    institution,
    educationLevel: educationLevel.toLowerCase().replace(/\s+/g, '_'), // Convert to enum format
    isTeamRegistration: isTeamRegistration || false,
  };

  // Add team details if team registration
  if (isTeamRegistration) {
    registrationData.teamName = teamName;
    registrationData.teamMembers = teamMembers;
  }

  // Add additional notes if provided
  if (additionalNotes && additionalNotes.trim()) {
    registrationData.additionalNotes = additionalNotes.trim();
  }

  // Set payment status based on registration fee
  if (event.registrationFee && event.registrationFee > 0) {
    registrationData.paymentStatus = "pending";
    registrationData.paymentAmount = event.registrationFee;
  } else {
    // Free event - mark payment as completed
    registrationData.paymentStatus = "completed";
    registrationData.paymentAmount = 0;
  }

  // Create registration
  const registration = await EventRegistration.create(registrationData);

  // Update event participant count
  event.currentParticipants = (event.currentParticipants || 0) + 1;
  await event.save();

  // Populate the registration with event and student details
  await registration.populate([
    { path: "event", select: "title eventType startDate endDate venue registrationFee" },
    { path: "student", select: "name email" }
  ]);

  res.status(201).json({
    success: true,
    message: "Event registration submitted successfully",
    data: { 
      registration,
    },
  });
});

// ------------college applications----------------
// Get all applications for a specific event (College only)
export const getAllEventApplications = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;
  const { status, paymentStatus, isTeamRegistration, page = 1, limit = 10 } = req.query;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return next(new ErrorHandler("Invalid event ID format", 400));
  }

  // Find the event and verify ownership
  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  // Check if the college owns this event
  if (event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to view applications for this event", 403));
  }

  // Build query - FIXED: Convert eventId to ObjectId
  const query = { event: new mongoose.Types.ObjectId(eventId) };

  // Apply filters if provided
  if (status) {
    query.status = status;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  // Should use 'isTeamRegistration' from the destructured req.query
if (isTeamRegistration === "true" || isTeamRegistration === "false") {
  query.isTeamRegistration = isTeamRegistration === "true";
}

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch applications with pagination
  const applications = await EventRegistration.find(query)
    .populate({
      path: "student",
      select: "name email studentProfile",
    })
    .populate({
      path: "reviewedBy",
      select: "name email",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Get total count for pagination
  const total = await EventRegistration.countDocuments(query);

  // Calculate statistics - FIXED: Use ObjectId in aggregation
  const stats = await EventRegistration.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        approved: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
        },
        teamRegistrations: {
          $sum: { $cond: ['$isTeamRegistration', 1, 0] },
        },
        individualRegistrations: {
          $sum: { $cond: ['$isTeamRegistration', 0, 1] },
        },
        paymentCompleted: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] },
        },
        paymentPending: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      statistics: stats[0] || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        teamRegistrations: 0,
        individualRegistrations: 0,
        paymentCompleted: 0,
        paymentPending: 0,
      },
      eventDetails: {
        title: event.title,
        maxParticipants: event.maxParticipants,
        currentParticipants: event.currentParticipants,
        registrationFee: event.registrationFee,
      },
    },
  });
});
// Get single application details (College only)
export const getApplicationById = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;

  const application = await EventRegistration.findById(applicationId)
    .populate({
      path: "event",
      select: "title eventType startDate endDate venue registrationFee createdByCollege",
    })
    .populate({
      path: "student",
      select: "name email studentProfile",
    })
    .populate({
      path: "reviewedBy",
      select: "name email",
    });

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  // Check if the college owns the event
  if (application.event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to view this application", 403));
  }

  res.status(200).json({
    success: true,
    data: { application },
  });
});



// Approve application (College only)

export const approveApplication = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;

  const application = await EventRegistration.findById(applicationId).populate("event");

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  // Check if the college owns the event
  if (application.event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to approve this application", 403));
  }

  // Check if already approved
  if (application.status === "approved") {
    return next(new ErrorHandler("Application is already approved", 400));
  }

  // Update application
  application.status = "approved";
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  application.rejectionReason = undefined;

  await application.save();

  // Populate for response
  await application.populate([
    { path: "student", select: "name email" },
    { path: "reviewedBy", select: "name email" },
  ]);

  // Send approval email
  try {
    await sendApplicationApprovedEmail({
      email: application.student.email,
      studentName: application.student.name,
      eventName: application.event.name,
      collegeName: req.user.name || req.user.collegeName,
      eventDate: application.event.date ? new Date(application.event.date).toLocaleDateString() : "",
    });
  } catch (error) {
    console.error("Failed to send approval email:", error);
  }

  res.status(200).json({
    success: true,
    message: "Application approved successfully",
    data: { application },
  });

});

// Reject application (College only)
export const rejectApplication = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { rejectionReason } = req.body;

  if (!rejectionReason || !rejectionReason.trim()) {
    return next(new ErrorHandler("Rejection reason is required", 400));
  }

  const application = await EventRegistration.findById(applicationId).populate("event");

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  // Check if the college owns the event
  if (application.event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to reject this application", 403));
  }

  // Check if already rejected
  if (application.status === "rejected") {
    return next(new ErrorHandler("Application is already rejected", 400));
  }

  // If application was approved, decrease participant count
  if (application.status === "approved") {
    const event = await Event.findById(application.event._id);
    if (event && event.currentParticipants > 0) {
      event.currentParticipants -= 1;
      await event.save();
    }
  }

  // Update application
  application.status = "rejected";
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  application.rejectionReason = rejectionReason.trim();

  await application.save();

  // Populate for response
  await application.populate([
    { path: "student", select: "name email" },
    { path: "reviewedBy", select: "name email" },
  ]);

  // Send rejection email
  try {
    await sendApplicationRejectedEmail({
      email: application.student.email,
      studentName: application.student.name,
      eventName: application.event.name,
      collegeName: req.user.name || req.user.collegeName,
      rejectionReason: rejectionReason.trim(),
    });
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    // Don't fail the whole operation if email fails
  }

  res.status(200).json({
    success: true,
    message: "Application rejected successfully",
    data: { application },
  });
});

// Update payment status (College only)
export const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { applicationId } = req.params;
  const { paymentStatus, transactionId } = req.body;

  if (!["pending", "completed", "failed"].includes(paymentStatus)) {
    return next(new ErrorHandler("Invalid payment status", 400));
  }

  const application = await EventRegistration.findById(applicationId).populate("event");

  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }

  // Check if the college owns the event
  if (application.event.createdByCollege.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update payment status", 403));
  }

  // Update payment status
  application.paymentStatus = paymentStatus;
  
  if (transactionId) {
    application.transactionId = transactionId;
  }

  await application.save();

  res.status(200).json({
    success: true,
    message: "Payment status updated successfully",
    data: { application },
  });
});


// Get current user's application for a specific event
export const getMyApplicationForEvent = asyncHandler(async (req, res, next) => {
  const { eventId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return next(new ErrorHandler("Invalid event ID format", 400));
  }

  // Find the event first to ensure it exists
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  // Check if user has already applied
  const application = await EventRegistration.findOne({
    event: eventId,
    student: req.user._id,
  })
    .populate({
      path: "event",
      select: "title eventType startDate endDate venue registrationFee",
    })
    .populate({
      path: "reviewedBy",
      select: "name email",
    })
    .lean();

  if (!application) {
    return next(new ErrorHandler("No application found for this event", 404));
  }

  res.status(200).json({
    success: true,
    data: { application },
  });
});



// Add this to your event controller

// Get all applications for the authenticated student
export const getMyStudentApplications = asyncHandler(async (req, res, next) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { student: req.user._id };

  // Apply status filter if provided
  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch applications
  const applications = await EventRegistration.find(query)
    .populate({
      path: "event",
      select: "title eventType startDate endDate venue registrationFee createdByCollege",
    })
    .populate({
      path: "reviewedBy",
      select: "name email",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Get total count
  const total = await EventRegistration.countDocuments(query);

  // Calculate statistics
  const stats = await EventRegistration.aggregate([
    { $match: { student: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
        },
        approved: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
        },
        rejected: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      statistics: stats[0] || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    },
  });
});