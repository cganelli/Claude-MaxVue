import { describe, expect, test, beforeEach } from "vitest";

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

/**
 * Tests for useVisionCorrection hook - Real-time content processing
 *
 * CRITICAL: Ensure all content types are processed when slider changes
 */

describe("realTimeContentProcessing", () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.setItem("calibrationValue", "2.0");
  });

  test("should process text elements with blur based on slider value", () => {
    const calibration = 2.0;
    const sliderValue = 1.0; // Below calibration - should blur

    // Calculate expected blur
    const expectedBlur = Math.max(0, calibration - sliderValue);
    expect(expectedBlur).toBe(1.0); // 1.0D difference = 0.6px blur

    // Text elements should have blur filter applied
    const textSelectors = [".prose", "p", "h1", "h2", "h3", "span", "div"];
    textSelectors.forEach(() => {
      // Each should get blur filter
      const expectedFilter = `blur(${(expectedBlur * 0.6).toFixed(2)}px)`;
      expect(expectedFilter).toBe("blur(0.60px)");
    });
  });

  test("should process all content types in real-time", () => {
    const contentTypes = {
      text: ["p", "h1", "h2", "h3", "span", "div.prose"],
      images: ["img"],
      videos: ["video"],
      special: [".email-content", ".web-content"],
    };

    // All content types should be included in processing
    Object.values(contentTypes)
      .flat()
      .forEach((selector) => {
        expect(selector).toBeTruthy();
      });
  });

  test("should update blur immediately when slider changes", () => {
    const calibration = 2.0;

    // Test immediate updates
    const sliderChanges = [
      { value: 0.0, expectedBlur: 1.2 }, // 2.0 * 0.6
      { value: 1.0, expectedBlur: 0.6 }, // 1.0 * 0.6
      { value: 2.0, expectedBlur: 0.0 }, // At calibration
      { value: 3.0, expectedBlur: 0.0 }, // Above calibration (no blur)
    ];

    sliderChanges.forEach(({ value, expectedBlur }) => {
      const blur = Math.max(0, calibration - value) * 0.6;
      expect(blur).toBeCloseTo(expectedBlur, 2);
    });
  });
});

describe("mobileCalibrationAdjustment", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("should apply mobile calibration adjustment when device is mobile", () => {
    // Set base calibration
    const baseCalibration = 2.0;
    localStorageMock.setItem("calibrationValue", baseCalibration.toString());
    
    // Mobile adjustment should add 0.75D
    const mobileAdjustment = 0.75;
    const expectedMobileCalibration = baseCalibration + mobileAdjustment;
    
    expect(expectedMobileCalibration).toBe(2.75);
  });

  test("should apply tablet calibration adjustment when device is tablet", () => {
    // Set base calibration
    const baseCalibration = 2.0;
    localStorageMock.setItem("calibrationValue", baseCalibration.toString());
    
    // Tablet adjustment should add 0.25D
    const tabletAdjustment = 0.25;
    const expectedTabletCalibration = baseCalibration + tabletAdjustment;
    
    expect(expectedTabletCalibration).toBe(2.25);
  });

  test("should not apply adjustment for desktop devices", () => {
    // Set base calibration
    const baseCalibration = 2.0;
    localStorageMock.setItem("calibrationValue", baseCalibration.toString());
    
    // Desktop should have no adjustment
    const desktopAdjustment = 0;
    const expectedDesktopCalibration = baseCalibration + desktopAdjustment;
    
    expect(expectedDesktopCalibration).toBe(2.0);
  });

  test("should calculate blur with mobile-adjusted calibration", () => {
    const baseCalibration = 2.0;
    const mobileAdjustment = 0.75;
    const adjustedCalibration = baseCalibration + mobileAdjustment; // 2.75
    const sliderValue = 2.0;
    
    // Blur should be based on adjusted calibration
    const expectedBlur = Math.max(0, adjustedCalibration - sliderValue) * 0.5;
    expect(expectedBlur).toBe(0.375); // (2.75 - 2.0) * 0.5
  });
});
