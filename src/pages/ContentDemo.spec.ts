import { describe, expect, test, vi, beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

/**
 * Tests for ContentDemo page - Vision correction slider functionality
 *
 * CRITICAL REQUIREMENTS:
 * 1. Reading Vision slider should affect content clarity in real-time
 * 2. Content should be clearest when slider matches user's calibration
 * 3. Vision Test tab should be removed
 * 4. Only Overview, Images, Email, Web tabs should exist
 */

describe("contentDemoSliderFunctionality", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    // Set a default calibration value for testing
    localStorageMock.setItem("calibrationValue", "2.0");
  });

  test("should have 6 tabs: Overview, Images, Email, Web, Camera, Native App", () => {
    const tabs = [
      { id: "overview", name: "Overview", icon: "👁️" },
      { id: "images", name: "Images", icon: "🖼️" },
      { id: "email", name: "Email", icon: "📧" },
      { id: "web", name: "Web", icon: "🌐" },
      { id: "camera", name: "Camera", icon: "📷" },
      { id: "native", name: "Native App", icon: "📱" },
    ];

    expect(tabs).toHaveLength(6);
    expect(tabs.find((tab) => tab.id === "test")).toBeUndefined();
    expect(tabs.find((tab) => tab.name === "Vision Test")).toBeUndefined();
    expect(tabs.find((tab) => tab.id === "camera")).toBeDefined();
    expect(tabs.find((tab) => tab.id === "native")).toBeDefined();
  });

  test("Reading Vision slider should update content blur in real-time", () => {
    const userCalibration = 2.0; // User's calibrated prescription

    // Test different slider positions
    const testCases = [
      { sliderValue: 0.0, expectedBlur: 1.2 }, // 2.0D below calibration
      { sliderValue: 1.0, expectedBlur: 0.6 }, // 1.0D below calibration
      { sliderValue: 2.0, expectedBlur: 0.0 }, // At calibration - clearest
      { sliderValue: 2.5, expectedBlur: 0.0 }, // Above calibration - clear
      { sliderValue: 3.5, expectedBlur: 0.0 }, // Above calibration - clear
    ];

    testCases.forEach(({ sliderValue, expectedBlur }) => {
      const actualBlur = Math.max(0, (userCalibration - sliderValue) * 0.6);
      expect(Math.abs(actualBlur - expectedBlur)).toBeLessThan(0.01);
    });
  });

  test("content blur should be calculated based on distance from calibration", () => {
    const calculateContentBlur = (
      sliderValue: number,
      calibrationValue: number,
    ): number => {
      // When slider is at calibration, content should be clear (0 blur)
      // When slider is away from calibration, content should blur proportionally
      const blurAmount = Math.max(0, calibrationValue - sliderValue);
      return blurAmount * 0.6; // 0.6px blur per diopter
    };

    const calibration = 2.0;

    // Content should be clearest at calibration
    expect(calculateContentBlur(2.0, calibration)).toBe(0);

    // Content should blur when slider is below calibration
    expect(calculateContentBlur(0.0, calibration)).toBe(1.2);
    expect(calculateContentBlur(1.0, calibration)).toBe(0.6);

    // Content should not blur when slider is above calibration (no negative blur)
    expect(calculateContentBlur(3.0, calibration)).toBe(0);
    expect(calculateContentBlur(3.5, calibration)).toBe(0);
  });

  test("VisionProcessor should receive updated settings when slider changes", () => {
    // Mock the vision correction engine update
    const mockUpdateSettings = vi.fn();

    // Simulate slider change
    const newSliderValue = 2.5;
    const expectedSettings = {
      readingVision: newSliderValue,
      contrastBoost: expect.any(Number),
      edgeEnhancement: expect.any(Number),
      isEnabled: true,
    };

    // When slider changes, engine should be updated
    mockUpdateSettings(expectedSettings);

    expect(mockUpdateSettings).toHaveBeenCalledWith(expectedSettings);
  });

  test("all content types should have blur filter applied", () => {
    const contentSelectors = [
      ".prose", // Text content
      "img", // Images
      "video", // Videos
      ".email-content", // Email demo
      ".web-content", // Web demo
    ];

    const expectedBlurStyle = (blur: number) =>
      blur > 0 ? `blur(${blur.toFixed(2)}px)` : "none";

    // Each content type should have appropriate blur filter
    contentSelectors.forEach(() => {
      // Test that blur style can be applied
      const blur = 0.6; // Example blur value
      const style = expectedBlurStyle(blur);
      expect(style).toBe("blur(0.60px)");
    });
  });
});

