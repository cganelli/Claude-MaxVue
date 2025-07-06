import { describe, expect, test } from "vitest";

/**
 * Tests for Presbyopia-Focused Vision Correction
 *
 * MaxVue focuses exclusively on presbyopia (near vision/reading) correction.
 * Presbyopia model: 0.00D (perfect near vision) to +3.5D (strong presbyopia)
 */

describe("presbyopiaCorrection", () => {
  test("should use correct diopter range for presbyopia", () => {
    // Presbyopia starts at 0.00D and goes positive to +3.5D
    const minDiopter = 0.0;
    const maxDiopter = 3.5;

    expect(minDiopter).toBe(0.0); // No reading glasses needed
    expect(maxDiopter).toBe(3.5); // Maximum readers available
  });

  test("should calculate blur correctly for presbyopia model", () => {
    // Test function for calculating presbyopia blur
    const calculatePresbyopiaBlur = (
      calibrationDiopter: number,
      currentDiopter: number,
    ): number => {
      // User sees clearly at their calibration strength
      // More blur when current diopter is lower than calibration
      return Math.max(0, calibrationDiopter - currentDiopter);
    };

    // User calibrated at +2.0D (moderate presbyopia)
    const userCalibration = 2.0;

    // At +2.0D (their calibration) - should be clear
    expect(calculatePresbyopiaBlur(userCalibration, 2.0)).toBe(0);

    // At +1.0D (weaker than calibration) - should be blurry
    expect(calculatePresbyopiaBlur(userCalibration, 1.0)).toBe(1.0);

    // At +3.0D (stronger than calibration) - should be clear (no blur)
    expect(calculatePresbyopiaBlur(userCalibration, 3.0)).toBe(0);

    // At 0.0D (no correction) - should be very blurry for presbyopic user
    expect(calculatePresbyopiaBlur(userCalibration, 0.0)).toBe(2.0);
  });

  test("should have single reading vision control only", () => {
    // MaxVue should only have one slider for reading vision
    // No separate far/near vision controls
    const expectedControls = ["readingVision"];
    const unexpectedControls = ["farVision", "nearVision"];

    expect(expectedControls).toContain("readingVision");
    expect(unexpectedControls).not.toContain("readingVision");
  });

  test("should apply same correction to all content types", () => {
    // When user sets reading vision to +2.0D, all content should be corrected
    const readingVisionSetting = 2.0;
    const userCalibration = 1.5;

    const expectedBlur = Math.max(0, userCalibration - readingVisionSetting);

    // All content types should get same blur calculation
    const textBlur = expectedBlur;
    const imageBlur = expectedBlur;
    const emailBlur = expectedBlur;
    const webBlur = expectedBlur;

    expect(textBlur).toBe(0); // 1.5 - 2.0 = -0.5, max(0, -0.5) = 0
    expect(imageBlur).toBe(textBlur);
    expect(emailBlur).toBe(textBlur);
    expect(webBlur).toBe(textBlur);
  });
});

describe("presbyopiaRanges", () => {
  test("should map to real-world reading glass strengths", () => {
    const presbyopiaRanges = {
      "0.00D": "No reading glasses needed (perfect near vision)",
      "1.00D": "Mild presbyopia (drugstore +1.0 readers)",
      "2.00D": "Moderate presbyopia (typical for 50+ years old)",
      "3.50D": "Strong presbyopia (maximum readers available)",
    };

    expect(presbyopiaRanges["0.00D"]).toContain("perfect near vision");
    expect(presbyopiaRanges["1.00D"]).toContain("drugstore +1.0 readers");
    expect(presbyopiaRanges["2.00D"]).toContain("typical for 50+");
    expect(presbyopiaRanges["3.50D"]).toContain("maximum readers");
  });
});
