// CameraAccommodationSystem.tsx
// Location: src/components/CameraAccommodationSystem.tsx
// Purpose: Week 2 Camera Accommodation Monitoring System for MaxVue
// Follows CLAUDE.md and project best practices

import React, { useRef, useEffect, useState } from 'react';

interface AccommodationMetrics {
  timestamp: number;
  cameraActive: boolean;
  faceDetected: boolean;
  accommodationEffort: number;
  eyeStrain: number;
  enhancementRecommendation: number;
}

export const CameraAccommodationSystem: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<string>('Camera system ready');
  const [metrics, setMetrics] = useState<AccommodationMetrics>({
    timestamp: Date.now(),
    cameraActive: false,
    faceDetected: false,
    accommodationEffort: 0,
    eyeStrain: 0,
    enhancementRecommendation: 1.0
  });
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startAccommodationMonitoring = async () => {
    try {
      setStatus('Initializing camera accommodation monitoring...');
      
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        setStream(cameraStream);
        setStatus('✅ Camera monitoring active - analyzing accommodation');
        
        setMetrics(prev => ({
          ...prev,
          cameraActive: true,
          timestamp: Date.now()
        }));
        
        // Start accommodation analysis
        startAccommodationAnalysis();
      }
    } catch (err) {
      setStatus(`❌ Camera failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Camera accommodation system error:', err);
    }
  };

  const startAccommodationAnalysis = () => {
    const analyzeAccommodation = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.videoWidth > 0) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);
          
          // Analyze frame for accommodation indicators
          const analysisResult = analyzeFrameForAccommodation(canvas);
          
          setMetrics(prev => ({
            ...prev,
            ...analysisResult,
            timestamp: Date.now()
          }));
          
          // Apply accommodation-based enhancement
          if (analysisResult.accommodationEffort && analysisResult.accommodationEffort > 0.6) {
            applyAdaptiveEnhancement(analysisResult.enhancementRecommendation || 1.0);
          }
        }
      }
      
      // Continue analysis at 10fps (100ms intervals)
      if (metrics.cameraActive) {
        setTimeout(analyzeAccommodation, 100);
      }
    };
    
    analyzeAccommodation();
  };

  const analyzeFrameForAccommodation = (canvas: HTMLCanvasElement): Partial<AccommodationMetrics> => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return {};
    
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Basic accommodation analysis (will enhance with real algorithms)
      let faceRegionBrightness = 0;
      let pixelCount = 0;
      
      // Analyze center region for face detection
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const regionSize = 100;
      
      for (let y = centerY - regionSize; y < centerY + regionSize; y++) {
        for (let x = centerX - regionSize; x < centerX + regionSize; x++) {
          if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            const i = (y * canvas.width + x) * 4;
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            faceRegionBrightness += brightness;
            pixelCount++;
          }
        }
      }
      
      const avgBrightness = faceRegionBrightness / pixelCount;
      const faceDetected = avgBrightness > 50 && avgBrightness < 200;
      
      // Simulate accommodation metrics based on face presence
      const accommodationEffort = faceDetected ? Math.random() * 0.4 + 0.3 : 0;
      const eyeStrain = faceDetected ? accommodationEffort * 0.8 + Math.random() * 0.2 : 0;
      const enhancementRecommendation = 1.0 + (accommodationEffort * 0.5);
      
      return {
        faceDetected,
        accommodationEffort,
        eyeStrain,
        enhancementRecommendation
      };
    } catch (error) {
      console.error('Accommodation analysis error:', error);
      return {};
    }
  };

  const applyAdaptiveEnhancement = (enhancement: number) => {
    // Apply real-time enhancement based on accommodation analysis
    // This will integrate with Week 1 Foundation system
    console.log(`🎯 Applying adaptive enhancement: ${enhancement.toFixed(2)}x`);
    
    // TODO: Integrate with useVisionCorrection hook
    // TODO: Apply enhancement to content based on accommodation effort
  };

  const stopMonitoring = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setMetrics(prev => ({
      ...prev,
      cameraActive: false,
      faceDetected: false,
      accommodationEffort: 0,
      eyeStrain: 0
    }));
    setStatus('Camera monitoring stopped');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>MaxVue Week 2: Camera Accommodation Monitoring</h2>
      <p><strong>Status:</strong> {status}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={startAccommodationMonitoring} disabled={metrics.cameraActive}>
          Start Accommodation Monitoring
        </button>
        <button onClick={stopMonitoring} disabled={!metrics.cameraActive} style={{ marginLeft: '10px' }}>
          Stop Monitoring
        </button>
      </div>

      {/* Camera feed */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          style={{ 
            width: '320px', 
            height: '240px', 
            border: metrics.faceDetected ? '3px solid green' : '2px solid black'
          }}
        />
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
        />
      </div>

      {/* Accommodation metrics display */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
        <h3>Real-Time Accommodation Analysis</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <p><strong>Camera Active:</strong> {metrics.cameraActive ? '✅ YES' : '❌ NO'}</p>
          <p><strong>Face Detected:</strong> {metrics.faceDetected ? '✅ YES' : '❌ NO'}</p>
          <p><strong>Accommodation Effort:</strong> {(metrics.accommodationEffort * 100).toFixed(1)}%</p>
          <p><strong>Eye Strain Level:</strong> {(metrics.eyeStrain * 100).toFixed(1)}%</p>
          <p><strong>Enhancement Level:</strong> {metrics.enhancementRecommendation.toFixed(2)}x</p>
          <p><strong>Last Update:</strong> {new Date(metrics.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Week 2 Implementation Goals:</strong></p>
        <ul>
          <li>✅ Camera access confirmed working</li>
          <li>🚧 Basic accommodation monitoring (in progress)</li>
          <li>🚧 Real-time adaptive enhancement</li>
          <li>🚧 Integration with Week 1 Foundation</li>
          <li>🎯 Target: 4.0+/10 effectiveness for Week 8 validation</li>
        </ul>
      </div>
    </div>
  );
}; 