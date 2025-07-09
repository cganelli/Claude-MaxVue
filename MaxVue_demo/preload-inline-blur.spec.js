/**
 * Test for pre-load with inline blur approach
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo Pre-load Inline Blur", () => {
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

  test("images should have inline blur style applied before visibility", async () => {
    const contentImage = document.getElementById("contentImage");

    // Check that inline style has blur
    const inlineStyle = contentImage.style.filter;
    expect(inlineStyle).toContain("blur");

    // Should have blur in inline style, not just CSS class
    expect(contentImage.getAttribute("style")).toContain("filter: blur(6px)");
  });

  test("image order should be Email → Spotify → Pug → Wikipedia → Flowers", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Extract sections array from HTML
    const sectionsMatch = html.match(/this\.sections = (\[[^\]]+\]);/);
    expect(sectionsMatch).toBeTruthy();

    const sections = JSON.parse(sectionsMatch[1]);

    // Verify correct order
    expect(sections[0].name).toBe("Email");
    expect(sections[1].name).toBe("Music App");
    expect(sections[2].name).toBe("Photo");
    expect(sections[3].name).toBe("Website");
    expect(sections[4].name).toBe("Camera");
  });

  test("debug logging should track blur timing vs visibility", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should have debug console.log statements
    expect(html).toContain("console.log");
    expect(html).toContain("BLUR_DEBUG");
    expect(html).toContain("VISIBILITY_DEBUG");
  });

  test("images should never be visible without blur", async () => {
    const contentImage = document.getElementById("contentImage");
    let flashDetected = false;
    const debugEvents = [];

    // Intercept console.log to capture debug info
    const originalLog = window.console.log;
    window.console.log = function (...args) {
      debugEvents.push(args.join(" "));
      originalLog.apply(this, args);
    };

    // Monitor DOM changes
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const hasInlineBlur =
            contentImage.style.filter &&
            contentImage.style.filter.includes("blur");
          const hasCSSBlur = !contentImage.classList.contains("clear");
          const isOpaque =
            window.getComputedStyle(contentImage).opacity !== "0";

          if (isOpaque && !hasInlineBlur && !hasCSSBlur) {
            flashDetected = true;
            debugEvents.push(
              `FLASH_DETECTED: opacity=${window.getComputedStyle(contentImage).opacity}, inline=${contentImage.style.filter}, class=${Array.from(contentImage.classList)}`,
            );
          }
        }
      });
    });

    observer.observe(contentImage, {
      attributes: true,
      attributeFilter: ["style", "class", "src"],
    });

    // Start demo
    const playBtn = document.getElementById("playBtn");
    playBtn.click();

    // Wait for transitions
    await new Promise((resolve) => setTimeout(resolve, 2000));

    maxVueDemo.stop();
    observer.disconnect();
    window.console.log = originalLog;

    // Log debug events for analysis
    console.log("Debug events:", debugEvents);

    expect(flashDetected).toBe(false);
  });

  test("each image should load individually without flash", async () => {
    const contentImage = document.getElementById("contentImage");
    const individualTests = [];

    // Test each section individually
    for (let i = 0; i < 5; i++) {
      let sectionFlash = false;

      const observer = new window.MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "src") {
            const hasBlur =
              contentImage.style.filter &&
              contentImage.style.filter.includes("blur");
            const isVisible =
              window.getComputedStyle(contentImage).opacity !== "0";

            if (isVisible && !hasBlur) {
              sectionFlash = true;
            }
          }
        });
      });

      observer.observe(contentImage, { attributes: true });

      // Load section
      maxVueDemo.loadSection(i);
      await new Promise((resolve) => setTimeout(resolve, 100));

      observer.disconnect();

      individualTests.push({
        section: i,
        hasFlash: sectionFlash,
      });
    }

    // All sections should load without flash
    individualTests.forEach((test) => {
      expect(test.hasFlash).toBe(false);
    });
  });

  test("opacity transitions should be used instead of display changes", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should use opacity transitions
    expect(html).toContain("transition: opacity");

    // Should not use display: none
    expect(html).not.toContain("display: none");

    // Should not use visibility: hidden
    expect(html).not.toContain("visibility: hidden");
  });
});
