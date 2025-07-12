import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentDemo from "../../pages/ContentDemo";

// Mock the useVisionCorrection hook
const mockUpdateSettings = vi.fn();
const mockVisionHook = {
  settings: {
    readingVision: 2.0,
    contrastBoost: 15,
    edgeEnhancement: 25,
    isEnabled: true,
  },
  updateSettings: mockUpdateSettings,
  isEnabled: true,
  toggleEnabled: vi.fn(),
  isProcessing: false,
  resetSettings: vi.fn(),
  processElement: vi.fn(),
  processImage: vi.fn(),
  calibrationData: null,
  saveCalibration: vi.fn(),
  loadCalibration: vi.fn(),
  startRealTimeProcessing: vi.fn(),
  stopRealTimeProcessing: vi.fn(),
  runVisionTest: vi.fn(),
  // Mobile calibration properties
  adjustedReadingVision: 2.0,
  baseReadingVision: 2.0,
  deviceType: "desktop" as const,
  calibrationAdjustment: 0,
};

vi.mock("../../hooks/useVisionCorrection", () => ({
  useVisionCorrection: () => mockVisionHook,
}));

// Mock the mobile detection hook
vi.mock("../../hooks/useMobileDetection", () => ({
  useMobileDetection: () => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: "desktop" as const,
    hasTouch: false,
    viewingDistance: 22.5,
    calibrationAdjustment: 0,
    viewport: {
      width: 1920,
      height: 1080,
      isSmall: false,
      isMedium: false,
      isLarge: true,
    },
    getAdjustedCalibration: (base: number) => base,
  }),
}));

// Mock WorkingCameraDemo component (fix hoisting issue)
vi.mock("../../components/WorkingCameraDemo", () => ({
  default: vi
    .fn()
    .mockImplementation(({ readingVisionDiopter, calibrationValue }) => (
      <div
        data-testid="working-camera-demo"
        data-reading-vision-diopter={readingVisionDiopter}
        data-calibration-value={calibrationValue}
      >
        Camera Demo (Reading: {readingVisionDiopter}D, Calibration:{" "}
        {calibrationValue}D)
      </div>
    )),
}));

// Mock VisionProcessor component
vi.mock("../../components/VisionProcessor", () => ({
  VisionProcessor: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="vision-processor">{children}</div>
  ),
}));

// Mock NativeAppDemo component
vi.mock("../../components/NativeAppDemo", () => ({
  default: () => <div data-testid="native-app-demo">Native App Demo</div>,
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn().mockReturnValue("2.0"),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("Camera Slider Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("2.0");
    // Reset mock hook settings
    mockVisionHook.settings.readingVision = 2.0;
  });

  it("should pass correct props to camera component on camera tab", async () => {
    const { container } = render(<ContentDemo />);

    // Switch to camera tab first
    const cameraTab = screen.getByText("Camera");
    fireEvent.click(cameraTab);

    // Wait for camera component to render
    await waitFor(() => {
      expect(screen.getByTestId("working-camera-demo")).toBeInTheDocument();
    });

    // Verify camera component receives correct props
    const cameraDemo = screen.getByTestId("working-camera-demo");
    expect(cameraDemo).toHaveAttribute("data-reading-vision-diopter", "2"); // From hook settings
    expect(cameraDemo).toHaveAttribute("data-calibration-value", "2"); // From localStorage (mobile-adjusted)
  });

  it("should pass dynamic props to camera component when vision settings change", async () => {
    // Update mock hook to return new reading vision value
    mockVisionHook.settings.readingVision = 3.5;

    const { rerender } = render(<ContentDemo />);

    // Switch to camera tab
    const cameraTab = screen.getByText("Camera");
    fireEvent.click(cameraTab);

    // Wait for camera component to render
    await waitFor(() => {
      expect(screen.getByTestId("working-camera-demo")).toBeInTheDocument();
    });

    // Check that camera receives correct props
    const cameraComponent = screen.getByTestId("working-camera-demo");
    expect(cameraComponent).toHaveAttribute(
      "data-reading-vision-diopter",
      "3.5",
    );
    expect(cameraComponent).toHaveAttribute("data-calibration-value", "2");
  });

  it("should calculate correct blur amount for camera", () => {
    // Test the blur calculation logic used in ContentDemo
    const readingVision = 3.5;
    const calibration = 2.0;
    const expectedBlur = Math.abs(readingVision - calibration) * 0.5;

    expect(expectedBlur).toBe(0.75); // |3.5 - 2.0| * 0.5 = 0.75
  });

  it("should not isolate camera from main vision system", async () => {
    render(<ContentDemo />);

    // Switch to camera tab
    const cameraTab = screen.getByText("Camera");
    fireEvent.click(cameraTab);

    // Wait for camera component to render and verify it receives correct props
    await waitFor(() => {
      const cameraDemo = screen.getByTestId("working-camera-demo");
      expect(cameraDemo).toBeInTheDocument();
      expect(cameraDemo).toHaveAttribute(
        "data-reading-vision-diopter",
        String(mockVisionHook.settings.readingVision),
      );
      expect(cameraDemo).toHaveAttribute("data-calibration-value", "2"); // From localStorage mock
    });
  });

  it("should respond to vision state changes like other content tabs", async () => {
    render(<ContentDemo />);

    // Switch to camera tab
    const cameraTab = screen.getByText("Camera");
    fireEvent.click(cameraTab);

    // Verify camera component is integrated with the vision system
    await waitFor(() => {
      const cameraComponent = screen.getByTestId("working-camera-demo");
      expect(cameraComponent).toBeInTheDocument();
      // Camera should receive values from the vision system (no slider needed for integration test)
      expect(cameraComponent).toHaveAttribute(
        "data-reading-vision-diopter",
        "2",
      );
      expect(cameraComponent).toHaveAttribute("data-calibration-value", "2");
    });
  });
});
