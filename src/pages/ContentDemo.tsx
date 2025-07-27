import React, { useState, useEffect, useRef } from "react";
import { VisionProcessor } from "../components/VisionProcessor";
import { useVisionCorrection } from "../hooks/useVisionCorrection";
import { useMobileDetection } from "../hooks/useMobileDetection";
import { CanvasAnalysisOverlay, CanvasAnalysisDebugPanel } from "../components/CanvasAnalysisOverlay";
import WorkingCameraDemo from "../components/WorkingCameraDemo";
import NativeAppDemo from "../components/NativeAppDemo";
import WebGLDebugPanel from "../components/WebGLDebugPanel";
import { WEBGL_ENABLED } from '../config/features';
import { EnhancedCSSTestingPanel } from '../components/EnhancedCSSTestingPanel';
import { AdvancedProcessingPanel } from '../components/AdvancedProcessingPanel';
import { WeekOneTest } from '../components/WeekOneTest';
import { MobileFilterTest } from '../components/MobileFilterTest';
import FoundationOptimizer from '../components/FoundationOptimizer';
import VisionCorrectionDiagnostic from '../components/VisionCorrectionDiagnostic';

// Progressive Enhancement Test Component
const ProgressiveEnhancementTest: React.FC = () => {
  const { triggerProcessing } = useVisionCorrection();
  const [applied, setApplied] = useState(false);

  const handleApplyEnhancements = () => {
    triggerProcessing();
    setApplied(true);
    console.log('🎯 Progressive enhancement system activated');
  };

  return (
    <section className="enhancement-test-section" style={{ margin: '20px 0', padding: '20px', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#f8fff8' }}>
      <h3>🎯 Progressive Enhancement System (Target: 4.5/10)</h3>
      <p><strong>Goal:</strong> Apply Foundation + Progressive + Optical Simulation</p>
      
      <button 
        onClick={handleApplyEnhancements}
        style={{
          padding: '12px 24px',
          backgroundColor: applied ? '#28a745' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {applied ? '✅ Enhancements Applied' : '🎯 Apply All Presbyopia Enhancements'}
      </button>

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <p><strong>Enhancement Stack:</strong></p>
        <ul>
          <li>✅ Week 1 Foundation (3.3/10) - Base text sharpening</li>
          <li>🎯 + Focal Cues (+0.3) - Subtle depth and parallax</li>
          <li>🎯 + Content-Aware (+0.2) - Enhanced small text/numbers</li>
          <li>🎯 + Typography (+0.2) - Presbyopia-friendly spacing</li>
          <li>🎯 + Optical Simulation (+0.5) - Accommodation assistance</li>
        </ul>
        <p><strong>Target Total: 4.5/10 effectiveness</strong></p>
      </div>
    </section>
  );
};
// Removed unused imports - using local components instead

// SYSTEMATIC DEBUGGING: Verify imports
console.log('🔍 ContentDemo: Import verification:', {
  CanvasAnalysisOverlay: !!CanvasAnalysisOverlay,
  CanvasAnalysisDebugPanel: !!CanvasAnalysisDebugPanel,
  useVisionCorrection: !!useVisionCorrection,
  VisionProcessor: !!VisionProcessor
});

// Sample content components for testing - using local versions to avoid conflicts
const SampleImageLocal: React.FC = () => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">Image Processing Test</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <img
        src="https://picsum.photos/400/300?random=1"
        alt="Sample landscape"
        className="rounded-lg shadow-md w-full"
      />
      <img
        src="https://picsum.photos/400/300?random=2"
        alt="Sample portrait"
        className="rounded-lg shadow-md w-full"
      />
    </div>
  </div>
);

const SampleText: React.FC = () => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">Text Processing Test</h3>
    <div className="prose prose-sm max-w-none">
      <p className="text-sm text-gray-600 mb-2">
        This is small text to test near vision correction. It should become
        clearer and sharper when presbyopia correction is applied.
      </p>
      <p className="text-base text-gray-800 mb-2">
        This is regular text that tests the balance between near and far vision
        corrections.
      </p>
      <p className="text-lg text-gray-900 mb-2">
        This is larger text that primarily tests far vision correction
        algorithms.
      </p>
      <div className="bg-gray-100 p-4 rounded-lg">
        <code className="text-xs">
          function testVision() {"{"}
          <br />
          &nbsp;&nbsp;// Small code text for detailed near vision testing
          <br />
          &nbsp;&nbsp;return "Testing edge enhancement and contrast";
          <br />
          {"}"}
        </code>
      </div>
    </div>
  </div>
);

// Vision Test component removed - calibration is handled in VisionCalibration page

const InteractiveDemo: React.FC = () => {
  const [demoText, setDemoText] = useState("");
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    setDemoText(`
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

This text should become clearer and easier to read when the vision correction is properly calibrated for your presbyopia.
    `);
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Interactive Reading Test</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size: {fontSize}px
        </label>
        <input
          type="range"
          min="10"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div
        className="bg-white p-6 rounded-lg shadow-md border"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="prose prose-sm max-w-none">
          {demoText.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-3 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const EmailDemo: React.FC = () => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">Email Content Test</h3>
    <div className="bg-white rounded-lg shadow-md border">
      {/* Email Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            From: john.doe@example.com
          </div>
          <div className="text-sm text-gray-600">Today 2:45 PM</div>
        </div>
        <div className="text-lg font-semibold">
          Weekly Team Update - Project Status
        </div>
      </div>

      {/* Email Body */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-800 mb-4">Hi team,</p>
          <p className="text-gray-800 mb-4">
            I wanted to provide you with a quick update on our current project
            milestones and upcoming deadlines.
          </p>
          <p className="text-gray-800 mb-4">
            <strong>Completed this week:</strong>
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>User authentication system implementation</li>
            <li>Database schema optimization</li>
            <li>Initial UI/UX mockups completed</li>
          </ul>
          <p className="text-gray-800 mb-4">
            <strong>Upcoming priorities:</strong>
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>API endpoint testing - due Friday</li>
            <li>Mobile responsiveness review</li>
            <li>Security audit preparation</li>
          </ul>
          <p className="text-gray-800 mb-4">
            Please review the attached documents and let me know if you have any
            questions or concerns.
          </p>
          <p className="text-gray-800">
            Best regards,
            <br />
            John Doe
          </p>
        </div>
      </div>
    </div>
  </div>
);

const WebDemo: React.FC = () => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">Web Content Test</h3>
    <div className="bg-white rounded-lg shadow-md border">
      {/* Browser Bar */}
      <div className="bg-gray-100 p-3 rounded-t-lg border-b">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600">
            https://example.com/article
          </div>
        </div>
      </div>

      {/* Web Content */}
      <div className="p-6">
        <article className="prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            The Future of Vision Correction Technology
          </h1>
          <div className="text-sm text-gray-600 mb-6">
            Published on March 15, 2024 | 5 min read
          </div>

          <p className="text-gray-800 mb-4">
            Digital vision correction is revolutionizing how we interact with
            screens and digital content. As our reliance on digital devices
            continues to grow, innovative solutions are emerging to address the
            challenges of presbyopia and digital eye strain.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Key Innovations in Digital Vision Correction
          </h2>

          <p className="text-gray-800 mb-4">
            Modern vision correction technology leverages advanced algorithms to
            process visual content in real-time. These systems can adapt to
            individual user needs, providing personalized enhancement that
            improves readability and reduces eye fatigue.
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4">
            "The integration of AI-powered vision correction with everyday
            digital experiences represents a significant leap forward in
            accessibility technology."
          </blockquote>

          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Benefits for Users
          </h2>

          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>Reduced eye strain during prolonged screen use</li>
            <li>Improved text clarity for users with presbyopia</li>
            <li>Customizable settings for different viewing conditions</li>
            <li>Real-time adaptation to content type and size</li>
          </ul>

          <p className="text-gray-800">
            As this technology continues to evolve, we can expect even more
            sophisticated solutions that seamlessly integrate with our digital
            lives, making technology more accessible for everyone.
          </p>
        </article>
      </div>
    </div>
  </div>
);

const PerformanceMonitorLocal: React.FC = () => {
  const [metrics, setMetrics] = useState<{
    processedElements: number;
    averageProcessingTime: number;
    lastUpdate: string;
  }>({
    processedElements: 0,
    averageProcessingTime: 0,
    lastUpdate: "",
  });

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        processedElements:
          prev.processedElements + Math.floor(Math.random() * 5),
        averageProcessingTime: 12 + Math.random() * 8,
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-gray-900 mb-3">
        Processing Statistics
      </h4>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Elements Processed</div>
          <div className="text-xl font-bold text-blue-600">
            {metrics.processedElements}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Avg. Processing Time</div>
          <div className="text-xl font-bold text-green-600">
            {metrics.averageProcessingTime.toFixed(1)}ms
          </div>
        </div>
        <div>
          <div className="text-gray-600">Last Update</div>
          <div className="text-sm font-medium text-gray-800">
            {metrics.lastUpdate}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [calibrationValue, setCalibrationValue] = useState(0);
  const [mobileTestEnabled, setMobileTestEnabled] = useState(false);
  const [foundationOptimizerEnabled, setFoundationOptimizerEnabled] = useState(false);
  const [visionDiagnosticEnabled, setVisionDiagnosticEnabled] = useState(false);
  const [diagnosticEnabled, setDiagnosticEnabled] = useState(false);
  // Remove unused calibrationLoaded state - not needed with dependency-based useEffect

  // CRITICAL FIX: Add loading ref to prevent multiple simultaneous loads
  const loadingRef = useRef(false);

  // Use the vision correction hook to access current settings
  const visionHook = useVisionCorrection();

  // Extract Canvas analysis state from vision hook
  const {
    canvasAnalysisEnabled,
    canvasAnalysisResult,
    toggleCanvasAnalysis,
    analyzeElement,
    processElementWithCanvas,
    webglEnabled,
    toggleWebGL,
    webglPerformance,
  } = visionHook;

  // Add state for showing the WebGL debug panel
  const [showWebGLDebug, setShowWebGLDebug] = useState(false);

  // ARCHITECTURAL VALIDATION: Log Canvas state and prop flow
  console.log('🏗️ ARCHITECTURE: ContentDemo Canvas state extracted from useVisionCorrection:', {
    canvasAnalysisEnabled,
    canvasAnalysisResult: canvasAnalysisResult ? 'Present' : 'null',
    textRegionsCount: canvasAnalysisResult?.textRegions?.length || 0,
    processingTime: canvasAnalysisResult?.processingTime || 'N/A',
    toggleCanvasAnalysis: !!toggleCanvasAnalysis,
    analyzeElement: !!analyzeElement,
    processElementWithCanvas: !!processElementWithCanvas,
    hookInstance: 'ContentDemo-useVisionCorrection'
  });

  // Use mobile detection hook
  const mobileDetection = useMobileDetection();

  // CRITICAL FIX: useEffect that responds to mobile detection changes
  useEffect(() => {
    // CRITICAL FIX: Prevent multiple simultaneous loads
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    console.log(
      "🔍 ContentDemo: Loading calibration data (device detection changed)...",
    );

    try {
      // Check all possible calibration keys
      const savedCalibration = localStorage.getItem("calibrationValue");
      const estimatedSphere = localStorage.getItem("estimatedSphere");
      const visionEnabled = localStorage.getItem("visionCorrectionEnabled");

      console.log("📊 ContentDemo: LocalStorage debug:", {
        calibrationValue: savedCalibration,
        estimatedSphere: estimatedSphere,
        visionCorrectionEnabled: visionEnabled,
        deviceType: mobileDetection.deviceType,
        calibrationAdjustment: mobileDetection.calibrationAdjustment,
        allKeys: Object.keys(localStorage).filter(
          (k) => k.includes("calibr") || k.includes("vision"),
        ),
      });

      const baseCalibrationVal = parseFloat(savedCalibration || "0");
      // Apply mobile adjustment to calibration
      const adjustedCalibrationVal =
        mobileDetection.getAdjustedCalibration(baseCalibrationVal);
      setCalibrationValue(adjustedCalibrationVal);

      console.log(
        `✅ ContentDemo: Loaded calibration: +${baseCalibrationVal.toFixed(2)}D (base) → +${adjustedCalibrationVal.toFixed(2)}D (adjusted for ${mobileDetection.deviceType})`,
      );
      console.log(
        `📱 ContentDemo: Device: ${mobileDetection.deviceType}, Viewing distance: ${mobileDetection.viewingDistance}", Adjustment: +${mobileDetection.calibrationAdjustment}D`,
      );

      // Enable vision correction if it was previously enabled
      if (visionEnabled === "true") {
        console.log(
          `🎯 ContentDemo: Enabling vision correction (not overriding readingVision)`,
        );
        visionHook.updateSettings({
          isEnabled: true,
        });
      }

      // Calibration loading complete
    } catch (error) {
      console.error("❌ ContentDemo: Error loading calibration:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [mobileDetection, visionHook]); // CRITICAL FIX: Depend on mobile detection changes!

  if (WEBGL_ENABLED) {
    console.log("🔍 WebGL UI debug", {
      webglEnabled,
      webglPerformance,
      toggleWebGL: typeof toggleWebGL,
      toggleWebGLFunction: toggleWebGL,
      showWebGLDebug,
      visionHook: visionHook // show full hook data
    });
  }

  if (WEBGL_ENABLED) {
    console.log("🔍 TOGGLE FUNCTION VERIFICATION:", {
      toggleWebGLExists: !!toggleWebGL,
      toggleWebGLType: typeof toggleWebGL,
      toggleWebGLString: toggleWebGL?.toString().substring(0, 50) + "...",
      webglEnabled,
    });
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "👁️" },
    { id: "images", name: "Images", icon: "🖼️" },
    { id: "email", name: "Email", icon: "📧" },
    { id: "web", name: "Web", icon: "🌐" },
    { id: "camera", name: "Camera", icon: "📷" },
    { id: "native", name: "Native App", icon: "📱" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {(() => {
        console.log('📍 ContentDemo: PAGE CONTAINER rendered');
        return null;
      })()}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          {(() => {
            console.log('📍 ContentDemo: HEADER SECTION rendered');
            return null;
          })()}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MaxVue Vision Correction Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience advanced presbyopia correction powered by our
            VisionCorrectionEngine. The system uses canvas-based image
            processing with adaptive sharpening algorithms to enhance your
            visual experience across all types of content.
          </p>

          {/* Mobile Detection Info */}
          <div className="mt-4 inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm">
            <span className="text-blue-800">
              {mobileDetection.deviceType === "mobile" && "📱"}
              {mobileDetection.deviceType === "tablet" && "📲"}
              {mobileDetection.deviceType === "desktop" && "💻"}
            </span>
            <span className="font-medium text-blue-900">
              {mobileDetection.deviceType.charAt(0).toUpperCase() +
                mobileDetection.deviceType.slice(1)}{" "}
              Device
            </span>
            <span className="text-blue-700">
              • Viewing Distance: {mobileDetection.viewingDistance}"
            </span>
            {mobileDetection.calibrationAdjustment > 0 && (
              <span className="text-blue-700">
                • Calibration Adjustment: +
                {mobileDetection.calibrationAdjustment.toFixed(2)}D
              </span>
            )}
          </div>
        </div>

        {/* Main Vision Processor Wrapper */}
        {(() => {
          console.log('📍 ContentDemo: VISION PROCESSOR WRAPPER about to render');
          return null;
        })()}
        {/* Vision Controls Panel */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900">Vision Correction:</span>
            <span className="badge badge-success">Enabled</span>
          </div>
          {/* Reading Vision Slider and other controls here */}
          <div className="flex items-center gap-4 mt-2">
            <span className="font-medium text-gray-700">Canvas Analysis:</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={canvasAnalysisEnabled}
              onChange={toggleCanvasAnalysis}
            />
          </div>
          {WEBGL_ENABLED && (
            <div className="flex items-center gap-4 mt-2">
              <span className="font-medium text-gray-700">WebGL Acceleration:</span>
              <span className="text-xs text-blue-600">(Click to test)</span>
              <input
                type="checkbox"
                className="toggle toggle-accent"
                checked={webglEnabled}
                onChange={() => {
                  console.log('🚨 TOGGLE ELEMENT CLICKED: WebGL toggle clicked');
                  console.log('🚨 Current webglEnabled state:', webglEnabled);
                  console.log('🚨 About to call toggleWebGL function');
                  console.log('🚨 TOGGLE DEBUG: toggleWebGL function type:', typeof toggleWebGL);
                  console.log('🚨 TOGGLE DEBUG: toggleWebGL function:', toggleWebGL);
                  if (toggleWebGL) {
                    toggleWebGL();
                    console.log('🚨 toggleWebGL function called');
                  } else {
                    console.log('🚨 toggleWebGL function is undefined');
                  }
                }}
                onClick={() => {
                  console.log('🚨 TOGGLE ONCLICK: WebGL toggle clicked (onClick event)');
                }}
                data-testid="webgl-toggle"
                aria-label="WebGL Acceleration Toggle"
                id="webgl-acceleration-toggle"
                style={{ cursor: 'pointer' }}
              />
              <span className="text-xs text-gray-500 ml-2">
                Performance: {webglPerformance ? `${Math.round(webglPerformance.fps)} fps, ${Math.round(webglPerformance.processingTime)}ms` : 'N/A'}
              </span>
              <span className={`badge ml-2 ${webglPerformance && webglPerformance.fallbackTriggered ? 'badge-warning' : 'badge-info'}`}>{webglPerformance && webglPerformance.fallbackTriggered ? 'CSS Fallback' : 'WebGL Active'}</span>
              <button
                className="btn btn-xs btn-outline btn-info ml-4"
                onClick={() => setShowWebGLDebug((prev) => !prev)}
              >
                {showWebGLDebug ? 'Hide' : 'Show'} WebGL Debug
              </button>
              <button
                className="btn btn-xs btn-outline btn-warning ml-2"
                onClick={() => {
                  console.log('🧪 TEST BUTTON: Manually calling toggleWebGL');
                  if (toggleWebGL) {
                    toggleWebGL();
                  } else {
                    console.log('🧪 TEST BUTTON: toggleWebGL is undefined');
                  }
                }}
              >
                Test Toggle
              </button>
            </div>
          )}
          
          {/* Mobile Filter Test - Updated Styling */}
          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium text-gray-700">Mobile Filter Test:</span>
            <button
              onClick={() => setMobileTestEnabled(!mobileTestEnabled)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                mobileTestEnabled
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📱 {mobileTestEnabled ? 'Disable' : 'Enable'} Mobile Filter Test
            </button>
          </div>

          {/* Foundation Optimizer Controls */}
          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium text-gray-700">Foundation Optimizer:</span>
            <button
              onClick={() => setFoundationOptimizerEnabled(!foundationOptimizerEnabled)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                foundationOptimizerEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔧 {foundationOptimizerEnabled ? 'Disable' : 'Enable'} Foundation Optimizer
            </button>
          </div>

          {/* Vision Diagnostic - Enhanced with Explicit Visibility */}
          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium text-gray-700">Vision Diagnostic:</span>
            <button
              onClick={() => {
                console.log('🔍 Diagnostic button clicked, current state:', diagnosticEnabled);
                setDiagnosticEnabled(!diagnosticEnabled);
              }}
              className={`
                px-4 py-2 rounded text-sm font-medium transition-colors
                block visible relative z-10
                border border-solid
                ${diagnosticEnabled
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300'
                }
              `}
              style={{
                display: 'block !important',
                visibility: 'visible' as const,
                opacity: '1 !important'
              }}
            >
              🔍 {diagnosticEnabled ? 'Disable' : 'Enable'} Vision Diagnostic
            </button>
          </div>

          {/* Debug Info - Remove after fixing */}
          <div className="text-xs text-gray-500 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div>Debug Info:</div>
            <div>diagnosticEnabled: {diagnosticEnabled ? 'true' : 'false'}</div>
            <div>Screen width: {typeof window !== 'undefined' ? window.innerWidth : 'unknown'}px</div>
            <div>User agent: {typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop') : 'unknown'}</div>
          </div>
          {/* Advanced Settings and other controls here */}
          {WEBGL_ENABLED && showWebGLDebug && (
            <div className="mt-4">
              {/* WebGLDebugPanel will be rendered here */}
              <WebGLDebugPanel 
                webglPerformance={webglPerformance} 
                getWebGLContextInfo={visionHook.getWebGLContextInfo} 
                processElementWithWebGL={visionHook.processElementWithWebGL}
              />
            </div>
          )}
        </div>
        {/* Vision Correction Diagnostic - place at top for easy access */}
        <VisionCorrectionDiagnostic isEnabled={diagnosticEnabled} />

        {/* Week 1 Foundation Testing */}
        <section className="mb-8">
          <WeekOneTest />
        </section>
        
        {/* Mobile Filter Test */}
        <MobileFilterTest isEnabled={mobileTestEnabled} />
        <VisionProcessor
          className="w-full"
          autoProcess={true}
          showControls={true}
        >
          {/* Tab Navigation */}
          {(() => {
            console.log('📍 ContentDemo: TAB NAVIGATION rendered');
            return null;
          })()}
          <div className="flex flex-wrap justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 mx-1 mb-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          {(() => {
            console.log('📍 ContentDemo: CONTENT AREA rendered');
            return null;
          })()}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {activeTab === "overview" && (
              <div>
                {(() => {
                  console.log('📍 ContentDemo: SYSTEM OVERVIEW TAB rendered');
                  return null;
                })()}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  System Overview
                </h2>
                <PerformanceMonitorLocal />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Canvas-based image processing for real visual
                        enhancement
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Adaptive sharpening algorithms tailored for presbyopia
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Real-time processing of images, videos, and text
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        Personalized calibration based on your vision needs
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Unsharp mask filtering for enhanced clarity
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Edge enhancement for better text reading
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Contrast optimization for improved visibility
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Presbyopia-specific correction (reading vision)
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <SampleText />
                  <InteractiveDemo />
                  <SampleImageLocal />
                </div>
              </div>
            )}

            {activeTab === "images" && <SampleImageLocal />}
            {activeTab === "email" && (
              <div className="space-y-6">
                <EmailDemo />
                
                {/* Foundation Optimizer - placed after email content for easy comparison */}
                <FoundationOptimizer isEnabled={foundationOptimizerEnabled} />
                
                {/* Vision Correction Diagnostic */}
                <VisionCorrectionDiagnostic isEnabled={visionDiagnosticEnabled} />
              </div>
            )}
            {activeTab === "web" && <WebDemo />}
            {activeTab === "camera" &&
              (() => {
                const readingVision = visionHook.settings?.readingVision || 0;
                const calibration = calibrationValue;
                const blurAmount = Math.abs(readingVision - calibration) * 1.2;
                console.log(
                  "🎯 ContentDemo: Rendering camera with DYNAMIC props:",
                  {
                    readingVisionDiopter: readingVision,
                    calibrationValue: calibration,
                    expectedBlur: blurAmount.toFixed(2) + "px",
                    willBlur: blurAmount > 0.1,
                  },
                );
                return (
                  <WorkingCameraDemo
                    readingVisionDiopter={readingVision}
                    calibrationValue={calibration}
                  />
                );
              })()}
            {activeTab === "native" && <NativeAppDemo />}
          </div>

          {/* Footer Info */}
          {(() => {
            console.log('📍 ContentDemo: FOOTER INFO rendered');
            return null;
          })()}
          <div className="mt-8 text-center text-gray-600">
            <p>
              Adjust the vision correction settings above to optimize your
              viewing experience. The system will automatically process all
              visual content on this page.
            </p>
          </div>

          {/* Canvas Analysis Visual Overlay */}
          {(() => {
            console.log('📍 ContentDemo: CANVAS ANALYSIS OVERLAY SECTION about to render');
            return null;
          })()}
          {canvasAnalysisEnabled && canvasAnalysisResult && (() => {
            console.log('🔍 ContentDemo: About to render CanvasAnalysisOverlay');
            console.log('🔍 ContentDemo: Overlay conditions met:', {
              canvasAnalysisEnabled,
              canvasAnalysisResult: !!canvasAnalysisResult,
              bothConditionsTrue: canvasAnalysisEnabled && canvasAnalysisResult
            });
            const targetElement = document.querySelector('.vision-processor-container') as HTMLElement;
            console.log('🔍 ContentDemo: Target element found:', !!targetElement);
            console.log('🔍 ContentDemo: CanvasAnalysisOverlay props:', {
              analysisResult: !!canvasAnalysisResult,
              targetElement: !!targetElement,
              enabled: true,
              className: 'canvas-analysis-overlay'
            });
            return (
            <CanvasAnalysisOverlay
              analysisResult={canvasAnalysisResult}
              targetElement={targetElement}
              enabled={true}
              className="canvas-analysis-overlay"
            />
            );
          })()}
        </VisionProcessor>
        {/* Layer 1: Enhanced CSS Testing Panel for presbyopia correction */}
        <div className="enhanced-css-testing">
          <EnhancedCSSTestingPanel />
        </div>
        {/* Layer 2: Advanced Processing Panel - REMOVED (broken) */}
        {/* <div className="advanced-processing-section mt-8">
          <AdvancedProcessingPanel />
        </div> */}
        {/* Layer 3: Progressive Enhancement Test for comprehensive presbyopia assistance */}
        <div className="progressive-enhancement-section mt-8">
          <ProgressiveEnhancementTest />
        </div>
      </div>
    </div>
  );
};

export default ContentDemo;
