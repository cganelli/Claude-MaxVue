/**
 * CanvasAnalysisOverlay - Visual debugging overlay for Canvas analysis results
 */

import React, { useEffect, useRef } from 'react';
import type { AnalysisResult } from '../utils/canvas/types';

// SYSTEMATIC DEBUGGING: Verify exports are available
console.log('🎨 CanvasAnalysisOverlay module loaded');

interface CanvasAnalysisOverlayProps {
  analysisResult: AnalysisResult | null;
  targetElement: HTMLElement | null;
  enabled: boolean;
  className?: string;
}

export const CanvasAnalysisOverlay: React.FC<CanvasAnalysisOverlayProps> = ({
  analysisResult,
  targetElement,
  enabled,
  className = ''
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // SYSTEMATIC DEBUGGING: Component mount logging
  useEffect(() => {
    console.log('🎨 CanvasAnalysisOverlay: MOUNTED');
    return () => {
      console.log('🎨 CanvasAnalysisOverlay: UNMOUNTED');
    };
  }, []);

  // SYSTEMATIC DEBUGGING: Component mount/render logging
  console.log('🎨 CanvasAnalysisOverlay: Rendering with props:', {
    analysisResult: analysisResult ? 'Present' : 'null',
    targetElement: targetElement ? 'Present' : 'null',
    enabled,
    className,
    textRegionsCount: analysisResult?.textRegions?.length || 0
  });

  useEffect(() => {
    console.log('🎨 CanvasAnalysisOverlay: Mounted/Updated');
    
    if (!enabled || !analysisResult || !targetElement || !overlayRef.current) {
      console.log('🎨 CanvasAnalysisOverlay: Early return:', {
        enabled,
        analysisResult: !!analysisResult,
        targetElement: !!targetElement,
        overlayRef: !!overlayRef.current
      });
      return;
    }

    const overlay = overlayRef.current;
    const targetRect = targetElement.getBoundingClientRect();

    // Position overlay to match target element
    overlay.style.position = 'absolute';
    overlay.style.left = `${targetRect.left + window.scrollX}px`;
    overlay.style.top = `${targetRect.top + window.scrollY}px`;
    overlay.style.width = `${targetRect.width}px`;
    overlay.style.height = `${targetRect.height}px`;
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';

    // Clear previous overlays
    overlay.innerHTML = '';

    // Add text region overlays
    analysisResult.textRegions.forEach((region, index) => {
      const regionDiv = document.createElement('div');
      regionDiv.style.position = 'absolute';
      regionDiv.style.left = `${region.bounds.x}px`;
      regionDiv.style.top = `${region.bounds.y}px`;
      regionDiv.style.width = `${region.bounds.width}px`;
      regionDiv.style.height = `${region.bounds.height}px`;
      regionDiv.style.border = `2px solid ${getConfidenceColor(region.confidence)}`;
      regionDiv.style.backgroundColor = `${getConfidenceColor(region.confidence)}20`;
      regionDiv.style.pointerEvents = 'none';
      
      // Add confidence label
      const label = document.createElement('div');
      label.textContent = `${Math.round(region.confidence * 100)}%`;
      label.style.position = 'absolute';
      label.style.top = '-20px';
      label.style.left = '0px';
      label.style.fontSize = '10px';
      label.style.fontWeight = 'bold';
      label.style.color = getConfidenceColor(region.confidence);
      label.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      label.style.padding = '1px 4px';
      label.style.borderRadius = '2px';
      regionDiv.appendChild(label);
      
      overlay.appendChild(regionDiv);
    });

    // Add low contrast areas
    analysisResult.contrastMap.lowContrastAreas.forEach((area) => {
      const areaDiv = document.createElement('div');
      areaDiv.style.position = 'absolute';
      areaDiv.style.left = `${area.x}px`;
      areaDiv.style.top = `${area.y}px`;
      areaDiv.style.width = `${area.width}px`;
      areaDiv.style.height = `${area.height}px`;
      areaDiv.style.border = '1px dashed orange';
      areaDiv.style.backgroundColor = 'rgba(255, 165, 0, 0.1)';
      areaDiv.style.pointerEvents = 'none';
      
      overlay.appendChild(areaDiv);
    });

    // Cleanup function
    return () => {
      if (overlay) {
        overlay.innerHTML = '';
      }
    };
  }, [analysisResult, targetElement, enabled]);

  if (!enabled) {
    console.log('🎨 CanvasAnalysisOverlay: Not enabled, returning null');
    return null;
  }

  console.log('🎨 CanvasAnalysisOverlay: Rendering overlay element');

  return (
    <div
      ref={overlayRef}
      className={`canvas-analysis-overlay ${className}`}
      style={{ position: 'absolute', pointerEvents: 'none' }}
    />
  );
};

function getConfidenceColor(confidence: number): string {
  if (confidence > 0.8) return '#22c55e'; // green
  if (confidence > 0.6) return '#eab308'; // yellow
  return '#ef4444'; // red
}

// Debug panel component
interface CanvasAnalysisDebugPanelProps {
  analysisResult: AnalysisResult | null;
  enabled: boolean;
  onToggle: () => void;
}

export const CanvasAnalysisDebugPanel: React.FC<CanvasAnalysisDebugPanelProps> = ({
  analysisResult,
  enabled,
  onToggle
}) => {
  // SYSTEMATIC DEBUGGING: Component mount logging
  useEffect(() => {
    console.log('📊 CanvasAnalysisDebugPanel: MOUNTED');
    return () => {
      console.log('📊 CanvasAnalysisDebugPanel: UNMOUNTED');
    };
  }, []);

  // SYSTEMATIC DEBUGGING: Component mount/render logging
  console.log('📊 CanvasAnalysisDebugPanel: Rendering with props:', {
    analysisResult: analysisResult ? 'Present' : 'null',
    enabled,
    onToggle: !!onToggle,
    textRegionsCount: analysisResult?.textRegions?.length || 0,
    processingTime: analysisResult?.processingTime || 'N/A',
    contentType: analysisResult?.contentType || 'N/A'
  });

  useEffect(() => {
    console.log('📊 CanvasAnalysisDebugPanel: Mounted/Updated');
  }, [analysisResult, enabled]);

  if (!analysisResult) {
    console.log('📊 CanvasAnalysisDebugPanel: No analysis result, showing placeholder');
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Canvas Analysis</h4>
          <button
            onClick={onToggle}
            disabled
            className="px-3 py-1 text-sm bg-gray-200 text-gray-500 rounded cursor-not-allowed"
          >
            No Analysis
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Canvas analysis is not available for this content.
        </p>
      </div>
    );
  }

  console.log('📊 CanvasAnalysisDebugPanel: Rendering main debug panel');

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">Canvas Analysis Debug</h4>
        <button
          onClick={onToggle}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            enabled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {enabled ? 'Hide Overlay' : 'Show Overlay'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-gray-600">Processing Time</div>
          <div className="font-bold text-blue-600">
            {analysisResult.processingTime.toFixed(1)}ms
          </div>
        </div>
        <div>
          <div className="text-gray-600">Text Regions</div>
          <div className="font-bold text-green-600">
            {analysisResult.textRegions.length}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Content Type</div>
          <div className="font-bold text-purple-600 capitalize">
            {analysisResult.contentType}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Avg Contrast</div>
          <div className="font-bold text-orange-600">
            {(analysisResult.contrastMap.meanContrast * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {enabled && (
        <div className="mt-3 text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 border border-green-600 mr-1"></div>
              High Confidence (&gt;80%)
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 border border-yellow-600 mr-1"></div>
              Medium Confidence (60-80%)
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 border border-red-600 mr-1"></div>
              Low Confidence (&lt;60%)
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 border border-orange-500 border-dashed mr-1"></div>
              Low Contrast Areas
            </div>
          </div>
        </div>
      )}

      {analysisResult.textRegions.length > 0 && (
        <div className="mt-3">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Text Regions Detail</h5>
          <div className="max-h-32 overflow-y-auto text-xs">
            {analysisResult.textRegions.slice(0, 5).map((region, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                <span>Region {index + 1}:</span>
                <span>
                  {region.bounds.width}×{region.bounds.height} 
                  ({Math.round(region.confidence * 100)}% conf)
                </span>
              </div>
            ))}
            {analysisResult.textRegions.length > 5 && (
              <div className="text-gray-500 py-1">
                ... and {analysisResult.textRegions.length - 5} more regions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};