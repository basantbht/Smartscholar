import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import {
  GraduationCap,
  Building2,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Star,
  Bell,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useEvents } from "../../context/EventContext";
import { useCollege } from "../../context/CollegeContext";

const Home = () => {
  const navigate = useNavigate();
  const { fetchColleges, colleges, loading } = useUser();
  const { getAllCollegesEvents, allEvents } = useEvents();
  const { getAllCollegesCourses, allCourses } = useCollege();
  const [featuredColleges, setFeaturedColleges] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      await fetchColleges({ limit: 3, verificationStatus: 'approved' });
    };
    loadFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (colleges.length > 0) {
      setFeaturedColleges(colleges.slice(0, 3));
    }
  }, [colleges]);

  useEffect(() => {
    getAllCollegesEvents();
  }, []);
  
  useEffect(() => {
    getAllCollegesCourses();
  }, []);

  const stats = [
    { icon: Building2, value: colleges.length + "+", label: "Colleges", color: "blue" },
    { icon: BookOpen, value: allCourses.length + "+", label: "Courses", color: "purple" },
    { icon: Users, value: allEvents.length + "+", label: "Events", color: "green" },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Discover Programs",
      description: "Explore diverse courses and programs tailored to your career goals across top institutions.",
      linear: "from-blue-500 to-indigo-600",
    },
    {
      icon: Award,
      title: "Find Scholarships",
      description: "Access exclusive scholarship opportunities and funding options to support your education.",
      linear: "from-purple-500 to-pink-600",
    },
    {
      icon: Calendar,
      title: "Track Events",
      description: "Stay updated with college events, seminars, and workshops happening near you.",
      linear: "from-green-500 to-emerald-600",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Get insights into career paths and opportunities aligned with your field of study.",
      linear: "from-orange-500 to-red-600",
    },
  ];

  const categories = [
    { name: "Engineering", count: 150, icon: "🔧" },
    { name: "Medical", count: 80, icon: "⚕️" },
    { name: "Business", count: 120, icon: "💼" },
    { name: "Arts & Design", count: 90, icon: "🎨" },
    { name: "Science", count: 100, icon: "🔬" },
    { name: "Law", count: 60, icon: "⚖️" },
  ];

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Hero Header Section */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Discover Your Perfect
              <span className="block mt-3 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                College Match
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4">
              Explore verified colleges and universities. Find the institution that aligns with your academic goals and aspirations.
            </p>
          </div>

          {/* Search Bar - Integrated into Header */}
          <div className="max-w-4xl mx-auto mt-12">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Stats Section - Centered */} 
      <section className="relative py-20 px-4 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600',
                green: 'from-green-500 to-green-600',
                orange: 'from-orange-500 to-orange-600',
              };
              
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 w-full sm:w-72"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-linear-to-br ${colors[stat.color]} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-sm md:text-base text-slate-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Why Choose Our Platform?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to make informed decisions about your education journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-2"
                >
                  {/* linear Background on Hover */}
                  <div className={`absolute inset-0 bg-linear-to-br ${feature.linear} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative">
                    <div className={`inline-flex p-4 rounded-xl bg-linear-to-br ${feature.linear} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      {featuredColleges.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Featured Colleges
              </h2>
              <p className="text-lg md:text-xl text-slate-600">
                Top-rated institutions waiting for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredColleges.map((college) => {
                const profile = college.collegeProfile;
                return (
                  <div
                    key={college._id}
                    onClick={() => navigate(`/colleges/${college._id}`)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-linear-to-br from-blue-100 to-purple-100">
                      {profile?.image ? (
                        <img
                          src={profile.image}
                          alt={profile.collegeName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-blue-300" />
                        </div>
                      )}
                      
                      {/* Verified Badge */}
                      {college.verificationStatus === 'approved' && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {profile?.collegeName || 'College'}
                      </h3>
                      
                      {profile?.address && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="line-clamp-1">{profile.address}</span>
                        </div>
                      )}

                      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                        {profile?.description || 'No description available'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{profile?.courses?.length || 0} Courses</span>
                          <span>•</span>
                          <span>{profile?.events?.length || 0} Events</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/colleges')}
                className="group px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                View All Colleges
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Subscribe to Scholarship Updates */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Bell className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold text-white">Never Miss a Scholarship</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Stay Updated on Scholarship Openings
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Subscribe to get notified when new scholarship opportunities open. Get reminders 7 days before applications start.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/subscribe')}
              className="group px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover:-translate-y-1"
            >
              <Bell className="w-5 h-5" />
              Subscribe to Updates
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/scholarships')}
              className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold hover:bg-white/20 transition-all duration-300"
            >
              Browse Scholarships
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Unsubscribe Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>All Nepal Universities</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;