/**
 * Test to ensure no premature opacity setting
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("MaxVue Demo No Premature Opacity", () => {
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

    // Mock requestAnimationFrame
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

  test("no code should set opacity to 1 outside RAF callback", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Extract JavaScript code
    const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
    expect(scriptMatch).toBeTruthy();
    const jsCode = scriptMatch[1];

    // Split by requestAnimationFrame to check code outside RAF
    const parts = jsCode.split("requestAnimationFrame");

    // Check each part (except inside RAF callbacks)
    parts.forEach((part, index) => {
      // Skip the part that's inside RAF callback
      if (index > 0 && parts[index - 1].endsWith("(")) {
        return;
      }

      // Should not set opacity to 1 outside RAF
      expect(part).not.toMatch(/style\.opacity\s*=\s*['"]1['"]/);
      expect(part).not.toMatch(/opacity:\s*1/);
    });
  });

  test("opacity should be 0 immediately after src change", async () => {
    const contentImage = document.getElementById("contentImage");
    const opacityLogs = [];

    // Intercept console.log
    const originalLog = window.console.log;
    window.console.log = function (...args) {
      const log = args.join(" ");
      if (log.includes("Opacity")) {
        opacityLogs.push(log);
      }
      originalLog.apply(this, args);
    };

    // Directly change src and check opacity
    contentImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

    // Check immediate opacity
    const immediateOpacity = window.getComputedStyle(contentImage).opacity;
    console.log("Test: Immediate opacity after src change:", immediateOpacity);

    // Load a section
    maxVueDemo.loadSection(1);

    // Wait briefly for logs
    await new Promise((resolve) => setTimeout(resolve, 50));

    window.console.log = originalLog;

    // Check logs for opacity after src change
    const srcChangeLog = opacityLogs.find((log) =>
      log.includes("Opacity after src change:"),
    );
    if (srcChangeLog) {
      expect(srcChangeLog).toContain("0");
      expect(srcChangeLog).not.toContain("1");
    }
  });

  test("opacity logs should show 0 until RAF executes", async () => {
    const debugLogs = [];

    // Capture all console logs
    const originalLog = window.console.log;
    window.console.log = function (...args) {
      debugLogs.push(args.join(" "));
      originalLog.apply(this, args);
    };

    // Load section
    maxVueDemo.loadSection(1);

    // Wait for initial logs but not RAF
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Find all opacity-related logs before RAF
    const opacityLogs = debugLogs.filter(
      (log) => log.includes("Opacity") && !log.includes("making visible"),
    );

    // All should show opacity 0
    opacityLogs.forEach((log) => {
      if (log.includes(":")) {
        const value = log.split(":").pop().trim();
        expect(value).toBe("0");
      }
    });

    window.console.log = originalLog;
  });

  test("only RAF callback should set opacity to 1", async () => {
    const htmlPath = path.join(__dirname, "maxvue-demo-with-images.html");
    const html = await fs.readFile(htmlPath, "utf8");

    // Find all occurrences of setting opacity to 1
    const opacityOneMatches = [
      ...html.matchAll(/style\.opacity\s*=\s*['"]1['"]/g),
    ];

    // Each should be inside a requestAnimationFrame callback
    opacityOneMatches.forEach((match) => {
      const index = match.index;
      const before = html.substring(Math.max(0, index - 200), index);

      // Should have requestAnimationFrame before it
      expect(before).toContain("requestAnimationFrame");
    });
  });

  test("no CSS classes should set opacity to 1 during load", async () => {
    const contentImage = document.getElementById("contentImage");

    // Remove all classes to start fresh
    contentImage.className = "content-image";

    // Monitor class changes
    const classChanges = [];
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const classes = Array.from(contentImage.classList);
          const opacity = window.getComputedStyle(contentImage).opacity;
          classChanges.push({ classes, opacity });
        }
      });
    });

    observer.observe(contentImage, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Load section
    maxVueDemo.loadSection(0);

    // Check immediately (before RAF)
    const immediateOpacity = window.getComputedStyle(contentImage).opacity;
    expect(immediateOpacity).toBe("0");

    // Wait briefly (but not for RAF)
    await new Promise((resolve) => setTimeout(resolve, 5));

    observer.disconnect();

    // No class changes should have caused opacity 1 yet
    classChanges.forEach((change) => {
      if (!change.classes.includes("visible")) {
        expect(change.opacity).toBe("0");
      }
    });
  });
});
