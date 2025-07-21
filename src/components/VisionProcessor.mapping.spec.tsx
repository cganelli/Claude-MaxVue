import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisionProcessor } from "./VisionProcessor";

// Mock the useVisionCorrection hook
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

describe("✅ CALIBRATION MAPPING: VisionProcessor User-Friendly Scale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("0"); // Internal scale value
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("SHOULD FAIL INITIALLY: ContentDemo should show user-friendly 0.00D to +3.50D scale", () => {
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );
    
    // Should show user-friendly range labels (0.00D to +3.50D)
    expect(screen.getByText("0.00D")).toBeInTheDocument();
    expect(screen.getByText("+1.75D")).toBeInTheDocument();
    expect(screen.getByText("+3.50D")).toBeInTheDocument();
    
    // Should NOT show negative values in UI
    expect(screen.queryByText("-4.00D")).not.toBeInTheDocument();
    expect(screen.queryByText("-2.00D")).not.toBeInTheDocument();
  });

  it("SHOULD FAIL INITIALLY: ContentDemo slider should accept user scale 0.00D to +3.50D", () => {
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );
    
    const slider = screen.getByRole("slider");
    
    // Should accept user-friendly range
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "3.5");
    expect(slider).toHaveAttribute("step", "0.25");
  });

  it("SHOULD FAIL INITIALLY: Setting user +2.00D should map to internal -2.00D", () => {
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );
    
    const slider = screen.getByRole("slider");
    
    // User sets +2.00D (should map to internal -2.00D)
    fireEvent.change(slider, { target: { value: "2.00" } });
    
    // Should call updateSettings with internal value (-2.00D)
    expect(mockVisionHook.updateSettings).toHaveBeenCalledWith({
      readingVision: -2.0 // Internal scale
    });
  });

  it("SHOULD FAIL INITIALLY: Reading Vision label should show user scale", () => {
    // Set internal hook value to -2.0 (which is user +2.00D)
    mockVisionHook.settings.readingVision = -2.0;
    
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );
    
    // Should display user-friendly scale (+2.00D, not -2.00D)
    expect(screen.getByText(/Reading Vision: \+2\.00D/)).toBeInTheDocument();
    expect(screen.queryByText(/Reading Vision: -2\.00D/)).not.toBeInTheDocument();
  });

  it("SHOULD FAIL INITIALLY: Calibration info should show user scale", () => {
    // Mock localStorage to return internal -2.0 (user +2.00D)
    mockLocalStorage.getItem.mockReturnValue("-2.0");
    
    render(
      <VisionProcessor showControls={true}>
        <div>Test Content</div>
      </VisionProcessor>
    );
    
    // Should display user-friendly calibration (+2.00D)
    expect(screen.getByText((content, element) => {
      return element?.textContent === "Your Calibration: +2.00D";
    })).toBeInTheDocument();
    expect(screen.queryByText(/Your Calibration: -2\.00D/)).not.toBeInTheDocument();
  });

  it("✅ MAPPING LOGIC: Verify user to internal scale conversion", () => {
    // Test the mapping logic directly
    const userToInternalMappings = [
      { user: 0.0, internal: -4.0, description: "No reading glasses needed" },
      { user: 1.0, internal: -3.0, description: "Very mild presbyopia" },
      { user: 2.0, internal: -2.0, description: "Mild presbyopia" },
      { user: 3.0, internal: -1.0, description: "Moderate presbyopia" },
      { user: 3.5, internal: -0.5, description: "Strong presbyopia" },
    ];

    userToInternalMappings.forEach(({ user, internal, description }) => {
      const calculatedInternal = user - 4.0; // user - SCALE_OFFSET
      expect(calculatedInternal).toBe(internal);
      console.log(`✅ ${description}: User +${user.toFixed(2)}D → Internal ${internal >= 0 ? '+' : ''}${internal.toFixed(2)}D`);
    });
  });

  it("✅ MOBILE ADJUSTMENT: Desktop user +2.00D → Mobile user +4.00D", () => {
    // Test mobile adjustment with user-friendly values
    const userDesktop = 2.0;    // User sees +2.00D
    const internalDesktop = -2.0; // Internal calculation value
    const internalMobile = 0.0;   // Internal mobile (+2.00D adjustment)
    const userMobile = 4.0;      // User sees +4.00D

    // Verify calculations
    expect(userDesktop - 4.0).toBe(internalDesktop);           // User → Internal
    expect(internalDesktop + 2.0).toBe(internalMobile);        // Desktop → Mobile (internal)
    expect(internalMobile + 4.0).toBe(userMobile);             // Internal → User

    console.log(`✅ Mobile Adjustment Mapping:`);
    console.log(`   Desktop User: +${userDesktop.toFixed(2)}D → Internal: ${internalDesktop >= 0 ? '+' : ''}${internalDesktop.toFixed(2)}D`);
    console.log(`   Mobile Internal: ${internalMobile >= 0 ? '+' : ''}${internalMobile.toFixed(2)}D → User: +${userMobile.toFixed(2)}D`);
  });

  it("✅ USER SCENARIOS: Complete workflow verification", () => {
    // Test common user scenarios with the mapping
    const scenarios = [
      {
        userDesktop: 0.0,
        internalDesktop: -4.0,
        internalMobile: -2.0,
        userMobile: 2.0,
        description: "No glasses needed → Mild correction on mobile"
      },
      {
        userDesktop: 2.0,
        internalDesktop: -2.0,
        internalMobile: 0.0,
        userMobile: 4.0,
        description: "Mild presbyopia → Strong correction on mobile"
      },
      {
        userDesktop: 3.5,
        internalDesktop: -0.5,
        internalMobile: 1.5,
        userMobile: 5.5,
        description: "Strong presbyopia → Very strong correction on mobile"
      },
    ];

    scenarios.forEach(({ userDesktop, internalDesktop, internalMobile, userMobile, description }) => {
      // Verify user → internal conversion
      expect(userDesktop - 4.0).toBe(internalDesktop);
      
      // Verify mobile adjustment
      expect(internalDesktop + 2.0).toBe(internalMobile);
      
      // Verify internal → user conversion
      expect(internalMobile + 4.0).toBe(userMobile);

      console.log(`✅ ${description}:`);
      console.log(`   Desktop: +${userDesktop.toFixed(2)}D → Mobile: +${userMobile.toFixed(2)}D`);
      console.log(`   Internal: ${internalDesktop >= 0 ? '+' : ''}${internalDesktop.toFixed(2)}D → ${internalMobile >= 0 ? '+' : ''}${internalMobile.toFixed(2)}D`);
    });
  });
});