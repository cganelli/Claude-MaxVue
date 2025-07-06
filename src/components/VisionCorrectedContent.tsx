import React from "react";
import {
  useVisionCorrection,
  getVisionCorrectionStyle,
} from "../hooks/useVisionCorrection";

interface VisionCorrectedContentProps {
  children: React.ReactNode;
  className?: string;
  customBlur?: number;
  disabled?: boolean;
}

const VisionCorrectedContent: React.FC<VisionCorrectedContentProps> = ({
  children,
  className = "",
  customBlur,
  disabled = false,
}) => {
  // Only destructure what we actually use to avoid linting errors
  useVisionCorrection();

  // If disabled, don't apply any vision correction
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  // ✅ NEW: Use dynamic vision correction style with user calibration
  const style = getVisionCorrectionStyle(customBlur);

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export default VisionCorrectedContent;
