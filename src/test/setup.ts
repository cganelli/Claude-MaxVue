import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock getUserMedia for camera tests
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    }),
  },
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Canvas API for tests
const mockCanvasContext = {
  fillStyle: '',
  font: '',
  fillRect: vi.fn(),
  fillText: vi.fn(),
  getImageData: vi.fn().mockReturnValue({
    data: new Uint8ClampedArray(100 * 100 * 4),
    width: 100,
    height: 100
  }),
  putImageData: vi.fn(),
  drawImage: vi.fn(),
  createImageData: vi.fn().mockReturnValue({
    data: new Uint8ClampedArray(100 * 100 * 4),
    width: 100,
    height: 100
  })
};

HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCanvasContext);
HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};