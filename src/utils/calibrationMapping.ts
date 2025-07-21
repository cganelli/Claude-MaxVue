/**
 * Calibration Scale Mapping System
 * 
 * Maps between user-friendly scale and internal calculation scale:
 * - User Scale: 0.00D to +3.50D (familiar reading glasses scale)
 * - Internal Scale: -4.00D to +3.50D (technical calculation scale)
 * 
 * Key Mappings:
 * - User 0.00D = Internal -4.00D = No reading glasses needed
 * - User +2.00D = Internal -2.00D = +2.00D reading glasses prescription
 * - User +4.00D = Internal 0.00D = Desktop baseline
 * - User +6.00D = Internal +2.00D = Strong presbyopia
 * - User +7.50D = Internal +3.50D = Maximum presbyopia
 */

// Constants for the mapping system
export const CALIBRATION_CONSTANTS = {
  // Internal scale bounds (technical calculations)
  INTERNAL_MIN: -4.0,
  INTERNAL_MAX: 3.5,
  
  // User scale bounds (UI display)
  USER_MIN: 0.0,
  USER_MAX: 7.5,
  
  // Mobile viewing distance adjustment
  MOBILE_ADJUSTMENT: 2.0,
  
  // Mapping offset (User 0.00D = Internal -4.00D)
  SCALE_OFFSET: 4.0,
} as const;

/**
 * Convert from user-friendly scale to internal calculation scale
 * @param userValue - Value on user scale (0.00D to +7.50D)
 * @returns Value on internal scale (-4.00D to +3.50D)
 */
export function userToInternalScale(userValue: number): number {
  // User 0.00D = Internal -4.00D
  // User +2.00D = Internal -2.00D
  // User +4.00D = Internal 0.00D
  // User +7.50D = Internal +3.50D
  return userValue - CALIBRATION_CONSTANTS.SCALE_OFFSET;
}

/**
 * Convert from internal calculation scale to user-friendly scale
 * @param internalValue - Value on internal scale (-4.00D to +3.50D)
 * @returns Value on user scale (0.00D to +7.50D)
 */
export function internalToUserScale(internalValue: number): number {
  // Internal -4.00D = User 0.00D
  // Internal -2.00D = User +2.00D
  // Internal 0.00D = User +4.00D
  // Internal +3.50D = User +7.50D
  return internalValue + CALIBRATION_CONSTANTS.SCALE_OFFSET;
}

/**
 * Apply mobile viewing distance adjustment to internal value
 * @param internalDesktopValue - Desktop value on internal scale
 * @returns Mobile value on internal scale (desktop + 2.00D)
 */
export function applyMobileAdjustment(internalDesktopValue: number): number {
  return internalDesktopValue + CALIBRATION_CONSTANTS.MOBILE_ADJUSTMENT;
}

/**
 * Get the user-friendly description for a user scale value
 * @param userValue - Value on user scale (0.00D to +7.50D)
 * @returns Human-readable description
 */
export function getUserScaleDescription(userValue: number): string {
  if (userValue <= 0.5) {
    return "No reading glasses needed";
  } else if (userValue <= 1.5) {
    return "Very mild presbyopia";
  } else if (userValue <= 2.5) {
    return "Mild presbyopia";
  } else if (userValue <= 3.5) {
    return "Moderate presbyopia";
  } else if (userValue <= 5.0) {
    return "Strong presbyopia";
  } else {
    return "Very strong presbyopia";
  }
}

/**
 * Validate that a user scale value is within bounds
 * @param userValue - Value to validate
 * @returns True if valid, false otherwise
 */
export function isValidUserScale(userValue: number): boolean {
  return userValue >= CALIBRATION_CONSTANTS.USER_MIN && 
         userValue <= CALIBRATION_CONSTANTS.USER_MAX;
}

/**
 * Validate that an internal scale value is within bounds
 * @param internalValue - Value to validate
 * @returns True if valid, false otherwise
 */
export function isValidInternalScale(internalValue: number): boolean {
  return internalValue >= CALIBRATION_CONSTANTS.INTERNAL_MIN && 
         internalValue <= CALIBRATION_CONSTANTS.INTERNAL_MAX;
}

/**
 * Round value to nearest 0.25 increment (standard diopter precision)
 * @param value - Value to round
 * @returns Rounded value
 */
export function roundToDiopter(value: number): number {
  return Math.round(value * 4) / 4;
}

/**
 * Complete calibration workflow: user scale → mobile internal scale
 * @param userDesktopValue - User's desktop setting (0.00D to +7.50D)
 * @returns Object with all calculated values
 */
export function calculateCalibrationValues(userDesktopValue: number) {
  // Validate input
  if (!isValidUserScale(userDesktopValue)) {
    throw new Error(`Invalid user scale value: ${userDesktopValue}. Must be between ${CALIBRATION_CONSTANTS.USER_MIN} and ${CALIBRATION_CONSTANTS.USER_MAX}`);
  }

  // Convert to internal scale
  const internalDesktop = userToInternalScale(userDesktopValue);
  
  // Apply mobile adjustment
  const internalMobile = applyMobileAdjustment(internalDesktop);
  
  // Convert mobile back to user scale for display purposes
  const userMobile = internalToUserScale(internalMobile);
  
  // Get descriptions
  const desktopDescription = getUserScaleDescription(userDesktopValue);
  const mobileDescription = getUserScaleDescription(userMobile);

  return {
    // User scale values (UI display)
    userDesktop: roundToDiopter(userDesktopValue),
    userMobile: roundToDiopter(userMobile),
    
    // Internal scale values (calculations)
    internalDesktop: roundToDiopter(internalDesktop),
    internalMobile: roundToDiopter(internalMobile),
    
    // Descriptions
    desktopDescription,
    mobileDescription,
    
    // Raw adjustment
    mobileAdjustment: CALIBRATION_CONSTANTS.MOBILE_ADJUSTMENT,
  };
}