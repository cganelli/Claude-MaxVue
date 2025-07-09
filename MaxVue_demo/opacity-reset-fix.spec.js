/**
 * Test for opacity reset fix - ensuring sections 1-4 start with correct initial states
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Demo Opacity Reset Fix', () => {
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

    test('should have resetToBlurredState method', () => {
        expect(typeof maxVueDemo.resetToBlurredState).toBe('function');
    });

    test('resetToBlurredState should force correct opacity values', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Simulate wrong state (like from previous section)
        blurredImage.classList.add('fade-out');
        clearImage.classList.add('visible');
        
        // Verify wrong state exists
        expect(blurredImage.classList.contains('fade-out')).toBe(true);
        expect(clearImage.classList.contains('visible')).toBe(true);
        
        // Call reset function
        maxVueDemo.resetToBlurredState();
        
        // Check that classes are removed
        expect(blurredImage.classList.contains('fade-out')).toBe(false);
        expect(clearImage.classList.contains('visible')).toBe(false);
        
        // Check that inline styles are set correctly
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
    });

    test('should disable transitions temporarily during reset', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Call reset and check transition is disabled
        maxVueDemo.resetToBlurredState();
        
        expect(blurredImage.style.transition).toBe('none');
        expect(clearImage.style.transition).toBe('none');
    });

    test('should re-enable transitions after reset delay', (done) => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Call reset
        maxVueDemo.resetToBlurredState();
        
        // Check transitions are initially disabled
        expect(blurredImage.style.transition).toBe('none');
        expect(clearImage.style.transition).toBe('none');
        
        // Wait for transitions to be re-enabled (50ms + buffer)
        setTimeout(() => {
            expect(blurredImage.style.transition).toContain('opacity 2s');
            expect(clearImage.style.transition).toContain('opacity 2s');
            done();
        }, 75);
    });

    test('playSection should call resetToBlurredState before loading', () => {
        // Spy on resetToBlurredState method
        const resetSpy = jest.spyOn(maxVueDemo, 'resetToBlurredState');
        
        // Start playing
        maxVueDemo.currentSection = 1; // Start from section 1 to test reset
        maxVueDemo.isPlaying = true;
        maxVueDemo.playSection();
        
        // Should have called reset
        expect(resetSpy).toHaveBeenCalled();
        
        resetSpy.mockRestore();
    });

    test('should maintain correct opacity state after multiple section transitions', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Simulate multiple section transitions
        for (let i = 0; i < 3; i++) {
            console.log(`Testing section ${i}`);
            
            // Reset for this section
            maxVueDemo.resetToBlurredState();
            
            // Should always start with blurred=1, clear=0
            expect(blurredImage.style.opacity).toBe('1');
            expect(clearImage.style.opacity).toBe('0');
            
            // Simulate transition to clear
            blurredImage.classList.add('fade-out');
            clearImage.classList.add('visible');
            
            // Verify transition state
            expect(window.getComputedStyle(blurredImage).opacity).toBe('0');
            expect(window.getComputedStyle(clearImage).opacity).toBe('1');
        }
    });

    test('should have consistent opacity values between inline and computed styles', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Reset to known state
        maxVueDemo.resetToBlurredState();
        
        // Check inline styles (should be forced)
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
        
        // Check computed styles (should match inline)
        expect(window.getComputedStyle(blurredImage).opacity).toBe('1');
        expect(window.getComputedStyle(clearImage).opacity).toBe('0');
    });

    test('should properly clean up timers in stop method', () => {
        // Start demo to create timers
        maxVueDemo.isPlaying = true;
        maxVueDemo.currentSection = 0;
        maxVueDemo.playSection();
        
        // Verify timers exist (they should be created)
        // Note: In JSDOM we can't directly test setTimeout/setInterval cleanup
        // but we can test that the stop method is callable without errors
        expect(() => maxVueDemo.stop()).not.toThrow();
        
        // Verify playing state is reset
        expect(maxVueDemo.isPlaying).toBe(false);
        expect(maxVueDemo.playBtn.textContent).toBe('▶');
    });

    test('sections 1-4 should start with correct initial opacity states', async () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Test each section individually
        for (let sectionIndex = 0; sectionIndex < 4; sectionIndex++) {
            console.log(`Testing initial state for section ${sectionIndex}`);
            
            // Simulate what playSection does
            maxVueDemo.currentSection = sectionIndex;
            maxVueDemo.resetToBlurredState();
            
            // Wait for reset to complete
            await new Promise(resolve => setTimeout(resolve, 75));
            
            // Load the section
            maxVueDemo.loadSection(sectionIndex);
            
            // Check that section starts with correct opacity
            expect(blurredImage.style.opacity).toBe('1');
            expect(clearImage.style.opacity).toBe('0');
            expect(window.getComputedStyle(blurredImage).opacity).toBe('1');
            expect(window.getComputedStyle(clearImage).opacity).toBe('0');
            
            console.log(`✅ Section ${sectionIndex} starts with blurred=1, clear=0`);
        }
    });
});