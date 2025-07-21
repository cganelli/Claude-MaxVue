import React from 'react';
import { useVisionCorrection } from '../hooks/useVisionCorrection';
import { WEBGL_ENABLED } from '../config/features';
import { VisionProcessor } from './VisionProcessor';

export const ContentDemo: React.FC = () => {
  const visionCorrection = useVisionCorrection();
  const { isEnabled, webglEnabled = false, toggleWebGL = () => {} } = visionCorrection;

  return (
    <div className="content-demo">
      {/* Vision Correction Controls - Always Available */}
      <div className="vision-controls">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isEnabled}
              // onChange handler removed (not in hook)
              readOnly
            />
            Vision Correction Enabled
          </label>
        </div>
      </div>

      {/* WebGL Controls - Only if Feature Enabled (SHOULD BE HIDDEN) */}
      {WEBGL_ENABLED && (
        <div className="webgl-controls">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={webglEnabled || false}
                onChange={toggleWebGL}
                disabled={!isEnabled}
              />
              WebGL Acceleration
            </label>
          </div>
        </div>
      )}

      {/* Vision Processor - CSS Only */}
      <VisionProcessor autoProcess={isEnabled}>
        <div>Demo Content</div>
      </VisionProcessor>
    </div>
  );
};