import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/Login';
import FeedbackForm from './pages/FeedbackForm';
import { GOOGLE_CLIENT_ID } from './utils/constants';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('feedback_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('feedback_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    try {
      // Decode the JWT token from Google
      const decoded = jwtDecode(credentialResponse.credential);
      
      const userInfo = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub, // Google user ID
      };

      setUser(userInfo);
      localStorage.setItem('feedback_user', JSON.stringify(userInfo));
      
      console.log('✅ Login successful:', userInfo);
    } catch (error) {
      console.error('❌ Login decode error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLoginError = () => {
    console.error('❌ Google Login Failed');
    alert('Login failed. Please try again.');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('feedback_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {user ? (
        <FeedbackForm userInfo={user} onLogout={handleLogout} />
      ) : (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onLoginError={handleLoginError} 
        />
      )}
    </GoogleOAuthProvider>
  );
}

export default App;