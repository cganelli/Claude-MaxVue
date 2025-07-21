import { describe, it, expect, beforeEach } from 'vitest';
import { CanvasAnalyzer } from '../CanvasAnalyzer';
import type { AnalysisResult } from '../types';

// Helper to create test image data
function createTestImageData(width: number, height: number, pattern: 'text' | 'blank'): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  
  if (pattern === 'text') {
    // Create text-like pattern
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const isTextLine = y % 20 < 5 && x > 10 && x < width - 10;
        const value = isTextLine ? 0 : 255;
        data[idx] = value;
        data[idx + 1] = value;
        data[idx + 2] = value;
        data[idx + 3] = 255;
      }
    }
  } else {
    // Blank white image
    data.fill(255);
  }
  
  return { data, width, height, colorSpace: 'srgb' };
}

describe('CanvasAnalyzer', () => {
  let analyzer: CanvasAnalyzer;
  
  beforeEach(() => {
    analyzer = new CanvasAnalyzer({
      performanceMode: 'fast' // Use fast mode for tests
    });
  });
  
  describe('Core Analysis', () => {
    it('should analyze image and return complete result', async () => {
      const imageData = createTestImageData(200, 150, 'text');
      const result = await analyzer.analyze(imageData);
      
      expect(result).toBeDefined();
      expect(result.textRegions).toBeDefined();
      expect(result.contrastMap).toBeDefined();
      expect(result.contentType).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
      expect(result.timestamp).toBeGreaterThan(0);
    });
    
    it('should detect text regions', async () => {
      const imageData = createTestImageData(200, 150, 'text');
      const result = await analyzer.analyze(imageData);
      
      expect(result.textRegions.length).toBeGreaterThan(0);
      expect(result.textRegions[0].confidence).toBeGreaterThan(0);
      expect(result.textRegions[0].priority).toBeGreaterThan(0);
    });
    
    it('should generate contrast map', async () => {
      const imageData = createTestImageData(200, 150, 'text');
      const result = await analyzer.analyze(imageData);
      
      expect(result.contrastMap.grid).toBeDefined();
      expect(result.contrastMap.grid.length).toBeGreaterThan(0);
      expect(result.contrastMap.cellSize).toBeGreaterThan(0);
      expect(result.contrastMap.meanContrast).toBeGreaterThanOrEqual(0);
      expect(result.contrastMap.meanContrast).toBeLessThanOrEqual(1);
    });
    
    it('should classify content type', async () => {
      const imageData = createTestImageData(200, 150, 'text');
      const result = await analyzer.analyze(imageData);
      
      expect(['email', 'article', 'ui', 'mixed']).toContain(result.contentType);
    });
  });
  
  describe('Performance', () => {
    it('should process analysis within reasonable time', async () => {
      const imageData = createTestImageData(800, 600, 'text');
      
      const start = performance.now();
      const result = await analyzer.analyze(imageData);
      const duration = performance.now() - start;
      
      // More realistic performance expectation
      expect(duration).toBeLessThan(100); // 100ms for 800x600
      expect(result.processingTime).toBeLessThan(100);
    });
    
    it('should handle Full HD with downsampling', async () => {
      const imageData = createTestImageData(1920, 1080, 'text');
      
      const start = performance.now();
      const result = await analyzer.analyze(imageData);
      const duration = performance.now() - start;
      
      // Should process in reasonable time due to downsampling
      expect(duration).toBeLessThan(250); // 250ms for Full HD
      expect(result.textRegions.length).toBeGreaterThan(0);
    });
  });
  
  describe('Caching', () => {
    it('should cache analysis results', async () => {
      const imageData = createTestImageData(200, 150, 'text');
      
      const result1 = await analyzer.analyze(imageData);
      const result2 = await analyzer.analyze(imageData);
      
      // Second call should be much faster (cached)
      expect(result1.timestamp).toBe(result2.timestamp);
    });
    
    it('should provide cache statistics', () => {
      const stats = analyzer.getCacheStats();
      expect(stats.size).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(stats.keys)).toBe(true);
    });
    
    it('should clear cache', async () => {
      const imageData = createTestImageData(100, 100, 'text');
      await analyzer.analyze(imageData);
      
      expect(analyzer.getCacheStats().size).toBeGreaterThan(0);
      
      analyzer.clearCache();
      expect(analyzer.getCacheStats().size).toBe(0);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle empty image data', async () => {
      const imageData = createTestImageData(0, 0, 'blank');
      const result = await analyzer.analyze(imageData);
      
      expect(result).toBeDefined();
      expect(result.textRegions).toBeDefined();
      expect(result.contrastMap).toBeDefined();
    });
    
    it('should provide fallback on analysis failure', async () => {
      const imageData = createTestImageData(10, 10, 'blank');
      const result = await analyzer.analyze(imageData);
      
      // Should not throw, should provide valid result
      expect(result).toBeDefined();
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('Integration Readiness', () => {
    it('should provide data needed for presbyopia correction', async () => {
      const imageData = createTestImageData(400, 300, 'text');
      const result = await analyzer.analyze(imageData);
      
      // Check that all required data is present for VisionCorrectionEngine
      expect(result.textRegions.every(r => 
        r.bounds && 
        typeof r.confidence === 'number' && 
        typeof r.priority === 'number'
      )).toBe(true);
      
      expect(result.contrastMap.lowContrastAreas).toBeDefined();
      expect(typeof result.contrastMap.meanContrast === 'number').toBe(true);
      expect(typeof result.contentType === 'string').toBe(true);
    });
  });
});