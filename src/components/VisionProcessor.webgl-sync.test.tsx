import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VisionProcessor } from './VisionProcessor';
import { useVisionCorrection } from '../hooks/useVisionCorrection';

// Mock component that uses the hook to test state synchronization
const TestComponent: React.FC = () => {
  const { webglEnabled, toggleWebGL } = useVisionCorrection();
  
  return (
    <div data-testid="test-component">
      <span data-testid="webgl-state">{webglEnabled ? 'enabled' : 'disabled'}</span>
      <button data-testid="toggle-webgl" onClick={toggleWebGL}>
        Toggle WebGL
      </button>
    </div>
  );
};

describe('WebGL State Synchronization', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock console.log to capture synchronization messages
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should synchronize WebGL state between different hook instances', async () => {
    render(
      <div>
        <VisionProcessor autoProcess={false} showControls={false}>
          <TestComponent />
        </VisionProcessor>
        <TestComponent />
      </div>
    );

    // Get both test components
    const testComponents = screen.getAllByTestId('test-component');
    expect(testComponents).toHaveLength(2);

    // Get initial WebGL states
    const webglStates = screen.getAllByTestId('webgl-state');
    expect(webglStates).toHaveLength(2);
    
    // Both should start with WebGL disabled
    expect(webglStates[0]).toHaveTextContent('disabled');
    expect(webglStates[1]).toHaveTextContent('disabled');

    // Click the toggle button in the first component
    const toggleButtons = screen.getAllByTestId('toggle-webgl');
    fireEvent.click(toggleButtons[0]);

    // Wait for state synchronization
    await waitFor(() => {
      const updatedStates = screen.getAllByTestId('webgl-state');
      expect(updatedStates[0]).toHaveTextContent('enabled');
      expect(updatedStates[1]).toHaveTextContent('enabled');
    });

  });

  it('should handle multiple state changes correctly', async () => {
    render(
      <div>
        <VisionProcessor autoProcess={false} showControls={false}>
          <TestComponent />
        </VisionProcessor>
        <TestComponent />
      </div>
    );

    const toggleButtons = screen.getAllByTestId('toggle-webgl');
    const webglStates = screen.getAllByTestId('webgl-state');

    // Toggle WebGL on and off multiple times
    for (let i = 0; i < 3; i++) {
      fireEvent.click(toggleButtons[0]);
      
      await waitFor(() => {
        const states = screen.getAllByTestId('webgl-state');
        const expectedState = i % 2 === 0 ? 'enabled' : 'disabled';
        expect(states[0]).toHaveTextContent(expectedState);
        expect(states[1]).toHaveTextContent(expectedState);
      });
    }
  });

  it('should handle component unmounting and remounting', async () => {
    const { unmount } = render(
      <div>
        <VisionProcessor autoProcess={false} showControls={false}>
          <TestComponent />
        </VisionProcessor>
      </div>
    );

    // Toggle WebGL to enabled
    const toggleButton = screen.getByTestId('toggle-webgl');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      const webglState = screen.getByTestId('webgl-state');
      expect(webglState).toHaveTextContent('enabled');
    });

    // Unmount and remount
    unmount();

    // Wait a bit to ensure cleanup
await new Promise(resolve => setTimeout(resolve, 100));
    
render(
    <div>
      <VisionProcessor autoProcess={false} showControls={false}>
        <TestComponent />
      </VisionProcessor>
    </div>
  );

    // New component should start with default state (disabled)
    const newWebglState = screen.getByTestId('webgl-state');
    expect(newWebglState).toHaveTextContent('disabled');
  });
}); 