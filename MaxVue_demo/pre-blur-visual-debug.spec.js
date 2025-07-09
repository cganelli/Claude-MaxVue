/**
 * Test for pre-blur CSS approach with visual debugging
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo Pre-Blur Visual Debug", () => {
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

  test("CSS should have blur filter with !important", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should have blur in CSS with !important
    expect(html).toMatch(/filter:\s*blur\(\d+px\)\s*!important/);

    // Clear class should override with !important
    expect(html).toMatch(
      /\.content-image\.clear\s*{[^}]*filter:\s*blur\(0px\)\s*!important/,
    );
  });

  test("stronger blur value should be used for testing", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should use 20px blur for better visibility
    expect(html).toContain("blur(20px)");
  });

  test("visual border indicator should show blur state", async () => {
    const contentImage = document.getElementById("contentImage");

    // Should have border when blur is active
    const borderStyle = window.getComputedStyle(contentImage).border;
    expect(borderStyle).toBeTruthy();

    // Border should change when clear class is added
    contentImage.classList.add("clear");
    const clearBorderStyle = window.getComputedStyle(contentImage).border;
    expect(clearBorderStyle).not.toBe(borderStyle);
  });

  test("blur should be in base CSS, not applied via JavaScript", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should have blur in base .content-image CSS
    expect(html).toMatch(
      /\.content-image\s*{[^}]*filter:\s*blur\(\d+px\)\s*!important/,
    );

    // Should NOT set blur via JavaScript
    const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
    if (scriptMatch) {
      const jsCode = scriptMatch[1];
      expect(jsCode).not.toContain("style.filter = 'blur");
    }
  });

  test("debug logging should include border color info", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Should log border state for debugging
    expect(html).toContain("VISUAL_DEBUG: Border");
  });

  test("blur filter should persist through image changes", async () => {
    const contentImage = document.getElementById("contentImage");

    // Get initial filter
    const initialFilter = window.getComputedStyle(contentImage).filter;
    expect(initialFilter).toContain("blur");

    // Change src
    contentImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

    // Filter should still be there
    const afterSrcFilter = window.getComputedStyle(contentImage).filter;
    expect(afterSrcFilter).toContain("blur");

    // Load a section
    maxVueDemo.loadSection(1);

    // Filter should still be there
    const afterLoadFilter = window.getComputedStyle(contentImage).filter;
    expect(afterLoadFilter).toContain("blur");
  });

  test("CSS transitions should not interfere with initial blur", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Check that transitions don't delay initial blur
    expect(html).toMatch(/transition:[^;]*filter[^;]*2s/);

    // But blur should be immediate via CSS
    expect(html).toContain("!important");
  });

  test("image element should have blur from the start", async () => {
    const contentImage = document.getElementById("contentImage");

    // Remove all classes to test base state
    contentImage.className = "content-image";

    // Should still have blur from CSS
    const filter = window.getComputedStyle(contentImage).filter;
    expect(filter).toContain("blur");
    expect(filter).not.toBe("none");
  });
});
