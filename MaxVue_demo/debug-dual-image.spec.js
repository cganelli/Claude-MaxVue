/**
 * Debug test for dual image pre-blurred approach
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Demo Dual Image Debug', () => {
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

    test('should have both blurred and clear image elements', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        expect(blurredImage).toBeTruthy();
        expect(clearImage).toBeTruthy();
        expect(blurredImage.tagName).toBe('IMG');
        expect(clearImage.tagName).toBe('IMG');
    });

    test('should have correct CSS classes for dual images', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        expect(blurredImage.classList.contains('content-image')).toBe(true);
        expect(blurredImage.classList.contains('blurred-image')).toBe(true);
        
        expect(clearImage.classList.contains('content-image')).toBe(true);
        expect(clearImage.classList.contains('clear-image')).toBe(true);
    });

    test('should have sections with both clearDataURL and blurredDataURL', () => {
        expect(maxVueDemo).toBeTruthy();
        expect(maxVueDemo.sections).toBeTruthy();
        expect(maxVueDemo.sections.length).toBe(5);
        
        maxVueDemo.sections.forEach((section, index) => {
            expect(section.name).toBeTruthy();
            expect(section.clearDataURL).toBeTruthy();
            expect(section.blurredDataURL).toBeTruthy();
            expect(section.clearDataURL).toMatch(/^data:image\//);
            expect(section.blurredDataURL).toMatch(/^data:image\//);
            
            console.log(`Section ${index}: ${section.name}`);
            console.log(`  Clear URL length: ${section.clearDataURL.length}`);
            console.log(`  Blurred URL length: ${section.blurredDataURL.length}`);
        });
    });

    test('should load images and set initial states correctly', () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Load first section
        maxVueDemo.loadSection(0);
        
        // Check that both images have src set
        expect(blurredImage.src).toBeTruthy();
        expect(clearImage.src).toBeTruthy();
        expect(blurredImage.src).toMatch(/^data:image\//);
        expect(clearImage.src).toMatch(/^data:image\//);
        
        // Initial opacity states (from CSS)
        const blurredOpacity = window.getComputedStyle(blurredImage).opacity;
        const clearOpacity = window.getComputedStyle(clearImage).opacity;
        
        console.log('Initial blurred opacity:', blurredOpacity);
        console.log('Initial clear opacity:', clearOpacity);
        
        expect(blurredOpacity).toBe('1'); // Should be visible
        expect(clearOpacity).toBe('0');   // Should be hidden
    });

    test('should transition to clear image when visible class is added', () => {
        const clearImage = document.getElementById('clearImage');
        
        // Load first section
        maxVueDemo.loadSection(0);
        
        // Initial state - clear image should be hidden
        expect(clearImage.classList.contains('visible')).toBe(false);
        expect(window.getComputedStyle(clearImage).opacity).toBe('0');
        
        // Add visible class to trigger transition
        clearImage.classList.add('visible');
        
        // Check that class was added
        expect(clearImage.classList.contains('visible')).toBe(true);
        
        // CSS should make it visible when .visible class is present
        const opacity = window.getComputedStyle(clearImage).opacity;
        console.log('Clear image opacity after adding visible class:', opacity);
        expect(opacity).toBe('1');
    });

    test('should have correct CSS transition properties', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Check CSS for opacity transitions
        expect(html).toContain('transition: opacity');
        expect(html).toContain('.clear-image.visible');
        expect(html).toContain('opacity: 1');
        
        // Should NOT contain filter transitions
        expect(html).not.toContain('filter: blur');
        expect(html).not.toContain('transition: filter');
    });

    test('debug image loading process', () => {
        const section = maxVueDemo.sections[0];
        console.log('\n=== DEBUG FIRST SECTION ===');
        console.log('Section name:', section.name);
        console.log('Has clearDataURL:', !!section.clearDataURL);
        console.log('Has blurredDataURL:', !!section.blurredDataURL);
        console.log('Clear URL preview:', section.clearDataURL ? section.clearDataURL.substring(0, 50) + '...' : 'MISSING');
        console.log('Blurred URL preview:', section.blurredDataURL ? section.blurredDataURL.substring(0, 50) + '...' : 'MISSING');
        
        // Load section and check elements
        maxVueDemo.loadSection(0);
        
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        console.log('\n=== ELEMENT STATES ===');
        console.log('Blurred image src set:', !!blurredImage.src);
        console.log('Clear image src set:', !!clearImage.src);
        console.log('Blurred image alt:', blurredImage.alt);
        console.log('Clear image alt:', clearImage.alt);
        
        expect(section.clearDataURL).toBeTruthy();
        expect(section.blurredDataURL).toBeTruthy();
        expect(blurredImage.src).toBeTruthy();
        expect(clearImage.src).toBeTruthy();
    });
});