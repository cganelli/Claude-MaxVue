import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, CameraOff, AlertCircle, CheckCircle } from "lucide-react";

interface CameraDemoProps {
  readingVisionDiopter: number;
  calibrationValue: number;
}

const CameraDemo: React.FC<CameraDemoProps> = ({
  readingVisionDiopter,
  calibrationValue,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const processingRef = useRef<boolean>(false);

  const [cameraState, setCameraState] = useState<
    "idle" | "requesting" | "active" | "denied" | "error"
  >("idle");
  const [cameraError, setCameraError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Calculate vision correction blur using the specified algorithm
  const calculateCameraBlur = (
    sliderValue: number,
    calibration: number,
  ): number => {
    const distanceFromOptimal = Math.abs(sliderValue - calibration);
    // Using the specified blur calculation: Math.abs(readingVision - calibration) * 0.3
    return distanceFromOptimal * 0.3;
  };

  const cameraBlur = calculateCameraBlur(
    readingVisionDiopter,
    calibrationValue,
  );

  const startVisionProcessing = useCallback(() => {
    console.log("🔄 CameraDemo: Starting vision processing...");
    
    if (!videoRef.current || !canvasRef.current) {
      console.error("❌ CameraDemo: Video or canvas ref not available");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("❌ CameraDemo: Canvas context not available");
      return;
    }

    // Set processing flag
    processingRef.current = true;

    const processFrame = () => {
      // Check if we should continue processing
      if (!processingRef.current || !isProcessing) {
        console.log("⏹️ CameraDemo: Processing stopped");
        return;
      }

      try {
        if (video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
          // Set canvas dimensions to match video (only if different)
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            console.log(`📐 CameraDemo: Canvas resized to ${canvas.width}x${canvas.height}`);
          }

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Apply vision correction filter
          if (cameraBlur > 0) {
            ctx.filter = `blur(${cameraBlur.toFixed(2)}px) contrast(1.15)`;
          } else {
            ctx.filter = "contrast(1.15)";
          }

          // Draw video frame with vision correction
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Reset filter for UI elements
          ctx.filter = "none";

          // Add vision correction indicator
          const indicatorHeight = 50;
          const indicatorWidth = 250;
          const margin = 20;

          if (cameraBlur <= 0.1) {
            // Clear vision indicator
            ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
            ctx.fillRect(margin, margin, indicatorWidth, indicatorHeight);
            ctx.fillStyle = "white";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "left";
            ctx.fillText("✓ Clear Vision", margin + 10, margin + 30);
          } else {
            // Blur indicator
            ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
            ctx.fillRect(margin, margin, indicatorWidth, indicatorHeight);
            ctx.fillStyle = "white";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "left";
            ctx.fillText(`Vision Blur: ${cameraBlur.toFixed(2)}px`, margin + 10, margin + 30);
          }

          // Add settings info
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(margin, canvas.height - 60, 300, 40);
          ctx.fillStyle = "white";
          ctx.font = "12px Arial";
          ctx.textAlign = "left";
          ctx.fillText(
            `Reading: +${readingVisionDiopter.toFixed(2)}D | Calibration: +${calibrationValue.toFixed(2)}D`,
            margin + 10,
            canvas.height - 35
          );
        }
      } catch (error) {
        console.error("❌ CameraDemo: Frame processing error:", error);
      }

      // Schedule next frame
      if (processingRef.current && isProcessing) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
      }
    };

    // Start processing
    processFrame();
  }, [cameraBlur, readingVisionDiopter, calibrationValue, isProcessing]);

  const requestCameraAccess = async () => {
    console.log("🎥 CameraDemo: Requesting camera access...");
    setCameraState("requesting");
    setCameraError("");

    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Camera access not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.",
        );
      }

      // Check if we're on HTTPS (required for camera access in production)
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        throw new Error(
          "Camera access requires HTTPS. Please ensure the site is loaded over a secure connection.",
        );
      }

      const primaryConstraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30 },
        },
        audio: false,
      };

      const fallbackConstraints: MediaStreamConstraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      // Add timeout to prevent hanging
      const timeout = 10000; // 10 seconds
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                "Camera access timeout. Please check camera permissions and try again.",
              ),
            ),
          timeout,
        ),
      );

      let stream: MediaStream;

      try {
        console.log("🎥 CameraDemo: Trying primary constraints...");
        // Try primary constraints with timeout
        stream = await Promise.race([
          navigator.mediaDevices.getUserMedia(primaryConstraints),
          timeoutPromise,
        ]);
        console.log("✅ CameraDemo: Primary constraints successful");
      } catch (error) {
        console.warn("⚠️ CameraDemo: Primary constraints failed, trying fallback...");
        // Handle specific errors and try fallback
        if (
          error instanceof DOMException &&
          error.name === "OverconstrainedError"
        ) {
          stream = await Promise.race([
            navigator.mediaDevices.getUserMedia(fallbackConstraints),
            timeoutPromise,
          ]);
          console.log("✅ CameraDemo: Fallback constraints successful");
        } else {
          throw error;
        }
      }

      // Store the stream reference
      streamRef.current = stream;
      console.log("📹 CameraDemo: Stream acquired, setting up video element...");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Set video properties for better compatibility
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;

        // Use simpler approach - wait for video to be playing
        console.log("📹 CameraDemo: Waiting for video to start playing...");
        
        // Try to play the video
        try {
          await videoRef.current.play();
          console.log("✅ CameraDemo: Video is playing");
          
          // Give video a moment to stabilize
          setTimeout(() => {
            if (videoRef.current && videoRef.current.readyState >= videoRef.current.HAVE_CURRENT_DATA) {
              console.log("✅ CameraDemo: Video ready, transitioning to active state");
              setCameraState("active");
              setIsProcessing(true);
              // Start processing will be triggered by useEffect
            } else {
              console.error("❌ CameraDemo: Video not ready after play");
              throw new Error("Video failed to initialize properly");
            }
          }, 100);
          
        } catch (playError) {
          console.error("❌ CameraDemo: Failed to play video:", playError);
          throw new Error("Failed to start video playback");
        }
      } else {
        throw new Error("Video element not found");
      }
    } catch (error) {
      console.error("❌ CameraDemo: Camera access error:", error);

      // Provide helpful error messages
      let errorMessage = "Camera access failed";
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage =
              "Camera permission denied. Click the camera icon in your browser's address bar to allow access.";
            setCameraState("denied");
            break;
          case "NotFoundError":
            errorMessage =
              "No camera found. Please connect a camera and refresh the page.";
            setCameraState("error");
            break;
          case "NotReadableError":
            errorMessage =
              "Camera is busy. Please close other applications using the camera and try again.";
            setCameraState("error");
            break;
          case "SecurityError":
            errorMessage =
              "Camera access blocked by security settings. Please use HTTPS or localhost.";
            setCameraState("error");
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
            setCameraState("error");
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        setCameraState("error");
      }
      
      console.error('❌ CameraDemo: Full error details:', {
        error,
        name: error instanceof DOMException ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      setCameraError(errorMessage);
    }
  };

  const stopCamera = () => {
    console.log("🛑 CameraDemo: Stopping camera...");
    
    // Stop the processing loop
    setIsProcessing(false);
    processingRef.current = false;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("🛑 CameraDemo: Stopped track:", track.kind);
      });
      streamRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    setCameraState("idle");
    console.log("✅ CameraDemo: Camera stopped successfully");
  };

  // Update vision processing when camera becomes active
  useEffect(() => {
    if (cameraState === "active" && isProcessing) {
      console.log(`🔄 CameraDemo: Camera active, starting vision processing...`);
      startVisionProcessing();
    }
  }, [cameraState, isProcessing, startVisionProcessing]);

  // Update vision processing when blur changes
  useEffect(() => {
    if (cameraState === "active" && isProcessing) {
      console.log(`🔄 CameraDemo: Vision settings updated - blur: ${cameraBlur.toFixed(2)}px`);
      // No need to restart processing, it will pick up the new blur value
    }
  }, [cameraBlur, cameraState, isProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 CameraDemo: Component unmounting, cleaning up...");
      stopCamera();
    };
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">
        Camera Vision Correction Test
      </h3>

      <div className="bg-white rounded-lg shadow-md border p-6">
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Test your vision correction with live camera feed. The camera stream
            will apply the same vision correction algorithm as other content,
            allowing you to see if your prescription makes your own reflection
            appear clear.
          </p>
        </div>

        {/* Camera Controls */}
        <div className="mb-4 flex items-center space-x-4">
          {cameraState === "idle" && (
            <button
              onClick={requestCameraAccess}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          )}

          {cameraState === "requesting" && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Requesting camera access...</span>
            </div>
          )}

          {cameraState === "active" && (
            <button
              onClick={stopCamera}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>

        {/* Camera Status */}
        {(cameraState === "denied" || cameraState === "error") && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">
                  {cameraState === "denied"
                    ? "Camera Access Denied"
                    : "Camera Error"}
                </p>
                <p className="text-sm mt-1">{cameraError}</p>
                <div className="text-sm mt-2 space-y-1">
                  <p>Troubleshooting tips:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Check if another application is using your camera</li>
                    <li>Refresh the page and try again</li>
                    <li>Make sure you're using HTTPS or localhost</li>
                    <li>Check browser permissions for camera access</li>
                  </ul>
                </div>
                <button
                  onClick={requestCameraAccess}
                  className="mt-3 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {cameraState === "active" && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Camera Active</p>
                <p className="text-sm">
                  Vision correction:{" "}
                  {cameraBlur <= 0.1
                    ? "Clear"
                    : `${cameraBlur.toFixed(2)}px blur`}
                </p>
                <p className="text-sm">
                  Processing: {isProcessing ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vision Correction Info */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Current Vision Settings
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Reading Vision: +{readingVisionDiopter.toFixed(2)}D</p>
            <p>Your Calibration: +{calibrationValue.toFixed(2)}D</p>
            <p>
              Distance from optimal:{" "}
              {Math.abs(readingVisionDiopter - calibrationValue).toFixed(2)}D
            </p>
            <p>Applied blur: {cameraBlur.toFixed(2)}px</p>
          </div>
        </div>

        {/* Camera Feed */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          {cameraState === "active" || cameraState === "requesting" ? (
            <>
              {/* Hidden video element for processing */}
              <video 
                ref={videoRef} 
                className="hidden" 
                playsInline 
                muted 
                autoPlay
              />

              {/* Processed canvas output */}
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-96 object-cover bg-black"
                style={{ display: "block", minHeight: "240px" }}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Camera not active</p>
                <p className="text-sm">
                  Click "Start Camera" to begin vision testing
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (cameraState === "active" || cameraState === "requesting") && (
          <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Debug Info</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Camera State: {cameraState}</p>
              <p>Processing: {isProcessing ? "Yes" : "No"}</p>
              <p>Stream Active: {streamRef.current ? "Yes" : "No"}</p>
              <p>Video Element: {videoRef.current ? "Ready" : "Not Ready"}</p>
              <p>Canvas Element: {canvasRef.current ? "Ready" : "Not Ready"}</p>
              <p>
                Video Dimensions: {videoRef.current?.videoWidth || 0} x {videoRef.current?.videoHeight || 0}
              </p>
              <p>
                Video Ready State: {videoRef.current?.readyState || 0} (need ≥ 2)
              </p>
              <p>
                Canvas Dimensions: {canvasRef.current?.width || 0} x {canvasRef.current?.height || 0}
              </p>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        {cameraState === "active" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">How to Test:</h4>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Look at your reflection in the camera feed</li>
              <li>2. Adjust the Reading Vision slider above</li>
              <li>3. Find the setting where you appear clearest</li>
              <li>
                4. This should match your calibrated prescription (+
                {calibrationValue.toFixed(2)}D)
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraDemo;