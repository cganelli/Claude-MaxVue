// EnhancedCSS.test.ts
// Location: src/test/EnhancedCSS.test.ts
// Purpose: Unit tests for EnhancedCSSProcessor (Layer 1 CSS optimization)
// Follows CLAUDE.md and project best practices

import { EnhancedCSSProcessor } from '../utils/VisionCorrectionEngine';

describe('Enhanced CSS Processor', () => {
  let processor: EnhancedCSSProcessor;
  let testElement: HTMLElement;

  beforeEach(() => {
    processor = new EnhancedCSSProcessor();
    testElement = document.createElement('div');
    testElement.textContent = 'Test presbyopia text';
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    document.body.removeChild(testElement);
  });

  test('applies baseline configuration correctly', () => {
    processor.applyEnhancedCSS(testElement, 0);
    expect(testElement.style.filter).toContain('contrast(1.5)');
    expect(testElement.style.filter).toContain('brightness(1.1)');
    expect(testElement.style.filter).toContain('drop-shadow');
  });

  test('applies enhanced configuration correctly', () => {
    processor.applyEnhancedCSS(testElement, 2);
    expect(testElement.style.filter).toContain('contrast(1.7)');
    expect(testElement.style.filter).toContain('brightness(1.15)');
    expect(testElement.style.textShadow).toBeTruthy();
    // font smoothing and text rendering are set via setProperty, not style property
    // so we check computed style for text-rendering
    expect(window.getComputedStyle(testElement).getPropertyValue('text-rendering')).toBe('optimizeLegibility');
  });

  test('returns correct configuration count', () => {
    expect(processor.getTotalConfigurations()).toBe(5);
  });

  test('retrieves configuration correctly', () => {
    const config = processor.getCurrentConfig(1);
    expect(config.contrast).toBe(1.6);
    expect(config.brightness).toBe(1.12);
  });
}); 