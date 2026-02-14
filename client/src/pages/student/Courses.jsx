import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCollege } from "../../context/CollegeContext";
import {
  BookOpen,
  Building2,
  Search,
  X,
  Clock,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

const Courses = () => {
  const navigate = useNavigate();
  const { getAllCollegesCourses, allCourses, loading } = useCollege();

  // State
  const [displayCourses, setDisplayCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  // Derived data for filters
  const [degrees, setDegrees] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (allCourses.length > 0) {
      extractFilterOptions(allCourses);
      applyFilters();
    }
  }, [allCourses, searchQuery, selectedDegree, selectedSchool]);

  const loadCourses = async () => {
    try {
      await getAllCollegesCourses();
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  const extractFilterOptions = (coursesData) => {
    // Extract unique degrees and normalize them
    const uniqueDegrees = [
      ...new Set(
        coursesData
          .map((course) => course.degree)
          .filter(Boolean)
          .map((degree) => {
            // Normalize degree names - capitalize first letter
            return degree.charAt(0).toUpperCase() + degree.slice(1).toLowerCase();
          })
      ),
    ];
    setDegrees(uniqueDegrees.sort());

    // Extract unique schools and normalize them
    const uniqueSchools = [
      ...new Set(
        coursesData
          .map((course) => course.school)
          .filter(Boolean)
          .map((school) => {
            // Normalize school names - capitalize first letter of each word
            return school
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(" ");
          })
      ),
    ];
    setSchools(uniqueSchools.sort());
  };

  const applyFilters = () => {
    let filtered = [...allCourses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.college?.collegeProfile?.collegeName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Degree filter - normalize comparison
    if (selectedDegree) {
      filtered = filtered.filter(
        (course) =>
          course.degree &&
          course.degree.toLowerCase() === selectedDegree.toLowerCase()
      );
    }

    // School filter - normalize comparison
    if (selectedSchool) {
      filtered = filtered.filter(
        (course) =>
          course.school &&
          course.school.toLowerCase() === selectedSchool.toLowerCase()
      );
    }

    setDisplayCourses(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDegree("");
    setSelectedSchool("");
  };

  const hasActiveFilters = searchQuery || selectedDegree || selectedSchool;

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left mb-3 font-semibold text-gray-900 hover:text-blue-600 transition-colors"
        >
          <span className="text-sm uppercase tracking-wider">{title}</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isOpen && <div className="space-y-2.5">{children}</div>}
      </div>
    );
  };

  const CourseCard = ({ course }) => {
    const collegeName =
      course.college?.collegeProfile?.collegeName ||
      course.college?.name ||
      "Unknown College";

    return (
      <div
        onClick={() => navigate(`/colleges/${course.college?._id}`)}
        className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg"
      >
        {/* Course Header */}
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {course.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="text-sm truncate">{collegeName}</span>
          </div>
        </div>

        {/* Course Details */}
        <div className="p-5 space-y-3">
          {/* Degree & School */}
          <div className="flex flex-wrap gap-2">
            {course.degree && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {course.degree.charAt(0).toUpperCase() + course.degree.slice(1).toLowerCase()}
              </span>
            )}
            {course.school && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                {course.school
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(" ")}
              </span>
            )}
          </div>

          {/* Seats & Duration */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>4 years</span>
            </div>
            {course.seats !== undefined && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{course.seats} seats</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && allCourses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Level Filter */}
              <FilterSection title="LEVEL">
                {degrees.map((degree) => {
                  const count = allCourses.filter(
                    (course) =>
                      course.degree &&
                      course.degree.toLowerCase() === degree.toLowerCase()
                  ).length;

                  return (
                    <label
                      key={degree}
                      className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="radio"
                          name="degree"
                          checked={selectedDegree === degree}
                          onChange={() =>
                            setSelectedDegree(
                              selectedDegree === degree ? "" : degree
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                          {degree}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 shrink-0">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </FilterSection>

              {/* School Filter */}
              <FilterSection title="DISCIPLINE">
                {schools.map((school) => {
                  const count = allCourses.filter(
                    (course) =>
                      course.school &&
                      course.school.toLowerCase() === school.toLowerCase()
                  ).length;

                  return (
                    <label
                      key={school}
                      className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedSchool === school}
                          onChange={() =>
                            setSelectedSchool(
                              selectedSchool === school ? "" : school
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                          {school}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 ml-2 shrink-0">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </FilterSection>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Courses in Nepal
              </h1>
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {displayCourses.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {allCourses.length}
                </span>{" "}
                courses
              </p>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                {selectedDegree && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white">
                    {selectedDegree}
                    <button
                      onClick={() => setSelectedDegree("")}
                      className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedSchool && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-white">
                    {selectedSchool}
                    <button
                      onClick={() => setSelectedSchool("")}
                      className="hover:bg-gray-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Courses Grid */}
            {displayCourses.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="max-w-md mx-auto px-4">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {hasActiveFilters
                      ? "Try adjusting your filters to see more results"
                      : "No courses are available at the moment"}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;