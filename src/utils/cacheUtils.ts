/**
 * Cache management utilities for service worker cache invalidation
 * Ensures new deployments with fixes are served fresh to users
 */

export interface CacheRefreshResult {
  success: boolean;
  version?: string;
  error?: string;
  cacheCleared: boolean;
}

export class CacheManager {
  private serviceWorker: ServiceWorker | null = null;

  constructor() {
    this.initServiceWorker();
  }

  private async initServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      this.serviceWorker = navigator.serviceWorker.controller;
    }
  }

  /**
   * Force cache refresh for new deployment
   * CRITICAL: This ensures users get the latest fixes
   */
  public async forceCacheRefresh(): Promise<CacheRefreshResult> {
    try {
      console.log("🔄 CacheManager: Forcing cache refresh for new deployment");

      if (!("serviceWorker" in navigator)) {
        throw new Error("Service worker not supported");
      }

      // Send message to service worker to clear all caches
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "FORCE_CACHE_REFRESH",
        });
      }

      // Clear any browser caches programmatically
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            console.log("🗑️ CacheManager: Clearing cache:", cacheName);
            return caches.delete(cacheName);
          }),
        );
      }

      // Clear localStorage cache flags
      this.clearLocalStorageCache();

      console.log("✅ CacheManager: Cache refresh complete");

      return {
        success: true,
        cacheCleared: true,
        version: await this.getServiceWorkerVersion(),
      };
    } catch (error) {
      console.error("❌ CacheManager: Failed to refresh cache:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        cacheCleared: false,
      };
    }
  }

  /**
   * Check if a new service worker is available
   */
  public async checkForUpdates(): Promise<boolean> {
    if (!("serviceWorker" in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return !!registration.waiting;
      }
    } catch (error) {
      console.warn("CacheManager: Failed to check for updates:", error);
    }

    return false;
  }

  /**
   * Get current service worker version
   */
  public async getServiceWorkerVersion(): Promise<string> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve("unknown");
        return;
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data?.version || "unknown");
      };

      navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" }, [
        channel.port2,
      ]);

      // Timeout after 5 seconds
      setTimeout(() => resolve("timeout"), 5000);
    });
  }

  /**
   * Clear localStorage cache flags and force fresh data load
   * CRITICAL: Preserves user calibration settings
   */
  private clearLocalStorageCache(): void {
    // Keys that should be cleared
    const cacheKeys = ["app_version", "last_cache_clear"];

    // CRITICAL: Keys that must be preserved (user calibration)
    const preserveKeys = [
      "calibrationValue",
      "maxvue_vision_settings",
      "maxvue_calibration_data",
      "visionCorrectionEnabled",
      "estimatedSphere",
    ];

    // Log preservation of user settings
    console.log("🔒 CacheManager: Preserving user calibration settings");

    preserveKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(
          `✅ CacheManager: Preserving ${key}: ${key.includes("calibration") ? value : "present"}`,
        );
      }
    });

    // Only clear non-critical cache keys
    cacheKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ CacheManager: Clearing cache key: ${key}`);
        localStorage.removeItem(key);
      }
    });

    // Set cache clear timestamp
    localStorage.setItem("last_cache_clear", Date.now().toString());
  }

  /**
   * Force page reload after cache clear
   */
  public forceReload(): void {
    console.log("🔄 CacheManager: Forcing page reload for fresh content");
    window.location.reload();
  }

  /**
   * Initialize cache refresh on app start for production deployments
   */
  public async initializeDeploymentRefresh(): Promise<void> {
    // Check if this is a new deployment
    const currentVersion = "2.0.1"; // Updated with manifest version
    const lastVersion = localStorage.getItem("app_version");

    if (lastVersion !== currentVersion) {
      console.log(
        `🚀 CacheManager: New deployment detected (${lastVersion} → ${currentVersion})`,
      );
      console.log("🔄 CacheManager: Refreshing cache for new fixes");

      // Force cache refresh for new deployment
      await this.forceCacheRefresh();

      // Update stored version
      localStorage.setItem("app_version", currentVersion);

      // Optionally force reload
      // this.forceReload();
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

/**
 * Utility function to force cache refresh and reload
 * Call this when deploying critical fixes
 */
export const deploymentRefresh = async (): Promise<void> => {
  console.log("🚀 Starting deployment cache refresh...");

  const result = await cacheManager.forceCacheRefresh();

  if (result.success) {
    console.log("✅ Cache refresh successful, reloading app...");
    setTimeout(() => {
      cacheManager.forceReload();
    }, 1000);
  } else {
    console.error("❌ Cache refresh failed:", result.error);
  }
};

/**
 * Check if cache needs refresh based on build timestamp
 */
export const checkCacheNeedsRefresh = (): boolean => {
  const lastCacheClear = localStorage.getItem("last_cache_clear");
  if (!lastCacheClear) return true;

  const timeSinceLastClear = Date.now() - parseInt(lastCacheClear);
  const oneHour = 60 * 60 * 1000;

  // If cache hasn't been cleared in the last hour, refresh it
  return timeSinceLastClear > oneHour;
};
