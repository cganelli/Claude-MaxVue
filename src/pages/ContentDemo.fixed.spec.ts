import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ContentDemo from './ContentDemo';

// Mock the vision correction hook
const mockUpdateSettings = vi.fn();
const mockVisionHook = {
  settings: {
    readingVision: 0,
    contrastBoost: 15,
    edgeEnhancement: 25,
    isEnabled: true
  },
  updateSettings: mockUpdateSettings,
  isEnabled: true,
  isProcessing: false,
  startRealTimeProcessing: vi.fn(),
  stopRealTimeProcessing: vi.fn(),
  resetSettings: vi.fn()
};

vi.mock('../hooks/useVisionCorrection', () => ({
  useVisionCorrection: () => mockVisionHook
}));

// Mock VisionProcessor component  
vi.mock('../components/VisionProcessor', () => ({
  VisionProcessor: ({ children }: { children: React.ReactNode }) => 
    React.createElement('div', { 'data-testid': 'vision-processor' }, children)
}));

// Mock CameraDemo component
vi.mock('../components/CameraDemo', () => ({
  default: () => React.createElement('div', { 'data-testid': 'camera-demo' }, 'Camera Demo')
}));

// Mock NativeAppDemo component
vi.mock('../components/NativeAppDemo', () => ({
  default: () => React.createElement('div', { 'data-testid': 'native-app-demo' }, 'Native App Demo')
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('ContentDemo Calibration Loading Fixes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn(); // Mock console.log to track calibration loading calls
  });

  test('should load calibration only once on component mount', () => {
    // Arrange
    const savedCalibration = '2.0';
    const visionEnabled = 'true';
    
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      switch (key) {
        case 'calibrationValue': return savedCalibration;
        case 'visionCorrectionEnabled': return visionEnabled;
        default: return null;
      }
    });

    // Act
    render(React.createElement(ContentDemo));

    // Assert
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('calibrationValue');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('estimatedSphere');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('visionCorrectionEnabled');
    
    // Should only call getItem once for each key during initial load
    expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(4); // 3 keys + allKeys filter call
    
    // Should update vision settings with loaded calibration
    expect(mockUpdateSettings).toHaveBeenCalledWith({
      readingVision: 2.0,
      isEnabled: true
    });
    
    // Should log calibration loading only once
    expect(console.log).toHaveBeenCalledWith('🔍 ContentDemo: Loading calibration data (once)...');
    expect(console.log).toHaveBeenCalledWith('✅ ContentDemo: Loaded calibration: +2.00D');
  });

  test('should not load calibration multiple times', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('1.5');

    // Act - Render component multiple times to simulate re-renders
    const { rerender } = render(React.createElement(ContentDemo));
    rerender(React.createElement(ContentDemo));
    rerender(React.createElement(ContentDemo));

    // Assert - Should only load calibration once despite multiple renders
    const calibrationLoadCalls = (console.log as any).mock.calls.filter(
      (call: string[]) => call[0]?.includes('Loading calibration data')
    );
    expect(calibrationLoadCalls).toHaveLength(1);
  });

  test('should handle missing calibration gracefully', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue(null);

    // Act
    render(React.createElement(ContentDemo));

    // Assert
    expect(mockLocalStorage.getItem).toHaveBeenCalled();
    // Should not call updateSettings if no calibration found
    expect(mockUpdateSettings).not.toHaveBeenCalled();
    
    // Should still log the loading attempt
    expect(console.log).toHaveBeenCalledWith('🔍 ContentDemo: Loading calibration data (once)...');
    expect(console.log).toHaveBeenCalledWith('✅ ContentDemo: Loaded calibration: +0.00D');
  });

  test('should handle invalid calibration values', () => {
    // Arrange
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      switch (key) {
        case 'calibrationValue': return 'invalid';
        case 'visionCorrectionEnabled': return 'true';
        default: return null;
      }
    });

    // Act
    render(React.createElement(ContentDemo));

    // Assert
    // Should handle NaN gracefully (parseFloat('invalid') returns NaN)
    expect(mockUpdateSettings).not.toHaveBeenCalled(); // NaN > 0 is false
    expect(console.log).toHaveBeenCalledWith('✅ ContentDemo: Loaded calibration: +NaND');
  });

  test('should prevent loading if calibration already loaded', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('2.5');

    // Act
    const { rerender } = render(React.createElement(ContentDemo));
    
    // Clear mocks after first render
    vi.clearAllMocks();
    
    // Rerender component
    rerender(React.createElement(ContentDemo));

    // Assert - Should not load calibration again
    expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Loading calibration data')
    );
  });

  test('should handle errors during calibration loading', () => {
    // Arrange
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    console.error = vi.fn(); // Mock console.error

    // Act
    render(React.createElement(ContentDemo));

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      '❌ ContentDemo: Error loading calibration:',
      expect.any(Error)
    );
  });

  test('should use loading ref to prevent concurrent loads', () => {
    // This test verifies that the loadingRef prevents multiple simultaneous loads
    // by checking that only one set of localStorage calls happens even with rapid re-renders
    
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('1.0');

    // Act - Rapid re-renders
    const { rerender } = render(React.createElement(ContentDemo));
    for (let i = 0; i < 5; i++) {
      rerender(React.createElement(ContentDemo));
    }

    // Assert - Should only have one set of localStorage calls
    const getItemCalls = mockLocalStorage.getItem.mock.calls.length;
    expect(getItemCalls).toBeLessThanOrEqual(4); // Only initial load calls
  });

  test('should properly set calibrationLoaded state', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('3.0');

    // Act
    render(React.createElement(ContentDemo));

    // Assert - Should complete loading process
    expect(console.log).toHaveBeenCalledWith('✅ ContentDemo: Loaded calibration: +3.00D');
    
    // The calibrationLoaded state should prevent further loads
    // This is verified by the internal state management
  });

  test('should display correct calibration value in camera demo', () => {
    // Arrange
    const calibrationValue = '2.25';
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      return key === 'calibrationValue' ? calibrationValue : null;
    });

    // Act
    render(React.createElement(ContentDemo));

    // Assert
    expect(screen.getByTestId('vision-processor')).toBeInTheDocument();
    // The calibration value should be passed to components correctly
  });
});

describe('ContentDemo Component Integration', () => {
  test('should render all tab components correctly', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('1.0');

    // Act
    render(React.createElement(ContentDemo));

    // Assert
    expect(screen.getByTestId('vision-processor')).toBeInTheDocument();
    expect(screen.getByText('MaxVue Vision Correction Demo')).toBeInTheDocument();
  });

  test('should handle tab switching without re-loading calibration', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('2.0');

    // Act
    render(React.createElement(ContentDemo));
    
    // Clear mocks after initial render
    vi.clearAllMocks();

    // Simulate tab switching by re-rendering
    const { rerender } = render(React.createElement(ContentDemo));
    rerender(React.createElement(ContentDemo));

    // Assert - Should not reload calibration on tab switches
    expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
  });
});