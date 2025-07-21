import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VisionCalibration from "../pages/VisionCalibration";
import { VisionProcessor } from "../components/VisionProcessor";
import {
  userToInternalScale,
  internalToUserScale,
  applyMobileAdjustment,
} from "../utils/calibrationMapping";

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

// Mock the vision correction hook
const mockVisionHook = {
  settings: {
    readingVision: 0, // Internal scale value
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

// Mock mobile detection hook
const mockMobileDetection = {
  deviceType: "desktop" as const,
  calibrationAdjustment: 0,
};

vi.mock("../hooks/useMobileDetection", () => ({
  useMobileDetection: () => mockMobileDetection
}));

describe("✅ CALIBRATION CONSISTENCY: Cross-Page Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("0"); // Default internal 0
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("✅ VisionCalibration saves user +2.00D → ContentDemo reads as user +2.00D", () => {
    // 1. User sets +2.00D on VisionCalibration page
    const userCalibration = 2.0;
    const expectedInternal = userToInternalScale(userCalibration); // -2.0
    
    // Mock that VisionCalibration saves this value
    mockLocalStorage.setItem("calibrationValue", expectedInternal.toString());
    mockLocalStorage.getItem.mockReturnValue(expectedInternal.toString());

    // 2. Render ContentDemo and verify it displays user +2.00D
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );

    // Should display user-friendly calibration value
    expect(screen.getByText((content, element) => {
      return element?.textContent === "Your Calibration: +2.00D";
    })).toBeInTheDocument();

    console.log(`✅ Calibration consistency: User +${userCalibration.toFixed(2)}D saved and displayed correctly`);
  });

  it("✅ ContentDemo slider change updates internal scale correctly", () => {
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );

    const slider = screen.getByRole("slider");

    // User sets +1.50D on ContentDemo
    fireEvent.change(slider, { target: { value: "1.50" } });

    // Should call updateSettings with internal -2.50D
    expect(mockVisionHook.updateSettings).toHaveBeenCalledWith({
      readingVision: -2.5
    });

    console.log("✅ ContentDemo correctly maps user +1.50D → internal -2.50D");
  });

  it("✅ Mobile adjustment calculation with user-friendly scale", () => {
    // Test the complete workflow: User scale → Internal scale → Mobile adjustment
    const userDesktop = 2.0;        // User sets +2.00D
    const internalDesktop = -2.0;   // Maps to internal -2.00D
    const internalMobile = 0.0;     // Mobile gets +2.00D adjustment → 0.00D
    const userMobile = 4.0;         // Maps back to user +4.00D

    // Verify the calculations
    expect(userToInternalScale(userDesktop)).toBe(internalDesktop);
    expect(applyMobileAdjustment(internalDesktop)).toBe(internalMobile);
    expect(internalToUserScale(internalMobile)).toBe(userMobile);

    console.log("✅ Mobile adjustment workflow:");
    console.log(`   Desktop User: +${userDesktop.toFixed(2)}D → Internal: ${internalDesktop >= 0 ? '+' : ''}${internalDesktop.toFixed(2)}D`);
    console.log(`   Mobile Internal: ${internalMobile >= 0 ? '+' : ''}${internalMobile.toFixed(2)}D → User: +${userMobile.toFixed(2)}D`);
  });

  it("✅ Full integration: VisionCalibration → localStorage → ContentDemo", () => {
    // Simulate complete user workflow

    // 1. User calibrates at +2.00D on VisionCalibration
    const userCalibration = 2.0;
    const internalCalibration = userToInternalScale(userCalibration);
    
    // 2. VisionCalibration saves to localStorage (internal scale)
    mockLocalStorage.setItem("calibrationValue", internalCalibration.toString());
    mockLocalStorage.getItem.mockReturnValue(internalCalibration.toString());

    // 3. User opens ContentDemo
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );

    // 4. ContentDemo should display the same user value (+2.00D)
    expect(screen.getByText((content, element) => {
      return element?.textContent === "Your Calibration: +2.00D";
    })).toBeInTheDocument();

    // 5. Hook should have internal value (-2.00D)
    mockVisionHook.settings.readingVision = internalCalibration;

    // Re-render to apply the hook value
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );

    // 6. Should display user-friendly reading vision value
    expect(screen.getByText(/Reading Vision: \+2\.00D/)).toBeInTheDocument();

    console.log("✅ Full integration test passed: VisionCalibration → localStorage → ContentDemo");
  });

  it("✅ Edge case: Maximum and minimum values work correctly", () => {
    const testCases = [
      {
        user: 0.0,
        internal: -4.0,
        description: "Minimum user scale (no glasses) → Maximum internal correction"
      },
      {
        user: 3.5,
        internal: -0.5,
        description: "Maximum user scale (strong presbyopia) → Mild internal correction"
      },
    ];

    testCases.forEach(({ user, internal, description }) => {
      // Test conversion
      expect(userToInternalScale(user)).toBe(internal);
      expect(internalToUserScale(internal)).toBe(user);

      // Test that ContentDemo can handle these values
      mockLocalStorage.getItem.mockReturnValue(internal.toString());
      mockVisionHook.settings.readingVision = internal;

      render(
        <VisionProcessor showControls={true}>
          <div>Test Content</div>
        </VisionProcessor>
      );

      // Should display user-friendly value
      const expectedLabel = `+${user.toFixed(2)}D`;
      expect(screen.getByText(new RegExp(`Reading Vision: \\${expectedLabel}`))).toBeInTheDocument();

      console.log(`✅ ${description}: User +${user.toFixed(2)}D ↔ Internal ${internal >= 0 ? '+' : ''}${internal.toFixed(2)}D`);
    });
  });

  it("✅ Scale mapping constants are consistent", () => {
    // Verify that the mapping system maintains consistency
    const scaleOffset = 4.0;
    const mobileAdjustment = 2.0;

    // Test bidirectional conversion for key values
    const testValues = [0, 1, 2, 3, 3.5];
    
    testValues.forEach(userValue => {
      const internal = userValue - scaleOffset;
      const backToUser = internal + scaleOffset;
      
      expect(backToUser).toBeCloseTo(userValue, 2);
      expect(userToInternalScale(userValue)).toBe(internal);
      expect(internalToUserScale(internal)).toBe(userValue);
    });

    // Test mobile adjustment
    const desktopInternal = -2.0;
    const mobileInternal = desktopInternal + mobileAdjustment;
    expect(applyMobileAdjustment(desktopInternal)).toBe(mobileInternal);

    console.log("✅ Scale mapping constants are mathematically consistent");
  });
});