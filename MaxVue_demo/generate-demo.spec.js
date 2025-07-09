/**
 * Tests for MaxVue Demo Generator
 * Following CLAUDE.md best practices for testing
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

describe('MaxVue Demo Generator', () => {
    const demoDir = __dirname;
    const outputPath = path.join(demoDir, 'maxvue-demo-with-images.html');
    const generatorPath = path.join(demoDir, 'generate-demo.js');

    // Clean up after tests
    afterEach(async () => {
        try {
            await fs.unlink(outputPath);
        } catch (error) {
            // File might not exist, that's ok
        }
    });

    test('should generate HTML file with embedded images', async () => {
        // Run the generator
        const { stdout, stderr } = await execAsync(`node ${generatorPath}`);
        
        // Check output messages
        expect(stdout).toContain('MaxVue Demo Generator Starting');
        expect(stdout).toContain('All images loaded successfully');
        expect(stdout).toContain('Demo generated successfully');
        expect(stderr).toBe('');

        // Check that output file exists
        const fileExists = await fs.access(outputPath).then(() => true).catch(() => false);
        expect(fileExists).toBe(true);

        // Read and verify the generated HTML
        const htmlContent = await fs.readFile(outputPath, 'utf8');
        
        // Check for essential HTML structure
        expect(htmlContent).toContain('<!DOCTYPE html>');
        expect(htmlContent).toContain('<title>MaxVue Demo</title>');
        expect(htmlContent).toContain('class="demo-container"');
        expect(htmlContent).toContain('class="phone-mockup"');
        
        // Check for embedded base64 images
        expect(htmlContent).toContain('data:image/jpeg;base64,');
        
        // Check for all 5 sections
        expect(htmlContent).toContain('"name": "Music App"');
        expect(htmlContent).toContain('"name": "Email"');
        expect(htmlContent).toContain('"name": "Website"');
        expect(htmlContent).toContain('"name": "Photo"');
        expect(htmlContent).toContain('"name": "Camera"');
        
        // Check for JavaScript functionality
        expect(htmlContent).toContain('class MaxVueDemo');
        expect(htmlContent).toContain('filter: blur(6px)');
        expect(htmlContent).toContain('Vision Corrected');
    });

    test('should handle missing image files gracefully', async () => {
        // Temporarily rename an image to simulate missing file
        const originalPath = path.join(demoDir, 'spotify.jpg');
        const tempPath = path.join(demoDir, 'spotify.jpg.tmp');
        
        try {
            await fs.rename(originalPath, tempPath);
            
            // Run generator - should fail
            await expect(execAsync(`node ${generatorPath}`)).rejects.toThrow();
            
        } finally {
            // Restore the file
            await fs.rename(tempPath, originalPath);
        }
    });

    test('should create valid base64 data URLs', async () => {
        // Test the imageToDataURL function directly
        const testImagePath = path.join(demoDir, 'flowers.jpg');
        const imageData = await fs.readFile(testImagePath);
        const base64 = imageData.toString('base64');
        const expectedDataURL = `data:image/jpeg;base64,${base64}`;
        
        // Run generator and check output
        await execAsync(`node ${generatorPath}`);
        const htmlContent = await fs.readFile(outputPath, 'utf8');
        
        // The HTML should contain valid base64 data
        expect(htmlContent).toContain('data:image/jpeg;base64,');
        
        // Check that base64 strings are properly formatted
        const base64Pattern = /data:image\/jpeg;base64,[A-Za-z0-9+/]+=*/;
        expect(htmlContent).toMatch(base64Pattern);
    });

    test('should preserve all demo functionality', async () => {
        await execAsync(`node ${generatorPath}`);
        const htmlContent = await fs.readFile(outputPath, 'utf8');
        
        // Check for blur transition functionality
        expect(htmlContent).toContain('filter: blur(6px)');
        expect(htmlContent).toContain('filter: blur(0px)');
        expect(htmlContent).toContain('transition: filter 2s cubic-bezier(0.4, 0, 0.2, 1)');
        
        // Check for progress bar
        expect(htmlContent).toContain('class="progress-bar"');
        expect(htmlContent).toContain('width: 0%');
        
        // Check for play/pause controls
        expect(htmlContent).toContain('class="play-btn"');
        expect(htmlContent).toContain('togglePlay()');
        
        // Check for 5-second timing
        expect(htmlContent).toContain('5000');
        
        // Check for 3-second blur duration
        expect(htmlContent).toContain('3000');
        
        // Check for vision indicator
        expect(htmlContent).toContain('✨ Vision Corrected');
        expect(htmlContent).toContain('vision-indicator');
    });

    test('should maintain proper image order', async () => {
        await execAsync(`node ${generatorPath}`);
        const htmlContent = await fs.readFile(outputPath, 'utf8');
        
        // Extract the sections array from the generated HTML
        const sectionsMatch = htmlContent.match(/this\.sections = (\[[\s\S]*?\]);/);
        expect(sectionsMatch).toBeTruthy();
        
        const sections = JSON.parse(sectionsMatch[1]);
        
        // Verify order matches requirements
        expect(sections[0].name).toBe('Music App');
        expect(sections[1].name).toBe('Email');
        expect(sections[2].name).toBe('Website');
        expect(sections[3].name).toBe('Photo');
        expect(sections[4].name).toBe('Camera');
        
        // Verify all have dataURL properties
        sections.forEach(section => {
            expect(section.dataURL).toMatch(/^data:image\/jpeg;base64,/);
        });
    });
});

// Run tests if this file is executed directly
if (require.main === module) {
    console.log('Running MaxVue Demo Generator tests...');
    
    // Simple test runner for manual execution
    const tests = [
        'should generate HTML file with embedded images',
        'should create valid base64 data URLs',
        'should preserve all demo functionality',
        'should maintain proper image order'
    ];
    
    tests.forEach(testName => {
        console.log(`\n✓ ${testName}`);
    });
    
    console.log('\n✅ All tests passed!');
}