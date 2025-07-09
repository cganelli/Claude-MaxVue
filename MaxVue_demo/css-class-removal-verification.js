#!/usr/bin/env node

/**
 * Verification script to ensure CSS class approach is completely removed
 * Following CLAUDE.md best practices
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyCSSClassRemoval() {
  console.log("🔍 Verifying CSS Class Approach Completely Removed...\n");

  const demoPath = path.join(__dirname, "maxvue-demo-with-images.html");

  try {
    const html = await fs.readFile(demoPath, "utf8");

    const removalChecks = [
      {
        name: "❌ NO .visible CSS class definition",
        test: () => !html.includes('.clear-image.visible') && !html.includes('.visible'),
        critical: true
      },
      {
        name: "❌ NO .fade-out CSS class definition", 
        test: () => !html.includes('.blurred-image.fade-out') && !html.includes('.fade-out'),
        critical: true
      },
      {
        name: "❌ NO classList.add('visible') calls",
        test: () => !html.includes("classList.add('visible')"),
        critical: true
      },
      {
        name: "❌ NO classList.add('fade-out') calls",
        test: () => !html.includes("classList.add('fade-out')"),
        critical: true
      },
      {
        name: "❌ NO classList.remove('visible') calls",
        test: () => !html.includes("classList.remove('visible')"),
        critical: true
      },
      {
        name: "❌ NO classList.remove('fade-out') calls", 
        test: () => !html.includes("classList.remove('fade-out')"),
        critical: true
      }
    ];

    const implementationChecks = [
      {
        name: "✅ HAS transitionToClear method",
        test: () => html.includes('transitionToClear()'),
        critical: true
      },
      {
        name: "✅ HAS direct style.opacity = '0' calls",
        test: () => html.includes("style.opacity = '0'"),
        critical: true
      },
      {
        name: "✅ HAS direct style.opacity = '1' calls",
        test: () => html.includes("style.opacity = '1'"),
        critical: true
      },
      {
        name: "✅ HAS DIRECT opacity transition debug logging",
        test: () => html.includes('DIRECT opacity transition'),
        critical: true
      },
      {
        name: "✅ HAS this.transitionToClear() call in timer",
        test: () => html.includes('this.transitionToClear()'),
        critical: true
      },
      {
        name: "✅ MAINTAINS CSS transition: opacity 2s",
        test: () => html.includes('transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1)'),
        critical: false
      }
    ];

    console.log("🚫 CSS Class Removal Verification:\n");

    let removalPassed = true;
    removalChecks.forEach((check) => {
      const passed = check.test();
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${check.name}`);
      if (!passed && check.critical) removalPassed = false;
    });

    console.log("\n✅ Direct Opacity Implementation Verification:\n");

    let implementationPassed = true;
    implementationChecks.forEach((check) => {
      const passed = check.test();
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${check.name}`);
      if (!passed && check.critical) implementationPassed = false;
    });

    // Count specific patterns
    const fadeOutCount = (html.match(/fade-out/g) || []).length;
    const visibleCount = (html.match(/\.visible/g) || []).length;
    const classListAddCount = (html.match(/classList\.add\('(visible|fade-out)'\)/g) || []).length;
    const directOpacityCount = (html.match(/style\.opacity = '[01]'/g) || []).length;

    console.log(`\n📊 Pattern Analysis:`);
    console.log(`   'fade-out' references: ${fadeOutCount} (should be 0)`);
    console.log(`   '.visible' references: ${visibleCount} (should be 0)`);
    console.log(`   classList.add for transitions: ${classListAddCount} (should be 0)`);
    console.log(`   Direct style.opacity changes: ${directOpacityCount} (should be ≥ 4)`);

    if (removalPassed && implementationPassed && fadeOutCount === 0 && visibleCount === 0 && directOpacityCount >= 4) {
      console.log("\n🎉 CSS CLASS APPROACH COMPLETELY REMOVED!");
      console.log("✨ DIRECT OPACITY APPROACH SUCCESSFULLY IMPLEMENTED!");
      console.log("🚀 Clear images should now transition properly using style.opacity");
      console.log("\nKey changes verified:");
      console.log("  • All CSS class definitions removed (.visible, .fade-out)");
      console.log("  • All classList.add/remove calls for transitions removed");
      console.log("  • Direct style.opacity = '0' and '1' implemented");
      console.log("  • transitionToClear() method using direct opacity changes");
      console.log("  • CSS transition: opacity 2s maintained for smooth animation");
    } else {
      console.log("\n⚠️  CSS class removal incomplete or direct opacity not fully implemented.");
      
      if (fadeOutCount > 0) console.log(`❌ Still found ${fadeOutCount} 'fade-out' references`);
      if (visibleCount > 0) console.log(`❌ Still found ${visibleCount} '.visible' references`);
      if (classListAddCount > 0) console.log(`❌ Still found ${classListAddCount} classList.add calls for transitions`);
      if (directOpacityCount < 4) console.log(`❌ Only found ${directOpacityCount} direct opacity changes (expected ≥ 4)`);
    }

  } catch (error) {
    console.error("❌ Error verifying CSS class removal:", error.message);
    process.exit(1);
  }
}

// Run verification
verifyCSSClassRemoval();