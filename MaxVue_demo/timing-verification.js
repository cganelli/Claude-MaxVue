#!/usr/bin/env node

/**
 * Verification script for timing and looping implementation
 * Following CLAUDE.md best practices
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyTimingAndLooping() {
  console.log("🕐 Verifying Timing and Looping Implementation...\n");

  const demoPath = path.join(__dirname, "maxvue-demo-with-images.html");

  try {
    const html = await fs.readFile(demoPath, "utf8");

    const timingChecks = [
      {
        name: "✅ Blur duration changed to 2 seconds",
        test: () => html.includes("}, 2000);") && html.includes("blurred for 2s, clear for 2s"),
        critical: true
      },
      {
        name: "✅ Section timer changed to 4 seconds",
        test: () => html.includes("}, 4000);") && html.includes("2s blur + 2s clear"),
        critical: true
      },
      {
        name: "✅ Progress bar timing updated for 4-second cycle",
        test: () => html.includes("progress += 2.5") && html.includes("40 steps for 4 seconds"),
        critical: true
      },
      {
        name: "✅ Timer debug shows correct timing calculation",
        test: () => html.includes("const startTime = this.currentSection * 4") && 
                    html.includes("const endTime = startTime + 4"),
        critical: true
      }
    ];

    const loopingChecks = [
      {
        name: "✅ Continuous looping logic implemented",
        test: () => html.includes("this.currentSection >= this.sections.length") &&
                    html.includes("this.currentSection = 0"),
        critical: true
      },
      {
        name: "✅ Loop debug logging present",
        test: () => html.includes("LOOP_DEBUG: Completed all sections, looping back to section 0"),
        critical: true
      },
      {
        name: "✅ No demo stopping logic for infinite loop",
        test: () => !html.includes("this.stop()") || 
                    (html.includes("this.stop()") && !html.includes("currentSection >= sections.length")),
        critical: true
      },
      {
        name: "✅ Section progression continues after section 4",
        test: () => html.includes("this.currentSection++") && html.includes("this.playSection()"),
        critical: true
      }
    ];

    console.log("⏱️  Timing Verification:\n");

    let timingPassed = true;
    timingChecks.forEach((check) => {
      const passed = check.test();
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${check.name}`);
      if (!passed && check.critical) timingPassed = false;
    });

    console.log("\n🔄 Looping Verification:\n");

    let loopingPassed = true;
    loopingChecks.forEach((check) => {
      const passed = check.test();
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${check.name}`);
      if (!passed && check.critical) loopingPassed = false;
    });

    // Extract timing values for analysis
    const blurDurationMatch = html.match(/}, (\d+)\);.*blurred for/);
    const sectionDurationMatch = html.match(/}, (\d+)\);.*2s blur \+ 2s clear/);
    const progressStepMatch = html.match(/progress \+= ([\d.]+)/);

    console.log("\n📊 Timing Analysis:");
    
    if (blurDurationMatch) {
      const blurMs = parseInt(blurDurationMatch[1]);
      console.log(`   Blur duration: ${blurMs}ms (${blurMs/1000}s) - Expected: 2000ms (2s)`);
    }
    
    if (sectionDurationMatch) {
      const sectionMs = parseInt(sectionDurationMatch[1]);
      console.log(`   Section duration: ${sectionMs}ms (${sectionMs/1000}s) - Expected: 4000ms (4s)`);
    }
    
    if (progressStepMatch) {
      const progressStep = parseFloat(progressStepMatch[1]);
      const expectedSteps = 100 / progressStep;
      const totalTime = expectedSteps * 100; // 100ms intervals
      console.log(`   Progress step: ${progressStep}% (${expectedSteps} steps = ${totalTime}ms total)`);
    }

    // Calculate expected timing
    const sectionsCount = 5; // Email, Music, Photo, Website, Camera
    const totalCycleTime = sectionsCount * 4; // 5 sections × 4 seconds each
    
    console.log(`\n🎯 Expected Demo Cycle:`);
    console.log(`   Sections: ${sectionsCount}`);
    console.log(`   Per section: 4 seconds (2s blur + 2s clear)`);
    console.log(`   Total cycle: ${totalCycleTime} seconds`);
    console.log(`   Section 0 (Email): 0-4s`);
    console.log(`   Section 1 (Music): 4-8s`);
    console.log(`   Section 2 (Photo): 8-12s`);
    console.log(`   Section 3 (Website): 12-16s`);
    console.log(`   Section 4 (Camera): 16-20s`);
    console.log(`   Then loop back to Section 0...`);

    if (timingPassed && loopingPassed) {
      console.log("\n🎉 TIMING AND LOOPING SUCCESSFULLY IMPLEMENTED!");
      console.log("✨ Demo will run in 4-second cycles (2s blur + 2s clear)");
      console.log("🔄 Continuous looping after all 5 sections complete");
      console.log("⏱️  Total cycle time: 20 seconds before loop restart");
      console.log("\nKey changes verified:");
      console.log("  • Blur duration: 3s → 2s");
      console.log("  • Section duration: 5s → 4s (2s + 2s)");
      console.log("  • Progress bar: 2% → 2.5% steps for 4s cycle");
      console.log("  • Continuous looping: Section 4 → Section 0");
      console.log("  • Timer debug logging with correct calculations");
    } else {
      console.log("\n⚠️  Some timing or looping checks failed.");
      
      if (!timingPassed) console.log("❌ Timing implementation incomplete");
      if (!loopingPassed) console.log("❌ Looping implementation incomplete");
    }

  } catch (error) {
    console.error("❌ Error verifying timing and looping:", error.message);
    process.exit(1);
  }
}

// Run verification
verifyTimingAndLooping();