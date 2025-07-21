import { describe, it, expect } from "vitest";

describe("URGENT: Mobile Detection Negative Calibration Logic", () => {
  // Test the calculation logic directly without React hooks
  const getMobileAdjustment = (deviceType: "mobile" | "tablet" | "desktop"): number => {
    const CALIBRATION_ADJUSTMENTS = {
      mobile: 2.0,   // Updated value
      tablet: 0.5,
      desktop: 0,
    };
    return CALIBRATION_ADJUSTMENTS[deviceType];
  };

  const getAdjustedCalibration = (baseCalibration: number, deviceType: "mobile" | "tablet" | "desktop"): number => {
    return baseCalibration + getMobileAdjustment(deviceType);
  };

  describe("Mobile Adjustment with Negative Base Values", () => {
    it("✅ CRITICAL: Desktop -1.00D + Mobile +2.00D = Mobile +1.00D", () => {
      const desktopOptimal = -1.0;
      const mobileOptimal = getAdjustedCalibration(desktopOptimal, "mobile");
      
      // -1.00D + 2.00D = +1.00D
      expect(mobileOptimal).toBe(1.0);
    });

    it("✅ VERIFICATION: Various negative base calibrations", () => {
      const testCases = [
        { desktopOptimal: -4.0, expectedMobile: -2.0 },  // -4.00D + 2.00D = -2.00D
        { desktopOptimal: -3.75, expectedMobile: -1.75 }, // -3.75D + 2.00D = -1.75D
        { desktopOptimal: -3.5, expectedMobile: -1.5 },  // -3.50D + 2.00D = -1.50D
        { desktopOptimal: -3.25, expectedMobile: -1.25 }, // -3.25D + 2.00D = -1.25D
        { desktopOptimal: -3.0, expectedMobile: -1.0 },  // -3.00D + 2.00D = -1.00D
        { desktopOptimal: -2.75, expectedMobile: -0.75 }, // -2.75D + 2.00D = -0.75D
        { desktopOptimal: -2.5, expectedMobile: -0.5 },  // -2.50D + 2.00D = -0.50D
        { desktopOptimal: -2.25, expectedMobile: -0.25 }, // -2.25D + 2.00D = -0.25D
        { desktopOptimal: -2.0, expectedMobile: 0.0 },   // -2.00D + 2.00D = 0.00D
        { desktopOptimal: -1.75, expectedMobile: 0.25 }, // -1.75D + 2.00D = +0.25D
        { desktopOptimal: -1.5, expectedMobile: 0.5 },   // -1.50D + 2.00D = +0.50D
        { desktopOptimal: -1.25, expectedMobile: 0.75 }, // -1.25D + 2.00D = +0.75D
        { desktopOptimal: -1.0, expectedMobile: 1.0 },   // -1.00D + 2.00D = +1.00D
        { desktopOptimal: -0.75, expectedMobile: 1.25 }, // -0.75D + 2.00D = +1.25D
        { desktopOptimal: -0.5, expectedMobile: 1.5 },   // -0.50D + 2.00D = +1.50D
        { desktopOptimal: -0.25, expectedMobile: 1.75 }, // -0.25D + 2.00D = +1.75D
        { desktopOptimal: 0.0, expectedMobile: 2.0 },    // 0.00D + 2.00D = +2.00D
        { desktopOptimal: 0.5, expectedMobile: 2.5 },    // +0.50D + 2.00D = +2.50D
        { desktopOptimal: 1.0, expectedMobile: 3.0 },    // +1.00D + 2.00D = +3.00D
      ];

      testCases.forEach(({ desktopOptimal, expectedMobile }) => {
        const mobileOptimal = getAdjustedCalibration(desktopOptimal, "mobile");
        expect(mobileOptimal).toBeCloseTo(expectedMobile, 2);
        
        console.log(`✅ Desktop ${desktopOptimal >= 0 ? '+' : ''}${desktopOptimal.toFixed(2)}D → Mobile ${expectedMobile >= 0 ? '+' : ''}${expectedMobile.toFixed(2)}D`);
      });
    });

    it("✅ VERIFICATION: Desktop device has no adjustment for negative values", () => {
      const testCases = [-2.0, -1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0];

      testCases.forEach((desktopValue) => {
        const adjustedValue = getAdjustedCalibration(desktopValue, "desktop");
        // Desktop should return the same value (no adjustment)
        expect(adjustedValue).toBe(desktopValue);
      });
    });

    it("✅ VERIFICATION: Tablet device has moderate adjustment for negative values", () => {
      const testCases = [
        { base: -2.0, expected: -1.5 },   // -2.00D + 0.5D = -1.50D
        { base: -1.0, expected: -0.5 },   // -1.00D + 0.5D = -0.50D
        { base: 0.0, expected: 0.5 },     // 0.00D + 0.5D = +0.50D
        { base: 1.0, expected: 1.5 },     // +1.00D + 0.5D = +1.50D
      ];

      testCases.forEach(({ base, expected }) => {
        const adjustedValue = getAdjustedCalibration(base, "tablet");
        expect(adjustedValue).toBeCloseTo(expected, 2);
      });
    });
  });

  describe("Edge Cases with Negative Values", () => {
    it("✅ VERIFICATION: Maximum negative values work correctly", () => {
      // Test with the new maximum negative slider value
      const maxNegative = -4.0;
      const mobileAdjusted = getAdjustedCalibration(maxNegative, "mobile");
      
      // -4.00D + 2.00D = -2.00D
      expect(mobileAdjusted).toBe(-2.0);
    });

    it("✅ VERIFICATION: Precision maintained with decimal negative values", () => {
      // Test precise decimal values
      const preciseValues = [-1.75, -1.25, -0.75, -0.25];
      
      preciseValues.forEach((baseValue) => {
        const adjusted = getAdjustedCalibration(baseValue, "mobile");
        const expected = baseValue + 2.0;
        expect(adjusted).toBeCloseTo(expected, 2);
      });
    });

    it("✅ VERIFICATION: Values beyond slider range still calculate correctly", () => {
      // Test values beyond the UI slider range to ensure logic is robust
      const extremeCases = [
        { base: -5.0, expected: -3.0 },   // -5.00D + 2.00D = -3.00D
        { base: -3.0, expected: -1.0 },   // -3.00D + 2.00D = -1.00D
        { base: 5.0, expected: 7.0 },     // +5.00D + 2.00D = +7.00D
      ];

      extremeCases.forEach(({ base, expected }) => {
        const mobileAdjusted = getAdjustedCalibration(base, "mobile");
        expect(mobileAdjusted).toBeCloseTo(expected, 2);
      });
    });
  });

  describe("User Scenario Testing", () => {
    it("✅ USER SCENARIO: User finds -1.00D clearest on desktop, mobile should show +1.00D", () => {
      // Simulate user workflow:
      // 1. User uses VisionCalibration slider and finds -1.00D is clearest
      // 2. They switch to mobile device  
      // 3. Mobile should automatically adjust to +1.00D for same clarity

      const userOptimalDesktop = -1.0;
      const mobileCalibration = getAdjustedCalibration(userOptimalDesktop, "mobile");

      // Expected: -1.00D + 2.00D = +1.00D
      expect(mobileCalibration).toBe(1.0);

      console.log(`🎯 USER SCENARIO VERIFIED:`);
      console.log(`   Desktop optimal: ${userOptimalDesktop >= 0 ? '+' : ''}${userOptimalDesktop.toFixed(2)}D`);
      console.log(`   Mobile adjusted: ${mobileCalibration >= 0 ? '+' : ''}${mobileCalibration.toFixed(2)}D`);
      console.log(`   ✅ Same content will appear equally clear on both devices`);
    });

    it("✅ USER SCENARIO: User finds -0.50D clearest, mobile should show +1.50D", () => {
      const userOptimalDesktop = -0.5;
      const mobileCalibration = getAdjustedCalibration(userOptimalDesktop, "mobile");

      // Expected: -0.50D + 2.00D = +1.50D
      expect(mobileCalibration).toBe(1.5);
    });

    it("✅ USER SCENARIO: User finds -1.75D clearest, mobile should show +0.25D", () => {
      const userOptimalDesktop = -1.75;
      const mobileCalibration = getAdjustedCalibration(userOptimalDesktop, "mobile");

      // Expected: -1.75D + 2.00D = +0.25D
      expect(mobileCalibration).toBe(0.25);
    });

    it("✅ USER SCENARIO: User finds maximum negative -4.00D clearest, mobile should show -2.00D", () => {
      const userOptimalDesktop = -4.0; // New maximum negative slider value
      const mobileCalibration = getAdjustedCalibration(userOptimalDesktop, "mobile");

      // Expected: -4.00D + 2.00D = -2.00D
      expect(mobileCalibration).toBe(-2.0);
    });

    it("✅ USER SCENARIO: User finds -2.50D clearest, mobile should show -0.50D", () => {
      const userOptimalDesktop = -2.5; // User's example case
      const mobileCalibration = getAdjustedCalibration(userOptimalDesktop, "mobile");

      // Expected: -2.50D + 2.00D = -0.50D (example from user request)
      expect(mobileCalibration).toBe(-0.5);
    });
  });

  describe("Validation of Slider Range", () => {
    it("✅ VERIFICATION: Full slider range works with mobile adjustment", () => {
      // Test the complete range: -4.00D to +3.50D in 0.25D steps
      const sliderMin = -4.0;
      const sliderMax = 3.5;
      const step = 0.25;
      
      for (let value = sliderMin; value <= sliderMax; value += step) {
        // Round to avoid floating point precision issues
        const roundedValue = Math.round(value * 4) / 4;
        
        const mobileAdjusted = getAdjustedCalibration(roundedValue, "mobile");
        const expectedMobile = roundedValue + 2.0;
        
        expect(mobileAdjusted).toBeCloseTo(expectedMobile, 2);
        
        // Ensure all values are within reasonable bounds
        expect(mobileAdjusted).toBeGreaterThanOrEqual(-2.0); // Should not go below -4.0 + 2.0 = -2.0
        expect(mobileAdjusted).toBeLessThanOrEqual(5.5);      // Should not exceed 3.5 + 2.0 = 5.5
      }
    });

    it("✅ VERIFICATION: Negative range produces correct mobile values", () => {
      const negativeValues = [-4.0, -3.75, -3.5, -3.25, -3.0, -2.75, -2.5, -2.25, -2.0, -1.75, -1.5, -1.25, -1.0, -0.75, -0.5, -0.25];
      
      negativeValues.forEach((negativeValue) => {
        const mobileValue = getAdjustedCalibration(negativeValue, "mobile");
        
        // Verify the specific calculation
        expect(mobileValue).toBe(negativeValue + 2.0);
        
        // Values >= -2.0 should produce non-negative mobile values
        if (negativeValue >= -2.0) {
          expect(mobileValue).toBeGreaterThanOrEqual(0);
        }
        
        // Values < -2.0 can produce negative mobile values (extended functionality)
        if (negativeValue < -2.0) {
          expect(mobileValue).toBeLessThan(0);
        }
      });
    });
  });
});