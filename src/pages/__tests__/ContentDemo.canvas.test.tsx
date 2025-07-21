import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContentDemo from '../ContentDemo';

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
vi.mock('../../hooks/useMobileDetection', () => ({
  useMobileDetection: () => ({
    deviceType: 'desktop',
    calibrationAdjustment: 0,
    getAdjustedCalibration: (val: number) => val,
    viewingDistance: '24'
  })
}));

describe('ContentDemo Canvas Analysis UI Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('SHOULD FAIL INITIALLY: should display Canvas Analysis toggle in controls', () => {
    render(<ContentDemo />);
    
    // Should find Canvas Analysis toggle button
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    expect(canvasToggle).toBeInTheDocument();
    expect(canvasToggle).toHaveTextContent('Disabled'); // Initially disabled
  });

  it('SHOULD FAIL INITIALLY: should show Analyze Content button when Canvas analysis enabled', async () => {
    render(<ContentDemo />);
    
    // Enable Canvas analysis
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    fireEvent.click(canvasToggle);
    
    // Should show Analyze Content button
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /🔍 analyze content/i });
      expect(analyzeButton).toBeInTheDocument();
    });
  });

  it('SHOULD FAIL INITIALLY: should display Canvas analysis debug panel after analysis', async () => {
    render(<ContentDemo />);
    
    // Enable Canvas analysis
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    fireEvent.click(canvasToggle);
    
    // Run analysis first
    const analyzeButton = screen.getByRole('button', { name: /🔍 analyze content/i });
    fireEvent.click(analyzeButton);
    
    // Should show debug panel header after analysis
    await waitFor(() => {
      expect(screen.getByText('Canvas Analysis Debug')).toBeInTheDocument();
    });
  });

  it('SHOULD FAIL INITIALLY: should trigger analysis when Analyze Content clicked', async () => {
    render(<ContentDemo />);
    
    // Enable Canvas analysis
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    fireEvent.click(canvasToggle);
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /🔍 analyze content/i });
    fireEvent.click(analyzeButton);
    
    // Should show Canvas analysis debug panel
    await waitFor(() => {
      expect(screen.getByText('Canvas Analysis Debug')).toBeInTheDocument();
      expect(screen.getByText('Text Regions')).toBeInTheDocument();
    });
  });

  it('SHOULD FAIL INITIALLY: should display Canvas analysis metrics after analysis', async () => {
    render(<ContentDemo />);
    
    // Enable Canvas analysis and run analysis
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    fireEvent.click(canvasToggle);
    
    const analyzeButton = screen.getByRole('button', { name: /🔍 analyze content/i });
    fireEvent.click(analyzeButton);
    
    // Should display Canvas analysis debug panel and metrics
    await waitFor(() => {
      expect(screen.getByText('Canvas Analysis Debug')).toBeInTheDocument();
      expect(screen.getByText('45.2ms')).toBeInTheDocument(); // Processing time
      expect(screen.getByText('email')).toBeInTheDocument(); // Content type  
      expect(screen.getByText('65%')).toBeInTheDocument(); // Avg contrast
    });
  });

  it.skip('SHOULD FAIL INITIALLY: should show visual debugging legend when overlay enabled', async () => {
    render(<ContentDemo />);
    
    // Enable Canvas analysis
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    fireEvent.click(canvasToggle);
    
    // Run analysis
    const analyzeButton = screen.getByRole('button', { name: /🔍 analyze content/i });
    fireEvent.click(analyzeButton);
    
    // Wait for analysis to complete and debug panel to appear
    await waitFor(() => {
      expect(screen.getByText('Canvas Analysis Debug')).toBeInTheDocument();
    });
    
    // The overlay button text depends on current state - could be "Show Overlay" or "Hide Overlay"
    const overlayToggle = screen.getByRole('button', { name: /(show overlay|hide overlay)/i });
    fireEvent.click(overlayToggle);
    
    // Should show legend
    await waitFor(() => {
      expect(screen.getByText(/high confidence.*80%/i)).toBeInTheDocument();
      expect(screen.getByText(/medium confidence.*60-80%/i)).toBeInTheDocument();
      expect(screen.getByText(/low confidence.*60%/i)).toBeInTheDocument();
      expect(screen.getByText(/low contrast areas/i)).toBeInTheDocument();
    });
  });

  it('should preserve existing ContentDemo functionality with Canvas analysis', () => {
    render(<ContentDemo />);
    
    // Existing functionality should still work
    expect(screen.getByText('MaxVue Vision Correction Demo')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    
    // Vision correction controls should exist
    expect(screen.getByText('Vision Correction')).toBeInTheDocument();
  });

  it('should toggle Canvas analysis state correctly', async () => {
    render(<ContentDemo />);
    
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    
    // Initially disabled
    expect(canvasToggle).toHaveTextContent('Disabled');
    
    // Enable
    fireEvent.click(canvasToggle);
    await waitFor(() => {
      expect(canvasToggle).toHaveTextContent('Enabled');
    });
    
    // Disable again
    fireEvent.click(canvasToggle);
    await waitFor(() => {
      expect(canvasToggle).toHaveTextContent('Disabled');
    });
  });
});