/**
 * Test for direct opacity transition fix - replacing CSS classes with style.opacity
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Demo Direct Opacity Fix', () => {
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

    test('should NOT have CSS classes for .visible and .fade-out', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have CSS class definitions for transitions
        expect(html).not.toContain('.clear-image.visible');
        expect(html).not.toContain('.blurred-image.fade-out');
        expect(html).not.toContain('fade-out');
        expect(html).not.toContain('.visible');
    });

    test('should have transitionToClear method using direct opacity', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        expect(html).toContain('transitionToClear()');
        expect(html).toContain("style.opacity = '0'");
        expect(html).toContain("style.opacity = '1'");
        expect(html).toContain('DIRECT opacity transition');
    });

    test('should NOT use classList.add for fade-out or visible', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have CSS class manipulations for transitions
        expect(html).not.toContain("classList.add('visible')");
        expect(html).not.toContain("classList.add('fade-out')");
        expect(html).not.toContain("classList.remove('fade-out')");
        expect(html).not.toContain("classList.remove('visible')");
    });

    test('transitionToClear should use direct style.opacity changes', () => {
        expect(typeof maxVueDemo.transitionToClear).toBe('function');
        
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Set initial state
        maxVueDemo.resetToBlurredState();
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
        
        // Call transition
        maxVueDemo.transitionToClear();
        
        // Check direct opacity changes (not CSS classes)
        expect(blurredImage.style.opacity).toBe('0');
        expect(clearImage.style.opacity).toBe('1');
        
        // Should NOT have added CSS classes
        expect(blurredImage.classList.contains('fade-out')).toBe(false);
        expect(clearImage.classList.contains('visible')).toBe(false);
    });

    test('should maintain CSS transitions on content-image elements', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should keep CSS transition property
        expect(html).toContain('transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1)');
        
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // After reset, should have transition enabled
        maxVueDemo.resetToBlurredState();
        
        // Wait for transitions to be re-enabled
        await new Promise(resolve => setTimeout(resolve, 75));
        
        const blurredTransition = blurredImage.style.transition;
        const clearTransition = clearImage.style.transition;
        
        expect(blurredTransition).toContain('opacity 2s');
        expect(clearTransition).toContain('opacity 2s');
    });

    test('resetToBlurredState should NOT remove CSS classes that do not exist', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should only remove 'show' from vision indicator
        expect(html).toContain("classList.remove('show')");
        
        // Should NOT try to remove non-existent classes
        expect(html).not.toContain("classList.remove('fade-out')");
        expect(html).not.toContain("classList.remove('visible')");
    });

    test('direct opacity changes should work immediately without CSS class delays', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Start with known state
        blurredImage.style.opacity = '1';
        clearImage.style.opacity = '0';
        
        // Apply direct transition
        maxVueDemo.transitionToClear();
        
        // Changes should be immediate in inline styles
        expect(blurredImage.style.opacity).toBe('0');
        expect(clearImage.style.opacity).toBe('1');
        
        // No CSS classes should be involved
        expect(blurredImage.className).not.toContain('fade-out');
        expect(clearImage.className).not.toContain('visible');
    });

    test('should have comprehensive opacity debug logging', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have OPACITY_DEBUG logging for direct transitions
        expect(html).toContain('OPACITY_DEBUG: Starting DIRECT opacity transition');
        expect(html).toContain('OPACITY_DEBUG: DIRECT transition applied');
        expect(html).toContain('OPACITY_DEBUG: After direct change');
        expect(html).toContain('Before transition - Blurred opacity');
        expect(html).toContain('After direct change - Clear inline');
    });

    test('startSectionTimer should call transitionToClear instead of CSS classes', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should call transitionToClear method
        expect(html).toContain('this.transitionToClear()');
        
        // Should NOT have inline CSS class manipulations in timer
        const timerSection = html.substring(
            html.indexOf('this.transitionTimer = setTimeout'),
            html.indexOf('}, 3000);') + 10
        );
        
        expect(timerSection).not.toContain("classList.add('visible')");
        expect(timerSection).not.toContain("classList.add('fade-out')");
    });

    test('end-to-end opacity transition should work correctly', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Test complete cycle
        console.log('Testing complete opacity transition cycle...');
        
        // 1. Reset to blurred state
        maxVueDemo.resetToBlurredState();
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
        console.log('✅ Reset: blurred=1, clear=0');
        
        // 2. Transition to clear
        maxVueDemo.transitionToClear();
        expect(blurredImage.style.opacity).toBe('0');
        expect(clearImage.style.opacity).toBe('1');
        console.log('✅ Transition: blurred=0, clear=1');
        
        // 3. Reset again (for next section)
        maxVueDemo.resetToBlurredState();
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
        console.log('✅ Reset again: blurred=1, clear=0');
        
        console.log('✅ Complete opacity cycle working with direct style changes');
    });
});