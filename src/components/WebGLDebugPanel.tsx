// WebGLDebugPanel.tsx
// Purpose: Inline expandable debug panel for WebGL acceleration in MaxVue
// Location: /components/WebGLDebugPanel.tsx
// Shows context info, shader status, real-time metrics, and visual comparison

import React, { useState } from 'react';
import type { WebGLContextInfo } from '../utils/WebGLRenderer';

interface WebGLDebugPanelProps {
  webglPerformance?: {
    fps: number;
    processingTime: number;
    memoryUsage: number;
    batteryImpact: number;
    fallbackTriggered: boolean;
  } | null;
  getWebGLContextInfo?: () => WebGLContextInfo;
  processElementWithWebGL?: (element: HTMLElement) => Promise<any>;
}

const WebGLDebugPanel: React.FC<WebGLDebugPanelProps> = ({ webglPerformance, getWebGLContextInfo, processElementWithWebGL }) => {
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);

  const contextInfo = getWebGLContextInfo ? getWebGLContextInfo() : {
    vendor: 'Unavailable',
    renderer: 'Unavailable',
    version: 'Unavailable',
    extensions: [],
  };

  const handleTestWebGL = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setBeforeUrl(null);
    setAfterUrl(null);
    try {
      // Create a small test image (solid color)
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(0, 0, 128, 64);
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('WebGL Test', 10, 40);
      }
      setBeforeUrl(canvas.toDataURL());
      if (processElementWithWebGL) {
        const result = await processElementWithWebGL(canvas);
        if (result && result.outputCanvas) {
          setAfterUrl(result.outputCanvas.toDataURL());
        }
        setSuccess(true);
      } else {
        setError('WebGL processing function not available.');
      }
    } catch (e: any) {
      setError(e.message || 'WebGL processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-lg p-4 shadow w-full max-w-xl">
      <h3 className="font-bold text-lg mb-2">WebGL Debug Panel</h3>
      <div className="mb-2">
        <span className="font-semibold">Context Info:</span>
        <ul className="ml-4 text-sm">
          <li>Vendor: {contextInfo.vendor}</li>
          <li>Renderer: {contextInfo.renderer}</li>
          <li>Version: {contextInfo.version}</li>
          <li>Extensions: {contextInfo.extensions.length > 0 ? contextInfo.extensions.join(', ') : 'Unavailable'}</li>
        </ul>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Performance Metrics:</span>
        {webglPerformance ? (
          <ul className="ml-4 text-sm">
            <li>FPS: {webglPerformance.fps}</li>
            <li>Frame Time: {webglPerformance.processingTime} ms</li>
            <li>Memory Usage: {webglPerformance.memoryUsage} MB</li>
            <li>Battery Impact: {webglPerformance.batteryImpact}</li>
            <li>Fallback Triggered: {webglPerformance.fallbackTriggered ? 'Yes' : 'No'}</li>
          </ul>
        ) : (
          <span className="ml-4 text-sm">No performance data yet.</span>
        )}
      </div>
      <button
        className="btn btn-primary btn-sm mb-2"
        onClick={handleTestWebGL}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Test WebGL Processing'}
      </button>
      {error && <div className="text-error mt-2">{error}</div>}
      {success && (
        <div className="mt-2">
          <div className="text-success">WebGL processing succeeded!</div>
          <div className="flex gap-4 mt-2">
            {beforeUrl && (
              <div>
                <div className="text-xs text-center">Before</div>
                <img src={beforeUrl} alt="Before" className="border rounded" />
              </div>
            )}
            {afterUrl && (
              <div>
                <div className="text-xs text-center">After</div>
                <img src={afterUrl} alt="After" className="border rounded" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebGLDebugPanel; 