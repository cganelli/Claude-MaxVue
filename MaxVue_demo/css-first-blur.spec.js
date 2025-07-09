/**
 * Test for CSS-first blur approach
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo CSS-First Blur", () => {
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

  test("images should have blur as default CSS state", async () => {
    const contentImage = document.getElementById("contentImage");

    // Check initial CSS state
    const computedStyle = window.getComputedStyle(contentImage);
    const filterValue = computedStyle.filter;

    // Should have blur by default in CSS, not via JavaScript classes
    expect(filterValue).toContain("blur");

    // Should NOT have clear class initially
    expect(contentImage.classList.contains("clear")).toBe(false);
  });

  test("CSS should define blur as default filter state", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // CSS should set filter: blur(6px) as default
    expect(html).toMatch(/\.content-image\s*{[^}]*filter:\s*blur\(6px\)/);

    // Clear class should only remove blur, not add it
    expect(html).toMatch(
      /\.content-image\.clear\s*{[^}]*filter:\s*blur\(0px\)/,
    );

    // Should NOT have JavaScript adding blur classes
    expect(html).not.toContain("classList.add('blur'");
    expect(html).not.toContain("classList.remove('blur'");
  });

  test("JavaScript should only manage clear state, never blur state", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Extract JavaScript code
    const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
    expect(scriptMatch).toBeTruthy();
    const jsCode = scriptMatch[1];

    // Should add clear class to remove blur
    expect(jsCode).toContain("classList.add('clear')");

    // Should remove clear class to restore blur
    expect(jsCode).toContain("classList.remove('clear')");

    // Should NOT add or remove blur classes
    expect(jsCode).not.toContain("blur");
    expect(jsCode).not.toContain("classList.add('visible')");
    expect(jsCode).not.toContain("classList.remove('visible')");
  });

  test("no flash should occur during image transitions", async () => {
    const contentImage = document.getElementById("contentImage");
    let flashDetected = false;

    // Monitor for any moment where image is visible without blur
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const computedStyle = window.getComputedStyle(contentImage);
        const hasBlur =
          computedStyle.filter.includes("blur") &&
          !contentImage.classList.contains("clear");
        const isVisible =
          computedStyle.opacity !== "0" && computedStyle.display !== "none";

        // If image is visible but doesn't have blur, it's a flash
        if (isVisible && !hasBlur) {
          flashDetected = true;
        }
      });
    });

    observer.observe(contentImage, {
      attributes: true,
      attributeFilter: ["src", "class"],
    });

    // Start demo and run through transitions
    const playBtn = document.getElementById("playBtn");
    playBtn.click();

    // Wait for multiple section transitions
    await new Promise((resolve) => setTimeout(resolve, 1500));

    maxVueDemo.stop();
    observer.disconnect();

    expect(flashDetected).toBe(false);
  });

  test("blur should be applied immediately on image load", async () => {
    const contentImage = document.getElementById("contentImage");

    // Track image load events
    const loadEvents = [];

    const originalOnLoad = contentImage.onload;
    contentImage.onload = function () {
      const computedStyle = window.getComputedStyle(contentImage);
      const hasBlur =
        computedStyle.filter.includes("blur") &&
        !contentImage.classList.contains("clear");

      loadEvents.push({
        hasBlur: hasBlur,
        classList: Array.from(contentImage.classList),
        timestamp: Date.now(),
      });

      if (originalOnLoad) originalOnLoad.call(this);
    };

    // Load different sections
    maxVueDemo.loadSection(1);
    await new Promise((resolve) => setTimeout(resolve, 100));

    maxVueDemo.loadSection(2);
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Every load event should have blur applied
    loadEvents.forEach((event) => {
      expect(event.hasBlur).toBe(true);
    });
  });
});
