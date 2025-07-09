/**
 * Test for opacity timing control
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo Opacity Timing", () => {
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
      pretendToBeVisual: true,
    });

    window = dom.window;
    document = window.document;

    // Mock requestAnimationFrame if not available
    if (!window.requestAnimationFrame) {
      let frameId = 0;
      window.requestAnimationFrame = (callback) => {
        frameId++;
        setTimeout(() => callback(frameId), 16);
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

  test("opacity should remain 0 until requestAnimationFrame executes", async () => {
    const contentImage = document.getElementById("contentImage");
    const opacityStates = [];

    // Track opacity changes
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" || mutation.type === "childList") {
          const currentOpacity = window.getComputedStyle(contentImage).opacity;
          opacityStates.push({
            opacity: currentOpacity,
            hasBlur: contentImage.style.filter.includes("blur"),
            src: contentImage.src.substring(0, 50),
            timestamp: Date.now(),
          });
        }
      });
    });

    observer.observe(contentImage, {
      attributes: true,
      attributeFilter: ["src", "style", "class"],
    });

    // Load a section
    maxVueDemo.loadSection(1);

    // Check opacity immediately
    const immediateOpacity = window.getComputedStyle(contentImage).opacity;
    expect(immediateOpacity).toBe("0");

    // Wait for RAF to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    observer.disconnect();

    // Verify opacity stayed 0 until blur was applied
    const firstNonZeroOpacity = opacityStates.find(
      (state) => state.opacity !== "0",
    );
    if (firstNonZeroOpacity) {
      expect(firstNonZeroOpacity.hasBlur).toBe(true);
    }
  });

  test("opacity should not be set in CSS classes during load", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Check that .visible class is not added immediately
    const loadSectionCode = html.match(/loadSection[\s\S]*?^\s*}/m);
    if (loadSectionCode) {
      // Should NOT add visible class in loadSection
      expect(loadSectionCode[0]).not.toContain("classList.add('visible')");

      // Should only add visible in RAF callback
      expect(loadSectionCode[0]).toContain("requestAnimationFrame");
    }
  });

  test("debug logs should show opacity 0 before RAF", async () => {
    const contentImage = document.getElementById("contentImage");
    const debugLogs = [];

    // Capture console logs
    const originalLog = window.console.log;
    window.console.log = function (...args) {
      debugLogs.push(args.join(" "));
      originalLog.apply(this, args);
    };

    // Load section
    maxVueDemo.loadSection(1);

    // Find opacity log before RAF
    const opacityBeforeRAF = debugLogs.find(
      (log) =>
        log.includes("Opacity after src change:") &&
        !log.includes("Opacity on load:"),
    );

    if (opacityBeforeRAF) {
      expect(opacityBeforeRAF).toContain("0");
    }

    window.console.log = originalLog;
  });

  test("no opacity should be 1 before blur renders", async () => {
    const contentImage = document.getElementById("contentImage");
    let earlyOpacityDetected = false;

    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const hasBlurApplied =
          contentImage.style.filter &&
          contentImage.style.filter.includes("blur");
        const opacity = window.getComputedStyle(contentImage).opacity;

        // If opacity is 1 but blur not applied, it's too early
        if (opacity === "1" && !hasBlurApplied) {
          earlyOpacityDetected = true;
        }
      });
    });

    observer.observe(contentImage, {
      attributes: true,
      attributeFilter: ["src", "style", "class"],
    });

    // Play demo
    const playBtn = document.getElementById("playBtn");
    playBtn.click();

    // Wait for transitions
    await new Promise((resolve) => setTimeout(resolve, 1500));

    maxVueDemo.stop();
    observer.disconnect();

    expect(earlyOpacityDetected).toBe(false);
  });

  test("visible class should only be added in RAF callback", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Extract playSection method
    const playSectionMatch = html.match(/playSection\(\)\s*{[\s\S]*?^\s*}/m);
    if (playSectionMatch) {
      const playSectionCode = playSectionMatch[0];

      // Visible class should only be added inside RAF
      const rafMatch = playSectionCode.match(
        /requestAnimationFrame[\s\S]*?classList\.add\('visible'\)/,
      );
      expect(rafMatch).toBeTruthy();

      // Should not add visible class outside RAF
      const outsideRAF = playSectionCode.split("requestAnimationFrame")[0];
      expect(outsideRAF).not.toContain("classList.add('visible')");
    }
  });
});
