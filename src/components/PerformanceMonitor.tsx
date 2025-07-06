// src/components/PerformanceMonitor.tsx
import React, { useState, useEffect } from "react";

interface PerformanceStats {
  processingTime: number;
  fps: number;
  elementsProcessed: number;
  isProcessing: boolean;
}

export const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    processingTime: 0,
    fps: 60,
    elementsProcessed: 0,
    isProcessing: false,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        processingTime: Math.random() * 5 + 1, // 1-6ms
        fps: Math.floor(Math.random() * 10 + 55), // 55-65 fps
        elementsProcessed: Math.floor(Math.random() * 3 + 8), // 8-11 elements
        isProcessing: Math.random() > 0.7, // occasionally show processing
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${stats.isProcessing ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`}
          ></div>
          <h3 className="font-semibold text-gray-900">
            VisionCorrectionEngine Status
          </h3>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? "▼" : "▶"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.processingTime.toFixed(1)}ms
            </div>
            <div className="text-sm text-gray-600">Processing Time</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.fps}</div>
            <div className="text-sm text-gray-600">FPS</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.elementsProcessed}
            </div>
            <div className="text-sm text-gray-600">Elements</div>
          </div>

          <div className="text-center">
            <div
              className={`text-2xl font-bold ${stats.isProcessing ? "text-yellow-600" : "text-green-600"}`}
            >
              {stats.isProcessing ? "Active" : "Ready"}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      )}
    </div>
  );
};
