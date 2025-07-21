import { describe, it, expect } from "vitest";
import {
  userToInternalScale,
  internalToUserScale,
  applyMobileAdjustment,
  getUserScaleDescription,
  isValidUserScale,
  isValidInternalScale,
  roundToDiopter,
  calculateCalibrationValues,
  CALIBRATION_CONSTANTS,
} from "./calibrationMapping";

describe("Calibration Scale Mapping System", () => {
  describe("Scale Conversion Functions", () => {
    it("✅ userToInternalScale: converts user scale to internal scale", () => {
      const testCases = [
        { user: 0.0, internal: -4.0, description: "No reading glasses (user 0.00D = internal -4.00D)" },
        { user: 1.0, internal: -3.0, description: "Very mild presbyopia" },
        { user: 2.0, internal: -2.0, description: "Mild presbyopia (+2.00D glasses prescription)" },
        { user: 3.0, internal: -1.0, description: "Moderate presbyopia" },
        { user: 4.0, internal: 0.0, description: "Desktop baseline" },
        { user: 5.0, internal: 1.0, description: "Strong presbyopia" },
        { user: 6.0, internal: 2.0, description: "Very strong presbyopia" },
        { user: 7.5, internal: 3.5, description: "Maximum presbyopia" },
      ];

      testCases.forEach(({ user, internal, description }) => {
        const result = userToInternalScale(user);
        expect(result).toBe(internal);
        console.log(`✅ ${description}: User ${user >= 0 ? '+' : ''}${user.toFixed(2)}D → Internal ${internal >= 0 ? '+' : ''}${internal.toFixed(2)}D`);
      });
    });

    it("✅ internalToUserScale: converts internal scale to user scale", () => {
      const testCases = [
        { internal: -4.0, user: 0.0, description: "Maximum negative internal" },
        { internal: -3.0, user: 1.0, description: "High negative internal" },
        { internal: -2.0, user: 2.0, description: "Moderate negative internal" },
        { internal: -1.0, user: 3.0, description: "Mild negative internal" },
        { internal: 0.0, user: 4.0, description: "Baseline internal" },
        { internal: 1.0, user: 5.0, description: "Positive internal" },
        { internal: 2.0, user: 6.0, description: "High positive internal" },
        { internal: 3.5, user: 7.5, description: "Maximum positive internal" },
      ];

      testCases.forEach(({ internal, user, description }) => {
        const result = internalToUserScale(internal);
        expect(result).toBe(user);
        console.log(`✅ ${description}: Internal ${internal >= 0 ? '+' : ''}${internal.toFixed(2)}D → User +${user.toFixed(2)}D`);
      });
    });

    it("✅ Round-trip conversion: user → internal → user", () => {
      const userValues = [0.0, 0.25, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0, 6.0, 7.0, 7.5];
      
      userValues.forEach((originalUser) => {
        const internal = userToInternalScale(originalUser);
        const backToUser = internalToUserScale(internal);
        expect(backToUser).toBeCloseTo(originalUser, 2);
      });
    });
  });

  describe("Mobile Adjustment Logic", () => {
    it("✅ applyMobileAdjustment: adds +2.00D for viewing distance", () => {
      const testCases = [
        { desktop: -4.0, mobile: -2.0, description: "Maximum negative desktop" },
        { desktop: -3.0, mobile: -1.0, description: "High negative desktop" },
        { desktop: -2.0, mobile: 0.0, description: "Moderate negative desktop" },
        { desktop: -1.0, mobile: 1.0, description: "Mild negative desktop" },
        { desktop: 0.0, mobile: 2.0, description: "Baseline desktop" },
        { desktop: 1.0, mobile: 3.0, description: "Positive desktop" },
        { desktop: 3.5, mobile: 5.5, description: "Maximum positive desktop" },
      ];

      testCases.forEach(({ desktop, mobile, description }) => {
        const result = applyMobileAdjustment(desktop);
        expect(result).toBe(mobile);
        console.log(`✅ ${description}: ${desktop >= 0 ? '+' : ''}${desktop.toFixed(2)}D → ${mobile >= 0 ? '+' : ''}${mobile.toFixed(2)}D`);
      });
    });

    it("✅ Mobile adjustment constant is +2.00D", () => {
      expect(CALIBRATION_CONSTANTS.MOBILE_ADJUSTMENT).toBe(2.0);
    });
  });

  describe("User Experience Mappings", () => {
    it("✅ Key user experience scenarios", () => {
      const scenarios = [
        {
          userDesktop: 0.0,
          expectedInternalDesktop: -4.0,
          expectedInternalMobile: -2.0,
          expectedUserMobile: 2.0,
          description: "No glasses needed on desktop, +2.00D effective on mobile"
        },
        {
          userDesktop: 2.0,
          expectedInternalDesktop: -2.0,
          expectedInternalMobile: 0.0,
          expectedUserMobile: 4.0,
          description: "+2.00D glasses prescription, desktop baseline on mobile"
        },
        {
          userDesktop: 4.0,
          expectedInternalDesktop: 0.0,
          expectedInternalMobile: 2.0,
          expectedUserMobile: 6.0,
          description: "Desktop baseline, strong correction on mobile"
        },
      ];

      scenarios.forEach(({ userDesktop, expectedInternalDesktop, expectedInternalMobile, expectedUserMobile, description }) => {
        const internalDesktop = userToInternalScale(userDesktop);
        const internalMobile = applyMobileAdjustment(internalDesktop);
        const userMobile = internalToUserScale(internalMobile);

        expect(internalDesktop).toBe(expectedInternalDesktop);
        expect(internalMobile).toBe(expectedInternalMobile);
        expect(userMobile).toBe(expectedUserMobile);

        console.log(`✅ ${description}`);
        console.log(`   User Desktop: +${userDesktop.toFixed(2)}D → Internal Desktop: ${internalDesktop >= 0 ? '+' : ''}${internalDesktop.toFixed(2)}D`);
        console.log(`   Internal Mobile: ${internalMobile >= 0 ? '+' : ''}${internalMobile.toFixed(2)}D → User Mobile: +${userMobile.toFixed(2)}D`);
      });
    });
  });

  describe("Validation Functions", () => {
    it("✅ isValidUserScale: validates user scale bounds", () => {
      // Valid values
      expect(isValidUserScale(0.0)).toBe(true);
      expect(isValidUserScale(2.0)).toBe(true);
      expect(isValidUserScale(7.5)).toBe(true);
      
      // Invalid values
      expect(isValidUserScale(-0.1)).toBe(false);
      expect(isValidUserScale(7.6)).toBe(false);
      expect(isValidUserScale(-1.0)).toBe(false);
      expect(isValidUserScale(10.0)).toBe(false);
    });

    it("✅ isValidInternalScale: validates internal scale bounds", () => {
      // Valid values
      expect(isValidInternalScale(-4.0)).toBe(true);
      expect(isValidInternalScale(0.0)).toBe(true);
      expect(isValidInternalScale(3.5)).toBe(true);
      
      // Invalid values
      expect(isValidInternalScale(-4.1)).toBe(false);
      expect(isValidInternalScale(3.6)).toBe(false);
      expect(isValidInternalScale(-5.0)).toBe(false);
      expect(isValidInternalScale(5.0)).toBe(false);
    });

    it("✅ roundToDiopter: rounds to 0.25D precision", () => {
      expect(roundToDiopter(1.23)).toBe(1.25);
      expect(roundToDiopter(1.12)).toBe(1.0);
      expect(roundToDiopter(1.37)).toBe(1.25);
      expect(roundToDiopter(1.63)).toBe(1.75);
      expect(roundToDiopter(-2.13)).toBe(-2.25); // Rounds to nearest 0.25
      expect(roundToDiopter(-2.38)).toBe(-2.5);
    });
  });

  describe("Description Functions", () => {
    it("✅ getUserScaleDescription: provides user-friendly descriptions", () => {
      const testCases = [
        { value: 0.0, expected: "No reading glasses needed" },
        { value: 0.5, expected: "No reading glasses needed" },
        { value: 1.0, expected: "Very mild presbyopia" },
        { value: 2.0, expected: "Mild presbyopia" },
        { value: 3.0, expected: "Moderate presbyopia" },
        { value: 4.0, expected: "Strong presbyopia" },
        { value: 6.0, expected: "Very strong presbyopia" },
        { value: 7.5, expected: "Very strong presbyopia" },
      ];

      testCases.forEach(({ value, expected }) => {
        const description = getUserScaleDescription(value);
        expect(description).toBe(expected);
        console.log(`✅ +${value.toFixed(2)}D: ${description}`);
      });
    });
  });

  describe("Complete Calibration Workflow", () => {
    it("✅ calculateCalibrationValues: complete end-to-end calculation", () => {
      const testCases = [
        {
          userDesktop: 0.0,
          expectedInternalDesktop: -4.0,
          expectedInternalMobile: -2.0,
          expectedUserMobile: 2.0,
          expectedDesktopDesc: "No reading glasses needed",
          expectedMobileDesc: "Mild presbyopia",
        },
        {
          userDesktop: 2.0,
          expectedInternalDesktop: -2.0,
          expectedInternalMobile: 0.0,
          expectedUserMobile: 4.0,
          expectedDesktopDesc: "Mild presbyopia",
          expectedMobileDesc: "Strong presbyopia",
        },
        {
          userDesktop: 3.5,
          expectedInternalDesktop: -0.5,
          expectedInternalMobile: 1.5,
          expectedUserMobile: 5.5,
          expectedDesktopDesc: "Moderate presbyopia",
          expectedMobileDesc: "Very strong presbyopia",
        },
      ];

      testCases.forEach(({ 
        userDesktop, 
        expectedInternalDesktop, 
        expectedInternalMobile, 
        expectedUserMobile,
        expectedDesktopDesc,
        expectedMobileDesc 
      }) => {
        const result = calculateCalibrationValues(userDesktop);

        expect(result.userDesktop).toBe(userDesktop);
        expect(result.internalDesktop).toBe(expectedInternalDesktop);
        expect(result.internalMobile).toBe(expectedInternalMobile);
        expect(result.userMobile).toBe(expectedUserMobile);
        expect(result.desktopDescription).toBe(expectedDesktopDesc);
        expect(result.mobileDescription).toBe(expectedMobileDesc);
        expect(result.mobileAdjustment).toBe(2.0);

        console.log(`✅ Complete workflow for user +${userDesktop.toFixed(2)}D:`);
        console.log(`   Desktop: +${result.userDesktop.toFixed(2)}D (${result.desktopDescription})`);
        console.log(`   Mobile: +${result.userMobile.toFixed(2)}D (${result.mobileDescription})`);
        console.log(`   Internal Desktop: ${result.internalDesktop >= 0 ? '+' : ''}${result.internalDesktop.toFixed(2)}D`);
        console.log(`   Internal Mobile: ${result.internalMobile >= 0 ? '+' : ''}${result.internalMobile.toFixed(2)}D`);
      });
    });

    it("✅ calculateCalibrationValues: error handling for invalid inputs", () => {
      expect(() => calculateCalibrationValues(-1.0)).toThrow("Invalid user scale value");
      expect(() => calculateCalibrationValues(8.0)).toThrow("Invalid user scale value");
      expect(() => calculateCalibrationValues(10.0)).toThrow("Invalid user scale value");
    });
  });

  describe("Constants Verification", () => {
    it("✅ CALIBRATION_CONSTANTS: verify all constants are correct", () => {
      expect(CALIBRATION_CONSTANTS.INTERNAL_MIN).toBe(-4.0);
      expect(CALIBRATION_CONSTANTS.INTERNAL_MAX).toBe(3.5);
      expect(CALIBRATION_CONSTANTS.USER_MIN).toBe(0.0);
      expect(CALIBRATION_CONSTANTS.USER_MAX).toBe(7.5);
      expect(CALIBRATION_CONSTANTS.MOBILE_ADJUSTMENT).toBe(2.0);
      expect(CALIBRATION_CONSTANTS.SCALE_OFFSET).toBe(4.0);
    });

    it("✅ Scale ranges: verify total ranges are correct", () => {
      const internalRange = CALIBRATION_CONSTANTS.INTERNAL_MAX - CALIBRATION_CONSTANTS.INTERNAL_MIN;
      const userRange = CALIBRATION_CONSTANTS.USER_MAX - CALIBRATION_CONSTANTS.USER_MIN;
      
      expect(internalRange).toBe(7.5); // -4.0 to +3.5 = 7.5D
      expect(userRange).toBe(7.5);     // 0.0 to +7.5 = 7.5D
      expect(internalRange).toBe(userRange); // Ranges should be equal
    });
  });
});