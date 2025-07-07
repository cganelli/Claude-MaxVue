import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CameraDemo from './CameraDemo';

// Mock media stream and video element
const mockTrack = {
  stop: vi.fn(),
  kind: 'video'
};

const mockStream = {
  getTracks: vi.fn(() => [mockTrack]),
  getVideoTracks: vi.fn(() => [mockTrack])
};

const mockVideoElement = {
  srcObject: null,
  autoplay: false,
  playsInline: false,
  muted: false,
  play: vi.fn(),
  readyState: 4, // HAVE_ENOUGH_DATA
  videoWidth: 1280,
  videoHeight: 720,
  HAVE_CURRENT_DATA: 2,
  HAVE_ENOUGH_DATA: 4,
  onloadedmetadata: null,
  onerror: null
};

const mockCanvasContext = {
  filter: '',
  drawImage: vi.fn(),
  fillStyle: '',
  fillRect: vi.fn(),
  font: '',
  fillText: vi.fn(),
  getContext: vi.fn(() => mockCanvasContext)
};

const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => mockCanvasContext)
};

// Mock getUserMedia
const mockGetUserMedia = vi.fn();

// Mock HTML elements
Object.defineProperty(global, 'HTMLVideoElement', {
  value: vi.fn(() => mockVideoElement),
  writable: true
});

Object.defineProperty(global, 'HTMLCanvasElement', {
  value: vi.fn(() => mockCanvas),
  writable: true
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

// Mock React refs
const mockVideoRef = { current: mockVideoElement };

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual as object,
    useRef: vi.fn((initial) => {
      if (initial === null) {
        // Alternate between video and canvas refs
        return mockVideoRef;
      }
      return { current: initial };
    })
  };
});

