import { useState, useEffect, useCallback } from "react";

export interface MobileDetectionResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
  hasTouch: boolean;
  viewingDistance: number;
  calibrationAdjustment: number;
  viewport: {
    width: number;
    height: number;
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
  };
  getAdjustedCalibration: (baseCalibration: number) => number;
}

// Device detection patterns - Enhanced for comprehensive detection
// ENHANCED: More aggressive mobile detection patterns
const MOBILE_PATTERNS =
  /Android(?!.*Tablet)|iPhone|iPod|BlackBerry|Windows Phone|webOS|Opera Mini|IEMobile|Mobile|mobi|phone|mobile|android|ios|iphone|ipod|blackberry|fennec|minimo|symbian|psp|nintendo|playstation|hiptop|netfront|palm|brew|dolphin|blazer|bolt|gobrowser|iris|maemo|semc|skyfire|teashark|teleca|uzard|pocket|series60|series40|maui|windows ce|windows mobile|j2me|midp|cldc|palm|smartphone|iemobile/i;
const TABLET_PATTERNS =
  /iPad|tablet|playbook|silk|Tablet|Android.*(?=.*\b(?:tablet|tab)\b)/i;

// Viewport breakpoints - FIXED: Adjusted thresholds so 749x692 is desktop
const VIEWPORT_BREAKPOINTS = {
  small: 600, // < 600px is small (mobile) - FIXED: was 768, now 600
  medium: 740, // 600px - 740px is medium (tablet) - FIXED: so 749px is desktop
  // > 740px is large (desktop) - 749x692 will now be desktop
};

// Viewing distance estimates (in inches)
const VIEWING_DISTANCES = {
  mobile: 14, // 12-16" average for phones
  tablet: 18, // 16-20" average for tablets
  desktop: 22.5, // 21-24" average for desktop/laptop
};

// Calibration adjustments for different devices - PHYSICS-BASED CALCULATION
// Desktop viewing distance: 22.5" (0.5715m) ≈ 1.75D requirement
// Mobile viewing distance: 14" (0.3556m) ≈ 2.81D requirement  
// FIXED: Mobile needs +2.00D MORE than desktop for clear vision at 14" vs 22.5"
const CALIBRATION_ADJUSTMENTS = {
  mobile: 2.0, // FIXED: Strong distance-based adjustment (was 1.75, now 2.0)
  tablet: 0.5, // Moderate adjustment for intermediate distance
  desktop: 0, // No adjustment for desktop baseline
};

export const useMobileDetection = (): MobileDetectionResult => {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  // Detect device type based on user agent and screen size
  // CRITICAL: Uses screen size as primary indicator with user agent as enhancement
  const detectDeviceType = useCallback((): "mobile" | "tablet" | "desktop" => {
    if (typeof window === "undefined") return "desktop";

    const userAgent = window.navigator.userAgent;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Test pattern matches
    const mobilePatternMatch = MOBILE_PATTERNS.test(userAgent);
    const tabletPatternMatch = TABLET_PATTERNS.test(userAgent);
    const isSmallScreen = screenWidth < VIEWPORT_BREAKPOINTS.small;
    const isMediumScreen =
      screenWidth >= VIEWPORT_BREAKPOINTS.small &&
      screenWidth <= VIEWPORT_BREAKPOINTS.medium;

    // ENHANCED: Also consider aspect ratio for ultra-wide mobile devices
    const aspectRatio = screenHeight / screenWidth;
    const isPortraitMobile = aspectRatio > 1.4 && screenWidth <= 500; // Tall, narrow screen = likely mobile
    const isMobileByDimensions = isSmallScreen || isPortraitMobile;

    // PRIMARY: Mobile detection - prioritize mobile patterns OR mobile dimensions
    if (mobilePatternMatch || isMobileByDimensions) {
      // Double-check it's not a tablet masquerading as mobile
      if (!tabletPatternMatch) {
        return "mobile";
      } else {
        // CRITICAL FIX: Mobile dimensions should override user agent for mobile detection
        if (isMobileByDimensions) {
          return "mobile";
        }
      }
    }

    // SECONDARY: Tablet detection - check patterns AND medium screen size
    if (tabletPatternMatch || isMediumScreen) {
      return "tablet";
    }

    // FALLBACK: Mobile dimensions without clear user agent = mobile device
    if (isMobileByDimensions) {
      return "mobile";
    }

    return "desktop";
  }, []);

  // Detect touch capability
  const detectTouch = useCallback((): boolean => {
    if (typeof window === "undefined") return false;

    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
    );
  }, []);

  const deviceType = detectDeviceType();
  const hasTouch = detectTouch();

  // Essential logging for debugging mobile detection issues
  console.log("🎯 Device detection:", {
    type: deviceType,
    viewingDistance: VIEWING_DISTANCES[deviceType] + '"',
    adjustment: `+${CALIBRATION_ADJUSTMENTS[deviceType]}D`,
    screen:
      typeof window !== "undefined"
        ? `${window.innerWidth}x${window.innerHeight}`
        : "SSR",
  });

  // Handle window resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate viewport size categories
  const viewportCategories = {
    isSmall: viewport.width < VIEWPORT_BREAKPOINTS.small,
    isMedium:
      viewport.width >= VIEWPORT_BREAKPOINTS.small &&
      viewport.width <= VIEWPORT_BREAKPOINTS.medium,
    isLarge: viewport.width > VIEWPORT_BREAKPOINTS.medium,
  };

  // Calculate adjusted calibration
  const getAdjustedCalibration = useCallback(
    (baseCalibration: number): number => {
      return baseCalibration + CALIBRATION_ADJUSTMENTS[deviceType];
    },
    [deviceType],
  );

  return {
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    deviceType,
    hasTouch,
    viewingDistance: VIEWING_DISTANCES[deviceType],
    calibrationAdjustment: CALIBRATION_ADJUSTMENTS[deviceType],
    viewport: {
      width: viewport.width,
      height: viewport.height,
      ...viewportCategories,
    },
    getAdjustedCalibration,
  };
};
