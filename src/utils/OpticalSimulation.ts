// Optical Simulation utility for depth-of-field effects
// Purpose: Apply optical depth simulation to enhance visual perception
// Location: src/utils/OpticalSimulation.ts

export interface OpticalSimulationConfig {
  blurIntensity: number;
  depthCues: boolean;
  accommodationAssistance: boolean;
  contrastEnhancement: number;
}

export class OpticalSimulation {
  private config: OpticalSimulationConfig = {
    blurIntensity: 0.02, // Subtle depth effect
    depthCues: true,
    accommodationAssistance: true,
    contrastEnhancement: 1.05
  };

  public applyOpticalSimulation(elements: Element[]): number {
    let enhancedCount = 0;
    
    elements.forEach(el => {
      const element = el as HTMLElement;
      
      // Skip UI elements
      if (this.isUIElement(element)) {
        return;
      }
      
      try {
        // Apply depth-of-field simulation
        const currentFilter = element.style.filter;
        element.style.filter = currentFilter + ` blur(${this.config.blurIntensity}px)`;
        
        // Add accommodation assistance cues
        if (this.config.accommodationAssistance) {
          element.style.textShadow += ', 0 0 0.3px rgba(0,0,0,0.1)';
        }
        
        // Add depth cues
        if (this.config.depthCues) {
          element.style.boxShadow += ', 0 2px 4px rgba(0,0,0,0.1)';
        }
        
        // Mark as optically enhanced
        element.setAttribute('data-optical-simulation', 'true');
        element.classList.add('optical-simulation-enhanced');
        
        enhancedCount++;
      } catch (error) {
        console.error('❌ Error applying optical simulation to element:', error);
      }
    });
    
    return enhancedCount;
  }

  public removeOpticalSimulation(): number {
    const opticalElements = document.querySelectorAll('[data-optical-simulation="true"]');
    let removedCount = 0;
    
    opticalElements.forEach(el => {
      const element = el as HTMLElement;
      
      try {
        // Remove optical effects
        const currentFilter = element.style.filter;
        element.style.filter = currentFilter.replace(` blur(${this.config.blurIntensity}px)`, '');
        
        // Remove accommodation cues
        const currentTextShadow = element.style.textShadow;
        element.style.textShadow = currentTextShadow.replace(', 0 0 0.3px rgba(0,0,0,0.1)', '');
        
        // Remove depth cues
        const currentBoxShadow = element.style.boxShadow;
        element.style.boxShadow = currentBoxShadow.replace(', 0 2px 4px rgba(0,0,0,0.1)', '');
        
        // Remove markers
        element.removeAttribute('data-optical-simulation');
        element.classList.remove('optical-simulation-enhanced');
        
        removedCount++;
      } catch (error) {
        console.error('❌ Error removing optical simulation from element:', error);
      }
    });
    
    return removedCount;
  }

  private isUIElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    
    // Check for UI elements
    if (['button', 'input', 'select', 'textarea'].includes(tagName)) {
      return true;
    }
    
    // Check for button-like elements
    if (role === 'button' || 
        element.classList.contains('btn') || 
        element.classList.contains('button')) {
      return true;
    }
    
    // Check for UI containers
    const uiParent = element.closest('nav, header, footer, .navbar, .menu, [role="navigation"]');
    if (uiParent) {
      return true;
    }
    
    return false;
  }

  public getOpticalSimulationStatus(): {
    active: boolean;
    enhancedElements: number;
    effectiveness: string;
  } {
    const opticalElements = document.querySelectorAll('[data-optical-simulation="true"]');
    const isActive = opticalElements.length > 0;
    
    return {
      active: isActive,
      enhancedElements: opticalElements.length,
      effectiveness: isActive ? 'Optical depth simulation active' : 'No optical simulation'
    };
  }
}

export const opticalSimulation = new OpticalSimulation(); 