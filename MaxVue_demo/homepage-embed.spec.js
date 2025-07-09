/**
 * Test for homepage embed version creation - minimal phone mockup only
 * Following CLAUDE.md best practices - C-1 (TDD)
 */

import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('MaxVue Homepage Embed Version', () => {
    let embedExists = false;
    let embedHtml = '';

    beforeAll(async () => {
        // Check if embed file exists
        const embedPath = path.join(__dirname, 'maxvue-homepage-embed.html');
        try {
            embedHtml = await fs.readFile(embedPath, 'utf8');
            embedExists = true;
        } catch (error) {
            embedExists = false;
        }
    });

    test('should have homepage embed file created', async () => {
        const embedPath = path.join(__dirname, 'maxvue-homepage-embed.html');
        
        let fileExists = false;
        try {
            await fs.access(embedPath);
            fileExists = true;
        } catch (error) {
            fileExists = false;
        }
        
        expect(fileExists).toBe(true);
    });

    test('should preserve original demo file unchanged', async () => {
        const originalPath = path.join(__dirname, 'maxvue-demo-with-images.html');
        
        let originalExists = false;
        try {
            await fs.access(originalPath);
            originalExists = true;
        } catch (error) {
            originalExists = false;
        }
        
        expect(originalExists).toBe(true);
        
        if (originalExists) {
            const originalHtml = await fs.readFile(originalPath, 'utf8');
            // Original should still have demo container
            expect(originalHtml).toContain('demo-container');
            expect(originalHtml).toContain('MaxVue Demo');
            expect(originalHtml).toContain('play-btn');
        }
    });

    test('should NOT have demo container wrapper', () => {
        if (!embedExists) return;
        
        // Should NOT have demo container wrapper
        expect(embedHtml).not.toContain('demo-container');
        expect(embedHtml).not.toContain('class="demo-container"');
    });

    test('should NOT have title and subtitle text', () => {
        if (!embedExists) return;
        
        // Should NOT have demo header elements
        expect(embedHtml).not.toContain('demo-header');
        expect(embedHtml).not.toContain('demo-title');
        expect(embedHtml).not.toContain('demo-subtitle');
        expect(embedHtml).not.toContain('MaxVue Demo');
        expect(embedHtml).not.toContain('Experience crystal clear vision correction');
    });

    test('should NOT have play/pause controls', () => {
        if (!embedExists) return;
        
        // Should NOT have controls
        expect(embedHtml).not.toContain('controls');
        expect(embedHtml).not.toContain('play-btn');
        expect(embedHtml).not.toContain('playBtn');
        expect(embedHtml).not.toContain('▶');
        expect(embedHtml).not.toContain('❚❚');
    });

    test('should NOT have progress bar', () => {
        if (!embedExists) return;
        
        // Should NOT have progress elements
        expect(embedHtml).not.toContain('progress-container');
        expect(embedHtml).not.toContain('progress-bar');
        expect(embedHtml).not.toContain('progressBar');
    });

    test('should NOT have section labels', () => {
        if (!embedExists) return;
        
        // Should NOT have section label elements
        expect(embedHtml).not.toContain('section-label');
        expect(embedHtml).not.toContain('sectionLabel');
        expect(embedHtml).not.toContain('Ready to Start');
        expect(embedHtml).not.toContain('Email');
        expect(embedHtml).not.toContain('Music App');
    });

    test('should have transparent background CSS', () => {
        if (!embedExists) return;
        
        // Should have transparent background
        expect(embedHtml).toContain('background: transparent');
        
        // Should NOT have demo container background styling
        expect(embedHtml).not.toContain('background: white');
        expect(embedHtml).not.toContain('border-radius: 20px');
        expect(embedHtml).not.toContain('box-shadow: 0 20px 60px');
    });

    test('should KEEP phone mockup and core functionality', () => {
        if (!embedExists) return;
        
        // Should KEEP essential elements
        expect(embedHtml).toContain('phone-mockup');
        expect(embedHtml).toContain('phone-screen');
        expect(embedHtml).toContain('blurredImage');
        expect(embedHtml).toContain('clearImage');
        expect(embedHtml).toContain('image-container');
        
        // Should KEEP core functionality
        expect(embedHtml).toContain('transitionToClear()');
        expect(embedHtml).toContain('resetToBlurredState()');
        expect(embedHtml).toContain('playSection()');
    });

    test('should auto-start demo for embed usage', () => {
        if (!embedExists) return;
        
        // Should auto-start without requiring play button click
        expect(embedHtml).toContain('this.play()') || 
        expect(embedHtml).toContain('autostart') ||
        expect(embedHtml).toContain('DOMContentLoaded');
    });

    test('should maintain 20-second loop functionality', () => {
        if (!embedExists) return;
        
        // Should keep timing structure
        expect(embedHtml).toContain('}, 2000);'); // transition timer
        expect(embedHtml).toContain('}, 4000);'); // section timer
        expect(embedHtml).toContain('currentSection >= this.sections.length'); // loop logic
    });

    test('should have minimal CSS for embedding', () => {
        if (!embedExists) return;
        
        // Should have minimal body styling
        expect(embedHtml).toContain('margin: 0');
        expect(embedHtml).toContain('padding: 0');
        expect(embedHtml).toContain('display: flex');
        expect(embedHtml).toContain('justify-content: center');
        expect(embedHtml).toContain('align-items: center');
    });

    test('should maintain image transitions without UI distractions', () => {
        if (!embedExists) return;
        
        // Should have core image transition functionality
        expect(embedHtml).toContain("style.opacity = '0'");
        expect(embedHtml).toContain("style.opacity = '1'");
        expect(embedHtml).toContain('transition: opacity 0.5s');
        
        // Should NOT have UI distractions
        expect(embedHtml).not.toContain('controls');
        expect(embedHtml).not.toContain('progress');
        expect(embedHtml).not.toContain('demo-title');
    });

    test('should be suitable for iframe embedding', () => {
        if (!embedExists) return;
        
        // Should have characteristics suitable for iframe
        expect(embedHtml).toContain('background: transparent'); // transparent background
        expect(embedHtml).not.toContain('demo-container'); // no wrapper
        expect(embedHtml).not.toContain('play-btn'); // no manual controls
        
        // Should center the phone mockup
        expect(embedHtml).toContain('justify-content: center');
        expect(embedHtml).toContain('align-items: center');
    });
});