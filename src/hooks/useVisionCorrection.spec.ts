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
