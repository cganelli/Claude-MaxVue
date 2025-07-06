import { useState, useEffect, useCallback, useRef } from "react";
import {
  VisionCorrectionEngine,
  VisionSettings,
  ProcessingOptions,
} from "../utils/VisionCorrectionEngine";

export interface CalibrationData {
  readingVision: number; // 0.00D to +3.5D presbyopia correction
  contrastBoost: number;
  edgeEnhancement: number;
  timestamp: number;
}

export interface UseVisionCorrectionReturn {
  // Settings
  settings: VisionSettings;
  updateSettings: (newSettings: Partial<VisionSettings>) => void;

  // Calibration
  calibrationData: CalibrationData | null;
  saveCalibration: (data: CalibrationData) => void;
  loadCalibration: () => CalibrationData | null;

  // Processing
  processElement: (element: HTMLElement) => void;
  processImage: (
    image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  ) => HTMLCanvasElement;

  // State
  isEnabled: boolean;
  toggleEnabled: () => void;
  isProcessing: boolean;

  // Advanced features
  startRealTimeProcessing: (container: HTMLElement) => void;
  stopRealTimeProcessing: () => void;

  // Calibration helpers
  runVisionTest: () => Promise<CalibrationData>;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: VisionSettings = {
  readingVision: 0.0, // Start at 0.00D (no presbyopia)
  contrastBoost: 15,
  edgeEnhancement: 25,
  isEnabled: true,
};

const STORAGE_KEY = "maxvue_vision_settings";
const CALIBRATION_KEY = "maxvue_calibration_data";

export const useVisionCorrection = (): UseVisionCorrectionReturn => {
  // Core state
  const [settings, setSettings] = useState<VisionSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calibrationData, setCalibrationData] =
    useState<CalibrationData | null>(null);

