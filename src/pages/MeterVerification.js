import React, { useState } from 'react';
import { Shield, AlertCircle, Loader } from 'lucide-react';

const MeterVerification = ({ onVerified, userInfo }) => {
  const [meterNumber, setMeterNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/customer-meters/verify/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ meter_number: meterNumber.trim() })
        }
      );

      const data = await response.json();

      if (response.ok && data.verified) {
        // Pass meter info to parent
        onVerified({
          meter_number: data.meter_number,
          customer_name: data.customer_name,
          customer_address: data.customer_address
        });
      } else {
        setError(data.error || 'Invalid meter number. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Network error. Please check your connection and try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/bi.ico" 
            alt="Bhungane Investments Logo" 
            className="mx-auto h-20 w-20 mb-4" 
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Meter
          </h1>
          <p className="text-gray-600">
            Please enter your meter number to continue
          </p>
        </div>

        {/* User Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <img 
              src={userInfo?.picture} 
              alt="Profile" 
              className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
            />
            <div>
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-semibold text-gray-800">{userInfo?.name}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meter Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono tracking-wider"
              placeholder="e.g., 58000123456"
              required
              maxLength={20}
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the meter number found on your water meter
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !meterNumber.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Verifying...
              </>
            ) : (
              <>
                <Shield size={20} className="mr-2" />
                Verify Meter Number
              </>
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-xs text-gray-500">
            🔒 Your meter number is verified against our customer database to ensure secure feedback submission
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeterVerification;