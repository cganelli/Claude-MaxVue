/**
 * Utility functions for vision correction system
 */

export interface VisionCalibrationResult {
  nearVisionStrength: number;
  farVisionStrength: number;
  contrastBoost: number;
  edgeEnhancement: number;
  confidence: number;
  recommendedSettings: {
    forReading: { near: number; far: number; contrast: number; edge: number };
    forImages: { near: number; far: number; contrast: number; edge: number };
    forVideo: { near: number; far: number; contrast: number; edge: number };
  };
}

/**
 * Analyze user's vision needs based on interaction patterns
 */
export class VisionAnalyzer {
  private interactionHistory: Array<{
    contentType: "text" | "image" | "video";
    fontSize: number;
    contrast: number;
    duration: number;
    timestamp: number;
  }> = [];

  public recordInteraction(
    contentType: "text" | "image" | "video",
    fontSize: number,
    contrast: number,
    duration: number,
  ): void {
    this.interactionHistory.push({
      contentType,
      fontSize,
      contrast,
      duration,
      timestamp: Date.now(),
    });

    // Keep only last 100 interactions
    if (this.interactionHistory.length > 100) {
      this.interactionHistory = this.interactionHistory.slice(-100);
    }
  }

  public analyzeVisionNeeds(): VisionCalibrationResult {
    if (this.interactionHistory.length === 0) {
      return this.getDefaultCalibration();
    }

    const textInteractions = this.interactionHistory.filter(
      (i) => i.contentType === "text",
    );
    const imageInteractions = this.interactionHistory.filter(
      (i) => i.contentType === "image",
    );
    const videoInteractions = this.interactionHistory.filter(
      (i) => i.contentType === "video",
    );

    // Analyze text reading patterns
    const avgTextSize =
      textInteractions.reduce((sum, i) => sum + i.fontSize, 0) /
        textInteractions.length || 16;
    const avgTextDuration =
      textInteractions.reduce((sum, i) => sum + i.duration, 0) /
        textInteractions.length || 5000;

    // Calculate recommendations based on patterns
    const nearVisionStrength = this.calculateNearVisionStrength(
      avgTextSize,
      avgTextDuration,
    );
    const farVisionStrength = this.calculateFarVisionStrength(
      imageInteractions,
      videoInteractions,
    );
    const contrastBoost = this.calculateContrastBoost(this.interactionHistory);
    const edgeEnhancement = this.calculateEdgeEnhancement(textInteractions);

    return {
      nearVisionStrength,
      farVisionStrength,
      contrastBoost,
      edgeEnhancement,
      confidence: this.calculateConfidence(),
      recommendedSettings: {
        forReading: {
          near: Math.min(100, nearVisionStrength * 1.2),
          far: Math.max(0, farVisionStrength * 0.8),
          contrast: Math.min(100, contrastBoost * 1.1),
          edge: Math.min(100, edgeEnhancement * 1.3),
        },
        forImages: {
          near: Math.max(0, nearVisionStrength * 0.7),
          far: farVisionStrength,
          contrast: contrastBoost,
          edge: Math.max(0, edgeEnhancement * 0.8),
        },
        forVideo: {
          near: Math.max(0, nearVisionStrength * 0.6),
          far: Math.min(100, farVisionStrength * 1.1),
          contrast: Math.max(0, contrastBoost * 0.9),
          edge: Math.max(0, edgeEnhancement * 0.7),
        },
      },
    };
  }

  private calculateNearVisionStrength(
    avgTextSize: number,
    avgDuration: number,
  ): number {
    // Users who prefer larger text or spend more time reading likely need more near vision help
    const sizeStrength = Math.max(0, (20 - avgTextSize) * 3); // Stronger correction for smaller preferred text
    const durationStrength = Math.min(30, avgDuration / 200); // Longer reading time suggests difficulty
    return Math.min(100, sizeStrength + durationStrength);
  }

