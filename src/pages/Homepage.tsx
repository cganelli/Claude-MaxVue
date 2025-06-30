import React, { useState, useEffect } from 'react';
import { Eye, Mic } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import VisionCorrectionModal from '../components/VisionCorrectionModal';
import VoiceCommandModal from '../components/VoiceCommandModal';
import { triggerVisionCorrectionUpdate } from '../hooks/useVisionCorrection';

const Homepage = () => {
  const [visionCorrectionEnabled, setVisionCorrectionEnabled] = useState(false);
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [hasConfirmedVision, setHasConfirmedVision] = useState(false);

  // Check localStorage on component mount to set initial state
  useEffect(() => {
    const savedVisionState = localStorage.getItem('visionCorrectionEnabled');
    const savedConfirmationState = localStorage.getItem('hasConfirmedVision');
    
    if (savedVisionState === 'true') {
      setVisionCorrectionEnabled(true);
    }
    
    if (savedConfirmationState === 'true') {
      setHasConfirmedVision(true);
    }
  }, []);

  const handleVisionToggle = () => {
    if (!visionCorrectionEnabled) {
      setShowVisionModal(true);
    } else {
      console.log('🔄 Homepage: Disabling vision correction');
      
      setVisionCorrectionEnabled(false);
      setHasConfirmedVision(false);
      
      // ✅ FIXED: Clear settings logic - remove all 4 keys
      localStorage.removeItem('visionCorrectionEnabled');
      localStorage.removeItem('calibrationValue');
      localStorage.removeItem('estimatedSphere');
      localStorage.removeItem('hasConfirmedVision');
      
      console.log('🗑️ Homepage: Vision correction disabled and all settings cleared');
      
      // Trigger update event for other components
      triggerVisionCorrectionUpdate();
      
      // ✅ FIXED: After clearing, reload page
      console.log('🔄 Homepage: Reloading page after clearing settings...');
      window.location.reload();
    }
  };

  const handleVisionConfirm = () => {
    console.log('🔄 Homepage: Enabling vision correction');
    
    setVisionCorrectionEnabled(true);
    setHasConfirmedVision(true);
    setShowVisionModal(false);
    
    // Save to localStorage
    localStorage.setItem('visionCorrectionEnabled', 'true');
    localStorage.setItem('hasConfirmedVision', 'true');
    
    console.log('✅ Homepage: Vision correction enabled');
    
    // Trigger update event for other components
    triggerVisionCorrectionUpdate();
  };

  const handleVoiceCommand = () => {
    setShowVoiceModal(true);
    // Simulate listening for 3 seconds
    setTimeout(() => {
      setShowVoiceModal(false);
    }, 3000);
  };

  return (
  <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">

      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <img 
              src="/maxvue_logo_transparent_bg.png" 
              alt="MaxVue" 
              className="h-24 w-auto mx-auto mb-8"
            />
          </div>

          {/* Vision Toggle - Actual Toggle Switch */}
          <div className="mb-12">
            <div className="bg-white rounded-full shadow-lg p-1 flex items-center border-2 border-gray-300">
              {/* Left side with Eye icon only */}
              <div className="flex items-center justify-center py-4 px-6 flex-1">
                <Eye className="h-12 w-12 text-gray-600" />
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={handleVisionToggle}
                className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                  visionCorrectionEnabled ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    visionCorrectionEnabled ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              
              {/* Right side with On/Off text - Same size as headline */}
              <div className="flex items-center justify-center py-4 px-6 flex-1">
                <span className="font-bold text-2xl text-gray-900">
                  {visionCorrectionEnabled ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">
              Vision correction is {visionCorrectionEnabled ? 'ON' : 'OFF'}
            </h2>
            
            {/* Additional text when vision correction is confirmed */}
            {visionCorrectionEnabled && hasConfirmedVision && (
              <p className="text-2xl font-bold text-black">
                MaxVue is now active. You're free to close the app.
              </p>
            )}
          </div>

          {/* Voice Command Button - Centered */}
          <div className="flex justify-center">
            <button
              onClick={handleVoiceCommand}
              className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 border border-gray-200"
            >
              <Mic className="h-8 w-8 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
      
      <VisionCorrectionModal
        isOpen={showVisionModal}
        onClose={() => setShowVisionModal(false)}
        onConfirm={handleVisionConfirm}
      />
      
      <VoiceCommandModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
};

export default Homepage;