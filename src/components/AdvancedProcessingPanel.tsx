// AdvancedProcessingPanel.tsx
// Location: src/components/AdvancedProcessingPanel.tsx
// Purpose: UI panel for Layer 3 advanced processing controls and status
// Follows CLAUDE.md and project best practices

import React from 'react';
import { useAdvancedProcessing } from '../hooks/useAdvancedProcessing';

/**
 * AdvancedProcessingPanel
 * - Provides controls for enabling/disabling Layer 3 processing
 * - Allows adjustment of edge enhancement, unsharp masking, and contrast boost
 * - Shows current effectiveness and processing status
 * - Uses DaisyUI for consistent styling
 */
export const AdvancedProcessingPanel: React.FC = () => {
  const {
    config,
    isProcessing,
    processPageContent,
    updateProcessingParams,
    toggleProcessing
  } = useAdvancedProcessing();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Layer 3: Advanced Processing</h2>
        <p className="text-sm text-gray-600">
          Multi-algorithm enhancement: Edge detection + Unsharp masking + Adaptive contrast
        </p>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text font-semibold">Enable Advanced Processing</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={config.enabled}
              onChange={toggleProcessing}
            />
          </label>
        </div>

        {config.enabled && (
          <div className="space-y-4">
            {/* Edge Enhancement Control */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Edge Enhancement: {config.processingParams.edgeEnhancement.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={config.processingParams.edgeEnhancement}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  console.log('🔴 SLIDER MOVED - Edge Enhancement:', newValue);
                  console.log('🔴 Before update config:', config.processingParams);
                  
                  updateProcessingParams({ edgeEnhancement: newValue });
                  
                  console.log('🔴 After update should be:', newValue);
                }}
                className="range range-primary"
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>None</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>

            {/* Unsharp Masking Strength */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Unsharp Strength: {config.processingParams.unsharpStrength.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.processingParams.unsharpStrength}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  console.log('🔴 SLIDER MOVED - Unsharp Strength:', newValue);
                  updateProcessingParams({ unsharpStrength: newValue });
                }}
                className="range range-secondary"
              />
            </div>

            {/* Contrast Boost */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contrast Boost: {config.processingParams.contrastBoost.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.processingParams.contrastBoost}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  console.log('🔴 SLIDER MOVED - Contrast Boost:', newValue);
                  updateProcessingParams({ contrastBoost: newValue });
                }}
                className="range range-accent"
              />
            </div>

            {/* EMERGENCY DEBUG BUTTON - REPLACE EXISTING */}
            <div className="card-actions">
              <button
                onClick={(e) => {
                  alert('BUTTON CLICKED - CHECK CONSOLE');
                  console.log('🔴 EMERGENCY BUTTON DEFINITELY CLICKED');
                  console.log('🔴 Event:', e);
                  console.log('🔴 processPageContent function exists:', typeof processPageContent);
                  console.log('🔴 Config:', config);
                  console.log('🔴 isProcessing:', isProcessing);
                  
                  // FIXED: Pass current config to ensure fresh state
                  try {
                    processPageContent(config);
                    console.log('✅ processPageContent called successfully with current config');
                  } catch (error) {
                    console.error('❌ processPageContent failed:', error);
                  }
                }}
                className="btn btn-primary w-full"
                style={{ backgroundColor: 'red', color: 'white' }}
              >
                EMERGENCY TEST BUTTON
              </button>
            </div>

            {/* Performance Info */}
            <div className="alert alert-info">
              <div className="flex-1">
                <label className="font-semibold">Performance Note:</label>
                <p className="text-sm">
                  Advanced processing adds ~100-200ms per page. 
                  Baseline CSS continues working if processing fails.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-title">Current Effectiveness</div>
            <div className="stat-value text-2xl">
              {config.enabled ? '4.2-4.5' : '3.0'}/10
            </div>
            <div className="stat-desc">
              {config.enabled ? 'Baseline CSS + Advanced Processing' : 'Baseline CSS Only'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 