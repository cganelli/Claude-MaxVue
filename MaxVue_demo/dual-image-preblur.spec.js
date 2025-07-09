/**
 * Test for dual image pre-blurred approach
 * Following CLAUDE.md best practices - BP-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Demo Dual Image Pre-Blur', () => {
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

    test('should have two image elements for blur and clear', async () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        expect(blurredImage).toBeTruthy();
        expect(clearImage).toBeTruthy();
        
        // Both should be img elements
        expect(blurredImage.tagName).toBe('IMG');
        expect(clearImage.tagName).toBe('IMG');
    });

    test('should load both clear and blurred versions of all images', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have both clear and blurred data for each section
        expect(html).toContain('"blurredDataURL"');
        expect(html).toContain('"clearDataURL"');
        
        // Check for all image pairs
        const sections = ['Email', 'Music App', 'Photo', 'Website', 'Camera'];
        sections.forEach(section => {
            expect(html).toContain(`"name": "${section}"`);
        });
    });

    test('should NOT have any CSS filter blur code', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should NOT have blur filters in CSS
        expect(html).not.toContain('filter: blur(');
        expect(html).not.toContain('filter:blur(');
        
        // Should NOT have blur in JavaScript
        expect(html).not.toContain('style.filter');
        expect(html).not.toContain('.filter =');
    });

    test('should use opacity transitions instead of filter transitions', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have opacity transitions
        expect(html).toContain('transition: opacity');
        
        // Should NOT have filter transitions
        expect(html).not.toContain('transition: filter');
        expect(html).not.toContain('transition:filter');
    });

    test('should NOT use requestAnimationFrame for blur timing', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Extract JavaScript code
        const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
        expect(scriptMatch).toBeTruthy();
        const jsCode = scriptMatch[1];
        
        // Should NOT use RAF for blur timing
        expect(jsCode).not.toContain('requestAnimationFrame');
        
        // Should use simple setTimeout for image transitions
        expect(jsCode).toContain('setTimeout');
    });

    test('blurred image should show first, then fade to clear', async () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Initial state - blurred visible, clear hidden
        expect(window.getComputedStyle(blurredImage).opacity).toBe('1');
        expect(window.getComputedStyle(clearImage).opacity).toBe('0');
        
        // Start demo
        const playBtn = document.getElementById('playBtn');
        playBtn.click();
        
        // Should still show blurred image initially
        expect(window.getComputedStyle(blurredImage).opacity).toBe('1');
        expect(window.getComputedStyle(clearImage).opacity).toBe('0');
    });

    test('should have correct file mappings with blur extensions', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should reference the correct blurred files
        expect(html).toContain('email_blur.jpg');
        expect(html).toContain('spotify_blur.jpeg');
        expect(html).toContain('pug_blur.jpg');
        expect(html).toContain('wikipedia_blur.jpg');
        expect(html).toContain('flowers_blur.jpg');
        
        // Should reference the clear files
        expect(html).toContain('email.jpg');
        expect(html).toContain('spotify.jpg');
        expect(html).toContain('pug.JPG');
        expect(html).toContain('wikipedia.jpg');
        expect(html).toContain('flowers.jpg');
    });

    test('should maintain 5-second timing with 3s blur + 2s clear', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have 3000ms for transition timing
        expect(html).toContain('3000');
        
        // Should have 5000ms for total section timing
        expect(html).toContain('5000');
    });

    test('should position images in same location for seamless transition', async () => {
        const blurredImage = document.getElementById('blurredImage');
        const clearImage = document.getElementById('clearImage');
        
        // Both images should have same positioning
        const blurredStyle = window.getComputedStyle(blurredImage);
        const clearStyle = window.getComputedStyle(clearImage);
        
        expect(blurredStyle.position).toBe(clearStyle.position);
        expect(blurredStyle.width).toBe(clearStyle.width);
        expect(blurredStyle.height).toBe(clearStyle.height);
    });

    test('debug logs should reference image transitions not filter changes', async () => {
        const htmlPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        const html = await fs.readFile(htmlPath, 'utf8');
        
        // Should have image transition debug logs
        expect(html).toContain('IMAGE_DEBUG');
        
        // Should NOT have blur filter debug logs
        expect(html).not.toContain('BLUR_DEBUG');
        expect(html).not.toContain('filter');
    });
});