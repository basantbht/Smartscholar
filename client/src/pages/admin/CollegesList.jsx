import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Building2, Mail, Phone, Globe, MapPin, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const CollegesListAdmin = () => {
  const { colleges, pagination, loading, fetchColleges, updateVerification } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch colleges on component mount and when filters change
  useEffect(() => {
    fetchColleges({
      verificationStatus: filterStatus === 'all' ? '' : filterStatus,
      search: searchTerm,
      page: currentPage,
      limit: 10
    });
  }, [searchTerm, filterStatus, currentPage]);

  const getStatusBadge = (status) => {
    const badges = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' },
      notSubmitted: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Not Submitted' }
    };
    
    const badge = badges[status] || badges.notSubmitted;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const handleViewDetails = (college) => {
    setSelectedCollege(college);
    setShowModal(true);
  };

  const handleUpdateStatus = async (collegeId, newStatus) => {
    try {
      await updateVerification(collegeId, newStatus);
      await fetchColleges({
        verificationStatus: filterStatus === 'all' ? '' : filterStatus,
        search: searchTerm,
        page: currentPage,
        limit: 10
      });
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !colleges.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Colleges Management</h1>
          <p className="text-gray-600">Manage and verify college registrations</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by college name, university, or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer min-w-45"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="notSubmitted">Not Submitted</option>
              </select>
            </div>
          </div>

          {pagination && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {colleges.length} of {pagination.total} colleges
            </div>
          )}
        </div>

        {/* Colleges Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colleges.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No colleges found</p>
                    </td>
                  </tr>
                ) : (
                  colleges.map((college) => (
                    <tr key={college._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-12 w-12">
                            {college.collegeProfile?.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={college.collegeProfile.image}
                                alt={college.collegeProfile.collegeName}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {college.collegeProfile?.collegeName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {college.collegeProfile?.address || 'No address'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {college.email}
                        </div>
                        {college.collegeProfile?.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {college.collegeProfile.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {college.collegeProfile?.universityAffiliation || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(college.verificationStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(college.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(college)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedCollege && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">College Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {selectedCollege.collegeProfile?.image && (
                  <img
                    src={selectedCollege.collegeProfile.image}
                    alt={selectedCollege.collegeProfile.collegeName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedCollege.collegeProfile?.collegeName || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedCollege.collegeProfile?.universityAffiliation || 'N/A'}
                    </p>
                  </div>

                  {selectedCollege.collegeProfile?.description && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-sm text-gray-600">{selectedCollege.collegeProfile.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Email</h4>
                      <p className="text-sm text-gray-600">{selectedCollege.email}</p>
                    </div>
                    {selectedCollege.collegeProfile?.phone && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Phone</h4>
                        <p className="text-sm text-gray-600">{selectedCollege.collegeProfile.phone}</p>
                      </div>
                    )}
                  </div>

                  {selectedCollege.collegeProfile?.address && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Address</h4>
                      <p className="text-sm text-gray-600">{selectedCollege.collegeProfile.address}</p>
                    </div>
                  )}

                  {selectedCollege.collegeProfile?.website && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-1">Website</h4>
                      <a
                        href={selectedCollege.collegeProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-4 h-4" />
                        {selectedCollege.collegeProfile.website}
                      </a>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Verification Status</h4>
                    {getStatusBadge(selectedCollege.verificationStatus)}
                  </div>

                  {selectedCollege.verificationStatus === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleUpdateStatus(selectedCollege._id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedCollege._id, 'rejected')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegesListAdmin;