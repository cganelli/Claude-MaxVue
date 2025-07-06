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

  const [cameraState, setCameraState] = useState<
    "idle" | "requesting" | "active" | "denied" | "error"
  >("idle");
  const [cameraError, setCameraError] = useState<string>("");

  // Calculate vision correction blur using same algorithm as other content
  const calculateCameraBlur = (
    sliderValue: number,
    calibration: number,
  ): number => {
    const distanceFromOptimal = Math.abs(sliderValue - calibration);
    const blurPerDiopter = 0.6;
    const minimumBlur = 0.05;
    return distanceFromOptimal === 0
      ? minimumBlur
      : distanceFromOptimal * blurPerDiopter;
  };

  const cameraBlur = calculateCameraBlur(
    readingVisionDiopter,
    calibrationValue,
  );

  const requestCameraAccess = async () => {
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
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      };

      const fallbackConstraints: MediaStreamConstraints = {
        video: { facingMode: "user" },
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
        // Try primary constraints with timeout
        stream = await Promise.race([
          navigator.mediaDevices.getUserMedia(primaryConstraints),
          timeoutPromise,
        ]);
      } catch (error) {
        // Handle specific errors and try fallback
        if (
          error instanceof DOMException &&
          error.name === "OverconstrainedError"
        ) {
          console.warn(
            "High resolution not supported, trying fallback constraints",
          );
          stream = await Promise.race([
            navigator.mediaDevices.getUserMedia(fallbackConstraints),
            timeoutPromise,
          ]);
        } else {
          throw error;
        }
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            ?.play()
            .then(() => {
              setCameraState("active");
              startVisionProcessing();
            })
            .catch((playError) => {
              console.error("Video play error:", playError);
              setCameraError("Failed to start video playback");
              setCameraState("error");
            });
        };
      }
    } catch (error) {
      console.error("Camera access error:", error);

      // Provide helpful error messages
      let errorMessage = "Camera access failed";
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage =
              "Camera permission denied. Click the camera icon in your browser's address bar to allow access.";
            break;
          case "NotFoundError":
            errorMessage =
              "No camera found. Please connect a camera and refresh the page.";
            break;
          case "NotReadableError":
            errorMessage =
              "Camera is busy. Please close other applications using the camera and try again.";
            break;
          case "SecurityError":
            errorMessage =
              "Camera access blocked by security settings. Please use HTTPS or localhost.";
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setCameraError(errorMessage);
      setCameraState("error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setCameraState("idle");
  };

  const startVisionProcessing = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Apply vision correction filter
        ctx.filter =
          cameraBlur > 0.05
            ? `blur(${cameraBlur.toFixed(2)}px) contrast(1.1) brightness(1.05)`
            : "contrast(1.1) brightness(1.05)";

        // Draw video frame with vision correction
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset filter for UI elements
        ctx.filter = "none";

        // Add vision correction indicator
        if (cameraBlur <= 0.1) {
          ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
          ctx.fillRect(20, 20, 200, 40);
          ctx.fillStyle = "white";
          ctx.font = "16px sans-serif";
          ctx.fillText("✓ Clear Vision", 30, 45);
        } else {
          ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
          ctx.fillRect(20, 20, 250, 40);
          ctx.fillStyle = "white";
          ctx.font = "16px sans-serif";
          ctx.fillText(`Blur: ${cameraBlur.toFixed(2)}px`, 30, 45);
        }
      }

      if (cameraState === "active") {
        animationFrameRef.current = requestAnimationFrame(processFrame);
      }
    };

    processFrame();
  }, [cameraBlur, cameraState]);

  // Update vision processing when blur changes
  useEffect(() => {
    if (cameraState === "active") {
      startVisionProcessing();
    }
  }, [cameraBlur, cameraState, startVisionProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
          {cameraState === "active" ? (
            <>
              {/* Hidden video element */}
              <video ref={videoRef} className="hidden" playsInline muted />

              {/* Processed canvas output */}
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-96 object-cover"
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
