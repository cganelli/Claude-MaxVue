import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';

const VisionTest = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const navigate = useNavigate();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  const handleConfirmCalibration = () => {
    console.log('Initial calibration confirmed with value:', sliderValue);
    // Navigate to the detailed vision calibration screen
    navigate('/vision-calibration');
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-6 py-4">
        <div className="max-w-md mx-auto">
          {/* Header - Back arrow and title */}
          <div className="flex items-center mb-6">
            <Link to="/welcome" className="mr-6">
              <ArrowLeft className="h-8 w-8 text-gray-900" />
            </Link>
            <h1 className="text-3xl font-bold text-black">Eye Test</h1>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <p className="text-xl text-gray-900 leading-relaxed">
              Please remove your glasses then move the slider until the sentence below is in focus.
            </p>
          </div>

          {/* Quote Text */}
          <div className="text-center mb-8">
            <div className="text-black text-xl leading-relaxed">
              <p className="mb-4">
                We do not see<br />
                things as they are,<br />
                we see them as<br />
                we are.
              </p>
              <p className="text-lg">
                – Anais Nin
              </p>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="w-full h-4 rounded-full appearance-none cursor-pointer slider"
                style={{ background: '#1D4262' }}
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 32px;
                  width: 32px;
                  border-radius: 50%;
                  background: #3399FF;
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
                .slider::-moz-range-thumb {
                  height: 32px;
                  width: 32px;
                  border-radius: 50%;
                  background: #3399FF;
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
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

          {/* Confirm Calibration Button */}
          <div>
            <Button
              onClick={handleConfirmCalibration}
              size="lg"
              fullWidth
              className="rounded-2xl"
            >
              Continue to Calibration
            </Button>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default VisionTest;