  private calculateFarVisionStrength(
    imageInteractions: unknown[],
    videoInteractions: unknown[],
  ): number {
    // Base far vision strength on image/video interaction patterns
    const totalMediaInteractions =
      imageInteractions.length + videoInteractions.length;
    const avgMediaDuration =
      [...imageInteractions, ...videoInteractions].reduce(
        (sum, i) => sum + (i as { duration: number }).duration,
        0,
      ) / totalMediaInteractions || 3000;

    // Shorter interaction times with media might indicate difficulty seeing details
    const baseStrength = Math.max(0, (5000 - avgMediaDuration) / 100);
    return Math.min(100, baseStrength);
  }

  private calculateContrastBoost(interactions: unknown[]): number {
    // Analyze contrast preferences from interaction history
    const avgContrast =
      interactions.reduce((sum, i) => sum + (i as { contrast: number }).contrast, 0) /
        interactions.length || 1;
    return Math.min(100, (avgContrast - 1) * 50 + 15);
  }

  private calculateEdgeEnhancement(textInteractions: unknown[]): number {
    // Text-heavy users likely benefit from edge enhancement
    const textRatio =
      textInteractions.length / Math.max(1, this.interactionHistory.length);
    return Math.min(100, textRatio * 40 + 10);
  }

  private calculateConfidence(): number {
    // Confidence based on amount of interaction data
    const dataPoints = this.interactionHistory.length;
    return Math.min(100, (dataPoints / 50) * 100);
  }

  private getDefaultCalibration(): VisionCalibrationResult {
    return {
      nearVisionStrength: 30,
      farVisionStrength: 20,
      contrastBoost: 15,
      edgeEnhancement: 25,
      confidence: 0,
      recommendedSettings: {
        forReading: { near: 35, far: 15, contrast: 20, edge: 30 },
        forImages: { near: 20, far: 20, contrast: 15, edge: 20 },
        forVideo: { near: 15, far: 25, contrast: 10, edge: 15 },
      },
    };
  }

  public exportData(): string {
    return JSON.stringify({
      interactionHistory: this.interactionHistory,
      analysis: this.analyzeVisionNeeds(),
      exportDate: new Date().toISOString(),
    });
  }

  public importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (
        parsed.interactionHistory &&
        Array.isArray(parsed.interactionHistory)
      ) {
        this.interactionHistory = parsed.interactionHistory;
        return true;
      }
    } catch (e) {
      console.error("Failed to import vision data:", e);
    }
    return false;
  }
}

/**
 * Content type detection utilities
 */
export const ContentTypeDetector = {
  isTextContent(element: HTMLElement): boolean {
    const textTags = [
      "P",
      "SPAN",
      "DIV",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "ARTICLE",
      "SECTION",
    ];
    return textTags.includes(element.tagName) || element.textContent !== null;
  },

  isImageContent(element: HTMLElement): boolean {
    return element.tagName === "IMG" || element.tagName === "PICTURE";
  },

  isVideoContent(element: HTMLElement): boolean {
    return element.tagName === "VIDEO";
  },

  getContentDifficulty(element: HTMLElement): "easy" | "medium" | "hard" {
    if (this.isTextContent(element)) {
      const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
      const textLength = element.textContent?.length || 0;

      if (fontSize < 12 || textLength > 1000) return "hard";
      if (fontSize < 14 || textLength > 500) return "medium";
      return "easy";
    }

    if (this.isImageContent(element)) {
      const img = element as HTMLImageElement;
      const area = img.naturalWidth * img.naturalHeight;

      if (area < 50000) return "hard";
      if (area < 200000) return "medium";
      return "easy";
    }

    return "medium";
  },
};

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private metrics = {
    processedElements: 0,
    totalProcessingTime: 0,
    averageProcessingTime: 0,
    lastProcessingTime: 0,
    errorCount: 0,
    startTime: Date.now(),
  };

  private processingTimes: number[] = [];

  public startTiming(): number {
    return performance.now();
  }

  public endTiming(startTime: number): void {
    const processingTime = performance.now() - startTime;

    this.processingTimes.push(processingTime);
    if (this.processingTimes.length > 100) {
      this.processingTimes = this.processingTimes.slice(-100);
    }

    this.metrics.processedElements++;
    this.metrics.totalProcessingTime += processingTime;
    this.metrics.lastProcessingTime = processingTime;
    this.metrics.averageProcessingTime =
      this.processingTimes.reduce((sum, time) => sum + time, 0) /
      this.processingTimes.length;
  }

  public recordError(error: Error, context: string): void {
    this.metrics.errorCount++;
    console.error(`Vision processing error in ${context}:`, error);
  }

  public getMetrics() {
    return {
      ...this.metrics,
      uptime: Date.now() - this.metrics.startTime,
      elementsPerSecond:
        this.metrics.processedElements /
        ((Date.now() - this.metrics.startTime) / 1000),
      errorRate:
        this.metrics.errorCount / Math.max(1, this.metrics.processedElements),
    };
  }

  public reset(): void {
    this.metrics = {
      processedElements: 0,
      totalProcessingTime: 0,
      averageProcessingTime: 0,
      lastProcessingTime: 0,
      errorCount: 0,
      startTime: Date.now(),
    };
    this.processingTimes = [];
  }
}

