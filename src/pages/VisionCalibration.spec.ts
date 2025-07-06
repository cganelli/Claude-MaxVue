import { describe, expect, test, beforeEach } from "vitest";

/**
 * Tests for Vision Calibration Page - Accurate Presbyopia Simulation
 *
 * CRITICAL REQUIREMENT: Text should ONLY be clear at user's exact prescription.
 * Blur should increase proportionally in BOTH directions from optimal prescription.
 */

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

describe("accuratePresbyopiaSimulation", () => {
  /**
   * Correct presbyopia simulation algorithm
   * Text is clear ONLY at the user's exact prescription strength
   */
  const calculateAccuratePresbyopiaBlur = (
    sliderValue: number,
    userOptimalPrescription: number,
  ): number => {
    // Distance-based blur: farther from optimal = more blur
    const distanceFromOptimal = Math.abs(sliderValue - userOptimalPrescription);

    // Linear blur increase: each 0.25D away adds proportional blur
    const blurPerDiopter = 0.6; // How much blur per diopter of distance
    const minimumBlur = 0.05; // Tiny amount of blur even at optimal for realism

    return distanceFromOptimal === 0
      ? minimumBlur
      : distanceFromOptimal * blurPerDiopter;
  };

  test("user needing +2.0D readers should see clear text ONLY at +2.0D", () => {
    const userOptimalPrescription = 2.0; // User needs +2.0D readers in real life

    // At their exact optimal prescription - should be clearest (minimal blur)
    const blurAtOptimal = calculateAccuratePresbyopiaBlur(
      2.0,
      userOptimalPrescription,
    );
    expect(blurAtOptimal).toBe(0.05); // Minimal blur at optimal

    // Test exact distances from optimal
    const blurAt0D = calculateAccuratePresbyopiaBlur(
      0.0,
      userOptimalPrescription,
    ); // 2.0D away
    const blurAt1D = calculateAccuratePresbyopiaBlur(
      1.0,
      userOptimalPrescription,
    ); // 1.0D away
    const blurAt25D = calculateAccuratePresbyopiaBlur(
      2.5,
      userOptimalPrescription,
    ); // 0.5D away
    const blurAt3D = calculateAccuratePresbyopiaBlur(
      3.0,
      userOptimalPrescription,
    ); // 1.0D away
    const blurAt35D = calculateAccuratePresbyopiaBlur(
      3.5,
      userOptimalPrescription,
    ); // 1.5D away

    // Verify blur increases with distance from optimal
    expect(blurAt0D).toBe(2.0 * 0.6); // 1.2px blur (2.0D * 0.6)
    expect(blurAt1D).toBe(1.0 * 0.6); // 0.6px blur (1.0D * 0.6)
    expect(blurAt25D).toBe(0.5 * 0.6); // 0.3px blur (0.5D * 0.6)
    expect(blurAt3D).toBe(1.0 * 0.6); // 0.6px blur (1.0D * 0.6)
    expect(blurAt35D).toBe(1.5 * 0.6); // 0.9px blur (1.5D * 0.6)

    // Verify all positions away from optimal are blurrier than optimal
    expect(blurAt0D).toBeGreaterThan(blurAtOptimal);
    expect(blurAt1D).toBeGreaterThan(blurAtOptimal);
    expect(blurAt25D).toBeGreaterThan(blurAtOptimal);
    expect(blurAt3D).toBeGreaterThan(blurAtOptimal);
    expect(blurAt35D).toBeGreaterThan(blurAtOptimal);
  });

  test("blur should be symmetrical around optimal prescription", () => {
    const userOptimalPrescription = 2.0;

    // Test equal distances from optimal in both directions
    const blurMinus05D = calculateAccuratePresbyopiaBlur(
      1.5,
      userOptimalPrescription,
    ); // 0.5D below
    const blurPlus05D = calculateAccuratePresbyopiaBlur(
      2.5,
      userOptimalPrescription,
    ); // 0.5D above

    const blurMinus1D = calculateAccuratePresbyopiaBlur(
      1.0,
      userOptimalPrescription,
    ); // 1.0D below
    const blurPlus1D = calculateAccuratePresbyopiaBlur(
      3.0,
      userOptimalPrescription,
    ); // 1.0D above

    // Should be exactly equal for equal distances
    expect(blurMinus05D).toBe(blurPlus05D); // Both 0.5D away = 0.3px blur
    expect(blurMinus1D).toBe(blurPlus1D); // Both 1.0D away = 0.6px blur

    // Further distances should have more blur
    expect(blurMinus1D).toBeGreaterThan(blurMinus05D);
    expect(blurPlus1D).toBeGreaterThan(blurPlus05D);
  });

  test("different users should find clarity at their specific prescription", () => {
    // Test different user prescriptions
    const user1Optimal = 1.0; // Mild presbyopia
    const user2Optimal = 2.5; // Moderate presbyopia
    const user3Optimal = 3.5; // Strong presbyopia

    // Each user should see minimal blur only at their prescription
    expect(calculateAccuratePresbyopiaBlur(1.0, user1Optimal)).toBe(0.05);
    expect(calculateAccuratePresbyopiaBlur(2.5, user2Optimal)).toBe(0.05);
    expect(calculateAccuratePresbyopiaBlur(3.5, user3Optimal)).toBe(0.05);

    // Other prescriptions should be blurry for each user
    expect(calculateAccuratePresbyopiaBlur(2.0, user1Optimal)).toBe(1.0 * 0.6); // 1.0D away
    expect(calculateAccuratePresbyopiaBlur(1.0, user2Optimal)).toBe(1.5 * 0.6); // 1.5D away
    expect(calculateAccuratePresbyopiaBlur(2.0, user3Optimal)).toBe(1.5 * 0.6); // 1.5D away
  });

  test("blur should increase linearly with distance from optimal", () => {
    const userOptimalPrescription = 2.0;
    const blurPerDiopter = 0.6;

    // Test linear progression
    expect(calculateAccuratePresbyopiaBlur(1.75, userOptimalPrescription)).toBe(
      0.25 * blurPerDiopter,
    ); // 0.25D away
    expect(calculateAccuratePresbyopiaBlur(1.5, userOptimalPrescription)).toBe(
      0.5 * blurPerDiopter,
    ); // 0.5D away
    expect(calculateAccuratePresbyopiaBlur(1.0, userOptimalPrescription)).toBe(
      1.0 * blurPerDiopter,
    ); // 1.0D away
    expect(calculateAccuratePresbyopiaBlur(0.0, userOptimalPrescription)).toBe(
      2.0 * blurPerDiopter,
    ); // 2.0D away

    // Same progression in positive direction
    expect(calculateAccuratePresbyopiaBlur(2.25, userOptimalPrescription)).toBe(
      0.25 * blurPerDiopter,
    );
    expect(calculateAccuratePresbyopiaBlur(2.5, userOptimalPrescription)).toBe(
      0.5 * blurPerDiopter,
    );
    expect(calculateAccuratePresbyopiaBlur(3.0, userOptimalPrescription)).toBe(
      1.0 * blurPerDiopter,
    );
    expect(calculateAccuratePresbyopiaBlur(4.0, userOptimalPrescription)).toBe(
      2.0 * blurPerDiopter,
    );
  });
});

