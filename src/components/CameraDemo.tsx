import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraOff, AlertCircle, CheckCircle } from "lucide-react";

interface CameraDemoProps {
  readingVisionDiopter: number;
  calibrationValue: number;
}

const CameraDemo: React.FC<CameraDemoProps> = ({
  readingVisionDiopter,
  calibrationValue,
}) => {
  console.log("🎥 CameraDemo: Component rendered with props:", { readingVisionDiopter, calibrationValue });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Calculate blur amount
  const blurAmount = Math.abs(readingVisionDiopter - calibrationValue) * 0.3;
  console.log(`📊 CameraDemo: Blur calculation: ${blurAmount.toFixed(2)}px`);

  // Simple camera start function
  const startCamera = async () => {
    console.log("🚀 CameraDemo: startCamera() called!");
    console.log("📍 CameraDemo: Current state - isActive:", isActive, "isLoading:", isLoading);
    
    setIsLoading(true);
    setError("");
    
    try {
      console.log("🔍 CameraDemo: Checking for getUserMedia support...");
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }
      
      console.log("✅ CameraDemo: getUserMedia is supported");
      console.log("🎥 CameraDemo: Requesting camera stream...");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });
      
      console.log("✅ CameraDemo: Got camera stream!", stream);
      console.log("📹 CameraDemo: Stream tracks:", stream.getTracks());
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log("🎬 CameraDemo: Setting video srcObject...");
        videoRef.current.srcObject = stream;
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          console.log("✅ CameraDemo: Video metadata loaded");
          console.log(`📐 CameraDemo: Video dimensions: ${videoRef.current!.videoWidth}x${videoRef.current!.videoHeight}`);
          
          videoRef.current!.play()
            .then(() => {
              console.log("✅ CameraDemo: Video playing!");
              setIsActive(true);
              setIsLoading(false);
              startCanvasProcessing();
            })
            .catch(err => {
              console.error("❌ CameraDemo: Video play error:", err);
              setError("Failed to play video");
              setIsLoading(false);
            });
        };
      }
    } catch (err) {
      console.error("❌ CameraDemo: Camera error:", err);
      setError(err instanceof Error ? err.message : "Camera access failed");
      setIsLoading(false);
    }
  };

  // Simple canvas processing
  const startCanvasProcessing = () => {
    console.log("🎨 CameraDemo: Starting canvas processing...");
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      console.error("❌ CameraDemo: Missing video or canvas element");
      return;
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("❌ CameraDemo: No canvas context");
      return;
    }
    
    const processFrame = () => {
      if (!video || !canvas) return;
      
      // Set canvas size to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        console.log(`📐 CameraDemo: Canvas resized to ${canvas.width}x${canvas.height}`);
      }
      
      // Apply blur filter
      ctx.filter = `blur(${blurAmount}px) contrast(1.15)`;
      
      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Draw UI overlay
      ctx.filter = "none";
      ctx.fillStyle = blurAmount > 0.1 ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 255, 0, 0.8)";
      ctx.fillRect(10, 10, 200, 40);
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`Blur: ${blurAmount.toFixed(2)}px`, 20, 35);
      
      // Continue processing
      animationFrameRef.current = requestAnimationFrame(processFrame);
    };
    
    processFrame();
  };

  // Stop camera
  const stopCamera = () => {
    console.log("🛑 CameraDemo: stopCamera() called!");
    
    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("🛑 CameraDemo: Stopped track:", track.kind);
      });
      streamRef.current = null;
    }
    
    // Stop animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clear video
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
    
    setIsActive(false);
    setIsLoading(false);
    console.log("✅ CameraDemo: Camera stopped");
  };

  // Cleanup on unmount
  useEffect(() => {
    console.log("🔄 CameraDemo: useEffect - component mounted");
    
    return () => {
      console.log("🧹 CameraDemo: useEffect - component unmounting, cleaning up...");
      if (streamRef.current) {
        stopCamera();
      }
    };
  }, []);

  // Update processing when blur changes
  useEffect(() => {
    console.log(`🔄 CameraDemo: Blur amount changed to ${blurAmount.toFixed(2)}px`);
  }, [blurAmount]);

  console.log("🖼️ CameraDemo: Rendering with state:", { isActive, isLoading, error });

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">
        Camera Vision Correction Test
      </h3>

      <div className="bg-white rounded-lg shadow-md border p-6">
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Test your vision correction with live camera feed.
          </p>
        </div>

        {/* Camera Controls */}
        <div className="mb-4">
          {!isActive && !isLoading && (
            <button
              onClick={() => {
                console.log("🖱️ CameraDemo: Start Camera button clicked!");
                startCamera();
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </button>
          )}

          {isLoading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Starting camera...</span>
            </div>
          )}

          {isActive && (
            <button
              onClick={() => {
                console.log("🖱️ CameraDemo: Stop Camera button clicked!");
                stopCamera();
              }}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Camera Error</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={() => {
                    console.log("🖱️ CameraDemo: Try Again button clicked!");
                    startCamera();
                  }}
                  className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Display */}
        {isActive && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Camera Active</p>
                <p className="text-sm">Blur: {blurAmount.toFixed(2)}px</p>
              </div>
            </div>
          </div>
        )}

        {/* Vision Settings */}
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Vision Settings</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Reading Vision: +{readingVisionDiopter.toFixed(2)}D</p>
            <p>Calibration: +{calibrationValue.toFixed(2)}D</p>
            <p>Blur Applied: {blurAmount.toFixed(2)}px</p>
          </div>
        </div>

        {/* Camera Display */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className={isActive ? "hidden" : "hidden"}
            playsInline
            muted
            autoPlay
          />
          
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-96 object-cover bg-black"
            style={{ 
              display: isActive || isLoading ? "block" : "none",
              minHeight: "240px"
            }}
          />
          
          {!isActive && !isLoading && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Camera not active</p>
                <p className="text-sm">Click "Start Camera" to begin</p>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-50 border rounded-lg text-xs">
          <h4 className="font-medium text-gray-900 mb-1">Debug Info</h4>
          <div className="text-gray-700 space-y-0.5">
            <p>Component Mounted: Yes</p>
            <p>Camera Active: {isActive ? "Yes" : "No"}</p>
            <p>Loading: {isLoading ? "Yes" : "No"}</p>
            <p>Stream: {streamRef.current ? "Active" : "None"}</p>
            <p>Video Ready: {videoRef.current?.readyState === 4 ? "Yes" : "No"}</p>
            <p>Canvas: {canvasRef.current ? "Ready" : "Not Ready"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDemo;