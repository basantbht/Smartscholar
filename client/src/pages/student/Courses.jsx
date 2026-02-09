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
    // Extract unique degrees
    const uniqueDegrees = [
      ...new Set(coursesData.map((course) => course.degree).filter(Boolean)),
    ];
    setDegrees(uniqueDegrees);

    // Extract unique schools
    const uniqueSchools = [
      ...new Set(coursesData.map((course) => course.school).filter(Boolean)),
    ];
    setSchools(uniqueSchools);
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

    // Degree filter
    if (selectedDegree) {
      filtered = filtered.filter((course) => course.degree === selectedDegree);
    }

    // School filter
    if (selectedSchool) {
      filtered = filtered.filter((course) => course.school === selectedSchool);
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
      <div className="border-b border-gray-200 pb-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isOpen && <div className="space-y-2">{children}</div>}
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
        <div className="p-5 border-b-2 border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {course.name}
          </h3>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-1">{collegeName}</span>
          </div>
        </div>

        {/* Course Details */}
        <div className="p-5 space-y-3">
          {/* Degree & School */}
          <div className="flex flex-wrap gap-2">
            {course.degree && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                {course.degree}
              </span>
            )}
            {course.school && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200">
                {course.school}
              </span>
            )}
          </div>

          {/* Seats & Duration */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>4 years</span>
            </div>

            {course.seats !== undefined && (
              <div className="text-sm">
                <span className="font-bold text-gray-900">
                  {course.seats}
                </span>
                <span className="text-gray-500 ml-1">seats</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && allCourses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-5 sticky top-8 shadow-sm">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Level Filter */}
              <FilterSection title="Level">
                <div className="space-y-2">
                  {degrees.map((degree) => (
                    <label
                      key={degree}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
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
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {degree}
                      </span>
                      <span className="ml-auto text-xs text-gray-400">
                        {
                          allCourses.filter(
                            (course) => course.degree === degree
                          ).length
                        }
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* School Filter */}
              <FilterSection title="Discipline">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {schools.map((school) => (
                    <label
                      key={school}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
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
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                        {school}
                      </span>
                      <span className="text-xs text-gray-400">
                        {
                          allCourses.filter(
                            (course) => course.school === school
                          ).length
                        }
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Courses in Nepal
              </h1>
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {displayCourses.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {allCourses.length}
                </span>{" "}
                courses
              </p>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedDegree && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm">
                    {selectedDegree}
                    <button
                      onClick={() => setSelectedDegree("")}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedSchool && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm">
                    {selectedSchool}
                    <button
                      onClick={() => setSelectedSchool("")}
                      className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Courses Grid */}
            {displayCourses.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {displayCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Courses;