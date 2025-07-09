/**
 * Critical test for blur-before-visibility requirement
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo Blur Before Visibility", () => {
  let dom;
  let window;
  let document;
  let maxVueDemo;

  beforeEach(async () => {
    // Load the generated HTML
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Create JSDOM instance
    dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
    });

    window = dom.window;
    document = window.document;

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

  test("images should have blur applied before becoming visible", async () => {
    const contentImage = document.getElementById("contentImage");

    // Track when image becomes visible and when blur is applied
    const visibilityEvents = [];

    // Mock image onload to track when it becomes visible
    const originalLoad = contentImage.onload;
    contentImage.onload = function () {
      const hasBlur = window
        .getComputedStyle(contentImage)
        .filter.includes("blur");
      const isVisible =
        window.getComputedStyle(contentImage).opacity !== "0" &&
        window.getComputedStyle(contentImage).display !== "none";

      visibilityEvents.push({
        event: "image_loaded",
        hasBlur: hasBlur,
        isVisible: isVisible,
        timestamp: Date.now(),
      });

      if (originalLoad) originalLoad.call(this);
    };

    // Track CSS class changes
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const hasBlur = !contentImage.classList.contains("clear");
          const isVisible =
            window.getComputedStyle(contentImage).opacity !== "0" &&
            window.getComputedStyle(contentImage).display !== "none";

          visibilityEvents.push({
            event: "class_changed",
            hasBlur: hasBlur,
            isVisible: isVisible,
            classList: Array.from(contentImage.classList),
            timestamp: Date.now(),
          });
        }
      });
    });

    observer.observe(contentImage, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Start demo
    const playBtn = document.getElementById("playBtn");
    playBtn.click();

    // Wait for first section to load
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Stop demo and analyze events
    maxVueDemo.stop();
    observer.disconnect();

    // Critical requirement: Every time an image becomes visible, it must have blur applied
    const visibleEvents = visibilityEvents.filter((event) => event.isVisible);

    visibleEvents.forEach((event, index) => {
      expect(event.hasBlur).toBe(true);
    });

    // Additional check: First event should be image with blur
    expect(visibilityEvents.length).toBeGreaterThan(0);
    if (visibilityEvents.length > 0) {
      const firstVisibleEvent = visibilityEvents.find((e) => e.isVisible);
      expect(firstVisibleEvent?.hasBlur).toBe(true);
    }
  });

  test("images should never flash clear before blur application", async () => {
    const contentImage = document.getElementById("contentImage");
    let flashDetected = false;

    // Create mutation observer to detect clear flashes
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "src"
        ) {
          // Image src changed - check if it's visible and clear
          const isVisible =
            window.getComputedStyle(contentImage).opacity !== "0" &&
            window.getComputedStyle(contentImage).display !== "none";
          const isClear = contentImage.classList.contains("clear");

          if (isVisible && isClear) {
            // This is a flash - image is visible and clear immediately after src change
            flashDetected = true;
          }
        }
      });
    });

    observer.observe(contentImage, { attributes: true });

    // Start demo and cycle through sections
    const playBtn = document.getElementById("playBtn");
    playBtn.click();

    // Wait for multiple sections to ensure no flash
    await new Promise((resolve) => setTimeout(resolve, 1000));

    maxVueDemo.stop();
    observer.disconnect();

    expect(flashDetected).toBe(false);
  });

  test("timing should be 5 seconds with 3s blur and 2s clear", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should have 5000ms timeout for section duration
    expect(html).toContain("5000");

    // Should have 3000ms timeout for blur duration
    expect(html).toContain("3000");

    // Progress bar should be configured for 5 seconds
    // 5 seconds = 5000ms, with 100ms intervals = 50 steps, so 2% per step
    expect(html).toContain("progress += 2");
  });
});
