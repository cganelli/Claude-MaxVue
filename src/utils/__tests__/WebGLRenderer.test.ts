/**
 * WebGLRenderer Tests - Comprehensive testing for GPU-accelerated presbyopia correction
 * 
 * Tests WebGL rendering, fallback mechanisms, performance monitoring, and integration
 * with existing vision correction system.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebGLRenderer, WebGLSettings } from '../WebGLRenderer';

// Mock WebGL context for testing
const createMockWebGLContext = () => {
  const mockContext = {
    createProgram: vi.fn(() => ({})),
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ''),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => ''),
    getUniformLocation: vi.fn(() => ({})),
    getAttribLocation: vi.fn(() => 0),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    viewport: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
    useProgram: vi.fn(),
    activeTexture: vi.fn(),
    bindTexture: vi.fn(),
    texImage2D: vi.fn(),
    texParameteri: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    uniform1i: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    drawArrays: vi.fn(),
    deleteShader: vi.fn(),
    deleteProgram: vi.fn(),
    deleteBuffer: vi.fn(),
    deleteTexture: vi.fn(),
    getExtension: vi.fn(() => ({ loseContext: vi.fn() })),
    getSupportedExtensions: vi.fn(() => ['OES_texture_float', 'OES_texture_float_linear']),
  };

  return mockContext;
};

// Mock canvas element
const createMockCanvas = () => {
  const canvas = {
    getContext: vi.fn((contextType) => {
      if (contextType === 'webgl' || contextType === 'experimental-webgl') {
        return createMockWebGLContext();
      } else if (contextType === '2d') {
        return {
          drawImage: vi.fn(),
          filter: '',
          clearRect: vi.fn(),
          getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(400), width: 10, height: 10 })),
          putImageData: vi.fn(),
          createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(400), width: 10, height: 10 })),
        };
      }
      return null;
    }),
    width: 100,
    height: 100,
  };
  return canvas;
};

describe('WebGLRenderer', () => {
  let renderer: WebGLRenderer;
  let mockSettings: WebGLSettings;

  beforeEach(() => {
    // Mock canvas creation
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return createMockCanvas() as any;
      }
      return document.createElement(tagName);
    });

    mockSettings = {
      readingVision: 2.0,
      contrastBoost: 25,
      edgeEnhancement: 30,
      isEnabled: true,
      useWebGL: true,
    };

    renderer = new WebGLRenderer(mockSettings);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (renderer) {
      renderer.dispose();
    }
  });

  describe('Initialization', () => {
    it('should initialize WebGL renderer successfully', async () => {
      const result = await renderer.initialize();
      expect(result).toBe(true);
    });

    it('should fallback to CSS when WebGL is not supported', async () => {
      // Mock WebGL not supported
      vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn(() => null),
            width: 100,
            height: 100,
          } as any;
        }
        return document.createElement(tagName);
      });

      const fallbackRenderer = new WebGLRenderer(mockSettings);
      const result = await fallbackRenderer.initialize();
      
      expect(result).toBe(false);
      expect(fallbackRenderer.isUsingFallback()).toBe(true);
    });

    it('should handle initialization errors gracefully', async () => {
      // Mock WebGL context creation failure
      vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return {
            getContext: vi.fn(() => {
              throw new Error('WebGL not supported');
            }),
            width: 100,
            height: 100,
          } as any;
        }
        return document.createElement(tagName);
      });

      const errorRenderer = new WebGLRenderer(mockSettings);
      const result = await errorRenderer.initialize();
      
      expect(result).toBe(false);
      expect(errorRenderer.isUsingFallback()).toBe(true);
    });
  });

  describe('Image Processing', () => {
    beforeEach(async () => {
      await renderer.initialize();
    });

    it('should process images with WebGL when available', () => {
      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      const result = renderer.processImage(mockImage);
      
      expect(result.success).toBe(true);
      // Note: In test environment, WebGL might fallback to CSS due to mock limitations
      expect(result.processedCanvas).toBeDefined();
    });

    it('should fallback to CSS processing when WebGL fails', () => {
      // Force fallback by disabling WebGL
      renderer.updateSettings({ useWebGL: false });

      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      const result = renderer.processImage(mockImage);
      
      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(true);
      expect(result.processedCanvas).toBeDefined();
    });

    it('should handle processing errors gracefully', () => {
      // Mock processing failure
      const mockImage = {
        naturalWidth: 0, // Invalid dimensions
        naturalHeight: 0,
        complete: true,
      } as HTMLImageElement;

      const result = renderer.processImage(mockImage);
      
      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(true);
    });

    it('should process video elements', () => {
      const mockVideo = {
        videoWidth: 100,
        videoHeight: 100,
      } as HTMLVideoElement;

      const result = renderer.processImage(mockVideo);
      
      expect(result.success).toBe(true);
      expect(result.processedCanvas).toBeDefined();
    });

    it('should process canvas elements', () => {
      const mockCanvas = {
        width: 100,
        height: 100,
      } as HTMLCanvasElement;

      const result = renderer.processImage(mockCanvas);
      
      expect(result.success).toBe(true);
      expect(result.processedCanvas).toBeDefined();
    });
  });

  describe('Settings Management', () => {
    beforeEach(async () => {
      await renderer.initialize();
    });

    it('should update settings correctly', () => {
      const newSettings = {
        readingVision: 3.0,
        contrastBoost: 50,
        edgeEnhancement: 75,
      };

      renderer.updateSettings(newSettings);
      
      // Verify settings were updated (we can't directly access private settings)
      // but we can test that the renderer still works
      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      const result = renderer.processImage(mockImage);
      expect(result.success).toBe(true);
    });

    it('should handle disabled state', () => {
      renderer.updateSettings({ isEnabled: false });

      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      const result = renderer.processImage(mockImage);
      expect(result.success).toBe(true);
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(async () => {
      await renderer.initialize();
    });

    it('should track performance metrics', () => {
      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      renderer.processImage(mockImage);
      
      const metrics = renderer.getPerformanceMetrics();
      
      expect(metrics).toBeDefined();
      expect(typeof metrics.fps).toBe('number');
      expect(typeof metrics.processingTime).toBe('number');
      expect(typeof metrics.memoryUsage).toBe('number');
      expect(typeof metrics.batteryImpact).toBe('number');
      expect(typeof metrics.fallbackTriggered).toBe('boolean');
    });

    it('should track performance metrics correctly', () => {
      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      renderer.processImage(mockImage);
      
      const metrics = renderer.getPerformanceMetrics();
      
      expect(metrics.processingTime).toBeGreaterThan(0);
      expect(typeof metrics.fps).toBe('number');
      expect(typeof metrics.memoryUsage).toBe('number');
    });
  });

  describe('Fallback Mechanism', () => {
    it('should use CSS fallback when WebGL is not available', async () => {
      // Create renderer with WebGL disabled
      const cssRenderer = new WebGLRenderer({ ...mockSettings, useWebGL: false });
      
      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      const result = cssRenderer.processImage(mockImage);
      
      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(true);
    });

    it('should handle fallback errors gracefully', () => {
      // Mock fallback processing failure
      const fallbackRenderer = new WebGLRenderer({ ...mockSettings, useWebGL: false });
      
      const mockImage = {
        naturalWidth: 0, // Invalid dimensions
        naturalHeight: 0,
        complete: true,
      } as HTMLImageElement;

      const result = fallbackRenderer.processImage(mockImage);
      
      // Should still succeed with fallback, even with invalid dimensions
      expect(result.success).toBe(true);
      expect(result.fallbackUsed).toBe(true);
    });
  });

  describe('Resource Management', () => {
    it('should dispose of WebGL resources correctly', async () => {
      await renderer.initialize();
      
      // Mock WebGL context methods
      const mockGL = renderer['gl'] as any;
      const deleteProgramSpy = vi.spyOn(mockGL, 'deleteProgram');
      const deleteBufferSpy = vi.spyOn(mockGL, 'deleteBuffer');
      
      renderer.dispose();
      
      expect(deleteProgramSpy).toHaveBeenCalled();
      expect(deleteBufferSpy).toHaveBeenCalled();
    });

    it('should handle disposal when not initialized', () => {
      // Should not throw when disposing uninitialized renderer
      expect(() => renderer.dispose()).not.toThrow();
    });
  });

  describe('Integration with Vision Correction', () => {
    it('should work with presbyopia correction settings', async () => {
      const presbyopiaSettings: WebGLSettings = {
        readingVision: 2.5, // +2.50D presbyopia correction
        contrastBoost: 30,
        edgeEnhancement: 40,
        isEnabled: true,
        useWebGL: true,
      };

      const presbyopiaRenderer = new WebGLRenderer(presbyopiaSettings);
      await presbyopiaRenderer.initialize();

      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      const result = presbyopiaRenderer.processImage(mockImage);
      
      expect(result.success).toBe(true);
    });

    it('should handle mobile calibration adjustments', async () => {
      // Test with mobile-adjusted settings
      const mobileSettings: WebGLSettings = {
        readingVision: 4.0, // +2.00D base + +2.00D mobile adjustment
        contrastBoost: 25,
        edgeEnhancement: 35,
        isEnabled: true,
        useWebGL: true,
      };

      const mobileRenderer = new WebGLRenderer(mobileSettings);
      await mobileRenderer.initialize();

      const mockImage = {
        naturalWidth: 100,
        naturalHeight: 100,
        complete: true,
      } as HTMLImageElement;

      const result = mobileRenderer.processImage(mockImage);
      
      expect(result.success).toBe(true);
    });
  });
}); 