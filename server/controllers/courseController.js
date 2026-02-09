import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { Course } from "../models/course.js";

// Helper middleware
const ensureApprovedCollege = (req, next) => {
  if (req.user.verificationStatus !== "approved") {
    return next(new ErrorHandler("College not approved yet", 403));
  }
};

// ----------------college routes-----------------

// Create a new course
export const createCourse = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

    const { name, degree, seats, school, duration } = req.body;

  if (!name) {
    return next(new ErrorHandler("Course name is required", 400));
  }

  // Create the course
  const course = await Course.create({
    name,
    degree: degree || null,
    seats: seats || 0,
    duration: duration || 0,
    school: school || null,
    college: req.user._id,
  });

  // Add course reference to college profile
  const college = await User.findById(req.user._id);
  if (!college) {
    return next(new ErrorHandler("College not found", 404));
  }

  college.collegeProfile.courses.push(course._id);
  await college.save();

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: { course },
  });
});

// Get all courses for the logged-in college
export const getMyCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ college: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: { 
      courses,
      count: courses.length 
    },
  });
});

// Get a single course by ID
export const getCourseById = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate(
    "college",
    "name email collegeProfile.collegeName"
  );

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Check if the course belongs to the logged-in college
  if (course.college._id.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to view this course", 403));
  }

  res.status(200).json({
    success: true,
    data: { course },
  });
});

// Update a course
export const updateCourse = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { courseId } = req.params;
  const { name, degree, seats, school,duration } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Check if the course belongs to the logged-in college
  if (course.college.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this course", 403));
  }

  // Update fields only if provided
  if (name !== undefined) course.name = name;
  if (degree !== undefined) course.degree = degree;
  if (seats !== undefined) course.seats = seats;
  if (duration !== undefined) course.duration = duration;
  if (school !== undefined) course.school = school;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: { course },
  });
});

// Delete a course
export const deleteCourse = asyncHandler(async (req, res, next) => {
  ensureApprovedCollege(req, next);

  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Check if the course belongs to the logged-in college
  if (course.college.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to delete this course", 403));
  }

  // Remove course reference from college profile
  const college = await User.findById(req.user._id);
  if (college) {
    college.collegeProfile.courses = college.collegeProfile.courses.filter(
      (id) => id.toString() !== courseId
    );
    await college.save();
  }

  // Delete the course
  await Course.findByIdAndDelete(courseId);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

// Get all courses by college ID (public - for students)
export const getCoursesByCollegeId = asyncHandler(async (req, res, next) => {
  const { collegeId } = req.params;

  const college = await User.findById(collegeId);
  if (!college || college.role !== "College") {
    return next(new ErrorHandler("College not found", 404));
  }

  const courses = await Course.find({ college: collegeId })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: { 
      courses,
      count: courses.length,
      collegeName: college.collegeProfile.collegeName || college.name
    },
  });
});


// -----------Student Routes------------------
export const getAllCollegesCourses = asyncHandler(async (req, res, next) => {
  // Fetch all courses and populate full college details
  const courses = await Course.find()
    .populate({
      path: "college",
      select: "name email collegeProfile verificationStatus",
      match: { verificationStatus: "approved" } // Only get approved colleges
    })
    .sort({ createdAt: -1 })
    .lean();

  // Filter out courses where college is null (not approved)
  const filteredCourses = courses.filter(course => course.college !== null);

  res.status(200).json({
    success: true,
    data: {
      courses: filteredCourses,
      count: filteredCourses.length
    },
  });
});