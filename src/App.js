import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Login from './pages/Login';
import MeterVerification from './pages/MeterVerification';
import FeedbackForm from './pages/FeedbackForm';
import { GOOGLE_CLIENT_ID } from './utils/constants';

function App() {
  const [user, setUser] = useState(null);
  const [meterInfo, setMeterInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('feedback_user');
    const savedMeter = localStorage.getItem('meter_info');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('feedback_user');
      }
    }
    
    if (savedMeter) {
      try {
        setMeterInfo(JSON.parse(savedMeter));
      } catch (e) {
        localStorage.removeItem('meter_info');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      const userInfo = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub,
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

  const handleMeterVerified = (meterData) => {
    setMeterInfo(meterData);
    localStorage.setItem('meter_info', JSON.stringify(meterData));
    console.log('✅ Meter verified:', meterData);
  };

  const handleLogout = () => {
    setUser(null);
    setMeterInfo(null);
    localStorage.removeItem('feedback_user');
    localStorage.removeItem('meter_info');
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
      {!user ? (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onLoginError={handleLoginError} 
        />
      ) : !meterInfo ? (
        <MeterVerification 
          userInfo={user}
          onVerified={handleMeterVerified}
        />
      ) : (
        <FeedbackForm 
          userInfo={user}
          meterInfo={meterInfo}
          onLogout={handleLogout}
        />
      )}
    </GoogleOAuthProvider>
  );
}

export default App;