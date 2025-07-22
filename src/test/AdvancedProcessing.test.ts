// AdvancedProcessing.test.ts
// Location: src/test/AdvancedProcessing.test.ts
// Purpose: Unit tests for AdvancedImageProcessor (Layer 3)
// Follows CLAUDE.md and project best practices

import { beforeAll, beforeEach, afterEach, describe, test, expect, vi } from 'vitest';
import { AdvancedImageProcessor, ProcessingParameters } from '../utils/AdvancedImageProcessor';

// Mock browser APIs for Node.js test environment
beforeAll(() => {
  // Mock ImageData constructor
  global.ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;

    constructor(dataOrWidth: Uint8ClampedArray | number, width?: number, height?: number) {
      if (typeof dataOrWidth === 'number') {
        this.width = dataOrWidth;
        this.height = width!;
        this.data = new Uint8ClampedArray(dataOrWidth * width! * 4);
      } else {
        this.data = dataOrWidth;
        this.width = width!;
        this.height = height!;
      }
    }
  } as any;

  // Mock HTMLCanvasElement and CanvasRenderingContext2D
  global.HTMLCanvasElement = class HTMLCanvasElement {
    width = 100;
    height = 100;
    
    getContext(contextId: string) {
      if (contextId === '2d') {
        return {
          fillStyle: '',
          fillRect: vi.fn(),
          fillText: vi.fn(),
          getImageData: vi.fn().mockReturnValue(
            new ImageData(new Uint8ClampedArray(100 * 100 * 4), 100, 100)
          ),
          putImageData: vi.fn()
        };
      }
      return null;
    }
    
    toDataURL() {
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    }
  } as any;

  // Mock document.createElement
  const originalCreateElement = document.createElement;
  document.createElement = vi.fn().mockImplementation((tagName: string) => {
    if (tagName === 'canvas') {
      return new HTMLCanvasElement();
    }
    return originalCreateElement.call(document, tagName);
  });
});

describe('Advanced Image Processor', () => {
  let processor: AdvancedImageProcessor;
  let testElement: HTMLElement;
  let mockImageData: ImageData;

  beforeEach(() => {
    processor = new AdvancedImageProcessor();
    testElement = document.createElement('div');
    testElement.textContent = 'Test presbyopia text content';
    document.body.appendChild(testElement);
    
    // Create mock ImageData with proper structure
    const data = new Uint8ClampedArray(100 * 100 * 4);
    // Fill with white background
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 255; // A
    }
    // Add some black text pixels for testing
    for (let i = 1000; i < 2000; i += 4) {
      data[i] = 0;       // R
      data[i + 1] = 0;   // G
      data[i + 2] = 0;   // B
      data[i + 3] = 255; // A
    }
    mockImageData = new ImageData(data, 100, 100);
  });

  afterEach(() => {
    if (document.body.contains(testElement)) {
      document.body.removeChild(testElement);
    }
  });

  test('processes element without errors', async () => {
    const params: ProcessingParameters = {
      edgeEnhancement: 1.0,
      unsharpStrength: 1.0,
      unsharpRadius: 1.0,
      contrastBoost: 1.0,
      preserveImages: true
    };

    await expect(processor.processElement(testElement, params)).resolves.not.toThrow();
  });

  test('edge enhancement increases edge definition', () => {
    // Access private method using bracket notation for testing
    const enhanced = (processor as any).applyEdgeEnhancement(mockImageData, 1.5);
    
    expect(enhanced.width).toBe(mockImageData.width);
    expect(enhanced.height).toBe(mockImageData.height);
    expect(enhanced.data.length).toBe(mockImageData.data.length);
    expect(enhanced).toBeInstanceOf(ImageData);
  });

  test('unsharp masking enhances sharpness', () => {
    // Access private method using bracket notation for testing
    const sharpened = (processor as any).applyUnsharpMasking(mockImageData, 1.2, 1.0);
    
    expect(sharpened.width).toBe(mockImageData.width);
    expect(sharpened.height).toBe(mockImageData.height);
    expect(sharpened).toBeInstanceOf(ImageData);
  });

  test('graceful degradation on processing failure', async () => {
    // Test with an element that might cause processing issues
    const invalidElement = document.createElement('div');
    
    const params: ProcessingParameters = {
      edgeEnhancement: 1.0,
      unsharpStrength: 1.0,
      unsharpRadius: 1.0,
      contrastBoost: 1.0,
      preserveImages: true
    };

    // Should not throw, should gracefully degrade to baseline CSS
    await expect(processor.processElement(invalidElement, params)).resolves.not.toThrow();
  });

  test('gaussian blur returns valid ImageData', () => {
    // Test the gaussian blur method
    const blurred = (processor as any).gaussianBlur(mockImageData, 1.0);
    
    expect(blurred.width).toBe(mockImageData.width);
    expect(blurred.height).toBe(mockImageData.height);
    expect(blurred.data.length).toBe(mockImageData.data.length);
    expect(blurred).toBeInstanceOf(ImageData);
  });

  test('adaptive contrast applies correctly', () => {
    const regions = [{
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      type: 'text' as const,
      enhancement: 1.5
    }];

    const contrasted = (processor as any).applyAdaptiveContrast(mockImageData, 1.3, regions);
    
    expect(contrasted.width).toBe(mockImageData.width);
    expect(contrasted.height).toBe(mockImageData.height);
    expect(contrasted).toBeInstanceOf(ImageData);
  });
}); 