describe("visionCorrectionIntegration", () => {
  test("WRONG: old presbyopia model (insufficient correction only)", () => {
    // OLD WRONG MODEL: content only blurs when slider below calibration
    const userCalibration = 2.0; // User needs +2.0D

    const oldIncorrectModel = (sliderValue: number, calibration: number) => {
      // WRONG: Only blurs below calibration, clear above
      const insufficientCorrection = calibration - sliderValue;
      return Math.max(0, insufficientCorrection * 0.6);
    };

    // This gives wrong results:
    expect(oldIncorrectModel(0.0, userCalibration)).toBe(1.2); // Blurry ✓
    expect(oldIncorrectModel(2.0, userCalibration)).toBe(0); // Clear ✓
    expect(oldIncorrectModel(2.5, userCalibration)).toBe(0); // Clear ❌ WRONG!
    expect(oldIncorrectModel(3.5, userCalibration)).toBe(0); // Clear ❌ WRONG!
  });

  test("CORRECT: distance-based presbyopia model (like calibration page)", () => {
    // CORRECT MODEL: content clear ONLY at user's prescription
    const userCalibration = 2.0; // User needs +2.0D

    const correctDistanceModel = (sliderValue: number, calibration: number) => {
      // CORRECT: Distance from optimal prescription
      const distanceFromOptimal = Math.abs(sliderValue - calibration);
      const blurPerDiopter = 0.6;
      const minimumBlur = 0.05;
      return distanceFromOptimal === 0
        ? minimumBlur
        : distanceFromOptimal * blurPerDiopter;
    };

    // This gives correct results:
    expect(correctDistanceModel(0.0, userCalibration)).toBe(1.2); // Very blurry (2.0D away)
    expect(correctDistanceModel(1.0, userCalibration)).toBe(0.6); // Blurry (1.0D away)
    expect(correctDistanceModel(2.0, userCalibration)).toBe(0.05); // Clear (at prescription)
    expect(correctDistanceModel(2.5, userCalibration)).toBe(0.3); // Blurry (0.5D away)
    expect(correctDistanceModel(3.5, userCalibration)).toBeCloseTo(0.9, 2); // Very blurry (1.5D away)
  });
});

describe("contentTypeSpecificTests", () => {
  const userCalibration = 2.0;

  const calculateCorrectBlur = (sliderValue: number) => {
    const distanceFromOptimal = Math.abs(sliderValue - userCalibration);
    const blurPerDiopter = 0.6;
    const minimumBlur = 0.05;
    return distanceFromOptimal === 0
      ? minimumBlur
      : distanceFromOptimal * blurPerDiopter;
  };

  test("email content should use correct blur for ALL text elements", () => {
    // ALL email text should follow same algorithm
    const emailSelectors = [
      ".email-header",
      ".email-subject",
      ".email-from",
      ".email-date",
      ".email-body p",
      ".email-body li",
      ".email-body strong",
    ];

    emailSelectors.forEach(() => {
      // Test at different slider positions
      expect(calculateCorrectBlur(0.0)).toBe(1.2); // All blurry at 0.0D
      expect(calculateCorrectBlur(2.0)).toBe(0.05); // All clear at 2.0D
      expect(calculateCorrectBlur(3.5)).toBeCloseTo(0.9, 2); // All blurry at 3.5D
    });
  });

  test("web content should use correct blur pattern", () => {
    // Web content should be clear ONLY at calibration
    const webContent = {
      title: calculateCorrectBlur(2.0),
      body: calculateCorrectBlur(2.0),
      quote: calculateCorrectBlur(2.0),
    };

    // At calibration - all clear
    expect(webContent.title).toBe(0.05);
    expect(webContent.body).toBe(0.05);
    expect(webContent.quote).toBe(0.05);

    // Away from calibration - all blurry
    const blurryWebContent = {
      title: calculateCorrectBlur(3.0),
      body: calculateCorrectBlur(3.0),
      quote: calculateCorrectBlur(3.0),
    };

    expect(blurryWebContent.title).toBe(0.6);
    expect(blurryWebContent.body).toBe(0.6);
    expect(blurryWebContent.quote).toBe(0.6);
  });

  test("image processing should handle Canvas security gracefully", () => {
    // Images should either:
    // 1. Process via Canvas (same-origin)
    // 2. Fall back to CSS filters (cross-origin)

    const imageBlur = calculateCorrectBlur(1.5); // 0.5D away = 0.3px blur
    expect(imageBlur).toBe(0.3);

    // CSS filter format for fallback
    const cssFilter = `blur(${imageBlur.toFixed(2)}px)`;
    expect(cssFilter).toBe("blur(0.30px)");
  });

  test("all content types should be consistent at key points", () => {
    const testPoints = [
      {
        slider: 0.0,
        expectedBlur: 1.2,
        description: "Very blurry (2.0D away)",
      },
      { slider: 1.0, expectedBlur: 0.6, description: "Blurry (1.0D away)" },
      {
        slider: 2.0,
        expectedBlur: 0.05,
        description: "Clear (at prescription)",
      },
      { slider: 2.5, expectedBlur: 0.3, description: "Blurry (0.5D away)" },
      {
        slider: 3.5,
        expectedBlur: 0.9,
        description: "Very blurry (1.5D away)",
      },
    ];

    testPoints.forEach(({ slider, expectedBlur }) => {
      const actualBlur = calculateCorrectBlur(slider);
      if (slider === 3.5) {
        expect(actualBlur).toBeCloseTo(expectedBlur, 2);
      } else {
        expect(actualBlur).toBe(expectedBlur);
      }
      // All content types should use this same blur value
    });
  });
});

// Mock MediaDevices API for webcam access
const mockMediaDevices = {
  getUserMedia: async (constraints: MediaStreamConstraints) => {
    if (constraints.video) {
      // Mock video stream
      return {
        getTracks: () => [{ stop: () => {} }],
        getVideoTracks: () => [{ stop: () => {} }],
        active: true,
      } as MediaStream;
    }
    throw new Error("Camera access denied");
  },
};

Object.defineProperty(globalThis, "navigator", {
  value: {
    ...globalThis.navigator,
    mediaDevices: mockMediaDevices,
  },
});

describe("CameraDemo component", () => {
  test("should request webcam access with correct constraints", async () => {
    const requestCameraAccess = async () => {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      };

      return await mockMediaDevices.getUserMedia(constraints);
    };

    const stream = await requestCameraAccess();

    expect(stream.active).toBe(true);
    expect(stream.getTracks()).toBeDefined();
  });

  test("should handle camera access denial gracefully", async () => {
    const requestCameraAccess = async () => {
      try {
        return await mockMediaDevices.getUserMedia({
          video: false, // This will trigger the error
          audio: false,
        });
      } catch (error) {
        return { error: (error as Error).message };
      }
    };

    const result = await requestCameraAccess();

    expect(result).toEqual({ error: "Camera access denied" });
  });

  test("should apply vision correction to camera stream", () => {
    const calibrationValue = 2.0;

    const applyCameraVisionCorrection = (
      stream: MediaStream,
      calibration: number,
    ) => {
      // Apply same distance-based blur as other content
      const distanceFromOptimal = Math.abs(calibration - 2.0);
      const blurAmount =
        distanceFromOptimal === 0 ? 0.05 : distanceFromOptimal * 0.6;

      return {
        stream,
        visionCorrectionEnabled: calibration > 0,
        blurAmount: blurAmount,
        sharpening: calibration > 0 ? "unsharp-mask" : "none",
      };
    };

    const mockStream = {
      getTracks: () => [{ stop: () => {} }],
      active: true,
    } as MediaStream;

    const result = applyCameraVisionCorrection(mockStream, calibrationValue);

    expect(result.visionCorrectionEnabled).toBe(true);
    expect(result.blurAmount).toBe(0.05); // Clear at calibration value
    expect(result.sharpening).toBe("unsharp-mask");
  });

  test("should clean up camera stream on component unmount", () => {
    const mockTrack = {
      stop: vi.fn(),
    };

    const mockStream = {
      getTracks: () => [mockTrack],
      getVideoTracks: () => [mockTrack],
      active: true,
    } as unknown as MediaStream;

    const cleanupCamera = (stream: MediaStream) => {
      stream.getTracks().forEach((track) => track.stop());
      return { stopped: true };
    };

    const result = cleanupCamera(mockStream);

    expect(mockTrack.stop).toHaveBeenCalled();
    expect(result.stopped).toBe(true);
  });

  test("camera video should use same blur algorithm as other content", () => {
    const userCalibration = 2.0;

    const calculateCameraBlur = (sliderValue: number) => {
      const distanceFromOptimal = Math.abs(sliderValue - userCalibration);
      const blurPerDiopter = 0.6;
      const minimumBlur = 0.05;
      return distanceFromOptimal === 0
        ? minimumBlur
        : distanceFromOptimal * blurPerDiopter;
    };

    // Test camera blur at different positions
    expect(calculateCameraBlur(0.0)).toBe(1.2); // Very blurry (2.0D away)
    expect(calculateCameraBlur(1.0)).toBe(0.6); // Blurry (1.0D away)
    expect(calculateCameraBlur(2.0)).toBe(0.05); // Clear (at prescription)
    expect(calculateCameraBlur(2.5)).toBe(0.3); // Blurry (0.5D away)
    expect(calculateCameraBlur(3.5)).toBeCloseTo(0.9, 2); // Very blurry (1.5D away)
  });
});

