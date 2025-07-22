// EnhancedCSSTestingPanel.tsx
// Location: src/components/EnhancedCSSTestingPanel.tsx
// Purpose: UI panel for systematic testing and rating of enhanced CSS filter configurations for presbyopia correction (Layer 1)
// Uses DaisyUI for styling. Integrates with EnhancedCSSProcessor from VisionCorrectionEngine.ts.
// This component is modular, documented, and ready for future expansion if needed.

import React, { useState } from 'react';
import { EnhancedCSSProcessor } from '../utils/VisionCorrectionEngine';

interface EnhancedCSSTestingPanelProps {
  targetElement?: HTMLElement;
}

/**
 * EnhancedCSSTestingPanel
 * - Allows systematic application and rating of enhanced CSS configurations for presbyopia correction.
 * - Applies styles to either a specific target element or all text elements on the page.
 * - Records ratings for each configuration and displays results for comparison.
 * - Follows DaisyUI and project best practices for UI consistency.
 */
export const EnhancedCSSTestingPanel: React.FC<EnhancedCSSTestingPanelProps> = ({
  targetElement
}) => {
  const [currentConfig, setCurrentConfig] = useState(-1); // -1 = baseline
  const [testResults, setTestResults] = useState<{ [key: number]: number }>({});
  const cssProcessor = new EnhancedCSSProcessor();

  // Applies a configuration to the target or all text elements
  const applyConfiguration = (configIndex: number) => {
    if (targetElement) {
      cssProcessor.applyEnhancedCSS(targetElement, configIndex);
      setCurrentConfig(configIndex);
    } else {
      // Apply to all text elements for broad testing
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
      textElements.forEach(el => {
        cssProcessor.applyEnhancedCSS(el as HTMLElement, configIndex);
      });
      setCurrentConfig(configIndex);
    }
  };

  // Records a user rating for the current configuration
  const recordTestResult = (configIndex: number, rating: number) => {
    setTestResults(prev => ({
      ...prev,
      [configIndex]: rating
    }));
  };

  // Resets all text elements to the baseline configuration
  const resetToBaseline = () => {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    textElements.forEach(el => {
      (el as HTMLElement).style.filter = 'contrast(1.5) brightness(1.1) drop-shadow(0 0 0.3px rgba(0,0,0,0.5))';
      (el as HTMLElement).style.textShadow = '';
      (el as HTMLElement).style.setProperty('-webkit-font-smoothing', '');
      (el as HTMLElement).style.setProperty('text-rendering', '');
    });
    setCurrentConfig(-1);
  };

  return (
    <div className="enhanced-css-testing-panel bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto mt-8">
      <h3 className="text-xl font-bold mb-4">Enhanced CSS Testing Panel</h3>
      {/* Test Controls */}
      <div className="test-controls mb-6 flex flex-wrap gap-2">
        <button
          onClick={resetToBaseline}
          className="btn btn-secondary mr-4 mb-2"
        >
          Reset to Baseline (3.0/10)
        </button>
        {Array.from({ length: cssProcessor.getTotalConfigurations() }, (_, index) => (
          <button
            key={index}
            onClick={() => applyConfiguration(index)}
            className={`btn mb-2 ${currentConfig === index ? 'btn-primary' : 'btn-outline btn-primary'}`}
          >
            Config {index + 1}
          </button>
        ))}
      </div>
      {/* Current Config Display */}
      <div className="current-config mb-4">
        <h4 className="font-semibold">Current Configuration:</h4>
        {currentConfig >= 0 ? (
          <pre className="text-xs bg-base-200 p-2 rounded mt-1 overflow-x-auto">
            {JSON.stringify(cssProcessor.getCurrentConfig(currentConfig), null, 2)}
          </pre>
        ) : (
          <div className="text-sm">Baseline Configuration</div>
        )}
      </div>
      {/* Rating Section */}
      <div className="rating-section mb-4">
        <h4 className="font-semibold mb-2">Rate Current Configuration (1-10):</h4>
        <div className="flex flex-wrap gap-1">
          {[1,2,3,4,5,6,7,8,9,10].map(rating => (
            <button
              key={rating}
              onClick={() => currentConfig >= 0 && recordTestResult(currentConfig, rating)}
              className="btn btn-sm btn-success btn-outline"
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
      {/* Test Results */}
      <div className="test-results mb-4">
        <h4 className="font-semibold mb-2">Test Results:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(testResults).length === 0 && <span className="col-span-2">No results yet.</span>}
          {Object.entries(testResults).map(([configIndex, rating]) => (
            <div key={configIndex} className="flex justify-between">
              <span>Config {parseInt(configIndex) + 1}:</span>
              <span className="font-semibold">{rating}/10</span>
            </div>
          ))}
        </div>
      </div>
      {/* Instructions */}
      <div className="instructions mt-4 p-4 bg-warning rounded">
        <h4 className="font-semibold">Testing Instructions:</h4>
        <ol className="list-decimal list-inside text-sm">
          <li>Start with baseline configuration</li>
          <li>Take screenshot for comparison</li>
          <li>Apply each configuration and rate clarity improvement</li>
          <li>Take screenshots of best performing configurations</li>
          <li>Select optimal configuration based on ratings</li>
        </ol>
      </div>
    </div>
  );
}; 