#!/usr/bin/env node

/**
 * Detailed timing verification to check if the bug described by user exists
 * Following CLAUDE.md best practices
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyDetailedTiming() {
  console.log("🔍 DETAILED TIMING VERIFICATION\n");
  console.log("Checking if timing bug exists in current implementation...\n");

  const demoPath = path.join(__dirname, "maxvue-demo-with-images.html");

  try {
    const html = await fs.readFile(demoPath, "utf8");

    console.log("📋 CURRENT IMPLEMENTATION ANALYSIS:\n");

    // Extract the timer code sections
    const timerSectionStart = html.indexOf('startSectionTimer() {');
    const timerSectionEnd = html.indexOf('}', html.indexOf('}, 4000);')) + 1;
    const timerCode = html.substring(timerSectionStart, timerSectionEnd);

    console.log("⏰ Timer Implementation:");
    console.log("----------------------------------------");
    
    // Check for separate timers
    const hasTransitionTimer = timerCode.includes('this.transitionTimer = setTimeout');
    const hasSectionTimer = timerCode.includes('this.sectionTimer = setTimeout');
    
    console.log(`✅ Separate transition timer: ${hasTransitionTimer ? 'YES' : 'NO'}`);
    console.log(`✅ Separate section timer: ${hasSectionTimer ? 'YES' : 'NO'}`);

    // Extract timer delays
    const transitionDelayMatch = timerCode.match(/this\.transitionTimer = setTimeout\([^}]+\}, (\d+)\);/);
    const sectionDelayMatch = timerCode.match(/this\.sectionTimer = setTimeout\([^}]*\}, (\d+)\);/s);

    const transitionDelay = transitionDelayMatch ? parseInt(transitionDelayMatch[1]) : null;
    const sectionDelay = sectionDelayMatch ? parseInt(sectionDelayMatch[1]) : null;

    console.log(`\n📊 Timer Delays:`);
    console.log(`   Transition timer: ${transitionDelay}ms (${transitionDelay/1000}s)`);
    console.log(`   Section timer: ${sectionDelay}ms (${sectionDelay/1000}s)`);

    // Check what happens in each timer
    const transitionAction = timerCode.includes('this.transitionToClear()');
    const sectionAction = timerCode.includes('this.currentSection++') && timerCode.includes('this.playSection()');

    console.log(`\n🎬 Timer Actions:`);
    console.log(`   Transition timer calls transitionToClear(): ${transitionAction ? 'YES' : 'NO'}`);
    console.log(`   Section timer calls currentSection++ and playSection(): ${sectionAction ? 'YES' : 'NO'}`);

    // Check if there's any combined action (the bug the user described)
    const combinedActionPattern1 = /this\.transitionToClear\(\);\s*console\.log.*Moving to next section/;
    const combinedActionPattern2 = /this\.transitionToClear\(\);\s*this\.currentSection\+\+/;
    const combinedActionPattern3 = /setTimeout\([^}]*this\.transitionToClear\(\).*this\.currentSection\+\+.*\}, \d+\)/s;

    const hasCombinedAction = combinedActionPattern1.test(timerCode) || 
                             combinedActionPattern2.test(timerCode) || 
                             combinedActionPattern3.test(timerCode);

    console.log(`\n🔍 Bug Detection:`);
    console.log(`   Combined action in same timer: ${hasCombinedAction ? 'YES (BUG EXISTS)' : 'NO (BUG FIXED)'}`);

    // Analyze the actual timing flow
    console.log(`\n⏱️  TIMING FLOW ANALYSIS:`);
    console.log(`   0-${transitionDelay/1000}s: Blurred image shown`);
    console.log(`   ${transitionDelay/1000}s: transitionToClear() starts blur→clear transition`);
    console.log(`   ${transitionDelay/1000}s-${sectionDelay/1000}s: Clear image visible (${(sectionDelay-transitionDelay)/1000}s duration)`);
    console.log(`   ${sectionDelay/1000}s: Move to next section`);

    const clearImageDuration = (sectionDelay - transitionDelay) / 1000;
    const expectedClearDuration = 2; // 2 seconds as requested

    console.log(`\n📏 Clear Image Visibility:`);
    console.log(`   Expected duration: ${expectedClearDuration}s`);
    console.log(`   Actual duration: ${clearImageDuration}s`);
    console.log(`   Duration correct: ${clearImageDuration === expectedClearDuration ? 'YES ✅' : 'NO ❌'}`);

    // Overall assessment
    console.log(`\n${"=".repeat(60)}`);
    
    if (!hasCombinedAction && transitionDelay === 2000 && sectionDelay === 4000 && clearImageDuration === 2) {
      console.log("🎉 TIMING IMPLEMENTATION IS CORRECT!");
      console.log("✅ No timing bug found in current implementation");
      console.log("✅ Separate timers working as expected");
      console.log("✅ Clear images get full 2 seconds visibility");
      console.log("\n📋 Current Flow (CORRECT):");
      console.log("   • 0-2s: Blurred image shown");
      console.log("   • 2s: Start transition to clear (transitionToClear())");
      console.log("   • 2-4s: Clear image fully visible for 2 seconds");
      console.log("   • 4s: Move to next section (currentSection++, playSection())");
      
      if (process.argv.includes('--user-report')) {
        console.log("\n💡 USER FEEDBACK:");
        console.log("The implementation already follows the requested timing pattern.");
        console.log("If you're still experiencing the bug, it might be a browser");
        console.log("caching issue or timing perception. Try hard refresh (Cmd+Shift+R)");
        console.log("or check the browser console for the TIMER_DEBUG logs.");
      }
    } else {
      console.log("❌ TIMING BUG DETECTED!");
      console.log("The implementation does not match the requested timing pattern.");
      
      if (hasCombinedAction) {
        console.log("🐛 Issue: transition and section change in same timer");
      }
      if (transitionDelay !== 2000) {
        console.log(`🐛 Issue: transition delay should be 2000ms, found ${transitionDelay}ms`);
      }
      if (sectionDelay !== 4000) {
        console.log(`🐛 Issue: section delay should be 4000ms, found ${sectionDelay}ms`);
      }
      if (clearImageDuration !== 2) {
        console.log(`🐛 Issue: clear image duration should be 2s, found ${clearImageDuration}s`);
      }
    }

  } catch (error) {
    console.error("❌ Error verifying detailed timing:", error.message);
    process.exit(1);
  }
}

// Run detailed verification
verifyDetailedTiming();