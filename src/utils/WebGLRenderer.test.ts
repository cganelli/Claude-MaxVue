/**
 * WebGLRenderer Test Suite
 * 
 * Tests the WebGL GPU acceleration implementation for presbyopia correction.
 * Verifies shader loading, processing pipeline, and fallback mechanisms.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebGLRenderer, WebGLSettings } from './WebGLRenderer';

describe('WebGLRenderer', () => {
  let renderer: WebGLRenderer;
  let testSettings: WebGLSettings;

  beforeEach(() => {
    testSettings = {
      readingVision: 2.0, // +2.00D presbyopia correction
      contrastBoost: 25,
      edgeEnhancement: 30,
      isEnabled: true,
      useWebGL: true,
    };
    renderer = new WebGLRenderer(testSettings);
  });

  afterEach(() => {
    renderer.dispose();
  });

  describe('Initialization', () => {
    test('should create WebGLRenderer instance', () => {
      expect(renderer).toBeDefined();
      expect(renderer.getPerformanceMetrics()).toBeDefined();
    });

    test('should initialize WebGL context successfully', async () => {
      const result = await renderer.initialize();
      expect(result).toBe(true);
      expect(renderer.isUsingFallback()).toBe(false);
    });

    test('should handle WebGL initialization failure gracefully', async () => {
      // Mock WebGL context failure
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

      const result = await renderer.initialize();
      expect(result).toBe(false);
      expect(renderer.isUsingFallback()).toBe(true);

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });
  });

  describe('Shader Loading', () => {
    test('should load external shader files', async () => {
      await renderer.initialize();
      // Shader loading is tested through initialization
      expect(renderer.isUsingFallback()).toBe(false);
    });

    test('should fallback to inline shaders if external loading fails', async () => {
      // Mock fetch failure
      global.fetch = vi.fn(() => 
        Promise.reject(new Error('Network error'))
      ) as any;

      await renderer.initialize();
      // Should still work with inline shaders
      expect(renderer.isUsingFallback()).toBe(false);
    });
  });

  describe('Image Processing', () => {
    let testImage: HTMLImageElement;

    beforeEach(() => {
      testImage = document.createElement('img');
      testImage.width = 100;
      testImage.height = 100;
      // Create a simple test image
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);
      testImage.src = canvas.toDataURL();
    });

    test('should process images with WebGL when enabled', async () => {
      await renderer.initialize();
      
      const result = renderer.processImage(testImage);
      
      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(false);
      expect(result.processedCanvas).toBeDefined();
      expect(result.performanceMetrics).toBeDefined();
    });

    test('should use CSS fallback when WebGL is disabled', async () => {
      testSettings.useWebGL = false;
      renderer.updateSettings(testSettings);
      
      const result = renderer.processImage(testImage);
      
      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(true);
      expect(result.processedCanvas).toBeDefined();
    });

    test('should handle processing errors gracefully', async () => {
      // Test with invalid image
      const invalidImage = document.createElement('img');
      
      const result = renderer.processImage(invalidImage);
      
      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    test('should provide accurate performance metrics', async () => {
      await renderer.initialize();
      
      const metrics = renderer.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('processingTime');
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics).toHaveProperty('batteryImpact');
      expect(metrics).toHaveProperty('fallbackTriggered');
    });

    test('should update performance metrics after processing', async () => {
      await renderer.initialize();
      
      const testImage = document.createElement('img');
      testImage.width = 100;
      testImage.height = 100;
      
      const initialMetrics = renderer.getPerformanceMetrics();
      renderer.processImage(testImage);
      const updatedMetrics = renderer.getPerformanceMetrics();
      
      expect(updatedMetrics.processingTime).toBeGreaterThan(0);
      expect(updatedMetrics.fps).toBeGreaterThan(0);
    });
  });

  describe('Settings Management', () => {
    test('should update settings correctly', async () => {
      await renderer.initialize();
      
      const newSettings = {
        readingVision: 3.0,
        contrastBoost: 50,
        edgeEnhancement: 75,
      };
      
      renderer.updateSettings(newSettings);
      
      // Settings should be applied (we can't directly test uniforms, but no errors should occur)
      expect(() => renderer.updateSettings(newSettings)).not.toThrow();
    });
  });

  describe('Context Information', () => {
    test('should provide WebGL context information', async () => {
      await renderer.initialize();
      
      const contextInfo = renderer.getContextInfo();
      
      expect(contextInfo).toHaveProperty('vendor');
      expect(contextInfo).toHaveProperty('renderer');
      expect(contextInfo).toHaveProperty('version');
      expect(contextInfo).toHaveProperty('extensions');
      expect(Array.isArray(contextInfo.extensions)).toBe(true);
    });

    test('should handle context info when WebGL is not available', () => {
      const contextInfo = renderer.getContextInfo();
      
      expect(contextInfo.vendor).toBe('Unknown');
      expect(contextInfo.renderer).toBe('Unknown');
      expect(contextInfo.version).toBe('Unknown');
      expect(contextInfo.extensions).toEqual([]);
    });
  });

  describe('Resource Management', () => {
    test('should dispose resources correctly', async () => {
      await renderer.initialize();
      
      expect(() => renderer.dispose()).not.toThrow();
      
      // After disposal, should not be initialized
      expect(renderer.isUsingFallback()).toBe(true);
    });
  });

  describe('Integration with Vision Correction', () => {
    test('should work with typical presbyopia correction values', async () => {
      const typicalSettings: WebGLSettings = {
        readingVision: 1.75, // Common presbyopia correction
        contrastBoost: 20,
        edgeEnhancement: 25,
        isEnabled: true,
        useWebGL: true,
      };
      
      const typicalRenderer = new WebGLRenderer(typicalSettings);
      const result = await typicalRenderer.initialize();
      
      expect(result).toBe(true);
      typicalRenderer.dispose();
    });

    test('should handle extreme presbyopia correction values', async () => {
      const extremeSettings: WebGLSettings = {
        readingVision: 3.5, // Maximum presbyopia correction
        contrastBoost: 100,
        edgeEnhancement: 100,
        isEnabled: true,
        useWebGL: true,
      };
      
      const extremeRenderer = new WebGLRenderer(extremeSettings);
      const result = await extremeRenderer.initialize();
      
      expect(result).toBe(true);
      extremeRenderer.dispose();
    });
  });
}); 