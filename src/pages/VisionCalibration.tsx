import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import Button from "../components/Button";

const VisionCalibration = () => {
  // Get current calibration value from localStorage (default to 0 if not set)
  const calibration = parseFloat(
    localStorage.getItem("calibrationValue") || "0",
  );

  // Initialize slider with saved calibration value
  const [selectedValue, setSelectedValue] = useState(calibration);
  const [isCalibrated, setIsCalibrated] = useState(false);

  // Accurate Presbyopia Simulation - Distance-Based Blur
  // CRITICAL: Text should ONLY be clear at user's exact prescription
  // Algorithm: blur = distance from optimal prescription × blurMultiplier

  // For calibration phase: simulate finding optimal prescription
  // User needs to find the slider position where text becomes clearest
  // We'll simulate different prescription strengths for testing

  // Test scenario: Assume user actually needs +2.0D readers
  const simulatedUserPrescription = 2.0; // This represents what user actually needs

  // Calculate blur based on distance from their actual prescription need
  const distanceFromOptimal = Math.abs(
    selectedValue - simulatedUserPrescription,
  );
  const blurPerDiopter = 0.6; // How much blur per diopter of distance
  const minimumBlur = 0.05; // Tiny amount of blur even at optimal for realism

  // Distance-based blur: farther from optimal = more blur
  const eyeTestBlur =
    distanceFromOptimal === 0
      ? minimumBlur
      : distanceFromOptimal * blurPerDiopter;

  // ✅ FIXED: Remove fallback to 2.0 - use 0.0 if no calibration found

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setSelectedValue(newValue);
  };

  // ✅ FIXED: Calibration confirmation logic - saves the selected calibration and activates correction
  const handleConfirmCalibration = () => {
    console.log(
      "🎯 VisionCalibration: Confirming calibration with selected value:",
      selectedValue,
    );

    // ✅ FIXED: Save calibrationValue = selectedValue (no clamping to +2.0D)
    localStorage.setItem("calibrationValue", selectedValue.toString());

    // ✅ FIXED: Add this line to explicitly set estimatedSphere to match selectedValue
    localStorage.setItem("estimatedSphere", selectedValue.toString());

    // ✅ FIXED: Set visionCorrectionEnabled = true
    localStorage.setItem("visionCorrectionEnabled", "true");
    localStorage.setItem("hasConfirmedVision", "true");

    console.log("📝 VisionCalibration: Calibration saved:", {
      calibrationValue: selectedValue,
      estimatedSphere: selectedValue,
      visionCorrectionEnabled: true,
      note: "User will see 0px blur at this prescription strength",
    });

    // Show calibration success
    setIsCalibrated(true);

    // Navigate to local content demo page after a short delay
    setTimeout(() => {
      console.log("🔄 VisionCalibration: Redirecting to content demo...");
      console.log("🌐 Current location:", window.location.href);
      console.log("🎯 Target redirect:", "/content-demo");

      // PRODUCTION FIX: Use relative path for deployment compatibility
      const targetUrl = "/demo";

      console.log("✅ Navigating to demo page:", targetUrl);

      // Use relative navigation for production deployment
      window.location.href = targetUrl;
    }, 2000);
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
            {calibration > 0 && !isCalibrated && (
              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-green-800">
                  <strong>Current Calibration:</strong> +
                  {calibration.toFixed(2)}D
                </p>
              </div>
            )}
            <p className="text-xl text-gray-900 leading-relaxed">
              Move the slider to find your ideal reading strength. The text
              below should become sharp and clear.
            </p>
            <p className="text-lg text-blue-700 mt-2 font-medium">
              This calibrates MaxVue for your presbyopia - content will be
              clearest at your selected strength.
            </p>
          </div>

          {/* ✅ FIXED: Test Text with dynamic calibration-based blur logic */}
          <div className="text-center mb-12">
            <div
              className="text-black text-base leading-relaxed font-medium transition-all duration-200"
              style={{
                filter: `blur(${eyeTestBlur.toFixed(2)}px)`,
                textShadow:
                  eyeTestBlur > 0
                    ? `0 0 ${eyeTestBlur}px rgba(0,0,0,0.3)`
                    : "none",
              }}
            >
              <p className="mb-8">
                We do not see
                <br />
                things as they are,
                <br />
                we see them as
                <br />
                we are.
              </p>
              <p className="text-sm">– Anais Nin</p>
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
                style={{ background: "#1D4262" }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>+0.00D</span>
                <span>+1.75D</span>
                <span>+3.50D</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600 mt-1">
                <span>No readers</span>
                <span>Mild presbyopia</span>
                <span>Strong presbyopia</span>
              </div>
              <style>{`
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
              {isCalibrated ? (
                <div>
                  <p className="text-xl font-bold text-green-600 mb-2">
                    ✅ Calibration Saved!
                  </p>
                  <p className="text-lg font-semibold text-black mb-2">
                    Your Calibration: +{selectedValue.toFixed(2)}D
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Redirecting to demo page...
                  </p>
                  {import.meta.env.DEV && (
                    <p className="text-xs text-blue-600 mt-1">
                      🔄 Dev: Redirecting to {window.location.origin}
                      /content-demo
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-black mb-2">
                    Testing: +{selectedValue.toFixed(2)} D
                  </p>
                  <p className="text-sm text-gray-600">
                    Eye Test Blur: {eyeTestBlur.toFixed(2)}px
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Distance from optimal (+
                    {simulatedUserPrescription.toFixed(2)}D):{" "}
                    {distanceFromOptimal.toFixed(2)}D
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium text-sm">
                      🎯 Find your clearest reading strength
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      Text should be clearest at YOUR optimal prescription
                      strength
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    {eyeTestBlur <= 0.05
                      ? "🎯 Perfect clarity - ready to calibrate!"
                      : eyeTestBlur < 0.5
                        ? "✨ Very clear"
                        : eyeTestBlur < 1
                          ? "👍 Getting clearer"
                          : "👁️ Still blurry - keep adjusting"}
                  </p>
                </>
              )}
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

          {/* Debug Info */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                Debug: Previous Calibration: +{calibration.toFixed(2)}D |
                Current Test: +{selectedValue.toFixed(2)}D | Simulation Blur:{" "}
                {eyeTestBlur.toFixed(2)}px | Distance-based presbyopia
                simulation (clearest at +{simulatedUserPrescription.toFixed(2)}
                D) | Will Save: calibrationValue = {selectedValue.toString()},
                estimatedSphere = {selectedValue.toString()},
                visionCorrectionEnabled = true
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