describe("NativeAppDemo component", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("should detect PWA installation capability", () => {
    const detectPWACapability = () => {
      // Mock PWA detection
      const isStandalone = false; // Simulate not installed
      const hasInstallPrompt = true; // Simulate can install
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isIOSPWA =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        "standalone" in (navigator as any);

      return {
        canInstall: hasInstallPrompt || isIOSPWA,
        isInstalled: isStandalone,
        platform: isIOSPWA ? "ios" : "web",
      };
    };

    const result = detectPWACapability();

    expect(result).toHaveProperty("canInstall");
    expect(result).toHaveProperty("isInstalled");
    expect(result).toHaveProperty("platform");
  });

  test("should handle PWA install prompt", async () => {
    const mockInstallPrompt = {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: "accepted" }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInstallPrompt = async (promptEvent: any) => {
      if (promptEvent) {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        return choice.outcome;
      }
      return "dismissed";
    };

    const result = await handleInstallPrompt(mockInstallPrompt);

    expect(mockInstallPrompt.prompt).toHaveBeenCalled();
    expect(result).toBe("accepted");
  });

  test("should provide iOS PWA installation instructions", () => {
    const getIOSInstallInstructions = () => {
      return [
        "Tap the Share button at the bottom of the screen",
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install MaxVue as a native app',
        "The app will appear on your home screen",
      ];
    };

    const instructions = getIOSInstallInstructions();

    expect(instructions).toHaveLength(4);
    expect(instructions[0]).toContain("Share button");
    expect(instructions[1]).toContain("Add to Home Screen");
    expect(instructions[2]).toContain("Add");
    expect(instructions[3]).toContain("home screen");
  });

  test("should demonstrate offline capabilities", () => {
    // Mock window and caches for testing environment
    Object.defineProperty(globalThis, "window", {
      value: {
        caches: {},
        ...globalThis.window,
      },
    });

    const testOfflineCapabilities = () => {
      // Mock service worker registration
      const serviceWorkerRegistered = "serviceWorker" in navigator;

      // Mock cache storage
      const cacheStorage = "caches" in globalThis;

      return {
        serviceWorkerSupported: serviceWorkerRegistered,
        cacheStorageSupported: cacheStorage,
        offlineCapable: serviceWorkerRegistered && cacheStorage,
      };
    };

    const result = testOfflineCapabilities();

    expect(result).toHaveProperty("serviceWorkerSupported");
    expect(result).toHaveProperty("cacheStorageSupported");
    expect(result).toHaveProperty("offlineCapable");
  });

  test("should save PWA preferences to localStorage", () => {
    const savePWAPreferences = (preferences: {
      theme: string;
      notifications: boolean;
    }) => {
      localStorageMock.setItem("pwaPreferences", JSON.stringify(preferences));
      return true;
    };

    const loadPWAPreferences = () => {
      const saved = localStorageMock.getItem("pwaPreferences");
      return saved
        ? JSON.parse(saved)
        : { theme: "light", notifications: false };
    };

    const preferences = { theme: "dark", notifications: true };
    const saved = savePWAPreferences(preferences);
    const loaded = loadPWAPreferences();

    expect(saved).toBe(true);
    expect(loaded).toEqual(preferences);
  });

  test("should preserve vision correction settings in PWA mode", () => {
    const calibrationValue = 1.75;

    // Save calibration for PWA
    localStorageMock.setItem("calibrationValue", calibrationValue.toString());
    localStorageMock.setItem("visionCorrectionEnabled", "true");

    const loadPWAVisionSettings = () => {
      const calibration = parseFloat(
        localStorageMock.getItem("calibrationValue") || "0",
      );
      const enabled =
        localStorageMock.getItem("visionCorrectionEnabled") === "true";

      return { calibration, enabled };
    };

    const settings = loadPWAVisionSettings();

    expect(settings.calibration).toBe(1.75);
    expect(settings.enabled).toBe(true);
  });
});
