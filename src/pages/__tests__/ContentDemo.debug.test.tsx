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

// Override console.log to capture and display our debug logs
const originalConsoleLog = console.log;
const debugLogs: string[] = [];

beforeEach(() => {
  debugLogs.length = 0;
  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('🔍') || message.includes('🎨') || message.includes('📊')) {
      debugLogs.push(message);
      originalConsoleLog(...args); // Still show in test output
    }
  };
});

describe('Canvas Analysis UI Debug Tracing', () => {
  it('should trace complete Canvas analysis rendering path', async () => {
    console.log('\n=== STARTING CANVAS ANALYSIS DEBUG TRACE ===\n');
    
    // Step 1: Mount ContentDemo
    console.log('STEP 1: Mounting ContentDemo...');
    render(<ContentDemo />);
    
    // Step 2: Verify initial state
    console.log('STEP 2: Checking initial Canvas Analysis state...');
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    expect(canvasToggle).toHaveTextContent('Disabled');
    
    // Step 3: Enable Canvas analysis
    console.log('STEP 3: Enabling Canvas analysis...');
    fireEvent.click(canvasToggle);
    
    await waitFor(() => {
      expect(canvasToggle).toHaveTextContent('Enabled');
    });
    
    // Step 4: Click analyze button
    console.log('STEP 4: Triggering Canvas analysis...');
    const analyzeButton = screen.getByRole('button', { name: /🔍 analyze content/i });
    fireEvent.click(analyzeButton);
    
    // Step 5: Wait for analysis to complete
    console.log('STEP 5: Waiting for analysis results...');
    await waitFor(() => {
      expect(screen.getByText('Canvas Analysis Debug')).toBeInTheDocument();
    });
    
    // Step 6: Display collected logs
    console.log('\n=== COLLECTED DEBUG LOGS ===\n');
    console.log(`Total debug logs captured: ${debugLogs.length}`);
    debugLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log}`);
    });
    
    if (debugLogs.length === 0) {
      console.log('❌ NO DEBUG LOGS CAPTURED - This indicates the debug logging is not working!');
      console.log('🔧 Possible issues:');
      console.log('   1. Console.log override not working properly');
      console.log('   2. Components not rendering due to errors');
      console.log('   3. Debug logs being filtered out');
    }
    console.log('\n=== END DEBUG TRACE ===\n');
    
    // For now, just verify the UI elements exist instead of debug logs
    expect(screen.getByText('Canvas Analysis Debug')).toBeInTheDocument();
    expect(screen.getByText('45.2ms')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });
  
  it('should show why Canvas UI might not render', () => {
    console.log('\n=== TESTING CANVAS UI NON-RENDERING SCENARIOS ===\n');
    
    render(<ContentDemo />);
    
    // Check if Canvas analysis is disabled by default
    const canvasToggle = screen.getByRole('button', { name: /canvas analysis/i });
    const isEnabled = canvasToggle.textContent === 'Enabled';
    
    console.log('Canvas Analysis Default State:', isEnabled ? 'ENABLED' : 'DISABLED');
    
    if (!isEnabled) {
      console.log('❌ REASON: Canvas analysis is disabled by default');
      console.log('✅ SOLUTION: Click the Canvas Analysis toggle button');
    }
    
    // Check if debug panel shows without analysis
    const debugPanelExists = screen.queryByText('Canvas Analysis Debug');
    console.log('Debug Panel Visible:', debugPanelExists ? 'YES' : 'NO');
    
    if (!debugPanelExists) {
      console.log('❌ REASON: No Canvas analysis result available');
      console.log('✅ SOLUTION: Click "🔍 Analyze Content" button after enabling');
    }
    
    console.log('\n=== END NON-RENDERING ANALYSIS ===\n');
  });
});

// Restore console.log after tests
afterEach(() => {
  console.log = originalConsoleLog;
});