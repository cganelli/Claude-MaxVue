import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';

const Welcome = () => {
  const { user } = useAuth();

  console.log('🎯 Welcome page - user:', user);

  // Check if we're in dev mode without auth
  const isDevMode = import.meta.env.DEV && window.location.pathname === '/welcome-dev';

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/maxvue_logo_transparent_bg.png" 
              alt="MaxVue" 
              className="h-24 w-auto mx-auto mb-2"
            />
            <h1 className="text-3xl font-bold text-black mb-2">
              Rx Setup
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-black mb-2">
              Hello {user?.firstName || (isDevMode ? 'Developer' : 'there')},
            </h2>
            <p className="text-2xl font-bold text-black">
              Bye Bifocals!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            {/* Enter Prescription Button */}
            <Link
              to="/apply-prescription"
              className="block bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-gray-200"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-black mb-3">
                  Enter my prescription
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  If you have your prescription, tap here to enter it manually.
                </p>
              </div>
            </Link>

            {/* Start Eye Test Button - Updated to link to VisionCalibration */}
            <Link
              to="/vision-calibration"
              className="block bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 border-2 border-gray-200"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-black mb-3">
                  Start eye test
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Don't know your prescription? Tap here to test your eyesight.
                </p>
              </div>
            </Link>
          </div>

          {/* Debug info - remove in production */}
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                Debug: {isDevMode ? 'DEV MODE - Auth Bypassed' : `Authenticated, user: ${user ? `${user.firstName} ${user.lastName}` : 'null'}`}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Welcome;