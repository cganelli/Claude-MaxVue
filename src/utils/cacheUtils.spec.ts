import { describe, expect, test, beforeEach, vi } from "vitest";
import { CacheManager, checkCacheNeedsRefresh } from "./cacheUtils";

// Mock caches API
const mockCaches = {
  keys: vi.fn(),
  delete: vi.fn(),
  open: vi.fn(),
};

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

// Mock navigator.serviceWorker
const mockServiceWorker = {
  controller: {
    postMessage: vi.fn(),
  },
  getRegistration: vi.fn(),
};

// Mock window object
Object.defineProperty(global, "window", {
  value: {
    caches: mockCaches,
    localStorage: mockLocalStorage,
  },
  writable: true,
});

Object.defineProperty(global, "navigator", {
  value: {
    serviceWorker: mockServiceWorker,
  },
  writable: true,
});

Object.defineProperty(global, "caches", {
  value: mockCaches,
  writable: true,
});

Object.defineProperty(global, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("CacheManager", () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    vi.clearAllMocks();
    cacheManager = new CacheManager();
  });

  test("forceCacheRefresh should clear all caches and return success", async () => {
    // Arrange
    const mockCacheNames = ["maxvue-demo-v1", "maxvue-demo-v2"];
    mockCaches.keys.mockResolvedValue(mockCacheNames);
    mockCaches.delete.mockResolvedValue(true);

    // Act
    const result = await cacheManager.forceCacheRefresh();

    // Assert
    expect(result.success).toBe(true);
    expect(result.cacheCleared).toBe(true);
    expect(mockServiceWorker.controller.postMessage).toHaveBeenCalledWith({
      type: "FORCE_CACHE_REFRESH",
    });
    expect(mockCaches.keys).toHaveBeenCalled();
    expect(mockCaches.delete).toHaveBeenCalledTimes(mockCacheNames.length);
  }, 10000); // Increase timeout to 10 seconds

  test("forceCacheRefresh should handle errors gracefully", async () => {
    // Arrange
    mockCaches.keys.mockRejectedValue(new Error("Cache API error"));

    // Act
    const result = await cacheManager.forceCacheRefresh();

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("Cache API error");
    expect(result.cacheCleared).toBe(false);
  });

  test("getServiceWorkerVersion should return version from service worker", async () => {
    // Arrange
    const expectedVersion = "maxvue-demo-v2025-07-06-03-25";

    // Mock MessageChannel
    const mockMessageChannel = {
      port1: { onmessage: null },
      port2: {},
    };
    global.MessageChannel = vi.fn(
      () => mockMessageChannel,
    ) as unknown as typeof MessageChannel;

    // Act
    const versionPromise = cacheManager.getServiceWorkerVersion();

    // Simulate service worker response
    setTimeout(() => {
      if (mockMessageChannel.port1.onmessage) {
        mockMessageChannel.port1.onmessage({
          data: { version: expectedVersion },
        } as MessageEvent);
      }
    }, 10);

    const version = await versionPromise;

    // Assert
    expect(version).toBe(expectedVersion);
    expect(mockServiceWorker.controller.postMessage).toHaveBeenCalledWith(
      { type: "GET_VERSION" },
      [mockMessageChannel.port2],
    );
  });

  test("getServiceWorkerVersion should timeout after 5 seconds", async () => {
    // Arrange
    vi.useFakeTimers();

    const mockMessageChannel = {
      port1: { onmessage: null },
      port2: {},
    };
    global.MessageChannel = vi.fn(
      () => mockMessageChannel,
    ) as unknown as typeof MessageChannel;

    // Act
    const versionPromise = cacheManager.getServiceWorkerVersion();

    // Fast-forward time
    vi.advanceTimersByTime(5000);

    const version = await versionPromise;

    // Assert
    expect(version).toBe("timeout");

    vi.useRealTimers();
  });

  test("initializeDeploymentRefresh should refresh cache on version change", async () => {
    // Arrange
    const oldVersion = "1.0.0";
    const newVersion = "2.0.1";

    mockLocalStorage.getItem.mockReturnValue(oldVersion);
    mockCaches.keys.mockResolvedValue(["old-cache"]);
    mockCaches.delete.mockResolvedValue(true);

    // Act
    await cacheManager.initializeDeploymentRefresh();

    // Assert
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("app_version");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "app_version",
      newVersion,
    );
    expect(mockServiceWorker.controller.postMessage).toHaveBeenCalledWith({
      type: "FORCE_CACHE_REFRESH",
    });
  }, 10000); // Increase timeout to 10 seconds

  test("initializeDeploymentRefresh should not refresh cache if version unchanged", async () => {
    // Arrange
    const currentVersion = "2.0.1";
    mockLocalStorage.getItem.mockReturnValue(currentVersion);

    // Act
    await cacheManager.initializeDeploymentRefresh();

    // Assert
    expect(mockServiceWorker.controller.postMessage).not.toHaveBeenCalled();
    expect(mockCaches.keys).not.toHaveBeenCalled();
  });
});

