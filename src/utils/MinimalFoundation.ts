// MinimalFoundation.ts
// Location: src/utils/MinimalFoundation.ts
// Purpose: Apply essential enhancement for camera foundation with content-aware processing
// Follows CLAUDE.md and project best practices

import { ContentAnalyzer } from './ContentAnalyzer';

export class MinimalFoundation {
  private contentAnalyzer: ContentAnalyzer;
  
  constructor() {
    this.contentAnalyzer = new ContentAnalyzer();
  }
  
  /**
   * Apply essential enhancement for camera foundation
   */
  applyEssentialEnhancement(element: HTMLElement): void {
    const contentType = this.contentAnalyzer.analyzeContentType(element);
    
    switch (contentType) {
      case 'text-heavy':
        this.applyTextEnhancement(element);
        break;
      case 'image-heavy':
        this.applyImagePreservation(element);
        break;
      case 'mixed-content':
        this.applyMixedContentEnhancement(element);
        break;
    }
    
    // Add presbyopia class for tracking
    element.classList.add('presbyopia-enhanced');
  }
  
  private applyTextEnhancement(element: HTMLElement): void {
    // Enhanced CSS for text-heavy content
    element.style.filter = 'contrast(1.6) brightness(1.12) drop-shadow(0 0 0.4px rgba(0,0,0,0.6))';
    
    // Typography optimization
    element.style.fontWeight = '500';
    element.style.letterSpacing = '0.025em';
    element.style.lineHeight = '1.5';
    
    // Text rendering optimization
    element.style.setProperty('-webkit-font-smoothing', 'antialiased');
    element.style.textRendering = 'optimizeLegibility';
  }
  
  private applyImagePreservation(element: HTMLElement): void {
    // Gentle enhancement that preserves image quality
    element.style.filter = 'contrast(1.5) brightness(1.1)';
    
    // No typography changes for image-heavy content
  }
  
  private applyMixedContentEnhancement(element: HTMLElement): void {
    // Apply selective enhancement to child elements
    this.applySelectiveChildEnhancement(element);
  }
  
  private applySelectiveChildEnhancement(element: HTMLElement): void {
    // Enhanced text elements, preserve images
    const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    
    textElements.forEach(textEl => {
      const htmlElement = textEl as HTMLElement;
      if (this.contentAnalyzer.isTextElement(htmlElement)) {
        this.applyTextEnhancement(htmlElement);
      }
    });
    
    // Ensure images maintain quality
    const imageElements = element.querySelectorAll('img, video, canvas, svg, picture');
    imageElements.forEach(imgEl => {
      const htmlElement = imgEl as HTMLElement;
      htmlElement.style.filter = 'none'; // Override any inherited filters
    });
  }
  
  /**
   * Remove enhancement from element
   */
  removeEnhancement(element: HTMLElement): void {
    element.style.filter = '';
    element.style.fontWeight = '';
    element.style.letterSpacing = '';
    element.style.lineHeight = '';
    element.style.setProperty('-webkit-font-smoothing', '');
    element.style.textRendering = '';
    element.classList.remove('presbyopia-enhanced');
  }
  
  /**
   * Check if element is currently enhanced
   */
  isEnhanced(element: HTMLElement): boolean {
    return element.classList.contains('presbyopia-enhanced');
  }
} 