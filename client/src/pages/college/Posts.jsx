import { useEffect, useState } from "react";
import { useCollege } from "../../context/CollegeContext";
import { useAuth } from "../../context/AuthContext";
import { Plus, Filter, Search, Edit, Trash2, Eye, X, Trash, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const POST_TYPES = [
  { value: "course", label: "Course" },
  { value: "event", label: "Event" },
  { value: "hackathon", label: "Hackathon" },
  { value: "scholarship", label: "Scholarship" },
];

const Posts = () => {
  const { posts, fetchPosts, createPost, loading } = useCollege();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    postType: "course",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    deadline: "",
    location: "",
    eligibility: "",
    requiredDocs: [],
    status: "published",
  });

  // For managing required documents
  const [docName, setDocName] = useState("");
  const [docIsMandatory, setDocIsMandatory] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddDocument = () => {
    if (!docName.trim()) return;

    const newDoc = {
      name: docName.trim(),
      isMandatory: docIsMandatory,
    };

    setFormData({
      ...formData,
      requiredDocs: [...formData.requiredDocs, newDoc],
    });

    setDocName("");
    setDocIsMandatory(true);
  };

  const handleRemoveDocument = (index) => {
    setFormData({
      ...formData,
      requiredDocs: formData.requiredDocs.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createPost(formData);

    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      postType: "course",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      deadline: "",
      location: "",
      eligibility: "",
      requiredDocs: [],
      status: "published",
    });
    setDocName("");
    setDocIsMandatory(true);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesType = filterType === "all" || post.postType === filterType;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const isApproved = user?.verificationStatus === "approved";

  if (!isApproved) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-yellow-900 mb-2">
            Verification Required
          </h2>
          <p className="text-yellow-700">
            Please complete your college verification to create and manage posts.
          </p>
          <Link
            to="/college/verification"
            className="inline-block mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
          >
            Go to Verification
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Manage Posts</h1>
            <p className="text-gray-600 text-sm mt-1">
              Create and manage courses, events, hackathons, and scholarships
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {POST_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-600">
              {searchQuery || filterType !== "all"
                ? "No posts match your filters"
                : "No posts yet. Create your first post!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Details</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Documents</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                        {post.postType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{post.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-sm text-gray-600">
                        {post.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(post.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        {post.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{post.location}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {post.requiredDocs && post.requiredDocs.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.requiredDocs.slice(0, 2).map((doc, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-0.5 rounded ${
                                doc.isMandatory
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {doc.name}
                            </span>
                          ))}
                          {post.requiredDocs.length > 2 && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              +{post.requiredDocs.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition group"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition group"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition group"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
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

      {/* Create Post Modal - IMPROVED VERSION */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Post Type *
                    </label>
                    <select
                      value={formData.postType}
                      onChange={(e) =>
                        setFormData({ ...formData, postType: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {POST_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Online, Kathmandu, etc."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eligibility Criteria
                  </label>
                  <textarea
                    value={formData.eligibility}
                    onChange={(e) =>
                      setFormData({ ...formData, eligibility: e.target.value })
                    }
                    placeholder="Who can apply?"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                {/* Required Documents Section */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Documents
                  </label>

                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      placeholder="Document name (e.g., Citizenship)"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={docIsMandatory}
                        onChange={(e) => setDocIsMandatory(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">Required</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>

                  {formData.requiredDocs.length > 0 && (
                    <div className="space-y-2">
                      {formData.requiredDocs.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {doc.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                doc.isMandatory
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {doc.isMandatory ? "Mandatory" : "Optional"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(idx)}
                            className="p-1 hover:bg-red-100 rounded transition"
                          >
                            <Trash className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                  >
                    {loading ? "Creating..." : "Create Post"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2.5 border rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;