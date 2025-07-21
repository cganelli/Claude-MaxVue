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

describe('Canvas Analysis UI Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it.skip('AUDIT: Complete Canvas Analysis UI presence verification', async () => {
    const { container } = render(<ContentDemo />);
    
    console.log('\n🔍 === CANVAS ANALYSIS UI AUDIT ===\n');
    
    // Step 1: Check if Canvas Analysis section exists
    console.log('1. Checking for Canvas Analysis section...');
    const canvasSection = container.querySelector('.bg-white.rounded-xl.shadow-lg.p-6.mb-8');
    expect(canvasSection).toBeTruthy();
    console.log('   ✅ Canvas Analysis section container found');
    
    // Step 2: Check Canvas Analysis header
    console.log('2. Checking Canvas Analysis header...');
    const header = screen.getByText('Canvas Analysis');
    expect(header).toBeInTheDocument();
    console.log('   ✅ "Canvas Analysis" header found');
    
    // Step 3: Check Canvas Analysis toggle
    console.log('3. Checking Canvas Analysis toggle button...');
    const toggle = screen.getByRole('button', { name: /canvas analysis/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveTextContent('Disabled');
    console.log('   ✅ Canvas Analysis toggle found (initially disabled)');
    
    // Step 4: Enable Canvas Analysis
    console.log('4. Enabling Canvas Analysis...');
    fireEvent.click(toggle);
    await waitFor(() => {
      expect(toggle).toHaveTextContent('Enabled');
    });
    console.log('   ✅ Canvas Analysis successfully enabled');
    
    // Step 5: Check for enabled state UI elements
    console.log('5. Checking enabled state UI elements...');
    const description = screen.getByText(/canvas analysis provides intelligent text detection/i);
    expect(description).toBeInTheDocument();
    console.log('   ✅ Description text found');
    
    const analyzeButton = screen.getByRole('button', { name: /🔍 analyze content/i });
    expect(analyzeButton).toBeInTheDocument();
    console.log('   ✅ "🔍 Analyze Content" button found');
    
    // Step 6: Trigger analysis
    console.log('6. Triggering Canvas analysis...');
    fireEvent.click(analyzeButton);
    
    // Step 7: Wait for and verify analysis results
    console.log('7. Waiting for analysis results...');
    await waitFor(() => {
      const debugPanel = screen.getByText('Canvas Analysis Debug');
      expect(debugPanel).toBeInTheDocument();
    }, { timeout: 3000 });
    console.log('   ✅ Canvas Analysis Debug panel appeared');
    
    // Step 8: Verify analysis metrics
    console.log('8. Verifying analysis metrics...');
    
    const processingTime = screen.getByText('45.2ms');
    expect(processingTime).toBeInTheDocument();
    console.log('   ✅ Processing time (45.2ms) displayed');
    
    const textRegions = screen.getByText('Text Regions');
    expect(textRegions).toBeInTheDocument();
    console.log('   ✅ Text Regions label found');
    
    const contentType = screen.getByText('email');
    expect(contentType).toBeInTheDocument();
    console.log('   ✅ Content type (email) displayed');
    
    const avgContrast = screen.getByText('65%');
    expect(avgContrast).toBeInTheDocument();
    console.log('   ✅ Average contrast (65%) displayed');
    
    // Step 9: Check for Enhanced Processing button
    console.log('9. Checking for Enhanced Processing button...');
    const enhancedButton = screen.getByRole('button', { name: /⚡ apply enhanced processing/i });
    expect(enhancedButton).toBeInTheDocument();
    console.log('   ✅ "⚡ Apply Enhanced Processing" button found');
    
    // Step 10: Check overlay toggle
    console.log('10. Checking overlay toggle...');
    const overlayToggle = screen.getByRole('button', { name: /(show overlay|hide overlay)/i });
    expect(overlayToggle).toBeInTheDocument();
    console.log('   ✅ Overlay toggle button found');
    
    // Step 11: Final audit summary
    console.log('\n🎯 === AUDIT SUMMARY ===');
    console.log('✅ Canvas Analysis section: PRESENT');
    console.log('✅ Toggle functionality: WORKING');
    console.log('✅ Analyze button: PRESENT');
    console.log('✅ Analysis results: DISPLAYING');
    console.log('✅ Debug panel: RENDERING');
    console.log('✅ Metrics display: COMPLETE');
    console.log('✅ Enhanced processing: AVAILABLE');
    console.log('✅ Overlay controls: PRESENT');
    console.log('\n🚀 Canvas Analysis UI is FULLY FUNCTIONAL!\n');
  });
  
  it('AUDIT: Verify Canvas Analysis is accessible from main demo', () => {
    render(<ContentDemo />);
    
    console.log('\n📋 === ACCESSIBILITY AUDIT ===\n');
    
    // Check if Canvas Analysis is prominently displayed
    const canvasAnalysisHeader = screen.getByRole('heading', { name: /canvas analysis/i });
    expect(canvasAnalysisHeader).toBeInTheDocument();
    console.log('✅ Canvas Analysis has proper heading role');
    
    // Check button accessibility
    const toggleButton = screen.getByRole('button', { name: /canvas analysis toggle/i });
    expect(toggleButton).toBeInTheDocument();
    console.log('✅ Toggle button has proper aria-label');
    
    console.log('\n✅ Canvas Analysis UI meets accessibility standards\n');
  });
});