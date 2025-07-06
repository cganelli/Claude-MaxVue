import React, { useState } from "react";
import { ArrowLeft, Menu, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import Button from "../components/Button";
import DeleteAccountModal from "../components/DeleteAccountModal";

const NewSettings = () => {
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [voiceToggleEnabled, setVoiceToggleEnabled] = useState(true);
  const [brightnessValue, setBrightnessValue] = useState(40);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    setShowDeleteModal(false);
    // Handle account deletion logic here
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
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
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
                <ChevronUp
                  className={`h-5 w-5 text-gray-600 transition-transform ${
                    profileExpanded ? "rotate-0" : "rotate-180"
                  }`}
                />
              </button>

              {profileExpanded && (
                <Button size="lg" fullWidth className="rounded-2xl">
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
                  className={`w-12 h-6 rounded-full transition-colors ${
                    voiceToggleEnabled ? "bg-gray-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      voiceToggleEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Brightness Section */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black">Brightness</h3>
                <span className="text-lg font-medium text-gray-600">Free</span>
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

              <Button size="lg" fullWidth className="rounded-2xl">
                Change Plan
              </Button>
            </div>
          </div>

          {/* Delete Account Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-gray-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default NewSettings;
