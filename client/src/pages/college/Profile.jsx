import { useEffect, useState } from "react";
import { useCollege } from "../../context/CollegeContext";
import { useAuth } from "../../context/AuthContext";
import { Building2, Mail, User, Save, Phone, Globe, MapPin, Upload, X, Edit, FileText } from "lucide-react";

const Profile = () => {
  const { updateProfile, createProfile, loading } = useCollege();
  const { user, refresh } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState({
    collegeName: "",
    universityAffiliation: "",
    address: "",
    phone: "",
    website: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user?.collegeProfile) {
      const profile = user.collegeProfile;
      
      // Check if profile has any data
      const profileExists = profile.collegeName || profile.universityAffiliation || 
                           profile.address || profile.phone || profile.website || 
                           profile.description || profile.image;
      
      setHasProfile(!!profileExists);

      setFormData({
        collegeName: profile.collegeName || "",
        universityAffiliation: profile.universityAffiliation || "",
        address: profile.address || "",
        phone: profile.phone || "",
        website: profile.website || "",
        description: profile.description || "",
      });
      
      if (profile.image) {
        setImagePreview(profile.image);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (imageFile) {
      submitData.append("image", imageFile);
    }
    
    // Use different endpoint based on whether profile exists
    if (hasProfile) {
      await updateProfile(submitData);
    } else {
      await createProfile(submitData);
    }
    
    await refresh();
    setIsEditing(false);
    setImageFile(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(user?.collegeProfile?.image || null);
  };

  const openEditModal = () => {
    // Reset form with current data
    if (user?.collegeProfile) {
      setFormData({
        collegeName: user.collegeProfile.collegeName || "",
        universityAffiliation: user.collegeProfile.universityAffiliation || "",
        address: user.collegeProfile.address || "",
        phone: user.collegeProfile.phone || "",
        website: user.collegeProfile.website || "",
        description: user.collegeProfile.description || "",
      });
      setImagePreview(user.collegeProfile.image || null);
    }
    setImageFile(null);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(user?.collegeProfile?.image || null);
  };

  // If no profile exists, show the form directly
  if (!hasProfile) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-900">Create College Profile</h1>
            <p className="text-gray-600 text-sm mt-1">
              Set up your college information and details
            </p>
          </div>

          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                College Logo/Image
              </label>
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="College preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex-1">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <Upload className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG or JPEG (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  College Name
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="e.g., Kathmandu University"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4" />
                  University Affiliation
                </label>
                <input
                  type="text"
                  name="universityAffiliation"
                  value={formData.universityAffiliation}
                  onChange={handleChange}
                  placeholder="e.g., Tribhuvan University"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +977-1-1234567"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g., https://www.college.edu.np"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., Dhulikhel, Kavre"
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description about your college..."
                rows="4"
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Profile exists - show view mode
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">College Profile</h1>
            <p className="text-gray-600 text-sm mt-1">
              Your college information and details
            </p>
          </div>
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Current User Info */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Display */}
        <div className="space-y-6">
          {/* College Image */}
          {user?.collegeProfile?.image && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4" />
                College Logo/Image
              </label>
              <img
                src={user.collegeProfile.image}
                alt="College"
                className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4" />
                College Name
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border">
                {user?.collegeProfile?.collegeName || "Not provided"}
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4" />
                University Affiliation
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border">
                {user?.collegeProfile?.universityAffiliation || "Not provided"}
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border">
                {user?.collegeProfile?.phone || "Not provided"}
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4" />
                Website
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border break-all">
                {user?.collegeProfile?.website || "Not provided"}
              </p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border">
              {user?.collegeProfile?.address || "Not provided"}
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border min-h-[100px]">
              {user?.collegeProfile?.description || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900">Edit College Profile</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Upload className="w-4 h-4" />
                  College Logo/Image
                </label>
                <div className="flex items-start gap-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="College preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image-upload-modal"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload-modal"
                      className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG or JPEG (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4" />
                    College Name
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="e.g., Kathmandu University"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4" />
                    University Affiliation
                  </label>
                  <input
                    type="text"
                    name="universityAffiliation"
                    value={formData.universityAffiliation}
                    onChange={handleChange}
                    placeholder="e.g., Tribhuvan University"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., +977-1-1234567"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4" />
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g., https://www.college.edu.np"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., Dhulikhel, Kavre"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description about your college..."
                  rows="4"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;