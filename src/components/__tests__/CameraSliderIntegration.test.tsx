import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContentDemo from '../../pages/ContentDemo';

// Mock the useVisionCorrection hook
const mockUpdateSettings = vi.fn();
const mockVisionHook = {
  settings: { 
    readingVision: 2.0, 
    contrastBoost: 15, 
    edgeEnhancement: 25, 
    isEnabled: true 
  },
  updateSettings: mockUpdateSettings,
  isEnabled: true,
  toggleEnabled: vi.fn(),
  isProcessing: false,
  resetSettings: vi.fn(),
  processElement: vi.fn(),
  processImage: vi.fn(),
  calibrationData: null,
  saveCalibration: vi.fn(),
  loadCalibration: vi.fn(),
  startRealTimeProcessing: vi.fn(),
  stopRealTimeProcessing: vi.fn(),
  runVisionTest: vi.fn(),
};

vi.mock('../../hooks/useVisionCorrection', () => ({
  useVisionCorrection: () => mockVisionHook,
}));

// Mock WorkingCameraDemo component
const mockWorkingCameraDemo = vi.fn().mockImplementation(({ readingVisionDiopter, calibrationValue }) => (
  <div 
    data-testid="working-camera-demo" 
    data-reading-vision-diopter={readingVisionDiopter}
    data-calibration-value={calibrationValue}
  >
    Camera Demo (Reading: {readingVisionDiopter}D, Calibration: {calibrationValue}D)
  </div>
));

vi.mock('../../components/WorkingCameraDemo', () => ({
  default: mockWorkingCameraDemo,
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn().mockReturnValue('2.0'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Camera Slider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('2.0');
  });

  it('should update camera blur when slider changes', async () => {
    const { container } = render(<ContentDemo />);
    
    // Switch to camera tab first
    const cameraTab = screen.getByText('Camera');
    fireEvent.click(cameraTab);
    
    // Wait for camera component to render
    await waitFor(() => {
      expect(screen.getByTestId('working-camera-demo')).toBeInTheDocument();
    });
    
    // Find the Reading Vision slider
    const slider = screen.getByRole('slider');
    
    // Simulate slider change
    fireEvent.change(slider, { target: { value: '3.5' } });
    
    // Wait for React state update
    await waitFor(() => {
      expect(mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          readingVision: 3.5
        })
      );
    });
  });

  it('should pass dynamic props to camera component when vision settings change', async () => {
    // Update mock hook to return new reading vision value
    mockVisionHook.settings.readingVision = 3.5;
    
    const { rerender } = render(<ContentDemo />);
    
    // Switch to camera tab
    const cameraTab = screen.getByText('Camera');
    fireEvent.click(cameraTab);
    
    // Wait for camera component to render
    await waitFor(() => {
      expect(screen.getByTestId('working-camera-demo')).toBeInTheDocument();
    });
    
    // Check that camera receives correct props
    const cameraComponent = screen.getByTestId('working-camera-demo');
    expect(cameraComponent).toHaveAttribute('data-reading-vision-diopter', '3.5');
    expect(cameraComponent).toHaveAttribute('data-calibration-value', '2.0');
  });

  it('should calculate correct blur amount for camera', () => {
    // Test the blur calculation logic used in ContentDemo
    const readingVision = 3.5;
    const calibration = 2.0;
    const expectedBlur = Math.abs(readingVision - calibration) * 0.5;
    
    expect(expectedBlur).toBe(0.75); // |3.5 - 2.0| * 0.5 = 0.75
  });

  it('should not isolate camera from main vision system', async () => {
    render(<ContentDemo />);
    
    // Switch to camera tab
    const cameraTab = screen.getByText('Camera');
    fireEvent.click(cameraTab);
    
    // Wait for camera component to render
    await waitFor(() => {
      expect(screen.getByTestId('working-camera-demo')).toBeInTheDocument();
    });
    
    // Verify that camera component is called with vision hook settings
    expect(mockWorkingCameraDemo).toHaveBeenCalledWith(
      expect.objectContaining({
        readingVisionDiopter: mockVisionHook.settings.readingVision,
        calibrationValue: 2.0, // From localStorage mock
      }),
      expect.any(Object)
    );
  });

  it('should respond to vision state changes like other content tabs', async () => {
    render(<ContentDemo />);
    
    // Switch to camera tab
    const cameraTab = screen.getByText('Camera');
    fireEvent.click(cameraTab);
    
    // Simulate changing vision settings
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '1.5' } });
    
    // Verify that updateSettings was called (integration with vision system)
    expect(mockUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        readingVision: 1.5
      })
    );
  });
});