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

// Device detection patterns
const MOBILE_PATTERNS =
  /Android|iPhone|iPod|BlackBerry|Windows Phone|webOS|Opera Mini|IEMobile/i;
const TABLET_PATTERNS = /iPad|tablet|playbook|silk/i;

// Viewport breakpoints
const VIEWPORT_BREAKPOINTS = {
  small: 768, // < 768px is small (mobile)
  medium: 1024, // 768px - 1024px is medium (tablet)
  // > 1024px is large (desktop)
};

// Viewing distance estimates (in inches)
const VIEWING_DISTANCES = {
  mobile: 14, // 12-16" average for phones
  tablet: 18, // 16-20" average for tablets
  desktop: 22.5, // 21-24" average for desktop/laptop
};

// Calibration adjustments for different devices
const CALIBRATION_ADJUSTMENTS = {
  mobile: 0.75, // +0.5D to +1.0D adjustment
  tablet: 0.25, // Small adjustment for tablets
  desktop: 0, // No adjustment for desktop
};

export const useMobileDetection = (): MobileDetectionResult => {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  // Detect device type based on user agent and screen size
  const detectDeviceType = useCallback((): "mobile" | "tablet" | "desktop" => {
    if (typeof window === "undefined") return "desktop";

    const userAgent = window.navigator.userAgent;
    const screenWidth = window.innerWidth;

    // Check user agent patterns
    if (
      MOBILE_PATTERNS.test(userAgent) &&
      screenWidth < VIEWPORT_BREAKPOINTS.small
    ) {
      return "mobile";
    }

    if (
      TABLET_PATTERNS.test(userAgent) ||
      (screenWidth >= VIEWPORT_BREAKPOINTS.small &&
        screenWidth <= VIEWPORT_BREAKPOINTS.medium)
    ) {
      return "tablet";
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
