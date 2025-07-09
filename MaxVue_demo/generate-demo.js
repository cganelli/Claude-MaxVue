#!/usr/bin/env node

/**
 * MaxVue Demo Generator
 * Reads actual image files and generates HTML with base64-encoded images
 * Following CLAUDE.md best practices
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert image file to base64 data URL
 * @param {string} filePath - Path to image file
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<string>} Base64 data URL
 */
async function imageToDataURL(filePath, mimeType) {
  try {
    const imageData = await fs.readFile(filePath);
    const base64 = imageData.toString("base64");
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Error reading image ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Generate the updated HTML with actual images
 */
async function generateDemo() {
  console.log("🎨 MaxVue Demo Generator Starting...");

  const demoDir = path.dirname(__filename);
  const outputPath = path.join(demoDir, "maxvue-demo-with-images.html");

  try {
    // Define dual image mappings: Email → Spotify → Pug → Wikipedia → Flowers
    const imageMappings = [
      { 
        name: "Email", 
        clearFile: "email.jpg", 
        blurredFile: "email_blur.jpg", 
        mimeType: "image/jpeg" 
      },
      { 
        name: "Music App", 
        clearFile: "spotify.jpg", 
        blurredFile: "spotify_blur.jpg", 
        mimeType: "image/jpeg" 
      },
      { 
        name: "Photo", 
        clearFile: "pug.JPG", 
        blurredFile: "pug_blur.jpg", 
        mimeType: "image/jpeg" 
      },
      { 
        name: "Website", 
        clearFile: "wikipedia.jpg", 
        blurredFile: "wikipedia_blur.jpg", 
        mimeType: "image/jpeg" 
      },
      { 
        name: "Camera", 
        clearFile: "flowers.jpg", 
        blurredFile: "Flowers_blur.jpg", 
        mimeType: "image/jpeg" 
      },
    ];

    // Load all images (both clear and blurred) and convert to base64
    console.log("📸 Loading dual images (clear + blurred)...");
    const imageDataURLs = await Promise.all(
      imageMappings.map(async (mapping) => {
        const clearPath = path.join(demoDir, mapping.clearFile);
        const blurredPath = path.join(demoDir, mapping.blurredFile);
        
        console.log(`  - Loading ${mapping.clearFile} + ${mapping.blurredFile}...`);
        console.log(`    Clear path: ${clearPath}`);
        console.log(`    Blurred path: ${blurredPath}`);
        
        // Check if files exist
        try {
          const clearStats = await fs.stat(clearPath);
          console.log(`    ✅ Clear file exists: ${mapping.clearFile} (${clearStats.size} bytes)`);
        } catch (error) {
          console.error(`    ❌ Clear file missing: ${mapping.clearFile} - ${error.message}`);
          throw error;
        }
        
        try {
          const blurredStats = await fs.stat(blurredPath);
          console.log(`    ✅ Blurred file exists: ${mapping.blurredFile} (${blurredStats.size} bytes)`);
        } catch (error) {
          console.error(`    ❌ Blurred file missing: ${mapping.blurredFile} - ${error.message}`);
          throw error;
        }
        
        const clearDataURL = await imageToDataURL(clearPath, mapping.mimeType);
        const blurredDataURL = await imageToDataURL(blurredPath, mapping.mimeType);
        
        console.log(`    ✅ Clear base64 length: ${clearDataURL.length} chars`);
        console.log(`    ✅ Blurred base64 length: ${blurredDataURL.length} chars`);
        
        return {
          name: mapping.name,
          clearDataURL: clearDataURL,
          blurredDataURL: blurredDataURL,
        };
      }),
    );

    console.log("✅ All images loaded successfully");

    // Generate the HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MaxVue Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .demo-container {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 100%;
        }

        .demo-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .demo-title {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin-bottom: 8px;
        }

        .demo-subtitle {
            color: #666;
            font-size: 14px;
        }

        .phone-mockup {
            width: 288px;
            height: 520px;
            background: #1a1a1a;
            border-radius: 48px;
            padding: 8px;
            margin: 0 auto 20px;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .phone-screen {
            width: 272px;
            height: 504px;
            background: #000;
            border-radius: 40px;
            overflow: hidden;
            position: relative;
        }

        .image-container {
            width: 100%;
            height: 100%;
            position: relative;
        }

        .content-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
            transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blurred-image {
            opacity: 1;
            z-index: 2;
        }

        .clear-image {
            opacity: 0;
            z-index: 1;
        }


        .controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 15px;
        }

        .play-btn {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #667eea;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .play-btn:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .progress-container {
            background: #f0f0f0;
            height: 4px;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 15px;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.1s ease;
            border-radius: 2px;
        }

        .section-label {
            text-align: center;
            font-size: 14px;
            color: #666;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .notch {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 30px;
            background: #1a1a1a;
            border-radius: 0 0 20px 20px;
            z-index: 10;
        }

        .home-indicator {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 134px;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            z-index: 10;
        }

        /* Loading state styles */
        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }

        .error {
            text-align: center;
            padding: 20px;
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <div class="demo-header">
            <h1 class="demo-title">MaxVue Demo</h1>
            <p class="demo-subtitle">Experience crystal clear vision correction</p>
        </div>

        <div class="phone-mockup">
            <div class="notch"></div>
            <div class="phone-screen">
                <div class="image-container">
                    <img id="blurredImage" class="content-image blurred-image" src="" alt="Blurred Content">
                    <img id="clearImage" class="content-image clear-image" src="" alt="Clear Content">
                </div>
            </div>
            <div class="home-indicator"></div>
        </div>

        <div class="controls">
            <button id="playBtn" class="play-btn">▶</button>
        </div>

        <div class="progress-container">
            <div id="progressBar" class="progress-bar"></div>
        </div>

        <div id="sectionLabel" class="section-label">Ready to Start</div>
    </div>

    <script>
        class MaxVueDemo {
            constructor() {
                this.currentSection = 0;
                this.isPlaying = false;
                
                // Use dual images with base64 data URLs
                this.sections = ${JSON.stringify(imageDataURLs, null, 12)};

                this.init();
            }

            init() {
                this.blurredImage = document.getElementById('blurredImage');
                this.clearImage = document.getElementById('clearImage');
                this.playBtn = document.getElementById('playBtn');
                this.progressBar = document.getElementById('progressBar');
                this.sectionLabel = document.getElementById('sectionLabel');

                this.playBtn.addEventListener('click', () => this.togglePlay());
                
                // Preload first section
                this.loadSection(0);
            }

            resetToBlurredState() {
                console.log('OPACITY_DEBUG: Starting resetToBlurredState');
                console.log('OPACITY_DEBUG: Before reset - Blurred opacity:', window.getComputedStyle(this.blurredImage).opacity);
                console.log('OPACITY_DEBUG: Before reset - Clear opacity:', window.getComputedStyle(this.clearImage).opacity);
                
                
                // Disable transitions temporarily to prevent gradual opacity changes
                this.blurredImage.style.transition = 'none';
                this.clearImage.style.transition = 'none';
                
                // Force set opacity values directly via inline styles - NO CSS CLASSES
                this.blurredImage.style.opacity = '1';
                this.clearImage.style.opacity = '0';
                
                console.log('OPACITY_DEBUG: After force reset - Blurred inline opacity:', this.blurredImage.style.opacity);
                console.log('OPACITY_DEBUG: After force reset - Clear inline opacity:', this.clearImage.style.opacity);
                
                // Re-enable transitions after a brief delay to allow forced values to take effect
                setTimeout(() => {
                    this.blurredImage.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.clearImage.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    console.log('OPACITY_DEBUG: Transitions re-enabled');
                    
                    // Verify final states
                    console.log('OPACITY_DEBUG: Final - Blurred computed opacity:', window.getComputedStyle(this.blurredImage).opacity);
                    console.log('OPACITY_DEBUG: Final - Clear computed opacity:', window.getComputedStyle(this.clearImage).opacity);
                }, 50);
            }

            togglePlay() {
                if (this.isPlaying) {
                    this.stop();
                } else {
                    this.play();
                }
            }

            play() {
                this.isPlaying = true;
                this.playBtn.textContent = '❚❚';
                this.currentSection = 0;
                this.playSection();
            }

            stop() {
                this.isPlaying = false;
                this.playBtn.textContent = '▶';
                if (this.sectionTimer) {
                    clearTimeout(this.sectionTimer);
                }
                if (this.transitionTimer) {
                    clearTimeout(this.transitionTimer);
                }
                if (this.progressTimer) {
                    clearInterval(this.progressTimer);
                }
                this.progressBar.style.width = '0%';
            }

            playSection() {
                console.log('IMAGE_DEBUG: Starting playSection for section', this.currentSection);
                
                if (!this.isPlaying) {
                    return;
                }
                
                // Continuous loop: if we've completed all sections, restart from 0
                if (this.currentSection >= this.sections.length) {
                    console.log('LOOP_DEBUG: Completed all sections, looping back to section 0');
                    this.currentSection = 0;
                }

                const section = this.sections[this.currentSection];
                this.sectionLabel.textContent = section.name;
                
                console.log('IMAGE_DEBUG: Section name set to', section.name);
                
                // CRITICAL: Force reset to proper blurred state BEFORE setting image sources
                this.resetToBlurredState();
                
                console.log('IMAGE_DEBUG: Reset to blurred state completed');
                
                // Wait for reset to complete before continuing (transitions disabled for 50ms)
                setTimeout(() => {
                    // Load new images AFTER reset is complete
                    this.loadSection(this.currentSection);
                    this.startSectionTimer();
                }, 75); // Slightly longer than the reset timeout to ensure it's complete
            }

            transitionToClear() {
                console.log('OPACITY_DEBUG: Starting DIRECT opacity transition');
                console.log('OPACITY_DEBUG: Before transition - Blurred opacity:', this.blurredImage.style.opacity);
                console.log('OPACITY_DEBUG: Before transition - Clear opacity:', this.clearImage.style.opacity);
                console.log('OPACITY_DEBUG: Before transition - Blurred computed:', window.getComputedStyle(this.blurredImage).opacity);
                console.log('OPACITY_DEBUG: Before transition - Clear computed:', window.getComputedStyle(this.clearImage).opacity);
                
                // Use DIRECT style.opacity changes - NOT CSS classes
                this.blurredImage.style.opacity = '0';
                this.clearImage.style.opacity = '1';
                
                
                console.log('OPACITY_DEBUG: DIRECT transition applied');
                console.log('OPACITY_DEBUG: After direct change - Blurred inline:', this.blurredImage.style.opacity);
                console.log('OPACITY_DEBUG: After direct change - Clear inline:', this.clearImage.style.opacity);
                
                // Verify changes after a brief delay to check computed styles
                setTimeout(() => {
                    console.log('OPACITY_DEBUG: After transition - Blurred computed:', window.getComputedStyle(this.blurredImage).opacity);
                    console.log('OPACITY_DEBUG: After transition - Clear computed:', window.getComputedStyle(this.clearImage).opacity);
                    console.log('OPACITY_DEBUG: Fast transition in progress with 0.5s duration, completes at 2.5s');
                }, 100);
            }

            startSectionTimer() {
                const startTime = this.currentSection * 4;
                const endTime = startTime + 4;
                console.log('TIMER_DEBUG: Section ' + this.currentSection + ' timing: ' + startTime + '-' + endTime + ' seconds');
                
                // Start progress bar
                let progress = 0;
                this.progressBar.style.width = '0%';
                
                this.progressTimer = setInterval(() => {
                    progress += 2.5; // 40 steps for 4 seconds (100ms interval)
                    this.progressBar.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        clearInterval(this.progressTimer);
                    }
                }, 100);

                // PHASE 1: After 2 seconds, start blur→clear transition (fast 0.5s transition)
                this.transitionTimer = setTimeout(() => {
                    console.log('TIMING_DEBUG: [2s] Starting blur→clear transition phase (0.5s transition)');
                    console.log('TIMING_DEBUG: Transition completes at 2.5s, clear image fully visible 2.5s-4s (1.5s duration)');
                    this.transitionToClear();
                }, 2000);

                // PHASE 2: After 4 seconds total, move to next section (clear image had full 1.5s visibility)
                this.sectionTimer = setTimeout(() => {
                    console.log('TIMING_DEBUG: [4s] Clear image had full 1.5s visibility (2.5s-4s) after 0.5s transition');
                    console.log('TIMING_DEBUG: Moving to next section now');
                    this.currentSection++;
                    this.playSection();
                }, 4000);
            }

            loadSection(index) {
                if (index >= 0 && index < this.sections.length) {
                    const section = this.sections[index];
                    
                    console.log('IMAGE_DEBUG: Loading section', index, 'name:', section.name);
                    console.log('IMAGE_DEBUG: Clear data URL length:', section.clearDataURL ? section.clearDataURL.length : 'MISSING');
                    console.log('IMAGE_DEBUG: Blurred data URL length:', section.blurredDataURL ? section.blurredDataURL.length : 'MISSING');
                    
                    // CRITICAL: Check opacity states BEFORE setting image sources
                    console.log('OPACITY_DEBUG: Before setting src - Blurred inline:', this.blurredImage.style.opacity);
                    console.log('OPACITY_DEBUG: Before setting src - Clear inline:', this.clearImage.style.opacity);
                    console.log('OPACITY_DEBUG: Before setting src - Blurred computed:', window.getComputedStyle(this.blurredImage).opacity);
                    console.log('OPACITY_DEBUG: Before setting src - Clear computed:', window.getComputedStyle(this.clearImage).opacity);
                    
                    // Load blurred image src
                    this.blurredImage.src = section.blurredDataURL;
                    this.blurredImage.alt = 'Blurred ' + section.name;
                    console.log('IMAGE_DEBUG: Set blurred image src');
                    
                    // Load clear image src
                    this.clearImage.src = section.clearDataURL;
                    this.clearImage.alt = section.name;
                    console.log('IMAGE_DEBUG: Set clear image src');
                    
                    // CRITICAL: Check opacity states AFTER setting image sources
                    console.log('OPACITY_DEBUG: After setting src - Blurred inline:', this.blurredImage.style.opacity);
                    console.log('OPACITY_DEBUG: After setting src - Clear inline:', this.clearImage.style.opacity);
                    console.log('OPACITY_DEBUG: After setting src - Blurred computed:', window.getComputedStyle(this.blurredImage).opacity);
                    console.log('OPACITY_DEBUG: After setting src - Clear computed:', window.getComputedStyle(this.clearImage).opacity);
                    
                    // Handle loading errors and success
                    this.blurredImage.onerror = () => {
                        console.error('❌ Failed to load blurred image for section:', section.name);
                        this.blurredImage.alt = 'Failed to load blurred image';
                    };
                    
                    this.blurredImage.onload = () => {
                        console.log('✅ Blurred image loaded successfully for:', section.name);
                    };
                    
                    this.clearImage.onerror = () => {
                        console.error('❌ Failed to load clear image for section:', section.name);
                        this.clearImage.alt = 'Failed to load clear image';
                    };
                    
                    this.clearImage.onload = () => {
                        console.log('✅ Clear image loaded successfully for:', section.name);
                        console.log('IMAGE_DEBUG: Clear image dimensions:', this.clearImage.naturalWidth, 'x', this.clearImage.naturalHeight);
                    };
                }
            }
        }

        // Initialize demo when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.maxVueDemo = new MaxVueDemo();
        });
    </script>
</body>
</html>`;

    // Write the HTML file
    await fs.writeFile(outputPath, htmlContent, "utf8");
    console.log(`\n✨ Demo generated successfully!`);
    console.log(`📄 Output file: ${outputPath}`);
    console.log(`\n🚀 Open the file in your browser to view the demo.`);
  } catch (error) {
    console.error("❌ Error generating demo:", error.message);
    process.exit(1);
  }
}

// Run the generator
generateDemo();
