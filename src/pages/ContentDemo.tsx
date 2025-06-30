import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Eye, EyeOff, TestTube, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import CameraPreview from '../components/CameraPreview';
import WebViewer from '../components/WebViewer';
import EmailViewer from '../components/EmailViewer';
import ImageViewer from '../components/ImageViewer';
import { useVisionCorrection, getVisionCorrectionStyle } from '../hooks/useVisionCorrection';

const ContentDemo = () => {
  const { isEnabled, diopterValue, blurAmount, calibrationValue } = useVisionCorrection();
  const debugCalibrationValue = typeof window !== 'undefined' ? localStorage.getItem('calibrationValue') : null;
const debugVisionEnabled = typeof window !== 'undefined' ? localStorage.getItem('visionCorrectionEnabled') : null;
  const visionStyle = getVisionCorrectionStyle();
  const [selectedRx, setSelectedRx] = useState(2.0);
  const [showEyeTest, setShowEyeTest] = useState(true);

  // ✅ FIXED: Eye test blur simulation using current calibration from localStorage
const storedCalibration = typeof window !== 'undefined' ? localStorage.getItem('calibrationValue') : null;
  // ✅ FIXED: Remove fallback to 2.0 - use 0.0 if no calibration found
  const currentCalibration = storedCalibration ? parseFloat(storedCalibration) : 0.0;
  const eyeTestBlur = Math.max(0, currentCalibration - selectedRx);

  // ✅ FIXED: Confirm calibration with correct localStorage keys
  const handleConfirmCalibration = () => {
    console.log(`🧪 ContentDemo: Confirming prescription +${selectedRx.toFixed(2)}D as user's calibration baseline`);
    
    // ✅ FIXED: Save calibrationValue = selectedValue (no clamping to +2.0D)
    localStorage.setItem('calibrationValue', selectedRx.toString());
    // ✅ FIXED: Add this line to explicitly set estimatedSphere to match selectedValue
    localStorage.setItem('estimatedSphere', selectedRx.toString());
    // ✅ FIXED: Set visionCorrectionEnabled = true
    localStorage.setItem('visionCorrectionEnabled', 'true');
    localStorage.setItem('hasConfirmedVision', 'true');
    
    console.log('📝 ContentDemo: Dynamic calibration set - user will see 0px blur at their selected prescription');
    
    // ✅ FIXED: Reload the page to apply changes
    console.log('🔄 ContentDemo: Reloading page to apply calibration...');
    window.location.reload();
  };

  // ✅ FIXED: Dynamic test scenario buttons - no clamping to +2.0D
  const updateRx = (rx: number) => {
    console.log(`🧪 ContentDemo: Setting prescription to +${rx.toFixed(2)}D`, {
      calibrationValue: calibrationValue,
      testPrescription: rx,
      expectedBlur: Math.max(0, calibrationValue - rx)
    });
    
    // ✅ FIXED: Set estimatedSphere = test value (no clamping to +2.0D)
    localStorage.setItem('estimatedSphere', rx.toString());
    // ✅ FIXED: Enable vision correction for test
    localStorage.setItem('visionCorrectionEnabled', 'true');
    
    console.log('📝 ContentDemo: Test prescription updated, forcing page reload...');
    window.location.reload();
  };

  // ✅ FIXED: Clear settings function - remove all keys and reload
  const clearVisionCorrection = () => {
    console.log('🧪 ContentDemo: Clearing vision correction settings');
    
    // ✅ FIXED: Remove all 4 keys
    localStorage.removeItem('visionCorrectionEnabled');
    localStorage.removeItem('calibrationValue');
    localStorage.removeItem('estimatedSphere');
    localStorage.removeItem('hasConfirmedVision');
    
    console.log('🗑️ ContentDemo: Vision correction settings cleared, forcing page reload...');
    // ✅ FIXED: After clearing, reload page
    window.location.reload();
  };

  const handlePhotoCapture = (imageData: string) => {
    console.log('Photo captured:', imageData.substring(0, 50) + '...');
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/homepage" className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-black">Content Demo</h1>
            <button 
              onClick={() => window.location.reload()}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
              title="Force refresh"
            >
              <RefreshCw className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* ✅ FIXED: Eye Test Component with dynamic calibration logic */}
          {showEyeTest && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-black flex items-center">
                  <TestTube className="h-5 w-5 mr-2 text-blue-600" />
                  Dynamic Calibration Eye Test
                </h3>
                <button
                  onClick={() => setShowEyeTest(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Remove your glasses</strong> and adjust the slider until the text below is perfectly clear. 
                  This prescription will become your personal calibration baseline - you'll see 0px blur at this strength.
                </p>
              </div>

              {/* ✅ FIXED: Test Text with dynamic calibration-based blur logic */}
              <div className="text-center mb-6 p-6 bg-gray-50 rounded-xl">
                <div 
                  className="text-black text-lg leading-relaxed font-medium transition-all duration-300"
                  style={{
                    filter: `blur(${eyeTestBlur.toFixed(2)}px)`,
                    textShadow: eyeTestBlur > 0 ? `0 0 ${eyeTestBlur}px rgba(0,0,0,0.3)` : 'none'
                  }}
                >
                  <p className="mb-4">
                    We do not see<br />
                    things as they are,<br />
                    we see them as<br />
                    we are.
                  </p>
                  <p className="text-base text-gray-600">
                    – Anais Nin
                  </p>
                </div>
              </div>

              {/* ✅ FIXED: Prescription Slider - uncapped to 3.50D */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Prescription Strength</span>
                  <span className="text-sm font-bold text-blue-600">
                    +{selectedRx.toFixed(2)}D
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3.5"
                  step="0.25"
                  value={selectedRx}
                  onChange={(e) => setSelectedRx(parseFloat(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>+0.00D (Very Blurry)</span>
                  <span>+3.50D (Crystal Clear)</span>
                </div>
                <style jsx>{`
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #3399FF;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  }
                  .slider::-moz-range-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #3399FF;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  }
                `}</style>
              </div>

              {/* Dynamic Calibration Feedback */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-blue-800 font-semibold mb-1">
                    Testing: +{selectedRx.toFixed(2)}D (Will become your calibration baseline)
                  </p>
                  <p className="text-blue-600 text-sm">
                    Eye Test Blur: {eyeTestBlur.toFixed(2)}px | Formula: {currentCalibration.toFixed(2)} - {selectedRx.toFixed(2)} = {eyeTestBlur.toFixed(2)}px
                  </p>
                  <p className="text-blue-500 text-xs mt-1">
                    {eyeTestBlur === 0 ? '🎯 Perfect clarity - this will be your 0px blur point!' : 
                     eyeTestBlur < 1 ? '✨ Very clear' : 
                     eyeTestBlur < 2 ? '👍 Getting clearer' : 
                     '👁️ Still blurry - keep adjusting'}
                  </p>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmCalibration}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Set as My Calibration (+{selectedRx.toFixed(2)}D)</span>
              </button>
            </div>
          )}

          {/* Vision Status */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-black mb-2 flex items-center justify-center">
                {isEnabled ? (
                  <Eye className="h-5 w-5 mr-2 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 mr-2 text-red-600" />
                )}
                Vision Correction Status
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Status: <span className={`font-semibold ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {isEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </p>
                {isEnabled ? (
                  <>
                    <p className="text-sm text-gray-600">
                      Your Calibration: <span className="font-semibold">+{calibrationValue.toFixed(2)}D</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Current Prescription: <span className="font-semibold">+{diopterValue.toFixed(2)}D</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Content Blur: <span className="font-semibold">{blurAmount.toFixed(2)}px</span>
                    </p>
                    <p className="text-xs text-green-700 font-medium">
                      Formula: {calibrationValue.toFixed(2)} - {diopterValue.toFixed(2)} = {blurAmount.toFixed(2)}px
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Baseline Blur: <span className="font-semibold">{blurAmount.toFixed(2)}px</span>
                    </p>
                    <p className="text-xs text-red-700 font-medium">
                      Natural vision using calibration value as baseline
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-black mb-4">🧪 Calibration Test Scenarios</h3>
            
            {/* ✅ FIXED: Quick Test Buttons with proper logging - uncapped values */}
            <div className="space-y-3 mb-4">
              <button
                onClick={() => {
                  console.log(`🧪 Test Scenario: Perfect Vision (+3.50D prescription)`, {
                    calibration: calibrationValue,
                    testPrescription: 3.50,
                    expectedBlur: Math.max(0, calibrationValue - 3.50)
                  });
                  updateRx(3.50);
                }}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Perfect Vision (+3.50D prescription)
              </button>
              <button
                onClick={() => {
                  console.log(`🧪 Test Scenario: Moderate Vision (+2.00D prescription)`, {
                    calibration: calibrationValue,
                    testPrescription: 2.00,
                    expectedBlur: Math.max(0, calibrationValue - 2.00)
                  });
                  updateRx(2.00);
                }}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Moderate Vision (+2.00D prescription)
              </button>
              <button
                onClick={() => {
                  console.log(`🧪 Test Scenario: Mild Vision (+1.00D prescription)`, {
                    calibration: calibrationValue,
                    testPrescription: 1.00,
                    expectedBlur: Math.max(0, calibrationValue - 1.00)
                  });
                  updateRx(1.00);
                }}
                className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors"
              >
                Mild Vision (+1.00D prescription)
              </button>
            </div>

            {/* Clear Settings Button */}
            <button
              onClick={clearVisionCorrection}
              className="w-full mt-4 bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              🚫 Clear Settings
            </button>
          </div>

          {/* Content Viewers */}

            {/* Camera Preview */}
            <div style={visionStyle}>
  <h3 className="text-lg font-bold text-black mb-3">📷 Camera Preview</h3>
  <CameraPreview className="h-48" onCapture={handlePhotoCapture} />
  <div className="mt-2 text-center">
    <span className="text-xs text-gray-500">
      Current blur: {blurAmount.toFixed(2)}px
    </span>
  </div>
            
{/* Web Viewer */}
<div style={visionStyle}>
  <h3 className="text-lg font-bold text-black mb-3">🌐 Web Viewer</h3>
  <WebViewer />
  <div className="mt-2 text-center">
    <span className="text-xs text-gray-500">
      Current blur: {blurAmount.toFixed(2)}px
    </span>
  </div>

{/* ✅ FIXED: Reading Test using useVisionCorrection hook */}
<div style={visionStyle}>
  <h3 className="text-lg font-bold text-black mb-3">📝 Reading Test</h3>
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="text-gray-800 leading-relaxed transition-all duration-300">
      <h4 className="text-xl font-bold mb-4">Calibration Reading Test</h4>
      <p className="mb-4">
        This text demonstrates the vision correction system. When enabled, the blur is calculated 
        relative to your personal calibration point. The formula is: blur = Math.max(0, calibrationValue - prescription).
      </p>
      <p className="mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
        veniam, quis nostrud exercitation ullamco laboris.
      </p>
    </div>
    <div className={`p-4 rounded-lg mt-4 ${isEnabled ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className={`font-semibold ${isEnabled ? 'text-green-800' : 'text-red-800'}`}>
        {isEnabled ? 
          `✅ Vision correction ENABLED – dynamic correction: ${blurAmount.toFixed(2)}px` : 
          `✅ Vision correction DISABLED – baseline blur applied: ${blurAmount.toFixed(2)}px`
        }
      </p>
    </div>
  </div>
</div>
v>

  {/* Email Viewer */}
<div style={visionStyle}>
  <h3 className="text-lg font-bold text-black mb-3">📩 Email Viewer</h3>
  <EmailViewer />
  <div className="mt-2 text-center">
    <span className="text-xs text-gray-500">
      Current blur: {blurAmount.toFixed(2)}px
    </span>
  </div>


  {/* Image Viewer */}
<div style={visionStyle}>
  <h3 className="text-lg font-bold text-black mb-3">🖼️ Image Viewer</h3>
  <ImageViewer />
  <div className="mt-2 text-center">
    <span className="text-xs text-gray-500">
      Current blur: {blurAmount.toFixed(2)}px
    </span>
  </div>

            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🔧 How Calibration Works:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. <strong>Eye Test:</strong> Find your clarity point (where text becomes clear)</li>
              <li>2. <strong>Personal Baseline:</strong> Your selected prescription becomes your calibration value</li>
              <li>3. <strong>Dynamic Formula:</strong> blur = Math.max(0, calibrationValue - prescription)</li>
              <li>4. <strong>Toggle State:</strong> ENABLED = corrective blur, DISABLED = baseline blur</li>
              <li>5. <strong>No Capping:</strong> Values can go up to +3.50D without artificial limits</li>
            </ol>
          </div>

          {/* Debug Info */}
          {import.meta.env.DEV && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">🐛 Debug Info:</h4>
              <div className="text-xs text-yellow-800 space-y-1">
<p>localStorage.calibrationValue: {debugCalibrationValue}</p>
<p>localStorage.visionCorrectionEnabled: {debugVisionEnabled}</p>
<p>localStorage.estimatedSphere: {typeof window !== 'undefined' ? localStorage.getItem('estimatedSphere') : null}</p>
                <p>Hook isEnabled: {String(isEnabled)}</p>
                <p>Hook calibrationValue: {calibrationValue.toFixed(2)}</p>
                <p>Hook diopterValue: {diopterValue.toFixed(2)}</p>
                <p>Hook blurAmount: {blurAmount.toFixed(2)}</p>
                <p>Selected prescription: {selectedRx.toFixed(2)}</p>
                <p>Eye test blur: {eyeTestBlur.toFixed(2)}px</p>
                <p>Current calibration: {currentCalibration.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ContentDemo;