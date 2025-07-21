import { describe, it, expect, beforeEach } from 'vitest';
import { TextDetector } from '../TextDetector';
import type { TextRegion, Rectangle } from '../types';

// Helper to create test image data
function createTestImageData(width: number, height: number, pattern: 'blank' | 'text' | 'mixed'): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  
  switch (pattern) {
    case 'blank':
      // All white
      data.fill(255);
      break;
      
    case 'text':
      // Simulate text lines (black on white)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          // Create horizontal text-like patterns every 20 pixels
          const isTextLine = y % 20 < 5 && x > 10 && x < width - 10;
          const value = isTextLine ? 0 : 255;
          data[idx] = value;     // R
          data[idx + 1] = value; // G
          data[idx + 2] = value; // B
          data[idx + 3] = 255;   // A
        }
      }
      break;
      
    case 'mixed':
      // Mix of text and image areas
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          // Left half: text pattern
          if (x < width / 2) {
            const isTextLine = y % 15 < 3;
            const value = isTextLine ? 30 : 250;
            data[idx] = value;
            data[idx + 1] = value;
            data[idx + 2] = value;
          } else {
            // Right half: gradient (image-like)
            const gradient = (x / width) * 255;
            data[idx] = gradient;
            data[idx + 1] = gradient * 0.8;
            data[idx + 2] = gradient * 0.6;
          }
          data[idx + 3] = 255;
        }
      }
      break;
  }
  
  return { data, width, height, colorSpace: 'srgb' };
}

describe('TextDetector', () => {
  let detector: TextDetector;
  
  beforeEach(() => {
    detector = new TextDetector({
      sobelThreshold: 0.1,
      minTextSize: 50,
      gridCellSize: 20,
      performanceMode: 'balanced'
    });
  });
  
  describe('Edge Detection', () => {
    it('should detect edges using Sobel operator', () => {
      const imageData = createTestImageData(100, 100, 'text');
      const edges = detector.detectEdges(imageData);
      
      expect(edges).toBeDefined();
      expect(edges.length).toBe(100 * 100);
      
      // Should have high values at text boundaries
      const hasEdges = edges.some(value => value > 0.1);
      expect(hasEdges).toBe(true);
    });
    
    it('should return low edge values for blank image', () => {
      const imageData = createTestImageData(100, 100, 'blank');
      const edges = detector.detectEdges(imageData);
      
      // All edge values should be near zero
      const maxEdge = Math.max(...edges);
      expect(maxEdge).toBeLessThan(0.05);
    });
  });
  
  describe('Text Region Detection', () => {
    it('should detect text regions with >80% accuracy', () => {
      const imageData = createTestImageData(200, 100, 'text');
      const regions = detector.detectTextRegions(imageData);
      
      expect(regions).toBeDefined();
      expect(regions.length).toBeGreaterThan(0);
      
      // Check first region bounds (should detect text area)
      const firstRegion = regions[0];
      expect(firstRegion.bounds.x).toBeCloseTo(10, 10);
      expect(firstRegion.bounds.width).toBeGreaterThan(100);
      expect(firstRegion.confidence).toBeGreaterThan(0.8);
    });
    
    it('should filter out small noise regions', () => {
      const imageData = createTestImageData(100, 100, 'mixed');
      const regions = detector.detectTextRegions(imageData);
      
      // All regions should be larger than minTextSize
      regions.forEach(region => {
        const area = region.bounds.width * region.bounds.height;
        expect(area).toBeGreaterThan(50);
      });
    });
    
    it('should merge nearby text regions', () => {
      // Create image with two close text blocks
      const imageData = createTestImageData(200, 100, 'text');
      const regions = detector.detectTextRegions(imageData);
      
      // Should merge into fewer regions
      expect(regions.length).toBeLessThan(10);
    });
    
    it('should assign priority based on region size and confidence', () => {
      const imageData = createTestImageData(200, 200, 'mixed');
      const regions = detector.detectTextRegions(imageData);
      
      regions.forEach(region => {
        expect(region.priority).toBeGreaterThanOrEqual(0);
        expect(region.priority).toBeLessThanOrEqual(1);
      });
      
      // Larger, high-confidence regions should have higher priority
      if (regions.length > 1) {
        const sorted = [...regions].sort((a, b) => b.priority - a.priority);
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        
        expect(first.confidence).toBeGreaterThanOrEqual(last.confidence);
      }
    });
  });
  
  describe('Performance', () => {
    it.skip('should process Full HD image in <10ms', () => {
      const imageData = createTestImageData(1920, 1080, 'mixed');
      
      const start = performance.now();
      const regions = detector.detectTextRegions(imageData);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(10);
      expect(regions).toBeDefined();
    });
    
    it.skip('should handle different image sizes efficiently', () => {
      const sizes = [
        { width: 640, height: 480, maxTime: 3 },
        { width: 1280, height: 720, maxTime: 6 },
        { width: 1920, height: 1080, maxTime: 10 }
      ];
      
      sizes.forEach(({ width, height, maxTime }) => {
        const imageData = createTestImageData(width, height, 'text');
        
        const start = performance.now();
        detector.detectTextRegions(imageData);
        const duration = performance.now() - start;
        
        expect(duration).toBeLessThan(maxTime);
      });
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle empty image data', () => {
      const imageData = createTestImageData(0, 0, 'blank');
      const regions = detector.detectTextRegions(imageData);
      
      expect(regions).toEqual([]);
    });
    
    it('should handle single pixel image', () => {
      const imageData = createTestImageData(1, 1, 'blank');
      const regions = detector.detectTextRegions(imageData);
      
      expect(regions).toEqual([]);
    });
    
    it('should handle very small images', () => {
      const imageData = createTestImageData(10, 10, 'text');
      const regions = detector.detectTextRegions(imageData);
      
      // Should not crash, might not detect regions due to size threshold
      expect(Array.isArray(regions)).toBe(true);
    });
  });
  
  describe('Accuracy Validation', () => {
    it('should achieve >80% detection accuracy on known text areas', () => {
      // Create image with known text regions
      const width = 300;
      const height = 200;
      const knownTextAreas: Rectangle[] = [
        { x: 20, y: 20, width: 100, height: 30 },
        { x: 20, y: 60, width: 200, height: 40 },
        { x: 20, y: 120, width: 150, height: 25 }
      ];
      
      // Create image with these exact text areas
      const data = new Uint8ClampedArray(width * height * 4);
      data.fill(255); // White background
      
      knownTextAreas.forEach(area => {
        for (let y = area.y; y < area.y + area.height; y++) {
          for (let x = area.x; x < area.x + area.width; x++) {
            if (y % 5 < 2) { // Simulate text lines
              const idx = (y * width + x) * 4;
              data[idx] = 0;     // Black text
              data[idx + 1] = 0;
              data[idx + 2] = 0;
              data[idx + 3] = 255;
            }
          }
        }
      });
      
      const imageData = { data, width, height, colorSpace: 'srgb' as ColorSpaceType };
      const regions = detector.detectTextRegions(imageData);
      
      // Calculate detection accuracy
      let correctDetections = 0;
      knownTextAreas.forEach(known => {
        const detected = regions.find(r => 
          Math.abs(r.bounds.x - known.x) < 20 &&
          Math.abs(r.bounds.y - known.y) < 20 &&
          Math.abs(r.bounds.width - known.width) < 40 &&
          Math.abs(r.bounds.height - known.height) < 20
        );
        if (detected) correctDetections++;
      });
      
      const accuracy = correctDetections / knownTextAreas.length;
      expect(accuracy).toBeGreaterThan(0.8); // >80% accuracy
    });
  });
});