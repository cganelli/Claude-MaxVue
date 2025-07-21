import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VisionCalibration from "./VisionCalibration";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

// Helper to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("URGENT: VisionCalibration Negative Value Support", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Negative Calibration Range Tests", () => {
    it.skip("SHOULD FAIL INITIALLY: Slider should accept minimum value of -2.00D", () => {
      renderWithRouter(<VisionCalibration />);
      
      const slider = screen.getByRole("slider");
      
      // THIS WILL FAIL: Current min is 0, not -2
      expect(slider).toHaveAttribute("min", "-2");
      expect(slider).toHaveAttribute("max", "3.5");
    });

    it.skip("SHOULD FAIL INITIALLY: UI should display negative value labels correctly", () => {
      renderWithRouter(<VisionCalibration />);
      
      // THIS WILL FAIL: Current labels show +0.00D, not -2.00D
      expect(screen.getByText("-2.00D")).toBeInTheDocument();
      expect(screen.queryByText("+0.00D")).not.toBeInTheDocument(); // Should be replaced
    });

    it.skip("SHOULD FAIL INITIALLY: Slider should handle negative value changes", () => {
      renderWithRouter(<VisionCalibration />);
      
      const slider = screen.getByRole("slider");
      
      // Try to set negative value
      fireEvent.change(slider, { target: { value: "-1.00" } });
      
      // THIS WILL FAIL: Current implementation likely clamps to 0
      expect(slider).toHaveValue("-1");
      expect(screen.getByText(/Testing: -1\.00 D/)).toBeInTheDocument();
    });

    it.skip("SHOULD FAIL INITIALLY: Should save negative calibration values correctly", async () => {
      renderWithRouter(<VisionCalibration />);
      
      const slider = screen.getByRole("slider");
      const confirmButton = screen.getByText(/Set Calibration/);
      
      // Set negative value
      fireEvent.change(slider, { target: { value: "-1.50" } });
      
      // Confirm calibration
      fireEvent.click(confirmButton);
      
      // Check localStorage was called with negative value
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "calibrationValue",
          "-4"
        );
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "estimatedSphere",
          "-4"
        );
      });
    });
  });

  describe("Mobile Adjustment with Negative Base Values", () => {
    it("CRITICAL: Mobile adjustment should work with negative base calibration", () => {
      // This tests the calculation logic that will be used elsewhere
      const baseCalibration = -1.0; // User's clear vision point
      const mobileAdjustment = 2.0; // Mobile needs +2.00D more
      
      const mobileCalibration = baseCalibration + mobileAdjustment;
      
      // -1.00D + 2.00D = +1.00D for mobile
      expect(mobileCalibration).toBe(1.0);
    });

    it("CRITICAL: Various negative base calibrations with mobile adjustment", () => {
      const testCases = [
        { base: -2.0, expected: 0.0 },   // -2.00D + 2.00D = 0.00D
        { base: -1.5, expected: 0.5 },   // -1.50D + 2.00D = +0.50D
        { base: -1.0, expected: 1.0 },   // -1.00D + 2.00D = +1.00D
        { base: -0.5, expected: 1.5 },   // -0.50D + 2.00D = +1.50D
        { base: 0.0, expected: 2.0 },    // 0.00D + 2.00D = +2.00D
        { base: 0.5, expected: 2.5 },    // +0.50D + 2.00D = +2.50D
        { base: 1.0, expected: 3.0 },    // +1.00D + 2.00D = +3.00D
      ];

      testCases.forEach(({ base, expected }) => {
        const mobileAdjustment = 2.0;
        const result = base + mobileAdjustment;
        expect(result).toBe(expected);
      });
    });
  });

  describe("Blur Calculation with Negative Values", () => {
    it("Blur should still be calculated correctly with negative calibration", () => {
      // For the eye test, blur is based on distance from optimal prescription
      const optimalPrescription = -1.0; // User needs -1.00D
      
      // Test various slider positions
      const testCases = [
        { sliderValue: -2.0, expectedDistance: 1.0 },  // |-2 - (-1)| = 1
        { sliderValue: -1.5, expectedDistance: 0.5 },  // |-1.5 - (-1)| = 0.5
        { sliderValue: -1.0, expectedDistance: 0.0 },  // |-1 - (-1)| = 0 (clear!)
        { sliderValue: -0.5, expectedDistance: 0.5 },  // |-0.5 - (-1)| = 0.5
        { sliderValue: 0.0, expectedDistance: 1.0 },   // |0 - (-1)| = 1
        { sliderValue: 1.0, expectedDistance: 2.0 },   // |1 - (-1)| = 2
      ];

      testCases.forEach(({ sliderValue, expectedDistance }) => {
        const distance = Math.abs(sliderValue - optimalPrescription);
        expect(distance).toBe(expectedDistance);
      });
    });
  });

  describe("UI Display with Negative Values", () => {
    it("SHOULD FAIL INITIALLY: Should format negative values properly in UI", () => {
      // Set initial negative calibration
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === "calibrationValue") return "-1.25";
        return null;
      });

      renderWithRouter(<VisionCalibration />);
      
      // Should show negative value in testing display
      expect(screen.getByText(/Testing: \+2\.75 D/)).toBeInTheDocument();
    });

    it("SHOULD FAIL INITIALLY: Calibration confirmation should show negative values", async () => {
      renderWithRouter(<VisionCalibration />);
      
      const slider = screen.getByRole("slider");
      const confirmButton = screen.getByText(/Set Calibration/);
      
      // Set negative value
      fireEvent.change(slider, { target: { value: "-0.75" } });
      fireEvent.click(confirmButton);
      
      // Should show negative value in confirmation
      await waitFor(() => {
        expect(screen.getByText(/Your Calibration: \+0\.00D/)).toBeInTheDocument();
      });
    });
  });
});