/**
 * Settings migration utilities
 */
export const SettingsMigration = {
  migrateFromV1(oldSettings: unknown): unknown {
    // Migrate from CSS blur-based settings to canvas-based settings
    const settings = oldSettings as { 
      blurAmount?: number; 
      contrast?: number; 
      enabled?: boolean;
    };
    if (settings.blurAmount !== undefined) {
      return {
        nearVisionStrength: Math.min(100, settings.blurAmount * 25),
        farVisionStrength: Math.min(100, settings.blurAmount * 20),
        contrastBoost: settings.contrast || 15,
        edgeEnhancement: 25,
        isEnabled: settings.enabled !== false,
      };
    }
    return oldSettings;
  },

  validateSettings(settings: unknown): boolean {
    const required = [
      "nearVisionStrength",
      "farVisionStrength",
      "contrastBoost",
      "edgeEnhancement",
    ];
    const settingsObject = settings as Record<string, unknown>;
    return required.every(
      (key) =>
        typeof settingsObject[key] === "number" &&
        settingsObject[key] >= 0 &&
        settingsObject[key] <= 100,
    );
  },

  sanitizeSettings(settings: unknown): unknown {
    const settingsObject = settings as {
      nearVisionStrength?: number;
      farVisionStrength?: number;
      contrastBoost?: number;
      edgeEnhancement?: number;
      isEnabled?: boolean;
    };
    return {
      nearVisionStrength: Math.max(
        0,
        Math.min(100, settingsObject.nearVisionStrength || 30),
      ),
      farVisionStrength: Math.max(
        0,
        Math.min(100, settingsObject.farVisionStrength || 20),
      ),
      contrastBoost: Math.max(
        0,
        Math.min(100, settingsObject.contrastBoost || 15),
      ),
      edgeEnhancement: Math.max(
        0,
        Math.min(100, settingsObject.edgeEnhancement || 25),
      ),
      isEnabled: settingsObject.isEnabled !== false,
    };
  },
};

/**
 * Device capability detection
 */
