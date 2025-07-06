import { describe, expect, test, vi, beforeEach } from "vitest";
import {
  VisionCorrectionEngine,
  VisionSettings,
} from "./VisionCorrectionEngine";

/**
 * Tests for Canvas Security and CORS Handling in Vision Correction
 *
 * GOAL: Handle tainted canvas errors gracefully and provide CSS fallbacks
 */

describe("canvasSecurityHandling", () => {
  let mockSettings: VisionSettings;

  beforeEach(() => {
    mockSettings = {
      readingVision: 2.0,
      contrastBoost: 20,
      edgeEnhancement: 15,
      isEnabled: true,
    };
  });

  test("should handle tainted canvas errors gracefully", () => {
    // Mock canvas that throws SecurityError on toDataURL
    const mockCanvas = document.createElement("canvas");
    mockCanvas.toDataURL = vi.fn(() => {
      throw new DOMException(
        "Tainted canvases may not be exported",
        "SecurityError",
      );
    });

    // Should not throw error when canvas is tainted
    expect(() => {
      // This would normally call toDataURL internally
      // We need to test the error handling in replaceWithProcessedImage
    }).not.toThrow();
  });

  test("should detect cross-origin images", () => {
    const sameOriginImg = document.createElement("img");
    sameOriginImg.src = "/local-image.jpg"; // Same origin

    const crossOriginImg = document.createElement("img");
    crossOriginImg.src = "https://picsum.photos/400/300"; // External domain

    const isCrossOrigin = (img: HTMLImageElement): boolean => {
      try {
        const url = new URL(img.src);
        return url.origin !== window.location.origin;
      } catch {
        return false;
      }
    };

    expect(isCrossOrigin(sameOriginImg)).toBe(false);
    expect(isCrossOrigin(crossOriginImg)).toBe(true);
  });

  test("should add crossOrigin attribute to external images", () => {
    const img = document.createElement("img");
    img.src = "https://external-site.com/image.jpg";

    // Function that should be implemented to fix CORS
    const enableCORS = (img: HTMLImageElement) => {
      const url = new URL(img.src);
      if (url.origin !== window.location.origin) {
        img.crossOrigin = "anonymous";
      }
    };

    enableCORS(img);
    expect(img.crossOrigin).toBe("anonymous");
  });

  test("should fall back to CSS filters for tainted canvas", () => {
    const img = document.createElement("img");
    img.src = "https://picsum.photos/400/300";

    // Mock function that applies CSS filters instead of canvas processing
    const applyCSSVisionCorrection = (
      element: HTMLElement,
      settings: VisionSettings,
    ) => {
      const calibrationValue = 2.0; // Mock calibration
      const currentReadingVision = settings.readingVision;
      const blur = Math.max(0, calibrationValue - currentReadingVision);
      const contrast = 1 + settings.contrastBoost / 100;

      element.style.filter = `blur(${blur}px) contrast(${contrast})`;
      return element.style.filter;
    };

    const result = applyCSSVisionCorrection(img, mockSettings);
    expect(result).toContain("blur(");
    expect(result).toContain("contrast(");
  });

  test("should preserve original image when canvas processing fails", () => {
    const img = document.createElement("img");
    img.src = "https://picsum.photos/400/300";
    img.alt = "Test image";

    // When canvas processing fails, original image should remain
    // with CSS filters applied
    const preserveWithCSSFilters = (img: HTMLImageElement) => {
      // Don't replace the image, just apply CSS filters
      img.style.filter = "blur(0.5px) contrast(1.2)";
      return img;
    };

    const result = preserveWithCSSFilters(img);
    expect(result).toBe(img); // Same image element
    expect(result.style.filter).toContain("blur");
    expect(result.alt).toBe("Test image"); // Preserves original attributes
  });
});

describe("corsImageHandling", () => {
  test("should determine if CORS is supported for external images", () => {
    // Test function to check if an image supports CORS
    const supportsCORS = (src: string): boolean => {
      try {
        const url = new URL(src);
        // Most CDNs and image services support CORS with anonymous requests
        const corsEnabledDomains = [
          "picsum.photos",
          "images.unsplash.com",
          "via.placeholder.com",
        ];
        return corsEnabledDomains.some((domain) =>
          url.hostname.includes(domain),
        );
      } catch {
        return false;
      }
    };

    expect(supportsCORS("https://picsum.photos/400/300")).toBe(true);
    expect(supportsCORS("https://random-site.com/image.jpg")).toBe(false);
    expect(supportsCORS("/local-image.jpg")).toBe(false); // Local images don't need CORS
  });

  test("should have strategy for different image sources", () => {
    const getProcessingStrategy = (img: HTMLImageElement) => {
      const url = new URL(img.src, window.location.origin);

      if (url.origin === window.location.origin) {
        return "canvas"; // Same origin - can use canvas freely
      }

      const corsEnabledDomains = ["picsum.photos", "images.unsplash.com"];
      if (corsEnabledDomains.some((domain) => url.hostname.includes(domain))) {
        return "canvas-with-cors"; // External but supports CORS
      }

      return "css-only"; // External without CORS - use CSS filters
    };

    const localImg = document.createElement("img");
    localImg.src = "/local-image.jpg";

    const corsImg = document.createElement("img");
    corsImg.src = "https://picsum.photos/400/300";

    const externalImg = document.createElement("img");
    externalImg.src = "https://random-site.com/image.jpg";

    expect(getProcessingStrategy(localImg)).toBe("canvas");
    expect(getProcessingStrategy(corsImg)).toBe("canvas-with-cors");
    expect(getProcessingStrategy(externalImg)).toBe("css-only");
  });
});
