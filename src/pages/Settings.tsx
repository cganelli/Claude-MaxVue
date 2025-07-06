import React, { useState } from "react";
import { ArrowLeft, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNavigation from "../components/BottomNavigation";
import Button from "../components/Button";

const Settings = () => {
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [voiceToggleEnabled, setVoiceToggleEnabled] = useState(true);
  const [brightnessValue, setBrightnessValue] = useState(40);
  const { user, logout } = useAuth();

  // Form state for profile editing
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    // Handle profile save logic here
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/welcome"
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-black">Settings</h1>
            <div className="w-10"></div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-4">
            {/* Profile Section */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <button
                onClick={() => setProfileExpanded(!profileExpanded)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-xl font-bold text-black">Profile</h3>
                {profileExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {profileExpanded ? (
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleProfileInputChange("firstName", e.target.value)
                      }
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
                      placeholder="First name"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleProfileInputChange("lastName", e.target.value)
                      }
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
                      placeholder="Last name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileInputChange("email", e.target.value)
                      }
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
                      placeholder="Email address"
                    />
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSaveProfile}
                    size="lg"
                    fullWidth
                    className="rounded-2xl"
                  >
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setProfileExpanded(true)}
                  size="lg"
                  fullWidth
                  className="rounded-2xl"
                >
                  Edit profile
                </Button>
              )}
            </div>

            {/* Voice Toggle Section */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">Voice Toggle</h3>
                <button
                  onClick={() => setVoiceToggleEnabled(!voiceToggleEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    voiceToggleEnabled ? "bg-gray-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      voiceToggleEnabled ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Brightness Section */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-black">Brightness</h3>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightnessValue}
                  onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer slider"
                />
                <style jsx>{`
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #6b7280;
                    cursor: pointer;
                  }
                  .slider::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: #6b7280;
                    cursor: pointer;
                    border: none;
                  }
                `}</style>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black">Subscription</h3>
                <span className="text-lg font-medium text-gray-600">Free</span>
              </div>

              <Link to="/select-plan">
                <Button size="lg" fullWidth className="rounded-2xl">
                  Change Plan
                </Button>
              </Link>
            </div>
          </div>

          {/* Delete Account Button */}
          <div className="mt-6">
            <button
              onClick={logout}
              className="w-full bg-dark-blue-900 text-white py-4 px-6 rounded-2xl text-lg font-semibold hover:bg-dark-blue-800 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