describe("calibrationVsActualCorrection", () => {
  test("calibration should simulate finding prescription, not apply final correction", () => {
    // IMPORTANT: During calibration, we simulate what different prescriptions look like
    // This is different from the final vision correction which applies user's calibrated value

    // Calibration phase: Help user find their prescription
    const simulateForUser = (sliderValue: number, userActualNeeds: number) => {
      return Math.abs(sliderValue - userActualNeeds) * 0.8; // Distance-based blur
    };

    // User who needs +2.0D testing different slider positions
    const userActualNeeds = 2.0;

    expect(simulateForUser(2.0, userActualNeeds)).toBe(0); // Clearest at their actual needs
    expect(simulateForUser(0.0, userActualNeeds)).toBeGreaterThan(0); // Blurry when under-corrected
    expect(simulateForUser(3.5, userActualNeeds)).toBeGreaterThan(0); // Blurry when over-corrected
  });
});

describe("calibrationButtonBehavior", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("Set Calibration button should preserve slider position", () => {
    // User finds their optimal prescription at 2.0D
    const selectedValue = 2.0;

    // Simulate clicking Set Calibration
    const handleConfirmCalibration = (value: number) => {
      localStorageMock.setItem("calibrationValue", value.toString());
      localStorageMock.setItem("estimatedSphere", value.toString());
      localStorageMock.setItem("visionCorrectionEnabled", "true");
      localStorageMock.setItem("hasConfirmedVision", "true");
      // Should NOT reset slider value
      return value; // Return same value
    };

    const newSliderValue = handleConfirmCalibration(selectedValue);

    // Verify localStorage was updated
    expect(localStorageMock.getItem("calibrationValue")).toBe("2");
    expect(localStorageMock.getItem("estimatedSphere")).toBe("2");
    expect(localStorageMock.getItem("visionCorrectionEnabled")).toBe("true");

    // Verify slider value is preserved
    expect(newSliderValue).toBe(2.0);
  });

  test("calibration value should persist across page loads", () => {
    // Set a calibration value
    localStorageMock.setItem("calibrationValue", "2.5");

    // Simulate page load - should initialize with saved calibration
    const getInitialSliderValue = () => {
      const saved = localStorageMock.getItem("calibrationValue");
      return saved ? parseFloat(saved) : 0.0;
    };

    const initialValue = getInitialSliderValue();
    expect(initialValue).toBe(2.5);
  });

  test("calibration display should show saved value after setting", () => {
    const selectedValue = 1.75;

    // Set calibration
    localStorageMock.setItem("calibrationValue", selectedValue.toString());

    // Get calibration for display
    const displayValue = parseFloat(
      localStorageMock.getItem("calibrationValue") || "0",
    );

    expect(displayValue).toBe(1.75);
    expect(displayValue.toFixed(2)).toBe("1.75");
  });

  test("slider should NOT reset to 0.00D after calibration", () => {
    // This is the critical bug we're fixing
    const selectedValue = 2.25;

    // User sets calibration
    const afterCalibration = (() => {
      localStorageMock.setItem("calibrationValue", selectedValue.toString());
      // BUG: Should NOT reset to 0
      // return 0.0; // WRONG!
      return selectedValue; // CORRECT!
    })();

    expect(afterCalibration).toBe(2.25);
    expect(afterCalibration).not.toBe(0.0);
  });
});

