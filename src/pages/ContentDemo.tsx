import React, { useState, useEffect, useRef } from "react";
import { VisionProcessor } from "../components/VisionProcessor";
import { useVisionCorrection } from "../hooks/useVisionCorrection";
import CameraDemo from "../components/CameraDemo";
import NativeAppDemo from "../components/NativeAppDemo";
// Removed unused imports - using local components instead

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
  const [calibrationLoaded, setCalibrationLoaded] = useState(false);
  
  // CRITICAL FIX: Add loading ref to prevent multiple simultaneous loads
  const loadingRef = useRef(false);

  // Use the vision correction hook to access current settings
  const visionHook = useVisionCorrection();

  // CRITICAL FIX: Single useEffect with proper dependencies to prevent infinite loop
  useEffect(() => {
    // CRITICAL FIX: Prevent multiple simultaneous loads
    if (loadingRef.current || calibrationLoaded) {
      return;
    }
    
    loadingRef.current = true;
    console.log("🔍 ContentDemo: Loading calibration data (once)...");
    
    try {
      // Check all possible calibration keys
      const savedCalibration = localStorage.getItem("calibrationValue");
      const estimatedSphere = localStorage.getItem("estimatedSphere");
      const visionEnabled = localStorage.getItem("visionCorrectionEnabled");
      
      console.log("📊 ContentDemo: LocalStorage debug:", {
        calibrationValue: savedCalibration,
        estimatedSphere: estimatedSphere,
        visionCorrectionEnabled: visionEnabled,
        allKeys: Object.keys(localStorage).filter(k => k.includes('calibr') || k.includes('vision')),
      });
      
      const calibrationVal = parseFloat(savedCalibration || "0");
      setCalibrationValue(calibrationVal);
      
      console.log(`✅ ContentDemo: Loaded calibration: +${calibrationVal.toFixed(2)}D`);
      
      // If we have a calibration value, update the vision hook settings
      if (calibrationVal > 0) {
        console.log(`🎯 ContentDemo: Applying calibration +${calibrationVal.toFixed(2)}D to vision settings`);
        visionHook.updateSettings({ 
          readingVision: calibrationVal,
          isEnabled: visionEnabled === "true" 
        });
      }
      
      // CRITICAL FIX: Mark calibration as loaded to prevent re-runs
      setCalibrationLoaded(true);
    } catch (error) {
      console.error('❌ ContentDemo: Error loading calibration:', error);
    } finally {
      loadingRef.current = false;
    }
  }, []); // CRITICAL FIX: Empty dependency array - only run once on mount
  // Note: visionHook and calibrationLoaded deliberately excluded to prevent infinite loop

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
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MaxVue Vision Correction Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience advanced presbyopia correction powered by our
            VisionCorrectionEngine. The system uses canvas-based image
            processing with adaptive sharpening algorithms to enhance your
            visual experience across all types of content.
          </p>
        </div>

        {/* Main Vision Processor Wrapper */}
        <VisionProcessor
          className="w-full"
          autoProcess={true}
          showControls={true}
        >
          {/* Tab Navigation */}
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
          <div className="bg-white rounded-xl shadow-lg p-8">
            {activeTab === "overview" && (
              <div>
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
            {activeTab === "email" && <EmailDemo />}
            {activeTab === "web" && <WebDemo />}
            {activeTab === "camera" && (
              <CameraDemo
                readingVisionDiopter={visionHook.settings?.readingVision || 0}
                calibrationValue={calibrationValue}
              />
            )}
            {activeTab === "native" && <NativeAppDemo />}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-gray-600">
            <p>
              Adjust the vision correction settings above to optimize your
              viewing experience. The system will automatically process all
              visual content on this page.
            </p>
          </div>
        </VisionProcessor>
      </div>
    </div>
  );
};

export default ContentDemo;
