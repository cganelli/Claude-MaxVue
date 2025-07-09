/**
 * Test for vision corrected banner removal - clean minimal demo
 * Following CLAUDE.md best practices - C-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Demo Vision Banner Removal', () => {
    let dom;
    let window;
    let document;
    let maxVueDemo;

    beforeEach(async () => {
        // Load the generated HTML
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Create JSDOM instance
        dom = new JSDOM(html, {
            runScripts: 'dangerously',
            resources: 'usable',
            pretendToBeVisual: true
        });
        
        window = dom.window;
        document = window.document;
        
        // Wait for DOMContentLoaded
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
        
        maxVueDemo = window.maxVueDemo;
    });

    afterEach(() => {
        dom.window.close();
    });

    test('should NOT have vision corrected banner HTML element', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have vision indicator HTML
        expect(html).not.toContain('✨ Vision Corrected');
        expect(html).not.toContain('visionIndicator');
        expect(html).not.toContain('vision-indicator');
        
        // Check DOM element doesn't exist
        const visionElement = document.getElementById('visionIndicator');
        expect(visionElement).toBeNull();
    });

    test('should NOT have vision indicator CSS styling', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have vision indicator CSS classes
        expect(html).not.toContain('.vision-indicator');
        expect(html).not.toContain('.vision-banner');
        expect(html).not.toContain('.banner-text');
        
        // Should NOT have related CSS properties
        expect(html).not.toContain('backdrop-filter: blur');
        expect(html).not.toContain('Vision Corrected');
    });

    test('should NOT have banner show/hide code in transitions', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have classList operations for vision indicator
        expect(html).not.toContain("classList.add('show')");
        expect(html).not.toContain("classList.remove('show')");
        expect(html).not.toContain('visionIndicator.classList');
        
        // Should NOT have showVisionCorrectedLabel function
        expect(html).not.toContain('showVisionCorrectedLabel');
    });

    test('should maintain clean image-only transitions', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should KEEP direct opacity transitions
        expect(html).toContain("style.opacity = '0'");
        expect(html).toContain("style.opacity = '1'");
        expect(html).toContain('transitionToClear()');
        
        // Should KEEP resetToBlurredState function
        expect(html).toContain('resetToBlurredState()');
        
        // Should KEEP timing structure
        expect(html).toContain('}, 2000);'); // transition timer
        expect(html).toContain('}, 4000);'); // section timer
    });

    test('should have clean transitionToClear function without banner code', () => {
        expect(typeof maxVueDemo.transitionToClear).toBe('function');
        
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Set initial state
        maxVueDemo.resetToBlurredState();
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
        
        // Call transition - should only change opacity
        maxVueDemo.transitionToClear();
        
        // Check opacity changes work
        expect(blurredImage.style.opacity).toBe('0');
        expect(clearImage.style.opacity).toBe('1');
        
        // Should NOT have vision indicator element to manipulate
        const visionElement = document.getElementById('visionIndicator');
        expect(visionElement).toBeNull();
    });

    test('should have clean resetToBlurredState function without banner code', () => {
        expect(typeof maxVueDemo.resetToBlurredState).toBe('function');
        
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Call reset - should only affect image opacity
        maxVueDemo.resetToBlurredState();
        
        // Check reset works
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
        
        // Should NOT try to manipulate non-existent vision indicator
        const visionElement = document.getElementById('visionIndicator');
        expect(visionElement).toBeNull();
    });

    test('should NOT have banner-related timing code', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have setTimeout calls for banner display
        expect(html).not.toContain('setTimeout.*show');
        expect(html).not.toContain('setTimeout.*hide');
        expect(html).not.toContain('setTimeout.*banner');
        
        // Should KEEP core timing structure
        expect(html).toContain('this.transitionTimer = setTimeout');
        expect(html).toContain('this.sectionTimer = setTimeout');
    });

    test('should maintain 20-second loop with 4-second sections', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should maintain timing structure
        expect(html).toContain('}, 2000);'); // 2s blur
        expect(html).toContain('}, 4000);'); // 4s total per section
        expect(html).toContain('progress += 2.5'); // 4-second progress bar
        
        // Should maintain loop logic
        expect(html).toContain('currentSection >= this.sections.length');
        expect(html).toContain('this.currentSection = 0');
    });

    test('should have minimal clean demo with pure visual demonstration', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have core elements
        expect(html).toContain('blurredImage');
        expect(html).toContain('clearImage');
        expect(html).toContain('phone-mockup');
        expect(html).toContain('MaxVue Demo');
        
        // Should NOT have text overlays or banners
        expect(html).not.toContain('Vision Corrected');
        expect(html).not.toContain('vision-indicator');
        expect(html).not.toContain('banner');
        
        // Should maintain core functionality
        expect(html).toContain('playSection()');
        expect(html).toContain('transitionToClear()');
        expect(html).toContain('resetToBlurredState()');
    });

    test('should have clean debug logging without banner references', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should KEEP opacity and timing debug logs
        expect(html).toContain('OPACITY_DEBUG');
        expect(html).toContain('TIMING_DEBUG');
        expect(html).toContain('IMAGE_DEBUG');
        
        // Should NOT have banner-related debug logs
        expect(html).not.toContain('banner');
        expect(html).not.toContain('Vision Corrected');
        expect(html).not.toContain('show indicator');
    });
});