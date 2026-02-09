  import { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { useEvents } from "../../context/EventContext";
  import { 
    Users, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Search, 
    Filter,
    Download,
    Eye,
    ArrowLeft,
    TrendingUp,
    DollarSign,
    UserCheck,
    AlertCircle
  } from "lucide-react";

  const CollegeApplications = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const {
      applications,
      applicationStats,
      applicationLoading,
      getAllEventApplications,
      approveApplication,
      rejectApplication,
    } = useEvents();

    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [filters, setFilters] = useState({
      status: "",
      paymentStatus: "",
      isTeamRegistration: "",
      page: 1,
      limit: 10,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
      if (eventId) {
        fetchApplications();
      }
    }, [eventId, filters.status, filters.paymentStatus, filters.isTeamRegistration, filters.page, filters.limit]);

    const fetchApplications = async () => {
      await getAllEventApplications(eventId, filters);
    };

    const handleApprove = async (applicationId) => {
      if (window.confirm("Are you sure you want to approve this application?")) {
        await approveApplication(applicationId);
        fetchApplications();
      }
    };

    const handleRejectClick = (app) => {
      setSelectedApp(app);
      setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
      if (!rejectionReason.trim()) {
        return;
      }

      await rejectApplication(selectedApp._id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedApp(null);
      fetchApplications();
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "approved":
          return "bg-emerald-100 text-emerald-800 border-emerald-200";
        case "rejected":
          return "bg-rose-100 text-rose-800 border-rose-200";
        case "pending":
          return "bg-amber-100 text-amber-800 border-amber-200";
        default:
          return "bg-slate-100 text-slate-800 border-slate-200";
      }
    };

    const getPaymentStatusColor = (status) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "failed":
          return "bg-red-100 text-red-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const filteredApplications = applications.filter((app) =>
      app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
      <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
            {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
          </div>
          <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </div>
    );

    if (applicationLoading && !applications.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading applications...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Events</span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Event Applications
                </h1>
                <p className="text-slate-600">
                  Manage and review student applications
                </p>
              </div>
              
              <button
                onClick={() => {/* Add export functionality */}}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">Export Data</span>
              </button>
            </div>
          </div>

          {/* Statistics */}
          {applicationStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Applications"
                value={applicationStats.total || 0}
                color="text-blue-600"
              />
              <StatCard
                icon={Clock}
                label="Pending Review"
                value={applicationStats.pending || 0}
                color="text-amber-600"
                subtext={`${Math.round(((applicationStats.pending || 0) / (applicationStats.total || 1)) * 100)}% of total`}
              />
              <StatCard
                icon={CheckCircle}
                label="Approved"
                value={applicationStats.approved || 0}
                color="text-emerald-600"
                subtext={`${applicationStats.paymentCompleted || 0} paid`}
              />
              <StatCard
                icon={XCircle}
                label="Rejected"
                value={applicationStats.rejected || 0}
                color="text-rose-600"
              />
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by student name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Application Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={filters.paymentStatus}
                    onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registration Type
                  </label>
                  <select
                    value={filters.isTeamRegistration}
                    onChange={(e) => setFilters({ ...filters, isTeamRegistration: e.target.value, page: 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="true">Team Registration</option>
                    <option value="false">Individual</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Applications List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg font-medium mb-2">No applications found</p>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? "Try adjusting your search or filters" : "No applications have been submitted yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredApplications.map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {app.student?.name || "N/A"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {app.student?.email || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            app.isTeamRegistration
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {app.isTeamRegistration ? "Team" : "Individual"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(app.paymentStatus)}`}>
                            {app.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {app.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(app._id)}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(app)}
                                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && selectedApp && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Reject Application</h2>
              </div>
              
              <p className="text-slate-600 mb-6">
                You are about to reject the application from{" "}
                <span className="font-semibold text-slate-900">
                  {selectedApp.student?.name}
                </span>
                . Please provide a reason for rejection.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Explain why this application is being rejected..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRejectSubmit}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedApp(null);
                  }}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {selectedApp && !showRejectModal && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Application Details</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Name</p>
                      <p className="font-medium text-slate-900">{selectedApp.student?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Email</p>
                      <p className="font-medium text-slate-900">{selectedApp.student?.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Application Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedApp.status)}`}>
                        {selectedApp.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Payment Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedApp.paymentStatus)}`}>
                        {selectedApp.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Registration Type</p>
                      <p className="font-medium text-slate-900">
                        {selectedApp.isTeamRegistration ? "Team Registration" : "Individual"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Applied On</p>
                      <p className="font-medium text-slate-900">
                        {new Date(selectedApp.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                {selectedApp.rejectionReason && (
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-rose-900 mb-2">Rejection Reason</h3>
                    <p className="text-slate-700">{selectedApp.rejectionReason}</p>
                  </div>
                )}

                {/* Reviewed By */}
                {selectedApp.reviewedBy && (
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Review Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Reviewed By</p>
                        <p className="font-medium text-slate-900">{selectedApp.reviewedBy?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Reviewed At</p>
                        <p className="font-medium text-slate-900">
                          {selectedApp.reviewedAt
                            ? new Date(selectedApp.reviewedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedApp.status === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        handleApprove(selectedApp._id);
                        setSelectedApp(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Application
                    </button>
                    <button
                      onClick={() => {
                        handleRejectClick(selectedApp);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default CollegeApplications;