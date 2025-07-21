import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMobileDetection } from "../hooks/useMobileDetection";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("Mobile Vision Correction Integration", () => {
  beforeEach(() => {
    localStorageMock.clear();

    // Mock window properties for test environment
    Object.defineProperty(window, "innerWidth", {
      value: 1920,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window.navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      writable: true,
      configurable: true,
    });
  });

  describe("Desktop Scenario", () => {
    it("should provide correct calibration values for desktop", () => {
      // Set up desktop environment
      window.innerWidth = 1920;
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });

      const { result: mobileResult } = renderHook(() => useMobileDetection());

      expect(mobileResult.current.deviceType).toBe("desktop");
      expect(mobileResult.current.calibrationAdjustment).toBe(0);
      expect(mobileResult.current.viewingDistance).toBe(22.5);

      const baseCalibration = 2.0;
      const adjustedCalibration =
        mobileResult.current.getAdjustedCalibration(baseCalibration);
      expect(adjustedCalibration).toBe(2.0); // No adjustment for desktop
    });
  });

  describe("Mobile Scenario", () => {
    it("should provide correct calibration values for mobile", () => {
      // Set up mobile environment
      window.innerWidth = 390;
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });

      const { result: mobileResult } = renderHook(() => useMobileDetection());

      expect(mobileResult.current.deviceType).toBe("mobile");
      expect(mobileResult.current.calibrationAdjustment).toBe(2.0); // FIXED
      expect(mobileResult.current.viewingDistance).toBe(14);

      const baseCalibration = 2.0;
      const adjustedCalibration =
        mobileResult.current.getAdjustedCalibration(baseCalibration);
      expect(adjustedCalibration).toBe(4.0); // FIXED: +2.0D adjustment for mobile
    });
  });

  describe("Tablet Scenario", () => {
    it("should provide correct calibration values for tablet", () => {
      // Set up tablet environment
      window.innerWidth = 1024;
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });

      const { result: mobileResult } = renderHook(() => useMobileDetection());

      expect(mobileResult.current.deviceType).toBe("tablet");
      expect(mobileResult.current.calibrationAdjustment).toBe(0.5);
      expect(mobileResult.current.viewingDistance).toBe(18);

      const baseCalibration = 2.0;
      const adjustedCalibration =
        mobileResult.current.getAdjustedCalibration(baseCalibration);
      expect(adjustedCalibration).toBe(2.5); // +0.5D adjustment for tablet
    });
  });

  describe("Camera Blur Calculations", () => {
    it("should calculate mobile-adjusted blur correctly", () => {
      // Mobile scenario
      window.innerWidth = 390;
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });

      const { result: mobileResult } = renderHook(() => useMobileDetection());

      // Test blur calculation like in WorkingCameraDemo
      const readingVisionDiopter = 1.5;
      const calibrationValue = 3.75; // Mobile-adjusted calibration (2.0 + 1.75)

      const baseBlurAmount =
        Math.abs(readingVisionDiopter - calibrationValue) * 0.5;
      const mobileBlurMultiplier =
        mobileResult.current.deviceType === "mobile" ? 1.2 : 1.0;
      const adjustedBlurAmount = baseBlurAmount * mobileBlurMultiplier;

      expect(baseBlurAmount).toBe(1.125); // |1.5 - 3.75| * 0.5
      expect(mobileBlurMultiplier).toBe(1.2);
      expect(adjustedBlurAmount).toBeCloseTo(1.35, 2); // 1.125 * 1.2
    });

    it("should calculate desktop blur correctly", () => {
      // Desktop scenario
      window.innerWidth = 1920;
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });

      const { result: mobileResult } = renderHook(() => useMobileDetection());

      // Test blur calculation
      const readingVisionDiopter = 1.5;
      const calibrationValue = 2.0; // No mobile adjustment for desktop

      const baseBlurAmount =
        Math.abs(readingVisionDiopter - calibrationValue) * 0.5;
      const mobileBlurMultiplier =
        mobileResult.current.deviceType === "mobile" ? 1.2 : 1.0;
      const adjustedBlurAmount = baseBlurAmount * mobileBlurMultiplier;

      expect(baseBlurAmount).toBe(0.25); // |1.5 - 2.0| * 0.5
      expect(mobileBlurMultiplier).toBe(1.0);
      expect(adjustedBlurAmount).toBe(0.25); // 0.25 * 1.0 (no mobile adjustment)
    });
  });
});
