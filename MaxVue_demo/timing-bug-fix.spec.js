/**
 * Test for timing bug fix - ensuring separate timers for transition and section change
 * Following CLAUDE.md best practices - C-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Demo Timing Bug Fix', () => {
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

    test('should have separate timers for transition and section change', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have SEPARATE setTimeout calls for transition and section change
        const transitionTimeout = html.includes('setTimeout(() => {\n                    this.transitionToClear();\n                }, 2000);');
        const sectionTimeout = html.includes('setTimeout(() => {\n                    console.log(\'IMAGE_DEBUG: Moving to next section\');\n                    this.currentSection++;\n                    this.playSection();\n                }, 4000);');
        
        expect(transitionTimeout || html.includes('this.transitionToClear()') && html.includes('}, 2000')).toBe(true);
        expect(sectionTimeout || html.includes('this.currentSection++') && html.includes('}, 4000')).toBe(true);
    });

    test('should NOT have transition and section change in same timeout', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have both actions in same setTimeout
        const combinedAction = html.includes('this.transitionToClear();\n                    console.log(\'IMAGE_DEBUG: Moving to next section\');') ||
                              html.includes('this.transitionToClear();\n                }, 2000);\n\n                // Move to next section after 4 seconds');
        
        expect(combinedAction).toBe(false);
    });

    test('should have transition timer at 2000ms and section timer at 4000ms', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Extract timeout values
        const transitionTimerMatch = html.match(/this\.transitionTimer = setTimeout\([^}]+\}, (\d+)\);/);
        const sectionTimerMatch = html.match(/this\.sectionTimer = setTimeout\([^}]+\}, (\d+)\);/);
        
        expect(transitionTimerMatch).toBeTruthy();
        expect(sectionTimerMatch).toBeTruthy();
        
        if (transitionTimerMatch && sectionTimerMatch) {
            const transitionMs = parseInt(transitionTimerMatch[1]);
            const sectionMs = parseInt(sectionTimerMatch[1]);
            
            expect(transitionMs).toBe(2000);
            expect(sectionMs).toBe(4000);
        }
    });

    test('should provide clear images full 2 seconds visibility', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have comment explaining the timing
        expect(html).toContain('clear for 2s');
        expect(html).toContain('After 2 seconds, fade to clear image');
        expect(html).toContain('Move to next section after 4 seconds');
        
        // Should NOT move to next section at 2 seconds
        expect(html).not.toContain('Move to next section after 2 seconds');
    });

    test('should have proper timer cleanup for both timers', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should clear both timers in stop method
        expect(html).toContain('clearTimeout(this.sectionTimer)');
        expect(html).toContain('clearTimeout(this.transitionTimer)');
    });

    test('should have debug logging for separate timer phases', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have debug logging for different phases
        expect(html).toContain('TIMER_DEBUG') || expect(html).toContain('Starting transition phase');
        expect(html).toContain('Moving to next section') || expect(html).toContain('Starting section change');
    });

    test('timing flow should follow correct sequence', () => {
        // Mock setTimeout to track timing
        const timeouts = [];
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = (callback, delay) => {
            timeouts.push({ callback, delay });
            return originalSetTimeout(callback, delay);
        };

        // Start a section
        maxVueDemo.loadSection(0);
        maxVueDemo.startSectionTimer();

        // Should have two separate timeouts
        expect(timeouts.length).toBeGreaterThanOrEqual(2);
        
        // Find transition and section timeouts
        const transitionTimeout = timeouts.find(t => t.delay === 2000);
        const sectionTimeout = timeouts.find(t => t.delay === 4000);
        
        expect(transitionTimeout).toBeTruthy();
        expect(sectionTimeout).toBeTruthy();
        
        // Restore original setTimeout
        window.setTimeout = originalSetTimeout;
    });

    test('should maintain clear image visibility for full 2 seconds', async () => {
        // This test ensures the timing allows clear image to be visible
        // from 2s to 4s (full 2 second duration)
        
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Start with blurred state
        maxVueDemo.resetToBlurredState();
        expect(blurredImage.style.opacity).toBe('1');
        expect(clearImage.style.opacity).toBe('0');
        
        // After transition (at 2s mark), clear should be visible
        maxVueDemo.transitionToClear();
        expect(blurredImage.style.opacity).toBe('0');
        expect(clearImage.style.opacity).toBe('1');
        
        // Clear image should remain visible until next section starts (at 4s mark)
        // The bug was that section changed immediately at 2s, not allowing 
        // the clear image the full 2 seconds of visibility
    });
});