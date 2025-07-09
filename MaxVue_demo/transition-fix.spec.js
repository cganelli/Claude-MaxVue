/**
 * Test for the dual image transition fix
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Demo Transition Fix', () => {
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

    test('should have fade-out CSS class for blurred image', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        expect(html).toContain('.blurred-image.fade-out');
        expect(html).toContain('opacity: 0');
    });

    test('should start with blurred image visible and clear image hidden', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Load first section
        maxVueDemo.loadSection(0);
        
        // Check initial states
        expect(blurredImage.classList.contains('fade-out')).toBe(false);
        expect(clearImage.classList.contains('visible')).toBe(false);
        
        // Check computed styles
        expect(window.getComputedStyle(blurredImage).opacity).toBe('1');
        expect(window.getComputedStyle(clearImage).opacity).toBe('0');
    });

    test('should transition both images when visible class is added', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Load first section
        maxVueDemo.loadSection(0);
        
        // Trigger transition manually (same as setTimeout logic)
        blurredImage.classList.add('fade-out');
        clearImage.classList.add('visible');
        
        // Check classes were added
        expect(blurredImage.classList.contains('fade-out')).toBe(true);
        expect(clearImage.classList.contains('visible')).toBe(true);
        
        // Check computed styles after transition
        expect(window.getComputedStyle(blurredImage).opacity).toBe('0');
        expect(window.getComputedStyle(clearImage).opacity).toBe('1');
    });

    test('should reset both images when starting new section', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Load first section and trigger transition
        maxVueDemo.loadSection(0);
        blurredImage.classList.add('fade-out');
        clearImage.classList.add('visible');
        
        // Verify transition happened
        expect(blurredImage.classList.contains('fade-out')).toBe(true);
        expect(clearImage.classList.contains('visible')).toBe(true);
        
        // Reset by playing new section (which calls the reset logic)
        maxVueDemo.currentSection = 0;
        maxVueDemo.playSection();
        
        // Should be reset to initial state
        expect(blurredImage.classList.contains('fade-out')).toBe(false);
        expect(clearImage.classList.contains('visible')).toBe(false);
        
        // Check computed styles are reset
        expect(window.getComputedStyle(blurredImage).opacity).toBe('1');
        expect(window.getComputedStyle(clearImage).opacity).toBe('0');
    });

    test('should have correct z-index layering', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Check z-index values
        const blurredZIndex = window.getComputedStyle(blurredImage).zIndex;
        const clearZIndex = window.getComputedStyle(clearImage).zIndex;
        
        expect(blurredZIndex).toBe('2'); // Blurred should be on top
        expect(clearZIndex).toBe('1');   // Clear should be behind
        
        console.log('Blurred z-index:', blurredZIndex);
        console.log('Clear z-index:', clearZIndex);
    });

    test('should have smooth transition properties for both images', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Both images should have transition property
        expect(html).toContain('transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1)');
        
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Check computed transition properties
        const blurredTransition = window.getComputedStyle(blurredImage).transition;
        const clearTransition = window.getComputedStyle(clearImage).transition;
        
        expect(blurredTransition).toContain('opacity');
        expect(clearTransition).toContain('opacity');
        
        console.log('Blurred transition:', blurredTransition);
        console.log('Clear transition:', clearTransition);
    });
});