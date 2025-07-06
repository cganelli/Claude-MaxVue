import { describe, expect, test, vi, beforeEach } from "vitest";
import { VisionCorrectionEngine } from "./VisionCorrectionEngine";

// Mock DOM environment
Object.defineProperty(globalThis, "document", {
  value: {
    createElement: (tagName: string) => {
      const element = {
        tagName: tagName.toUpperCase(),
        src: "",
        alt: "",
        className: "",
        style: { cssText: "", display: "" },
        setAttribute: vi.fn(),
        getAttribute: vi.fn().mockReturnValue(null),
        hasAttribute: vi.fn().mockReturnValue(false),
        removeAttribute: vi.fn(),
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn().mockReturnValue(false),
        },
        parentNode: null,
        nextSibling: null,
        width: 100,
        height: 100,
        complete: true, // Important for image processing
        crossOrigin: null,
        getContext: vi.fn().mockReturnValue({
          drawImage: vi.fn(),
          getImageData: vi.fn(),
          putImageData: vi.fn(),
          filter: "",
        }),
        toDataURL: vi.fn().mockReturnValue("data:image/png;base64,mock"),
        onload: null,
        onerror: null,
      };

      // Make it behave like an HTMLImageElement
      if (tagName.toLowerCase() === "img") {
        Object.setPrototypeOf(element, HTMLImageElement.prototype);
      }

      return element;
    },
  },
});

// Mock localStorage
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: vi.fn().mockReturnValue("2.0"),
    setItem: vi.fn(),
  },
});

/**
 * Tests for infinite image processing loop prevention
 *
 * CRITICAL REQUIREMENTS:
 * - Images should only be processed once
 * - Reprocessing same image should be prevented
 * - Console should not show repeated processing messages
 * - Images should remain stable after processing
 */

describe("VisionCorrectionEngine infinite loop prevention", () => {
  let engine: VisionCorrectionEngine;
  let consoleLogSpy: any;

  beforeEach(() => {
    const settings = {
      readingVision: 2.0,
      contrastBoost: 1.1,
      edgeEnhancement: 1.2,
      isEnabled: true,
    };
    engine = new VisionCorrectionEngine(settings);
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  test("should not reprocess same image element multiple times", () => {
    // Create mock image element
    const img = document.createElement("img");
    img.src = "https://picsum.photos/400/300?random=1";
    img.setAttribute("data-testid", "test-image");

    // Mock the DOM methods
    const mockParentNode = {
      insertBefore: vi.fn(),
      replaceChild: vi.fn(),
    };
    Object.defineProperty(img, "parentNode", {
      value: mockParentNode,
      writable: true,
    });

    // Process the image multiple times
    engine.processElement(img);
    engine.processElement(img);
    engine.processElement(img);

    // Should only process once - check by counting console logs
    const processingLogs = consoleLogSpy.mock.calls.filter(
      (call) => call[0]?.includes("Processing") && call[0]?.includes("image"),
    );

    // Should only have one processing call, not multiple
    expect(processingLogs.length).toBeLessThanOrEqual(1);
  });

  test("should track processed images to prevent reprocessing", () => {
    const img1 = document.createElement("img");
    img1.src = "https://picsum.photos/400/300?random=1";

    const img2 = document.createElement("img");
    img2.src = "https://picsum.photos/400/300?random=2";

    // Mock DOM methods
    [img1, img2].forEach((img) => {
      Object.defineProperty(img, "parentNode", {
        value: { insertBefore: vi.fn(), replaceChild: vi.fn() },
        writable: true,
      });
    });

    // Process both images
    engine.processElement(img1);
    engine.processElement(img2);

    // Process same images again - should be skipped
    engine.processElement(img1);
    engine.processElement(img2);

    // Should have data-processed attribute or similar tracking
    expect(
      img1.hasAttribute("data-vision-processed") ||
        img1.classList.contains("vision-processed"),
    ).toBe(true);
    expect(
      img2.hasAttribute("data-vision-processed") ||
        img2.classList.contains("vision-processed"),
    ).toBe(true);
  });

  test("should handle rapid successive processing calls", () => {
    const img = document.createElement("img");
    img.src = "https://picsum.photos/400/300?random=1";

    Object.defineProperty(img, "parentNode", {
      value: { insertBefore: vi.fn(), replaceChild: vi.fn() },
      writable: true,
    });

    // Simulate rapid successive calls (like what happens in the bug)
    for (let i = 0; i < 10; i++) {
      engine.processElement(img);
    }

    // Should not process more than once
    const processingLogs = consoleLogSpy.mock.calls.filter(
      (call) =>
        call[0]?.includes("Processing") && call[1]?.includes("random=1"),
    );

    expect(processingLogs.length).toBeLessThanOrEqual(1);
  });

  test("should prevent processing during canvas generation", () => {
    const img = document.createElement("img");
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    Object.defineProperty(img, "parentNode", {
      value: { insertBefore: vi.fn(), replaceChild: vi.fn() },
      writable: true,
    });

    // Mock canvas processing that takes time
    const originalProcessImage = engine["processImage"];
    engine["processImage"] = vi.fn().mockImplementation((img) => {
      // Simulate slow canvas processing
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      return canvas;
    });

    // Start processing
    engine.processElement(img);

    // Try to process again immediately (should be prevented)
    engine.processElement(img);

    // Should have some indication it's being processed
    expect(
      img.hasAttribute("data-vision-processing") ||
        img.hasAttribute("data-vision-processed") ||
        img.classList.contains("vision-processing"),
    ).toBe(true);
  });

  test("should clear processing state on completion", () => {
    const img = document.createElement("img");
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    Object.defineProperty(img, "parentNode", {
      value: { insertBefore: vi.fn(), replaceChild: vi.fn() },
      writable: true,
    });

    // Process image
    engine.processElement(img);

    // After processing, should have completed state
    expect(img.hasAttribute("data-vision-processed")).toBe(true);
    expect(img.hasAttribute("data-vision-processing")).toBe(false);
  });

  test("should handle processing errors gracefully", () => {
    const img = document.createElement("img");
    img.src = "https://picsum.photos/400/300?random=1";

    Object.defineProperty(img, "parentNode", {
      value: { insertBefore: vi.fn(), replaceChild: vi.fn() },
      writable: true,
    });

    // Mock error in canvas processing
    const originalProcessImage = engine["processImage"];
    engine["processImage"] = vi.fn().mockImplementation(() => {
      throw new Error("Canvas processing failed");
    });

    // Should not throw and should handle gracefully
    expect(() => {
      engine.processElement(img);
    }).not.toThrow();

    // Should mark as processed to prevent retries
    expect(
      img.hasAttribute("data-vision-processed") ||
        img.hasAttribute("data-vision-error"),
    ).toBe(true);
  });
});
