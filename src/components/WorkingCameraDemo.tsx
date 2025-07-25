import React, { useEffect, useRef } from "react";
import { useMobileDetection } from "../hooks/useMobileDetection";

interface WorkingCameraDemoProps {
  readingVisionDiopter: number;
  calibrationValue: number;
}

const WorkingCameraDemo: React.FC<WorkingCameraDemoProps> = ({
  readingVisionDiopter,
  calibrationValue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileDetection = useMobileDetection();

  console.log(
    `🎯 WorkingCameraDemo: Component render with props - Reading: ${readingVisionDiopter}D, Calibration: ${calibrationValue}D`,
  );
  console.log(
    `📱 WorkingCameraDemo: Device: ${mobileDetection.deviceType}, Viewing distance: ${mobileDetection.viewingDistance}"`,
  );

  // Calculate mobile-adjusted blur amount
  const baseBlurAmount =
    Math.abs(readingVisionDiopter - calibrationValue) * 0.5;
  // Additional mobile-specific blur adjustment for better mobile viewing
  const mobileBlurMultiplier =
    mobileDetection.deviceType === "mobile"
      ? 1.2
      : mobileDetection.deviceType === "tablet"
        ? 1.1
        : 1.0;
  const adjustedBlurAmount = baseBlurAmount * mobileBlurMultiplier;

  useEffect(() => {
    console.log("🎥 WorkingCameraDemo: Component mounted with props:", {
      readingVisionDiopter,
      calibrationValue,
    });

    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    // Use the mobile-adjusted blur amount
    const blurAmount = adjustedBlurAmount;
    console.log(
      `📊 WorkingCameraDemo: Calculated blur: ${blurAmount.toFixed(2)}px (base: ${baseBlurAmount.toFixed(2)}px, multiplier: ${mobileBlurMultiplier}x for ${mobileDetection.deviceType})`,
    );

    // Global reference to apply vision correction function
    let applyVisionCorrectionRef: (() => void) | null = null;

    // Create the camera interface with vanilla JavaScript
    const createCameraInterface = () => {
      const container = containerRef.current!;

      // Create HTML structure
      container.innerHTML = `
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Camera Vision Correction Test</h3>
          
          <div class="bg-white rounded-lg shadow-md border p-6">
            <div class="mb-4">
              <p class="text-gray-700 mb-2">
                Test your vision correction with live camera feed.
              </p>
              <div class="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                Device: ${mobileDetection.deviceType} | Viewing Distance: ${mobileDetection.viewingDistance}" |
                Base Blur: ${baseBlurAmount.toFixed(2)}px | Mobile Multiplier: ${mobileBlurMultiplier}x |
                Final Blur: ${blurAmount.toFixed(2)}px
              </div>
            </div>

            <!-- Camera Controls -->
            <div class="mb-4">
              <button 
                id="start-camera-btn" 
                class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>📷</span>
                <span>Start Camera</span>
              </button>
              
              <button 
                id="stop-camera-btn" 
                class="hidden flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <span>⏹️</span>
                <span>Stop Camera</span>
              </button>
              
              <div id="loading-indicator" class="hidden flex items-center space-x-2 text-blue-600">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Starting camera...</span>
              </div>
            </div>

            <!-- Status Messages -->
            <div id="error-message" class="hidden mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center space-x-2 text-red-800">
                <span>⚠️</span>
                <div>
                  <p class="font-medium">Camera Error</p>
                  <p id="error-text" class="text-sm"></p>
                </div>
              </div>
            </div>

            <div id="success-message" class="hidden mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center space-x-2 text-green-800">
                <span>✅</span>
                <div>
                  <p class="font-medium">Camera Active</p>
                  <p class="text-sm">Blur: ${blurAmount.toFixed(2)}px</p>
                </div>
              </div>
            </div>

            <!-- Vision Settings -->
            <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="font-medium text-blue-900 mb-2">Vision Settings</h4>
              <div class="text-sm text-blue-800 space-y-1">
                <p>Reading Vision: +${readingVisionDiopter.toFixed(2)}D</p>
                <p>Calibration: +${calibrationValue.toFixed(2)}D (mobile-adjusted)</p>
                <p>Device Type: ${mobileDetection.deviceType}</p>
                <p>Viewing Distance: ${mobileDetection.viewingDistance}"</p>
                <p>Mobile Blur Multiplier: ${mobileBlurMultiplier}x</p>
                <p>Final Blur Applied: ${blurAmount.toFixed(2)}px</p>
              </div>
            </div>

            <!-- Camera Display -->
            <div class="relative bg-gray-900 rounded-lg overflow-hidden">
              <video 
                id="camera-video" 
                class="hidden" 
                playsinline 
                muted 
                autoplay
              ></video>
              
              <canvas 
                id="camera-canvas" 
                class="w-full h-auto max-h-96 object-cover bg-black hidden"
                style="min-height: 240px;"
              ></canvas>
              
              <div id="camera-placeholder" class="flex items-center justify-center h-64 text-gray-400">
                <div class="text-center">
                  <div class="w-16 h-16 mx-auto mb-4 opacity-50">📷</div>
                  <p class="text-lg">Camera not active</p>
                  <p class="text-sm">Click "Start Camera" to begin</p>
                </div>
              </div>
            </div>

            <!-- Debug Info -->
            <div class="mt-4 p-3 bg-gray-50 border rounded-lg text-xs">
              <h4 class="font-medium text-gray-900 mb-1">Debug Info</h4>
              <div id="debug-info" class="text-gray-700 space-y-0.5">
                <p>Component: Loaded</p>
                <p>Click Handler: Ready</p>
                <p>Camera: Not Started</p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Camera state
      let isActive = false;
      let stream: MediaStream | null = null;
      let animationFrame: number | null = null;

      // Get elements
      const startBtn = container.querySelector(
        "#start-camera-btn",
      ) as HTMLButtonElement;
      const stopBtn = container.querySelector(
        "#stop-camera-btn",
      ) as HTMLButtonElement;
      const loadingDiv = container.querySelector(
        "#loading-indicator",
      ) as HTMLDivElement;
      const errorDiv = container.querySelector(
        "#error-message",
      ) as HTMLDivElement;
      const errorText = container.querySelector(
        "#error-text",
      ) as HTMLParagraphElement;
      const successDiv = container.querySelector(
        "#success-message",
      ) as HTMLDivElement;
      const video = container.querySelector(
        "#camera-video",
      ) as HTMLVideoElement;
      const canvas = container.querySelector(
        "#camera-canvas",
      ) as HTMLCanvasElement;
      const placeholder = container.querySelector(
        "#camera-placeholder",
      ) as HTMLDivElement;
      const debugInfo = container.querySelector(
        "#debug-info",
      ) as HTMLDivElement;

      // Update debug info
      const updateDebugInfo = (status: string) => {
        debugInfo.innerHTML = `
          <p>Component: Loaded</p>
          <p>Click Handler: Active</p>
          <p>Camera: ${status}</p>
          <p>Stream: ${stream ? "Active" : "None"}</p>
          <p>Video Playing: ${video?.readyState === 4 ? "Yes" : "No"}</p>
          <p>Canvas: ${canvas ? "Ready" : "Not Ready"}</p>
        `;
      };

      // Function to apply vision correction filters to camera elements
      const applyVisionCorrection = () => {
        const filterValue = `blur(${blurAmount}px) contrast(1.15) brightness(1.05)`;
        console.log(
          `🎯 WorkingCameraDemo: Applying vision correction filter: ${filterValue}`,
        );

        // Apply filter to video element
        if (video) {
          video.style.filter = filterValue;
          console.log("✅ WorkingCameraDemo: Filter applied to video element");
        }

        // Apply filter to canvas element
        if (canvas) {
          canvas.style.filter = filterValue;
          console.log("✅ WorkingCameraDemo: Filter applied to canvas element");
        }
      };

      // Set global reference for external updates
      applyVisionCorrectionRef = applyVisionCorrection;

      // Start camera function
      const startCamera = async () => {
        console.log(
          "🚀 WorkingCameraDemo: startCamera() called - DIRECT EXECUTION!",
        );
        updateDebugInfo("Starting...");

        // Show loading
        startBtn.classList.add("hidden");
        loadingDiv.classList.remove("hidden");
        errorDiv.classList.add("hidden");

        try {
          console.log("🔍 WorkingCameraDemo: Checking getUserMedia support...");

          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Camera not supported in this browser");
          }

          console.log("✅ WorkingCameraDemo: getUserMedia supported");
          console.log("🎥 WorkingCameraDemo: Requesting camera stream...");

          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            },
            audio: false,
          });

          console.log("✅ WorkingCameraDemo: Camera stream obtained!", stream);
          console.log(
            "📹 WorkingCameraDemo: Stream tracks:",
            stream.getTracks(),
          );

          // Set up video
          video.srcObject = stream;

          video.onloadedmetadata = () => {
            console.log("✅ WorkingCameraDemo: Video metadata loaded");
            console.log(
              `📐 WorkingCameraDemo: Video dimensions: ${video.videoWidth}x${video.videoHeight}`,
            );

            video
              .play()
              .then(() => {
                console.log("✅ WorkingCameraDemo: Video playing!");

                // CRITICAL: Apply vision correction filters to camera elements
                applyVisionCorrection();

                // Update UI
                isActive = true;
                loadingDiv.classList.add("hidden");
                stopBtn.classList.remove("hidden");
                successDiv.classList.remove("hidden");
                placeholder.classList.add("hidden");
                canvas.classList.remove("hidden");

                updateDebugInfo("Active");
                startCanvasProcessing();
              })
              .catch((err) => {
                console.error("❌ WorkingCameraDemo: Video play error:", err);
                showError("Failed to play video");
                updateDebugInfo("Play Error");
              });
          };
        } catch (err) {
          console.error("❌ WorkingCameraDemo: Camera error:", err);
          showError(
            err instanceof Error ? err.message : "Camera access failed",
          );
          updateDebugInfo("Error");
        }
      };

      // Stop camera function
      const stopCamera = () => {
        console.log("🛑 WorkingCameraDemo: stopCamera() called!");

        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop();
            console.log("🛑 WorkingCameraDemo: Stopped track:", track.kind);
          });
          stream = null;
        }

        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        video.srcObject = null;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Update UI
        isActive = false;
        stopBtn.classList.add("hidden");
        startBtn.classList.remove("hidden");
        successDiv.classList.add("hidden");
        canvas.classList.add("hidden");
        placeholder.classList.remove("hidden");

        updateDebugInfo("Stopped");
        console.log("✅ WorkingCameraDemo: Camera stopped");
      };

      // Show error function
      const showError = (message: string) => {
        errorText.textContent = message;
        errorDiv.classList.remove("hidden");
        loadingDiv.classList.add("hidden");
        startBtn.classList.remove("hidden");
      };

      // Canvas processing
      const startCanvasProcessing = () => {
        console.log("🎨 WorkingCameraDemo: Starting canvas processing...");
        console.log(
          `🔍 WorkingCameraDemo: Vision correction settings - Reading: ${readingVisionDiopter}D, Calibration: ${calibrationValue}D, Blur: ${blurAmount}px`,
        );

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("❌ WorkingCameraDemo: No canvas context");
          return;
        }

        const processFrame = () => {
          if (!isActive || !stream) return;

          if (video.readyState >= video.HAVE_CURRENT_DATA) {
            // Resize canvas to match video
            if (
              canvas.width !== video.videoWidth ||
              canvas.height !== video.videoHeight
            ) {
              canvas.width = video.videoWidth || 640;
              canvas.height = video.videoHeight || 480;
              console.log(
                `📐 WorkingCameraDemo: Canvas resized to ${canvas.width}x${canvas.height}`,
              );
            }

            // Clear canvas first
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw video frame (CSS filter is applied to entire canvas element)
            ctx.filter = "none";
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Draw overlay info showing current correction (overlay should NOT be blurred)
            const overlayCanvas = document.createElement("canvas");
            overlayCanvas.width = canvas.width;
            overlayCanvas.height = canvas.height;
            const overlayCtx = overlayCanvas.getContext("2d");

            if (overlayCtx) {
              overlayCtx.fillStyle =
                blurAmount > 0.1
                  ? "rgba(255, 0, 0, 0.9)"
                  : "rgba(0, 255, 0, 0.9)";
              overlayCtx.fillRect(10, 10, 280, 50);
              overlayCtx.fillStyle = "white";
              overlayCtx.font = "14px Arial";
              overlayCtx.fillText(
                `Vision Correction: ${blurAmount.toFixed(2)}px blur`,
                20,
                30,
              );
              overlayCtx.fillText(
                `Reading: ${readingVisionDiopter}D | Calibration: ${calibrationValue}D`,
                20,
                50,
              );

              // Draw overlay on main canvas (this will be affected by CSS filter)
              ctx.drawImage(overlayCanvas, 0, 0);
            }
          }

          animationFrame = requestAnimationFrame(processFrame);
        };

        processFrame();
      };

      // Attach event listeners with direct console logging
      startBtn.addEventListener("click", () => {
        console.log(
          "🖱️ WorkingCameraDemo: START BUTTON CLICKED - DIRECT EVENT!",
        );
        startCamera();
      });

      stopBtn.addEventListener("click", () => {
        console.log(
          "🖱️ WorkingCameraDemo: STOP BUTTON CLICKED - DIRECT EVENT!",
        );
        stopCamera();
      });

      console.log(
        "✅ WorkingCameraDemo: Event listeners attached successfully",
      );
      updateDebugInfo("Ready");
    };

    // Create the interface
    createCameraInterface();

    // Cleanup function
    return () => {
      console.log("🧹 WorkingCameraDemo: Component unmounting, cleaning up...");
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []); // Only run once on mount to create camera interface

  // CRITICAL: useEffect to update blur when props change (slider movement)
  useEffect(() => {
    const newBaseBlurAmount =
      Math.abs(readingVisionDiopter - calibrationValue) * 0.5;
    const newAdjustedBlurAmount = newBaseBlurAmount * mobileBlurMultiplier;
    console.log(
      `🔄 WorkingCameraDemo: Props changed! Reading: ${readingVisionDiopter}D, Calibration: ${calibrationValue}D`,
    );
    console.log(
      `🔄 WorkingCameraDemo: New blur: ${newBaseBlurAmount.toFixed(2)}px (base) → ${newAdjustedBlurAmount.toFixed(2)}px (mobile-adjusted)`,
    );

    // Apply new blur to existing camera elements if they exist
    if (containerRef.current) {
      const video = containerRef.current.querySelector(
        "#camera-video",
      ) as HTMLVideoElement;
      const canvas = containerRef.current.querySelector(
        "#camera-canvas",
      ) as HTMLCanvasElement;

      if (video && canvas) {
        const filterValue = `blur(${newAdjustedBlurAmount}px) contrast(1.15) brightness(1.05)`;
        video.style.filter = filterValue;
        canvas.style.filter = filterValue;
        console.log(`✅ WorkingCameraDemo: Updated filters to: ${filterValue}`);
        console.log(
          `📹 WorkingCameraDemo: Video filter applied: ${video.style.filter}`,
        );
        console.log(
          `🎨 WorkingCameraDemo: Canvas filter applied: ${canvas.style.filter}`,
        );
      } else {
        console.log(
          `❌ WorkingCameraDemo: Camera elements not found - video: ${!!video}, canvas: ${!!canvas}`,
        );
      }
    } else {
      console.log(`❌ WorkingCameraDemo: Container not found`);
    }
  }, [readingVisionDiopter, calibrationValue, mobileBlurMultiplier]);

  return <div ref={containerRef} />;
};

export default WorkingCameraDemo;
