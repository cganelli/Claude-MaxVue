import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, waitFor, screen } from "@testing-library/react";
import ContentDemo from "./ContentDemo";

// Mock the hooks with proper mobile detection behavior
let mockMobileDetection = {
  deviceType: "desktop" as "desktop" | "mobile" | "tablet",
  calibrationAdjustment: 0,
  viewingDistance: 22.5,
  getAdjustedCalibration: vi.fn((base: number) => base),
  isMobile: false,
  isTablet: false,
  isDesktop: true
};

const mockVisionHook = {
  settings: { readingVision: 0, isEnabled: false },
  updateSettings: vi.fn(),
  processElement: vi.fn(),
  isEnabled: false
};

// Mock the complex components to avoid rendering issues
vi.mock("../components/VisionProcessor", () => ({
  VisionProcessor: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="vision-processor">{children}</div>
  )
}));

vi.mock("../components/WorkingCameraDemo", () => ({
  default: () => <div data-testid="camera-demo">Camera Demo</div>
}));

vi.mock("../components/NativeAppDemo", () => ({
  default: () => <div data-testid="native-demo">Native App Demo</div>
}));

vi.mock("../hooks/useVisionCorrection", () => ({
  useVisionCorrection: () => mockVisionHook
}));

vi.mock("../hooks/useMobileDetection", () => ({
  useMobileDetection: () => mockMobileDetection
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe("CRITICAL: ContentDemo Mobile Detection Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Reset to desktop state
    mockMobileDetection.deviceType = "desktop";
    mockMobileDetection.calibrationAdjustment = 0;
    mockMobileDetection.viewingDistance = 22.5;
    mockMobileDetection.isMobile = false;
    mockMobileDetection.isDesktop = true;
    mockMobileDetection.getAdjustedCalibration.mockImplementation((base) => base);
  });

  it("should show mobile device info when mobile detection is active", async () => {
    // Test with mobile detection already active
    mockMobileDetection.deviceType = "mobile";
    mockMobileDetection.calibrationAdjustment = 1.75;
    mockMobileDetection.viewingDistance = 14;
    mockMobileDetection.isMobile = true;
    mockMobileDetection.isDesktop = false;
    mockMobileDetection.getAdjustedCalibration.mockImplementation((base) => base + 1.75);
    
    render(<ContentDemo />);
    
    // Should show mobile device info
    await waitFor(() => {
      expect(screen.getByText(/Mobile Device/)).toBeInTheDocument();
      expect(screen.getByText(/Viewing Distance: 14"/)).toBeInTheDocument();
      expect(screen.getByText(/Calibration Adjustment: \+1\.75D/)).toBeInTheDocument();
    });
  });

  it("should apply mobile calibration adjustment correctly", async () => {
    // Setup localStorage with base calibration
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "calibrationValue") return "2.0";
      if (key === "visionCorrectionEnabled") return "true";
      return null;
    });
    
    // Set mobile detection
    mockMobileDetection.deviceType = "mobile";
    mockMobileDetection.calibrationAdjustment = 1.75;
    mockMobileDetection.getAdjustedCalibration.mockImplementation((base) => base + 1.75);
    
    const consoleSpy = vi.spyOn(console, 'log');
    
    render(<ContentDemo />);
    
    // Should apply mobile adjustment: 2.0 + 1.75 = 3.75D
    await waitFor(() => {
      expect(mockMobileDetection.getAdjustedCalibration).toHaveBeenCalledWith(2.0);
    });
    
    // Should log mobile adjustment
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("adjusted for mobile")
      );
    });
    
    consoleSpy.mockRestore();
  });

  it("should show desktop device info when desktop detection is active", async () => {
    // Test desktop detection
    render(<ContentDemo />);
    
    // Should show desktop device info
    await waitFor(() => {
      expect(screen.getByText(/Desktop Device/)).toBeInTheDocument();
      expect(screen.getByText(/Viewing Distance: 22.5"/)).toBeInTheDocument();
    });
    
    // Should NOT show calibration adjustment for desktop
    expect(screen.queryByText(/Calibration Adjustment/)).not.toBeInTheDocument();
  });

  it("should log correct device detection information", async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    // Test mobile logging
    mockMobileDetection.deviceType = "mobile";
    mockMobileDetection.calibrationAdjustment = 1.75;
    mockMobileDetection.viewingDistance = 14;
    
    render(<ContentDemo />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Device: mobile, Viewing distance: 14\", Adjustment: +1.75D")
      );
    });
    
    consoleSpy.mockRestore();
  });

  it("should handle tablet detection correctly", async () => {
    // Test tablet detection
    mockMobileDetection.deviceType = "tablet";
    mockMobileDetection.calibrationAdjustment = 0.5;
    mockMobileDetection.viewingDistance = 18;
    mockMobileDetection.isTablet = true;
    mockMobileDetection.isMobile = false;
    mockMobileDetection.isDesktop = false;
    mockMobileDetection.getAdjustedCalibration.mockImplementation((base) => base + 0.5);
    
    render(<ContentDemo />);
    
    // Should show tablet device info
    await waitFor(() => {
      expect(screen.getByText(/Tablet Device/)).toBeInTheDocument();
      expect(screen.getByText(/Viewing Distance: 18"/)).toBeInTheDocument();
      expect(screen.getByText(/Calibration Adjustment: \+0\.50D/)).toBeInTheDocument();
    });
  });
});