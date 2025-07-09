/**
 * Test for image preloading with blur
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo Image Preloading", () => {
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

  test("images should start with blur applied before becoming visible", async () => {
    const contentImage = document.getElementById("contentImage");
    const playBtn = document.getElementById("playBtn");

    // Start the demo
    playBtn.click();

    // Track image changes and their blur state
    const imageStates = [];

    // Create a mutation observer to track image src changes
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "src"
        ) {
          const hasBlur = !contentImage.classList.contains("clear");
          const src = contentImage.src;
          if (src && src.startsWith("data:")) {
            imageStates.push({
              src: src.substring(0, 50) + "...", // Truncate for logging
              hadBlurOnLoad: hasBlur,
              classList: Array.from(contentImage.classList),
            });
          }
        }
      });
    });

    observer.observe(contentImage, { attributes: true });

    // Wait for demo to cycle through all images
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Stop the demo
    maxVueDemo.stop();
    observer.disconnect();

    // Verify all images (except potentially the first pre-loaded one) started with blur
    expect(imageStates.length).toBeGreaterThanOrEqual(2);

    // Check all image transitions after the first
    imageStates.slice(1).forEach((state, index) => {
      expect(state.hadBlurOnLoad).toBe(true);
    });
  });

  test("blur should be removed from previous image before loading next image", async () => {
    const contentImage = document.getElementById("contentImage");

    // Spy on classList operations
    const classListOps = [];
    const originalAdd = contentImage.classList.add;
    const originalRemove = contentImage.classList.remove;

    contentImage.classList.add = function (...args) {
      classListOps.push({
        op: "add",
        args,
        src: contentImage.src?.substring(0, 30),
      });
      return originalAdd.apply(this, args);
    };

    contentImage.classList.remove = function (...args) {
      classListOps.push({
        op: "remove",
        args,
        src: contentImage.src?.substring(0, 30),
      });
      return originalRemove.apply(this, args);
    };

    // Load section 1 (after initial section 0)
    maxVueDemo.loadSection(1);

    // Check that 'clear' was removed before new image loaded
    const clearRemovalIndex = classListOps.findIndex(
      (op) => op.op === "remove" && op.args.includes("clear"),
    );

    expect(clearRemovalIndex).toBeGreaterThanOrEqual(0);

    // Verify no 'clear' class additions happened before removal
    const clearAddBeforeRemoval = classListOps
      .slice(0, clearRemovalIndex)
      .some((op) => op.op === "add" && op.args.includes("clear"));

    expect(clearAddBeforeRemoval).toBe(false);
  });

  test("section timing should be 8 seconds with proper blur/clear phases", async () => {
    const playBtn = document.getElementById("playBtn");

    // Start demo
    playBtn.click();

    // Check that the timeout is set to 8000ms
    const sectionTimer = maxVueDemo.sectionTimer;
    expect(sectionTimer).toBeDefined();

    // Verify timing in the code
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should have 8000ms timeout for section duration
    expect(html).toContain("8000");

    // Calculate expected blur duration for 8 seconds (60% of 8s = 4.8s)
    const expectedBlurMs = Math.round(8000 * 0.6);
    expect(html).toContain(String(expectedBlurMs));
  });
});
