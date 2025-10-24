import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { MessageSquare } from 'lucide-react';

const Login = ({ onLoginSuccess, onLoginError }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img 
            src="/bi.ico" 
            alt="Bhungane Investments Logo" 
            className="mx-auto h-20 w-20 mb-4" 
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bhungane Investments
          </h1>
          <div className="flex items-center justify-center text-blue-600 mb-4">
            <MessageSquare size={24} className="mr-2" />
            <span className="text-xl font-semibold">Feedback Portal</span>
          </div>
          <p className="text-gray-600">
            Share your thoughts and help us improve
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 text-center">
            Sign in with your Google account to submit feedback securely
          </p>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={onLoginError}
            useOneTap
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </div>

        {/* Features */}
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Quick and secure authentication</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Your feedback helps us serve you better</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>Receive updates on your submissions</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;