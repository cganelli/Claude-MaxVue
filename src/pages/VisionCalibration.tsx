import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';

const VisionCalibration = () => {
  const [selectedValue, setSelectedValue] = useState(2.0); // Start at 2.0D
  const navigate = useNavigate();
  
  // ✅ FIXED: Eye test blur simulation using current calibration from localStorage
  const storedCalibration = localStorage.getItem('calibrationValue');
  // ✅ FIXED: Remove fallback to 2.0 - use 0.0 if no calibration found
  const calibration = storedCalibration ? parseFloat(storedCalibration) : 0.0;
  const eyeTestBlur = Math.max(0, calibration - selectedValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setSelectedValue(newValue);
  };

  // ✅ FIXED: Calibration confirmation logic - saves the selected calibration and activates correction
  const handleConfirmCalibration = () => {
    console.log('🎯 VisionCalibration: Confirming calibration with selected value:', selectedValue);
    
    // ✅ FIXED: Save calibrationValue = selectedValue (no clamping to +2.0D)
    localStorage.setItem('calibrationValue', selectedValue.toString());
    
    // ✅ FIXED: Add this line to explicitly set estimatedSphere to match selectedValue
    localStorage.setItem('estimatedSphere', selectedValue.toString());
    
    // ✅ FIXED: Set visionCorrectionEnabled = true
    localStorage.setItem('visionCorrectionEnabled', 'true');
    localStorage.setItem('hasConfirmedVision', 'true');
    
    console.log('📝 VisionCalibration: Calibration saved:', {
      calibrationValue: selectedValue,
      estimatedSphere: selectedValue,
      visionCorrectionEnabled: true,
      note: 'User will see 0px blur at this prescription strength'
    });
    
    // ✅ FIXED: Reload the page to apply changes
    console.log('🔄 VisionCalibration: Reloading page to apply calibration...');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-6 py-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link to="/welcome" className="mr-6">
              <ArrowLeft className="h-8 w-8 text-gray-900" />
            </Link>
            <h1 className="text-3xl font-bold text-black">Eye Test</h1>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <p className="text-xl text-gray-900 leading-relaxed">
              Please remove your glasses then move the slider until the sentence below is in focus.
            </p>
            <p className="text-lg text-blue-700 mt-2 font-medium">
              This will become your personal calibration baseline - you'll see perfect clarity at this prescription.
            </p>
          </div>

          {/* ✅ FIXED: Test Text with dynamic calibration-based blur logic */}
          <div className="text-center mb-12">
            <div 
              className="text-black text-base leading-relaxed font-medium transition-all duration-200"
              style={{
                filter: `blur(${eyeTestBlur.toFixed(2)}px)`,
                textShadow: eyeTestBlur > 0 ? `0 0 ${eyeTestBlur}px rgba(0,0,0,0.3)` : 'none'
              }}
            >
              <p className="mb-8">
                We do not see<br />
                things as they are,<br />
                we see them as<br />
                we are.
              </p>
              <p className="text-sm">
                – Anais Nin
              </p>
            </div>
          </div>

          {/* ✅ FIXED: Calibration Slider - uncapped to 3.50D */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="3.5"
                step="0.25"
                value={selectedValue}
                onChange={handleSliderChange}
                className="w-full h-4 rounded-full appearance-none cursor-pointer slider"
                style={{ background: '#1D4262' }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>+0.00D</span>
                <span>+1.75D</span>
                <span>+3.50D</span>
              </div>
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 32px;
                  width: 32px;
                  border-radius: 50%;
                  background: #3399FF;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  transition: all 0.2s ease;
                }
                .slider::-webkit-slider-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .slider::-moz-range-thumb {
                  height: 32px;
                  width: 32px;
                  border-radius: 50%;
                  background: #3399FF;
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                  transition: all 0.2s ease;
                }
                .slider::-moz-range-thumb:hover {
                  transform: scale(1.1);
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .slider::-webkit-slider-track {
                  height: 16px;
                  border-radius: 8px;
                  background: #1D4262;
                }
                .slider::-moz-range-track {
                  height: 16px;
                  border-radius: 8px;
                  background: #1D4262;
                  border: none;
                }
                .slider {
                  background: #1D4262 !important;
                }
              `}</style>
            </div>
          </div>

          {/* Calibration Display */}
          <div className="mb-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <p className="text-lg font-semibold text-black mb-2">
                Testing: +{selectedValue.toFixed(2)} D
              </p>
              <p className="text-sm text-gray-600">
                Eye Test Blur: {eyeTestBlur.toFixed(2)}px
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formula: Math.max(0, {calibration.toFixed(2)} - {selectedValue.toFixed(2)}) = {eyeTestBlur.toFixed(2)}px
              </p>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium text-sm">
                  🎯 This will become your calibration baseline
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  You'll see 0px blur at +{selectedValue.toFixed(2)}D, proportional blur for other prescriptions
                </p>
              </div>
              <p className="text-xs text-blue-600 mt-2 font-medium">
                {eyeTestBlur === 0 ? '🎯 Perfect clarity - ready to calibrate!' : 
                 eyeTestBlur < 1 ? '✨ Very clear' : 
                 eyeTestBlur < 2 ? '👍 Getting clearer' : 
                 '👁️ Still blurry - keep adjusting'}
              </p>
            </div>
          </div>

          {/* Confirm Button */}
          <div>
            <Button
              onClick={handleConfirmCalibration}
              size="lg"
              fullWidth
              className="rounded-2xl"
            >
              Set Calibration (+{selectedValue.toFixed(2)}D)
            </Button>
          </div>

          {/* Calibration Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🔧 Calibration Process:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Personal Baseline:</strong> Your selected prescription becomes your 0px blur point</li>
              <li>• <strong>Dynamic Formula:</strong> blur = Math.max(0, calibrationValue - prescription)</li>
              <li>• <strong>No Capping:</strong> Values can go up to +3.50D without artificial limits</li>
              <li>• <strong>Proportional Blur:</strong> Higher prescriptions get less blur, lower get more</li>
            </ul>
          </div>

          {/* Debug Info */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                Debug: Current Calibration: +{calibration.toFixed(2)}D | 
                Selected Value: +{selectedValue.toFixed(2)}D | 
                Eye Test Blur: {eyeTestBlur.toFixed(2)}px | 
                Formula: Math.max(0, {calibration.toFixed(2)} - {selectedValue.toFixed(2)}) = {eyeTestBlur.toFixed(2)}px | 
                Will Save: calibrationValue = {selectedValue.toString()}, estimatedSphere = {selectedValue.toString()}, visionCorrectionEnabled = true
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default VisionCalibration;