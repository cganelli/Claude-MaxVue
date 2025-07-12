import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CameraDemo from './CameraDemo';

// Global mocks
const mockGetUserMedia = vi.fn();
const videoElementSpy = vi.fn();
const mockPlay = vi.fn().mockResolvedValue(undefined);

// Create MediaStream and track mocks
const mockTrack = {
  stop: vi.fn(),
  kind: 'video'
};

const mockStream = {
  getTracks: vi.fn(() => [mockTrack]),
  getVideoTracks: vi.fn(() => [mockTrack]),
  getAudioTracks: vi.fn(() => []),
  active: true,
  id: 'mock-stream-id'
};

// Canvas context mock
const mockCanvasContext = {
  filter: '',
  drawImage: vi.fn(),
  fillStyle: '',
  fillRect: vi.fn(),
  font: '',
  fillText: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  save: vi.fn(),
  restore: vi.fn()
};

// Store original createElement
const originalCreateElement = document.createElement.bind(document);

// Mock document.createElement to intercept video and canvas creation
document.createElement = vi.fn((tagName) => {
  if (tagName.toLowerCase() === 'video') {
    // Create a real video element using jsdom
    const videoElement = originalCreateElement('video');
    
    // Override key properties and methods with our mocks
    Object.defineProperty(videoElement, 'play', {
      value: mockPlay,
      writable: true
    });
    
    Object.defineProperty(videoElement, 'videoWidth', {
      value: 1280,
      writable: true
    });
    
    Object.defineProperty(videoElement, 'videoHeight', {
      value: 720,
      writable: true
    });
    
    Object.defineProperty(videoElement, 'readyState', {
      value: 4, // HAVE_ENOUGH_DATA
      writable: true
    });
    
    // Critical: Override srcObject with spy tracking
    let _srcObject = null;
    Object.defineProperty(videoElement, 'srcObject', {
      get() {
        return _srcObject;
      },
      set(value) {
        _srcObject = value;
        videoElementSpy({ action: 'srcObject', value, element: this });
        
        // Trigger metadata loaded event if stream is set
        if (value && this.onloadedmetadata) {
          // Use a very short timeout to ensure this triggers after React updates
          setTimeout(() => {
            if (this.onloadedmetadata) {
              this.onloadedmetadata(new Event('loadedmetadata'));
            }
          }, 5);
        }
      },
      configurable: true
    });
    
    return videoElement;
  } else if (tagName.toLowerCase() === 'canvas') {
    // Create a real canvas element using jsdom
    const canvasElement = originalCreateElement('canvas');
    
    // Override getContext to return our mock
    Object.defineProperty(canvasElement, 'getContext', {
      value: vi.fn(() => mockCanvasContext),
      writable: true
    });
    
    return canvasElement;
  }
  
  // For all other elements, use the original createElement
  return originalCreateElement(tagName);
});

// Mock navigator.mediaDevices
Object.defineProperty(global, 'navigator', {
  value: {
    mediaDevices: {
      getUserMedia: mockGetUserMedia
    }
  },
  writable: true
});

// Mock location for HTTPS check
Object.defineProperty(global, 'location', {
  value: {
    protocol: 'https:',
    hostname: 'localhost'
  },
  writable: true
});

// Mock animation frame functions
global.requestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});

global.cancelAnimationFrame = vi.fn();

describe('CameraDemo Video Stream Fixes', () => {
  const defaultProps = {
    readingVisionDiopter: 2.0,
    calibrationValue: 2.0
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserMedia.mockClear();
    mockPlay.mockClear().mockResolvedValue(undefined); // Reset to success
    videoElementSpy.mockClear();
    console.log = vi.fn();
    console.error = vi.fn();
    
    // Reset stream mock
    mockStream.getTracks.mockReturnValue([mockTrack]);
    mockTrack.stop.mockClear();
  });

  test('should request camera access with proper constraints', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Assert
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });
    });
  });

  test('should set video srcObject and attributes correctly', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Assert - Check that getUserMedia was called
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });
    });

    // Assert - Check that srcObject was set with the stream
    await waitFor(() => {
      expect(videoElementSpy).toHaveBeenCalledWith({
        action: 'srcObject',
        value: mockStream,
        element: expect.any(Object)
      });
    }, { timeout: 3000 });
  });

  test('should handle video play errors gracefully', async () => {
    // Arrange
    const playError = new Error('Play failed');
    mockGetUserMedia.mockResolvedValue(mockStream);
    
    // Override the global mockPlay to reject
    mockPlay.mockRejectedValue(playError);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Wait for srcObject to be set and get the video element
    let videoElement;
    await waitFor(() => {
      expect(videoElementSpy).toHaveBeenCalledWith({
        action: 'srcObject',
        value: mockStream,
        element: expect.any(Object)
      });
      // Get the video element from the spy call
      const spyCall = videoElementSpy.mock.calls[0];
      videoElement = spyCall[0].element;
    });

    // Manually trigger metadata loaded to trigger the play error
    if (videoElement && videoElement.onloadedmetadata) {
      videoElement.onloadedmetadata(new Event('loadedmetadata'));
    }

    // Assert
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        '❌ CameraDemo: Video play error:',
        playError
      );
      expect(screen.getByText('Camera Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to play video')).toBeInTheDocument();
    });
  });

  test('should handle camera permission denied', async () => {
    // Arrange
    const permissionError = new DOMException('Permission denied', 'NotAllowedError');
    mockGetUserMedia.mockRejectedValue(permissionError);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Camera Error')).toBeInTheDocument();
      expect(screen.getByText('Camera access failed')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        '❌ CameraDemo: Camera error:',
        permissionError
      );
    });
  });

  test('should handle camera not found error', async () => {
    // Arrange
    const notFoundError = new DOMException('No camera found', 'NotFoundError');
    mockGetUserMedia.mockRejectedValue(notFoundError);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Camera Error')).toBeInTheDocument();
      expect(screen.getByText('Camera access failed')).toBeInTheDocument();
    });
  });

  test('should stop camera and cleanup properly', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    
    // Start camera
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Wait for srcObject to be set and get the video element
    let videoElement;
    await waitFor(() => {
      expect(videoElementSpy).toHaveBeenCalledWith({
        action: 'srcObject',
        value: mockStream,
        element: expect.any(Object)
      });
      // Get the video element from the spy call
      const spyCall = videoElementSpy.mock.calls[0];
      videoElement = spyCall[0].element;
    });

    // Manually trigger metadata loaded to transition to active state
    if (videoElement && videoElement.onloadedmetadata) {
      videoElement.onloadedmetadata(new Event('loadedmetadata'));
    }

    // Wait for camera to become active
    await waitFor(() => {
      expect(screen.getByText('Stop Camera')).toBeInTheDocument();
    });

    // Stop camera
    const stopButton = screen.getByText('Stop Camera');
    fireEvent.click(stopButton);

    // Assert
    expect(mockTrack.stop).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('🛑 CameraDemo: stopCamera() called!');
    expect(console.log).toHaveBeenCalledWith('✅ CameraDemo: Camera stopped');
  });

  test('should process video frames correctly', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Wait for srcObject to be set and get the video element
    let videoElement;
    await waitFor(() => {
      expect(videoElementSpy).toHaveBeenCalledWith({
        action: 'srcObject',
        value: mockStream,
        element: expect.any(Object)
      });
      // Get the video element from the spy call
      const spyCall = videoElementSpy.mock.calls[0];
      videoElement = spyCall[0].element;
    });

    // Manually trigger metadata loaded to transition to active state
    if (videoElement && videoElement.onloadedmetadata) {
      videoElement.onloadedmetadata(new Event('loadedmetadata'));
    }

    // Wait for camera to become active and processing to start
    await waitFor(() => {
      expect(screen.getByText('Stop Camera')).toBeInTheDocument();
    });

    // Wait for canvas processing
    await waitFor(() => {
      expect(mockCanvasContext.drawImage).toHaveBeenCalled();
    });

    // Assert
    expect(console.log).toHaveBeenCalledWith(
      '📐 CameraDemo: Canvas resized to 1280x720'
    );
  });




  test('should calculate vision correction blur correctly', () => {
    // Test the blur calculation with different values
    const props1 = { readingVisionDiopter: 2.0, calibrationValue: 2.0 };
    const props2 = { readingVisionDiopter: 1.0, calibrationValue: 2.0 };
    const props3 = { readingVisionDiopter: 3.0, calibrationValue: 2.0 };

    // Test case 1: Perfect match
    const { unmount: unmount1 } = render(React.createElement(CameraDemo, props1));
    expect(screen.getByText('Blur Applied: 0.00px')).toBeInTheDocument(); // Perfect match
    unmount1();

    // Test case 2: 1D difference (1.0 vs 2.0)
    const { unmount: unmount2 } = render(React.createElement(CameraDemo, props2));
    expect(screen.getByText('Blur Applied: 0.30px')).toBeInTheDocument(); // 1D difference
    unmount2();

    // Test case 3: 1D difference (3.0 vs 2.0)
    render(React.createElement(CameraDemo, props3));
    expect(screen.getByText('Blur Applied: 0.30px')).toBeInTheDocument(); // 1D difference
  });

});