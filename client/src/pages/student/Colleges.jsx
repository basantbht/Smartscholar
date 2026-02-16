import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Star,
  BookOpen,
  Calendar,
  Award,
  X
} from 'lucide-react';

const Colleges = () => {
  const { colleges, pagination, loading, fetchColleges } = useUser();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 12,
    verificationStatus: 'approved'
  });

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchColleges(filters);
  }, [filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '', page: 1 }));
  };

  const handleViewCollege = (collegeId) => {
    navigate(`/colleges/${collegeId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Colleges</h1>
          <p className="text-gray-600">Explore verified colleges and universities</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Results
              </h2>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search Colleges
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  />
                  {searchInput && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full mt-3 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Search
                </button>
              </div>

              {/* Results Per Page */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Show Results
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium text-sm"
                >
                  <option value={6}>6 colleges per page</option>
                  <option value={12}>12 colleges per page</option>
                  <option value={24}>24 colleges per page</option>
                  <option value={48}>48 colleges per page</option>
                </select>
              </div>

              {/* Info Box */}
              <div className="p-5 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Verified Colleges</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      All colleges shown are verified and approved by our team for quality assurance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Colleges</span>
                    <span className="font-bold text-gray-900">{pagination?.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current Page</span>
                    <span className="font-bold text-gray-900">{pagination?.page || 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-96 bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
                  <p className="text-gray-600 font-semibold text-lg">Loading colleges...</p>
                  <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
                </div>
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Colleges Found</h3>
                  <p className="text-gray-600 mb-8">
                    We couldn't find any colleges matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  {filters.search && (
                    <button
                      onClick={clearSearch}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {pagination?.total || 0} Verified Colleges
                      </h2>
                      <p className="text-gray-600">
                        {filters.search 
                          ? `Showing results for "${filters.search}"`
                          : 'Showing all verified institutions'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Colleges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {colleges.map((college) => (
                    <article
                      key={college._id}
                      className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => handleViewCollege(college._id)}
                    >
                      {/* College Image/Header */}
                      <div className="relative h-48 bg-linear-to-br from-blue-50 to-indigo-50 overflow-hidden">
                        {college.collegeProfile?.image ? (
                          <img
                            src={college.collegeProfile.image}
                            alt={college.collegeProfile?.collegeName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-20 h-20 text-blue-200" />
                          </div>
                        )}
                        
                        {/* Verified Badge */}
                        {college.verificationStatus === 'approved' && (
                          <div className="absolute top-4 right-4 bg-white text-green-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            Verified
                          </div>
                        )}
                      </div>

                      {/* College Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {college.collegeProfile?.collegeName || college.name || 'College Name'}
                        </h3>

                        {/* University Affiliation */}
                        {college.collegeProfile?.universityAffiliation && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Award className="w-4 h-4 text-blue-500 shrink-0" />
                            <span className="font-medium">{college.collegeProfile.universityAffiliation}</span>
                          </div>
                        )}

                        {/* Description */}
                        {college.collegeProfile?.description && (
                          <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                            {college.collegeProfile.description}
                          </p>
                        )}

                        {/* Contact Information */}
                        <div className="space-y-3 mb-6">
                          {college.email && (
                            <div className="flex items-start gap-3">
                              <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700 break-all">{college.email}</span>
                            </div>
                          )}
                          
                          {college.collegeProfile?.phone && (
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-sm text-gray-700">{college.collegeProfile.phone}</span>
                            </div>
                          )}
                          
                          {college.collegeProfile?.website && (
                            <div className="flex items-center gap-3">
                              <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                              <a
                                href={college.collegeProfile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline truncate flex items-center gap-1"
                              >
                                Visit Website
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Address */}
                        {college.collegeProfile?.address && (
                          <div className="p-4 bg-gray-50 rounded-xl mb-5 border border-gray-100">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">Location</p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {college.collegeProfile.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Stats */}
                        <div className="flex items-center justify-between mb-5 py-3 border-t border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">
                              <span className="font-semibold text-gray-900">{college.collegeProfile?.courses?.length || 0}</span> Courses
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm text-gray-600">
                              <span className="font-semibold text-gray-900">{college.collegeProfile?.events?.length || 0}</span> Events
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCollege(college._id);
                          }}
                          className="w-full py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg group-hover:shadow-xl"
                        >
                          View Full Profile
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      {/* Page Numbers */}
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 7) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 4) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.totalPages - 3) {
                            pageNum = pagination.totalPages - 6 + i;
                          } else {
                            pageNum = pagination.page - 3 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`min-w-11 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                                pageNum === pagination.page
                                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110'
                                  : 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Pagination Info */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Page <span className="font-bold text-gray-900">{pagination.page}</span> of{' '}
                        <span className="font-bold text-gray-900">{pagination.totalPages}</span>
                        {' • '}
                        Showing <span className="font-bold text-gray-900">{colleges.length}</span> of{' '}
                        <span className="font-bold text-gray-900">{pagination.total}</span> colleges
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Colleges;