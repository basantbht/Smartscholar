import React, { useEffect, useState } from "react";
import { useScholarship } from "../../context/ScholarshipContext";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Power,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";

const CollegeScholarships = () => {
  const {
    scholarships,
    stats,
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
    statsLoading,
    fetchMyScholarships,
    createScholarship,
    updateScholarship,
    deleteScholarship,
    toggleScholarshipStatus,
    fetchScholarshipStats,
  } = useScholarship();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' | 'edit' | 'view'
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    type: "Merit Based",
    eligibility: "",
    description: "",
    benefits: "",
    amount: "",
    deadline: "",
    quotaPercentage: "",
    additionalAwards: "",
    requiredDocs: "",
    status: "active",
  });

  useEffect(() => {
    fetchMyScholarships();
    fetchScholarshipStats();
  }, []);

  // Filter scholarships
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || scholarship.type === filterType;
    const matchesStatus = filterStatus === "all" || scholarship.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setSelectedScholarship(null);
    setFormData({
      title: "",
      type: "Merit Based",
      eligibility: "",
      description: "",
      benefits: "",
      amount: "",
      deadline: "",
      quotaPercentage: "",
      additionalAwards: "",
      requiredDocs: "",
      status: "active",
    });
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (scholarship) => {
    setModalMode("edit");
    setSelectedScholarship(scholarship);
    setFormData({
      title: scholarship.title || "",
      type: scholarship.type || "Merit Based",
      eligibility: scholarship.eligibility || "",
      description: scholarship.description || "",
      benefits: scholarship.benefits || "",
      amount: scholarship.amount || "",
      deadline: scholarship.deadline ? scholarship.deadline.split("T")[0] : "",
      quotaPercentage: scholarship.quotaPercentage || "",
      additionalAwards: scholarship.additionalAwards?.join(", ") || "",
      requiredDocs: scholarship.requiredDocs?.join(", ") || "",
      status: scholarship.status || "active",
    });
    setShowModal(true);
  };

  // Open modal for view
  const handleView = (scholarship) => {
    setModalMode("view");
    setSelectedScholarship(scholarship);
    setShowModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: formData.amount ? Number(formData.amount) : null,
      quotaPercentage: formData.quotaPercentage ? Number(formData.quotaPercentage) : null,
      additionalAwards: formData.additionalAwards
        ? formData.additionalAwards.split(",").map((a) => a.trim())
        : [],
      requiredDocs: formData.requiredDocs
        ? formData.requiredDocs.split(",").map((d) => d.trim())
        : [],
    };

    try {
      if (modalMode === "create") {
        await createScholarship(payload);
      } else if (modalMode === "edit") {
        await updateScholarship(selectedScholarship._id, payload);
      }

      setShowModal(false);
      fetchScholarshipStats();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (scholarshipId) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      try {
        await deleteScholarship(scholarshipId);
        fetchScholarshipStats();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (scholarshipId) => {
    try {
      await toggleScholarshipStatus(scholarshipId);
      fetchScholarshipStats();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scholarships Management</h1>
          <p className="text-gray-600">Manage your college scholarships and track applications</p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="text-center py-8">Loading stats...</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={<Award className="w-6 h-6" />}
              label="Total Scholarships"
              value={stats.total}
              color="blue"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Active"
              value={stats.active}
              color="green"
            />
            <StatsCard
              icon={<Users className="w-6 h-6" />}
              label="Inactive"
              value={stats.inactive}
              color="yellow"
            />
            <StatsCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Merit Based"
              value={stats.byType?.meritBased || 0}
              color="purple"
            />
          </div>
        ) : null}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter by Type */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Merit Based">Merit Based</option>
                <option value="Need Based">Need Based</option>
                <option value="Performance Based">Performance Based</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Scholarship
            </button>
          </div>
        </div>

        {/* Scholarships List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading scholarships...</p>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first scholarship"}
            </p>
            {!searchTerm && filterType === "all" && filterStatus === "all" && (
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create First Scholarship
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship._id}
                scholarship={scholarship}
                onEdit={() => handleEdit(scholarship)}
                onDelete={() => handleDelete(scholarship._id)}
                onView={() => handleView(scholarship)}
                onToggleStatus={() => handleToggleStatus(scholarship._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ScholarshipModal
          mode={modalMode}
          scholarship={selectedScholarship}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
          loading={createLoading || updateLoading}
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// Scholarship Card Component
const ScholarshipCard = ({ scholarship, onEdit, onDelete, onView, onToggleStatus }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
  };

  const typeColors = {
    "Merit Based": "bg-blue-100 text-blue-800",
    "Need Based": "bg-purple-100 text-purple-800",
    "Performance Based": "bg-orange-100 text-orange-800",
    Other: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{scholarship.title}</h3>
        <button
          onClick={onToggleStatus}
          className={`ml-2 p-2 rounded-lg transition ${
            scholarship.status === "active" ? "bg-green-50 hover:bg-green-100" : "bg-gray-50 hover:bg-gray-100"
          }`}
          title={`${scholarship.status === "active" ? "Deactivate" : "Activate"} scholarship`}
        >
          <Power className={`w-4 h-4 ${scholarship.status === "active" ? "text-green-600" : "text-gray-400"}`} />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[scholarship.type]}`}>
          {scholarship.type}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[scholarship.status]}`}>
          {scholarship.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scholarship.description}</p>

      <div className="space-y-2 mb-4">
        {scholarship.amount && (
          <div className="flex items-center text-sm text-gray-700">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">NPR {scholarship.amount.toLocaleString()}</span>
          </div>
        )}
        {scholarship.deadline && (
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
          </div>
        )}
        {scholarship.quotaPercentage && (
          <div className="flex items-center text-sm text-gray-700">
            <Award className="w-4 h-4 mr-2 text-gray-400" />
            <span>Quota: {scholarship.quotaPercentage}%</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Scholarship Modal Component
const ScholarshipModal = ({ mode, scholarship, formData, onInputChange, onSubmit, onClose, loading }) => {
  const isViewMode = mode === "view";

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create Scholarship" : mode === "edit" ? "Edit Scholarship" : "Scholarship Details"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {isViewMode ? (
          <div className="p-6 space-y-4">
            <DetailRow label="Title" value={scholarship.title} />
            <DetailRow label="Type" value={scholarship.type} />
            <DetailRow label="Status" value={scholarship.status} />
            <DetailRow label="Eligibility" value={scholarship.eligibility} />
            <DetailRow label="Description" value={scholarship.description} />
            {scholarship.benefits && <DetailRow label="Benefits" value={scholarship.benefits} />}
            {scholarship.amount && <DetailRow label="Amount" value={`NPR ${scholarship.amount.toLocaleString()}`} />}
            {scholarship.deadline && (
              <DetailRow label="Deadline" value={new Date(scholarship.deadline).toLocaleDateString()} />
            )}
            {scholarship.quotaPercentage && <DetailRow label="Quota" value={`${scholarship.quotaPercentage}%`} />}
            {scholarship.additionalAwards?.length > 0 && (
              <DetailRow label="Additional Awards" value={scholarship.additionalAwards.join(", ")} />
            )}
            {scholarship.requiredDocs?.length > 0 && (
              <DetailRow label="Required Documents" value={scholarship.requiredDocs.join(", ")} />
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <FormInput
              label="Title *"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              required
              placeholder="e.g., Merit Scholarship 2024"
            />

            <FormSelect
              label="Type *"
              name="type"
              value={formData.type}
              onChange={onInputChange}
              required
              options={[
                { value: "Merit Based", label: "Merit Based" },
                { value: "Need Based", label: "Need Based" },
                { value: "Performance Based", label: "Performance Based" },
                { value: "Other", label: "Other" },
              ]}
            />

            <FormTextarea
              label="Eligibility *"
              name="eligibility"
              value={formData.eligibility}
              onChange={onInputChange}
              required
              placeholder="Describe eligibility criteria..."
              rows={3}
            />

            <FormTextarea
              label="Description *"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              required
              placeholder="Detailed description of the scholarship..."
              rows={4}
            />

            <FormTextarea
              label="Benefits"
              name="benefits"
              value={formData.benefits}
              onChange={onInputChange}
              placeholder="What benefits does this scholarship provide?"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Amount (NPR)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={onInputChange}
                placeholder="e.g., 50000"
              />

              <FormInput
                label="Quota Percentage"
                name="quotaPercentage"
                type="number"
                value={formData.quotaPercentage}
                onChange={onInputChange}
                placeholder="e.g., 10"
                min="0"
                max="100"
              />
            </div>

            <FormInput
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={onInputChange}
            />

            <FormInput
              label="Additional Awards (comma-separated)"
              name="additionalAwards"
              value={formData.additionalAwards}
              onChange={onInputChange}
              placeholder="e.g., Certificate, Trophy"
            />

            <FormInput
              label="Required Documents (comma-separated)"
              name="requiredDocs"
              value={formData.requiredDocs}
              onChange={onInputChange}
              placeholder="e.g., Transcript, ID Card, Bank Statement"
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={onInputChange}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "expired", label: "Expired" },
              ]}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : mode === "create" ? "Create Scholarship" : "Update Scholarship"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Form Components
const FormInput = ({ label, name, type = "text", value, onChange, required, placeholder, min, max }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const FormTextarea = ({ label, name, value, onChange, required, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, required, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-gray-900">{value}</p>
  </div>
);

export default CollegeScholarships;