import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVisionCorrection } from '../useVisionCorrection';

// Mock the Canvas analysis system
vi.mock('../../utils/canvas', () => ({
  CanvasAnalyzer: vi.fn().mockImplementation(() => ({
    analyze: vi.fn().mockResolvedValue({
      textRegions: [
        {
          bounds: { x: 10, y: 10, width: 100, height: 20 },
          confidence: 0.9,
          priority: 0.8
        }
      ],
      contrastMap: {
        grid: [[0.6, 0.7], [0.5, 0.8]],
        cellSize: 20,
        lowContrastAreas: [],
        meanContrast: 0.65
      },
      contentType: 'email',
      processingTime: 45.2,
      timestamp: Date.now()
    }),
    clearCache: vi.fn()
  }))
}));

// Mock mobile detection
vi.mock('../useMobileDetection', () => ({
  useMobileDetection: () => ({
    deviceType: 'desktop',
    calibrationAdjustment: 0,
    getAdjustedCalibration: (val: number) => val,
    viewingDistance: '24'
  })
}));

describe('useVisionCorrection Canvas Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD FAIL INITIALLY: should have Canvas analysis state', () => {
    const { result } = renderHook(() => useVisionCorrection());
    
    // These properties should exist for Canvas integration
    expect(result.current.canvasAnalysisEnabled).toBeDefined();
    expect(result.current.canvasAnalysisResult).toBeDefined();
    expect(result.current.toggleCanvasAnalysis).toBeDefined();
    expect(result.current.analyzeElement).toBeDefined();
  });

  it('SHOULD FAIL INITIALLY: should toggle Canvas analysis', () => {
    const { result } = renderHook(() => useVisionCorrection());
    
    // Initial state should be disabled
    expect(result.current.canvasAnalysisEnabled).toBe(false);
    
    act(() => {
      result.current.toggleCanvasAnalysis();
    });
    
    expect(result.current.canvasAnalysisEnabled).toBe(true);
  });

  it('SHOULD FAIL INITIALLY: should analyze element with Canvas analysis', async () => {
    const { result } = renderHook(() => useVisionCorrection());
    
    // Enable Canvas analysis
    act(() => {
      result.current.toggleCanvasAnalysis();
    });
    
    // Create mock element
    const mockElement = document.createElement('div');
    mockElement.textContent = 'Test content for analysis';
    
    // Analyze element
    await act(async () => {
      await result.current.analyzeElement(mockElement);
    });
    
    // Should have analysis result
    expect(result.current.canvasAnalysisResult).toBeDefined();
    expect(result.current.canvasAnalysisResult?.textRegions.length).toBeGreaterThan(0);
    expect(result.current.canvasAnalysisResult?.processingTime).toBeGreaterThan(0);
  });

  it('SHOULD FAIL INITIALLY: should enhance vision correction with Canvas data', async () => {
    const { result } = renderHook(() => useVisionCorrection());
    
    // Enable Canvas analysis
    act(() => {
      result.current.toggleCanvasAnalysis();
    });
    
    const mockElement = document.createElement('div');
    mockElement.innerHTML = '<p>Some text content to analyze</p>';
    
    // Process with Canvas analysis
    await act(async () => {
      await result.current.processElementWithCanvas(mockElement);
    });
    
    // Should have enhanced processing with Canvas data
    expect(result.current.canvasAnalysisResult).toBeDefined();
    // Should still maintain existing functionality
    expect(result.current.settings.readingVision).toBeDefined();
    expect(result.current.isEnabled).toBeDefined();
  });

  it('SHOULD FAIL INITIALLY: should provide Canvas analysis performance metrics', async () => {
    const { result } = renderHook(() => useVisionCorrection());
    
    act(() => {
      result.current.toggleCanvasAnalysis();
    });
    
    const mockElement = document.createElement('div');
    
    await act(async () => {
      await result.current.analyzeElement(mockElement);
    });
    
    const result_ = result.current.canvasAnalysisResult;
    expect(result_?.processingTime).toBeGreaterThan(0);
    expect(result_?.timestamp).toBeGreaterThan(0);
    expect(result_?.contentType).toBeDefined();
  });

  it('should maintain existing functionality when Canvas analysis is disabled', () => {
    const { result } = renderHook(() => useVisionCorrection());
    
    // Existing functionality should work without Canvas analysis
    expect(result.current.settings).toBeDefined();
    expect(result.current.isEnabled).toBeDefined();
    expect(result.current.processElement).toBeDefined();
    expect(result.current.updateSettings).toBeDefined();
    
    // Canvas analysis should be disabled by default
    expect(result.current.canvasAnalysisEnabled).toBe(false);
  });

  it('should preserve mobile distance compensation with Canvas analysis', () => {
    const { result } = renderHook(() => useVisionCorrection());
    
    // Mobile compensation should work with or without Canvas analysis
    expect(result.current.adjustedReadingVision).toBeDefined();
    expect(result.current.baseReadingVision).toBeDefined();
    expect(result.current.deviceType).toBeDefined();
    expect(result.current.calibrationAdjustment).toBeDefined();
    
    // Enable Canvas analysis
    act(() => {
      result.current.toggleCanvasAnalysis();
    });
    
    // Mobile compensation should still work
    expect(result.current.adjustedReadingVision).toBeDefined();
    expect(result.current.calibrationAdjustment).toBe(0); // Desktop in mock
  });
});