  // Engine and processing
  const engineRef = useRef<VisionCorrectionEngine | null>(null);
  const processingIntervalRef = useRef<number | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Initialize engine when settings change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.dispose();
    }

    const processingOptions: ProcessingOptions = {
      preserveColors: true,
      adaptiveSharpening: true,
      realTimeProcessing: settings.isEnabled,
    };

    engineRef.current = new VisionCorrectionEngine(settings, processingOptions);
  }, [settings]);

  // Load settings and calibration from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    const savedCalibration = localStorage.getItem(CALIBRATION_KEY);

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.warn("Failed to load vision settings:", e);
      }
    }

    if (savedCalibration) {
      try {
        const parsed = JSON.parse(savedCalibration);
        setCalibrationData(parsed);
        // Apply calibration data to settings
        if (parsed) {
          setSettings((prev) => ({
            ...prev,
            readingVision: parsed.readingVision || 0.0,
            contrastBoost: parsed.contrastBoost,
            edgeEnhancement: parsed.edgeEnhancement,
          }));
        }
      } catch (e) {
        console.warn("Failed to load calibration data:", e);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Update settings function
  const updateSettings = useCallback((newSettings: Partial<VisionSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };

      // CRITICAL FIX: Clear processing state so images can be reprocessed with new settings
      if (engineRef.current) {
        engineRef.current.clearProcessingState();
        engineRef.current.updateSettings(updated);
      }

      return updated;
    });
  }, []);

  // Toggle enabled state
  const toggleEnabled = useCallback(() => {
    updateSettings({ isEnabled: !settings.isEnabled });
  }, [settings.isEnabled, updateSettings]);

  // Save calibration data
  const saveCalibration = useCallback(
    (data: CalibrationData) => {
      setCalibrationData(data);
      localStorage.setItem(CALIBRATION_KEY, JSON.stringify(data));

      // Apply calibration to current settings
      updateSettings({
        readingVision: data.readingVision,
        contrastBoost: data.contrastBoost,
        edgeEnhancement: data.edgeEnhancement,
      });
    },
    [updateSettings],
  );

  // Load calibration data
  const loadCalibration = useCallback((): CalibrationData | null => {
    const saved = localStorage.getItem(CALIBRATION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to load calibration:", e);
      }
    }
    return null;
  }, []);

  // Process individual element
  const processElement = useCallback(
    (element: HTMLElement) => {
      if (!engineRef.current || !settings.isEnabled) return;

      setIsProcessing(true);
      try {
        engineRef.current.processElement(element);
      } catch (error) {
        console.error("Error processing element:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [settings.isEnabled],
  );

  // Process image/video/canvas
  const processImage = useCallback(
    (
      source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    ): HTMLCanvasElement => {
      if (!engineRef.current) {
        throw new Error("Vision correction engine not initialized");
      }

      setIsProcessing(true);
      try {
        return engineRef.current.processImage(source);
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  // Start real-time processing for a container
  const startRealTimeProcessing = useCallback(
    (container: HTMLElement) => {
      if (!settings.isEnabled || processingIntervalRef.current) return;

      // Process existing content
      const processExistingContent = () => {
        const images = container.querySelectorAll("img");
        const videos = container.querySelectorAll("video");
        // Process text content
        const textElements = container.querySelectorAll(
          "p, h1, h2, h3, h4, h5, h6, span, div.prose, .email-content, .web-content, article, blockquote, code, pre",
        );

        images.forEach((img) => {
          if (img.complete) processElement(img);
        });

        videos.forEach((video) => processElement(video));

        // Process text elements
        textElements.forEach((element) =>
          processElement(element as HTMLElement),
        );
      };

      // Initial processing
      processExistingContent();

      // Set up mutation observer for dynamic content
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;

              // Process new images
              if (element.tagName === "IMG") {
                const img = element as HTMLImageElement;
                if (img.complete) {
                  processElement(img);
                } else {
                  img.addEventListener("load", () => processElement(img), {
                    once: true,
                  });
                }
              }

              // Process new videos
              if (element.tagName === "VIDEO") {
                processElement(element);
              }

              // Process text elements
              const textTags = [
                "P",
                "H1",
                "H2",
                "H3",
                "H4",
                "H5",
                "H6",
                "SPAN",
                "DIV",
                "ARTICLE",
                "BLOCKQUOTE",
                "CODE",
                "PRE",
              ];
              if (
                textTags.includes(element.tagName) ||
                element.classList.contains("prose") ||
                element.classList.contains("email-content") ||
                element.classList.contains("web-content")
              ) {
                processElement(element);
              }

              // Process images within new elements
              const newImages = element.querySelectorAll?.("img");
              const newVideos = element.querySelectorAll?.("video");
              const newTextElements = element.querySelectorAll?.(
                "p, h1, h2, h3, h4, h5, h6, span, div.prose, .email-content, .web-content, article, blockquote, code, pre",
              );

              newImages?.forEach((img) => {
                if (img.complete) {
                  processElement(img);
                } else {
                  img.addEventListener("load", () => processElement(img), {
                    once: true,
                  });
                }
              });

              newVideos?.forEach((video) => processElement(video));

              // Process text elements within new elements
              newTextElements?.forEach((textElement) =>
                processElement(textElement as HTMLElement),
              );
            }
          });
        });
      });

      observerRef.current.observe(container, {
        childList: true,
        subtree: true,
      });

      // Set up periodic processing for dynamic content
      processingIntervalRef.current = window.setInterval(() => {
        if (settings.isEnabled) {
          processExistingContent();
        }
      }, 1000); // Process every second
    },
    [settings.isEnabled, processElement],
  );

  // Stop real-time processing
  const stopRealTimeProcessing = useCallback(() => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Vision test function
  const runVisionTest = useCallback(async (): Promise<CalibrationData> => {
    return new Promise((resolve) => {
      // This would integrate with your existing vision test logic
      // For now, return current settings as calibration
      const testResults: CalibrationData = {
        readingVision: settings.readingVision,
        contrastBoost: settings.contrastBoost,
        edgeEnhancement: settings.edgeEnhancement,
        timestamp: Date.now(),
      };

      resolve(testResults);
    });
  }, [settings]);

  // Reset to default settings
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CALIBRATION_KEY);
    setCalibrationData(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
      }
      stopRealTimeProcessing();
    };
  }, [stopRealTimeProcessing]);

  return {
    // Settings
    settings,
    updateSettings,

    // Calibration
    calibrationData,
    saveCalibration,
    loadCalibration,

    // Processing
    processElement,
    processImage,

    // State
    isEnabled: settings.isEnabled,
    toggleEnabled,
    isProcessing,

    // Advanced features
    startRealTimeProcessing,
    stopRealTimeProcessing,

    // Calibration helpers
    runVisionTest,
    resetSettings,
  };
};

// Event-based communication for vision correction updates
export const triggerVisionCorrectionUpdate = () => {
  const event = new CustomEvent("visionCorrectionUpdate", {
    detail: { timestamp: Date.now() },
  });
  window.dispatchEvent(event);
};

// Get vision correction style for elements
export const getVisionCorrectionStyle = (
  customBlur?: number,
): React.CSSProperties => {
  const visionCorrectionEnabled =
    localStorage.getItem("visionCorrectionEnabled") === "true";

  if (!visionCorrectionEnabled) {
    return {};
  }

  const calibrationValue = parseFloat(
    localStorage.getItem("calibrationValue") || "0",
  );
  const estimatedSphere = parseFloat(
    localStorage.getItem("estimatedSphere") || "0",
  );

  // Use customBlur if provided, otherwise calculate based on calibration
  let blurAmount = 0;
  if (customBlur !== undefined) {
    blurAmount = customBlur;
  } else {
    // Calculate blur based on difference from calibration baseline
    blurAmount = Math.max(0, calibrationValue - estimatedSphere);
  }

  return {
    filter: blurAmount > 0 ? `blur(${blurAmount.toFixed(2)}px)` : "none",
    transition: "filter 0.2s ease-in-out",
  };
};
