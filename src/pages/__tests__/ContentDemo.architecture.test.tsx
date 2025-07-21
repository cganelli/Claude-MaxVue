import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ContentDemo from "../ContentDemo";

describe("ContentDemo Architecture (Canvas Analysis)", () => {
  beforeEach(() => {
    // Any necessary setup
  });

  afterEach(() => {
    // Any necessary teardown
  });

  it("Should render two Canvas Analysis sections", () => {
    render(<ContentDemo />);
    // Find all Canvas Analysis headers (should be 2)
    const canvasHeaders = screen.getAllByText(/Canvas Analysis/i);
    expect(canvasHeaders).toHaveLength(2);
  });

  it("Canvas Analysis section uses correct selectors and structure", () => {
    render(<ContentDemo />);
    // Check for the presence of the main Canvas Analysis button/section
    expect(screen.getByRole("button", { name: /Canvas Analysis/i })).toBeInTheDocument();
    // Optionally check for the debug panel if enabled
    // expect(screen.queryByTestId("canvas-analysis-debug-panel")).not.toBeInTheDocument();
  });
});