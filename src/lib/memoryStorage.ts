// Memory-based storage adapter for environments with restricted localStorage
// Uses module-level variable for persistence across component re-renders

// Module-level storage that persists across component lifecycles
let memoryStore: Record<string, string> = {};

// Simple memory storage implementation
export const memoryStorage = {
  getItem: (key: string) => {
    const val = memoryStore[key];
    console.log(`🧠 MEMORY STORAGE GET: ${key} = ${val ? "Present" : "null"}`);
    return val ?? null;
  },
  setItem: (key: string, value: string) => {
    memoryStore[key] = value;
    console.log(`🧠 MEMORY STORAGE SET: ${key} = ${value.slice(0, 30)}...`);
  },
  removeItem: (key: string) => {
    delete memoryStore[key];
    console.log(`🧠 MEMORY STORAGE REMOVE: ${key}`);
  },
  clear: () => {
    memoryStore = {};
    console.log("🧠 MEMORY STORAGE CLEAR");
  },
  // Debug methods
  getAllKeys: () => Object.keys(memoryStore),
  getSize: () => Object.keys(memoryStore).length,
  // Direct access to store for debugging
  _getStore: () => memoryStore,
};

// Hybrid storage that tries localStorage first, falls back to memory
export class HybridStorage {
  private useMemory: boolean = false;
  private storageType: "localStorage" | "memory" = "localStorage";

  constructor() {
    this.detectStorageCapability();
  }

  private detectStorageCapability(): void {
    try {
      const testKey = "supabase-storage-test-" + Date.now();
      localStorage.setItem(testKey, "test");
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved === "test") {
        console.log("🔄 HYBRID STORAGE: localStorage available and working");
        this.useMemory = false;
        this.storageType = "localStorage";
      } else {
        throw new Error("localStorage test failed");
      }
    } catch (error) {
      console.log(
        "🔄 HYBRID STORAGE: localStorage not available, using memory storage",
      );
      console.log("🔄 HYBRID STORAGE ERROR:", error);
      this.useMemory = true;
      this.storageType = "memory";
    }
  }

  getItem(key: string): string | null {
    // Synchronous fallback - try localStorage first, then memory
    if (!this.useMemory) {
      try {
        const value = localStorage.getItem(key);
        console.log(
          `🔄 HYBRID STORAGE GET (localStorage): ${key} = ${value ? "Present" : "null"}`,
        );
        return value;
      } catch {
        console.log(
          `🔄 HYBRID STORAGE GET FAILED (localStorage): ${key}, switching to memory`,
        );
        this.useMemory = true;
        this.storageType = "memory";
      }
    }

    // Use memory storage
    return memoryStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    // Synchronous fallback - try localStorage first, then memory
    if (!this.useMemory) {
      try {
        console.log(
          `🔄 HYBRID STORAGE SET (localStorage): ${key} = ${value.slice(0, 30)}...`,
        );
        localStorage.setItem(key, value);
        console.log(`🔄 HYBRID STORAGE SET SUCCESS (localStorage): ${key}`);
        return;
      } catch {
        console.log(
          `🔄 HYBRID STORAGE SET FAILED (localStorage): ${key}, switching to memory`,
        );
        this.useMemory = true;
        this.storageType = "memory";
      }
    }

    // Use memory storage
    memoryStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    // Synchronous fallback - try localStorage first, then memory
    if (!this.useMemory) {
      try {
        console.log(`🔄 HYBRID STORAGE REMOVE (localStorage): ${key}`);
        localStorage.removeItem(key);
        return;
      } catch {
        console.log(
          `🔄 HYBRID STORAGE REMOVE FAILED (localStorage): ${key}, switching to memory`,
        );
        this.useMemory = true;
        this.storageType = "memory";
      }
    }

    // Use memory storage
    memoryStorage.removeItem(key);
  }

  clear(): void {
    if (!this.useMemory) {
      try {
        localStorage.clear();
        return;
      } catch {
        console.log(
          "🔄 HYBRID STORAGE CLEAR FAILED (localStorage), switching to memory",
        );
        this.useMemory = true;
        this.storageType = "memory";
      }
    }

    memoryStorage.clear();
  }

  // Debug methods
  isUsingMemory(): boolean {
    return this.useMemory;
  }

  getStorageType(): "localStorage" | "memory" {
    return this.storageType;
  }

  getStorageInfo() {
    if (this.useMemory) {
      return {
        type: "memory" as const,
        keys: memoryStorage.getAllKeys(),
        size: memoryStorage.getSize(),
        store: memoryStorage._getStore(),
      };
    } else {
      try {
        return {
          type: "localStorage" as const,
          keys: Object.keys(localStorage),
          size: localStorage.length,
          available: true,
        };
      } catch {
        // If we can't even read localStorage, switch to memory
        this.useMemory = true;
        this.storageType = "memory";
        return {
          type: "memory" as const,
          keys: memoryStorage.getAllKeys(),
          size: memoryStorage.getSize(),
          store: memoryStorage._getStore(),
          fallbackReason: "localStorage read failed",
        };
      }
    }
  }

  // Force refresh storage capability detection
  refreshStorageDetection(): void {
    this.detectStorageCapability();
  }
}
