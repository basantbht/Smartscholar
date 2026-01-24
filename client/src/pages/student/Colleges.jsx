import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Building2, MapPin, Globe, Phone, Mail, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const Colleges = () => {
  const { colleges, pagination, loading, fetchColleges } = useUser();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 12,
    verificationStatus: 'approved' // Only show approved colleges
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Colleges</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Explore verified colleges and universities to find your perfect match
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search colleges by name or university affiliation..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
            {filters.search && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Options
              </h2>

              {/* Items per page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Results per page
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={6}>6 colleges</option>
                  <option value={12}>12 colleges</option>
                  <option value={24}>24 colleges</option>
                  <option value={48}>48 colleges</option>
                </select>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Use the search bar to find colleges by name or university affiliation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Colleges Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading colleges...</p>
                </div>
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-16 text-center">
                <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No colleges found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search terms to find what you're looking for</p>
                {filters.search && (
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{pagination?.total || 0}</span> verified colleges
                    {filters.search && <span> matching "{filters.search}"</span>}
                  </p>
                </div>

                {/* Colleges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {colleges.map((college) => (
                    <div
                      key={college._id}
                      className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                      onClick={() => handleViewCollege(college._id)}
                    >
                      {/* College Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-start gap-4">
                          {college.collegeProfile?.image ? (
                            <img
                              src={college.collegeProfile.image}
                              alt={college.collegeProfile?.collegeName}
                              className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border-2 border-white/30"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold mb-2 line-clamp-2">
                              {college.collegeProfile?.collegeName || college.name || 'College Name'}
                            </h3>
                            <div className="flex items-center gap-2 text-blue-100">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm truncate">
                                {college.collegeProfile?.universityAffiliation || 'Independent College'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* College Details */}
                      <div className="p-6">
                        {college.collegeProfile?.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {college.collegeProfile.description}
                          </p>
                        )}

                        <div className="space-y-3 mb-6">
                          {college.email && (
                            <div className="flex items-start gap-3">
                              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700 break-all">{college.email}</span>
                            </div>
                          )}
                          
                          {college.collegeProfile?.phone && (
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{college.collegeProfile.phone}</span>
                            </div>
                          )}
                          
                          {college.collegeProfile?.website && (
                            <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              <a
                                href={college.collegeProfile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate flex items-center gap-1"
                              >
                                Visit Website
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {college.collegeProfile?.address && (
                          <div className="p-4 bg-gray-50 rounded-lg mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-1">Address</p>
                            <p className="text-sm text-gray-700">
                              {college.collegeProfile.address}
                            </p>
                          </div>
                        )}

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCollege(college._id);
                          }}
                          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium group-hover:shadow-lg"
                        >
                          View College Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                pageNum === pagination.page
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-600">
                        Page <span className="font-semibold">{pagination.page}</span> of{' '}
                        <span className="font-semibold">{pagination.totalPages}</span>
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Colleges;