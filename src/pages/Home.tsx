import React from 'react';
import { TestTube, Glasses, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <img 
                src="/maxvue_logo_transparent_bg.png" 
                alt="MaxVue" 
                className="h-18 w-auto"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/settings"
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <Settings className="h-6 w-6 text-gray-600" />
              </Link>
              <button
                onClick={logout}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <LogOut className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-black mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600">
              Ready to continue your vision care journey?
            </p>
          </div>

          {/* Main Actions */}
          <div className="space-y-4">
            <Link
              to="/vision-test"
              className="block bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-vivid-blue-100 rounded-2xl flex items-center justify-center">
                  <TestTube className="h-8 w-8 text-vivid-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-1">Run Vision Test</h3>
                  <p className="text-gray-600">Check your visual acuity and eye health</p>
                </div>
              </div>
            </Link>

            <Link
              to="/apply-prescription"
              className="block bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Glasses className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-1">Apply My Prescription</h3>
                  <p className="text-gray-600">Update your current prescription details</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-black mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-vivid-blue-500">3</div>
                <div className="text-sm text-gray-600">Tests Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Vision Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;