import { describe, expect, test, beforeEach, vi } from 'vitest';
import { CacheManager, checkCacheNeedsRefresh } from './cacheUtils';

// Mock navigator.serviceWorker
const mockServiceWorker = {
  controller: {
    postMessage: vi.fn()
  },
  getRegistration: vi.fn()
};

// Mock caches API
const mockCaches = {
  keys: vi.fn(),
  delete: vi.fn(),
  open: vi.fn()
};

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(global, 'navigator', {
  value: {
    serviceWorker: mockServiceWorker
  },
  writable: true
});

Object.defineProperty(global, 'caches', {
  value: mockCaches,
  writable: true
});

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    vi.clearAllMocks();
    cacheManager = new CacheManager();
  });

  test('forceCacheRefresh should clear all caches and return success', async () => {
    // Arrange
    const mockCacheNames = ['maxvue-demo-v1', 'maxvue-demo-v2'];
    mockCaches.keys.mockResolvedValue(mockCacheNames);
    mockCaches.delete.mockResolvedValue(true);

    // Act
    const result = await cacheManager.forceCacheRefresh();

    // Assert
    expect(result.success).toBe(true);
    expect(result.cacheCleared).toBe(true);
    expect(mockServiceWorker.controller.postMessage).toHaveBeenCalledWith({
      type: 'FORCE_CACHE_REFRESH'
    });
    expect(mockCaches.keys).toHaveBeenCalled();
    expect(mockCaches.delete).toHaveBeenCalledTimes(mockCacheNames.length);
  }, 10000); // Increase timeout to 10 seconds

  test('forceCacheRefresh should handle errors gracefully', async () => {
    // Arrange
    mockCaches.keys.mockRejectedValue(new Error('Cache API error'));

    // Act
    const result = await cacheManager.forceCacheRefresh();

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Cache API error');
    expect(result.cacheCleared).toBe(false);
  });

  test('getServiceWorkerVersion should return version from service worker', async () => {
    // Arrange
    const expectedVersion = 'maxvue-demo-v2025-07-06-03-25';
    
    // Mock MessageChannel
    const mockMessageChannel = {
      port1: { onmessage: null },
      port2: {}
    };
    global.MessageChannel = vi.fn(() => mockMessageChannel) as unknown as typeof MessageChannel;

    // Act
    const versionPromise = cacheManager.getServiceWorkerVersion();
    
    // Simulate service worker response
    setTimeout(() => {
      if (mockMessageChannel.port1.onmessage) {
        mockMessageChannel.port1.onmessage({
          data: { version: expectedVersion }
        } as MessageEvent);
      }
    }, 10);

    const version = await versionPromise;

    // Assert
    expect(version).toBe(expectedVersion);
    expect(mockServiceWorker.controller.postMessage).toHaveBeenCalledWith(
      { type: 'GET_VERSION' },
      [mockMessageChannel.port2]
    );
  });

  test('getServiceWorkerVersion should timeout after 5 seconds', async () => {
    // Arrange
    vi.useFakeTimers();
    
    const mockMessageChannel = {
      port1: { onmessage: null },
      port2: {}
    };
    global.MessageChannel = vi.fn(() => mockMessageChannel) as unknown as typeof MessageChannel;

    // Act
    const versionPromise = cacheManager.getServiceWorkerVersion();
    
    // Fast-forward time
    vi.advanceTimersByTime(5000);
    
    const version = await versionPromise;

    // Assert
    expect(version).toBe('timeout');
    
    vi.useRealTimers();
  });

  test('initializeDeploymentRefresh should refresh cache on version change', async () => {
    // Arrange
    const oldVersion = '1.0.0';
    const newVersion = '2.0.1';
    
    mockLocalStorage.getItem.mockReturnValue(oldVersion);
    mockCaches.keys.mockResolvedValue(['old-cache']);
    mockCaches.delete.mockResolvedValue(true);

    // Act
    await cacheManager.initializeDeploymentRefresh();

    // Assert
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('app_version');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('app_version', newVersion);
    expect(mockServiceWorker.controller.postMessage).toHaveBeenCalledWith({
      type: 'FORCE_CACHE_REFRESH'
    });
  }, 10000); // Increase timeout to 10 seconds

  test('initializeDeploymentRefresh should not refresh cache if version unchanged', async () => {
    // Arrange
    const currentVersion = '2.0.1';
    mockLocalStorage.getItem.mockReturnValue(currentVersion);

    // Act
    await cacheManager.initializeDeploymentRefresh();

    // Assert
    expect(mockServiceWorker.controller.postMessage).not.toHaveBeenCalled();
    expect(mockCaches.keys).not.toHaveBeenCalled();
  });
});

describe('checkCacheNeedsRefresh', () => {
  test('should return true if no cache clear timestamp exists', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue(null);

    // Act
    const needsRefresh = checkCacheNeedsRefresh();

    // Assert
    expect(needsRefresh).toBe(true);
  });

  test('should return true if cache was cleared more than an hour ago', () => {
    // Arrange
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    mockLocalStorage.getItem.mockReturnValue(twoHoursAgo.toString());

    // Act
    const needsRefresh = checkCacheNeedsRefresh();

    // Assert
    expect(needsRefresh).toBe(true);
  });

  test('should return false if cache was cleared recently', () => {
    // Arrange
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
    mockLocalStorage.getItem.mockReturnValue(thirtyMinutesAgo.toString());

    // Act
    const needsRefresh = checkCacheNeedsRefresh();

    // Assert
    expect(needsRefresh).toBe(false);
  });
});