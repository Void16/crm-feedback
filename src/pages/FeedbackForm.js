import React, { useState } from 'react';
import { Send, CheckCircle, User, ArrowLeft, Shield } from 'lucide-react'; // Added Shield import
import { API_BASE_URL } from '../utils/constants';

const FeedbackForm = ({ userInfo, onLogout, meterInfo }) => { // Added meterInfo prop
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: '',
    feedback_type: 'other',
    subject: '',
    message: '',
    meter_number: meterInfo?.meter_number || '' // Now meterInfo is defined
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const feedbackTypes = [
    { value: 'complaint', label: 'Complaint', emoji: '😞', color: 'red' },
    { value: 'suggestion', label: 'Suggestion', emoji: '💡', color: 'blue' },
    { value: 'compliment', label: 'Compliment', emoji: '😊', color: 'green' },
    { value: 'inquiry', label: 'Inquiry', emoji: '❓', color: 'yellow' },
    { value: 'other', label: 'Other', emoji: '📝', color: 'gray' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/public-feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setFormData({
            name: userInfo?.name || '',
            email: userInfo?.email || '',
            phone: '',
            feedback_type: 'other',
            subject: '',
            message: '',
            meter_number: meterInfo?.meter_number || '' // Added meter_number here too
          });
          setSubmitted(false);
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Network error. Please check your connection and try again.');
    }

    setLoading(false);
  };

  // Conditionally render meter info section only if meterInfo exists
  const renderMeterInfo = () => {
    if (!meterInfo) return null;

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center mb-2">
          <Shield size={16} className="text-green-600 mr-2" />
          <span className="font-semibold text-green-800">Verified Meter</span>
        </div>
        <div className="text-sm text-gray-700">
          <p><strong>Meter Number:</strong> {meterInfo.meter_number}</p>
          <p><strong>Customer:</strong> {meterInfo.customer_name}</p>
          {meterInfo.customer_address && (
            <p><strong>Address:</strong> {meterInfo.customer_address}</p>
          )}
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-fade-in">
          <div className="mb-6">
            <CheckCircle size={80} className="mx-auto text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Your feedback has been submitted successfully. We appreciate you taking the time to share your thoughts with us.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              We'll review your feedback and get back to you at <strong>{formData.email}</strong> if needed.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Logout */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img 
                src={userInfo?.picture || '/bi.ico'} 
                alt="Profile" 
                className="w-12 h-12 rounded-full mr-4 border-2 border-blue-500"
              />
              <div>
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{userInfo?.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
            >
              <ArrowLeft size={16} className="mr-1" />
              Logout
            </button>
          </div>
          
          <div className="text-center pt-4 border-t">
            <img 
              src="/bi.ico" 
              alt="Bhungane Investments Logo" 
              className="mx-auto h-16 w-16 mb-3" 
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              We Value Your Feedback
            </h1>
            <p className="text-gray-600">
              Share your thoughts, suggestions, or concerns with Bhungane Investments
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center pb-2 border-b">
                <User size={20} className="mr-2 text-blue-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="John Doe"
                    required
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="john@example.com"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+263 xxx xxx xxx"
                />
              </div>
            </div>

            {/* Meter Info Section - conditionally rendered */}
            {renderMeterInfo()}

            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of feedback would you like to share? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, feedback_type: type.value})}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.feedback_type === type.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-3xl mb-1">{type.emoji}</div>
                    <div className="text-sm font-medium text-gray-800">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your feedback"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Please provide details about your feedback..."
                rows="6"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>🔒 Your feedback is confidential and helps us improve our services.</p>
          <p className="mt-2">Thank you for taking the time to share your thoughts with us.</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;