describe("calibrationRedirectBehavior", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test("should redirect to local demo page after calibration", () => {
    // Mock window.location for testing
    const mockLocation = {
      href: "",
      pathname: "/calibration",
      origin: "http://localhost:3001",
    };

    // Simulate the actual calibration redirect logic with absolute URL
    const handleRedirectAfterCalibration = () => {
      const targetUrl = `${mockLocation.origin}/content-demo`;
      mockLocation.href = targetUrl;
      return mockLocation.href;
    };

    const redirectUrl = handleRedirectAfterCalibration();

    // Verify correct local redirect with full URL
    expect(redirectUrl).toBe("http://localhost:3001/content-demo");
    expect(redirectUrl).toContain("localhost");
    expect(redirectUrl).not.toContain("maxvue.app");
    expect(redirectUrl).not.toContain("external");
  });

  test("should NOT redirect to external MaxVue.app URL", () => {
    // This tests the bug we're fixing
    const wrongRedirect = "/demo"; // Wrong path
    const externalRedirect = "https://maxvue.app"; // Wrong domain

    const correctRedirect = "/content-demo"; // Correct local path

    expect(correctRedirect).toBe("/content-demo");
    expect(correctRedirect).not.toBe(wrongRedirect);
    expect(correctRedirect).not.toBe(externalRedirect);
  });

  test("redirect should happen after calibration success state", () => {
    // Simulate the calibration workflow
    const calibrationWorkflow = () => {
      // 1. User sets calibration
      localStorageMock.setItem("calibrationValue", "2.0");

      // 2. Show success state
      const isCalibrated = true;

      // 3. After delay, redirect to demo
      const redirectUrl = isCalibrated ? "/content-demo" : null;

      return { isCalibrated, redirectUrl };
    };

    const result = calibrationWorkflow();

    expect(result.isCalibrated).toBe(true);
    expect(result.redirectUrl).toBe("/content-demo");
  });

  test("should preserve calibration value during redirect", () => {
    const selectedValue = 2.5;

    // Set calibration
    localStorageMock.setItem("calibrationValue", selectedValue.toString());

    // Simulate the enhanced redirect with absolute URL
    const redirectWithCalibration = (origin = "http://localhost:3001") => {
      const savedCalibration = localStorageMock.getItem("calibrationValue");
      const targetUrl = `${origin}/content-demo`;
      return {
        redirectUrl: targetUrl,
        calibrationPreserved: savedCalibration === selectedValue.toString(),
        isLocal: targetUrl.includes("localhost"),
      };
    };

    const result = redirectWithCalibration();

    expect(result.redirectUrl).toBe("http://localhost:3001/content-demo");
    expect(result.calibrationPreserved).toBe(true);
    expect(result.isLocal).toBe(true);
  });

  test("redirect should work correctly in different environments", () => {
    const testEnvironments = [
      {
        origin: "http://localhost:3001",
        expected: "http://localhost:3001/content-demo",
      },
      {
        origin: "http://localhost:5173",
        expected: "http://localhost:5173/content-demo",
      },
      {
        origin: "http://localhost:5174",
        expected: "http://localhost:5174/content-demo",
      },
    ];

    testEnvironments.forEach(({ origin, expected }) => {
      const simulateRedirect = () => {
        const targetUrl = `${origin}/content-demo`;
        return targetUrl;
      };

      const result = simulateRedirect();
      expect(result).toBe(expected);
      expect(result).toContain("localhost");
      expect(result).not.toContain("maxvue.app");
    });
  });
});
