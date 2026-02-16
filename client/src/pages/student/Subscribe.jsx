import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Mail, Shield, Clock, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSubscribe } from '../../context/SubscribeContext';

const SubscribePage = () => {
  const { user } = useAuth();
  const { subscribe, subscribeToReminder, subscribeLoading, reminderLoading } = useSubscribe();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [reminderOnly, setReminderOnly] = useState(false);

  // Auto-fill email if user is logged in
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      if (reminderOnly) {
        // Subscribe to reminders only
        await subscribeToReminder(email.trim(), null, 7);
      } else {
        // Subscribe to all notifications
        await subscribe(email.trim());
      }

      setStatus('success');
      setMessage('🎉 You\'re subscribed! We\'ll notify you when scholarships open.');
      
      // Clear email only if not a logged-in user
      if (!user) {
        setEmail('');
      }
    } catch (err) {
      setStatus('error');
      const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage(
        errorMsg === 'Email already subscribed' 
          ? '📧 This email is already subscribed!' 
          : errorMsg
      );
    }
  };

  const loading = subscribeLoading || reminderLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3">
                <Bell className="w-3.5 h-3.5" />
                Free Email Alerts
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Get Notified When Scholarships Open
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Subscribe once and we'll send you reminders 7 days before each scholarship opens — so you always have time to prepare your documents.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                {
                  icon: Clock,
                  title: 'Opening date reminders',
                  description: 'Get alerted 7 days before applications open',
                  color: 'from-blue-500 to-indigo-600',
                },
                {
                  icon: Globe,
                  title: 'All universities covered',
                  description: 'TU, KU, PU, AFU and 10+ more universities',
                  color: 'from-purple-500 to-pink-600',
                },
                {
                  icon: Bell,
                  title: 'Never miss a deadline',
                  description: 'Stay ahead of application windows',
                  color: 'from-green-500 to-emerald-600',
                },
                {
                  icon: Shield,
                  title: 'Completely free',
                  description: 'No subscription fees, ever',
                  color: 'from-orange-500 to-red-600',
                },
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">{benefit.title}</h3>
                      <p className="text-sm text-slate-600">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trust Indicators */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Your Privacy Matters</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>We never share your email with third parties</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>Unsubscribe anytime with one click</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span>Only relevant scholarship notifications</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              {/* Form Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-3">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1.5">Subscribe for Free</h2>
                <p className="text-sm text-slate-600">Enter your email to start receiving scholarship alerts</p>
              </div>

              {/* Success Message */}
              {status === 'success' ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
                  <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <p className="text-green-800 font-semibold text-base">{message}</p>
                  <button
                    onClick={() => {
                      setStatus(null);
                      setMessage('');
                    }}
                    className="mt-3 text-xs text-green-700 hover:text-green-800 font-medium"
                  >
                    Subscribe another email →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-900 mb-1.5">
                      Email Address
                    </label>
                    {user && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Logged in as <strong>{user.name}</strong></span>
                      </div>
                    )}
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      readOnly={!!user}
                      className={`w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm text-slate-900 placeholder-slate-400 ${
                        user ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  {/* Checkbox Toggle */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!reminderOnly}
                        onChange={() => setReminderOnly(!reminderOnly)}
                        className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900 block mb-0.5 text-sm">
                          Subscribe to all scholarship notifications
                        </span>
                        <span className="text-xs text-slate-600">
                          Get updates about new scholarships and important deadlines
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Error Message */}
                  {status === 'error' && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-center text-red-800 text-sm">
                      {message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>Subscribe Now</span>
                      </>
                    )}
                  </button>

                  {/* Fine Print */}
                  <p className="text-[10px] text-center text-slate-500 leading-relaxed">
                    By subscribing you agree to receive scholarship notifications. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;