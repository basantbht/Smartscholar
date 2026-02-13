import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Building2,
  GraduationCap,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
} from "lucide-react";

const EventApplicationModal = ({ isOpen, onClose, event, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    phone: "",
    institution: "",
    educationLevel: "",
    isTeamRegistration: false,
    teamName: "",
    teamMembers: [],
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const educationLevels = [
    "High School",
    "Undergraduate",
    "Graduate",
    "Postgraduate",
    "PhD",
    "Professional",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAddTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        { name: "", email: "", phone: "" },
      ],
    }));
  };

  const handleRemoveTeamMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "Institution name is required";
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = "Education level is required";
    }

    if (formData.isTeamRegistration) {
      if (!formData.teamName.trim()) {
        newErrors.teamName = "Team name is required";
      }

      if (formData.teamMembers.length === 0) {
        newErrors.teamMembers = "At least one team member is required";
      } else {
        formData.teamMembers.forEach((member, index) => {
          if (!member.name.trim()) {
            newErrors[`teamMember${index}Name`] = "Member name is required";
          }
          if (!member.email.trim()) {
            newErrors[`teamMember${index}Email`] = "Member email is required";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
            newErrors[`teamMember${index}Email`] = "Invalid email format";
          }
        });
      }

      // Check team size limits if event has team size configuration
      if (event.teamSize) {
        const totalMembers = formData.teamMembers.length + 1; // +1 for the applicant
        if (totalMembers < event.teamSize.min) {
          newErrors.teamMembers = `Team must have at least ${event.teamSize.min} members (including you)`;
        }
        if (totalMembers > event.teamSize.max) {
          newErrors.teamMembers = `Team cannot exceed ${event.teamSize.max} members (including you)`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        phone: "",
        institution: "",
        educationLevel: "",
        isTeamRegistration: false,
        teamName: "",
        teamMembers: [],
        additionalNotes: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Apply for Event</h2>
            <p className="text-emerald-50 text-sm mt-1">{event.title}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="px-6 py-6 space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Contact Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977 9812345678"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                Academic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Your college/university name"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                      errors.institution ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                  />
                </div>
                {errors.institution && (
                  <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level *
                </label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.educationLevel ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                >
                  <option value="">Select education level</option>
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.educationLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>
                )}
              </div>
            </div>

            {/* Team Registration - Always show this option */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isTeamRegistration"
                  name="isTeamRegistration"
                  checked={formData.isTeamRegistration}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label
                  htmlFor="isTeamRegistration"
                  className="text-sm font-medium text-gray-900 flex items-center gap-2"
                >
                  <Users className="w-5 h-5 text-emerald-600" />
                  Register as a Team
                  {event.teamSize && (
                    <span className="text-gray-500 text-xs">
                      (Team size: {event.teamSize.min}-{event.teamSize.max} members)
                    </span>
                  )}
                </label>
              </div>

              {formData.isTeamRegistration && (
                <div className="space-y-4 pl-8 border-l-2 border-emerald-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleChange}
                      placeholder="Enter team name"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.teamName ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition`}
                    />
                    {errors.teamName && (
                      <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Team Members *
                      </label>
                      <button
                        type="button"
                        onClick={handleAddTeamMember}
                        className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add Member
                      </button>
                    </div>

                    {errors.teamMembers && (
                      <p className="text-red-500 text-sm mb-3">{errors.teamMembers}</p>
                    )}

                    <div className="space-y-3">
                      {formData.teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              Member {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTeamMember(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) =>
                              handleTeamMemberChange(index, "name", e.target.value)
                            }
                            placeholder="Full name"
                            className={`w-full px-3 py-2 rounded-lg border ${
                              errors[`teamMember${index}Name`]
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm`}
                          />
                          {errors[`teamMember${index}Name`] && (
                            <p className="text-red-500 text-xs">
                              {errors[`teamMember${index}Name`]}
                            </p>
                          )}

                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) =>
                              handleTeamMemberChange(index, "email", e.target.value)
                            }
                            placeholder="Email address"
                            className={`w-full px-3 py-2 rounded-lg border ${
                              errors[`teamMember${index}Email`]
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm`}
                          />
                          {errors[`teamMember${index}Email`] && (
                            <p className="text-red-500 text-xs">
                              {errors[`teamMember${index}Email`]}
                            </p>
                          )}

                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) =>
                              handleTeamMemberChange(index, "phone", e.target.value)
                            }
                            placeholder="Phone number (optional)"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                          />
                        </div>
                      ))}

                      {formData.teamMembers.length === 0 && (
                        <p className="text-center text-gray-500 text-sm py-4">
                          No team members added yet. Click "Add Member" to start building your team.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Additional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Any additional information you'd like to share..."
                  rows="4"
                  maxLength="500"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.additionalNotes.length}/500 characters
                </p>
              </div>
            </div>

            {/* Application Summary */}
            {(formData.phone || formData.institution || formData.isTeamRegistration) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-emerald-600" />
                  Application Summary
                </h3>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  {/* Registration Type */}
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">Registration Type:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {formData.isTeamRegistration ? "Team Registration" : "Individual Registration"}
                    </span>
                  </div>

                  {/* Personal Info */}
                  {formData.phone && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                      <span className="text-sm text-gray-900">{formData.phone}</span>
                    </div>
                  )}
                  
                  {formData.institution && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">Institution:</span>
                      <span className="text-sm text-gray-900 text-right max-w-[60%]">{formData.institution}</span>
                    </div>
                  )}
                  
                  {formData.educationLevel && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">Education Level:</span>
                      <span className="text-sm text-gray-900">{formData.educationLevel}</span>
                    </div>
                  )}

                  {/* Team Info */}
                  {formData.isTeamRegistration && (
                    <>
                      <div className="border-t border-gray-300 pt-3 mt-3">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Team Details</p>
                      </div>
                      
                      {formData.teamName && (
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">Team Name:</span>
                          <span className="text-sm text-gray-900">{formData.teamName}</span>
                        </div>
                      )}
                      
                      {formData.teamMembers.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-600 block mb-2">
                            Team Members ({formData.teamMembers.length}):
                          </span>
                          <div className="space-y-2 pl-4">
                            {formData.teamMembers.map((member, index) => (
                              <div key={index} className="text-sm text-gray-900">
                                <strong>{index + 1}.</strong> {member.name || "(Name pending)"} 
                                {member.email && ` - ${member.email}`}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-xs text-gray-600">
                            Total team size: {formData.teamMembers.length + 1} (including you)
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-700 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventApplicationModal;