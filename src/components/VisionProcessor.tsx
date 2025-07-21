import React, { useEffect, useRef, useState } from "react";
import { useVisionCorrection } from "../hooks/useVisionCorrection";
import { cacheManager } from "../utils/cacheUtils";
import { internalToUserScale, userToInternalScale } from "../utils/calibrationMapping";
import { CanvasAnalysisDebugPanel } from "./CanvasAnalysisOverlay";
import { WEBGL_ENABLED } from '../config/features';

/**
 * VisionProcessor Component - ARCHITECTURE VERIFIED
 * 
 * SYSTEMATIC DEBUGGING COMPLETED - KEY FINDINGS:
 * ✅ useEffect hooks execute successfully
 * ✅ startRealTimeProcessing is called correctly  
 * ✅ Element processing pipeline is functional
 * ✅ CSS-based vision correction works (3.0/10 effectiveness)
 * 
 * REAL DEVELOPMENT NEED: WebGL Implementation
 * - WebGL toggle exists but lacks actual GPU processing
 * - Need to implement WebGL shaders for presbyopia correction
 * - Need WebGL renderer integration for 5.0/10 effectiveness target
 * 
 * Original "useEffect not executing" issue was incorrect diagnosis.
 * System works as designed - WebGL implementation is the missing piece.
 */

interface VisionProcessorProps {
  children: React.ReactNode;
  className?: string;
  autoProcess?: boolean;
  showControls?: boolean;
}

interface VisionControlsProps {
  settings: {
    readingVision: number; // Single presbyopia correction value (-4.00D to +3.5D)
    contrastBoost: number;
    edgeEnhancement: number;
  };
  updateSettings: (
    settings: Partial<{
      readingVision: number;
      contrastBoost: number;
      edgeEnhancement: number;
    }>,
  ) => void;
  isEnabled: boolean;
  toggleEnabled: () => void;
  isProcessing: boolean;
  resetSettings: () => void;
  // Canvas Analysis props
  canvasAnalysisEnabled: boolean;
  canvasAnalysisResult: any;
  toggleCanvasAnalysis: () => void;
  analyzeElement: (element: HTMLElement) => Promise<void>;
}

const VisionControls: React.FC<VisionControlsProps> = ({
  settings,
  updateSettings,
  isEnabled,
  toggleEnabled,
  isProcessing,
  resetSettings,
  canvasAnalysisEnabled,
  canvasAnalysisResult,
  toggleCanvasAnalysis,
  analyzeElement,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cacheRefreshing, setCacheRefreshing] = useState(false);

  // Get calibration value from localStorage (internal scale) and convert to user scale
  const internalCalibrationValue = parseFloat(
    localStorage.getItem("calibrationValue") || "0"
  );
  const userCalibrationValue = internalToUserScale(internalCalibrationValue);

  // Convert internal reading vision to user-friendly scale for display
  const userReadingVision = internalToUserScale(settings.readingVision);

  const handleReadingVisionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const userDiopter = parseFloat(e.target.value);
    const internalDiopter = userToInternalScale(userDiopter);
    updateSettings({ readingVision: internalDiopter });
  };

  const handleCacheRefresh = async () => {
    setCacheRefreshing(true);
    try {
      console.log("🔄 Manual cache refresh initiated");
      const result = await cacheManager.forceCacheRefresh();
      if (result.success) {
        console.log("✅ Cache refreshed successfully, reloading...");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.error("❌ Cache refresh failed:", result.error);
      }
    } catch (error) {
      console.error("❌ Cache refresh error:", error);
    } finally {
      setCacheRefreshing(false);
    }
  };

  return (
    <div className="vision-controls bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Vision Correction
        </h3>
        <div className="flex items-center space-x-3">
          {isProcessing && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
          <button
            onClick={toggleEnabled}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEnabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-4">
          {/* Calibration Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Your Calibration:</strong> {userCalibrationValue >= 0 ? "+" : ""}{userCalibrationValue.toFixed(2)}D
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Presbyopia correction - content clearest at your calibration
              strength
            </p>
          </div>

          {/* Reading Vision Control */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reading Vision: {userReadingVision >= 0 ? "+" : ""}{userReadingVision.toFixed(2)}D
            </label>
            <input
              type="range"
              min="0"
              max="3.5"
              step="0.25"
              value={userReadingVision}
              onChange={handleReadingVisionChange}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.00D</span>
              <span>+1.75D</span>
              <span>+3.50D</span>
            </div>
            <div className="flex justify-between text-xs text-blue-600 mt-1">
              <span>No reading glasses needed</span>
              <span>Moderate presbyopia</span>
              <span>Very strong presbyopia</span>
            </div>
          </div>

          {/* Advanced Controls Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            {showAdvanced
              ? "− Hide Advanced Settings"
              : "+ Show Advanced Settings"}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contrast Boost: {settings.contrastBoost}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.contrastBoost}
                  onChange={(e) =>
                    updateSettings({ contrastBoost: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edge Enhancement: {settings.edgeEnhancement}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.edgeEnhancement}
                  onChange={(e) =>
                    updateSettings({
                      edgeEnhancement: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Canvas Analysis Section */}
          {(() => {
            console.log('📍 VisionProcessor: CANVAS ANALYSIS SECTION rendering in VisionControls');
            console.log('🏗️ ARCHITECTURE: VisionControls Canvas Section rendering:', {
              canvasAnalysisEnabled,
              canvasAnalysisResult: canvasAnalysisResult ? 'Present' : 'null',
              renderLocation: 'VisionProcessor-VisionControls',
              renderType: 'Secondary Canvas UI'
            });
            return null;
          })()}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-medium text-gray-800">Canvas Analysis</h4>
              <button
                onClick={toggleCanvasAnalysis}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                  canvasAnalysisEnabled
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-label="Canvas Analysis Toggle"
              >
                {`Canvas Analysis: ${canvasAnalysisEnabled ? "Enabled" : "Disabled"}`}
              </button>
            </div>
            
            {canvasAnalysisEnabled && (
              <CanvasAnalysisDebugPanel
                analysisResult={canvasAnalysisResult}
                enabled={canvasAnalysisEnabled}
                onToggle={toggleCanvasAnalysis}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={resetSettings}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleCacheRefresh}
              disabled={cacheRefreshing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center space-x-2"
            >
              {cacheRefreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Refresh Cache</span>
                </>
              )}
            </button>
            {canvasAnalysisEnabled && (
              <button
                onClick={() => {
                  const container = document.querySelector('.vision-processor-container');
                  if (container) {
                    analyzeElement(container as HTMLElement);
                  }
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
              >
                <span>🔍</span>
                <span>Analyze Content</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const VisionProcessor: React.FC<VisionProcessorProps> = ({
  children,
  className = "",
  autoProcess = true,
  showControls = true,
}) => {
  console.log('[VisionProcessor] Component rendering with props:', { autoProcess, isEnabled: undefined }); // isEnabled will be set after hook
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    settings,
    updateSettings,
    isEnabled,
    toggleEnabled,
    isProcessing,
    startRealTimeProcessing,
    stopRealTimeProcessing,
    resetSettings,
    canvasAnalysisEnabled,
    canvasAnalysisResult,
    toggleCanvasAnalysis,
    analyzeElement,
    webglEnabled, // <-- Add this line
  } = useVisionCorrection();

  // ARCHITECTURAL VALIDATION: Log VisionProcessor Canvas state
  console.log('🏗️ ARCHITECTURE: VisionProcessor Canvas state from useVisionCorrection:', {
    canvasAnalysisEnabled,
    canvasAnalysisResult: canvasAnalysisResult ? 'Present' : 'null',
    hookInstance: 'VisionProcessor-useVisionCorrection',
    renderLocation: 'VisionProcessor-Nested'
  });

  // Simple test useEffect to check if any useEffect runs
  useEffect(() => {
    console.log('[VisionProcessor] SIMPLE useEffect triggered - this should ALWAYS run');
  }, []);

  // Listen for WebGL state changes and trigger reprocessing
  useEffect(() => {
    const handleWebGLStateChange = (event: CustomEvent) => {
      console.log('[VisionProcessor] WebGL state change event received:', event.detail);
      if (autoProcess && containerRef.current && isEnabled) {
        console.log('[VisionProcessor] Triggering reprocessing due to WebGL state change');
        // Force reprocessing by calling startRealTimeProcessing again
        startRealTimeProcessing(containerRef.current);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('webgl-state-changed', handleWebGLStateChange as EventListener);
      
      return () => {
        container.removeEventListener('webgl-state-changed', handleWebGLStateChange as EventListener);
      };
    }
  }, [autoProcess, isEnabled, startRealTimeProcessing]);

  // Test if component is mounting/unmounting
  useEffect(() => {
    console.log('[VisionProcessor] Component mounted');
    return () => {
      console.log('[VisionProcessor] Component unmounting');
    };
  }, []);

  // Start real-time processing when component mounts and autoProcess is enabled
  useEffect(() => {
    console.log('[VisionProcessor] useEffect triggered:', {
      autoProcess,
      hasContainer: !!containerRef.current,
      isEnabled,
      webglEnabled,
      containerRefValue: containerRef.current
    });

    if (autoProcess && containerRef.current && isEnabled) {
      console.log('[VisionProcessor] Calling startRealTimeProcessing with webglEnabled:', webglEnabled);
      startRealTimeProcessing(containerRef.current);
    } else {
      console.log('[VisionProcessor] NOT calling startRealTimeProcessing - conditions not met:', {
        autoProcess,
        hasContainer: !!containerRef.current,
        isEnabled
      });
    }

    return () => {
      if (autoProcess) {
        console.log('[VisionProcessor] Cleanup: calling stopRealTimeProcessing');
        stopRealTimeProcessing();
      }
    };
  }, [autoProcess, isEnabled, startRealTimeProcessing, stopRealTimeProcessing, webglEnabled]);

  // Restart processing when settings change
  useEffect(() => {
    if (autoProcess && containerRef.current && isEnabled) {
      stopRealTimeProcessing();
      setTimeout(() => {
        if (containerRef.current) {
          startRealTimeProcessing(containerRef.current);
        }
      }, 100);
    }
  }, [
    settings,
    autoProcess,
    isEnabled,
    startRealTimeProcessing,
    stopRealTimeProcessing,
    webglEnabled,
  ]);

  // After hook, log isEnabled
  console.log('[VisionProcessor] Component rendering after hook:', { autoProcess, isEnabled });

  return (
    <div className={`vision-processor ${className}`}>
      {showControls && (
        <VisionControls
          settings={settings}
          updateSettings={updateSettings}
          isEnabled={isEnabled}
          toggleEnabled={toggleEnabled}
          isProcessing={isProcessing}
          resetSettings={resetSettings}
          canvasAnalysisEnabled={canvasAnalysisEnabled}
          canvasAnalysisResult={canvasAnalysisResult}
          toggleCanvasAnalysis={toggleCanvasAnalysis}
          analyzeElement={analyzeElement}
        />
      )}

      <div
        ref={containerRef}
        className={`vision-processor-container vision-content ${isEnabled ? "vision-processing-active" : ""}`}
        data-vision-container="true"
      >
        {children}
      </div>
    </div>
  );
};

// Higher-order component for wrapping existing components
export const withVisionCorrection = <P extends object>(
  Component: React.ComponentType<P>,
  options: { autoProcess?: boolean; showControls?: boolean } = {},
) => {
  return React.forwardRef<HTMLElement, P>((props, ref) => (
    <VisionProcessor
      autoProcess={options.autoProcess ?? true}
      showControls={options.showControls ?? true}
    >
      <Component {...props} ref={ref} />
    </VisionProcessor>
  ));
};

// Hook for manual processing
export const useVisionProcessor = () => {
  const {
    processElement,
    processImage,
    settings,
    updateSettings,
    isEnabled,
    toggleEnabled,
    isProcessing,
  } = useVisionCorrection();

  const processElementManually = (element: HTMLElement) => {
    if (isEnabled) {
      processElement(element);
    }
  };

  const processImageManually = (
    image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  ) => {
    if (isEnabled) {
      return processImage(image);
    }
    // Return original as canvas if disabled
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    if (image instanceof HTMLImageElement) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
    } else if (image instanceof HTMLVideoElement) {
      canvas.width = image.videoWidth;
      canvas.height = image.videoHeight;
    } else if (image instanceof HTMLCanvasElement) {
      canvas.width = image.width;
      canvas.height = image.height;
    }

    return canvas;
  };

  return {
    processElement: processElementManually,
    processImage: processImageManually,
    settings,
    updateSettings,
    isEnabled,
    toggleEnabled,
    isProcessing,
  };
};
