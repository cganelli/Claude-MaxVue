#!/usr/bin/env node

/**
 * Validate the generated MaxVue demo
 * Checks that all required functionality is present
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateDemo() {
  console.log("🔍 Validating MaxVue Demo...\n");

  const demoPath = path.join(__dirname, "maxvue-demo-with-images.html");

  try {
    // Read the generated HTML
    const html = await fs.readFile(demoPath, "utf8");

    // Check file size
    const stats = await fs.stat(demoPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`📄 File size: ${sizeMB} MB`);

    // Validation checks
    const checks = [
      {
        name: "HTML Structure",
        test: () =>
          html.includes("<!DOCTYPE html>") && html.includes("</html>"),
      },
      {
        name: "Phone Mockup",
        test: () =>
          html.includes("phone-mockup") && html.includes("phone-screen"),
      },
      {
        name: "All 5 Images Embedded",
        test: () => {
          const imageCount = (html.match(/data:image\/jpeg;base64,/g) || [])
            .length;
          return imageCount === 5;
        },
      },
      {
        name: "Section Names",
        test: () => {
          const sections = ["Music App", "Email", "Website", "Photo", "Camera"];
          return sections.every((section) =>
            html.includes(`"name": "${section}"`),
          );
        },
      },
      {
        name: "Blur Transitions",
        test: () =>
          html.includes("filter: blur(20px)") &&
          html.includes("filter: blur(0px)"),
      },
      {
        name: "Vision Corrected Indicator",
        test: () =>
          html.includes("✨ Vision Corrected") &&
          html.includes("vision-indicator"),
      },
      {
        name: "Progress Bar",
        test: () => html.includes("progress-bar") && html.includes("width: 0%"),
      },
      {
        name: "Controls",
        test: () => html.includes("play-btn") && html.includes("togglePlay"),
      },
      {
        name: "5-Second Timing",
        test: () => html.includes("5000"),
      },
      {
        name: "3-Second Blur Duration",
        test: () => html.includes("3000"),
      },
      {
        name: "2-Second Blur Transition",
        test: () => html.includes("transition: filter 2s"),
      },
      {
        name: "Error Handling",
        test: () => html.includes("onerror"),
      },
      {
        name: "MaxVueDemo Class",
        test: () => html.includes("class MaxVueDemo"),
      },
      {
        name: "CSS Blur and Opacity Approach",
        test: () => {
          const hasCSSBlur = html.includes("filter: blur(20px) !important");
          const hasOpacityTransition = html.includes(
            "transition: filter 2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
          );
          const hasDebugLogging =
            html.includes("BLUR_DEBUG") && html.includes("VISIBILITY_DEBUG");
          return hasCSSBlur && hasOpacityTransition && hasDebugLogging;
        },
      },
      {
        name: "RequestAnimationFrame Render Delay",
        test: () => {
          const hasRAF = html.includes("requestAnimationFrame");
          const hasDoubleRAF = html.match(
            /requestAnimationFrame\s*\(\s*\(\s*\)\s*=>\s*{\s*requestAnimationFrame/,
          );
          const hasRenderDebug = html.includes("Waiting for blur to render");
          return hasRAF && hasDoubleRAF && hasRenderDebug;
        },
      },
      {
        name: "Inline Opacity Control",
        test: () => {
          const hasOpacityZero = html.includes("style.opacity = '0'");
          const hasOpacityOne = html.includes("style.opacity = '1'");
          const hasOpacityInRAF = html.match(
            /requestAnimationFrame[\s\S]*?style\.opacity\s*=\s*['"]1['"]/,
          );
          return hasOpacityZero && hasOpacityOne && hasOpacityInRAF;
        },
      },
      {
        name: "CSS Pre-Blur with Visual Debug",
        test: () => {
          const hasPreBlur = html.includes("filter: blur(20px) !important");
          const hasVisualBorder = html.includes("border: 3px solid red");
          const hasClearVisual = html.includes("border: 3px solid green");
          const hasVisualDebugLog = html.includes("VISUAL_DEBUG");
          return (
            hasPreBlur && hasVisualBorder && hasClearVisual && hasVisualDebugLog
          );
        },
      },
      {
        name: "New Image Order",
        test: () => {
          const emailFirst =
            html.indexOf('"name": "Email"') <
            html.indexOf('"name": "Music App"');
          const spotifySecond =
            html.indexOf('"name": "Music App"') <
            html.indexOf('"name": "Photo"');
          return emailFirst && spotifySecond;
        },
      },
    ];

    console.log("Running validation checks:\n");

    let allPassed = true;
    checks.forEach((check) => {
      const passed = check.test();
      console.log(`${passed ? "✅" : "❌"} ${check.name}`);
      if (!passed) allPassed = false;
    });

    // Extract and display image info
    console.log("\n📸 Embedded Images:");
    const sectionMatches = html.match(/"name":\s*"([^"]+)"/g);
    if (sectionMatches) {
      sectionMatches.forEach((match, index) => {
        const name = match.match(/"name":\s*"([^"]+)"/)[1];
        console.log(`  ${index + 1}. ${name}`);
      });
    }

    // Check base64 data presence
    const base64Matches = html.match(
      /data:image\/jpeg;base64,([A-Za-z0-9+/]{100})/g,
    );
    if (base64Matches) {
      console.log(
        `\n✅ All ${base64Matches.length} images have valid base64 data`,
      );
    }

    if (allPassed) {
      console.log("\n🎉 All validation checks passed!");
      console.log(
        "📱 The demo is ready to use. Open maxvue-demo-with-images.html in your browser.",
      );
    } else {
      console.log(
        "\n⚠️  Some validation checks failed. Please review the output above.",
      );
    }
  } catch (error) {
    console.error("❌ Error validating demo:", error.message);
    process.exit(1);
  }
}

// Run validation
validateDemo();
