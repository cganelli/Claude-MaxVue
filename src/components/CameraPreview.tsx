import React, { useRef, useEffect, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import VisionCorrectedContent from "./VisionCorrectedContent";

interface CameraPreviewProps {
  className?: string;
  onCapture?: (imageData: string) => void;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({
  className = "",
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
          setError(null);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access denied or not available");
        setIsActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    onCapture?.(imageData);
  };

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-2xl p-8 text-center ${className}`}>
        <CameraOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-black rounded-2xl overflow-hidden ${className}`}
    >
      {/* Vision Corrected Camera Feed */}
      <VisionCorrectedContent>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </VisionCorrectedContent>

      {/* Camera Controls */}
      {isActive && onCapture && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Camera className="h-8 w-8 text-gray-700" />
          </button>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraPreview;