// Mock requestAnimationFrame
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
    mockVideoElement.play.mockClear();
    console.log = vi.fn();
    console.error = vi.fn();
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
    mockVideoElement.play.mockResolvedValue(undefined);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Wait for stream to be set
    await waitFor(() => {
      expect(mockVideoElement.srcObject).toBe(mockStream);
    });

    // Simulate onloadedmetadata event
    if (mockVideoElement.onloadedmetadata) {
      await mockVideoElement.onloadedmetadata();
    }

    // Assert
    expect(mockVideoElement.autoplay).toBe(true);
    expect(mockVideoElement.playsInline).toBe(true);
    expect(mockVideoElement.muted).toBe(true);
    expect(mockVideoElement.play).toHaveBeenCalled();
  });

  test('should handle video play errors gracefully', async () => {
    // Arrange
    const playError = new Error('Play failed');
    mockGetUserMedia.mockResolvedValue(mockStream);
    mockVideoElement.play.mockRejectedValue(playError);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockVideoElement.srcObject).toBe(mockStream);
    });

    // Simulate onloadedmetadata event
    if (mockVideoElement.onloadedmetadata) {
      await mockVideoElement.onloadedmetadata();
    }

    // Assert
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        '❌ CameraDemo: Video play error:',
        playError
      );
      expect(screen.getByText(/Failed to start video playback/)).toBeInTheDocument();
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
      expect(screen.getByText(/Camera permission denied/)).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        '❌ CameraDemo: Full error details:',
        expect.objectContaining({
          error: permissionError,
          name: 'NotAllowedError'
        })
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
      expect(screen.getByText(/No camera found/)).toBeInTheDocument();
    });
  });

  test('should stop camera and cleanup properly', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);
    mockVideoElement.play.mockResolvedValue(undefined);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    
    // Start camera
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockVideoElement.srcObject).toBe(mockStream);
    });

    // Simulate successful camera start
    if (mockVideoElement.onloadedmetadata) {
      await mockVideoElement.onloadedmetadata();
    }

    await waitFor(() => {
      expect(screen.getByText('Stop Camera')).toBeInTheDocument();
    });

    // Stop camera
    const stopButton = screen.getByText('Stop Camera');
    fireEvent.click(stopButton);

    // Assert
    expect(mockTrack.stop).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('🚪 CameraDemo: Stopping camera...');
    expect(console.log).toHaveBeenCalledWith('✅ CameraDemo: Camera stopped successfully');
  });

  test('should process video frames correctly', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);
    mockVideoElement.play.mockResolvedValue(undefined);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockVideoElement.srcObject).toBe(mockStream);
    });

    // Simulate successful camera start
    if (mockVideoElement.onloadedmetadata) {
      await mockVideoElement.onloadedmetadata();
    }

    // Wait for animation frame to process
    await waitFor(() => {
      expect(mockCanvasContext.drawImage).toHaveBeenCalledWith(
        mockVideoElement,
        0,
        0,
        mockVideoElement.videoWidth,
        mockVideoElement.videoHeight
      );
    });

    // Assert
    expect(mockCanvas.width).toBe(mockVideoElement.videoWidth);
    expect(mockCanvas.height).toBe(mockVideoElement.videoHeight);
    expect(console.log).toHaveBeenCalledWith(
      '🎥 CameraDemo: Processing frame 1280x720'
    );
  });

  test('should handle video element errors', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);
    const videoError = new Error('Video element error');

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockVideoElement.srcObject).toBe(mockStream);
    });

    // Simulate video element error
    if (mockVideoElement.onerror) {
      mockVideoElement.onerror(videoError);
    }

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      '❌ CameraDemo: Video element error:',
      videoError
    );
  });

  test('should fallback to lower constraints on overconstrained error', async () => {
    // Arrange
    const overconstrainedError = new DOMException('Overconstrained', 'OverconstrainedError');
    mockGetUserMedia
      .mockRejectedValueOnce(overconstrainedError)
      .mockResolvedValueOnce(mockStream);

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Assert
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledTimes(2);
      // First call with high resolution constraints
      expect(mockGetUserMedia).toHaveBeenNthCalledWith(1, {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });
      // Second call with fallback constraints
      expect(mockGetUserMedia).toHaveBeenNthCalledWith(2, {
        video: { facingMode: "user" },
        audio: false
      });
    });
  });

  test('should timeout on long camera access requests', async () => {
    // Arrange
    mockGetUserMedia.mockImplementation(() => 
      new Promise((resolve) => {
        // Never resolve to simulate hanging
        setTimeout(() => resolve(mockStream), 15000); // Longer than 10s timeout
      })
    );

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Camera access timeout/)).toBeInTheDocument();
    }, { timeout: 11000 });
  });

  test('should calculate vision correction blur correctly', () => {
    // Test the blur calculation with different values
    const props1 = { readingVisionDiopter: 2.0, calibrationValue: 2.0 };
    const props2 = { readingVisionDiopter: 1.0, calibrationValue: 2.0 };
    const props3 = { readingVisionDiopter: 3.0, calibrationValue: 2.0 };

    // Act & Assert
    render(React.createElement(CameraDemo, props1));
    expect(screen.getByText('Applied blur: 0.05px')).toBeInTheDocument(); // Perfect match

    render(React.createElement(CameraDemo, props2));
    expect(screen.getByText('Applied blur: 0.60px')).toBeInTheDocument(); // 1D difference

    render(React.createElement(CameraDemo, props3));
    expect(screen.getByText('Applied blur: 0.60px')).toBeInTheDocument(); // 1D difference
  });

  test('should handle video not ready state gracefully', async () => {
    // Arrange
    mockGetUserMedia.mockResolvedValue(mockStream);
    mockVideoElement.play.mockResolvedValue(undefined);
    mockVideoElement.readyState = 1; // HAVE_METADATA (not enough data)
    mockVideoElement.videoWidth = 0;
    mockVideoElement.videoHeight = 0;

    // Act
    render(React.createElement(CameraDemo, defaultProps));
    const startButton = screen.getByText('Start Camera');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockVideoElement.srcObject).toBe(mockStream);
    });

    if (mockVideoElement.onloadedmetadata) {
      await mockVideoElement.onloadedmetadata();
    }

    // Assert - Should log waiting message
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        '⏳ CameraDemo: Video not ready - readyState: 1, dimensions: 0x0'
      );
    });
  });
});