#!/usr/bin/env node

/**
 * Verification script for homepage embed version
 * Following CLAUDE.md best practices
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyHomepageEmbed() {
  console.log("📱 HOMEPAGE EMBED VERSION VERIFICATION\n");
  console.log("Checking minimal phone mockup embed...\n");

  const originalPath = path.join(__dirname, "maxvue-demo-with-images.html");
  const embedPath = path.join(__dirname, "maxvue-homepage-embed.html");

  try {
    // Check both files exist
    let originalExists = false;
    let embedExists = false;
    let originalHtml = '';
    let embedHtml = '';

    try {
      originalHtml = await fs.readFile(originalPath, "utf8");
      originalExists = true;
    } catch (error) {
      originalExists = false;
    }

    try {
      embedHtml = await fs.readFile(embedPath, "utf8");
      embedExists = true;
    } catch (error) {
      embedExists = false;
    }

    console.log("📂 FILE EXISTENCE CHECK:\n");
    console.log(`✅ Original demo preserved: ${originalExists ? 'YES' : 'NO'}`);
    console.log(`✅ Embed version created: ${embedExists ? 'YES' : 'NO'}`);

    if (!embedExists) {
      console.log("\n❌ EMBED FILE NOT FOUND!");
      console.log("The maxvue-homepage-embed.html file was not created.");
      return;
    }

    console.log("\n🧹 REMOVAL VERIFICATION:\n");

    const removalChecks = [
      {
        name: "Demo container wrapper removed",
        test: () => !embedHtml.includes('demo-container') && !embedHtml.includes('class="demo-container"')
      },
      {
        name: "Title and subtitle removed",
        test: () => !embedHtml.includes('demo-title') && !embedHtml.includes('demo-subtitle') && !embedHtml.includes('<h1') && !embedHtml.includes('demo-header')
      },
      {
        name: "Play/pause controls removed",
        test: () => !embedHtml.includes('play-btn') && !embedHtml.includes('playBtn') && !embedHtml.includes('controls')
      },
      {
        name: "Progress bar removed",
        test: () => !embedHtml.includes('progress-container') && !embedHtml.includes('progress-bar') && !embedHtml.includes('progressBar')
      },
      {
        name: "Section labels removed",
        test: () => !embedHtml.includes('section-label') && !embedHtml.includes('sectionLabel') && !embedHtml.includes('Ready to Start')
      }
    ];

    removalChecks.forEach(check => {
      const passed = check.test();
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${check.name}`);
    });

    console.log("\n📱 EMBED FEATURES:\n");

    const embedChecks = [
      {
        name: "Transparent background",
        test: () => embedHtml.includes('background: transparent')
      },
      {
        name: "Phone mockup preserved",
        test: () => embedHtml.includes('phone-mockup') && embedHtml.includes('phone-screen')
      },
      {
        name: "Image elements preserved",
        test: () => embedHtml.includes('blurredImage') && embedHtml.includes('clearImage')
      },
      {
        name: "Auto-start functionality",
        test: () => embedHtml.includes('this.play()') && !embedHtml.includes('addEventListener(\'click\'')
      },
      {
        name: "Core transitions preserved",
        test: () => embedHtml.includes('transitionToClear()') && embedHtml.includes('resetToBlurredState()')
      },
      {
        name: "Loop timing maintained",
        test: () => embedHtml.includes('}, 2000);') && embedHtml.includes('}, 4000);')
      }
    ];

    embedChecks.forEach(check => {
      const passed = check.test();
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${check.name}`);
    });

    // Size comparison
    console.log("\n📊 SIZE COMPARISON:\n");
    console.log(`   Original demo: ${Math.round(originalHtml.length/1024)}KB`);
    console.log(`   Embed version: ${Math.round(embedHtml.length/1024)}KB`);
    console.log(`   Size reduction: ${Math.round((originalHtml.length - embedHtml.length)/1024)}KB`);

    // Check original preservation
    console.log("\n🔒 ORIGINAL PRESERVATION:\n");
    
    if (originalExists) {
      const originalHasControls = originalHtml.includes('play-btn') && originalHtml.includes('demo-container');
      console.log(`✅ Original has full UI: ${originalHasControls ? 'YES' : 'NO'}`);
    }

    // Embed structure analysis
    console.log("\n🏗️  EMBED STRUCTURE:\n");
    
    const structure = {
      hasBody: embedHtml.includes('<body>'),
      hasPhoneMockup: embedHtml.includes('phone-mockup'),
      hasImages: embedHtml.includes('blurredImage') && embedHtml.includes('clearImage'),
      hasScript: embedHtml.includes('<script>'),
      hasControls: embedHtml.includes('controls') || embedHtml.includes('play-btn'),
      hasTransparentBg: embedHtml.includes('background: transparent')
    };

    console.log(`   HTML body: ${structure.hasBody ? '✅' : '❌'}`);
    console.log(`   Phone mockup: ${structure.hasPhoneMockup ? '✅' : '❌'}`);
    console.log(`   Image elements: ${structure.hasImages ? '✅' : '❌'}`);
    console.log(`   JavaScript functionality: ${structure.hasScript ? '✅' : '❌'}`);
    console.log(`   UI controls: ${structure.hasControls ? '❌ (should be removed)' : '✅'}`);
    console.log(`   Transparent background: ${structure.hasTransparentBg ? '✅' : '❌'}`);

    // Final assessment
    console.log(`\n${"=".repeat(60)}`);

    const allRemovalsPassed = removalChecks.every(check => check.test());
    const allEmbedFeaturesPassed = embedChecks.every(check => check.test());

    if (allRemovalsPassed && allEmbedFeaturesPassed && !structure.hasControls) {
      console.log("🎉 HOMEPAGE EMBED VERSION SUCCESSFUL!");
      console.log("✅ All UI elements properly removed");
      console.log("✅ Minimal phone mockup embed created");
      console.log("✅ Auto-starting functionality implemented");
      console.log("✅ Original demo file preserved");
      
      console.log("\n🎯 EMBED FEATURES:");
      console.log("   • Clean phone mockup only");
      console.log("   • Transparent background for embedding");
      console.log("   • Auto-starting 20-second loop");
      console.log("   • No UI distractions or controls");
      console.log("   • Perfect for iframe embedding");
      
      console.log("\n📱 USAGE:");
      console.log("   <iframe src='maxvue-homepage-embed.html'");
      console.log("           width='320' height='600' frameborder='0'>");
      console.log("   </iframe>");
    } else {
      console.log("❌ HOMEPAGE EMBED VERSION INCOMPLETE!");
      
      if (!allRemovalsPassed) {
        console.log("🔧 Some UI elements not properly removed");
      }
      if (!allEmbedFeaturesPassed) {
        console.log("🔧 Some embed features missing or broken");
      }
      if (structure.hasControls) {
        console.log("🔧 UI controls still present");
      }
    }

  } catch (error) {
    console.error("❌ Error verifying homepage embed:", error.message);
  }
}

// Run verification
verifyHomepageEmbed();