describe("checkCacheNeedsRefresh", () => {
  test("should return true if no cache clear timestamp exists", () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue(null);

    // Act
    const needsRefresh = checkCacheNeedsRefresh();

    // Assert
    expect(needsRefresh).toBe(true);
  });

  test("should return true if cache was cleared more than an hour ago", () => {
    // Arrange
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    mockLocalStorage.getItem.mockReturnValue(twoHoursAgo.toString());

    // Act
    const needsRefresh = checkCacheNeedsRefresh();

    // Assert
    expect(needsRefresh).toBe(true);
  });

  test("should return false if cache was cleared recently", () => {
    // Arrange
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    mockLocalStorage.getItem.mockReturnValue(thirtyMinutesAgo.toString());

    // Act
    const needsRefresh = checkCacheNeedsRefresh();

    // Assert
    expect(needsRefresh).toBe(false);
  });
});

describe("CRITICAL: Calibration Persistence During Cache Operations", () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks for cache operations
    mockCaches.keys.mockResolvedValue(["test-cache"]);
    mockCaches.delete.mockResolvedValue(true);

    cacheManager = new CacheManager();

    // Set up user's calibration data in localStorage
    mockLocalStorage.getItem.mockImplementation((key) => {
      const storage = {
        calibrationValue: "2.0",
        maxvue_calibration_data: JSON.stringify({
          readingVision: 2.0,
          contrastBoost: 15,
          edgeEnhancement: 25,
          timestamp: Date.now(),
        }),
        maxvue_vision_settings: JSON.stringify({
          readingVision: 2.0,
          contrastBoost: 15,
          edgeEnhancement: 25,
          isEnabled: true,
        }),
        visionCorrectionEnabled: "true",
      };
      return storage[key] || null;
    });
  });

  test("should PRESERVE user calibration settings during cache refresh", async () => {
    // Arrange - User's known +2.0D setting is mocked in localStorage

    // Mock getServiceWorkerVersion to avoid timeout
    vi.spyOn(cacheManager, "getServiceWorkerVersion").mockResolvedValue(
      "test-version",
    );

    // Act
    const result = await cacheManager.forceCacheRefresh();

    // Assert - Calibration should be preserved
    expect(result.success).toBe(true);

    // CRITICAL: Verify calibration data was NOT removed
    const removeItemCalls = mockLocalStorage.removeItem.mock.calls;
    expect(removeItemCalls).not.toContainEqual(["calibrationValue"]);
    expect(removeItemCalls).not.toContainEqual(["maxvue_calibration_data"]);
    expect(removeItemCalls).not.toContainEqual(["maxvue_vision_settings"]);
    expect(removeItemCalls).not.toContainEqual(["visionCorrectionEnabled"]);
  });

  test("should NOT clear critical user settings when clearing cache", async () => {
    // Arrange
    const criticalKeys = [
      "calibrationValue",
      "maxvue_calibration_data",
      "maxvue_vision_settings",
      "visionCorrectionEnabled",
    ];

    // Mock getServiceWorkerVersion to avoid timeout
    vi.spyOn(cacheManager, "getServiceWorkerVersion").mockResolvedValue(
      "test-version",
    );

    // Act
    await cacheManager.forceCacheRefresh();

    // Assert - Critical keys should NOT be removed
    criticalKeys.forEach((key) => {
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith(key);
    });

    // Only non-critical cache items should be cleared
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "last_cache_clear",
      expect.any(String),
    );
  });

  test("should restore user calibration after cache operations", async () => {
    // Arrange
    mockLocalStorage.setItem.mockClear();

    // Mock getServiceWorkerVersion to avoid timeout
    vi.spyOn(cacheManager, "getServiceWorkerVersion").mockResolvedValue(
      "test-version",
    );

    // Act
    await cacheManager.forceCacheRefresh();

    // Assert - Should preserve calibration
    expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
      "calibrationValue",
      expect.any(String),
    );
    expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
      "maxvue_calibration_data",
      expect.any(String),
    );
  });

  test("should handle missing calibration gracefully during cache clear", async () => {
    // Arrange - No calibration data
    mockLocalStorage.getItem.mockReturnValue(null);

    // Mock getServiceWorkerVersion to avoid timeout
    vi.spyOn(cacheManager, "getServiceWorkerVersion").mockResolvedValue(
      "test-version",
    );

    // Act
    const result = await cacheManager.forceCacheRefresh();

    // Assert
    expect(result.success).toBe(true);
    expect(result.cacheCleared).toBe(true);
  });

  test("should log but not remove user calibration settings", async () => {
    // Arrange
    console.log = vi.fn();

    // Mock getServiceWorkerVersion to avoid timeout
    vi.spyOn(cacheManager, "getServiceWorkerVersion").mockResolvedValue(
      "test-version",
    );

    // Act
    await cacheManager.forceCacheRefresh();

    // Assert - Should log the action but not remove
    expect(console.log).toHaveBeenCalledWith(
      "🔒 CacheManager: Preserving user calibration settings",
    );
  });
});
