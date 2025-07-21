import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VisionCalibration from "../pages/VisionCalibration";

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

describe("VisionCalibration Baseline (User Scale 0.00D to +3.50D)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("0");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Slider uses correct user scale range and step", () => {
    render(<BrowserRouter><VisionCalibration /></BrowserRouter>);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "3.5");
    expect(slider).toHaveAttribute("step", "0.25");
  });

  it("User scale value is stored as correct internal value in localStorage", () => {
    render(<BrowserRouter><VisionCalibration /></BrowserRouter>);
    const slider = screen.getByRole("slider");
    // User sets 0.00D (should store -4.00D)
    fireEvent.change(slider, { target: { value: "0.00" } });
    fireEvent.click(screen.getByText(/Set Calibration/i));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("calibrationValue", "-4");
    // User sets +1.00D (should store -3.00D)
    fireEvent.change(slider, { target: { value: "1.00" } });
    fireEvent.click(screen.getByText(/Set Calibration/i));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("calibrationValue", "-3");
    // User sets +3.50D (should store -0.50D)
    fireEvent.change(slider, { target: { value: "3.50" } });
    fireEvent.click(screen.getByText(/Set Calibration/i));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("calibrationValue", "-0.5");
  });

  it("UI shows correct user scale range labels", () => {
    render(<BrowserRouter><VisionCalibration /></BrowserRouter>);
    expect(screen.getByText("0.00D")).toBeInTheDocument();
    expect(screen.getByText("+1.75D")).toBeInTheDocument();
    expect(screen.getByText("+3.50D")).toBeInTheDocument();
  });
});