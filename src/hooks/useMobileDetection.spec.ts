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
        delete (window as Record<string, unknown>).ontouchstart;
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
      })) as unknown as typeof window.matchMedia;

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

      expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED: Strong distance-based adjustment
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

      expect(result.current.calibrationAdjustment).toBe(0.5); // Moderate adjustment for tablets
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
      window.innerWidth = 700; // FIXED: Use 700px which is in tablet range (600-740)
      window.innerHeight = 1024;

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.viewport.width).toBe(700);
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

      expect(adjusted).toBe(4.0); // FIXED: 2.0 + 2.0 mobile adjustment
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

  describe("CRITICAL: Mobile Device Detection Accuracy", () => {
    it("should detect ALL modern iPhone user agents correctly", () => {
      const iPhoneUserAgents = [
        // iPhone 15 Pro Max
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        // iPhone 14
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        // iPhone 13
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
        // iPhone SE
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Mobile/15E148 Safari/604.1",
        // iPhone with Chrome
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/119.0.0.0 Mobile/15E148 Safari/604.38",
        // iPhone with Firefox
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/119.0 Mobile/15E148 Safari/605.1.15",
      ];

      iPhoneUserAgents.forEach((userAgent) => {
        // Reset window state
        Object.defineProperty(window.navigator, "userAgent", {
          value: userAgent,
          writable: true,
          configurable: true,
        });
        window.innerWidth = 390; // iPhone 14 Pro width

        const { result } = renderHook(() => useMobileDetection());

        expect(result.current.isMobile).toBe(true);
        expect(result.current.deviceType).toBe("mobile");
        expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED
      });
    });

    it("should detect ALL modern Android phone user agents correctly", () => {
      const androidUserAgents = [
        // Samsung Galaxy S23
        "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
        // Google Pixel 8
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
        // OnePlus 11
        "Mozilla/5.0 (Linux; Android 13; CPH2449) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
        // Xiaomi 13
        "Mozilla/5.0 (Linux; Android 13; 2211133C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
        // Android with Firefox
        "Mozilla/5.0 (Android 13; Mobile; rv:119.0) Gecko/119.0 Firefox/119.0",
        // Android with Edge
        "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36 EdgA/119.0.0.0",
      ];

      androidUserAgents.forEach((userAgent) => {
        // Reset window state
        Object.defineProperty(window.navigator, "userAgent", {
          value: userAgent,
          writable: true,
          configurable: true,
        });
        window.innerWidth = 412; // Common Android width

        const { result } = renderHook(() => useMobileDetection());

        expect(result.current.isMobile).toBe(true);
        expect(result.current.deviceType).toBe("mobile");
        expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED
      });
    });

    it("should NOT misidentify mobile devices as desktop", () => {
      // User's actual case - mobile device detected as desktop
      const problematicUserAgents = [
        // Mobile Safari on iPhone that might be misidentified
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        // Android Chrome that might be misidentified
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/119.0.0.0",
        // Mobile device with desktop request
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      ];

      problematicUserAgents.forEach((userAgent) => {
        // Set up mobile screen size
        window.innerWidth = 390;
        window.innerHeight = 844;

        Object.defineProperty(window.navigator, "userAgent", {
          value: userAgent,
          writable: true,
          configurable: true,
        });

        const { result } = renderHook(() => useMobileDetection());

        // Should detect as mobile based on screen size even with ambiguous UA
        if (window.innerWidth < 768) {
          expect(result.current.isMobile).toBe(true);
          expect(result.current.deviceType).toBe("mobile");
        }
      });
    });

    it("should use screen size as fallback when user agent is ambiguous", () => {
      // Desktop user agent but mobile screen size
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });

      // Mobile screen dimensions
      window.innerWidth = 375;
      window.innerHeight = 812;

      const { result } = renderHook(() => useMobileDetection());

      // Should detect as mobile based on screen size
      expect(result.current.deviceType).toBe("mobile");
      expect(result.current.viewport.isSmall).toBe(true);
      expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED
    });

    it("should handle touch capability detection for mobile devices", () => {
      // Setup mobile with touch
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;

      // Mock touch support
      Object.defineProperty(window, "ontouchstart", {
        value: true,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(window.navigator, "maxTouchPoints", {
        value: 5,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useMobileDetection());

      expect(result.current.hasTouch).toBe(true);
      expect(result.current.isMobile).toBe(true);
    });
  });

  describe("CRITICAL: Enhanced Mobile Detection - Edge Cases", () => {
    it("should detect problematic mobile user agents correctly", () => {
      // EDGE CASE TEST: User agents that might not have clear "Mobile" keyword
      const problematicMobileUserAgents = [
        // iPhone Safari without "Mobile" keyword
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/604.1",
        // Android without "Mobile" keyword
        "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        // Mobile device requesting desktop site
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        // Minimal mobile user agent
        "Mozilla/5.0 (iPhone)",
        // Android tablet on small screen (should be mobile due to screen size)
        "Mozilla/5.0 (Linux; Android 13; SM-T290) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      ];

      problematicMobileUserAgents.forEach((userAgent, index) => {
        // Set mobile screen size to force detection
        window.innerWidth = 375; // Standard mobile width
        window.innerHeight = 812;

        Object.defineProperty(window.navigator, "userAgent", {
          value: userAgent,
          writable: true,
          configurable: true,
        });

        const { result } = renderHook(() => useMobileDetection());

        expect(result.current.deviceType).toBe("mobile");
        expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED
        expect(result.current.viewingDistance).toBe(14);

        console.log(
          `✅ Edge case ${index + 1} passed: "${userAgent.substring(0, 50)}..."`,
        );
      });
    });

    it("should prioritize screen size over ambiguous user agents", () => {
      // CRITICAL TEST: Screen size should be the PRIMARY detection method

      const ambiguousUserAgents = [
        // Desktop user agent on mobile screen
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        // Tablet user agent on mobile screen
        "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        // Generic user agent
        "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)",
      ];

      ambiguousUserAgents.forEach((userAgent) => {
        // Test various mobile screen sizes
        const mobileScreens = [
          { width: 320, height: 568 }, // iPhone SE
          { width: 375, height: 812 }, // iPhone 13/14
          { width: 390, height: 844 }, // iPhone 14 Pro
          { width: 393, height: 851 }, // iPhone 15 Pro
          { width: 412, height: 915 }, // Android phones
        ];

        mobileScreens.forEach(({ width, height }) => {
          window.innerWidth = width;
          window.innerHeight = height;

          Object.defineProperty(window.navigator, "userAgent", {
            value: userAgent,
            writable: true,
            configurable: true,
          });

          const { result } = renderHook(() => useMobileDetection());

          // Screen size should override user agent
          expect(result.current.deviceType).toBe("mobile");
          expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED
        });
      });
    });

    it("should handle ultra-wide mobile screens correctly", () => {
      // EDGE CASE: Some mobile devices have unusual aspect ratios
      const ultraWideMobileScreens = [
        { width: 430, height: 932, device: "iPhone 14 Plus" },
        { width: 428, height: 926, device: "iPhone 12/13 Pro Max" },
        { width: 414, height: 896, device: "iPhone 11/XR" },
        { width: 450, height: 1000, device: "Large Android Phone" }, // Edge case
        { width: 480, height: 854, device: "Very Wide Phone" }, // Edge case
      ];

      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });

      ultraWideMobileScreens.forEach(({ width, height, device }) => {
        window.innerWidth = width;
        window.innerHeight = height;

        const { result } = renderHook(() => useMobileDetection());

        expect(result.current.deviceType).toBe("mobile");
        expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED
        expect(result.current.viewingDistance).toBe(14);

        console.log(
          `✅ Ultra-wide mobile ${device} (${width}x${height}) detected correctly`,
        );
      });
    });
  });

  describe("CRITICAL: Mobile Detection Debugging - Real User Cases", () => {
    it("SHOULD FAIL: User's mobile device being detected as desktop", () => {
      // CRITICAL TEST: This should expose the detection failure
      // User report: "Device type: desktop, adjustment: +0D" on mobile device

      // Test case 1: User's likely mobile user agent (common mobile patterns)
      const problematicMobileUserAgents = [
        // Mobile Safari that might lack clear mobile identifiers
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/604.1",
        // Android Chrome without explicit "Mobile" keyword
        "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        // Tablet user agent on mobile-sized screen (common issue)
        "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/604.1",
      ];

      problematicMobileUserAgents.forEach((userAgent) => {
        // Set mobile screen size (should force mobile detection)
        window.innerWidth = 390; // iPhone 14 Pro
        window.innerHeight = 844;

        Object.defineProperty(window.navigator, "userAgent", {
          value: userAgent,
          writable: true,
          configurable: true,
        });

        const { result } = renderHook(() => useMobileDetection());

        // THIS TEST SHOULD FAIL if detection is broken
        expect(result.current.deviceType).toBe("mobile");
        expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED

        // Log the failure for debugging
        if (result.current.deviceType !== "mobile") {
          console.error(
            `❌ DETECTION FAILURE: UA "${userAgent}" with screen ${window.innerWidth}x${window.innerHeight} detected as "${result.current.deviceType}"`,
          );
        }
      });
    });

    it("SHOULD FAIL: Mobile screen sizes not triggering mobile detection", () => {
      // CRITICAL TEST: Common mobile screen sizes should always detect as mobile
      const mobileScreenSizes = [
        { width: 390, height: 844, device: "iPhone 14 Pro" },
        { width: 393, height: 851, device: "iPhone 15 Pro" },
        { width: 375, height: 812, device: "iPhone 13/14" },
        { width: 414, height: 896, device: "iPhone 11/XR" },
        { width: 360, height: 800, device: "Samsung Galaxy S21" },
        { width: 412, height: 915, device: "Samsung Galaxy S22" },
        { width: 393, height: 873, device: "Google Pixel 7" },
        { width: 320, height: 568, device: "iPhone SE" },
      ];

      // Use ambiguous desktop user agent to test screen size fallback
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });

      mobileScreenSizes.forEach(({ width, height, device }) => {
        window.innerWidth = width;
        window.innerHeight = height;

        const { result } = renderHook(() => useMobileDetection());

        // THIS TEST SHOULD FAIL if screen size fallback is broken
        expect(result.current.deviceType).toBe("mobile");
        expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED

        // Log the failure for debugging
        if (result.current.deviceType !== "mobile") {
          console.error(
            `❌ SCREEN SIZE FAILURE: ${device} (${width}x${height}) detected as "${result.current.deviceType}"`,
          );
        }
      });
    });

    it("SHOULD FAIL: Detection logic priority order issues", () => {
      // CRITICAL TEST: Test detection priority when multiple signals conflict

      // Case 1: iPad user agent + mobile screen size = should be mobile
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390; // Mobile screen size
      window.innerHeight = 844;

      const { result: result1 } = renderHook(() => useMobileDetection());

      // Screen size should override tablet user agent when screen is mobile-sized
      expect(result1.current.deviceType).toBe("mobile");

      // Case 2: Desktop user agent + mobile screen = should be mobile
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        writable: true,
        configurable: true,
      });

      const { result: result2 } = renderHook(() => useMobileDetection());

      // Screen size should be primary detection method
      expect(result2.current.deviceType).toBe("mobile");
      expect(result2.current.calibrationAdjustment).toBe(2.0);
    });

    it("SHOULD FAIL: Calibration calculation for detected mobile devices", () => {
      // CRITICAL TEST: Ensure mobile devices get proper calibration adjustment

      // Setup confirmed mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;

      const { result } = renderHook(() => useMobileDetection());

      // User reports: Mobile 0.0D = Desktop +1.0D clarity
      // This means mobile needs +2.0D MORE than desktop for same clarity
      const baseCalibration = 2.0; // User's desktop setting
      const adjustedCalibration =
        result.current.getAdjustedCalibration(baseCalibration);

      // FIXED: Total should be 2.0 + 2.0 = 4.0D for equivalent clarity
      expect(adjustedCalibration).toBe(4.0);

      // Test edge case: 0.0D mobile should become 2.0D
      const zeroAdjusted = result.current.getAdjustedCalibration(0.0);
      expect(zeroAdjusted).toBe(2.0);
    });
  });

  describe("CRITICAL: Mobile Calibration Verification - User Requirements", () => {
    it("should apply +2.0D mobile adjustment correctly for user's use case", () => {
      // CRITICAL TEST: User reports mobile 0.0D = desktop +1.0D clarity
      // This means mobile needs +2.0D MORE adjustment than desktop

      // Setup mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;
      window.innerHeight = 844;

      const { result } = renderHook(() => useMobileDetection());

      // Verify device detected as mobile
      expect(result.current.deviceType).toBe("mobile");
      expect(result.current.calibrationAdjustment).toBe(2.0); // FIXED

      // Test user's reported scenarios
      console.log("🧪 TESTING USER'S MOBILE CALIBRATION SCENARIOS:");

      // Scenario 1: Mobile 0.0D should become 2.0D
      const mobile0D = result.current.getAdjustedCalibration(0.0);
      expect(mobile0D).toBe(2.0);
      console.log(
        `✅ Mobile 0.0D → ${mobile0D}D (should provide significant presbyopia effect)`,
      );

      // Scenario 2: User's +2.0D setting should become +4.0D
      const mobile2D = result.current.getAdjustedCalibration(2.0);
      expect(mobile2D).toBe(4.0);
      console.log(`✅ Mobile +2.0D → ${mobile2D}D (user's target setting)`);

      // Scenario 3: Mobile should require higher values for same clarity as desktop
      // FIXED: Desktop +1.0D equivalent should be mobile +3.0D (1.0 + 2.0)
      const mobileEquivalentTo1D = result.current.getAdjustedCalibration(1.0);
      expect(mobileEquivalentTo1D).toBe(3.0);
      console.log(
        `✅ Mobile +1.0D → ${mobileEquivalentTo1D}D (equivalent to desktop +1.0D)`,
      );
    });

    it("should match user's reported mobile experience: 0.0D clearest, gets blurrier with higher settings", () => {
      // CRITICAL TEST: User reports that mobile 0.0D is clearest, which is WRONG
      // This test verifies our calibration fix addresses this issue

      // Setup mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;

      const { result } = renderHook(() => useMobileDetection());

      // With our fix, mobile should get proper presbyopia simulation
      const adjustedValues = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map(
        (base) => ({
          base,
          adjusted: result.current.getAdjustedCalibration(base),
          shouldBeBlurrier: base > 0,
        }),
      );

      console.log("🧪 MOBILE CALIBRATION PROGRESSION:");
      adjustedValues.forEach(({ base, adjusted, shouldBeBlurrier }) => {
        console.log(
          `  Mobile ${base}D → ${adjusted}D ${shouldBeBlurrier ? "(should be blurrier)" : "(baseline)"}`,
        );

        // All mobile values should be significantly higher than desktop equivalent
        expect(adjusted).toBeGreaterThanOrEqual(base + 2.0);
      });

      // The progression should increase properly
      expect(adjustedValues[0].adjusted).toBe(2.0); // 0.0 + 2.0
      expect(adjustedValues[4].adjusted).toBe(4.0); // 2.0 + 2.0
      expect(adjustedValues[6].adjusted).toBe(5.0); // 3.0 + 2.0
    });

    it("should log device detection results for user debugging", () => {
      // CRITICAL TEST: Verify user will see proper detection logs

      const consoleSpy = vi.spyOn(console, "log");

      // Setup user's likely mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/604.1",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 390;
      window.innerHeight = 844;

      const { result } = renderHook(() => useMobileDetection());

      // User should see logs indicating mobile detection
      expect(consoleSpy).toHaveBeenCalledWith(
        "🎯 Device detection:",
        expect.objectContaining({
          type: "mobile",
          adjustment: "+2D", // FIXED: Actual format from useMobileDetection.ts
          viewingDistance: '14"',
        }),
      );

      // Log message for user
      console.log(
        "🎯 USER DEBUG INFO: Device detection logs are working correctly",
      );
      console.log(
        `✅ Device type: ${result.current.deviceType}, adjustment: +${result.current.calibrationAdjustment}D`,
      );

      consoleSpy.mockRestore();
    });
  });

  describe("CRITICAL: Real-world mobile calibration requirements", () => {
    it("should provide strong mobile calibration adjustment based on viewing distance", () => {
      // Setup mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 375;

      const { result } = renderHook(() => useMobileDetection());

      // CRITICAL TEST: Mobile adjustment should be at least +1.5D to +2.0D
      // User feedback: 0.0D on mobile = +1.0D desktop clarity
      // This means mobile needs approximately +2.0D MORE adjustment
      expect(result.current.calibrationAdjustment).toBeGreaterThanOrEqual(1.5);
      expect(result.current.calibrationAdjustment).toBeLessThanOrEqual(2.0);
    });

    it("should calculate distance-based diopter adjustment correctly", () => {
      // Setup mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 375;

      const { result } = renderHook(() => useMobileDetection());

      // CRITICAL TEST: Mobile 0.0D should require significantly more correction than desktop
      // Based on physics: closer distance = higher diopter requirement
      const mobileBaseBlur = result.current.getAdjustedCalibration(0.0);

      // Mobile 0.0D should become +1.5D to +2.0D after adjustment
      expect(mobileBaseBlur).toBeGreaterThanOrEqual(1.5);
      expect(mobileBaseBlur).toBeLessThanOrEqual(2.0);
    });

    it("should ensure mobile +2.0D provides equivalent clarity to desktop +2.0D", () => {
      // Test mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 375;

      const { result: mobileResult } = renderHook(() => useMobileDetection());

      // Reset to desktop environment
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 1920;

      const { result: desktopResult } = renderHook(() => useMobileDetection());

      // CRITICAL TEST: When user sets +2.0D on mobile, the effective blur should be similar
      // to desktop +2.0D, meaning mobile needs less additional blur since base is higher
      const mobileCalibratedValue =
        mobileResult.current.getAdjustedCalibration(2.0);
      const desktopCalibratedValue =
        desktopResult.current.getAdjustedCalibration(2.0);

      // Mobile at +2.0D setting should reach +3.5D to +4.0D total
      expect(mobileCalibratedValue).toBeGreaterThanOrEqual(3.5);
      expect(mobileCalibratedValue).toBeLessThanOrEqual(4.0);

      // Desktop should remain at +2.0D
      expect(desktopCalibratedValue).toBe(2.0);
    });

    it("should properly implement physics-based distance adjustment", () => {
      // Setup mobile environment
      Object.defineProperty(window.navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        writable: true,
        configurable: true,
      });
      window.innerWidth = 375;

      const { result } = renderHook(() => useMobileDetection());

      // CRITICAL TEST: Viewing distance should drive calibration adjustment
      // Mobile: 14" (0.3556m) ≈ 2.81D requirement
      // Desktop: 22.5" (0.5715m) ≈ 2.0D requirement
      // Difference: 2.81 - 2.0 = 1.06D minimum adjustment needed

      expect(result.current.viewingDistance).toBe(14); // Mobile viewing distance
      expect(result.current.calibrationAdjustment).toBeGreaterThanOrEqual(1.0); // Physics-based minimum
    });
  });
});
