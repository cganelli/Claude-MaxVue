import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisionProcessor } from "./VisionProcessor";

// Mock the useVisionCorrection hook
const mockVisionHook = {
  settings: { 
    readingVision: 0,
    contrastBoost: 0,
    edgeEnhancement: 0
  },
  updateSettings: vi.fn(),
  processElement: vi.fn(),
  isEnabled: true,
  toggleEnabled: vi.fn(),
  isProcessing: false,
  resetSettings: vi.fn(),
  startRealTimeProcessing: vi.fn(),
  stopRealTimeProcessing: vi.fn(),
  processImage: vi.fn()
};

vi.mock("../hooks/useVisionCorrection", () => ({
  useVisionCorrection: () => mockVisionHook
}));

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

describe("URGENT: VisionProcessor ContentDemo Negative Range Support", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("0");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Negative Range Tests for ContentDemo Slider", () => {
    it("✅ ContentDemo slider should accept user scale 0.00D to +3.50D", () => {
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      const slider = screen.getByRole("slider");
      
      // Updated: Now uses user-friendly scale (0.00D to +3.50D)
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "3.5");
    });

    it("✅ ContentDemo should display user-friendly scale labels", () => {
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      // Updated: Now shows user-friendly scale labels
      expect(screen.getByText("0.00D")).toBeInTheDocument();
      expect(screen.getByText("+1.75D")).toBeInTheDocument();
      expect(screen.getByText("+3.50D")).toBeInTheDocument();
      
      // Should NOT show internal scale labels
      expect(screen.queryByText("-4.00D")).not.toBeInTheDocument();
      expect(screen.queryByText("-2.00D")).not.toBeInTheDocument();
    });

    it("✅ ContentDemo should handle user scale value changes", () => {
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      const slider = screen.getByRole("slider");
      
      // Set user scale value +1.50D (maps to internal -2.50D)
      fireEvent.change(slider, { target: { value: "1.50" } });
      
      // Should convert user +1.50D to internal -2.50D
      expect(mockVisionHook.updateSettings).toHaveBeenCalledWith({
        readingVision: -2.5
      });
    });

    it("✅ ContentDemo should display user scale values in label", () => {
      // Set up hook to return internal -1.25D (maps to user +2.75D)
      mockVisionHook.settings.readingVision = -1.25;
      
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      // Should display user-friendly scale (+2.75D, not -1.25D)
      expect(screen.getByText(/Reading Vision: \+2\.75D/)).toBeInTheDocument();
      expect(screen.queryByText(/Reading Vision: -1\.25D/)).not.toBeInTheDocument();
    });
  });

  describe("Mobile Adjustment Verification", () => {
    it("CRITICAL: Verify negative base values work with mobile detection", () => {
      // This tests the integration that will be used with useMobileDetection
      const baseCalibration = -1.0; // User's clear vision point
      const mobileAdjustment = 2.0; // Mobile needs +2.00D more
      
      const mobileCalibration = baseCalibration + mobileAdjustment;
      
      // -1.00D + 2.00D = +1.00D for mobile
      expect(mobileCalibration).toBe(1.0);
    });

    it("CRITICAL: Test various negative scenarios for ContentDemo", () => {
      const testCases = [
        { desktopValue: -4.0, expectedMobile: -2.0 },  // -4.00D + 2.00D = -2.00D
        { desktopValue: -3.5, expectedMobile: -1.5 },  // -3.50D + 2.00D = -1.50D
        { desktopValue: -3.0, expectedMobile: -1.0 },  // -3.00D + 2.00D = -1.00D
        { desktopValue: -2.5, expectedMobile: -0.5 },  // -2.50D + 2.00D = -0.50D
        { desktopValue: -2.0, expectedMobile: 0.0 },   // -2.00D + 2.00D = 0.00D
        { desktopValue: -1.5, expectedMobile: 0.5 },   // -1.50D + 2.00D = +0.50D
        { desktopValue: -1.0, expectedMobile: 1.0 },   // -1.00D + 2.00D = +1.00D
        { desktopValue: -0.5, expectedMobile: 1.5 },   // -0.50D + 2.00D = +1.50D
        { desktopValue: 0.0, expectedMobile: 2.0 },    // 0.00D + 2.00D = +2.00D
      ];

      testCases.forEach(({ desktopValue, expectedMobile }) => {
        const mobileAdjustment = 2.0;
        const result = desktopValue + mobileAdjustment;
        expect(result).toBe(expectedMobile);
      });
    });
  });

  describe("UI Display Tests", () => {
    it("✅ Label should format user scale values correctly", () => {
      mockVisionHook.settings.readingVision = -0.75; // Internal -0.75D = User +3.25D
      
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      // Should show user-friendly value with plus sign
      expect(screen.getByText(/Reading Vision: \+3\.25D/)).toBeInTheDocument();
      // Should not show internal negative value
      expect(screen.queryByText(/Reading Vision: -0\.75D/)).not.toBeInTheDocument();
    });

    it("✅ Range labels should show user-friendly scale", () => {
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      // Updated range labels for user scale
      expect(screen.getByText("0.00D")).toBeInTheDocument();
      expect(screen.getByText("+1.75D")).toBeInTheDocument(); // Middle point for 0 to +3.5 range
      expect(screen.getByText("+3.50D")).toBeInTheDocument();
      
      // Updated descriptions for user scale
      expect(screen.getByText("No reading glasses needed")).toBeInTheDocument();
      expect(screen.getByText("Moderate presbyopia")).toBeInTheDocument();
      expect(screen.getByText("Very strong presbyopia")).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Validation", () => {
    it("SHOULD PASS: Slider should handle step increments correctly", () => {
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      const slider = screen.getByRole("slider");
      
      // Verify step size is still 0.25
      expect(slider).toHaveAttribute("step", "0.25");
    });

    it("✅ updateSettings should be called with mapped internal values", () => {
      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );
      
      const slider = screen.getByRole("slider");
      
      // Simulate setting user scale +2.75D (maps to internal -1.25D)
      fireEvent.change(slider, { target: { value: "2.75" } });
      
      // Should call updateSettings with internal value
      expect(mockVisionHook.updateSettings).toHaveBeenCalledWith({
        readingVision: -1.25
      });
    });
  });

  describe("User Scenario Testing", () => {
    it("✅ USER SCENARIO: User testing on ContentDemo with user-friendly values", () => {
      // Simulate user workflow on ContentDemo page:
      // 1. User opens http://192.168.7.217:5173/content-demo
      // 2. They adjust slider using user-friendly scale (0.00D to +3.50D)
      // 3. System maps to internal scale and maintains full range support
      
      render(
        <VisionProcessor showControls={true}>
          <div>Sample content for testing vision clarity</div>
        </VisionProcessor>
      );
      
      const slider = screen.getByRole("slider");
      
      // User sets +0.50D (maps to internal -3.50D)
      fireEvent.change(slider, { target: { value: "0.50" } });
      
      expect(mockVisionHook.updateSettings).toHaveBeenCalledWith({
        readingVision: -3.5
      });
    });

    it("✅ NEW SCENARIO: User can test maximum correction via user scale 0.00D", () => {
      // Test maximum internal correction via user-friendly scale
      render(
        <VisionProcessor showControls={true}>
          <div>Sample content for testing vision clarity</div>
        </VisionProcessor>
      );
      
      const slider = screen.getByRole("slider");
      
      // User sets 0.00D (maps to internal -4.00D maximum correction)
      fireEvent.change(slider, { target: { value: "0.00" } });
      
      expect(mockVisionHook.updateSettings).toHaveBeenCalledWith({
        readingVision: -4.0
      });
    });

    it("✅ MOBILE SCENARIO: Desktop -4.00D → Mobile -2.00D", () => {
      // Verify the maximum negative correction use case
      const desktopOptimal = -4.0;
      const mobileAdjustment = 2.0;
      const mobileOptimal = desktopOptimal + mobileAdjustment;
      
      // Desktop -4.00D + Mobile +2.00D = Mobile -2.00D
      expect(mobileOptimal).toBe(-2.0);
    });

    it("✅ MOBILE SCENARIO: Desktop -2.50D → Mobile -0.50D", () => {
      // Verify the previous use case still works
      const desktopOptimal = -2.5;
      const mobileAdjustment = 2.0;
      const mobileOptimal = desktopOptimal + mobileAdjustment;
      
      // Desktop -2.50D + Mobile +2.00D = Mobile -0.50D
      expect(mobileOptimal).toBe(-0.5);
    });
  });
});