import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMobileDetection } from "./useMobileDetection";

describe("useMobileDetection", () => {
  const originalNavigator = { ...window.navigator };
  const originalWindow = { ...window };

  beforeEach(() => {
    // Reset navigator and window properties before each test
    Object.defineProperty(window, "navigator", {
      value: { ...originalNavigator },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, "innerWidth", {
      value: 1920,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: 1080,
      writable: true,
      configurable: true,
    });

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerWidth", {
      value: originalWindow.innerWidth,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: originalWindow.innerHeight,
      writable: true,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  describe("mobile detection", () => {
    it("should detect iPhone correctly", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;
      window.innerHeight = 844;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.deviceType).toBe("mobile");
      expect(result.current.viewingDistance).toBe(14); // 12-16" average
    });

    it("should detect Android phone correctly", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 412;
      window.innerHeight = 915;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.deviceType).toBe("mobile");
      expect(result.current.viewingDistance).toBe(14);
    });

    it("should detect iPad/tablet correctly", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 1024;
      window.innerHeight = 1366;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.deviceType).toBe("tablet");
      expect(result.current.viewingDistance).toBe(18); // 16-20" average
    });

    it("should detect desktop correctly", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 1920;
      window.innerHeight = 1080;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.deviceType).toBe("desktop");
      expect(result.current.viewingDistance).toBe(22.5); // 21-24" average
    });
  });

  describe("touch capability detection", () => {
    it("should detect touch support correctly", () => {
      // Mock touch support
      Object.defineProperty(window.navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.hasTouch).toBe(true);
    });

    it("should detect no touch support correctly", () => {
      // Remove all touch-related properties
      Object.defineProperty(window.navigator, "maxTouchPoints", {
        value: 0,
        writable: true,
        configurable: true,
      });

      // Remove ontouchstart if it exists
      if ("ontouchstart" in window) {
        delete (window as any).ontouchstart;
      }

      // Also need to ensure matchMedia returns false for pointer: coarse
      window.matchMedia = vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as any;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.hasTouch).toBe(false);
    });
  });

  describe("calibration adjustment", () => {
    it("should provide correct calibration adjustment for mobile", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.calibrationAdjustment).toBe(0.75); // +0.5D to +1.0D adjustment
    });

    it("should provide no calibration adjustment for desktop", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 1920;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.calibrationAdjustment).toBe(0);
    });

    it("should provide moderate calibration adjustment for tablet", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 1024;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.calibrationAdjustment).toBe(0.25); // Small adjustment for tablets
    });
  });

  describe("viewport size detection", () => {
    it("should correctly identify small mobile viewport", () => {
      window.innerWidth = 320;
      window.innerHeight = 568;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.viewport.width).toBe(320);
      expect(result.current.viewport.height).toBe(568);
      expect(result.current.viewport.isSmall).toBe(true);
      expect(result.current.viewport.isMedium).toBe(false);
      expect(result.current.viewport.isLarge).toBe(false);
    });

    it("should correctly identify medium tablet viewport", () => {
      window.innerWidth = 768;
      window.innerHeight = 1024;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.viewport.width).toBe(768);
      expect(result.current.viewport.height).toBe(1024);
      expect(result.current.viewport.isSmall).toBe(false);
      expect(result.current.viewport.isMedium).toBe(true);
      expect(result.current.viewport.isLarge).toBe(false);
    });

    it("should correctly identify large desktop viewport", () => {
      window.innerWidth = 1920;
      window.innerHeight = 1080;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.viewport.width).toBe(1920);
      expect(result.current.viewport.height).toBe(1080);
      expect(result.current.viewport.isSmall).toBe(false);
      expect(result.current.viewport.isMedium).toBe(false);
      expect(result.current.viewport.isLarge).toBe(true);
    });
  });

  describe("responsive updates", () => {
    it("should update when window is resized", () => {
      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.viewport.width).toBe(1920);

      // Simulate resize
      window.innerWidth = 400;
      window.innerHeight = 800;
      window.dispatchEvent(new Event("resize"));

      // Force re-render
      const { result: newResult } = renderHook(() => useMobileDetection());

      expect(newResult.current.viewport.width).toBe(400);
      expect(newResult.current.viewport.isSmall).toBe(true);
    });
  });

  describe("adjusted calibration calculation", () => {
    it("should calculate correct adjusted calibration for mobile", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;

      const { result } = renderHook(() => useMobileDetection());
      const baseCalibration = 2.0;
      const adjusted = result.current.getAdjustedCalibration(baseCalibration);

      expect(adjusted).toBe(2.75); // 2.0 + 0.75 mobile adjustment
    });

    it("should not adjust calibration for desktop", () => {
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 1920;

      const { result } = renderHook(() => useMobileDetection());
      const baseCalibration = 2.0;
      const adjusted = result.current.getAdjustedCalibration(baseCalibration);

      expect(adjusted).toBe(2.0); // No adjustment for desktop
    });
  });
});