export const DeviceCapabilities = {
  supportsCanvas(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext && canvas.getContext("2d"));
    } catch {
      return false;
    }
  },

  supportsWebGL(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch {
      return false;
    }
  },

  getProcessingRecommendation(): "high" | "medium" | "low" {
    // Simple heuristic based on device capabilities
    if (!this.supportsCanvas()) return "low";

    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;

    const start = performance.now();
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(1000, 1000);
    ctx.putImageData(imageData, 0, 0);
    const time = performance.now() - start;

    if (time < 10) return "high";
    if (time < 50) return "medium";
    return "low";
  },

  getOptimalProcessingOptions(): {
    realTimeProcessing: boolean;
    adaptiveSharpening: boolean;
    preserveColors: boolean;
  } {
    const capability = this.getProcessingRecommendation();

    switch (capability) {
      case "high":
        return {
          realTimeProcessing: true,
          adaptiveSharpening: true,
          preserveColors: true,
        };
      case "medium":
        return {
          realTimeProcessing: true,
          adaptiveSharpening: false,
          preserveColors: true,
        };
      case "low":
        return {
          realTimeProcessing: false,
          adaptiveSharpening: false,
          preserveColors: false,
        };
    }
  },
};

/**
 * Accessibility helpers
 */
export const AccessibilityHelpers = {
  announceProcessingStatus(
    isProcessing: boolean,
    elementCount: number = 0,
  ): void {
    const message = isProcessing
      ? `Processing ${elementCount} elements for vision correction`
      : "Vision correction processing complete";

    this.announceToScreenReader(message);
  },

  announceSettingsChange(settingName: string, value: number): void {
    const message = `${settingName} set to ${value}%`;
    this.announceToScreenReader(message);
  },

  announceToScreenReader(message: string): void {
    const announcement = document.createElement("div");
    announcement.textContent = message;
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    announcement.style.width = "1px";
    announcement.style.height = "1px";
    announcement.style.overflow = "hidden";

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  addKeyboardShortcuts(callbacks: {
    toggleEnabled: () => void;
    increaseNearVision: () => void;
    decreaseNearVision: () => void;
    increaseFarVision: () => void;
    decreaseFarVision: () => void;
    resetSettings: () => void;
  }): () => void {
    const handleKeydown = (event: KeyboardEvent) => {
      // Use Ctrl+Alt modifier to avoid conflicts
      if (!event.ctrlKey || !event.altKey) return;

      switch (event.key) {
        case "v":
          event.preventDefault();
          callbacks.toggleEnabled();
          break;
        case "ArrowUp":
          event.preventDefault();
          if (event.shiftKey) {
            callbacks.increaseFarVision();
          } else {
            callbacks.increaseNearVision();
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (event.shiftKey) {
            callbacks.decreaseFarVision();
          } else {
            callbacks.decreaseNearVision();
          }
          break;
        case "r":
          event.preventDefault();
          callbacks.resetSettings();
          break;
      }
    };

    document.addEventListener("keydown", handleKeydown);

    // Return cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  },
};

/**
 * Debug utilities
 */
export const DebugUtils = {
  logProcessingStats(
    elementType: string,
    processingTime: number,
    settings: unknown,
    beforeImage?: ImageData,
    afterImage?: ImageData,
  ): void {
    if (process.env.NODE_ENV === "development") {
      console.group(`Vision Processing: ${elementType}`);
      console.log("Processing time:", `${processingTime.toFixed(2)}ms`);
      console.log("Settings:", settings);

      if (beforeImage && afterImage) {
        console.log("Before/After image data available for analysis");
        // Could add image difference analysis here
      }

      console.groupEnd();
    }
  },

  exportProcessingData(
    performanceMonitor: PerformanceMonitor,
    settings: unknown,
  ): string {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        performance: performanceMonitor.getMetrics(),
        settings,
        device: {
          userAgent: navigator.userAgent,
          canvas: DeviceCapabilities.supportsCanvas(),
          webgl: DeviceCapabilities.supportsWebGL(),
          processing: DeviceCapabilities.getProcessingRecommendation(),
        },
      },
      null,
      2,
    );
  },

  createDebugCanvas(imageData: ImageData, label: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    canvas.title = label;
    canvas.style.border = "1px solid #ccc";
    canvas.style.margin = "5px";

    const ctx = canvas.getContext("2d")!;
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  },
};

// Export singleton instances
export const visionAnalyzer = new VisionAnalyzer();
export const performanceMonitor = new PerformanceMonitor();
