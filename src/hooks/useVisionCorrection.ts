import { useState, useEffect } from 'react';

interface VisionCorrectionState {
  isEnabled: boolean;
  diopterValue: number;
  blurAmount: number;
  calibrationValue: number;
}

export const useVisionCorrection = (): VisionCorrectionState => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [diopterValue, setDiopterValue] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);
  const [calibrationValue, setCalibrationValue] = useState(0);

  useEffect(() => {
    const checkVisionCorrection = () => {
      try {
        // ✅ FIXED: Check the correction toggle state first
        const enabled = localStorage.getItem('visionCorrectionEnabled') === 'true';
        const storedCalibration = localStorage.getItem('calibrationValue');
        const prescription = parseFloat(localStorage.getItem('estimatedSphere') || '0');
        
        // ✅ FIXED: Remove default fallback of 2.0 - use 0.0 if no calibration found
        const calibration = storedCalibration ? parseFloat(storedCalibration) : 0.0;
        
        console.log('👁️ Vision Correction Check:', {
          enabled,
          calibration,
          prescription,
          hasCalibration: !!storedCalibration,
          timestamp: new Date().toISOString()
        });
        
        setIsEnabled(enabled);
        setCalibrationValue(calibration);
        setDiopterValue(prescription);
        
        // ✅ FIXED: Dynamic correction formula - no clamping, allow full range up to +3.50D
        if (enabled) {
          // When enabled: Apply dynamic correction
          const blurPx = Math.max(0, calibration - prescription);
          console.log('✅ Vision correction ENABLED - dynamic correction:', {
            calibration,
            prescription,
            blurPx,
            formula: `Math.max(0, ${calibration} - ${prescription}) = ${blurPx}px`
          });
          setBlurAmount(blurPx);
        } else {
          // ✅ FIXED: When disabled, use calibration as baseline blur (simulates uncorrected vision)
          console.log('✅ Vision correction DISABLED - baseline blur applied:', {
            calibration,
            baselineBlur: calibration,
            note: 'Using calibration value as baseline (simulates uncorrected vision)'
          });
          setBlurAmount(calibration);
        }
      } catch (error) {
        console.error('❌ Error in vision correction check:', error);
        setIsEnabled(false);
        setDiopterValue(0);
        setCalibrationValue(0);
        setBlurAmount(0);
      }
    };

    // Check on mount
    checkVisionCorrection();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'visionCorrectionEnabled' || e.key === 'calibrationValue' || e.key === 'estimatedSphere') {
        console.log('📡 Storage change detected, re-checking vision correction');
        checkVisionCorrection();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events for same-tab updates
    const handleVisionToggle = () => {
      console.log('🔄 Vision toggle event received, re-checking calibration');
      checkVisionCorrection();
    };
    window.addEventListener('visionCorrectionToggle', handleVisionToggle);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('visionCorrectionToggle', handleVisionToggle);
    };
  }, []);

  return {
    isEnabled,
    diopterValue,
    blurAmount,
    calibrationValue
  };
};

// ✅ FIXED: Vision correction style with proper toggle state logic – no clamping to +2.0D 
// (debug update)


export const getVisionCorrectionStyle = (customBlur?: number): React.CSSProperties => {
  try {
    const enabled = localStorage.getItem('visionCorrectionEnabled') === 'true';
    const storedCalibration = localStorage.getItem('calibrationValue');
    // ✅ FIXED: Remove fallback to 2.0 - use 0.0 if no calibration found
    const calibration = storedCalibration ? parseFloat(storedCalibration) : 0.0;
    const prescription = parseFloat(localStorage.getItem('estimatedSphere') || '0');
    
    let blurPx: number;
    
    if (customBlur !== undefined) {
      blurPx = customBlur;
    } else if (enabled) {
      // ✅ FIXED: When enabled - dynamic correction formula (no clamping to +2.0D)
      blurPx = Math.max(0, calibration - prescription);
    } else {
      // ✅ FIXED: When disabled - use calibration as baseline blur
      blurPx = calibration;
    }
    
    // ✅ FIXED: Only clamp to prevent negative values, no upper limit
    if (isNaN(blurPx) || blurPx < 0) {
      blurPx = 0;
    }
    console.log("💡 getVisionCorrectionStyle running", {
  enabled,
  calibration,
  prescription,
  blurPx,
});

    return {
      filter: blurPx > 0 ? `blur(${blurPx.toFixed(2)}px)` : 'none',
      transition: 'filter 0.3s ease'
    };
  } catch (error) {
    console.error('❌ Error in getVisionCorrectionStyle:', error);
    return { filter: 'none' };
  }
};

// Helper function to trigger vision correction update events
export const triggerVisionCorrectionUpdate = () => {
  try {
    window.dispatchEvent(new CustomEvent('visionCorrectionToggle'));
  } catch (error) {
    console.error('❌ Error triggering vision correction update:', error);
  }
};