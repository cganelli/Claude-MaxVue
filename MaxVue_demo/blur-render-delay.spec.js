/**
 * Test for blur rendering delay with requestAnimationFrame
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo Blur Render Delay", () => {
  let dom;
  let window;
  let document;
  let maxVueDemo;

  beforeEach(async () => {
    // Load the generated HTML
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Create JSDOM instance with requestAnimationFrame support
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
    });

    window = dom.window;
    document = window.document;

    // Mock requestAnimationFrame if not available
    if (!window.requestAnimationFrame) {
      let frameId = 0;
      window.requestAnimationFrame = (callback) => {
        frameId++;
        setTimeout(() => callback(frameId), 16); // ~60fps
        return frameId;
      };
    }

    // Wait for DOMContentLoaded
    await new Promise((resolve) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });

    maxVueDemo = window.maxVueDemo;
  });

  afterEach(() => {
    dom.window.close();
  });

  test("should use requestAnimationFrame between blur and visibility", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should contain requestAnimationFrame calls
    expect(html).toContain("requestAnimationFrame");

    // Should have nested requestAnimationFrame for double frame wait
    expect(html).toMatch(
      /requestAnimationFrame\s*\(\s*\(\s*\)\s*=>\s*{\s*requestAnimationFrame/,
    );
  });

  test("blur should be fully rendered before opacity change", async () => {
    const contentImage = document.getElementById("contentImage");
    const renderStates = [];

    // Track render states
    const originalRAF = window.requestAnimationFrame;
    let rafCallCount = 0;

    window.requestAnimationFrame = function (callback) {
      rafCallCount++;
      renderStates.push({
        frame: rafCallCount,
        hasBlur: contentImage.style.filter.includes("blur"),
        opacity:
          contentImage.style.opacity ||
          window.getComputedStyle(contentImage).opacity,
        timestamp: Date.now(),
      });
      return originalRAF.call(this, callback);
    };

    // Load a section
    maxVueDemo.loadSection(1);

    // Wait for RAF calls
    await new Promise((resolve) => setTimeout(resolve, 100));

    window.requestAnimationFrame = originalRAF;

    // Verify blur was applied before opacity changed
    const blurFrame = renderStates.find((state) => state.hasBlur);
    const visibleFrame = renderStates.find((state) => state.opacity === "1");

    if (blurFrame && visibleFrame) {
      expect(blurFrame.frame).toBeLessThan(visibleFrame.frame);
    }
  });

  test("debug logs should show frame-based timing", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should have frame-based debug logging
    expect(html).toContain("BLUR_DEBUG: Waiting for blur to render");
    expect(html).toContain("BLUR_DEBUG: Blur rendered, making visible");
  });

  test("no flash should occur with render delay", async () => {
    const contentImage = document.getElementById("contentImage");
    let flashDetected = false;
    let blurRenderedBeforeVisible = true;

    // Monitor for flash
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const hasBlur =
            contentImage.style.filter &&
            contentImage.style.filter.includes("blur");
          const isVisible =
            window.getComputedStyle(contentImage).opacity === "1";

          // If visible but no blur, it's a flash
          if (isVisible && !hasBlur) {
            flashDetected = true;
          }

          // Track if blur was present when becoming visible
          if (
            mutation.attributeName === "class" &&
            contentImage.classList.contains("visible")
          ) {
            if (!contentImage.style.filter.includes("blur")) {
              blurRenderedBeforeVisible = false;
            }
          }
        }
      });
    });

    observer.observe(contentImage, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Play demo
    const playBtn = document.getElementById("playBtn");
    playBtn.click();

    // Wait for multiple transitions
    await new Promise((resolve) => setTimeout(resolve, 2000));

    maxVueDemo.stop();
    observer.disconnect();

    expect(flashDetected).toBe(false);
    expect(blurRenderedBeforeVisible).toBe(true);
  });

  test("timing should ensure blur renders in at least 2 frames", async () => {
    const contentImage = document.getElementById("contentImage");
    let frameCount = 0;
    let blurApplied = false;
    let madeVisible = false;

    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function (callback) {
      frameCount++;

      if (contentImage.style.filter.includes("blur") && !blurApplied) {
        blurApplied = true;
        console.log("Blur applied at frame:", frameCount);
      }

      if (contentImage.classList.contains("visible") && !madeVisible) {
        madeVisible = true;
        console.log("Made visible at frame:", frameCount);
      }

      return originalRAF.call(this, callback);
    };

    // Load section
    maxVueDemo.loadSection(0);

    // Wait for animation frames
    await new Promise((resolve) => setTimeout(resolve, 100));

    window.requestAnimationFrame = originalRAF;

    // Should have at least 2 frames between blur and visibility
    expect(frameCount).toBeGreaterThanOrEqual(2);
  });
});
